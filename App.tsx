import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { ViewState, Asset, EvidenceLevel, AssetType, CaseBlock, CaseStatus, CaseVisibility, Attachment } from './types';
import Sidebar from './components/Sidebar';
import AssetCard from './components/AssetCard';
import AssetModal from './components/AssetModal';
import { analyzeAsset, searchAssetsWithAI, searchCasesWithAI, generateCaseSemanticTags } from './services/geminiService';
import { saveAttachmentData, deleteAttachmentData, getAttachmentData } from './services/storageService';
import { supabase } from './services/supabase';
import { Plus, Brain, FileText, Image as ImageIcon, Loader2, ChevronLeft, Trash2, Type as TypeIcon, Search, LayoutGrid, List, RotateCcw, Clock, ChevronRight, Briefcase, X, AlertCircle, ExternalLink, Share2, Stethoscope, Activity, ArrowRight, Layers, Download, Home, BookOpen, Heading2, Eye, EyeOff, Globe, Lock, Link2 } from 'lucide-react';

const App: React.FC = () => {
  // Core State
  const [view, setView] = useState<ViewState>(ViewState.HOME);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(true);



  // UI State
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [pendingUpload, setPendingUpload] = useState<{ files: File[], base64s: string[] } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // AI & Behavior State
  const [aiSearchResults, setAiSearchResults] = useState<string[] | null>(null);
  const [isAiSearching, setIsAiSearching] = useState(false);
  const [dateFilter, setDateFilter] = useState<{ month: string; year: string }>({ month: '', year: '' });
  const [recentAccesses, setRecentAccesses] = useState<Asset[]>(() => {
    try {
      const stored = localStorage.getItem('lon_suite_recent');
      return stored ? JSON.parse(stored) : [];
    } catch { return []; }
  });

  // Case Editor State
  const [editingCase, setEditingCase] = useState<Asset | null>(null);
  const [activeBlockSlideIndices, setActiveBlockSlideIndices] = useState<Record<string, number>>({});
  const [fullscreenImg, setFullscreenImg] = useState<string | null>(null);
  const [focusBlockId, setFocusBlockId] = useState<string | null>(null);

  // Auto-save State
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Asset Picker State
  const [showAssetPicker, setShowAssetPicker] = useState(false);
  const [assetPickerSearch, setAssetPickerSearch] = useState('');

  // Upload Mode State
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadMode, setUploadMode] = useState<'single' | 'multiple' | 'group'>('single');

  // Confirmation Dialog State
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  } | null>(null);

  // Owner Identity (persisted in localStorage)
  const [ownerId] = useState<string>(() => {
    let id = localStorage.getItem('lon_suite_owner_id');
    if (!id) { id = crypto.randomUUID(); localStorage.setItem('lon_suite_owner_id', id); }
    return id;
  });
  const [ownerName, setOwnerName] = useState<string>(() => localStorage.getItem('lon_suite_owner_name') || '');
  const [showNamePrompt, setShowNamePrompt] = useState(!localStorage.getItem('lon_suite_owner_name'));
  const [nameInput, setNameInput] = useState('');

  // Homepage Search State
  const [homeSearchQuery, setHomeSearchQuery] = useState('');
  const [homeSearchResults, setHomeSearchResults] = useState<Asset[]>([]);
  const [homeSearchLoading, setHomeSearchLoading] = useState(false);
  const [homeHasSearched, setHomeHasSearched] = useState(false);
  const [viewingPublicCase, setViewingPublicCase] = useState<Asset | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const homeScrollRef = useRef<HTMLDivElement>(null);

  // Helper para auto-ajuste de altura em textareas
  const autoResizeTextarea = (element: HTMLTextAreaElement | null) => {
    if (element) {
      element.style.height = 'auto';
      element.style.height = element.scrollHeight + 'px';
    }
  };

  // Initial Load from Supabase
  useEffect(() => {
    const fetchInitialData = async () => {
      setIsRefreshing(true);
      try {
        const { data: assetsData, error: assetsError } = await supabase
          .from('assets')
          .select('*')
          .order('created_at', { ascending: false });

        const { data: casesData, error: casesError } = await supabase
          .from('cases')
          .select('*')
          .order('created_at', { ascending: false });

        if (assetsError || casesError) throw assetsError || casesError;

        // Map database schema back to app types
        const mappedAssets: Asset[] = [
          ...(assetsData || []).map(a => ({
            ...a,
            scientificContext: a.scientific_context,
            createdAt: a.created_at
          })),
          ...(casesData || []).map(c => ({
            ...c,
            type: 'case',
            caseStatus: c.status,
            visibility: c.visibility || 'private',
            ownerId: c.owner_id,
            ownerName: c.owner_name,
            accessCount: c.access_count || 0,
            sharedWith: c.shared_with || [],
            createdAt: c.created_at
          }))
        ];

        setAssets(mappedAssets);
      } catch (err) {
        console.error('Falha ao carregar dados do Supabase:', err);
        setAssets([]);
      } finally {
        setIsRefreshing(false);
      }
    };

    fetchInitialData();
  }, []);

  // Sync assets to cloud on change
  const syncToCloud = async (asset: Asset) => {
    try {
      if (asset.type === 'case') {
        await supabase.from('cases').upsert({
          id: asset.id,
          title: asset.title,
          description: asset.description,
          blocks: asset.blocks,
          tags: asset.tags,
          status: asset.caseStatus,
          visibility: asset.visibility || 'private',
          owner_id: asset.ownerId,
          owner_name: asset.ownerName,
          access_count: asset.accessCount || 0,
          shared_with: asset.sharedWith || [],
          created_at: asset.createdAt
        });
      } else {
        await supabase.from('assets').upsert({
          id: asset.id,
          title: asset.title,
          type: asset.type,
          content: asset.content,
          thumbnail: asset.thumbnail,
          summary: asset.summary,
          scientific_context: asset.scientificContext,
          tags: asset.tags,
          created_at: asset.createdAt
        });
      }
    } catch (err) {
      console.error('Erro de sincronização na nuvem:', err);
    }
  };

  // AI Search Debounce Effect
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchQuery.trim().length > 2) {
        setIsAiSearching(true);
        const results = await searchAssetsWithAI(searchQuery, assets.filter(a => !a.isDeleted && a.type !== 'case'));
        setAiSearchResults(results.length > 0 ? results : null);
        setIsAiSearching(false);
      } else {
        setAiSearchResults(null);
      }
    }, 800);
    return () => clearTimeout(timer);
  }, [searchQuery, assets]);

  // When an asset is clicked in the list, add to recent accesses
  const handleOpenAsset = (asset: Asset) => {
    setSelectedAsset(asset);
    setRecentAccesses(prev => {
      const newRecent = [asset, ...prev.filter(a => a.id !== asset.id)].slice(0, 10);
      localStorage.setItem('lon_suite_recent', JSON.stringify(newRecent));
      return newRecent;
    });
  };

  // Auto-focus on new block
  useEffect(() => {
    if (focusBlockId) {
      const element = document.getElementById(focusBlockId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        const input = element.querySelector('input, textarea') as HTMLInputElement | HTMLTextAreaElement;
        if (input) {
          setTimeout(() => input.focus(), 300);
        }
      }
      setFocusBlockId(null);
    }
  }, [focusBlockId]);

  // Auto-save effect with debounce
  useEffect(() => {
    if (!editingCase) {
      setSaveStatus('idle');
      return;
    }

    // Clear previous timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Set saving status immediately
    setSaveStatus('saving');

    // Debounce: save after 600ms of inactivity
    saveTimeoutRef.current = setTimeout(() => {
      // Persist the changes (already happening via syncCase -> setAssets -> localStorage useEffect)
      setSaveStatus('saved');

      // Reset to idle after 2 seconds
      setTimeout(() => {
        setSaveStatus('idle');
      }, 2000);
    }, 600);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [editingCase]);

  // Computed values
  const activeAssets = useMemo(() => assets.filter(a => !a.isDeleted), [assets]);
  const trashedAssets = useMemo(() => assets.filter(a => a.isDeleted), [assets]);

  // Date-filtered helpers
  const applyDateFilter = useCallback((items: Asset[]) => {
    if (!dateFilter.month && !dateFilter.year) return items;
    return items.filter(a => {
      const d = new Date(a.createdAt || a.date);
      if (dateFilter.year && d.getFullYear() !== parseInt(dateFilter.year)) return false;
      if (dateFilter.month && (d.getMonth() + 1) !== parseInt(dateFilter.month)) return false;
      return true;
    });
  }, [dateFilter]);

  // --- SEMANTIC SEARCH LOGIC FOR ASSETS ---
  const filteredAssets = useMemo(() => {
    const assetsOnly = applyDateFilter(activeAssets.filter(a => a.type !== 'case'));
    
    // IF AI search is active and returned results, filter by those IDs
    if (aiSearchResults !== null) {
      return assetsOnly.filter(a => aiSearchResults.includes(a.id))
        .sort((a, b) => aiSearchResults.indexOf(a.id) - aiSearchResults.indexOf(b.id));
    }
    
    // Otherwise fallback to simple text search
    if (!searchQuery.trim()) {
      return assetsOnly;
    }

    const query = searchQuery.toLowerCase().trim();
    return assetsOnly
      .filter(asset => {
        const title = (asset.title || '').toLowerCase();
        const tags = (asset.tags || []).map(t => t.toLowerCase());
        const matchesText = title.includes(query) || tags.some(t => t.includes(query));
        if (!matchesText) return false;
        return true;
      });
  }, [activeAssets, searchQuery, aiSearchResults, applyDateFilter]);

  // --- SEMANTIC SEARCH LOGIC FOR CASES ---
  const filteredCases = useMemo(() => {
    const casesOnly = applyDateFilter(activeAssets.filter(a => a.type === 'case'));
    if (!searchQuery.trim()) return casesOnly;

    const query = searchQuery.toLowerCase().trim();
    return casesOnly
      .map(c => {
        let score = 0;
        const title = (c.title || '').toLowerCase();
        const tags = (c.tags || []).map(t => t.toLowerCase());
        const blocksContent = (c.blocks || []).map(b => typeof b.content === 'string' ? b.content : '').join(' ').toLowerCase();

        if (title.includes(query)) score += 10;
        if (tags.some(t => t.includes(query))) score += 8;
        if (blocksContent.includes(query)) score += 5;

        return { caseItem: c, score };
      })
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .map(item => item.caseItem);
  }, [activeAssets, searchQuery, applyDateFilter]);

  // filteredCases already handles all case filtering

  // File Upload Handler
  const handleFilesSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    // Reset input so the same file can be selected again next time
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (files.length === 0) return;

    const promises = files.map((file: File) => new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const result = ev.target?.result;
        resolve(typeof result === 'string' ? result : '');
      };
      reader.readAsDataURL(file);
    }));
    const base64s = await Promise.all(promises);
    setPendingUpload({ files, base64s });
  };

  const processUpload = async (useAI: boolean) => {
    if (!pendingUpload) return;
    setIsProcessing(true);

    try {
      // GROUP MODE: Create single asset with attachments saved in IndexedDB
      if (uploadMode === 'group' && pendingUpload.files.length > 0) {
        const firstFile = pendingUpload.files[0];
        const firstBase64 = pendingUpload.base64s[0];

        let assetData = {
          title: pendingUpload.files.length > 1
            ? `Grupo de ${pendingUpload.files.length} arquivos`
            : firstFile.name.replace(/\.[^/.]+$/, ''),
          tags: ['Grupo'],
          summary: 'Coleção de arquivos agrupados.',
          scientificContext: 'Coleção criada no Lon Suite.',
          evidenceLevel: 'Baixo' as EvidenceLevel
        };

        if (useAI) {
          try {
            const analysis = await analyzeAsset(firstBase64.split(',')[1], firstFile.type, 'Medicina');
            assetData = {
              title: analysis.title || assetData.title,
              tags: Array.isArray(analysis.tags) ? analysis.tags : ['IA'],
              summary: analysis.summary || assetData.summary,
              scientificContext: analysis.scientificContext || assetData.scientificContext,
              evidenceLevel: analysis.evidenceLevel || 'Baixo'
            };
          } catch (e) {
            console.error('AI analysis failed for group:', e);
          }
        }

        // Create attachments metadata and save large data to Supabase Storage
        const attachments: Attachment[] = [];
        for (let i = 0; i < pendingUpload.files.length; i++) {
          const file = pendingUpload.files[i];
          const base64 = pendingUpload.base64s[i];
          const attId = crypto.randomUUID();

          // Save to Supabase Storage and get URL
          const publicUrl = await saveAttachmentData(attId, base64);

          attachments.push({
            id: attId,
            name: file.name,
            type: file.type,
            data: publicUrl, // Now data is the cloud URL
            size: file.size
          });
        }

        const assetType = firstFile.type.includes('pdf') ? 'pdf' : (firstFile.type.includes('powerpoint') || firstFile.type.includes('presentation') || firstFile.name.endsWith('.ppt') || firstFile.name.endsWith('.pptx')) ? 'document' : 'image';

        const groupAsset: Asset = {
          id: crypto.randomUUID(),
          ...assetData,
          type: assetType,
          date: new Date().toISOString(),
          thumbnail: attachments[0]?.data || firstBase64, // Use URL as thumbnail
          attachments,
          createdAt: new Date().toISOString()
        };

        setAssets(prev => [groupAsset, ...prev]);
        syncToCloud(groupAsset);
        setPendingUpload(null);
        setIsProcessing(false);
        return;
      }

      // INDIVIDUAL MODE: Each file becomes separate asset
      const newAssets: Asset[] = [];

      for (let i = 0; i < pendingUpload.files.length; i++) {
        const file = pendingUpload.files[i];
        const base64 = pendingUpload.base64s[i];

        let assetData = {
          title: file.name.replace(/\.[^/.]+$/, ''),
          tags: ['Manual'],
          summary: 'Indexado manualmente.',
          scientificContext: 'Anotação criada no Lon Suite.',
          evidenceLevel: 'Baixo' as EvidenceLevel
        };

        if (useAI) {
          try {
            const analysis = await analyzeAsset(base64.split(',')[1], file.type, 'Medicina');
            assetData = {
              title: analysis.title || assetData.title,
              tags: Array.isArray(analysis.tags) ? analysis.tags : ['IA'],
              summary: analysis.summary || assetData.summary,
              scientificContext: analysis.scientificContext || assetData.scientificContext,
              evidenceLevel: analysis.evidenceLevel || 'Baixo'
            };
          } catch (e) {
            console.error('AI analysis failed for individual file:', e);
          }
        }

        const assetType: AssetType = file.type.includes('pdf') ? 'pdf' : (file.type.includes('powerpoint') || file.type.includes('presentation') || file.name.endsWith('.ppt') || file.name.endsWith('.pptx')) ? 'document' : 'image';
        const assetId = crypto.randomUUID();

        // Save to Supabase Storage and get URL
        const publicUrl = await saveAttachmentData(assetId, base64);

        const newAsset: Asset = {
          id: assetId,
          ...assetData,
          type: assetType,
          date: new Date().toISOString(),
          thumbnail: publicUrl, // URL 
          content: publicUrl, // URL
          createdAt: new Date().toISOString()
        };

        newAssets.push(newAsset);
        await syncToCloud(newAsset);
      }

      setAssets(prev => [...newAssets, ...prev]);
    } catch (criticalError) {
      console.error('Critical error in processUpload:', criticalError);
      alert('Houve um erro crítico ao processar seus arquivos na nuvem.');
    } finally {
      setPendingUpload(null);
      setIsProcessing(false);
      setUploadMode('single');
    }
  };


  // Soft delete - move to trash
  const handleDeleteAsset = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    setAssets(prev => {
      const updated = prev.map(a =>
        a.id === id ? { ...a, isDeleted: true, deletedAt: new Date().toISOString() } : a
      );
      const asset = updated.find(a => a.id === id);
      if (asset) syncToCloud(asset);
      return updated;
    });

    if (selectedAsset?.id === id) setSelectedAsset(null);
  };


  // Permanent delete
  const handlePermanentDelete = async (id: string) => {
    try {
      const assetToRemove = assets.find(a => a.id === id);
      if (assetToRemove) {
        // Delete from Storage
        if (assetToRemove.attachments) {
          for (const att of assetToRemove.attachments) {
            await deleteAttachmentData(att.id);
          }
        }
        await deleteAttachmentData(id);

        // Delete from Database
        const table = assetToRemove.type === 'case' ? 'cases' : 'assets';
        await supabase.from(table).delete().eq('id', id);
      }
      setAssets(prev => prev.filter(a => a.id !== id));
    } catch (err) {
      console.error('Erro ao deletar permanente:', err);
    }
  };


  // Restore from trash
  const handleRestoreAsset = (id: string) => {
    setAssets(prev => {
      const updated = prev.map(a =>
        a.id === id ? { ...a, isDeleted: false, deletedAt: undefined } : a
      );
      const asset = updated.find(a => a.id === id);
      if (asset) syncToCloud(asset);
      return updated;
    });
  };


  // Empty trash
  const handleEmptyTrash = () => {
    setConfirmDialog({
      isOpen: true,
      title: 'Esvaziar Lixeira?',
      message: 'Esta ação não pode ser desfeita. Todos os itens da lixeira serão permanentemente removidos.',
      onConfirm: () => {
        setAssets(prev => prev.filter(a => !a.isDeleted));
      }
    });
  };

  const handleSaveAsset = (updatedAsset: Asset) => {
    setAssets(prev => prev.map(a => a.id === updatedAsset.id ? { ...updatedAsset, updatedAt: new Date().toISOString() } : a));
  };

  // Create New Case
  const handleCreateCase = () => {
    const titleBlockId = crypto.randomUUID();
    const now = new Date().toISOString();
    const newCase: Asset = {
      id: crypto.randomUUID(),
      title: '',
      type: 'case',
      tags: ['Caso'],
      date: now,
      caseStatus: 'em_andamento',
      visibility: 'private',
      ownerId: ownerId,
      ownerName: ownerName,
      accessCount: 0,
      blocks: [
        { id: titleBlockId, type: 'title', content: '' }
      ],
      createdAt: now,
      updatedAt: now
    };
    setAssets(prev => [newCase, ...prev]);
    setEditingCase(newCase);
    setFocusBlockId(titleBlockId);
  };

  // Case Editor Functions
  const syncCase = (updated: Asset) => {
    const withTimestamp = { ...updated, updatedAt: new Date().toISOString() };
    setEditingCase(withTimestamp);
    setAssets(prev => prev.map(a => a.id === updated.id ? withTimestamp : a));
    
    // Sync to Supabase
    syncToCloud(withTimestamp);
  };

  // Close editor and auto-generate semantic tags in background
  const handleCloseCase = () => {
    if (editingCase) {
      const caseToTag = { ...editingCase };
      setEditingCase(null);

      // Fire-and-forget: generate semantic tags
      const blocksText = (caseToTag.blocks || [])
        .filter(b => typeof b.content === 'string' && b.content.trim())
        .map(b => b.content)
        .join('\n');
      const title = caseToTag.title || '';

      if ((title + blocksText).length > 10) {
        generateCaseSemanticTags(title, blocksText).then(tags => {
          if (tags.length > 0) {
            const existingManual = (caseToTag.tags || []).filter(t => t === 'Caso');
            const merged = [...new Set([...existingManual, ...tags])];
            const updated = { ...caseToTag, tags: merged, updatedAt: new Date().toISOString() };
            setAssets(prev => prev.map(a => a.id === updated.id ? updated : a));
            syncToCloud(updated);
          }
        }).catch(() => { /* silent */ });
      }
    } else {
      setEditingCase(null);
    }
  };


  const addBlock = (type: 'title' | 'subtitle' | 'text' | 'reference' | 'image' | 'asset', assetId?: string) => {
    if (!editingCase) return;
    const newId = crypto.randomUUID();
    const newBlock: CaseBlock = { id: newId, type, content: '', assetId };
    const updated = { ...editingCase, blocks: [...(editingCase.blocks || []), newBlock] };
    syncCase(updated);
    if (type === 'asset') {
      setShowAssetPicker(false);
      setAssetPickerSearch('');
      setTimeout(() => {
        document.getElementById(newId)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    } else if (type !== 'image') {
      setFocusBlockId(newId);
    } else {
      setTimeout(() => {
        document.getElementById(newId)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    }
  };

  const handleCaseImgUpload = (blockId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach((file: File) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (!editingCase) return;
        const block = editingCase.blocks?.find(b => b.id === blockId);
        if (!block) return;
        let entries = block.content ? block.content.split('|||') : [];
        const result = ev.target?.result;
        const base64 = typeof result === 'string' ? result : '';
        entries.push(`${base64}###`);
        const newBlocks = editingCase.blocks?.map(b => b.id === blockId ? { ...b, content: entries.join('|||') } : b);
        syncCase({ ...editingCase, blocks: newBlocks });
        setActiveBlockSlideIndices(prev => ({ ...prev, [blockId]: entries.length - 1 }));
      };
      reader.readAsDataURL(file);
    });
  };

  // Get case preview text
  const getCasePreview = (caseItem: Asset) => {
    const textBlock = caseItem.blocks?.find(b => b.type === 'text');
    return textBlock?.content?.substring(0, 120) || 'Sem descrição...';
  };

  // Get case thumbnail
  const getCaseThumbnail = (caseItem: Asset) => {
    const imgBlock = caseItem.blocks?.find(b => b.type === 'image' && b.content);
    if (imgBlock) {
      const firstEntry = imgBlock.content.split('|||')[0];
      return firstEntry?.split('###')[0] || null;
    }
    return null;
  };

  // Format relative time
  const formatRelativeTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Agora';
    if (diffMins < 60) return `${diffMins}min`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}d`;
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
  };

  const handleDownloadCasePDF = async () => {
    if (!editingCase) return;
    const jsPDF = (await import('jspdf')).default;
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pageWidth = 210;
    const margin = 20;
    const contentWidth = pageWidth - margin * 2;
    let y = margin;

    const checkPage = (needed: number) => {
      if (y + needed > 280) { doc.addPage(); y = margin; }
    };

    // Title — left aligned
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.setTextColor(29, 29, 31);
    const titleLines = doc.splitTextToSize(editingCase.title || 'Caso Clínico', contentWidth);
    checkPage(titleLines.length * 9);
    doc.text(titleLines, margin, y, { align: 'left' });
    y += titleLines.length * 9 + 4;

    // Date & Status — left aligned
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(134, 134, 139);
    const status = editingCase.caseStatus === 'completo' ? 'Completo' : editingCase.caseStatus === 'arquivado' ? 'Arquivado' : 'Em Andamento';
    doc.text(`${status}  ·  ${new Date(editingCase.createdAt || editingCase.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}`, margin, y, { align: 'left' });
    y += 8;

    // Tags
    if (editingCase.tags && editingCase.tags.length > 0) {
      doc.setFontSize(8);
      doc.setTextColor(0, 113, 227);
      doc.text(editingCase.tags.join('  ·  '), margin, y, { align: 'left' });
      y += 8;
    }

    // Divider
    doc.setDrawColor(230, 230, 230);
    doc.line(margin, y, pageWidth - margin, y);
    y += 8;

    // Blocks
    const blocks = editingCase.blocks || [];
    for (const block of blocks) {
      if (block.type === 'title') {
        checkPage(12);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(16);
        doc.setTextColor(29, 29, 31);
        const lines = doc.splitTextToSize(block.content || '', contentWidth);
        doc.text(lines, margin, y, { align: 'left' });
        y += lines.length * 7 + 6;
      } else if (block.type === 'subtitle') {
        checkPage(10);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(14);
        doc.setTextColor(50, 50, 55);
        const lines = doc.splitTextToSize(block.content || '', contentWidth);
        doc.text(lines, margin, y, { align: 'left' });
        y += lines.length * 6 + 5;
      } else if (block.type === 'reference') {
        checkPage(10);
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(9);
        doc.setTextColor(134, 134, 139);
        const refText = block.content || '';
        const lines = doc.splitTextToSize(refText, contentWidth - 6);
        // Draw left border line
        doc.setDrawColor(200, 200, 200);
        doc.line(margin, y - 2, margin, y + lines.length * 4 + 2);
        doc.text(lines, margin + 6, y, { align: 'left' });
        y += lines.length * 4 + 6;
      } else if (block.type === 'text') {
        checkPage(10);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(11);
        doc.setTextColor(66, 66, 69);
        const lines = doc.splitTextToSize(block.content || '', contentWidth);
        doc.text(lines, margin, y, { align: 'justify', maxWidth: contentWidth });
        y += lines.length * 5.5 + 6;
      } else if (block.type === 'image' && block.content) {
        // Format: data:image/...###caption|||data:image/...###caption2
        const entries = block.content.split('|||').filter(Boolean);
        for (const entry of entries) {
          const [imgData, caption] = entry.split('###');
          
          let finalImgData = imgData;
          // Se for URL puro, converte em base64 localmente
          if (finalImgData && finalImgData.startsWith('http')) {
            try {
              const res = await fetch(finalImgData);
              const blob = await res.blob();
              finalImgData = await new Promise<string>((resolve) => {
                  const reader = new FileReader();
                  reader.onloadend = () => resolve(reader.result as string);
                  reader.readAsDataURL(blob);
              });
            } catch { /* ignore fetch errors safely */ }
          }

          // Render image
          if (finalImgData && finalImgData.startsWith('data:image')) {
            try {
              const imgProps = doc.getImageProperties(finalImgData);
              const imgWidth = contentWidth;
              const imgHeight = (imgProps.height / imgProps.width) * imgWidth;
              const clampedHeight = Math.min(imgHeight, 240);
              checkPage(clampedHeight + 20); // More margin for caption
              // Detect format dynamically to prevent PDF corruption
              const formatMatch = finalImgData.match(/^data:image\/(.*?);/);
              let format = formatMatch ? formatMatch[1].toUpperCase() : 'JPEG';
              if (format === 'SVG+XML') format = 'PNG'; // SVG fallback
              doc.addImage(finalImgData, format, margin, y, imgWidth, clampedHeight);
              y += clampedHeight + 12; // Extra gap before caption
            } catch { /* skip broken images */ }
          }
          
          // Render caption (legenda) — always after its image
          if (caption && caption.trim()) {
            doc.setFont('helvetica', 'italic');
            doc.setFontSize(9);
            doc.setTextColor(134, 134, 139);
            const captionLines = doc.splitTextToSize(caption.trim(), contentWidth);
            checkPage(captionLines.length * 4 + 4);
            doc.text(captionLines, margin, y, { align: 'justify', maxWidth: contentWidth });
            y += captionLines.length * 4 + 6;
          }
        }
      } else if (block.type === 'asset' && block.assetId) {
        const linkedAsset = activeAssets.find(a => a.id === block.assetId);
        if (linkedAsset) {
          // Draw a subtle box around asset reference
          checkPage(20);
          
          // Asset title with blue accent
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(12);
          doc.setTextColor(66, 133, 244);
          const assetTitle = `▸ ${linkedAsset.title}`;
          const assetTitleLines = doc.splitTextToSize(assetTitle, contentWidth);
          doc.text(assetTitleLines, margin, y, { align: 'left' });
          y += assetTitleLines.length * 5 + 3;

          // Tags
          if (linkedAsset.tags && linkedAsset.tags.length > 0) {
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(8);
            doc.setTextColor(134, 134, 139);
            const tagText = linkedAsset.tags.join(' · ');
            doc.text(tagText, margin, y);
            y += 5;
          }

          // Thumbnail image if available
          if (linkedAsset.thumbnail && linkedAsset.thumbnail.startsWith('data:image')) {
            try {
              const imgProps = doc.getImageProperties(linkedAsset.thumbnail);
              const imgWidth = Math.min(contentWidth, 140);
              const imgHeight = (imgProps.height / imgProps.width) * imgWidth;
              const clampedH = Math.min(imgHeight, 180);
              checkPage(clampedH + 12);
              const formatMatch = linkedAsset.thumbnail.match(/^data:image\/(.*?);/);
              let format = formatMatch ? formatMatch[1].toUpperCase() : 'JPEG';
              if (format === 'SVG+XML') format = 'PNG';
              doc.addImage(linkedAsset.thumbnail, format, margin + (contentWidth - imgWidth) / 2, y, imgWidth, clampedH);
              y += clampedH + 8;
            } catch { /* skip broken images */ }
          } else if (linkedAsset.thumbnail && linkedAsset.thumbnail.startsWith('http')) {
            // URL-based thumbnail - show as link reference
            doc.setFont('helvetica', 'italic');
            doc.setFontSize(8);
            doc.setTextColor(66, 133, 244);
            doc.textWithLink('[Ver imagem do ativo]', margin, y, { url: linkedAsset.thumbnail });
            y += 6;
          }

          // Summary/Description
          if (linkedAsset.summary || linkedAsset.scientificContext) {
            checkPage(10);
            doc.setFont('helvetica', 'italic');
            doc.setFontSize(10);
            doc.setTextColor(100, 100, 105);
            const refText = linkedAsset.summary || linkedAsset.scientificContext || '';
            const summaryLines = doc.splitTextToSize(`"${refText}"`, contentWidth);
            doc.text(summaryLines, margin, y, { align: 'justify', maxWidth: contentWidth });
            y += summaryLines.length * 4.5 + 4;
          }

          // Scientific Context (if different from summary)
          if (linkedAsset.scientificContext && linkedAsset.summary && linkedAsset.scientificContext !== linkedAsset.summary) {
            checkPage(10);
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(9);
            doc.setTextColor(120, 120, 125);
            const ctxLines = doc.splitTextToSize(linkedAsset.scientificContext, contentWidth);
            doc.text(ctxLines, margin, y, { align: 'justify', maxWidth: contentWidth });
            y += ctxLines.length * 4 + 4;
          }

          y += 6; // Extra spacing after asset block
        }
      }
    }

    // Footer
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(174, 174, 178);
      doc.text(`Lon Suite · ${editingCase.title} · Página ${i}/${pageCount}`, margin, 290, { align: 'left' });
    }

    const safeTitle = (editingCase.title || 'Caso_Clinico').replace(/[\s/?*><|:"\\]+/g, '_');
    doc.save(`${safeTitle}.pdf`);
  };

  const renderCaseEditor = () => {
    if (!editingCase) return null;

    const caseBlocks = editingCase.blocks || [];
    const imageCount = caseBlocks.filter(b => b.type === 'image' && b.content).length;
    const textCount = caseBlocks.filter(b => b.type === 'text').length;
    const assetCount = caseBlocks.filter(b => b.type === 'asset').length;

    const statusOptions: { value: CaseStatus; label: string; dot: string }[] = [
      { value: 'em_andamento', label: 'Em Andamento', dot: 'bg-blue-500' },
      { value: 'completo', label: 'Completo', dot: 'bg-emerald-500' },
      { value: 'arquivado', label: 'Arquivado', dot: 'bg-slate-400' },
    ];

    return (
      <div className="w-full h-screen flex flex-col md:flex-row overflow-hidden bg-white">
        {/* Main Editor */}
        <div className="flex-1 overflow-y-auto no-scrollbar pb-40 md:pb-60">
          <div className="max-w-[1000px] mx-auto pt-6 md:pt-16 px-4 sm:px-6 md:px-8">
            <button onClick={() => handleCloseCase()} className="mb-4 md:mb-12 flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-all text-[10px] font-bold uppercase tracking-[0.3em] group">
              <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Voltar aos Cases
            </button>

            {/* Mobile Action Bar — visible only when sidebar is hidden */}
            <div className="flex lg:hidden items-center gap-2 mb-6 flex-wrap">
              <select
                value={editingCase.caseStatus || 'em_andamento'}
                onChange={e => syncCase({ ...editingCase, caseStatus: e.target.value as CaseStatus })}
                className="px-3 py-2 bg-white border border-black/8 rounded-apple text-[11px] font-medium text-[#1d1d1f] shadow-apple outline-none"
              >
                <option value="em_andamento">Em Andamento</option>
                <option value="completo">Completo</option>
                <option value="arquivado">Arquivado</option>
              </select>
              <button
                onClick={() => {
                  const shareUrl = `${window.location.origin}?share=${editingCase.id}&type=case`;
                  navigator.clipboard.writeText(shareUrl);
                  alert('Link do caso copiado!');
                }}
                className="flex items-center gap-1.5 px-3 py-2 bg-white border border-black/8 rounded-apple text-[11px] font-medium text-[#4285F4] shadow-apple"
              >
                <Share2 size={12} /> Compartilhar
              </button>
              <button
                onClick={handleDownloadCasePDF}
                className="flex items-center gap-1.5 px-3 py-2 bg-[#1d1d1f] rounded-apple text-[11px] font-semibold text-white shadow-apple"
              >
                <Download size={12} /> PDF
              </button>
            </div>

          <div className="space-y-8">
            {editingCase.blocks?.map((block, index) => (
              <div id={block.id} key={block.id} className="group relative animate-fade-in">
                {block.type === 'title' ? (
                  <input
                    value={block.content}
                    onChange={e => {
                      const nb = editingCase.blocks?.map(b => b.id === block.id ? { ...b, content: e.target.value } : b);
                      const newTitle = index === 0 ? e.target.value : editingCase.title;
                      syncCase({ ...editingCase, blocks: nb, title: newTitle || 'Novo Caso Clínico' });
                    }}
                    placeholder="Digite o título do caso..."
                    className="w-full bg-transparent text-3xl md:text-5xl font-extralight tracking-tight text-slate-900 outline-none placeholder:text-slate-200 transition-colors focus:placeholder:text-slate-300"
                  />
                ) : block.type === 'subtitle' ? (
                  <input
                    value={block.content}
                    onChange={e => {
                      const nb = editingCase.blocks?.map(b => b.id === block.id ? { ...b, content: e.target.value } : b);
                      syncCase({ ...editingCase, blocks: nb });
                    }}
                    placeholder="Subtítulo da seção..."
                    className="w-full bg-transparent text-xl md:text-2xl font-semibold tracking-tight text-slate-800 outline-none placeholder:text-slate-200 transition-colors focus:placeholder:text-slate-300"
                  />
                ) : block.type === 'reference' ? (
                  <div className="border-l-2 border-slate-200 pl-5 py-2">
                    <div className="flex items-center gap-2 mb-2">
                      <BookOpen size={14} className="text-slate-400" />
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Referência Bibliográfica</span>
                    </div>
                    <textarea
                      ref={(el) => autoResizeTextarea(el)}
                      value={block.content}
                      onChange={e => {
                        const nb = editingCase.blocks?.map(b => b.id === block.id ? { ...b, content: e.target.value } : b);
                        syncCase({ ...editingCase, blocks: nb });
                      }}
                      onInput={(e: any) => { e.target.style.height = 'auto'; e.target.style.height = e.target.scrollHeight + 'px'; }}
                      placeholder="Ex: SMITH, J. et al. Título do artigo. Revista, v.1, p.1-10, 2024. https://doi.org/..."
                      className="w-full bg-transparent text-sm md:text-base italic font-light leading-relaxed text-slate-500 outline-none resize-none placeholder:text-slate-200 overflow-hidden transition-colors focus:placeholder:text-slate-300"
                      rows={1}
                    />
                    {/* Render detected links below */}
                    {block.content && (() => {
                      const urlRegex = /(https?:\/\/[^\s]+)/g;
                      const urls = block.content.match(urlRegex);
                      if (!urls || urls.length === 0) return null;
                      return (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {urls.map((url, i) => (
                            <a key={i} href={url} target="_blank" rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-[10px] font-medium text-[#4285F4] hover:underline">
                              <Link2 size={10} />{url.length > 50 ? url.substring(0, 50) + '...' : url}
                            </a>
                          ))}
                        </div>
                      );
                    })()}
                  </div>
                ) : block.type === 'text' ? (
                  <textarea
                    ref={(el) => autoResizeTextarea(el)}
                    value={block.content}
                    onChange={e => {
                      const nb = editingCase.blocks?.map(b => b.id === block.id ? { ...b, content: e.target.value } : b);
                      syncCase({ ...editingCase, blocks: nb });
                    }}
                    onInput={(e: any) => { e.target.style.height = 'auto'; e.target.style.height = e.target.scrollHeight + 'px'; }}
                    placeholder="Comece a escrever a narrativa clínica..."
                    className="w-full bg-transparent text-base md:text-xl font-light leading-relaxed text-justify text-slate-600 outline-none resize-none placeholder:text-slate-200 overflow-hidden transition-colors focus:placeholder:text-slate-300"
                    rows={1}
                  />
                ) : block.type === 'asset' ? (() => {
                  const linkedAsset = activeAssets.find(a => a.id === block.assetId);
                  if (!linkedAsset) return (
                    <div className="bg-red-50 border border-red-100 rounded-2xl p-6 text-center text-red-400">
                      <FileText size={32} className="mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Ativo não encontrado</p>
                    </div>
                  );
                  return (
                    <div className="bg-gradient-to-br from-blue-50 to-slate-50 rounded-[32px] p-8 border border-blue-100 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex flex-col lg:flex-row gap-8">
                        {/* Asset Preview */}
                        <div className="w-full lg:w-64 shrink-0">
                          <div className="aspect-square bg-white rounded-2xl overflow-hidden shadow-inner border border-slate-100 flex items-center justify-center cursor-pointer hover:scale-[1.02] transition-transform" onClick={() => setSelectedAsset(linkedAsset)}>
                            {linkedAsset.thumbnail ? (
                              linkedAsset.type === 'pdf' ? (
                                <div className="w-full h-full bg-gradient-to-br from-red-50 to-red-100 flex flex-col items-center justify-center p-4">
                                  <FileText size={48} className="text-red-400 mb-2" />
                                  <span className="text-[10px] font-bold text-red-400/80 uppercase tracking-wider">PDF</span>
                                </div>
                              ) : (
                                <img src={linkedAsset.thumbnail} className="w-full h-full object-cover" />
                              )
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-200">
                                <FileText size={48} />
                              </div>
                            )}
                          </div>
                          <div className="mt-4 text-center">
                            <h4 className="text-sm font-semibold text-slate-800 line-clamp-2">{linkedAsset.title}</h4>
                            <p className="text-[10px] text-slate-400 uppercase tracking-wider mt-1">{linkedAsset.type}</p>
                            <button
                              onClick={() => handleOpenAsset(linkedAsset)}
                              className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 bg-blue-500 text-white rounded-full text-[10px] font-bold uppercase tracking-wider hover:bg-blue-600 transition-all"
                            >
                              <ExternalLink size={12} /> Ver Completo
                            </button>
                          </div>
                        </div>

                        {/* Comment Section */}
                        <div className="flex-1 pt-2 flex flex-col">
                          <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest block mb-4">Comentário sobre o Ativo</span>
                          <textarea
                            ref={(el) => autoResizeTextarea(el)}
                            value={block.content}
                            onChange={e => {
                              const nb = editingCase.blocks?.map(b => b.id === block.id ? { ...b, content: e.target.value } : b);
                              syncCase({ ...editingCase, blocks: nb });
                            }}
                            onInput={(e: any) => { e.target.style.height = 'auto'; e.target.style.height = e.target.scrollHeight + 'px'; }}
                            placeholder="Descreva a relevância deste ativo para o caso clínico..."
                            className="w-full bg-white/50 backdrop-blur border border-blue-100 rounded-xl p-4 text-lg text-justify text-slate-500 font-light leading-relaxed outline-none resize-none placeholder:text-slate-300 overflow-hidden focus:border-blue-200"
                            rows={3}
                          />
                          {linkedAsset.summary && (
                            <div className="mt-4 p-4 bg-white/70 rounded-xl border border-slate-100">
                              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Resumo do Ativo</span>
                              <p className="text-sm text-slate-500 leading-relaxed">{linkedAsset.summary}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })() : (
                  <div className="bg-gradient-to-br from-slate-50 to-slate-100/50 rounded-2xl md:rounded-[32px] p-4 md:p-8 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex flex-col gap-4 md:gap-10 lg:flex-row">
                      <div className="flex-1 min-h-0">
                        <div className="aspect-video bg-white rounded-2xl overflow-hidden relative shadow-inner border border-slate-100 flex items-center justify-center">
                          {(block.content.split('|||')[activeBlockSlideIndices[block.id] || 0] || "###").split('###')[0] ? (
                            <img
                              src={(block.content.split('|||')[activeBlockSlideIndices[block.id] || 0] || "###").split('###')[0]}
                              className="max-w-full max-h-full object-contain p-4 cursor-pointer hover:scale-[1.02] transition-transform"
                              onClick={() => setFullscreenImg((block.content.split('|||')[activeBlockSlideIndices[block.id] || 0] || "###").split('###')[0])}
                            />
                          ) : (
                            <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer text-slate-300 hover:text-slate-500 transition-all group/upload">
                              <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center mb-4 group-hover/upload:bg-slate-100 transition-colors">
                                <ImageIcon size={28} strokeWidth={1} />
                              </div>
                              <span className="text-[10px] font-bold uppercase tracking-widest">Anexar Evidência</span>
                              <input type="file" multiple accept="image/*" className="hidden" onChange={e => handleCaseImgUpload(block.id, e)} />
                            </label>
                          )}
                        </div>
                        {block.content && (
                          <div className="flex gap-2 mt-4 overflow-x-auto no-scrollbar shrink-0 pb-2">
                            {block.content.split('|||').filter(Boolean).map((ent, idx) => (
                              <div key={idx} onClick={() => setActiveBlockSlideIndices(p => ({ ...p, [block.id]: idx }))} className={`w-14 h-14 rounded-xl overflow-hidden cursor-pointer border-2 transition-all flex items-center justify-center bg-white hover:scale-105 ${activeBlockSlideIndices[block.id] === idx || (!activeBlockSlideIndices[block.id] && idx === 0) ? 'border-slate-900 shadow-md' : 'border-transparent opacity-40 hover:opacity-70'}`}>
                                <img src={ent.split('###')[0]} className="max-w-full max-h-full object-contain p-1" />
                              </div>
                            ))}
                            <label className="w-14 h-14 rounded-xl bg-white flex items-center justify-center text-slate-300 cursor-pointer border-2 border-dashed border-slate-200 hover:border-slate-400 hover:text-slate-400 transition-all shrink-0 hover:scale-105"><Plus size={16} /><input type="file" multiple accept="image/*" className="hidden" onChange={e => handleCaseImgUpload(block.id, e)} /></label>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 pt-2 flex flex-col overflow-hidden">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-4">Lastro Científico</span>
                        <textarea
                          ref={(el) => autoResizeTextarea(el)}
                          value={(block.content.split('|||')[activeBlockSlideIndices[block.id] || 0] || "###").split('###')[1] || ''}
                          onChange={e => {
                            let entries = block.content.split('|||').filter(Boolean);
                            if (entries.length === 0) entries = ['###'];
                            const currentIndex = activeBlockSlideIndices[block.id] || 0;
                            let [data] = (entries[currentIndex] || "###").split('###');
                            entries[currentIndex] = `${data}###${e.target.value}`;
                            const nb = editingCase.blocks?.map(b => b.id === block.id ? { ...b, content: entries.join('|||') } : b);
                            syncCase({ ...editingCase, blocks: nb });
                          }}
                          onInput={(e: any) => { e.target.style.height = 'auto'; e.target.style.height = e.target.scrollHeight + 'px'; }}
                          placeholder="Descreva a evidência científica desta imagem..."
                          className="w-full bg-transparent text-base md:text-lg text-justify text-slate-500 font-light leading-relaxed outline-none resize-none placeholder:text-slate-200 overflow-hidden"
                          rows={3}
                        />
                      </div>
                    </div>
                  </div>
                )}
                <button onClick={() => {
                  const nb = editingCase.blocks?.filter(b => b.id !== block.id);
                  syncCase({ ...editingCase, blocks: nb });
                }} className="absolute top-2 right-2 md:top-2 md:-right-14 p-2 md:p-2.5 text-slate-200 hover:text-red-500 hover:bg-red-50 rounded-xl opacity-100 md:opacity-0 group-hover:opacity-100 transition-all z-10"><Trash2 size={16} /></button>
              </div>
            ))}
          </div>

          {/* Floating toolbar */}
          <div className="fixed bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 md:gap-4 bg-white px-4 md:px-6 py-3 md:py-4 rounded-full shadow-2xl border border-slate-100 z-[9999] max-w-[95vw]">
            {/* Auto-save indicator */}
            <div className="hidden sm:flex w-32 items-center justify-center">
              {saveStatus === 'saving' && (
                <div className="flex items-center gap-2 text-slate-400 animate-fade-in">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse"></div>
                  <span className="text-[9px] font-medium uppercase tracking-widest">Salvando...</span>
                </div>
              )}
              {saveStatus === 'saved' && (
                <div className="flex items-center gap-2 text-green-500 animate-fade-in">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                  <span className="text-[9px] font-semibold uppercase tracking-widest">Salvo</span>
                </div>
              )}
            </div>

            <button onClick={() => addBlock('title')} className="p-3 md:p-4 hover:bg-slate-100 rounded-full text-slate-500 hover:text-slate-900 transition-all" title="Adicionar título">
              <TypeIcon size={18} />
            </button>
            <button onClick={() => addBlock('subtitle')} className="p-3 md:p-4 hover:bg-slate-100 rounded-full text-slate-500 hover:text-slate-900 transition-all" title="Adicionar subtítulo (H2)">
              <Heading2 size={18} />
            </button>
            <button onClick={() => addBlock('text')} className="p-3 md:p-4 hover:bg-slate-100 rounded-full text-slate-500 hover:text-slate-900 transition-all" title="Adicionar texto">
              <FileText size={18} />
            </button>
            <button onClick={() => addBlock('image')} className="p-3 md:p-4 hover:bg-slate-100 rounded-full text-slate-500 hover:text-slate-900 transition-all" title="Adicionar evidência">
              <ImageIcon size={18} />
            </button>
            <button onClick={() => setShowAssetPicker(true)} className="p-3 md:p-4 hover:bg-blue-50 rounded-full text-blue-500 hover:text-blue-700 transition-all" title="Adicionar ativo">
              <LayoutGrid size={18} />
            </button>
            <button onClick={() => addBlock('reference')} className="p-3 md:p-4 hover:bg-amber-50 rounded-full text-amber-600 hover:text-amber-800 transition-all" title="Referência bibliográfica">
              <BookOpen size={18} />
            </button>
            <div className="w-px h-6 md:h-8 bg-slate-200 mx-1 md:mx-2"></div>

            <button onClick={() => handleCloseCase()} className="hidden sm:block px-6 py-3 bg-slate-100 text-slate-600 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-slate-200 transition-all" title="Fechar editor">
              Fechar
            </button>
          </div>

          {/* Asset Picker Modal */}
          {showAssetPicker && (
            <div className="fixed inset-0 z-[200] bg-black/30 backdrop-blur-sm flex items-end sm:items-center justify-center animate-fade-in" onClick={() => setShowAssetPicker(false)}>
              <div className="bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl w-full sm:max-w-2xl max-h-[90vh] sm:max-h-[80vh] overflow-hidden" onClick={e => e.stopPropagation()}>
                <div className="p-6 border-b border-slate-100">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-slate-900">Selecionar Ativo</h3>
                    <button onClick={() => setShowAssetPicker(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors">
                      <X size={20} />
                    </button>
                  </div>
                  <div className="relative">
                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                    <input
                      type="text"
                      placeholder="Buscar ativos..."
                      value={assetPickerSearch}
                      onChange={(e) => setAssetPickerSearch(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none focus:border-slate-300 focus:shadow-sm transition-all placeholder:text-slate-300"
                      autoFocus
                    />
                  </div>
                </div>
                <div className="p-4 sm:p-6 overflow-y-auto max-h-[50vh] grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                  {activeAssets
                    .filter(a => a.type !== 'case' && typeof a.title === 'string' && a.title.toLowerCase().includes(assetPickerSearch.toLowerCase()))
                    .map(asset => (
                      <div
                        key={asset.id}
                        onClick={() => addBlock('asset', asset.id)}
                        className="group cursor-pointer bg-slate-50 rounded-2xl overflow-hidden border border-slate-100 hover:border-blue-300 hover:shadow-lg transition-all"
                      >
                        <div className="aspect-square bg-white overflow-hidden">
                          {asset.thumbnail ? (
                            <img src={asset.thumbnail} alt={asset.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-200">
                              <FileText size={32} />
                            </div>
                          )}
                        </div>
                        <div className="p-3">
                          <p className="text-xs font-medium text-slate-700 truncate">{asset.title}</p>
                          <p className="text-[10px] text-slate-400 uppercase tracking-wider mt-1">{asset.type}</p>
                        </div>
                      </div>
                    ))}
                  {activeAssets.filter(a => a.type !== 'case' && typeof a.title === 'string' && a.title.toLowerCase().includes(assetPickerSearch.toLowerCase())).length === 0 && (
                    <div className="col-span-2 sm:col-span-3 py-12 text-center text-slate-300">
                      <LayoutGrid size={32} className="mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Nenhum ativo encontrado</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
        </div>

        {/* Metadata Sidebar — Mobile: drawer at bottom; Desktop: side panel */}
        <div className="hidden lg:flex w-[280px] shrink-0 border-l border-black/5 bg-[#fafafa] flex-col overflow-y-auto custom-scrollbar">
          <div className="p-5 space-y-5">
            <div>
              <h3 className="text-[10px] font-bold text-[#86868b] uppercase tracking-widest mb-3">Status</h3>
              <div className="space-y-1.5">
                {statusOptions.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => syncCase({ ...editingCase, caseStatus: opt.value })}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-apple-lg text-[12px] font-medium transition-all ${
                      (editingCase.caseStatus || 'em_andamento') === opt.value
                        ? 'bg-white shadow-apple border border-black/6 text-[#1d1d1f]'
                        : 'text-[#86868b] hover:bg-white/80 hover:text-[#1d1d1f]'
                    }`}
                  >
                    <div className={`w-2 h-2 rounded-full ${opt.dot}`} />
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="divider" />

            <div>
              <h3 className="text-[10px] font-bold text-[#86868b] uppercase tracking-widest mb-3">Composição</h3>
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-white rounded-apple border border-black/6 p-3 text-center shadow-apple">
                  <p className="text-lg font-light text-[#1d1d1f]">{imageCount}</p>
                  <p className="text-[8px] font-bold text-[#86868b] uppercase tracking-widest">Imagens</p>
                </div>
                <div className="bg-white rounded-apple border border-black/6 p-3 text-center shadow-apple">
                  <p className="text-lg font-light text-[#1d1d1f]">{textCount}</p>
                  <p className="text-[8px] font-bold text-[#86868b] uppercase tracking-widest">Textos</p>
                </div>
                <div className="bg-white rounded-apple border border-black/6 p-3 text-center shadow-apple">
                  <p className="text-lg font-light text-[#1d1d1f]">{assetCount}</p>
                  <p className="text-[8px] font-bold text-[#86868b] uppercase tracking-widest">Ativos</p>
                </div>
              </div>
            </div>

            <div className="divider" />

            <div>
              <h3 className="text-[10px] font-bold text-[#86868b] uppercase tracking-widest mb-3">Visibilidade</h3>
              <div className="space-y-1.5">
                {([
                  { value: 'private' as CaseVisibility, label: 'Privado', desc: 'Só você', icon: Lock, color: 'bg-slate-500' },
                  { value: 'public' as CaseVisibility, label: 'Público', desc: 'Todos da plataforma', icon: Globe, color: 'bg-emerald-500' },
                ]).map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => syncCase({ ...editingCase, visibility: opt.value })}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-apple-lg text-[12px] font-medium transition-all ${
                      (editingCase.visibility || 'private') === opt.value
                        ? 'bg-white shadow-apple border border-black/6 text-[#1d1d1f]'
                        : 'text-[#86868b] hover:bg-white/80 hover:text-[#1d1d1f]'
                    }`}
                  >
                    <div className={`w-2 h-2 rounded-full ${opt.color}`} />
                    <div className="flex-1 text-left">
                      <span>{opt.label}</span>
                      <span className="text-[9px] text-[#aeaeb2] ml-1.5">· {opt.desc}</span>
                    </div>
                    <opt.icon size={12} className="text-[#aeaeb2]" />
                  </button>
                ))}
              </div>
            </div>

            <div className="divider" />

            <div className="space-y-2.5">
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-[#86868b] font-medium">Criado em</span>
                <span className="text-[10px] text-[#1d1d1f] font-medium">
                  {new Date(editingCase.createdAt || editingCase.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-[#86868b] font-medium">Atualizado</span>
                <span className="text-[10px] text-[#1d1d1f] font-medium">
                  {formatRelativeTime(editingCase.updatedAt || editingCase.createdAt || editingCase.date)}
                </span>
              </div>
            </div>

            <div className="divider" />

            <button
              onClick={() => {
                const shareUrl = `${window.location.origin}?share=${editingCase.id}&type=case`;
                navigator.clipboard.writeText(shareUrl);
                alert('Link do caso copiado!');
              }}
              className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-apple-lg text-[11px] font-semibold bg-white border border-black/6 text-[#4285F4] hover:bg-blue-50 shadow-apple transition-all"
            >
              <Share2 size={12} />
              Compartilhar
            </button>

            <button
              onClick={handleDownloadCasePDF}
              className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-apple-lg text-[11px] font-semibold bg-[#1d1d1f] text-white hover:bg-[#333] shadow-apple transition-all"
            >
              <Download size={12} />
              Baixar PDF
            </button>
          </div>
        </div>
      </div>
    );
  };



  const openConfirmDialog = (opts: { title: string; message: string; onConfirm: () => void }) => {
    setConfirmDialog({ isOpen: true, ...opts });
  };

  // Share Page Routing
  const searchParams = new URLSearchParams(window.location.search);
  const shareId = searchParams.get('share');
  
  if (shareId) {
    const sharedAsset = assets.find(a => a.id === shareId);
    if (!sharedAsset) {
      return (
        <div className="min-h-screen bg-[#f5f5f7] flex items-center justify-center p-4">
          <div className="bg-white p-10 rounded-apple-xl shadow-apple-md text-center">
            <h1 className="text-xl font-bold text-slate-900 mb-2">Ativo Não Encontrado</h1>
            <p className="text-slate-500">O link pode ter expirado ou estar incorreto.</p>
          </div>
        </div>
      );
    }

    // Check visibility for cases
    if (sharedAsset.type === 'case' && sharedAsset.visibility === 'private' && sharedAsset.ownerId !== ownerId) {
      return (
        <div className="min-h-screen bg-[#f5f5f7] flex items-center justify-center p-4">
          <div className="bg-white p-10 rounded-apple-xl shadow-apple-md text-center">
            <Lock size={32} className="mx-auto mb-3 text-[#86868b]" />
            <h1 className="text-xl font-bold text-slate-900 mb-2">Case Privado</h1>
            <p className="text-slate-500">Este case é privado e não pode ser acessado.</p>
          </div>
        </div>
      );
    }
    
    // Simplistic Public Share View
    return (
      <div className="min-h-screen bg-[#f5f5f7] flex flex-col items-center py-10 px-4 animate-fade-in">
        <div className="w-full max-w-4xl bg-white rounded-apple-2xl shadow-apple-xl overflow-hidden min-h-[80vh]">
          <div className="p-8 border-b border-black/6 bg-white sticky top-0 z-10 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-semibold text-[#1d1d1f] tracking-tight">{sharedAsset.title || 'Sem título'}</h1>
              <p className="text-xs font-semibold uppercase tracking-widest text-[#86868b] mt-2">{sharedAsset.type}</p>
            </div>
            <div className="px-4 py-2 bg-[#f5f5f7] text-[#86868b] text-[10px] font-bold uppercase tracking-widest rounded-full">
              Lon Suite Share
            </div>
          </div>
          <div className="p-10">
            {sharedAsset.type === 'case' && sharedAsset.blocks ? (
               <div className="space-y-8 max-w-2xl mx-auto">
                 {sharedAsset.blocks.map(block => (
                   <div key={block.id}>
                     {block.type === 'title' && <h2 className="text-2xl font-bold mb-2 text-[#1d1d1f]">{block.content}</h2>}
                     {block.type === 'subtitle' && <h3 className="text-xl font-semibold mb-2 text-[#424245]">{block.content}</h3>}
                     {block.type === 'text' && <p className="text-lg font-light leading-relaxed text-[#424245] whitespace-pre-wrap">{block.content}</p>}
                     {block.type === 'reference' && (
                       <div className="border-l-2 border-slate-200 pl-5 py-2">
                         <p className="text-sm italic font-light text-[#86868b]">
                           {block.content.split(/(https?:\/\/[^\s]+)/g).map((part, i) =>
                             /^https?:\/\//.test(part)
                               ? <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="text-[#4285F4] hover:underline">{part}</a>
                               : part
                           )}
                         </p>
                       </div>
                     )}
                     {block.type === 'image' && block.content && (
                       <div className="my-6">
                         <img src={(block.content.split('|||')[0] || "###").split('###')[0]} className="w-full rounded-apple-lg border border-black/6 shadow-sm bg-[#f5f5f7] object-contain max-h-[60vh]" />
                         {block.content.split('###')[1] && <p className="text-sm text-[#86868b] mt-3 italic text-center text-pretty">{block.content.split('###')[1]}</p>}
                       </div>
                     )}
                   </div>
                 ))}
               </div>
            ) : (
               <div className="flex flex-col gap-8 items-center max-w-2xl mx-auto">
                 {sharedAsset.thumbnail && <img src={sharedAsset.thumbnail} className="max-h-[60vh] object-contain rounded-apple-lg border border-black/6 shadow-sm bg-[#f5f5f7] w-full" />}
                 <div className="w-full space-y-6">
                   {sharedAsset.tags && sharedAsset.tags.length > 0 && (
                     <div className="flex flex-wrap gap-2 justify-center">
                       {sharedAsset.tags.filter(t => typeof t === 'string').map((t, i) => (
                         <span key={i} className="px-3 py-1 bg-[#1d1d1f] text-white text-[11px] font-medium rounded-full">{t}</span>
                       ))}
                     </div>
                   )}
                   {sharedAsset.summary && (
                     <div className="bg-[#f5f5f7] p-6 rounded-apple-xl">
                       <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#86868b] mb-3">Resumo</h3>
                       <p className="text-base text-[#424245] leading-relaxed">{sharedAsset.summary}</p>
                     </div>
                   )}
                   {sharedAsset.scientificContext && (
                     <div className="bg-[#e8f2fc] p-6 rounded-apple-xl border border-blue-100">
                       <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#4285F4] mb-3">Contexto Científico</h3>
                       <p className="text-base text-[#4285F4]/80 italic leading-relaxed">"{sharedAsset.scientificContext}"</p>
                     </div>
                   )}
                 </div>
               </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f5f7] text-[#1d1d1f] font-sans pb-20 md:pb-0 md:pl-[84px] transition-all duration-300">
      <Sidebar currentView={view} setView={setView} trashCount={trashedAssets.length} />

      {/* Name Prompt Modal — first time only */}
      {showNamePrompt && (
        <div className="fixed inset-0 z-[700] bg-black/25 backdrop-blur-md flex items-center justify-center animate-fade-in p-4">
          <div className="bg-white rounded-apple-2xl p-10 max-w-sm w-full shadow-apple-xl text-center animate-scale-in">
            <div className="w-16 h-16 bg-[#1d1d1f] text-white rounded-apple-lg flex items-center justify-center mx-auto mb-6 shadow-apple-md">
              <Stethoscope size={28} />
            </div>
            <h2 className="text-2xl font-semibold tracking-tight mb-2">Bem-vindo ao Lon Suite</h2>
            <p className="text-[#86868b] text-[13px] mb-6 leading-relaxed">
              Como você deseja ser identificado nos cases públicos?
            </p>
            <input
              type="text"
              placeholder="Seu nome profissional..."
              value={nameInput}
              onChange={e => setNameInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && nameInput.trim()) {
                  localStorage.setItem('lon_suite_owner_name', nameInput.trim());
                  setOwnerName(nameInput.trim());
                  setShowNamePrompt(false);
                }
              }}
              className="w-full px-4 py-3 bg-[#f5f5f7] border border-black/8 rounded-apple-lg text-[14px] outline-none focus:border-[#4285F4]/30 focus:shadow-[0_0_0_3px_rgba(0,113,227,0.08)] transition-all placeholder:text-[#aeaeb2] mb-4"
              autoFocus
            />
            <button
              onClick={() => {
                if (nameInput.trim()) {
                  localStorage.setItem('lon_suite_owner_name', nameInput.trim());
                  setOwnerName(nameInput.trim());
                  setShowNamePrompt(false);
                }
              }}
              disabled={!nameInput.trim()}
              className="w-full py-3.5 bg-[#1d1d1f] text-white rounded-apple-lg font-semibold text-[13px] hover:bg-[#333] transition-all disabled:opacity-30 shadow-apple"
            >
              Continuar
            </button>
          </div>
        </div>
      )}

      {/* Hidden file input */}
      <input ref={fileInputRef} type="file" multiple accept="image/*,.pdf,.pptx,.ppt,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation" className="hidden" onChange={handleFilesSelected} />

      {/* Pending Upload Modal */}
      {pendingUpload && (
        <div className="fixed inset-0 z-[500] bg-black/25 backdrop-blur-md flex items-center justify-center animate-fade-in p-4">
          <div className="bg-white rounded-apple-2xl p-10 max-w-sm w-full shadow-apple-xl text-center animate-scale-in">
            <div className="w-16 h-16 bg-[#1d1d1f] text-white rounded-apple-lg flex items-center justify-center mx-auto mb-6 shadow-apple-md">
              <Brain size={28} />
            </div>
            <h2 className="text-2xl font-semibold tracking-tight mb-2">Novo Ativo</h2>
            <p className="text-[#86868b] text-[13px] mb-8 leading-relaxed">
              {pendingUpload.files.length === 1 ? pendingUpload.files[0].name : `${pendingUpload.files.length} arquivos selecionados`}
            </p>
            <p className="text-[12px] text-[#86868b] mb-6">Deseja que a IA indexe automaticamente?</p>
            <div className="flex flex-col gap-2.5">
              <button onClick={() => processUpload(true)} disabled={isProcessing}
                className="btn-ai w-full py-3.5 rounded-apple-lg font-semibold text-[13px] shadow-apple flex items-center justify-center gap-2.5 disabled:opacity-50">
                {isProcessing ? <Loader2 size={15} className="animate-spin" /> : <Brain size={15} />}
                {isProcessing ? 'Processando...' : 'Indexar com IA'}
              </button>
              <button onClick={() => processUpload(false)} disabled={isProcessing}
                className="w-full py-3.5 bg-[#f5f5f7] text-[#1d1d1f] rounded-apple-lg font-semibold text-[13px] hover:bg-black/8 transition-all disabled:opacity-50">
                Indexação Manual
              </button>
              <button onClick={() => setPendingUpload(null)} disabled={isProcessing}
                className="text-[#86868b] text-[12px] font-medium mt-1 hover:text-[#1d1d1f] transition-colors">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen Image */}
      {fullscreenImg && (
        <div className="fixed inset-0 z-[600] bg-black flex items-center justify-center animate-fade-in cursor-zoom-out" onClick={() => setFullscreenImg(null)}>
          <img src={fullscreenImg} className="max-w-[95%] max-h-[95%] object-contain" />
        </div>
      )}

      <main className="min-h-screen w-full">
        {/* HOME */}
        {view === ViewState.HOME && (() => {
          const totalAssets = activeAssets.filter(a => a.type !== 'case').length;
          const totalCases = activeAssets.filter(a => a.type === 'case').length;

          const handleHomeSearch = async () => {
            if (!homeSearchQuery.trim() || homeSearchQuery.trim().length < 2) return;
            setHomeHasSearched(true);

            // All cases searchable: user's own (including legacy without ownerId) + public from others
            const searchableCases = activeAssets.filter(a =>
              a.type === 'case' && (!a.isDeleted) && (
                !a.ownerId || a.ownerId === ownerId || a.visibility === 'public'
              )
            );

            // INSTANT: Local text search first (no AI, no latency)
            const query = homeSearchQuery.toLowerCase().trim();
            const localResults = searchableCases
              .map(c => {
                let score = 0;
                const title = (c.title || '').toLowerCase();
                const tags = (c.tags || []).map(t => t.toLowerCase());
                const blocksText = (c.blocks || []).map(b => typeof b.content === 'string' ? b.content : '').join(' ').toLowerCase();
                if (title.includes(query)) score += 10;
                if (tags.some(t => t.includes(query))) score += 8;
                if (blocksText.includes(query)) score += 5;
                // Prioritize own cases
                const isOwn = !c.ownerId || c.ownerId === ownerId;
                if (isOwn && score > 0) score += 100;
                // Boost by access count
                score += (c.accessCount || 0) * 0.1;
                return { caseItem: c, score };
              })
              .filter(item => item.score > 0)
              .sort((a, b) => b.score - a.score)
              .map(item => item.caseItem);

            setHomeSearchResults(localResults);

            // ASYNC: Try AI enhanced search in background (non-blocking)
            if (searchableCases.length > 0) {
              setHomeSearchLoading(true);
              try {
                const resultIds = await searchCasesWithAI(homeSearchQuery, searchableCases, ownerId);
                if (resultIds.length > 0) {
                  const aiResults = resultIds
                    .map(id => searchableCases.find(c => c.id === id))
                    .filter(Boolean) as Asset[];
                  if (aiResults.length > 0) setHomeSearchResults(aiResults);
                }
              } catch { /* keep local results */ }
              setHomeSearchLoading(false);
            }
          };

          const handleHomeKeyDown = (e: React.KeyboardEvent) => {
            if (e.key === 'Enter') handleHomeSearch();
          };

          // Read-only case viewer for public cases (state is at component top level)

          if (viewingPublicCase) {
            return (
              <div className="min-h-screen animate-fade-in">
                <div className="max-w-[900px] mx-auto pt-8 md:pt-16 px-4 sm:px-6 md:px-8 pb-20">
                  <button onClick={() => setViewingPublicCase(null)} className="mb-8 flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-all text-[10px] font-bold uppercase tracking-[0.3em] group">
                    <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Voltar à pesquisa
                  </button>

                  {/* Creator info */}
                  {viewingPublicCase.ownerName && viewingPublicCase.ownerId !== ownerId && (
                    <div className="flex items-center gap-3 mb-8 px-4 py-3 bg-white rounded-apple-lg border border-black/6 shadow-apple">
                      <div className="w-8 h-8 rounded-full bg-[#1d1d1f] flex items-center justify-center text-white text-[11px] font-bold">
                        {viewingPublicCase.ownerName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-[12px] font-semibold text-[#1d1d1f]">{viewingPublicCase.ownerName}</p>
                        <p className="text-[10px] text-[#86868b]">Autor do case · Somente leitura</p>
                      </div>
                      <Eye size={14} className="ml-auto text-[#aeaeb2]" />
                    </div>
                  )}

                  <div className="space-y-8">
                    {viewingPublicCase.blocks?.map(block => (
                      <div key={block.id}>
                        {block.type === 'title' && <h1 className="text-3xl md:text-5xl font-extralight tracking-tight text-slate-900">{block.content}</h1>}
                        {block.type === 'subtitle' && <h2 className="text-xl md:text-2xl font-semibold tracking-tight text-slate-800">{block.content}</h2>}
                        {block.type === 'text' && <p className="text-base md:text-xl font-light leading-relaxed text-justify text-slate-600 whitespace-pre-wrap">{block.content}</p>}
                        {block.type === 'reference' && (
                          <div className="border-l-2 border-slate-200 pl-5 py-2">
                            <div className="flex items-center gap-2 mb-1">
                              <BookOpen size={12} className="text-slate-400" />
                              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Referência</span>
                            </div>
                            <p className="text-sm italic font-light text-slate-500">
                              {block.content.split(/(https?:\/\/[^\s]+)/g).map((part, i) =>
                                /^https?:\/\//.test(part)
                                  ? <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="text-[#4285F4] hover:underline">{part}</a>
                                  : part
                              )}
                            </p>
                          </div>
                        )}
                        {block.type === 'image' && block.content && (
                          <div className="my-6">
                            <img src={(block.content.split('|||')[0] || "###").split('###')[0]} className="w-full rounded-apple-lg border border-black/6 shadow-sm bg-[#f5f5f7] object-contain max-h-[60vh]" />
                            {block.content.split('###')[1] && <p className="text-sm text-[#86868b] mt-3 italic text-center">{block.content.split('###')[1]}</p>}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          }

          return (
            <div className="flex flex-col items-center min-h-[85vh] px-6 animate-fade-in relative w-full">
              {/* Branding — top */}
              <div className="mt-16 mb-8 flex flex-col items-center">
                <h1 className="text-4xl sm:text-6xl font-light tracking-tight text-[#1d1d1f] flex flex-col sm:flex-row items-center justify-center gap-2 w-full text-center">
                  <span className="font-semibold">Lon</span> Suite
                </h1>
                <p className="text-[11px] sm:text-[12px] text-[#1d1d1f] tracking-[0.3em] uppercase mt-3 font-semibold opacity-50">Ativos Científicos</p>
              </div>

              {/* Search Bar — Google style */}
              <div className="w-full max-w-xl mb-8">
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    {homeSearchLoading ? (
                      <Loader2 size={18} className="text-[#4285F4] animate-spin" />
                    ) : (
                      <Search size={18} className="text-[#aeaeb2] group-focus-within:text-[#4285F4] transition-colors" />
                    )}
                  </div>
                  <input
                    type="text"
                    placeholder="Pesquisar cases clínicos..."
                    value={homeSearchQuery}
                    onChange={e => setHomeSearchQuery(e.target.value)}
                    onKeyDown={handleHomeKeyDown}
                    className="w-full pl-12 pr-14 py-4 bg-white border border-black/8 rounded-full text-[15px] outline-none focus:border-[#4285F4]/30 focus:shadow-[0_0_0_4px_rgba(0,113,227,0.08)] transition-all placeholder:text-[#aeaeb2] shadow-apple-md"
                  />
                  <button
                    onClick={handleHomeSearch}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-[#f5f5f7] hover:bg-[#1d1d1f] text-[#86868b] hover:text-white transition-all"
                  >
                    <Brain size={16} />
                  </button>
                </div>
                <p className="text-center text-[10px] text-[#aeaeb2] mt-2.5 font-medium tracking-wider">
                  {totalAssets} Ativos · {totalCases} Cases · Busca semântica com IA
                </p>
              </div>

              {/* Shortcut icons — below search */}
              <div className="flex items-center gap-9 sm:gap-14 mb-10">
                <button onClick={() => setView(ViewState.ATIVOS)} className="flex flex-col items-center gap-3 group">
                  <div className="w-[56px] h-[56px] sm:w-[64px] sm:h-[64px] rounded-full bg-transparent border border-black/10 flex items-center justify-center group-hover:border-[#1d1d1f] group-hover:bg-[#1d1d1f] transition-all duration-300">
                    <LayoutGrid size={22} strokeWidth={1} className="text-[#86868b] group-hover:text-white transition-colors" />
                  </div>
                  <span className="text-[10px] font-semibold text-[#86868b] group-hover:text-[#1d1d1f] transition-colors uppercase tracking-widest">Ativos</span>
                </button>

                <button onClick={() => setView(ViewState.CASES)} className="flex flex-col items-center gap-3 group">
                  <div className="w-[56px] h-[56px] sm:w-[64px] sm:h-[64px] rounded-full bg-transparent border border-black/10 flex items-center justify-center group-hover:border-[#1d1d1f] group-hover:bg-[#1d1d1f] transition-all duration-300">
                    <Stethoscope size={22} strokeWidth={1} className="text-[#86868b] group-hover:text-white transition-colors" />
                  </div>
                  <span className="text-[10px] font-semibold text-[#86868b] group-hover:text-[#1d1d1f] transition-colors uppercase tracking-widest">Cases</span>
                </button>
                
                <button onClick={() => { setView(ViewState.ATIVOS); setShowUploadModal(true); }} className="flex flex-col items-center gap-3 group">
                  <div className="w-[56px] h-[56px] sm:w-[64px] sm:h-[64px] rounded-full bg-transparent border border-black/10 flex items-center justify-center group-hover:border-[#1d1d1f] group-hover:bg-[#1d1d1f] transition-all duration-300">
                    <Plus size={22} strokeWidth={1} className="text-[#86868b] group-hover:text-white transition-colors" />
                  </div>
                  <span className="text-[10px] font-semibold text-[#86868b] group-hover:text-[#1d1d1f] transition-colors uppercase tracking-widest">Uploads</span>
                </button>
              </div>

              {/* Search Results */}
              {homeHasSearched && (
                <div ref={homeScrollRef} className="w-full max-w-5xl animate-fade-in pb-20">
                  {homeSearchLoading && homeSearchResults.length === 0 ? (
                    <div className="flex flex-col items-center py-16">
                      <Loader2 size={28} className="text-[#4285F4] animate-spin mb-4" />
                      <p className="text-[12px] text-[#86868b] font-medium">Analisando termos médicos...</p>
                    </div>
                  ) : homeSearchResults.length > 0 ? (
                    <>
                      <div className="flex items-center gap-2 mb-5">
                        <p className="text-[11px] text-[#86868b] font-medium">
                          {homeSearchResults.length} {homeSearchResults.length === 1 ? 'resultado' : 'resultados'} para "{homeSearchQuery}"
                        </p>
                        {homeSearchLoading && <Loader2 size={12} className="text-[#4285F4] animate-spin" />}
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {homeSearchResults.map(caseItem => {
                          const thumbnail = getCaseThumbnail(caseItem);
                          const isOwn = !caseItem.ownerId || caseItem.ownerId === ownerId;
                          return (
                            <div
                              key={caseItem.id}
                              onClick={() => {
                                if (isOwn) {
                                  setEditingCase(caseItem);
                                  setView(ViewState.CASES);
                                } else {
                                  // Increment access count
                                  const updated = { ...caseItem, accessCount: (caseItem.accessCount || 0) + 1 };
                                  setAssets(prev => prev.map(a => a.id === caseItem.id ? updated : a));
                                  syncToCloud(updated);
                                  setViewingPublicCase(caseItem);
                                }
                              }}
                              className="group cursor-pointer bg-white rounded-apple-xl border border-black/6 shadow-apple overflow-hidden hover:shadow-apple-md hover:-translate-y-1 transition-all duration-300"
                              style={{ width: '100%', minHeight: '250px' }}
                            >
                              {/* Thumbnail */}
                              <div className="w-full h-[140px] bg-[#f5f5f7] overflow-hidden flex items-center justify-center">
                                {thumbnail ? (
                                  <img src={thumbnail} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="" />
                                ) : (
                                  <Stethoscope size={28} className="text-[#aeaeb2] opacity-40" />
                                )}
                              </div>
                              {/* Info */}
                              <div className="p-3.5">
                                <p className="text-[12px] font-semibold text-[#1d1d1f] line-clamp-2 leading-tight mb-1.5 group-hover:text-[#4285F4] transition-colors">
                                  {caseItem.title || 'Caso Clínico'}
                                </p>
                                <p className="text-[10px] text-[#aeaeb2] line-clamp-1 mb-2">
                                  {getCasePreview(caseItem)}
                                </p>
                                <div className="flex items-center justify-between">
                                  {isOwn ? (
                                    <span className="text-[8px] font-bold text-[#4285F4] uppercase tracking-widest">Seu case</span>
                                  ) : caseItem.ownerName ? (
                                    <span className="text-[8px] font-medium text-[#86868b] truncate max-w-[100px]">{caseItem.ownerName}</span>
                                  ) : (
                                    <span className="text-[8px] text-[#aeaeb2]">Anônimo</span>
                                  )}
                                  {(caseItem.accessCount || 0) > 0 && (
                                    <span className="text-[8px] text-[#aeaeb2] flex items-center gap-0.5">
                                      <Eye size={8} />{caseItem.accessCount}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-16">
                      <Search size={32} className="mx-auto mb-3 text-[#aeaeb2] opacity-30" />
                      <p className="text-[13px] text-[#86868b] font-medium">Nenhum case encontrado para "{homeSearchQuery}"</p>
                      <p className="text-[11px] text-[#aeaeb2] mt-1">Tente outros termos médicos ou sinônimos</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })()}

        {/* ATIVOS */}
        {view === ViewState.ATIVOS && (
          <div className="px-5 sm:px-8 md:px-10 pt-8 md:pt-10 pb-10 animate-fade-in">
            <div className="max-w-[1920px] mx-auto">
              <header className="mb-8">
                {/* Title row */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-7">
                  <div>
                    <h1 className="text-3xl sm:text-4xl font-extralight tracking-tight text-[#1d1d1f]">Ativos</h1>
                    <p className="text-[11px] font-medium text-[#86868b] tracking-wider mt-1.5">Patrimônio Científico</p>
                  </div>
                  <button onClick={() => setShowUploadModal(true)}
                    className="btn-ai w-full sm:w-auto px-5 py-2.5 rounded-apple-lg font-semibold text-[13px] shadow-apple flex items-center justify-center gap-2 hover:-translate-y-0.5">
                    <Plus size={15} /> Novo Ativo
                  </button>
                </div>

                {/* Filter row */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  {/* Search */}
                  <div className="relative flex-1 min-w-0 group">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                      {isAiSearching ? (
                        <Loader2 size={15} className="text-[#4285F4] animate-spin" />
                      ) : (
                        <Search size={15} className="text-[#86868b] group-focus-within:text-[#4285F4] transition-colors" />
                      )}
                      <Brain size={12} className="text-[#4285F4] opacity-0 group-focus-within:opacity-100 transition-opacity" />
                    </div>
                    <input type="text" placeholder="Busca com IA..."
                      value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-white border border-black/8 rounded-apple-lg text-[13px] outline-none focus:border-[#4285F4]/30 focus:shadow-[0_0_0_3px_rgba(0,113,227,0.08)] transition-all placeholder:text-[#aeaeb2] shadow-apple" />
                  </div>

                  {/* Date filters */}
                  <div className="flex items-center gap-2">
                    <select
                      value={dateFilter.month}
                      onChange={e => setDateFilter(p => ({ ...p, month: e.target.value }))}
                      className="px-3 py-2.5 bg-white border border-black/8 rounded-apple-lg text-[12px] font-medium text-[#1d1d1f] outline-none focus:border-[#4285F4]/30 shadow-apple appearance-none cursor-pointer"
                    >
                      <option value="">Mês</option>
                      {['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'].map((m, i) => (
                        <option key={i} value={String(i + 1)}>{m}</option>
                      ))}
                    </select>
                    <select
                      value={dateFilter.year}
                      onChange={e => setDateFilter(p => ({ ...p, year: e.target.value }))}
                      className="px-3 py-2.5 bg-white border border-black/8 rounded-apple-lg text-[12px] font-medium text-[#1d1d1f] outline-none focus:border-[#4285F4]/30 shadow-apple appearance-none cursor-pointer"
                    >
                      <option value="">Ano</option>
                      {Array.from(new Set(assets.map(a => new Date(a.createdAt || a.date).getFullYear()))).sort((a, b) => b - a).map(y => (
                        <option key={y} value={String(y)}>{y}</option>
                      ))}
                    </select>
                    {(dateFilter.month || dateFilter.year) && (
                      <button
                        onClick={() => setDateFilter({ month: '', year: '' })}
                        className="px-2.5 py-2.5 text-[10px] font-bold text-[#86868b] hover:text-red-500 transition-colors uppercase tracking-widest"
                      >
                        Limpar
                      </button>
                    )}
                  </div>
                </div>
              </header>

              {/* Grid */}
              <div className="grid gap-3 sm:gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 xl:grid-cols-9 2xl:grid-cols-11">
                {filteredAssets.map(asset => (
                  <AssetCard key={asset.id} asset={asset} onClick={handleOpenAsset} />
                ))}
              </div>

              {filteredAssets.length === 0 && (
                <div className="text-center py-24 text-[#86868b]">
                  <LayoutGrid size={40} className="mx-auto mb-4 opacity-25" />
                  <p className="text-[14px] font-medium mb-1">Nenhum ativo encontrado</p>
                  <p className="text-[12px] text-[#aeaeb2] mb-5">Tente ajustar os filtros ou adicione um novo ativo</p>
                  <button onClick={() => fileInputRef.current?.click()}
                    className="btn-ai px-5 py-2.5 rounded-apple-lg text-[12px] font-semibold shadow-apple">
                    Adicionar Ativo
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* CASES - Card View */}
        {view === ViewState.CASES && !editingCase && (() => {
          const statusConfig: Record<string, { label: string; color: string; bg: string; dot: string }> = {
            em_andamento: { label: 'Em Andamento', color: 'text-blue-600', bg: 'bg-blue-50', dot: 'bg-blue-500' },
            completo: { label: 'Completo', color: 'text-emerald-600', bg: 'bg-emerald-50', dot: 'bg-emerald-500' },
            arquivado: { label: 'Arquivado', color: 'text-slate-500', bg: 'bg-slate-100', dot: 'bg-slate-400' },
          };

          const getCaseStats = (c: Asset) => {
            const blocks = c.blocks || [];
            return {
              images: blocks.filter(b => b.type === 'image' && b.content).length,
              texts: blocks.filter(b => b.type === 'text').length,
              assets: blocks.filter(b => b.type === 'asset').length,
            };
          };

          return (
            <div className="px-5 sm:px-10 md:px-12 pt-8 md:pt-10 pb-10 animate-fade-in">
              <header className="mb-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-7">
                  <div>
                    <h1 className="text-3xl sm:text-4xl font-extralight tracking-tight text-[#1d1d1f]">Cases Clínicos</h1>
                    <p className="text-[11px] font-medium text-[#86868b] tracking-wider mt-1.5">{filteredCases.length} {filteredCases.length === 1 ? 'caso' : 'casos'} · Documentação Editorial</p>
                  </div>
                  <button onClick={handleCreateCase}
                    className="btn-ai w-full sm:w-auto px-5 py-2.5 rounded-apple-lg font-semibold text-[13px] shadow-apple flex items-center justify-center gap-2 hover:-translate-y-0.5">
                    <Plus size={15} /> Novo Case
                  </button>
                </div>

                {/* Search + Date Filter */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <div className="relative flex-1 max-w-xl group">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                      <Search size={15} className="text-[#86868b] group-focus-within:text-[#4285F4] transition-colors" />
                    </div>
                    <input type="text" placeholder="Localizar case por título, tag ou conteúdo..."
                      value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-white border border-black/8 rounded-apple-lg text-[13px] outline-none focus:border-[#4285F4]/30 focus:shadow-[0_0_0_3px_rgba(0,113,227,0.08)] transition-all placeholder:text-[#aeaeb2] shadow-apple" />
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={dateFilter.month}
                      onChange={e => setDateFilter(p => ({ ...p, month: e.target.value }))}
                      className="px-3 py-2.5 bg-white border border-black/8 rounded-apple-lg text-[12px] font-medium text-[#1d1d1f] outline-none focus:border-[#4285F4]/30 shadow-apple appearance-none cursor-pointer"
                    >
                      <option value="">Mês</option>
                      {['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'].map((m, i) => (
                        <option key={i} value={String(i + 1)}>{m}</option>
                      ))}
                    </select>
                    <select
                      value={dateFilter.year}
                      onChange={e => setDateFilter(p => ({ ...p, year: e.target.value }))}
                      className="px-3 py-2.5 bg-white border border-black/8 rounded-apple-lg text-[12px] font-medium text-[#1d1d1f] outline-none focus:border-[#4285F4]/30 shadow-apple appearance-none cursor-pointer"
                    >
                      <option value="">Ano</option>
                      {Array.from(new Set(activeAssets.filter(a => a.type === 'case').map(a => new Date(a.createdAt || a.date).getFullYear()))).sort((a, b) => b - a).map(y => (
                        <option key={y} value={String(y)}>{y}</option>
                      ))}
                    </select>
                    {(dateFilter.month || dateFilter.year) && (
                      <button
                        onClick={() => setDateFilter({ month: '', year: '' })}
                        className="px-2.5 py-2.5 text-[10px] font-bold text-[#86868b] hover:text-red-500 transition-colors uppercase tracking-widest"
                      >
                        Limpar
                      </button>
                    )}
                  </div>
                </div>
              </header>

              {/* Cases List — Gmail-style rows */}
              {filteredCases.length > 0 ? (
                <div className="bg-white rounded-apple-xl border border-black/6 shadow-apple overflow-hidden">
                  {filteredCases.map((caseItem, idx) => {
                    const thumbnail = getCaseThumbnail(caseItem);
                    const status = statusConfig[caseItem.caseStatus || 'em_andamento'] || statusConfig.em_andamento;

                    return (
                      <div key={caseItem.id}
                        onClick={() => { setEditingCase(caseItem); setView(ViewState.CASES); }}
                        className={`group flex items-center gap-4 px-5 py-3.5 hover:bg-[#f5f5f7] transition-all cursor-pointer ${idx < filteredCases.length - 1 ? 'border-b border-black/5' : ''}`}
                      >
                        {/* Thumbnail */}
                        <div className="w-11 h-11 rounded-apple bg-[#f5f5f7] overflow-hidden shrink-0 border border-black/6 flex items-center justify-center">
                          {thumbnail ? (
                            <img src={thumbnail} className="w-full h-full object-cover" alt="" />
                          ) : (
                            <Stethoscope size={16} className="text-[#aeaeb2]" />
                          )}
                        </div>

                        {/* Title + Preview */}
                        <div className="flex-1 min-w-0">
                          <p className={`text-[13px] font-semibold truncate transition-colors ${caseItem.title ? 'text-[#1d1d1f] group-hover:text-[#4285F4]' : 'text-[#86868b] italic'}`}>
                            {caseItem.title || 'Novo Caso Clínico'}
                          </p>
                          <p className="text-[11px] text-[#aeaeb2] truncate mt-0.5">{getCasePreview(caseItem)}</p>
                        </div>

                        {/* Tags */}
                        <div className="hidden sm:flex items-center gap-1.5 shrink-0">
                          {caseItem.tags?.slice(0, 2).map((tag, i) => (
                            <span key={i} className="px-2 py-0.5 rounded-md bg-[#f5f5f7] text-[#86868b] text-[9px] font-medium">{tag}</span>
                          ))}
                        </div>

                        {/* Status */}
                        <div className={`hidden md:flex items-center gap-1.5 shrink-0 px-2 py-1 rounded-full ${status.bg}`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                          <span className={`text-[9px] font-bold uppercase tracking-wider ${status.color}`}>{status.label}</span>
                        </div>

                        {/* Date */}
                        <span className="text-[10px] text-[#aeaeb2] font-medium shrink-0 w-16 text-right">
                          {new Date(caseItem.updatedAt || caseItem.createdAt || caseItem.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                        </span>

                        {/* Actions on hover */}
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                          <button onClick={e => { e.stopPropagation();
                            const shareUrl = `${window.location.origin}?share=${caseItem.id}&type=case`;
                            navigator.clipboard.writeText(shareUrl);
                            alert('Link do caso copiado!');
                          }} className="p-1.5 text-[#86868b] hover:text-[#4285F4] transition-colors rounded-lg hover:bg-black/5">
                            <Share2 size={13} />
                          </button>
                          <button onClick={e => { e.stopPropagation(); handleDeleteAsset(caseItem.id); }}
                            className="p-1.5 text-[#86868b] hover:text-red-500 transition-colors rounded-lg hover:bg-black/5">
                            <Trash2 size={13} />
                          </button>
                        </div>

                        <ChevronRight size={14} className="text-[#aeaeb2] group-hover:text-[#4285F4] group-hover:translate-x-0.5 transition-all shrink-0" />
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-24 text-[#86868b]">
                  <Stethoscope size={40} className="mx-auto mb-4 opacity-25" />
                  <p className="text-[14px] font-medium mb-1">Nenhum case criado ainda</p>
                  <p className="text-[12px] text-[#aeaeb2] mb-5">Cases clínicos editoriais aparecerão aqui</p>
                  <button onClick={handleCreateCase}
                    className="btn-ai px-5 py-2.5 rounded-apple-lg text-[12px] font-semibold shadow-apple">
                    Criar Primeiro Case
                  </button>
                </div>
              )}
            </div>
          );
        })()}

        {/* CASE EDITOR */}
        {view === ViewState.CASES && editingCase && renderCaseEditor()}



        {/* TRASH */}
        {view === ViewState.TRASH && (
          <div className="px-5 sm:px-10 md:px-12 pt-8 md:pt-10 pb-10 animate-fade-in">
            <header className="mb-8">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-3xl sm:text-4xl font-extralight tracking-tight text-[#1d1d1f]">Lixeira</h1>
                  <p className="text-[11px] font-medium text-[#86868b] mt-1.5">
                    {trashedAssets.length} {trashedAssets.length === 1 ? 'item' : 'itens'}
                  </p>
                </div>
                {trashedAssets.length > 0 && (
                  <button onClick={e => { e.stopPropagation(); handleEmptyTrash(); }}
                    className="px-4 py-2.5 bg-red-50 text-red-600 rounded-apple-lg font-semibold text-[12px] hover:bg-red-100 transition-all flex items-center gap-1.5">
                    <Trash2 size={13} /> Esvaziar Lixeira
                  </button>
                )}
              </div>
            </header>

            {trashedAssets.length > 0 ? (
              <div className="bg-white rounded-apple-xl border border-black/6 overflow-hidden shadow-apple">
                {trashedAssets.map((asset, idx) => (
                  <div key={asset.id}
                    className={`flex items-center gap-4 px-5 py-4 ${idx < trashedAssets.length - 1 ? 'border-b border-black/5' : ''
                      }`}>
                    <div className="w-11 h-11 rounded-apple bg-[#f5f5f7] overflow-hidden shrink-0 border border-black/6 opacity-50">
                      {asset.thumbnail
                        ? <img src={asset.thumbnail} alt="" className="w-full h-full object-cover" />
                        : <div className="w-full h-full flex items-center justify-center text-[#86868b]">{asset.type === 'case' ? <Briefcase size={18} /> : <ImageIcon size={18} />}</div>
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-[14px] font-medium text-[#86868b] truncate">{asset.title || 'Sem título'}</h3>
                      <p className="text-[11px] text-[#aeaeb2] flex items-center gap-1 mt-0.5">
                        <Clock size={11} /> Excluído {formatRelativeTime(asset.deletedAt || asset.date)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button onClick={e => { e.stopPropagation(); handleRestoreAsset(asset.id); }}
                        className="px-3.5 py-2 bg-[#f5f5f7] text-[#1d1d1f] rounded-apple text-[11px] font-semibold hover:bg-black/8 transition-all flex items-center gap-1.5">
                        <RotateCcw size={12} /> Restaurar
                      </button>
                      <button onClick={e => { e.stopPropagation(); openConfirmDialog({ title: 'Excluir Permanentemente?', message: 'Este item será permanentemente removido e não poderá ser recuperado.', onConfirm: () => handlePermanentDelete(asset.id) }); }}
                        className="px-3.5 py-2 bg-red-50 text-red-600 rounded-apple text-[11px] font-semibold hover:bg-red-100 transition-all">
                        Excluir
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-24 text-[#86868b]">
                <Trash2 size={40} className="mx-auto mb-4 opacity-25" />
                <p className="text-[14px] font-medium">Lixeira vazia</p>
              </div>
            )}
          </div>
        )}

        {/* SETTINGS */}
        {view === ViewState.SETTINGS && (
          <div className="px-5 sm:px-10 md:px-12 pt-8 md:pt-10 pb-10 animate-fade-in max-w-2xl">
            <h1 className="text-3xl sm:text-4xl font-extralight tracking-tight text-[#1d1d1f] mb-1.5">Ajustes</h1>
            <p className="text-[11px] font-medium text-[#86868b] mb-8">Configurações do sistema</p>

            <div className="space-y-3">
              <div className="bg-white rounded-apple-xl p-5 border border-black/6 shadow-apple">
                <h3 className="text-[14px] font-semibold text-[#1d1d1f] mb-1">Sobre o Lon Suite</h3>
                <p className="text-[13px] text-[#86868b]">Versão 3.0.0</p>
                <p className="text-[12px] text-[#aeaeb2] mt-1.5 leading-relaxed">Sistema de gestão de patrimônio científico com inteligência artificial integrada.</p>
              </div>

              <div className="bg-white rounded-apple-xl p-5 border border-black/6 shadow-apple">
                <h3 className="text-[14px] font-semibold text-[#1d1d1f] mb-1">Armazenamento</h3>
                <p className="text-[12px] text-[#86868b] mb-4">Os dados são armazenados localmente no seu navegador.</p>
                <button onClick={() => openConfirmDialog({ title: 'Limpar todos os dados?', message: 'Esta ação removerá todos os ativos, cases e configurações permanentemente.', onConfirm: () => { localStorage.clear(); window.location.reload(); } })}
                  className="px-4 py-2 bg-red-50 text-red-600 rounded-apple text-[12px] font-semibold hover:bg-red-100 transition-colors">
                  Limpar Todos os Dados
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Upload Type Selection Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-[500] flex items-end sm:items-center justify-center p-0 sm:p-6 animate-fade-in">
          <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm" onClick={() => setShowUploadModal(false)} />

          <div className="relative w-full sm:max-w-3xl bg-white rounded-t-[32px] sm:rounded-[48px] p-6 sm:p-12 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-4xl font-light tracking-tight text-slate-900 mb-3">
                Como deseja carregar?
              </h2>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.3em]">
                Escolha o modo de upload ideal para você
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8 mb-8 sm:mb-12">
              {/* Individual Uploads (Single or Multiple separate assets) */}
              <button
                onClick={() => {
                  setUploadMode('multiple'); // multiple actually means separate assets
                  setShowUploadModal(false);
                  if (fileInputRef.current) {
                    fileInputRef.current.setAttribute('multiple', 'true');
                    fileInputRef.current.click();
                  }
                }}
                className="group p-6 sm:p-10 bg-white border border-slate-100 rounded-3xl sm:rounded-[40px] hover:border-blue-200 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 text-center"
              >
                <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 group-hover:bg-blue-100 transition-all duration-500">
                  <FileText size={32} className="text-[#4285F4]" strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-semibold text-slate-800 mb-3">Ativos Individuais</h3>
                <p className="text-sm text-slate-400 leading-relaxed max-w-[200px] mx-auto">
                  Carregar 1 ou mais arquivos, cada um como um ativo único
                </p>
              </button>

              {/* Group/Collection */}
              <button
                onClick={() => {
                  setUploadMode('group');
                  setShowUploadModal(false);
                  if (fileInputRef.current) {
                    fileInputRef.current.setAttribute('multiple', 'true');
                    fileInputRef.current.click();
                  }
                }}
                className="group p-6 sm:p-10 bg-white border border-slate-100 rounded-3xl sm:rounded-[40px] hover:border-blue-200 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 text-center"
              >
                <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 group-hover:bg-blue-100 transition-all duration-500">
                  <Briefcase size={32} className="text-[#4285F4]" strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-semibold text-slate-800 mb-3">Grupo de Arquivos</h3>
                <p className="text-sm text-slate-400 leading-relaxed max-w-[200px] mx-auto">
                  Vários arquivos em um único ativo com slider
                </p>
              </button>
            </div>

            <button
              onClick={() => setShowUploadModal(false)}
              className="flex items-center justify-center gap-2 mx-auto text-slate-400 hover:text-slate-600 transition-colors text-xs font-bold uppercase tracking-[0.2em]"
            >
              <X size={14} />
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Asset Modal */}
      {selectedAsset && (
        <AssetModal
          asset={selectedAsset}
          onClose={() => setSelectedAsset(null)}
          onSave={handleSaveAsset}
          onDelete={handleDeleteAsset}
          onConfirmDialog={openConfirmDialog}
        />
      )}

      {/* Confirmation Dialog */}
      {confirmDialog?.isOpen && (
        <div className="fixed inset-0 z-[600] bg-black/35 backdrop-blur-md flex items-center justify-center animate-fade-in p-4" onClick={() => setConfirmDialog(null)}>
          <div className="bg-white rounded-apple-xl p-7 max-w-sm w-full shadow-apple-xl animate-scale-in" onClick={e => e.stopPropagation()}>
            <div className="w-11 h-11 bg-red-50 rounded-apple flex items-center justify-center mb-4">
              <AlertCircle size={22} className="text-red-500" />
            </div>
            <h3 className="text-[17px] font-semibold text-[#1d1d1f] mb-2">{confirmDialog.title}</h3>
            <p className="text-[13px] text-[#86868b] mb-6 leading-relaxed">{confirmDialog.message}</p>
            <div className="flex gap-2.5">
              <button onClick={() => setConfirmDialog(null)}
                className="flex-1 px-5 py-2.5 bg-[#f5f5f7] text-[#1d1d1f] rounded-apple-lg font-semibold text-[13px] hover:bg-black/8 transition-all">
                Cancelar
              </button>
              <button onClick={() => { confirmDialog.onConfirm(); setConfirmDialog(null); }}
                className="flex-1 px-5 py-2.5 bg-red-500 text-white rounded-apple-lg font-semibold text-[13px] hover:bg-red-600 transition-all shadow-apple">
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
