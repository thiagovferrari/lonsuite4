import React, { useState, useEffect, useMemo, useRef } from 'react';
import { ViewState, Asset, MOCK_ASSETS, EvidenceLevel, AssetType, CaseBlock, CaseStatus, Attachment } from './types';
import Sidebar from './components/Sidebar';
import AssetCard from './components/AssetCard';
import AssetModal from './components/AssetModal';
import { analyzeAsset, searchAssetsWithAI, generateSmartTags } from './services/geminiService';
import { saveAttachmentData, deleteAttachmentData, getAttachmentData } from './services/storageService';
import { Plus, Sparkles, FileText, Image as ImageIcon, Loader2, ChevronLeft, Trash2, Type as TypeIcon, Search, LayoutGrid, List, RotateCcw, Clock, ChevronRight, Briefcase, X, AlertCircle, ExternalLink, Share2, Stethoscope, Activity, ArrowRight, Layers, Download, Home } from 'lucide-react';

const App: React.FC = () => {
  // Core State
  const [view, setView] = useState<ViewState>(ViewState.HOME);
  const [assets, setAssets] = useState<Asset[]>(() => {
    try {
      const stored = localStorage.getItem('lon_suite_assets');
      return stored ? JSON.parse(stored) : MOCK_ASSETS;
    } catch { return MOCK_ASSETS; }
  });



  // UI State
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [pendingUpload, setPendingUpload] = useState<{ files: File[], base64s: string[] } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // AI & Behavior State
  const [aiTags, setAiTags] = useState<string[]>(['Recentes']);
  const [aiSearchResults, setAiSearchResults] = useState<string[] | null>(null);
  const [isAiSearching, setIsAiSearching] = useState(false);
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

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Helper para auto-ajuste de altura em textareas
  const autoResizeTextarea = (element: HTMLTextAreaElement | null) => {
    if (element) {
      element.style.height = 'auto';
      element.style.height = element.scrollHeight + 'px';
    }
  };

  // Persist to localStorage — exclui thumbnails/base64 grandes para evitar limite de 5MB
  useEffect(() => {
    try {
      const toSave = assets.map(a => ({
        ...a,
        // Remove thumbnail grande (fica só em IndexedDB via saveAttachmentData)
        // Mas mantemos thumbnails pequenos (caso criados pelo MOCK com string curta)
        thumbnail: a.thumbnail && a.thumbnail.length > 50000 ? undefined : a.thumbnail,
        // Attachments: remove o campo 'data' pesado, mantém apenas metadados
        attachments: a.attachments?.map(att => ({ id: att.id, name: att.name, type: att.type, size: att.size }))
      }));
      localStorage.setItem('lon_suite_assets', JSON.stringify(toSave));
    } catch (err) {
      console.warn('localStorage save failed (quota exceeded?), trying without thumbnails:', err);
      try {
        const slim = assets.map(a => ({ ...a, thumbnail: undefined, attachments: a.attachments?.map(att => ({ id: att.id, name: att.name, type: att.type, size: att.size })) }));
        localStorage.setItem('lon_suite_assets', JSON.stringify(slim));
      } catch { /* silent */ }
    }
  }, [assets]);



  // On mount: reload thumbnails from IndexedDB for assets saved without thumbnail in localStorage
  useEffect(() => {
    const reloadThumbnails = async () => {
      const missing = assets.filter(a => !a.thumbnail && !a.isDeleted && a.type !== 'case');
      if (missing.length === 0) return;
      const updates: Record<string, string> = {};
      await Promise.all(missing.map(async a => {
        const data = await getAttachmentData(a.id);
        if (data) updates[a.id] = data;
      }));
      if (Object.keys(updates).length > 0) {
        setAssets(prev => prev.map(a => updates[a.id] ? { ...a, thumbnail: updates[a.id] } : a));
      }
    };
    reloadThumbnails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load Smart Tags
  useEffect(() => {
    const fetchTags = async () => {
      const tags = await generateSmartTags(recentAccesses);
      setAiTags(tags);
    };
    fetchTags();
  }, [recentAccesses]);

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

  // --- SEMANTIC SEARCH LOGIC FOR ASSETS ---
  const filteredAssets = useMemo(() => {
    const assetsOnly = activeAssets.filter(a => a.type !== 'case');
    
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
        return title.includes(query) || tags.some(t => t.includes(query));
      });
  }, [activeAssets, searchQuery, aiSearchResults]);

  // --- SEMANTIC SEARCH LOGIC FOR CASES ---
  const filteredCases = useMemo(() => {
    const casesOnly = activeAssets.filter(a => a.type === 'case');
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
  }, [activeAssets, searchQuery]);

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

        // Create attachments metadata and save large data to IndexedDB
        const attachments: Attachment[] = [];
        for (let i = 0; i < pendingUpload.files.length; i++) {
          const file = pendingUpload.files[i];
          const base64 = pendingUpload.base64s[i];
          const attId = crypto.randomUUID();

          // Save to IndexedDB (asynchronous)
          await saveAttachmentData(attId, base64);

          attachments.push({
            id: attId,
            name: file.name,
            type: file.type,
            // DO NOT include 'data: base64' here to keep state light
            size: file.size
          });
        }

        const groupAsset: Asset = {
          id: crypto.randomUUID(),
          ...assetData,
          type: 'image',
          date: new Date().toISOString(),
          thumbnail: firstBase64, // Keep thumbnail in state for quick viewing
          attachments,
          createdAt: new Date().toISOString()
        };

        setAssets(prev => [groupAsset, ...prev]);
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

        const assetType: AssetType = file.type.includes('pdf') ? 'pdf' : 'image';
        const assetId = crypto.randomUUID();

        // For individual files, we also save the data to IndexedDB for consistency
        await saveAttachmentData(assetId, base64);

        newAssets.push({
          id: assetId,
          ...assetData,
          type: assetType,
          date: new Date().toISOString(),
          thumbnail: base64, // Still keep thumbnail for cards
          createdAt: new Date().toISOString()
        });
      }

      setAssets(prev => [...newAssets, ...prev]);
    } catch (criticalError) {
      console.error('Critical error in processUpload:', criticalError);
      alert('Houve um erro crítico ao processar seus arquivos. Por favor, tente novamente.');
    } finally {
      setPendingUpload(null);
      setIsProcessing(false);
      setUploadMode('single'); // Reset upload mode for next upload
    }
  };

  // Soft delete - move to trash
  const handleDeleteAsset = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    // Find the asset to clean up its IndexedDB entries
    const assetToRemove = assets.find(a => a.id === id);
    if (assetToRemove) {
      if (assetToRemove.attachments) {
        for (const att of assetToRemove.attachments) {
          await deleteAttachmentData(att.id);
        }
      }
      // Also delete the main asset data from IndexedDB if it was an individual file
      await deleteAttachmentData(assetToRemove.id);
    }

    setAssets(prev => prev.map(a =>
      a.id === id ? { ...a, isDeleted: true, deletedAt: new Date().toISOString() } : a
    ));
    if (selectedAsset?.id === id) setSelectedAsset(null);
  };

  // Permanent delete
  const handlePermanentDelete = (id: string) => {
    setAssets(prev => prev.filter(a => a.id !== id));
  };

  // Restore from trash
  const handleRestoreAsset = (id: string) => {
    setAssets(prev => prev.map(a =>
      a.id === id ? { ...a, isDeleted: false, deletedAt: undefined } : a
    ));
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
  };

  const addBlock = (type: 'title' | 'text' | 'image' | 'asset', assetId?: string) => {
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
          
          // Render image
          if (imgData && imgData.startsWith('data:image')) {
            try {
              const imgProps = doc.getImageProperties(imgData);
              const imgWidth = contentWidth;
              const imgHeight = (imgProps.height / imgProps.width) * imgWidth;
              const clampedHeight = Math.min(imgHeight, 240);
              checkPage(clampedHeight + 20); // More margin for caption
              doc.addImage(imgData, 'JPEG', margin, y, imgWidth, clampedHeight);
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
          checkPage(15);
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(12);
          doc.setTextColor(66, 133, 244);
          const assetTitleLines = doc.splitTextToSize(`[Ativo] ${linkedAsset.title}`, contentWidth);
          doc.text(assetTitleLines, margin, y, { align: 'left' });
          y += assetTitleLines.length * 5 + 4;

          if (linkedAsset.thumbnail && linkedAsset.type === 'image') {
            try {
              const imgProps = doc.getImageProperties(linkedAsset.thumbnail);
              const imgWidth = Math.min(contentWidth, 120);
              const imgHeight = (imgProps.height / imgProps.width) * imgWidth;
              checkPage(imgHeight + 10);
              doc.addImage(linkedAsset.thumbnail, 'JPEG', margin + (contentWidth - imgWidth) / 2, y, imgWidth, imgHeight);
              y += imgHeight + 8;
            } catch { /* erro silent */ }
          }

          if (linkedAsset.summary || linkedAsset.scientificContext) {
            checkPage(10);
            doc.setFont('helvetica', 'italic');
            doc.setFontSize(10);
            doc.setTextColor(100, 100, 105);
            const refText = linkedAsset.scientificContext || linkedAsset.summary || '';
            const summaryLines = doc.splitTextToSize(`"${refText}"`, contentWidth);
            doc.text(summaryLines, margin, y, { align: 'justify', maxWidth: contentWidth });
            y += summaryLines.length * 4.5 + 8;
          }
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

    doc.save(`${editingCase.title.replace(/\s+/g, '_')}.pdf`);
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
            <button onClick={() => setEditingCase(null)} className="mb-4 md:mb-12 flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-all text-[10px] font-bold uppercase tracking-[0.3em] group">
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
            <button onClick={() => addBlock('text')} className="p-3 md:p-4 hover:bg-slate-100 rounded-full text-slate-500 hover:text-slate-900 transition-all" title="Adicionar texto">
              <FileText size={18} />
            </button>
            <button onClick={() => addBlock('image')} className="p-3 md:p-4 hover:bg-slate-100 rounded-full text-slate-500 hover:text-slate-900 transition-all" title="Adicionar evidência">
              <ImageIcon size={18} />
            </button>
            <button onClick={() => setShowAssetPicker(true)} className="p-3 md:p-4 hover:bg-blue-50 rounded-full text-blue-500 hover:text-blue-700 transition-all" title="Adicionar ativo">
              <LayoutGrid size={18} />
            </button>
            <div className="w-px h-6 md:h-8 bg-slate-200 mx-1 md:mx-2"></div>

            <button onClick={() => setEditingCase(null)} className="hidden sm:block px-6 py-3 bg-slate-100 text-slate-600 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-slate-200 transition-all" title="Fechar editor">
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
              <h3 className="text-[10px] font-bold text-[#86868b] uppercase tracking-widest mb-3">Tags</h3>
              <div className="flex flex-wrap gap-1.5">
                {editingCase.tags?.map((tag, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded-full bg-white text-[#424245] text-[10px] font-medium border border-black/6 shadow-apple">
                    {tag}
                  </span>
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
                     {block.type === 'text' && <p className="text-lg font-light leading-relaxed text-[#424245] whitespace-pre-wrap">{block.content}</p>}
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

      {/* Hidden file input */}
      <input ref={fileInputRef} type="file" multiple accept="image/*,.pdf" className="hidden" onChange={handleFilesSelected} />

      {/* Pending Upload Modal */}
      {pendingUpload && (
        <div className="fixed inset-0 z-[500] bg-black/25 backdrop-blur-md flex items-center justify-center animate-fade-in p-4">
          <div className="bg-white rounded-apple-2xl p-10 max-w-sm w-full shadow-apple-xl text-center animate-scale-in">
            <div className="w-16 h-16 bg-[#1d1d1f] text-white rounded-apple-lg flex items-center justify-center mx-auto mb-6 shadow-apple-md">
              <Sparkles size={28} />
            </div>
            <h2 className="text-2xl font-semibold tracking-tight mb-2">Novo Ativo</h2>
            <p className="text-[#86868b] text-[13px] mb-8 leading-relaxed">
              {pendingUpload.files.length === 1 ? pendingUpload.files[0].name : `${pendingUpload.files.length} arquivos selecionados`}
            </p>
            <p className="text-[12px] text-[#86868b] mb-6">Deseja que a IA indexe automaticamente?</p>
            <div className="flex flex-col gap-2.5">
              <button onClick={() => processUpload(true)} disabled={isProcessing}
                className="btn-ai w-full py-3.5 rounded-apple-lg font-semibold text-[13px] shadow-apple flex items-center justify-center gap-2.5 disabled:opacity-50">
                {isProcessing ? <Loader2 size={15} className="animate-spin" /> : <Sparkles size={15} />}
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

          return (
            <div className="flex flex-col items-center justify-center min-h-[85vh] px-6 animate-fade-in relative w-full h-full">
              {/* Massive Apple/Google-like branding */}
              <div className="mb-20 flex flex-col items-center">
                <div className="w-16 h-16 rounded-full border border-black/30 flex items-center justify-center mb-6 bg-transparent">
                   <Home size={24} className="text-[#1d1d1f]" strokeWidth={1.5} />
                </div>
                <h1 className="text-5xl sm:text-7xl font-light tracking-tight text-[#1d1d1f] flex flex-col sm:flex-row items-center justify-center gap-3 w-full text-center">
                  <span className="font-semibold">Lon</span> Suite
                </h1>
                <p className="text-xs sm:text-[13px] text-[#1d1d1f] tracking-[0.3em] uppercase mt-4 font-semibold opacity-60">Ativos Científicos</p>
              </div>

              {/* Minimalist shortcut icons below */}
              <div className="flex items-center gap-9 sm:gap-14 mt-6">
                <button onClick={() => setView(ViewState.ATIVOS)} className="flex flex-col items-center gap-4 group">
                  <div className="w-[72px] h-[72px] sm:w-[84px] sm:h-[84px] rounded-full bg-transparent border border-black/10 flex items-center justify-center group-hover:border-[#1d1d1f] group-hover:bg-[#1d1d1f] transition-all duration-300">
                    <LayoutGrid size={26} strokeWidth={1} className="text-[#86868b] group-hover:text-white transition-colors" />
                  </div>
                  <span className="text-[11px] font-semibold text-[#86868b] group-hover:text-[#1d1d1f] transition-colors uppercase tracking-widest">Ativos</span>
                </button>

                <button onClick={() => setView(ViewState.CASES)} className="flex flex-col items-center gap-4 group">
                  <div className="w-[72px] h-[72px] sm:w-[84px] sm:h-[84px] rounded-full bg-transparent border border-black/10 flex items-center justify-center group-hover:border-[#1d1d1f] group-hover:bg-[#1d1d1f] transition-all duration-300">
                    <Stethoscope size={26} strokeWidth={1} className="text-[#86868b] group-hover:text-white transition-colors" />
                  </div>
                  <span className="text-[11px] font-semibold text-[#86868b] group-hover:text-[#1d1d1f] transition-colors uppercase tracking-widest">Cases</span>
                </button>
                
                <button onClick={() => { setView(ViewState.ATIVOS); setShowUploadModal(true); }} className="flex flex-col items-center gap-4 group">
                  <div className="w-[72px] h-[72px] sm:w-[84px] sm:h-[84px] rounded-full bg-transparent border border-black/10 flex items-center justify-center group-hover:border-[#1d1d1f] group-hover:bg-[#1d1d1f] transition-all duration-300 relative">
                    <Plus size={26} strokeWidth={1} className="text-[#86868b] group-hover:text-white transition-colors" />
                  </div>
                  <span className="text-[11px] font-semibold text-[#86868b] group-hover:text-[#1d1d1f] transition-colors uppercase tracking-widest">Uploads</span>
                </button>
              </div>

              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[10px] text-[#aeaeb2] font-semibold tracking-wider uppercase opacity-60">
                {totalAssets} Ativos · {totalCases} Cases
              </div>
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
                      <Sparkles size={12} className="text-[#4285F4] opacity-0 group-focus-within:opacity-100 transition-opacity" />
                    </div>
                    <input type="text" placeholder="Busca com IA..."
                      value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-white border border-black/8 rounded-apple-lg text-[13px] outline-none focus:border-[#4285F4]/30 focus:shadow-[0_0_0_3px_rgba(0,113,227,0.08)] transition-all placeholder:text-[#aeaeb2] shadow-apple" />
                  </div>

                  {/* Chip filters */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {Array.from(new Set(assets.flatMap(a => a.tags || []))).filter(t => typeof t === 'string' && t.trim() !== '').slice(0, 10).map(tag => (
                      <button key={tag} onClick={() => setSearchQuery(tag)}
                        className={`px-3.5 py-2 rounded-apple text-[12px] font-medium transition-all bg-white text-[#86868b] border border-black/8 hover:border-[#4285F4] hover:text-[#4285F4] shadow-sm`}>
                        {tag}
                      </button>
                    ))}
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

                {/* Search */}
                <div className="max-w-xl group">
                  <div className="relative">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                      <Search size={15} className="text-[#86868b] group-focus-within:text-[#4285F4] transition-colors" />
                    </div>
                    <input type="text" placeholder="Localizar case por título, tag ou conteúdo..."
                      value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-white border border-black/8 rounded-apple-lg text-[13px] outline-none focus:border-[#4285F4]/30 focus:shadow-[0_0_0_3px_rgba(0,113,227,0.08)] transition-all placeholder:text-[#aeaeb2] shadow-apple" />
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
