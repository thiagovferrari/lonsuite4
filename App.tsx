import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { ViewState, Asset, EvidenceLevel, AssetType, CaseBlock, CaseStatus, Attachment } from './types';
import Sidebar from './components/Sidebar';
import AssetCard from './components/AssetCard';
import AssetModal from './components/AssetModal';
import LoginPage from './components/LoginPage';
import { analyzeAsset, searchAssetsWithAI, searchCasesWithAI, generateCaseSemanticTags, getAIUsage } from './services/geminiService';
import { saveAttachmentData, getAttachmentData, deleteAttachmentData } from './services/storageService';
import { supabase } from './services/supabase';
import { clearStoredUser, getStoredUser, storeUser, signOut as authSignOut } from './services/authService';
import type { AuthUser } from './services/authService';
import { Plus, Brain, FileText, Image as ImageIcon, Type as TypeIcon, Loader2, ChevronLeft, Trash2, Search, LayoutGrid, RotateCcw, ChevronRight, Briefcase, X, AlertCircle, Stethoscope, Download, Home, Lock, Award, Zap, Copy, CheckCircle2, Maximize2, Minimize2, Sparkles, AlignJustify, LogOut, TrendingUp, Share2, BookOpen, Link2, ExternalLink, Clock, Save, ArrowUp, ArrowDown } from 'lucide-react';

const ASSET_STORAGE_PREFIX = 'lon_assets_';
const ASSET_BACKUP_PREFIX = 'lon_assets_backup_';
const SUPABASE_TIMEOUT_MS = 18000;

async function withSupabaseTimeout<T>(promise: PromiseLike<T>, label: string): Promise<T> {
  let timeoutId: number | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timeoutId = window.setTimeout(() => reject(new Error(`${label} demorou para responder.`)), SUPABASE_TIMEOUT_MS);
  });

  try {
    return await Promise.race([Promise.resolve(promise), timeout]);
  } finally {
    if (timeoutId) window.clearTimeout(timeoutId);
  }
}

const parseAssetArray = (raw: string | null): Asset[] => {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(Boolean) as Asset[] : [];
  } catch {
    return [];
  }
};

const assetTime = (asset: Asset) => {
  const date = asset.updatedAt || asset.createdAt || asset.date;
  const time = date ? new Date(date).getTime() : 0;
  return Number.isFinite(time) ? time : 0;
};

const mergeAssetSets = (...sets: Asset[][]): Asset[] => {
  const map = new Map<string, Asset>();
  sets.flat().forEach(asset => {
    if (!asset?.id) return;
    const existing = map.get(asset.id);
    if (!existing || assetTime(asset) >= assetTime(existing)) {
      map.set(asset.id, { ...existing, ...asset });
    }
  });
  return Array.from(map.values()).sort((a, b) => assetTime(b) - assetTime(a));
};

const readLocalAssetRecovery = (preferredKey: string): Asset[] => {
  return parseAssetArray(localStorage.getItem(preferredKey));
};

const safeLocalSet = (key: string, value: string) => {
  try {
    localStorage.setItem(key, value);
  } catch (error) {
    console.warn(`[Lon Suite] Não foi possível salvar cache local "${key}".`, error);
  }
};

const mapAssetRow = (a: Record<string, unknown>): Asset => ({
  ...(a as unknown as Asset),
  type: (a.type as AssetType | undefined) || 'image',
  tags: Array.isArray(a.tags) ? a.tags as string[] : [],
  date: (a.date || a.created_at || new Date().toISOString()) as string,
  thumbnail: (a.thumbnail || a.thumbnail_url || a.file_url) as string | undefined,
  content: (a.content || a.file_url || a.thumbnail_url) as string | undefined,
  scientificContext: a.scientific_context as string | undefined,
  createdAt: a.created_at as string | undefined,
  updatedAt: a.updated_at as string | undefined,
  ownerId: a.owner_id as string | undefined,
  attachments: Array.isArray(a.attachments) ? a.attachments as Attachment[] : [],
  isDeleted: Boolean(a.is_deleted),
  deletedAt: a.deleted_at as string | undefined,
});

const mapCaseRow = (c: Record<string, unknown>): Asset => ({
  ...(c as unknown as Asset),
  type: 'case',
  tags: Array.isArray(c.tags) ? c.tags as string[] : ['Caso'],
  date: (c.date || c.created_at || new Date().toISOString()) as string,
  blocks: Array.isArray(c.blocks) ? c.blocks as CaseBlock[] : [],
  caseStatus: c.status as CaseStatus | undefined,
  visibility: c.visibility as Asset['visibility'],
  ownerId: c.owner_id as string | undefined,
  ownerName: c.owner_name as string | undefined,
  createdAt: c.created_at as string | undefined,
  updatedAt: c.updated_at as string | undefined,
  isDeleted: Boolean(c.is_deleted),
  deletedAt: c.deleted_at as string | undefined,
});

const App: React.FC = () => {
  // Core State
  const [view, setView] = useState<ViewState>(ViewState.HOME);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(true);



  // UI State
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [pendingUpload, setPendingUpload] = useState<{ files: File[], base64s: string[] } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ step: number; total: number; label: string } | null>(null);

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
  const [newAssetId, setNewAssetId] = useState<string | null>(null);

  // Presentation Mode
  const [presentationMode, setPresentationMode] = useState(false);
  const [presentationBlockIdx, setPresentationBlockIdx] = useState(0);
  const [isGeneratingCasePdf, setIsGeneratingCasePdf] = useState(false);

  // Ghostwriter
  const [showGhostwriter, setShowGhostwriter] = useState(false);
  const [ghostwriterResult, setGhostwriterResult] = useState<string | null>(null);
  const [isGeneratingArticle, setIsGeneratingArticle] = useState(false);
  const [copiedGhostwriter, setCopiedGhostwriter] = useState(false);

  // Certification
  const [caseCertHash, setCaseCertHash] = useState<string | null>(null);
  const [copiedCert, setCopiedCert] = useState(false);

  // Cases view mode
  const [caseViewMode, setCaseViewMode] = useState<'list' | 'grid'>('list');
  const [assetTileSize, setAssetTileSize] = useState<'small' | 'medium' | 'large'>('small');
  const [dataLoadNotice, setDataLoadNotice] = useState<string | null>(null);

  // Confirmation Dialog State
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  } | null>(null);
  const [appToast, setAppToast] = useState<{ message: string; tone?: 'success' | 'info' | 'warning' } | null>(null);

  // Auth
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => getStoredUser());
  const [profileDraft, setProfileDraft] = useState({
    name: currentUser?.name || '',
    specialty: currentUser?.specialty || '',
    avatarUrl: currentUser?.avatarUrl || '',
  });

  // Derived owner helpers
  const ownerId  = currentUser?.id  ?? 'guest';
  const ownerName = currentUser?.name ?? '';
  const isOfflineUser = ownerId.startsWith('offline:');

  const showAppToast = useCallback((message: string, tone: 'success' | 'info' | 'warning' = 'success') => {
    setAppToast({ message, tone });
    window.setTimeout(() => setAppToast(current => current?.message === message ? null : current), 2400);
  }, []);

  // Homepage Search State
  const [homeSearchQuery, setHomeSearchQuery] = useState('');
  const [homeSearchResults, setHomeSearchResults] = useState<Asset[]>([]);
  const [homeSearchLoading, setHomeSearchLoading] = useState(false);
  const [homeHasSearched, setHomeHasSearched] = useState(false);
  const [brokenPreviewIds, setBrokenPreviewIds] = useState<Set<string>>(() => new Set());

  const fileInputRef = useRef<HTMLInputElement>(null);
  const homeScrollRef = useRef<HTMLDivElement>(null);
  const lastCloudLoadWasEmptyRef = useRef(false);

  // Helper para auto-ajuste de altura em textareas
  const autoResizeTextarea = (element: HTMLTextAreaElement | null) => {
    if (element) {
      element.style.height = 'auto';
      element.style.height = element.scrollHeight + 'px';
    }
  };

  const LOCAL_STORAGE_ASSETS_KEY = `lon_assets_${ownerId}`;

  useEffect(() => {
    setProfileDraft({
      name: currentUser?.name || '',
      specialty: currentUser?.specialty || '',
      avatarUrl: currentUser?.avatarUrl || '',
    });
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser || currentUser.id.startsWith('offline:')) return;
    let cancelled = false;

    withSupabaseTimeout(supabase.auth.getSession(), 'Verificação de sessão no Supabase')
      .then(({ data }) => {
        if (cancelled || data.session) return;
        clearStoredUser();
        setCurrentUser(null);
        setAssets([]);
      })
      .catch(() => {
        // Keep the current user during transient network failures.
      });

    return () => { cancelled = true; };
  }, [currentUser]);

  // Persist assets to localStorage whenever they change
  useEffect(() => {
    if (isRefreshing || ownerId === 'guest') return;

    if (assets.length > 0) {
      const payload = JSON.stringify(assets);
      safeLocalSet(LOCAL_STORAGE_ASSETS_KEY, payload);
      safeLocalSet(`${ASSET_BACKUP_PREFIX}${ownerId}`, payload);
      lastCloudLoadWasEmptyRef.current = false;
      return;
    }

    const existing = readLocalAssetRecovery(LOCAL_STORAGE_ASSETS_KEY);
    if (existing.length > 0 || lastCloudLoadWasEmptyRef.current) {
      console.warn('Lon Suite: empty asset state blocked to protect local recovery data.');
      return;
    }
  }, [assets, isRefreshing, ownerId, LOCAL_STORAGE_ASSETS_KEY]);

  // Initial Load: Supabase first, localStorage fallback
  useEffect(() => {
    if (!currentUser) return;

    const loadCloudData = async (scopeOwnerId: string): Promise<Asset[]> => {
      const scopedAssetsQuery = supabase.from('assets').select('*').eq('owner_id', scopeOwnerId).order('created_at', { ascending: false }).limit(1000);
      const scopedCasesQuery = supabase.from('cases').select('*').eq('owner_id', scopeOwnerId).order('created_at', { ascending: false }).limit(1000);

      const [{ data: assetsData, error: assetsError }, { data: casesData, error: casesError }] = await Promise.all([
        withSupabaseTimeout(scopedAssetsQuery, 'Leitura dos ativos do usuário no Supabase'),
        withSupabaseTimeout(scopedCasesQuery, 'Leitura dos cases do usuário no Supabase'),
      ]);

      if (assetsError || casesError) throw assetsError || casesError;

      return [
        ...(assetsData || []).map((a: Record<string, unknown>) => mapAssetRow(a)),
        ...(casesData || []).map((c: Record<string, unknown>) => mapCaseRow(c)),
      ];
    };

    const fetchInitialData = async () => {
      setIsRefreshing(true);
      setDataLoadNotice(null);
      const localSnapshot = readLocalAssetRecovery(LOCAL_STORAGE_ASSETS_KEY);
      if (localSnapshot.length > 0) setAssets(localSnapshot);

      try {
        const mappedAssets = isOfflineUser ? [] : await loadCloudData(ownerId);

        if (mappedAssets.length > 0) {
          lastCloudLoadWasEmptyRef.current = false;
          setAssets(mergeAssetSets(mappedAssets, localSnapshot));
        } else if (localSnapshot.length > 0) {
          lastCloudLoadWasEmptyRef.current = true;
          setAssets(localSnapshot);
          if (!isOfflineUser) localSnapshot.forEach(asset => syncToCloud(asset));
        } else {
          lastCloudLoadWasEmptyRef.current = true;
          setAssets([]);
        }
      } catch {
        // Supabase not configured — load from localStorage
        try {
          if (localSnapshot.length > 0) setAssets(localSnapshot);
          else setDataLoadNotice('Não consegui consultar o Supabase agora. Tente atualizar em alguns segundos.');
        } catch { /* start fresh */ }
      } finally {
        setIsRefreshing(false);
      }
    };

    fetchInitialData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  // Sync asset to Supabase (fire-and-forget; localStorage always updated via effect)
  const syncToCloud = useCallback(async (asset: Asset) => {
    if (ownerId === 'guest' || ownerId.startsWith('offline:')) return;
    try {
      const base = { owner_id: ownerId };
      if (asset.type === 'case') {
        await withSupabaseTimeout(supabase.from('cases').upsert({
          ...base,
          id: asset.id,
          title: asset.title,
          description: asset.description,
          blocks: asset.blocks,
          tags: asset.tags,
          status: asset.caseStatus,
          visibility: asset.visibility,
          shared_with: asset.sharedWith || [],
          access_count: asset.accessCount || 0,
          is_deleted: Boolean(asset.isDeleted),
          deleted_at: asset.deletedAt,
          owner_name: ownerName,
          created_at: asset.createdAt,
        }), 'Gravação do case no Supabase');
      } else {
        await withSupabaseTimeout(supabase.from('assets').upsert({
          ...base,
          id: asset.id,
          title: asset.title,
          type: asset.type,
          content: asset.content,
          thumbnail: asset.thumbnail,
          description: asset.description,
          attachments: asset.attachments || [],
          summary: asset.summary,
          scientific_context: asset.scientificContext,
          tags: asset.tags,
          is_deleted: Boolean(asset.isDeleted),
          deleted_at: asset.deletedAt,
          created_at: asset.createdAt,
        }), 'Gravação do ativo no Supabase');
      }
    } catch {
      // Supabase offline — localStorage effect already handles persistence
    }
  }, [ownerId, ownerName]);

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
      safeLocalSet('lon_suite_recent', JSON.stringify(newRecent));
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

  useEffect(() => {
    if (!presentationMode || !editingCase) return;
    const total = (editingCase.blocks || []).filter(b => b.content || b.type === 'image' || b.assetId).length;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setPresentationMode(false);
      if (event.key === 'ArrowLeft') setPresentationBlockIdx(i => Math.max(0, i - 1));
      if (event.key === 'ArrowRight' || event.key === ' ') setPresentationBlockIdx(i => Math.min(total - 1, i + 1));
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [presentationMode, editingCase]);

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
  const assetGridClass = {
    small: 'grid-cols-[repeat(auto-fill,minmax(112px,1fr))] gap-2.5',
    medium: 'grid-cols-[repeat(auto-fill,minmax(148px,1fr))] gap-3 sm:gap-4',
    large: 'grid-cols-[repeat(auto-fill,minmax(210px,1fr))] gap-4 sm:gap-5',
  }[assetTileSize];

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
    setUploadProgress({
      step: 0,
      total: Math.max(1, pendingUpload.files.length + (useAI ? 1 : 0) + 1),
      label: 'Preparando arquivos...',
    });
    let firstNewAsset: Asset | null = null;

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
          setUploadProgress(prev => ({ step: Math.max(prev?.step ?? 0, 1), total: prev?.total ?? pendingUpload.files.length + 2, label: 'IA analisando o primeiro arquivo...' }));
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
          setUploadProgress({
            step: (useAI ? 1 : 0) + i + 1,
            total: pendingUpload.files.length + (useAI ? 1 : 0) + 1,
            label: `Enviando ${file.name}`,
          });

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
        setUploadProgress({
          step: pendingUpload.files.length + (useAI ? 1 : 0) + 1,
          total: pendingUpload.files.length + (useAI ? 1 : 0) + 1,
          label: 'Sincronizando ativo...',
        });
        syncToCloud(groupAsset);
        firstNewAsset = groupAsset;

      } else {
        // INDIVIDUAL MODE: Each file becomes a separate asset
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
            setUploadProgress({
              step: i + 1,
              total: pendingUpload.files.length * 2 + 1,
              label: `IA analisando ${file.name}`,
            });
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

          setUploadProgress({
            step: (useAI ? pendingUpload.files.length : 0) + i + 1,
            total: pendingUpload.files.length * (useAI ? 2 : 1) + 1,
            label: `Enviando ${file.name}`,
          });
          const publicUrl = await saveAttachmentData(assetId, base64);

          const newAsset: Asset = {
            id: assetId,
            ...assetData,
            type: assetType,
            date: new Date().toISOString(),
            thumbnail: publicUrl,
            content: publicUrl,
            createdAt: new Date().toISOString()
          };

          newAssets.push(newAsset);
          await syncToCloud(newAsset);
        }

        setUploadProgress({
          step: pendingUpload.files.length * (useAI ? 2 : 1) + 1,
          total: pendingUpload.files.length * (useAI ? 2 : 1) + 1,
          label: 'Finalizando biblioteca...',
        });
        setAssets(prev => [...newAssets, ...prev]);
        if (newAssets.length > 0) firstNewAsset = newAssets[0];
      }
    } catch (criticalError) {
      console.error('Critical error in processUpload:', criticalError);
      showAppToast('Não consegui concluir o upload agora. Tente novamente.', 'warning');
    } finally {
      setPendingUpload(null);
      setIsProcessing(false);
      setUploadProgress(null);
      setUploadMode('single');
      // Auto-open modal for manual uploads so user fills in details
      if (firstNewAsset && !useAI) {
        setNewAssetId(firstNewAsset.id);
        setSelectedAsset(firstNewAsset);
      }
      if (firstNewAsset) showAppToast('Upload concluído e ativo salvo.');
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
    showAppToast('Item enviado para a lixeira.', 'info');
  };


  // Permanent delete
  const handlePermanentDelete = async (id: string) => {
    const assetToRemove = assets.find(a => a.id === id);
    setAssets(prev => prev.filter(a => a.id !== id));
    if (selectedAsset?.id === id) setSelectedAsset(null);

    try {
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
        await withSupabaseTimeout(
          supabase.from(table).delete().eq('id', id),
          'Exclusão permanente no Supabase',
        );
      }
    } catch (err) {
      console.error('Erro ao deletar permanente:', err);
      showAppToast('Não consegui confirmar a exclusão na nuvem.', 'warning');
      return;
    }
    showAppToast('Item excluído permanentemente.', 'info');
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
    showAppToast('Item restaurado.');
  };


  // Empty trash
  const handleEmptyTrash = () => {
    setConfirmDialog({
      isOpen: true,
      title: 'Esvaziar Lixeira?',
      message: 'Esta ação não pode ser desfeita. Todos os itens da lixeira serão permanentemente removidos.',
      onConfirm: () => {
        const ids = trashedAssets.map(asset => asset.id);
        setAssets(prev => prev.filter(a => !ids.includes(a.id)));
        trashedAssets.forEach(asset => {
          if (asset.attachments) {
            asset.attachments.forEach(att => deleteAttachmentData(att.id));
          }
          deleteAttachmentData(asset.id);
          const table = asset.type === 'case' ? 'cases' : 'assets';
          withSupabaseTimeout(
            supabase.from(table).delete().eq('id', asset.id),
            'Exclusão permanente no Supabase',
          ).catch(err => console.error('Erro ao deletar item da lixeira:', err));
        });
        showAppToast('Lixeira esvaziada.', 'info');
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
    showAppToast('Novo case criado.');
  };

  // Case Editor Functions
  const syncCase = (updated: Asset) => {
    const withTimestamp = { ...updated, updatedAt: new Date().toISOString() };
    setEditingCase(withTimestamp);
    setAssets(prev => prev.map(a => a.id === updated.id ? withTimestamp : a));
    
    // Sync to Supabase
    syncToCloud(withTimestamp);
  };

  const handleSaveCaseChanges = () => {
    if (!editingCase) return;
    const withTimestamp = { ...editingCase, updatedAt: new Date().toISOString() };
    setEditingCase(withTimestamp);
    setAssets(prev => prev.map(a => a.id === withTimestamp.id ? withTimestamp : a));
    syncToCloud(withTimestamp);
    setSaveStatus('saved');
    setTimeout(() => setSaveStatus('idle'), 1800);
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


  // Certification hash (deterministic, no crypto dependency needed)
  const generateCertHash = (c: Asset): string => {
    const data = `${c.id}|${c.title}|${c.createdAt}|${c.ownerId || 'local'}`;
    let h = 0x811c9dc5;
    for (let i = 0; i < data.length; i++) {
      h ^= data.charCodeAt(i);
      h = Math.imul(h, 0x01000193);
    }
    return `LON-${(h >>> 0).toString(16).toUpperCase().padStart(8, '0')}`;
  };

  // Local ghostwriter (no API cost — structure-based)
  const generateArticleDraft = () => {
    setIsGeneratingArticle(true);
    const cases = activeAssets.filter(a => a.type === 'case').slice(0, 15);
    const n = cases.length;
    const tags = [...new Set(cases.flatMap(c => c.tags || []).filter(t => t !== 'Caso'))].slice(0, 6).join(', ');
    const completedCases = cases.filter(c => c.caseStatus === 'completo').length;

    setTimeout(() => {
      setGhostwriterResult(`# Rascunho de Artigo Científico
*Gerado pelo Lon Suite 4.0 · ${new Date().toLocaleDateString('pt-BR')}*

---

## Título Sugerido
${tags ? `Análise de ${tags}: Série de ${n} Casos` : `Série de Casos Clínicos — ${n} Pacientes`}

---

## 1. Introdução

A documentação sistemática de casos clínicos representa uma das bases do conhecimento médico. Este artigo apresenta uma série de ${n} casos${tags ? ` nas áreas de ${tags}` : ''}, documentados e analisados com metodologia estruturada.

A relevância desta série reside na necessidade de consolidar evidências clínicas de forma reprodutível, contribuindo para a formação de protocolos baseados em evidências.

## 2. Metodologia

**Desenho do estudo:** Série de casos retrospectiva.
**Período:** ${new Date(Math.min(...cases.map(c => new Date(c.createdAt || c.date).getTime()))).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })} a ${new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}.
**N amostral:** ${n} casos documentados (${completedCases} completos, ${n - completedCases} em andamento).
**Critérios de inclusão:** Casos documentados com evidência fotográfica e narrativa clínica estruturada.
**Critérios de exclusão:** Documentação incompleta ou dados insuficientes para análise.

## 3. Resultados

Foram analisados ${n} casos clínicos. Os principais achados incluem:

${cases.slice(0, 5).map((c, i) => `- **Caso ${i + 1}:** ${c.title || 'Caso sem título'}${c.tags?.length ? ` (${c.tags.slice(0, 2).join(', ')})` : ''}`).join('\n')}
${n > 5 ? `- *...e mais ${n - 5} casos documentados.*` : ''}

As evidências coletadas sugerem padrões consistentes que merecem investigação prospectiva adicional.

## 4. Discussão

Os resultados desta série de casos alinham-se com a literatura vigente e apontam para [inserir discussão específica baseada nos seus casos].

**Limitações:** Caráter retrospectivo, tamanho amostral limitado, ausência de grupo controle.

## 5. Conclusão

Esta série de ${n} casos demonstra [inserir conclusão específica]. Estudos prospectivos com maior casuística são necessários para validação das hipóteses levantadas.

---

## Referências
[Inserir referências no formato ABNT/Vancouver conforme a revista alvo]

---
*⚠️ Este é um rascunho estrutural gerado pelo Lon Suite 4.0. Revise, complete e adapte conforme as diretrizes da revista alvo antes da submissão.*`);
      setIsGeneratingArticle(false);
    }, 1800);
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

  const moveCaseBlock = (blockId: string, direction: 'up' | 'down') => {
    if (!editingCase?.blocks) return;
    const currentIndex = editingCase.blocks.findIndex(block => block.id === blockId);
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (currentIndex < 0 || targetIndex < 0 || targetIndex >= editingCase.blocks.length) return;

    const nextBlocks = [...editingCase.blocks];
    const [movedBlock] = nextBlocks.splice(currentIndex, 1);
    nextBlocks.splice(targetIndex, 0, movedBlock);
    syncCase({ ...editingCase, blocks: nextBlocks });
    window.setTimeout(() => {
      document.getElementById(blockId)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 80);
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

  const isRenderableImageSource = (src?: string | null) => {
    if (!src || typeof src !== 'string') return false;
    const clean = src.trim();
    if (!clean || clean.startsWith('data:application/pdf')) return false;
    if (clean.startsWith('data:image') || clean.startsWith('blob:')) return true;
    if (!clean.startsWith('http')) return false;
    if (/\.(pdf|ppt|pptx|doc|docx|xls|xlsx)(\?|#|$)/i.test(clean)) return false;
    return /\.(png|jpe?g|webp|gif|avif|heic|heif)(\?|#|$)/i.test(clean) || clean.includes('/storage/v1/object/');
  };

  const getAssetPreviewSource = (asset: Asset) => {
    if (asset.type === 'pdf' || asset.type === 'document') return null;
    const imageAttachment = asset.attachments?.find(att => typeof att.type === 'string' && att.type.startsWith('image/'));
    const candidates = [asset.thumbnail, asset.content, imageAttachment?.data].filter((value): value is string => typeof value === 'string' && value.length > 0);
    return candidates.find(isRenderableImageSource) || null;
  };

  const getAssetVisualSource = async (asset: Asset): Promise<string> => {
    if (asset.type === 'pdf' || asset.type === 'document') return '';
    const candidates = [asset.thumbnail, asset.content].filter((value): value is string => typeof value === 'string' && value.length > 0);
    const directImage = candidates.find(isRenderableImageSource);
    if (directImage) return directImage;

    const firstImageAttachment = asset.attachments?.find(att => typeof att.type === 'string' && att.type.startsWith('image/'));
    if (firstImageAttachment) {
      const src = firstImageAttachment.data || await getAttachmentData(firstImageAttachment.id);
      if (src) return src;
    }

    return '';
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
    if (!editingCase || isGeneratingCasePdf) return;
    setIsGeneratingCasePdf(true);
    try {
    const jsPDF = (await import('jspdf')).default;
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pageWidth = 210;
    const margin = 20;
    const contentWidth = pageWidth - margin * 2;
    let y = margin;

    const checkPage = (needed: number) => {
      if (y + needed > 280) { doc.addPage(); y = margin; }
    };

    const normalizeImageForPdf = async (src: string): Promise<string> => {
      if (!src.startsWith('data:image')) return src;

      return new Promise(resolve => {
        const img = new Image();
        img.onload = () => {
          try {
            const width = img.naturalWidth || img.width;
            const height = img.naturalHeight || img.height;
            if (!width || !height) {
              resolve(src);
              return;
            }

            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            if (!ctx) {
              resolve(src);
              return;
            }

            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, width, height);
            ctx.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL('image/jpeg', 0.94));
          } catch {
            resolve(src);
          }
        };
        img.onerror = () => resolve(src);
        img.src = src;
      });
    };

    const sourceToDataUrl = async (src: string, fallbackMime = 'image/jpeg'): Promise<string> => {
      if (!src) return '';
      if (src.startsWith('data:image')) return normalizeImageForPdf(src);
      if (src.startsWith('data:application/pdf')) return '';
      if (!src.startsWith('http')) return src.startsWith('data:') ? src : '';

      const controller = new AbortController();
      const timeout = window.setTimeout(() => controller.abort(), 4500);
      try {
        const res = await fetch(src, { mode: 'cors', cache: 'force-cache', signal: controller.signal });
        if (!res.ok) return '';
        const blob = await res.blob();
        return await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = async () => resolve(await normalizeImageForPdf(reader.result as string));
          reader.onerror = reject;
          reader.readAsDataURL(blob.type ? blob : new Blob([blob], { type: fallbackMime }));
        });
      } catch {
        return '';
      } finally {
        window.clearTimeout(timeout);
      }
    };

    const drawImageData = (imgData: string, maxWidth: number, maxHeight: number): boolean => {
      if (!imgData.startsWith('data:image')) return false;
      try {
        const imgProps = doc.getImageProperties(imgData);
        const imgWidth = maxWidth;
        const imgHeight = Math.min((imgProps.height / imgProps.width) * imgWidth, maxHeight);
        checkPage(imgHeight + 14);
        const formatMatch = imgData.match(/^data:image\/(.*?);/);
        let format = formatMatch ? formatMatch[1].toUpperCase() : 'JPEG';
        if (format === 'SVG+XML') format = 'PNG';
        doc.addImage(imgData, format, margin + (contentWidth - imgWidth) / 2, y, imgWidth, imgHeight);
        y += imgHeight + 8;
        return true;
      } catch {
        return false;
      }
    };

    const normalizePdfText = (value?: string | null) => {
      return (value || '')
        .replace(/\r\n/g, '\n')
        .replace(/\t/g, ' ')
        .replace(/([^\s]{42})(?=[^\s])/g, '$1 ');
    };

    const pdfLines = (value: string | null | undefined, width = contentWidth): string[] => {
      const lines = doc.splitTextToSize(normalizePdfText(value), width);
      return Array.isArray(lines) ? lines : [lines];
    };

    const writePdfLines = (value: string | null | undefined, options?: { width?: number; size?: number; after?: number }) => {
      const width = options?.width || contentWidth;
      const fontSize = options?.size || 5;
      const lines = pdfLines(value, width);
      checkPage(lines.length * fontSize + (options?.after || 0));
      doc.text(lines, margin, y, { align: 'left' });
      y += lines.length * fontSize + (options?.after || 0);
    };

    // Title — left aligned
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.setTextColor(29, 29, 31);
    const titleLines = pdfLines(editingCase.title || 'Caso Clínico');
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
      writePdfLines(editingCase.tags.join(' - '), { size: 4, after: 4 });
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
        const lines = pdfLines(block.content);
        doc.text(lines, margin, y, { align: 'left' });
        y += lines.length * 7 + 6;
      } else if (block.type === 'subtitle') {
        checkPage(10);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(14);
        doc.setTextColor(50, 50, 55);
        const lines = pdfLines(block.content);
        doc.text(lines, margin, y, { align: 'left' });
        y += lines.length * 6 + 5;
      } else if (block.type === 'reference') {
        checkPage(10);
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(9);
        doc.setTextColor(134, 134, 139);
        const refText = block.content || '';
        const lines = pdfLines(refText, contentWidth - 6);
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
        const lines = pdfLines(block.content);
        doc.text(lines, margin, y, { align: 'left' });
        y += lines.length * 5.5 + 6;
      } else if (block.type === 'image' && block.content) {
        // Format: data:image/...###caption|||data:image/...###caption2
        const entries = block.content.split('|||').filter(Boolean);
        for (const entry of entries) {
          const separatorIndex = entry.indexOf('###');
          const imgData = separatorIndex >= 0 ? entry.slice(0, separatorIndex) : entry;
          const caption = separatorIndex >= 0 ? entry.slice(separatorIndex + 3) : '';
          
          const finalImgData = await sourceToDataUrl(imgData);

          // Render image
          if (finalImgData) {
            drawImageData(finalImgData, contentWidth, 240);
          } else if (imgData) {
            checkPage(12);
            doc.setFont('helvetica', 'italic');
            doc.setFontSize(9);
            doc.setTextColor(174, 174, 178);
            doc.text('[Imagem indisponível no momento da exportação]', margin, y);
            y += 8;
          }
          
          // Render caption (legenda) — always after its image
          if (caption && caption.trim()) {
            doc.setFont('helvetica', 'italic');
            doc.setFontSize(9);
            doc.setTextColor(134, 134, 139);
            const captionLines = pdfLines(caption.trim());
            checkPage(captionLines.length * 4 + 4);
            doc.text(captionLines, margin, y, { align: 'left' });
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
          const assetTitle = `> ${linkedAsset.title}`;
          const assetTitleLines = pdfLines(assetTitle);
          doc.text(assetTitleLines, margin, y, { align: 'left' });
          y += assetTitleLines.length * 5 + 3;

          const assetShareUrl = `${window.location.origin}?share=${linkedAsset.id}&type=asset`;
          checkPage(8);
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(8);
          doc.setTextColor(0, 113, 227);
          doc.textWithLink('Abrir ativo relacionado na Lon Suite', margin, y, { url: assetShareUrl });
          y += 5;
          doc.setTextColor(134, 134, 139);
          const assetUrlLines = pdfLines(assetShareUrl);
          doc.text(assetUrlLines, margin, y);
          y += assetUrlLines.length * 4 + 4;

          // Tags
          if (linkedAsset.tags && linkedAsset.tags.length > 0) {
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(8);
            doc.setTextColor(134, 134, 139);
            writePdfLines(linkedAsset.tags.join(' - '), { size: 4, after: 1 });
          }

          const linkedVisualSource = await getAssetVisualSource(linkedAsset);
          if (linkedVisualSource) {
            const linkedImg = await sourceToDataUrl(linkedVisualSource);
            if (!drawImageData(linkedImg, Math.min(contentWidth, 140), 180)) {
              checkPage(8);
              doc.setFont('helvetica', 'italic');
              doc.setFontSize(8);
              doc.setTextColor(174, 174, 178);
              doc.text(linkedAsset.type === 'pdf' ? '[PDF vinculado disponível pelo link acima]' : '[Miniatura indisponível no momento da exportação]', margin, y);
              y += 6;
            }
          }

          // Summary/Description
          if (linkedAsset.summary || linkedAsset.scientificContext) {
            checkPage(10);
            doc.setFont('helvetica', 'italic');
            doc.setFontSize(10);
            doc.setTextColor(100, 100, 105);
            const refText = linkedAsset.summary || linkedAsset.scientificContext || '';
            const summaryLines = pdfLines(`"${refText}"`);
            doc.text(summaryLines, margin, y, { align: 'left' });
            y += summaryLines.length * 4.5 + 4;
          }

          // Scientific Context (if different from summary)
          if (linkedAsset.scientificContext && linkedAsset.summary && linkedAsset.scientificContext !== linkedAsset.summary) {
            checkPage(10);
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(9);
            doc.setTextColor(120, 120, 125);
            const ctxLines = pdfLines(linkedAsset.scientificContext);
            doc.text(ctxLines, margin, y, { align: 'left' });
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
    } catch (error) {
      console.error('Erro ao gerar PDF do case:', error);
      alert('Não consegui gerar o PDF agora. O case continua salvo; tente novamente após recarregar a página.');
    } finally {
      setIsGeneratingCasePdf(false);
    }
  };

  const renderCaseEditor = () => {
    if (!editingCase) return null;

    const caseBlocks = editingCase.blocks || [];
    const imageCount = caseBlocks.filter(b => b.type === 'image' && b.content).length;
    const textCount = caseBlocks.filter(b => b.type === 'text').length;
    const assetCount = caseBlocks.filter(b => b.type === 'asset').length;

    const statusOptions: { value: CaseStatus; label: string; dot: string }[] = [
      { value: 'em_andamento', label: 'Em Andamento', dot: 'bg-[#1d1d1f]' },
      { value: 'completo', label: 'Completo', dot: 'bg-[#6e6e73]' },
      { value: 'arquivado', label: 'Arquivado', dot: 'bg-slate-400' },
    ];

    return (
      <div className="w-full h-screen flex flex-col md:flex-row overflow-hidden bg-transparent">
        {/* Main Editor */}
        <div className="relative flex-1 overflow-y-auto no-scrollbar pb-40 md:pb-60">
          <div className="pointer-events-none fixed inset-y-0 left-[70px] right-[280px] hidden lg:block bg-[radial-gradient(circle_at_48%_0%,rgba(255,255,255,0.50),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.18),rgba(255,255,255,0.04))]" />
          <div className="relative max-w-[1000px] mx-auto pt-8 md:pt-20 px-4 sm:px-6 md:px-8">
            <button onClick={() => handleCloseCase()} className="mb-4 md:mb-12 flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-all text-[10px] font-bold uppercase tracking-[0.3em] group">
              <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Voltar aos Cases
            </button>

            {/* Mobile Action Bar — visible only when sidebar is hidden */}
            <div className="flex lg:hidden items-center gap-2 mb-6 overflow-x-auto no-scrollbar pb-1">
              <select
                value={editingCase.caseStatus || 'em_andamento'}
                onChange={e => syncCase({ ...editingCase, caseStatus: e.target.value as CaseStatus })}
                className="shrink-0 px-3 py-2 bg-white border border-black/8 rounded-apple text-[11px] font-medium text-[#1d1d1f] shadow-apple outline-none"
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
                className="button-nowrap flex shrink-0 items-center gap-1.5 px-3 py-2 bg-white border border-black/8 rounded-apple text-[11px] font-medium text-[#1d1d1f] shadow-apple"
              >
                <Share2 size={12} /> Compartilhar
              </button>
              <button
                onClick={handleSaveCaseChanges}
                className="button-nowrap flex shrink-0 items-center gap-1.5 px-3 py-2 bg-[#1d1d1f] rounded-apple text-[11px] font-semibold text-white shadow-apple"
              >
                <Save size={12} /> Salvar
              </button>
              <button
                onClick={handleDownloadCasePDF}
                disabled={isGeneratingCasePdf}
                className="button-nowrap flex shrink-0 items-center gap-1.5 px-3 py-2 bg-white border border-black/8 rounded-apple text-[11px] font-medium text-[#1d1d1f] shadow-apple"
              >
                {isGeneratingCasePdf ? <Loader2 size={12} className="animate-spin" /> : <Download size={12} />} PDF
              </button>
              <button
                onClick={() => { setPresentationMode(true); setPresentationBlockIdx(0); setCaseCertHash(null); }}
                className="button-nowrap flex shrink-0 items-center gap-1.5 px-3 py-2 bg-white border border-black/8 rounded-apple text-[11px] font-medium text-[#1d1d1f] shadow-apple"
              >
                <Maximize2 size={12} /> Apresentar
              </button>
            </div>

          <div className="space-y-8">
            {editingCase.blocks?.map((block, index) => (
              <div id={block.id} key={block.id} className="group relative scroll-mt-28 rounded-[24px] border border-transparent px-3 py-3 transition-all hover:border-white/70 hover:bg-white/34 hover:shadow-[0_18px_60px_rgba(0,0,0,0.035)] md:px-0 md:py-0 md:hover:bg-transparent md:hover:shadow-none">
                {block.type === 'title' ? (
                  <textarea
                    ref={(el) => autoResizeTextarea(el)}
                    value={block.content}
                    onChange={e => {
                      const nb = editingCase.blocks?.map(b => b.id === block.id ? { ...b, content: e.target.value } : b);
                      const newTitle = index === 0 ? e.target.value : editingCase.title;
                      syncCase({ ...editingCase, blocks: nb, title: newTitle || 'Novo Caso Clínico' });
                    }}
                    onInput={(e: any) => { e.target.style.height = 'auto'; e.target.style.height = e.target.scrollHeight + 'px'; }}
                    placeholder="Digite o título do caso..."
                    rows={1}
                    className="preserve-lines w-full resize-none overflow-hidden bg-transparent text-3xl md:text-5xl font-extralight tracking-tight text-slate-900 outline-none placeholder:text-slate-300/80 transition-colors focus:placeholder:text-slate-400"
                  />
                ) : block.type === 'subtitle' ? (
                  <textarea
                    ref={(el) => autoResizeTextarea(el)}
                    value={block.content}
                    onChange={e => {
                      const nb = editingCase.blocks?.map(b => b.id === block.id ? { ...b, content: e.target.value } : b);
                      syncCase({ ...editingCase, blocks: nb });
                    }}
                    onInput={(e: any) => { e.target.style.height = 'auto'; e.target.style.height = e.target.scrollHeight + 'px'; }}
                    placeholder="Subtítulo da seção..."
                    rows={1}
                    className="preserve-lines w-full resize-none overflow-hidden bg-transparent text-xl md:text-2xl font-semibold tracking-tight text-slate-800 outline-none placeholder:text-slate-300/80 transition-colors focus:placeholder:text-slate-400"
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
                      className="preserve-lines w-full bg-transparent text-sm md:text-base italic font-light leading-relaxed text-slate-500 outline-none resize-none placeholder:text-slate-200 overflow-hidden transition-colors focus:placeholder:text-slate-300"
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
                              className="inline-flex items-center gap-1 text-[10px] font-medium text-[#1d1d1f] hover:underline">
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
                    className="preserve-lines w-full bg-transparent text-base md:text-xl font-light leading-relaxed text-justify text-slate-600 outline-none resize-none placeholder:text-slate-200 overflow-hidden transition-colors focus:placeholder:text-slate-300"
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
                    <div className="bg-white rounded-2xl border border-black/[0.06] shadow-apple overflow-hidden">
                      {/* Asset header row */}
                      <div className="flex items-center gap-3 p-4 border-b border-black/[0.04]">
                        <div
                          className="w-14 h-14 rounded-[10px] overflow-hidden shrink-0 border border-black/[0.06] bg-[#f5f5f7] flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
                          onClick={() => setSelectedAsset(linkedAsset)}
                        >
                          {getAssetPreviewSource(linkedAsset) ? (
                            <img src={getAssetPreviewSource(linkedAsset) as string} className="w-full h-full object-cover" alt="" />
                          ) : (
                            <FileText size={22} strokeWidth={1.2} className="text-[#aeaeb2]" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="preserve-lines text-[13px] font-semibold text-[#1d1d1f] leading-snug">{linkedAsset.title}</p>
                          <p className="text-[10px] text-[#aeaeb2] uppercase tracking-wider mt-0.5">{linkedAsset.type}</p>
                          {linkedAsset.evidenceLevel && (
                            <span className={`inline-block mt-1 text-[8px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-full ${linkedAsset.evidenceLevel === 'Alto' ? 'bg-emerald-50 text-emerald-600' : linkedAsset.evidenceLevel === 'Moderado' ? 'bg-amber-50 text-amber-600' : 'bg-[#f2f3f5] text-[#86868b]'}`}>
                              Evidência {linkedAsset.evidenceLevel}
                            </span>
                          )}
                        </div>
                        <button onClick={() => handleOpenAsset(linkedAsset)}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-apple text-[10px] font-semibold text-[#1d1d1f] hover:bg-[#f2f3f5] transition-all shrink-0">
                          <ExternalLink size={11} /> Ver
                        </button>
                      </div>
                      {/* Comment area */}
                      <div className="p-4">
                        <textarea
                          ref={(el) => autoResizeTextarea(el)}
                          value={block.content}
                          onChange={e => {
                            const nb = editingCase.blocks?.map(b => b.id === block.id ? { ...b, content: e.target.value } : b);
                            syncCase({ ...editingCase, blocks: nb });
                          }}
                          onInput={(e: any) => { e.target.style.height = 'auto'; e.target.style.height = e.target.scrollHeight + 'px'; }}
                          placeholder="Relevância deste ativo para o caso clínico..."
                          className="preserve-lines w-full bg-transparent text-[14px] text-[#424245] font-light leading-relaxed outline-none resize-none placeholder:text-[#d1d1d6] overflow-hidden"
                          rows={2}
                        />
                        {linkedAsset.summary && (
                          <div className="mt-3 pt-3 border-t border-black/[0.04]">
                            <p className="text-[9px] font-bold text-[#aeaeb2] uppercase tracking-widest mb-1.5">Resumo do Ativo</p>
                            <p className="preserve-lines text-[12px] text-[#86868b] leading-relaxed">{linkedAsset.summary}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })() : (() => {
                  const currentIdx = activeBlockSlideIndices[block.id] || 0;
                  const entries = block.content ? block.content.split('|||').filter(Boolean) : [];
                  const currentEntry = entries[currentIdx] || '';
                  const [imgSrc, imgCaption] = currentEntry.split('###');
                  return (
                    <div className="bg-white rounded-2xl border border-black/[0.06] shadow-apple overflow-hidden group/imgblock">
                      {/* Main image */}
                      <div className="relative bg-[#f5f5f7] min-h-[180px] flex items-center justify-center">
                        {imgSrc ? (
                          <>
                            <img
                              src={imgSrc}
                              className="w-full max-h-[560px] object-contain cursor-zoom-in select-none"
                              onClick={() => setFullscreenImg(imgSrc)}
                              alt={imgCaption || 'Evidência clínica'}
                              draggable={false}
                            />
                            {entries.length > 1 && (
                              <>
                                <button onClick={() => setActiveBlockSlideIndices(p => ({ ...p, [block.id]: Math.max(0, currentIdx - 1) }))} disabled={currentIdx === 0}
                                  className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full shadow-apple-md flex items-center justify-center opacity-0 group-hover/imgblock:opacity-100 disabled:opacity-0 transition-all">
                                  <ChevronLeft size={16} className="text-[#1d1d1f]" />
                                </button>
                                <button onClick={() => setActiveBlockSlideIndices(p => ({ ...p, [block.id]: Math.min(entries.length - 1, currentIdx + 1) }))} disabled={currentIdx === entries.length - 1}
                                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full shadow-apple-md flex items-center justify-center opacity-0 group-hover/imgblock:opacity-100 disabled:opacity-0 transition-all">
                                  <ChevronRight size={16} className="text-[#1d1d1f]" />
                                </button>
                                <div className="absolute bottom-3 right-3 px-2.5 py-1 bg-black/40 backdrop-blur-sm rounded-full text-white text-[10px] font-semibold tabular-nums">
                                  {currentIdx + 1} / {entries.length}
                                </div>
                              </>
                            )}
                            <button onClick={() => setFullscreenImg(imgSrc)}
                              className="absolute top-3 right-3 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full shadow-apple flex items-center justify-center opacity-0 group-hover/imgblock:opacity-100 transition-all">
                              <Maximize2 size={13} className="text-[#1d1d1f]" />
                            </button>
                          </>
                        ) : (
                          <label className="flex flex-col items-center justify-center py-14 w-full cursor-pointer group/drop">
                            <div className="w-14 h-14 rounded-2xl bg-white border border-black/[0.06] flex items-center justify-center mb-4 shadow-apple group-hover/drop:shadow-apple-md group-hover/drop:scale-105 transition-all">
                              <ImageIcon size={24} strokeWidth={1.2} className="text-[#aeaeb2]" />
                            </div>
                            <span className="text-[12px] font-semibold text-[#86868b]">Adicionar imagem clínica</span>
                            <span className="text-[10px] text-[#aeaeb2] mt-1">JPG, PNG ou WEBP</span>
                            <input type="file" multiple accept="image/*" className="hidden" onChange={e => handleCaseImgUpload(block.id, e)} />
                          </label>
                        )}
                      </div>
                      {/* Caption — editorial style */}
                      {imgSrc && (
                        <div className="px-5 py-3 border-t border-black/[0.04]">
                          <textarea value={imgCaption || ''}
                            onChange={e => {
                              const newEntries = [...entries];
                              newEntries[currentIdx] = `${imgSrc}###${e.target.value}`;
                              const nb = editingCase.blocks?.map(b => b.id === block.id ? { ...b, content: newEntries.join('|||') } : b);
                              syncCase({ ...editingCase, blocks: nb });
                            }}
                            onInput={(e: any) => { e.target.style.height = 'auto'; e.target.style.height = e.target.scrollHeight + 'px'; }}
                            placeholder="Legenda da imagem (opcional)..."
                            rows={1}
                            className="preserve-lines w-full resize-none overflow-hidden text-[12px] text-center italic leading-relaxed text-[#86868b] bg-transparent outline-none placeholder:text-[#d1d1d6] font-light" />
                        </div>
                      )}
                      {/* Thumbnail strip */}
                      {entries.length > 0 && (
                        <div className="flex items-center gap-2 px-4 py-3 border-t border-black/[0.04] overflow-x-auto no-scrollbar">
                          {entries.map((ent, idx) => {
                            const [src] = ent.split('###');
                            return (
                              <button key={idx} onClick={() => setActiveBlockSlideIndices(p => ({ ...p, [block.id]: idx }))}
                                className={`w-12 h-12 rounded-[10px] overflow-hidden shrink-0 border-2 transition-all hover:scale-105 ${idx === currentIdx ? 'border-[#1d1d1f] shadow-apple' : 'border-transparent opacity-40 hover:opacity-80'}`}>
                                <img src={src} className="w-full h-full object-cover" alt="" />
                              </button>
                            );
                          })}
                          <label className="w-12 h-12 rounded-[10px] shrink-0 border-2 border-dashed border-[#d1d1d6] hover:border-[#86868b] flex items-center justify-center text-[#aeaeb2] hover:text-[#86868b] cursor-pointer transition-all hover:scale-105">
                            <Plus size={14} strokeWidth={1.5} />
                            <input type="file" multiple accept="image/*" className="hidden" onChange={e => handleCaseImgUpload(block.id, e)} />
                          </label>
                        </div>
                      )}
                    </div>
                  );
                })()}
                <div className="absolute left-2 top-2 z-10 flex overflow-hidden rounded-full border border-black/[0.06] bg-white/92 shadow-sm backdrop-blur md:-left-14 md:flex-col md:opacity-0 md:transition-opacity md:group-hover:opacity-100">
                  <button
                    onClick={() => moveCaseBlock(block.id, 'up')}
                    disabled={index === 0}
                    className="flex h-8 w-8 items-center justify-center text-[#8e8e93] transition-colors hover:bg-[#f5f5f7] hover:text-[#1d1d1f] disabled:cursor-not-allowed disabled:opacity-25"
                    title="Subir bloco"
                    aria-label="Subir bloco"
                  >
                    <ArrowUp size={13} />
                  </button>
                  <button
                    onClick={() => moveCaseBlock(block.id, 'down')}
                    disabled={index === (editingCase.blocks?.length || 0) - 1}
                    className="flex h-8 w-8 items-center justify-center border-l border-black/[0.05] text-[#8e8e93] transition-colors hover:bg-[#f5f5f7] hover:text-[#1d1d1f] disabled:cursor-not-allowed disabled:opacity-25 md:border-l-0 md:border-t"
                    title="Descer bloco"
                    aria-label="Descer bloco"
                  >
                    <ArrowDown size={13} />
                  </button>
                </div>
                <button
                  onClick={() => {
                    const blockLabel = block.type === 'title' ? 'título' : block.type === 'subtitle' ? 'subtítulo' : block.type === 'image' ? 'imagem' : block.type === 'asset' ? 'ativo vinculado' : block.type === 'reference' ? 'referência' : 'texto';
                    openConfirmDialog({
                      title: 'Excluir elemento do case?',
                      message: `Você está prestes a remover este bloco de ${blockLabel}. Essa ação altera o case imediatamente após a confirmação.`,
                      onConfirm: () => {
                        const nb = editingCase.blocks?.filter(b => b.id !== block.id);
                        syncCase({ ...editingCase, blocks: nb });
                        showAppToast('Elemento removido do case.', 'info');
                      },
                    });
                  }}
                  className="absolute top-2 right-2 z-10 rounded-xl border border-black/[0.05] bg-white/86 p-2 text-[#aeaeb2] shadow-sm backdrop-blur transition-all hover:border-red-200 hover:bg-red-50 hover:text-red-500 hover:shadow-apple md:top-2 md:-right-14 md:p-2.5"
                  title="Excluir elemento"
                  aria-label="Excluir elemento"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          {/* Floating toolbar */}
          <div className="lon-glass-panel-strong fixed bottom-[88px] md:bottom-6 left-1/2 z-[150] flex max-w-[95vw] -translate-x-1/2 items-center gap-1.5 overflow-x-auto rounded-apple-xl px-3 py-3 no-scrollbar md:gap-2 md:px-4 md:py-3.5 xl:max-w-[calc(100vw-420px)]">
            {/* Auto-save indicator */}
            <div className="hidden sm:flex w-32 items-center justify-center">
              {saveStatus === 'saving' && (
                <div className="flex items-center gap-2 text-slate-400 animate-fade-in">
                  <div className="w-1.5 h-1.5 bg-[#1d1d1f] rounded-full animate-pulse"></div>
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

            <button onClick={() => addBlock('title')} className="shrink-0 p-2.5 md:p-3 hover:bg-[#f2f3f5] rounded-[10px] text-[#8e8e93] hover:text-[#1d1d1f] transition-all" title="Adicionar título">
              <TypeIcon size={17} />
            </button>
            <button onClick={() => addBlock('subtitle')} className="flex h-[38px] min-w-[38px] shrink-0 items-center justify-center rounded-[10px] px-2 text-[14px] font-semibold text-[#8e8e93] transition-all hover:bg-[#f2f3f5] hover:text-[#1d1d1f] md:h-[42px] md:min-w-[42px]" title="Adicionar subtítulo (T²)">
              T<sup className="-ml-0.5 text-[9px]">2</sup>
            </button>
            <button onClick={() => addBlock('text')} className="shrink-0 p-2.5 md:p-3 hover:bg-[#f2f3f5] rounded-[10px] text-[#8e8e93] hover:text-[#1d1d1f] transition-all" title="Adicionar texto">
              <FileText size={17} />
            </button>
            <button onClick={() => addBlock('image')} className="shrink-0 p-2.5 md:p-3 hover:bg-[#f2f3f5] rounded-[10px] text-[#8e8e93] hover:text-[#1d1d1f] transition-all" title="Adicionar evidência">
              <ImageIcon size={17} />
            </button>
            <button onClick={() => setShowAssetPicker(true)} className="shrink-0 p-2.5 md:p-3 hover:bg-[#f2f3f5] rounded-[10px] text-[#8e8e93] hover:text-[#1d1d1f] transition-all" title="Adicionar ativo">
              <LayoutGrid size={17} />
            </button>
            <button onClick={() => addBlock('reference')} className="shrink-0 p-2.5 md:p-3 hover:bg-[#f2f3f5] rounded-[10px] text-[#8e8e93] hover:text-[#1d1d1f] transition-all" title="Referência bibliográfica">
              <BookOpen size={17} />
            </button>
            <div className="h-6 w-px shrink-0 bg-slate-200 mx-1 md:h-8 md:mx-2"></div>

            <button onClick={handleSaveCaseChanges} className="button-nowrap flex min-w-[104px] shrink-0 items-center justify-center gap-1.5 rounded-apple bg-[#1d1d1f] px-4 py-2.5 text-[10px] font-bold uppercase tracking-[0.12em] text-white transition-all hover:bg-[#333]" title="Salvar alterações">
              <Save size={13} />
              <span>Salvar</span>
            </button>
            <button onClick={() => handleCloseCase()} className="button-nowrap min-w-[104px] shrink-0 rounded-apple bg-[#f2f3f5] px-4 py-2.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#8e8e93] transition-all hover:bg-[#e8e9eb] hover:text-[#1d1d1f]" title="Fechar editor">
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
                        className="group cursor-pointer bg-slate-50 rounded-2xl overflow-hidden border border-slate-100 hover:border-black/10 hover:shadow-lg transition-all"
                      >
                        <div className="aspect-square bg-white overflow-hidden">
                          {getAssetPreviewSource(asset) ? (
                            <img src={getAssetPreviewSource(asset) as string} alt={asset.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-200">
                              <FileText size={32} />
                            </div>
                          )}
                        </div>
                        <div className="p-3">
                          <p className="line-clamp-2 text-xs font-medium leading-snug text-slate-700">{asset.title}</p>
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
        <div className="lon-glass-panel hidden lg:flex w-[280px] shrink-0 border-l border-white/70 flex-col overflow-y-auto custom-scrollbar">
          <div className="p-5 space-y-5">
            <div>
              <h3 className="text-[10px] font-bold text-[#86868b] uppercase tracking-widest mb-3">Status</h3>
              <div className="space-y-1.5">
                {statusOptions.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => syncCase({ ...editingCase, caseStatus: opt.value })}
                    className={`button-nowrap w-full flex items-center gap-2.5 px-3 py-2 rounded-apple-lg text-[12px] font-medium transition-all ${
                      (editingCase.caseStatus || 'em_andamento') === opt.value
                        ? 'bg-white/72 shadow-apple border border-white/80 text-[#1d1d1f]'
                        : 'text-[#86868b] hover:bg-white/55 hover:text-[#1d1d1f]'
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
                <div className="bg-white/62 rounded-apple border border-white/80 p-3 text-center shadow-apple backdrop-blur-xl">
                  <p className="text-lg font-light text-[#1d1d1f]">{imageCount}</p>
                  <p className="text-[8px] font-bold text-[#86868b] uppercase tracking-widest">Imagens</p>
                </div>
                <div className="bg-white/62 rounded-apple border border-white/80 p-3 text-center shadow-apple backdrop-blur-xl">
                  <p className="text-lg font-light text-[#1d1d1f]">{textCount}</p>
                  <p className="text-[8px] font-bold text-[#86868b] uppercase tracking-widest">Textos</p>
                </div>
                <div className="bg-white/62 rounded-apple border border-white/80 p-3 text-center shadow-apple backdrop-blur-xl">
                  <p className="text-lg font-light text-[#1d1d1f]">{assetCount}</p>
                  <p className="text-[8px] font-bold text-[#86868b] uppercase tracking-widest">Ativos</p>
                </div>
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
              onClick={handleDownloadCasePDF}
              disabled={isGeneratingCasePdf}
              className="button-nowrap w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-apple-lg text-[11px] font-semibold bg-[#1d1d1f] text-white hover:bg-[#333] shadow-apple transition-all disabled:opacity-60"
            >
              {isGeneratingCasePdf ? <Loader2 size={12} className="animate-spin" /> : <Download size={12} />}
              {isGeneratingCasePdf ? 'Gerando PDF...' : 'Baixar PDF'}
            </button>

            <button
              onClick={() => { setPresentationMode(true); setPresentationBlockIdx(0); setCaseCertHash(null); }}
              className="button-nowrap w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-apple-lg text-[11px] font-semibold bg-[#f2f3f5] text-[#1d1d1f] hover:bg-[#e5e5ea] shadow-apple transition-all"
            >
              <Maximize2 size={12} />
              Modo Apresentação
            </button>

            <div className="w-full h-px bg-black/[0.06]" />

            <div>
              <h3 className="text-[10px] font-bold text-[#86868b] uppercase tracking-widest mb-3">Certificação de Autoria</h3>
              {caseCertHash ? (
                <div className="bg-[#f0fdf4] border border-emerald-100 rounded-apple-lg p-3 space-y-2">
                  <div className="flex items-center gap-1.5">
                    <Award size={12} className="text-emerald-500" />
                    <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest">Certificado</span>
                  </div>
                  <p className="font-mono text-[11px] text-emerald-700 break-all font-semibold">{caseCertHash}</p>
                  <p className="text-[9px] text-emerald-500">{new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`CERTIFICADO LON SUITE 4.0\n${caseCertHash}\nCase: ${editingCase.title}\nData: ${new Date().toISOString()}\nAutor: ${editingCase.ownerName || 'Não identificado'}`);
                      setCopiedCert(true);
                      setTimeout(() => setCopiedCert(false), 2000);
                    }}
                    className="button-nowrap flex items-center gap-1 text-[9px] font-bold text-emerald-600 hover:text-emerald-700 transition-colors"
                  >
                    {copiedCert ? <CheckCircle2 size={10} /> : <Copy size={10} />}
                    {copiedCert ? 'Copiado!' : 'Copiar certificado'}
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setCaseCertHash(generateCertHash(editingCase))}
                  className="button-nowrap w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-apple-lg text-[11px] font-semibold bg-[#f0fdf4] text-emerald-600 hover:bg-emerald-100 border border-emerald-100 transition-all"
                >
                  <Award size={12} />
                  Certificar Autoria
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Presentation Mode Overlay */}
        {presentationMode && editingCase && (() => {
          type PresentationSlide =
            | { kind: 'story'; id: string; title?: string; subtitle?: string; texts: string[] }
            | { kind: 'image'; id: string; src: string; caption?: string }
            | { kind: 'asset'; id: string; asset: Asset }
            | { kind: 'reference'; id: string; content: string };

          const sourceBlocks = (editingCase.blocks || []).filter(b => {
            if (b.type === 'image' || b.type === 'asset') return Boolean(b.content || b.assetId);
            return Boolean(b.content?.trim());
          });
          const slides: PresentationSlide[] = [];
          let story: Extract<PresentationSlide, { kind: 'story' }> | null = null;

          const flushStory = () => {
            if (story && (story.title || story.subtitle || story.texts.length > 0)) slides.push(story);
            story = null;
          };

          sourceBlocks.forEach(block => {
            if (block.type === 'title') {
              flushStory();
              story = { kind: 'story', id: block.id, title: block.content, texts: [] };
              return;
            }
            if (block.type === 'subtitle') {
              if (!story) story = { kind: 'story', id: block.id, texts: [] };
              else if (story.subtitle || story.texts.length > 0) {
                flushStory();
                story = { kind: 'story', id: block.id, texts: [] };
              }
              story.subtitle = block.content;
              return;
            }
            if (block.type === 'text') {
              if (!story) story = { kind: 'story', id: block.id, texts: [] };
              if (story.texts.join('\n').length > 900) {
                flushStory();
                story = { kind: 'story', id: block.id, texts: [] };
              }
              story.texts.push(block.content);
              return;
            }
            flushStory();
            if (block.type === 'image' && block.content) {
              block.content.split('|||').filter(Boolean).forEach((entry, index) => {
                const [src, caption] = entry.split('###');
                if (src) slides.push({ kind: 'image', id: `${block.id}-${index}`, src, caption });
              });
              return;
            }
            if (block.type === 'asset' && block.assetId) {
              const asset = activeAssets.find(a => a.id === block.assetId);
              if (asset) slides.push({ kind: 'asset', id: block.id, asset });
              return;
            }
            if (block.type === 'reference') slides.push({ kind: 'reference', id: block.id, content: block.content });
          });
          flushStory();

          const total = slides.length;
          if (total === 0) return null;
          const currentSlideIndex = Math.min(presentationBlockIdx, total - 1);
          const slide = slides[currentSlideIndex];
          const progress = total > 0 ? ((currentSlideIndex + 1) / total) * 100 : 0;

          return (
            <div className="fixed inset-0 z-[900] lon-soft-bg text-[#1d1d1f] flex flex-col animate-fade-in">
              {/* Top bar */}
              <div className="relative flex items-center justify-between px-5 sm:px-8 py-3.5 border-b border-black/[0.06] bg-white/82 backdrop-blur-xl">
                <div className="absolute left-0 bottom-0 h-px bg-[#1d1d1f] transition-all duration-300" style={{ width: `${progress}%` }} />
                <div className="min-w-0">
                  <p className="text-[#86868b] text-[9px] sm:text-[10px] font-bold tracking-[0.18em] uppercase">Lon Suite · Apresentação</p>
                  <p className="max-w-[58vw] line-clamp-2 text-[#1d1d1f] text-[12px] sm:text-[13px] font-semibold mt-0.5">{editingCase.title || 'Case científico'}</p>
                </div>
                <div className="flex items-center gap-2 sm:gap-4">
                  <span className="text-[#86868b] text-[11px] tabular-nums">{currentSlideIndex + 1} / {total}</span>
                  <button onClick={() => setPresentationMode(false)} aria-label="Fechar apresentação" className="w-9 h-9 rounded-full bg-[#1d1d1f] hover:bg-[#333] flex items-center justify-center transition-all active:scale-95">
                    <X size={14} className="text-white" />
                  </button>
                </div>
              </div>

              {/* Slide content */}
              <div className="flex-1 overflow-hidden px-4 py-5 sm:px-8 sm:py-8">
                <div className="mx-auto flex h-full max-w-6xl items-center justify-center">
                  {slide.kind === 'story' && (
                    <section className="w-full max-h-full overflow-y-auto rounded-[30px] border border-black/[0.06] bg-white px-6 py-7 shadow-[0_28px_90px_rgba(0,0,0,0.08)] sm:px-10 sm:py-9 md:px-14 md:py-12">
                      {slide.title && (
                        <h1 className="preserve-lines max-w-5xl text-[clamp(32px,5.8vw,76px)] font-extralight leading-[1.02] tracking-tight text-[#111113]">
                          {slide.title}
                        </h1>
                      )}
                      {slide.subtitle && (
                        <h2 className={`preserve-lines ${slide.title ? 'mt-5' : ''} max-w-4xl text-[clamp(22px,3vw,38px)] font-light leading-tight tracking-tight text-[#424245]`}>
                          {slide.subtitle}
                        </h2>
                      )}
                      {slide.texts.length > 0 && (
                        <div className="mt-7 max-w-4xl space-y-4 text-[clamp(15px,1.7vw,22px)] font-light leading-relaxed text-[#424245]">
                          {slide.texts.map((text, index) => (
                            <p key={index} className="preserve-lines text-justify">{text}</p>
                          ))}
                        </div>
                      )}
                      <p className="mt-8 text-[10px] font-bold uppercase tracking-[0.2em] text-[#aeaeb2]">{editingCase.ownerName || ownerName || 'Lon Suite'}</p>
                    </section>
                  )}

                  {slide.kind === 'image' && (
                    <figure className={`grid h-full w-full min-h-0 gap-4 ${slide.caption ? 'grid-rows-[minmax(0,1fr)_auto] md:grid-cols-[minmax(0,1.12fr)_minmax(260px,0.58fr)] md:grid-rows-1' : 'grid-cols-1'}`}>
                      <div className="flex min-h-0 items-center justify-center overflow-hidden rounded-[30px] border border-black/[0.06] bg-white p-3 shadow-[0_28px_90px_rgba(0,0,0,0.08)] sm:p-4">
                        <img
                          src={slide.src}
                          className="max-h-[calc(100vh-214px)] w-full object-contain md:max-h-[calc(100vh-178px)]"
                          alt=""
                        />
                      </div>
                      {slide.caption && (
                        <figcaption className="min-h-0 overflow-y-auto rounded-[26px] border border-black/[0.06] bg-white px-5 py-5 text-[13px] italic leading-relaxed text-[#6e6e73] shadow-[0_18px_54px_rgba(0,0,0,0.06)] sm:text-[15px] md:max-h-full md:px-7 md:py-7">
                          <span className="mb-4 block text-[9px] font-bold not-italic uppercase tracking-[0.2em] text-[#aeaeb2]">Legenda</span>
                          <span className="preserve-lines block text-justify">{slide.caption}</span>
                        </figcaption>
                      )}
                    </figure>
                  )}

                  {slide.kind === 'asset' && (
                    <div className="grid w-full max-h-full items-center gap-6 overflow-y-auto rounded-[30px] border border-black/[0.06] bg-white p-5 shadow-[0_28px_90px_rgba(0,0,0,0.08)] md:grid-cols-[0.95fr_1.05fr] md:p-8">
                      <div className="aspect-[4/3] overflow-hidden rounded-[24px] border border-black/[0.06] bg-[#f5f5f7]">
                        {getAssetPreviewSource(slide.asset) ? (
                          <img src={getAssetPreviewSource(slide.asset) as string} className="h-full w-full object-contain" alt="" />
                        ) : slide.asset.type === 'pdf' ? (
                          <div className="flex h-full w-full flex-col items-center justify-center gap-3 text-[#d92d20]">
                            <FileText size={56} strokeWidth={1.2} />
                            <span className="text-[10px] font-bold uppercase tracking-[0.18em]">PDF</span>
                          </div>
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            <BookOpen size={52} className="text-[#aeaeb2]" />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="mb-4 text-[10px] font-bold tracking-[0.2em] uppercase text-[#86868b]">Ativo vinculado</p>
                        <h2 className="preserve-lines text-[clamp(28px,4vw,54px)] font-light tracking-tight leading-tight">{slide.asset.title}</h2>
                        {slide.asset.summary && (
                          <p className="preserve-lines mt-6 text-[16px] sm:text-xl font-light leading-relaxed text-[#6e6e73]">{slide.asset.summary}</p>
                        )}
                        {(slide.asset.tags || []).length > 0 && (
                          <div className="mt-7 flex flex-wrap gap-2">
                            {(slide.asset.tags || []).slice(0, 5).map(tag => (
                              <span key={tag} className="rounded-full border border-black/[0.06] bg-[#f5f5f7] px-3 py-1 text-[11px] font-semibold text-[#6e6e73]">{tag}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {slide.kind === 'reference' && (
                    <div className="max-h-full max-w-3xl overflow-y-auto rounded-[28px] border border-black/[0.06] bg-white p-8 shadow-[0_28px_90px_rgba(0,0,0,0.08)] sm:p-10">
                      <p className="mb-4 text-[10px] font-bold tracking-[0.2em] uppercase text-[#86868b]">Referência</p>
                      <p className="preserve-lines text-lg sm:text-2xl italic text-[#6e6e73] leading-relaxed">{slide.content}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-center gap-4 px-5 pb-5 sm:pb-7">
                <button
                  onClick={() => setPresentationBlockIdx(i => Math.max(0, i - 1))}
                  disabled={currentSlideIndex === 0}
                  aria-label="Slide anterior"
                  className="w-11 h-11 rounded-full bg-white border border-black/[0.06] hover:bg-[#f5f5f7] disabled:opacity-30 flex items-center justify-center transition-all active:scale-95 shadow-sm"
                >
                  <ChevronLeft size={19} className="text-[#1d1d1f]" />
                </button>
                <div className="flex max-w-[55vw] gap-1.5 overflow-hidden">
                  {slides.map((item, i) => (
                    <button key={item.id} onClick={() => setPresentationBlockIdx(i)}
                      aria-label={`Ir para slide ${i + 1}`}
                      className={`rounded-full transition-all ${i === currentSlideIndex ? 'w-6 h-2 bg-[#1d1d1f]' : 'w-2 h-2 bg-black/20 hover:bg-black/40'}`} />
                  ))}
                </div>
                <button
                  onClick={() => setPresentationBlockIdx(i => Math.min(total - 1, i + 1))}
                  disabled={currentSlideIndex === total - 1}
                  aria-label="Próximo slide"
                  className="w-11 h-11 rounded-full bg-white border border-black/[0.06] hover:bg-[#f5f5f7] disabled:opacity-30 flex items-center justify-center transition-all active:scale-95 shadow-sm"
                >
                  <ChevronRight size={19} className="text-[#1d1d1f]" />
                </button>
              </div>
            </div>
          );
        })()}
      </div>
    );
  };



  const openConfirmDialog = (opts: { title: string; message: string; onConfirm: () => void }) => {
    setConfirmDialog({ isOpen: true, ...opts });
  };

  // Auth gate — show login if not authenticated
  if (!currentUser) {
    return (
      <LoginPage onLogin={(user) => {
        storeUser(user);
        setCurrentUser(user);
      }} />
    );
  }

  const handleLogout = () => {
    authSignOut();
    setCurrentUser(null);
    setAssets([]);
  };

  const handleProfileAvatarSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    event.target.value = '';

    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : '';
      const img = new Image();
      img.onload = () => {
        const size = 360;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          setProfileDraft(prev => ({ ...prev, avatarUrl: result }));
          return;
        }
        const scale = Math.max(size / img.width, size / img.height);
        const width = img.width * scale;
        const height = img.height * scale;
        ctx.drawImage(img, (size - width) / 2, (size - height) / 2, width, height);
        setProfileDraft(prev => ({ ...prev, avatarUrl: canvas.toDataURL('image/jpeg', 0.82) }));
      };
      img.onerror = () => setProfileDraft(prev => ({ ...prev, avatarUrl: result }));
      img.src = result;
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = async () => {
    if (!currentUser) return;
    const updatedUser: AuthUser = {
      ...currentUser,
      name: profileDraft.name.trim() || currentUser.email.split('@')[0],
      specialty: profileDraft.specialty.trim(),
      avatarUrl: profileDraft.avatarUrl,
    };

    storeUser(updatedUser);
    setCurrentUser(updatedUser);

    if (!updatedUser.id.startsWith('offline:')) {
      const authUserId = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(updatedUser.id)
        ? updatedUser.id
        : null;
      withSupabaseTimeout(
        supabase.from('profiles').upsert({
          id: updatedUser.id,
          auth_user_id: authUserId,
          name: updatedUser.name,
          email: updatedUser.email,
          specialty: updatedUser.specialty,
          avatar_url: updatedUser.avatarUrl,
        }),
        'Atualização do perfil no Supabase',
      ).then(() => showAppToast('Perfil salvo com segurança.'))
        .catch(error => {
          console.warn('[Lon Suite] Perfil não sincronizado:', error);
          showAppToast('Perfil salvo localmente. A nuvem sincroniza quando responder.', 'warning');
        });
    } else {
      showAppToast('Perfil salvo neste dispositivo.', 'info');
    }
  };

  return (
    <div className="lon-soft-bg min-h-screen text-[#1d1d1f] font-sans pb-20 md:pb-0 md:pl-[80px] transition-all duration-300">
      <Sidebar currentView={view} setView={(v) => { setSelectedAsset(null); setEditingCase(null); setNewAssetId(null); setView(v); }} trashCount={trashedAssets.length} />

      <div className="sticky top-0 z-[210] flex justify-start px-4 pt-3 md:px-6 md:pt-4">
        <div className="lon-glass-panel flex max-w-full items-center gap-1 rounded-full px-1.5 py-1.5">
          <div className="flex min-w-0 items-center gap-2 pl-1.5 pr-1">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#1d1d1f] text-[10px] font-semibold text-white ring-1 ring-black/[0.04]">
              {currentUser.avatarUrl ? (
                <img src={currentUser.avatarUrl} alt="" className="h-full w-full object-cover" />
              ) : (
                (ownerName || currentUser.email || '?').charAt(0).toUpperCase()
              )}
            </div>
            <div className="hidden min-w-0 sm:block">
              <p className="max-w-[180px] truncate text-[11px] font-semibold leading-tight text-[#1d1d1f] md:max-w-[240px]">{ownerName || currentUser.email}</p>
              <p className="max-w-[180px] truncate text-[9px] leading-tight text-[#aeaeb2] md:max-w-[240px]">{currentUser.specialty || currentUser.email}</p>
            </div>
          </div>
          <button
            onClick={() => openConfirmDialog({
              title: 'Sair da conta?',
              message: 'Você será redirecionado para a tela de login.',
              onConfirm: handleLogout,
            })}
            aria-label="Sair da conta"
            title="Sair da conta"
            className="flex h-7 w-7 items-center justify-center rounded-full text-[#86868b] transition-all hover:bg-white/70 hover:text-[#1d1d1f] active:scale-95"
          >
            <LogOut size={13} />
          </button>
        </div>
      </div>

      {/* Hidden file input */}
      <input ref={fileInputRef} type="file" multiple accept="image/*,.pdf,.pptx,.ppt,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation" className="hidden" onChange={handleFilesSelected} />

      {/* Pending Upload Modal */}
      {pendingUpload && (
        <div className="fixed inset-0 z-[500] bg-black/25 backdrop-blur-md flex items-center justify-center animate-fade-in p-4">
          <div className="lon-glass-panel-strong rounded-apple-2xl p-10 max-w-sm w-full text-center animate-scale-in">
            <div className="w-16 h-16 bg-[#1d1d1f] text-white rounded-apple-lg flex items-center justify-center mx-auto mb-6 shadow-apple-md">
              <Brain size={28} />
            </div>
            <h2 className="text-2xl font-semibold tracking-tight mb-2">Novo Ativo</h2>
            <p className="text-[#86868b] text-[13px] mb-8 leading-relaxed">
              {pendingUpload.files.length === 1 ? pendingUpload.files[0].name : `${pendingUpload.files.length} arquivos selecionados`}
            </p>
            {isProcessing && uploadProgress ? (
              <div className="mb-7 rounded-[18px] border border-black/[0.06] bg-[#f7f7f8] p-4 text-left">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <p className="min-w-0 truncate text-[11px] font-semibold text-[#1d1d1f]">{uploadProgress.label}</p>
                  <span className="text-[10px] font-bold tabular-nums text-[#86868b]">
                    {Math.round((uploadProgress.step / Math.max(1, uploadProgress.total)) * 100)}%
                  </span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-black/[0.06]">
                  <div
                    className="h-full rounded-full bg-[#1d1d1f] transition-all duration-500 ease-out"
                    style={{ width: `${Math.min(100, Math.round((uploadProgress.step / Math.max(1, uploadProgress.total)) * 100))}%` }}
                  />
                </div>
                <p className="mt-2 text-[10px] text-[#aeaeb2]">
                  Etapa {Math.min(uploadProgress.step, uploadProgress.total)} de {uploadProgress.total}
                </p>
              </div>
            ) : (
              <p className="text-[12px] text-[#86868b] mb-6">Deseja que a IA indexe automaticamente?</p>
            )}
            <div className="flex flex-col gap-2.5">
              <button onClick={() => processUpload(true)} disabled={isProcessing}
                className="btn-ai w-full py-3.5 rounded-apple-lg font-semibold text-[13px] shadow-apple flex items-center justify-center gap-2.5 disabled:opacity-50">
                {isProcessing ? <Loader2 size={15} className="animate-spin" /> : <Brain size={15} />}
                {isProcessing ? 'Processando...' : 'Indexar com IA'}
              </button>
              <button onClick={() => processUpload(false)} disabled={isProcessing}
                className="w-full py-3.5 bg-[#f2f3f5] text-[#1d1d1f] rounded-apple-lg font-semibold text-[13px] hover:bg-black/8 transition-all disabled:opacity-50">
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
            setBrokenPreviewIds(new Set());

            // Search: user's own assets AND cases
            const searchableItems = activeAssets.filter(a => !a.isDeleted);

            const query = homeSearchQuery.toLowerCase().trim();
            const localResults = searchableItems
              .map(item => {
                let score = 0;
                const title = (item.title || '').toLowerCase();
                const tags = (item.tags || []).map(t => t.toLowerCase());
                const summary = (item.summary || '').toLowerCase();
                const blocksText = (item.blocks || []).map(b => typeof b.content === 'string' ? b.content : '').join(' ').toLowerCase();
                if (title.includes(query)) score += 10;
                if (tags.some(t => t.includes(query))) score += 8;
                if (summary.includes(query)) score += 6;
                if (blocksText.includes(query)) score += 5;
                return { item, score };
              })
              .filter(r => r.score > 0)
              .sort((a, b) => b.score - a.score)
              .map(r => r.item);

            setHomeSearchResults(localResults);

            // AI enhanced search in background (cases only)
            const searchableCases = searchableItems.filter(a => a.type === 'case');
            if (searchableCases.length > 0) {
              setHomeSearchLoading(true);
              try {
                const resultIds = await searchCasesWithAI(homeSearchQuery, searchableCases, ownerId);
                if (resultIds.length > 0) {
                  const aiCaseResults = resultIds
                    .map(id => searchableCases.find(c => c.id === id))
                    .filter(Boolean) as Asset[];
                  if (aiCaseResults.length > 0) {
                    // Merge AI case results with local asset results
                    const assetResults = localResults.filter(r => r.type !== 'case');
                    setHomeSearchResults([...aiCaseResults, ...assetResults]);
                  }
                }
              } catch { /* keep local results */ }
              setHomeSearchLoading(false);
            }
          };

          const handleHomeKeyDown = (e: React.KeyboardEvent) => {
            if (e.key === 'Enter') handleHomeSearch();
            if (e.key === 'Escape') {
              setHomeSearchQuery('');
              setHomeHasSearched(false);
              setHomeSearchResults([]);
              setBrokenPreviewIds(new Set());
            }
          };
          const clearHomeSearch = () => {
            setHomeSearchQuery('');
            setHomeHasSearched(false);
            setHomeSearchResults([]);
            setBrokenPreviewIds(new Set());
          };

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
                <div className="lon-soft-search relative group rounded-full">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    {homeSearchLoading ? (
                      <Loader2 size={18} className="text-[#1d1d1f] animate-spin" />
                    ) : (
                      <Search size={18} className="text-[#8e8e93] group-focus-within:text-[#1d1d1f] transition-colors" />
                    )}
                  </div>
                  <input
                    type="text"
                    placeholder="Pesquisar ativos e cases científicos..."
                    value={homeSearchQuery}
                    onChange={e => {
                      const v = e.target.value;
                      setHomeSearchQuery(v);
                      // Auto-clear results when user empties the field
                      if (!v.trim()) { setHomeHasSearched(false); setHomeSearchResults([]); }
                    }}
                    onKeyDown={handleHomeKeyDown}
                    className="w-full pl-12 pr-14 py-4 bg-transparent rounded-full text-[15px] outline-none transition-all placeholder:text-[#9a9aa0]"
                  />
                  {/* Right action: clear (X) when active, AI brain when idle */}
                  {(homeSearchQuery || homeHasSearched) ? (
                    <button onClick={clearHomeSearch}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white/58 hover:bg-[#1d1d1f] text-[#86868b] hover:text-white transition-all"
                      title="Limpar pesquisa (Esc)">
                      <X size={16} />
                    </button>
                  ) : (
                    <button onClick={handleHomeSearch}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-[#f2f3f5] hover:bg-[#1d1d1f] text-[#86868b] hover:text-white transition-all"
                      title="Busca semântica com IA">
                      <Brain size={16} />
                    </button>
                  )}
                </div>
                <p className="text-center text-[10px] text-[#aeaeb2] mt-2.5 font-medium tracking-wider">
                  {totalAssets} Ativos · {totalCases} Cases · Busca semântica com IA
                </p>
              </div>

              {/* Shortcut icons — below search */}
              <div className="flex items-center gap-9 sm:gap-14 mb-10">
                <button onClick={() => setView(ViewState.ATIVOS)} className="flex flex-col items-center gap-3 group">
                  <div className="w-[52px] h-[52px] sm:w-[60px] sm:h-[60px] rounded-[16px] bg-transparent border border-black/[0.06] flex items-center justify-center group-hover:border-[#1d1d1f] group-hover:bg-[#1d1d1f] transition-all duration-300">
                    <LayoutGrid size={21} strokeWidth={1} className="text-[#8e8e93] group-hover:text-white transition-colors" />
                  </div>
                  <span className="text-[10px] font-medium text-[#8e8e93] group-hover:text-[#1d1d1f] transition-colors uppercase tracking-widest">Ativos</span>
                </button>

                <button onClick={() => setView(ViewState.CASES)} className="flex flex-col items-center gap-3 group">
                  <div className="w-[52px] h-[52px] sm:w-[60px] sm:h-[60px] rounded-[16px] bg-transparent border border-black/[0.06] flex items-center justify-center group-hover:border-[#1d1d1f] group-hover:bg-[#1d1d1f] transition-all duration-300">
                    <Stethoscope size={21} strokeWidth={1} className="text-[#8e8e93] group-hover:text-white transition-colors" />
                  </div>
                  <span className="text-[10px] font-medium text-[#8e8e93] group-hover:text-[#1d1d1f] transition-colors uppercase tracking-widest">Cases</span>
                </button>

                <button onClick={() => { setView(ViewState.ATIVOS); setShowUploadModal(true); }} className="flex flex-col items-center gap-3 group">
                  <div className="w-[52px] h-[52px] sm:w-[60px] sm:h-[60px] rounded-[16px] bg-transparent border border-black/[0.06] flex items-center justify-center group-hover:border-[#1d1d1f] group-hover:bg-[#1d1d1f] transition-all duration-300">
                    <Plus size={21} strokeWidth={1} className="text-[#8e8e93] group-hover:text-white transition-colors" />
                  </div>
                  <span className="text-[10px] font-medium text-[#8e8e93] group-hover:text-[#1d1d1f] transition-colors uppercase tracking-widest">Uploads</span>
                </button>
              </div>

              {/* Search Results */}
              {homeHasSearched && (
                <div ref={homeScrollRef} className="w-full max-w-5xl animate-fade-in pb-20">
                  {homeSearchLoading && homeSearchResults.length === 0 ? (
                    <div className="flex flex-col items-center py-16">
                      <Loader2 size={28} className="text-[#1d1d1f] animate-spin mb-4" />
                      <p className="text-[12px] text-[#86868b] font-medium">Analisando termos médicos...</p>
                    </div>
                  ) : homeSearchResults.length > 0 ? (
                    <>
                      <div className="flex items-center justify-between gap-2 mb-5">
                        <p className="text-[11px] text-[#86868b] font-medium flex items-center gap-2">
                          {homeSearchResults.length} {homeSearchResults.length === 1 ? 'resultado' : 'resultados'} para &ldquo;{homeSearchQuery}&rdquo;
                          {homeSearchLoading && <Loader2 size={12} className="text-[#1d1d1f] animate-spin" />}
                        </p>
                        <button onClick={clearHomeSearch}
                          className="flex items-center gap-1.5 text-[10px] font-semibold text-[#aeaeb2] hover:text-[#1d1d1f] transition-colors uppercase tracking-widest">
                          <X size={11} /> Limpar
                        </button>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {homeSearchResults.map(item => {
                          const isCase = item.type === 'case';
                          const thumbnail = brokenPreviewIds.has(item.id) ? null : (isCase ? getCaseThumbnail(item) : getAssetPreviewSource(item));
                          const ResultIcon = isCase ? Briefcase : item.type === 'pdf' ? FileText : Stethoscope;
                          return (
                            <div
                              key={item.id}
                              onClick={() => {
                                if (isCase) {
                                  setEditingCase(item);
                                  setView(ViewState.CASES);
                                } else {
                                  handleOpenAsset(item);
                                }
                              }}
                              className="lon-glass-panel group cursor-pointer rounded-apple-xl overflow-hidden hover:shadow-apple-md hover:-translate-y-1 transition-all duration-300"
                            >
                              {/* Thumbnail */}
                              <div className="w-full h-[120px] bg-[#f2f3f5] overflow-hidden flex items-center justify-center">
                                {thumbnail && isRenderableImageSource(thumbnail) ? (
                                  <img
                                    src={thumbnail}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    alt=""
                                    onError={event => {
                                      event.currentTarget.style.display = 'none';
                                      setBrokenPreviewIds(prev => {
                                        const next = new Set(prev);
                                        next.add(item.id);
                                        return next;
                                      });
                                    }}
                                  />
                                ) : (
                                  <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-[#f5f5f7] text-[#aeaeb2]">
                                    <ResultIcon size={24} strokeWidth={1.2} className="opacity-70" />
                                    <span className="text-[8px] font-bold uppercase tracking-[0.16em]">{isCase ? 'Case' : item.type}</span>
                                  </div>
                                )}
                              </div>
                              {/* Info */}
                              <div className="p-3">
                                <p className="text-[11px] font-semibold text-[#1d1d1f] line-clamp-2 leading-tight mb-2 transition-colors">
                                  {item.title || (isCase ? 'Case Científico' : 'Ativo')}
                                </p>
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-white/62 text-[8px] font-bold uppercase tracking-wider text-[#86868b]">
                                  {isCase ? 'Case' : 'Ativo'}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-16">
                      <Search size={32} className="mx-auto mb-3 text-[#aeaeb2] opacity-30" />
                      <p className="text-[13px] text-[#86868b] font-medium">Nenhum resultado para "{homeSearchQuery}"</p>
                      <p className="text-[11px] text-[#aeaeb2] mt-1">Tente outros termos ou sinônimos</p>
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
                <div className="flex flex-col gap-4 mb-7 lg:flex-row lg:items-center lg:justify-between">
                  <div className="min-w-0">
                    <h1 className="text-3xl sm:text-4xl font-extralight tracking-tight text-[#1d1d1f]">Ativos</h1>
                    <p className="text-[11px] font-medium text-[#86868b] tracking-wider mt-1.5">
                      {isRefreshing ? 'Sincronizando acervo...' : `${filteredAssets.length} ativos visíveis · ${activeAssets.filter(a => a.type === 'case').length} cases`}
                    </p>
                  </div>
                  <button onClick={() => setShowUploadModal(true)}
                    className="button-nowrap btn-ai flex w-full items-center justify-center gap-2 rounded-apple-lg px-5 py-2.5 text-[13px] font-semibold shadow-apple hover:-translate-y-0.5 sm:w-auto lg:shrink-0">
                    <Plus size={15} /> Novo Ativo
                  </button>
                </div>

                {/* Filter row */}
                <div className="flex flex-col items-stretch gap-3 xl:flex-row xl:items-center">
                  {/* Search */}
                  <div className="relative flex-1 min-w-0 group">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                      {isAiSearching ? (
                        <Loader2 size={15} className="text-[#1d1d1f] animate-spin" />
                      ) : (
                        <Search size={15} className="text-[#86868b] group-focus-within:text-[#1d1d1f] transition-colors" />
                      )}
                    </div>
                    <input type="text" placeholder="Busca semântica com IA..."
                      value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                      className="lon-soft-search w-full pl-10 pr-10 py-3 rounded-full text-[13px] outline-none transition-all placeholder:text-[#9a9aa0]" />
                    {/* Clear / AI badge on right */}
                    {searchQuery ? (
                      <button onClick={() => { setSearchQuery(''); setAiSearchResults(null); }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-black/6 text-[#aeaeb2] hover:text-[#1d1d1f] transition-colors">
                        <X size={13} />
                      </button>
                    ) : (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none">
                        <Brain size={13} className="text-[#1d1d1f]" />
                      </div>
                    )}
                  </div>

                  {/* Date filters */}
                  <div className="flex min-w-0 items-center gap-2 overflow-x-auto pb-1 no-scrollbar xl:shrink-0 xl:pb-0">
                    <select
                      value={dateFilter.month}
                      onChange={e => setDateFilter(p => ({ ...p, month: e.target.value }))}
                      className="shrink-0 px-3 py-2.5 bg-white/70 border border-white/80 rounded-apple-lg text-[12px] font-medium text-[#1d1d1f] outline-none focus:border-black/10 shadow-apple appearance-none cursor-pointer backdrop-blur-xl"
                    >
                      <option value="">Mês</option>
                      {['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'].map((m, i) => (
                        <option key={i} value={String(i + 1)}>{m}</option>
                      ))}
                    </select>
                    <select
                      value={dateFilter.year}
                      onChange={e => setDateFilter(p => ({ ...p, year: e.target.value }))}
                      className="shrink-0 px-3 py-2.5 bg-white/70 border border-white/80 rounded-apple-lg text-[12px] font-medium text-[#1d1d1f] outline-none focus:border-black/10 shadow-apple appearance-none cursor-pointer backdrop-blur-xl"
                    >
                      <option value="">Ano</option>
                      {Array.from(new Set(assets.map(a => new Date(a.createdAt || a.date).getFullYear()))).sort((a: number, b: number) => b - a).map(y => (
                        <option key={y} value={String(y)}>{y}</option>
                      ))}
                    </select>
                    {(dateFilter.month || dateFilter.year) && (
                      <button
                        onClick={() => setDateFilter({ month: '', year: '' })}
                        className="button-nowrap shrink-0 px-2.5 py-2.5 text-[10px] font-bold text-[#86868b] hover:text-red-500 transition-colors uppercase tracking-widest"
                      >
                        Limpar
                      </button>
                    )}
                  </div>

                  <div className="flex items-center justify-between gap-2 sm:justify-start xl:shrink-0">
                    <div className="flex shrink-0 items-center bg-white/70 border border-white/80 rounded-apple-lg shadow-apple p-0.5 backdrop-blur-xl">
                      {([
                        { id: 'small', label: 'P', title: 'Miniaturas pequenas' },
                        { id: 'medium', label: 'M', title: 'Miniaturas médias' },
                        { id: 'large', label: 'G', title: 'Miniaturas grandes' },
                      ] as const).map(size => (
                        <button
                          key={size.id}
                          onClick={() => setAssetTileSize(size.id)}
                          title={size.title}
                          aria-label={size.title}
                          className={`h-8 min-w-8 rounded-[8px] px-2 text-[10px] font-bold transition-all ${assetTileSize === size.id ? 'bg-[#1d1d1f] text-white shadow-sm' : 'text-[#86868b] hover:text-[#1d1d1f] hover:bg-[#f5f5f7]'}`}
                        >
                          {size.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {dataLoadNotice && (
                  <div className="mt-4 flex items-start gap-2 rounded-[18px] border border-amber-200/70 bg-amber-50 px-4 py-3 text-[12px] font-medium leading-relaxed text-amber-800">
                    <AlertCircle size={15} className="mt-0.5 shrink-0" />
                    <span>{dataLoadNotice}</span>
                  </div>
                )}
              </header>

              {/* Grid */}
              <div className={`grid ${assetGridClass}`}>
                {filteredAssets.map(asset => (
                  <AssetCard key={asset.id} asset={asset} onClick={handleOpenAsset} ownerName={ownerName} />
                ))}
              </div>

              {filteredAssets.length === 0 && (
                <div className="text-center py-24 text-[#86868b]">
                  {isRefreshing ? (
                    <>
                      <Loader2 size={38} className="mx-auto mb-4 animate-spin text-[#1d1d1f]/30" />
                      <p className="text-[14px] font-medium mb-1">Carregando acervo científico</p>
                      <p className="text-[12px] text-[#aeaeb2]">Consultando cache local e Supabase...</p>
                    </>
                  ) : (
                    <>
                      <LayoutGrid size={40} className="mx-auto mb-4 opacity-25" />
                      <p className="text-[14px] font-medium mb-1">Nenhum ativo encontrado</p>
                      <p className="text-[12px] text-[#aeaeb2] mb-5">Tente ajustar os filtros ou adicione um novo ativo</p>
                      <button onClick={() => fileInputRef.current?.click()}
                        className="btn-ai px-5 py-2.5 rounded-apple-lg text-[12px] font-semibold shadow-apple">
                        Adicionar Ativo
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* CASES - Card View */}
        {view === ViewState.CASES && !editingCase && (() => {
          const statusConfig: Record<string, { label: string; color: string; bg: string; dot: string }> = {
            em_andamento: { label: 'Em Andamento', color: 'text-[#1d1d1f]', bg: 'bg-white/70', dot: 'bg-[#1d1d1f]' },
            completo: { label: 'Completo', color: 'text-[#424245]', bg: 'bg-white/60', dot: 'bg-[#6e6e73]' },
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
            <div className="px-5 sm:px-8 md:px-10 xl:px-12 pt-8 md:pt-10 pb-10 animate-fade-in">
              <header className="mb-8">
                <div className="flex flex-col gap-4 mb-7 lg:flex-row lg:items-center lg:justify-between">
                  <div className="min-w-0">
                    <h1 className="text-3xl sm:text-4xl font-extralight tracking-tight text-[#1d1d1f]">Cases Científicos</h1>
                    <p className="text-[11px] font-medium text-[#86868b] tracking-wider mt-1.5">{filteredCases.length} {filteredCases.length === 1 ? 'caso' : 'casos'} · Documentação Editorial</p>
                  </div>
                  <div className="flex w-full min-w-0 items-center gap-2 overflow-x-auto pb-1 no-scrollbar lg:w-auto lg:justify-end">
                    <div className="flex shrink-0 items-center bg-white/70 border border-white/80 rounded-apple-lg shadow-apple p-0.5 backdrop-blur-xl">
                      <button onClick={() => setCaseViewMode('list')} className={`shrink-0 p-2 rounded-[8px] transition-all ${caseViewMode === 'list' ? 'bg-[#1d1d1f] text-white' : 'text-[#86868b] hover:text-[#1d1d1f]'}`} aria-label="Ver cases em lista"><AlignJustify size={14} /></button>
                      <button onClick={() => setCaseViewMode('grid')} className={`shrink-0 p-2 rounded-[8px] transition-all ${caseViewMode === 'grid' ? 'bg-[#1d1d1f] text-white' : 'text-[#86868b] hover:text-[#1d1d1f]'}`} aria-label="Ver cases em grade"><LayoutGrid size={14} /></button>
                    </div>
                    <button onClick={handleCreateCase}
                      className="button-nowrap btn-ai flex shrink-0 items-center justify-center gap-2 rounded-apple-lg px-5 py-2.5 text-[13px] font-semibold shadow-apple hover:-translate-y-0.5">
                      <Plus size={15} /> Novo Case
                    </button>
                  </div>
                </div>

                {/* Search + Date Filter */}
                <div className="flex flex-col items-stretch gap-3 xl:flex-row xl:items-center">
                  <div className="relative min-w-0 flex-1 group">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                      <Search size={15} className="text-[#86868b] group-focus-within:text-[#1d1d1f] transition-colors" />
                    </div>
                    <input type="text" placeholder="Localizar case por título, tag ou conteúdo..."
                      value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                      className="lon-soft-search w-full pl-10 pr-4 py-3 rounded-full text-[13px] outline-none transition-all placeholder:text-[#9a9aa0]" />
                  </div>
                  <div className="flex min-w-0 items-center gap-2 overflow-x-auto pb-1 no-scrollbar xl:shrink-0 xl:pb-0">
                    <select
                      value={dateFilter.month}
                      onChange={e => setDateFilter(p => ({ ...p, month: e.target.value }))}
                      className="shrink-0 px-3 py-2.5 bg-white/70 border border-white/80 rounded-apple-lg text-[12px] font-medium text-[#1d1d1f] outline-none focus:border-black/10 shadow-apple appearance-none cursor-pointer backdrop-blur-xl"
                    >
                      <option value="">Mês</option>
                      {['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'].map((m, i) => (
                        <option key={i} value={String(i + 1)}>{m}</option>
                      ))}
                    </select>
                    <select
                      value={dateFilter.year}
                      onChange={e => setDateFilter(p => ({ ...p, year: e.target.value }))}
                      className="shrink-0 px-3 py-2.5 bg-white/70 border border-white/80 rounded-apple-lg text-[12px] font-medium text-[#1d1d1f] outline-none focus:border-black/10 shadow-apple appearance-none cursor-pointer backdrop-blur-xl"
                    >
                      <option value="">Ano</option>
                      {Array.from(new Set(activeAssets.filter(a => a.type === 'case').map(a => new Date(a.createdAt || a.date).getFullYear()))).sort((a: number, b: number) => b - a).map(y => (
                        <option key={y} value={String(y)}>{y}</option>
                      ))}
                    </select>
                    {(dateFilter.month || dateFilter.year) && (
                      <button
                        onClick={() => setDateFilter({ month: '', year: '' })}
                        className="button-nowrap shrink-0 px-2.5 py-2.5 text-[10px] font-bold text-[#86868b] hover:text-red-500 transition-colors uppercase tracking-widest"
                      >
                        Limpar
                      </button>
                    )}
                  </div>
                </div>

                {(dataLoadNotice || isRefreshing) && (
                  <div className={`mt-4 flex items-start gap-2 rounded-[18px] px-4 py-3 text-[12px] font-medium leading-relaxed ${
                    dataLoadNotice
                      ? 'border border-amber-200/70 bg-amber-50 text-amber-800'
                      : 'border border-white/80 bg-white/62 text-[#424245]'
                  }`}>
                    {dataLoadNotice ? <AlertCircle size={15} className="mt-0.5 shrink-0" /> : <Loader2 size={15} className="mt-0.5 shrink-0 animate-spin" />}
                    <span>{dataLoadNotice || 'Sincronizando seus cases com a nuvem. Seus dados continuam vinculados à sua conta.'}</span>
                  </div>
                )}
              </header>

              {/* Cases — List or Grid */}
              {filteredCases.length > 0 ? (
                caseViewMode === 'grid' ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {filteredCases.map(caseItem => {
                      const thumbnail = getCaseThumbnail(caseItem);
                      const status = statusConfig[caseItem.caseStatus || 'em_andamento'] || statusConfig.em_andamento;
                      return (
                        <div key={caseItem.id}
                          onClick={() => { setEditingCase(caseItem); setView(ViewState.CASES); }}
                          className="group cursor-pointer bg-white rounded-apple-xl border border-black/[0.06] shadow-apple overflow-hidden hover:shadow-apple-md hover:-translate-y-1 transition-all duration-300"
                        >
                          <div className="w-full h-[130px] bg-[#f5f5f7] overflow-hidden flex items-center justify-center">
                            {thumbnail
                              ? <img src={thumbnail} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="" />
                              : <Stethoscope size={24} className="text-[#aeaeb2] opacity-40" />
                            }
                          </div>
                          <div className="p-3">
                            <p className="text-[12px] font-semibold text-[#1d1d1f] line-clamp-2 leading-tight mb-1.5 transition-colors">
                              {caseItem.title || 'Novo Caso Clínico'}
                            </p>
                            <div className="flex items-center gap-1.5">
                              <div className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                              <span className={`text-[9px] font-semibold uppercase tracking-wide ${status.color}`}>{status.label}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                <div>
                  {filteredCases.map((caseItem, idx) => {
                    const thumbnail = getCaseThumbnail(caseItem);
                    const status = statusConfig[caseItem.caseStatus || 'em_andamento'] || statusConfig.em_andamento;

                    return (
                      <div key={caseItem.id}
                        onClick={() => { setEditingCase(caseItem); setView(ViewState.CASES); }}
                        className={`group flex items-center gap-4 px-3 py-3.5 hover:bg-white/70 rounded-[10px] transition-all cursor-pointer ${idx < filteredCases.length - 1 ? 'border-b border-black/[0.04]' : ''}`}
                      >
                        {/* Thumbnail */}
                        <div className="w-10 h-10 rounded-[10px] bg-[#f2f3f5] overflow-hidden shrink-0 flex items-center justify-center">
                          {thumbnail ? (
                            <img src={thumbnail} className="w-full h-full object-cover" alt="" />
                          ) : (
                            <Stethoscope size={15} className="text-[#c7c7cc]" />
                          )}
                        </div>

                        {/* Title + Preview */}
                        <div className="flex-1 min-w-0">
                          <p className={`line-clamp-2 text-[13px] font-medium leading-snug transition-colors ${caseItem.title ? 'text-[#1d1d1f]' : 'text-[#86868b] italic'}`}>
                            {caseItem.title || 'Novo Caso Clínico'}
                          </p>
                          <p className="line-clamp-2 text-[11px] text-[#c7c7cc] mt-0.5">{getCasePreview(caseItem)}</p>
                        </div>

                        {/* Tags */}
                        <div className="hidden sm:flex items-center gap-1.5 shrink-0">
                          {caseItem.tags?.slice(0, 2).map((tag, i) => (
                            <span key={i} className="px-2 py-0.5 rounded-[6px] bg-[#f2f3f5] text-[#8e8e93] text-[9px] font-medium">{tag}</span>
                          ))}
                        </div>

                        {/* Status */}
                        <div className="hidden md:flex items-center gap-1.5 shrink-0">
                          <div className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                          <span className={`text-[9px] font-semibold uppercase tracking-wider ${status.color}`}>{status.label}</span>
                        </div>

                        {/* Date */}
                        <span className="text-[10px] text-[#c7c7cc] font-medium shrink-0 w-16 text-right">
                          {new Date(caseItem.updatedAt || caseItem.createdAt || caseItem.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                        </span>

                        {/* Actions on hover */}
                        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                          <button onClick={e => { e.stopPropagation(); handleDeleteAsset(caseItem.id); }}
                            className="p-1.5 text-red-300 hover:text-red-500 transition-colors rounded-[8px] hover:bg-red-50 bg-red-50/50">
                            <Trash2 size={14} />
                          </button>
                        </div>

                        <ChevronRight size={13} className="text-[#d1d1d6] group-hover:text-[#1d1d1f] group-hover:translate-x-0.5 transition-all shrink-0" />
                      </div>
                    );
                  })}
                </div>
              )
            ) : (
                <div className="mx-auto max-w-md rounded-[30px] border border-black/[0.05] bg-white px-6 py-14 text-center text-[#86868b] shadow-[0_24px_80px_rgba(0,0,0,0.06)]">
                  {isRefreshing ? (
                    <>
                      <Loader2 size={38} className="mx-auto mb-4 animate-spin text-[#1d1d1f]/30" />
                      <p className="text-[14px] font-medium mb-1">Carregando cases científicos</p>
                      <p className="text-[12px] text-[#aeaeb2]">Consultando seu cache local e sua conta na nuvem.</p>
                    </>
                  ) : (
                    <>
                      <Stethoscope size={40} className="mx-auto mb-4 opacity-25" />
                      <p className="text-[14px] font-medium mb-1">Nenhum case criado ainda</p>
                      <p className="text-[12px] text-[#aeaeb2] mb-5">Cases científicos editoriais aparecerão aqui</p>
                      <button onClick={handleCreateCase}
                        className="button-nowrap btn-ai px-5 py-2.5 rounded-apple-lg text-[12px] font-semibold shadow-apple">
                        Criar Primeiro Case
                      </button>
                    </>
                  )}
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
                    <div className="w-11 h-11 rounded-apple bg-[#f2f3f5] overflow-hidden shrink-0 border border-black/6 opacity-50">
                      {getAssetPreviewSource(asset)
                        ? <img src={getAssetPreviewSource(asset) as string} alt="" className="w-full h-full object-cover" />
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
                        className="px-3.5 py-2 bg-[#f2f3f5] text-[#1d1d1f] rounded-apple text-[11px] font-semibold hover:bg-black/8 transition-all flex items-center gap-1.5">
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
        {view === ViewState.SETTINGS && (() => {
          const settingsTotalAssets = activeAssets.filter(a => a.type !== 'case').length;
          const settingsTotalCases  = activeAssets.filter(a => a.type === 'case').length;

          // Storage estimate: sum of attachment sizes + 500 KB per asset without attachments
          const storageBytes = activeAssets.reduce((acc, a) => {
            const attBytes = (a.attachments || []).reduce((s, att) => s + (att.size || 512_000), 0);
            return acc + (attBytes || 512_000);
          }, 0);
          const storageGB    = storageBytes / 1_073_741_824;   // bytes → GB
          const storageLimitGB = 10;
          const storagePct   = Math.min(100, (storageGB / storageLimitGB) * 100);

          // AI usage (tracked in localStorage)
          const aiCalls = getAIUsage();
          const aiLimit = 500;
          const aiPct   = Math.min(100, (aiCalls / aiLimit) * 100);

          const SL = ({ children }: { children: React.ReactNode }) => (
            <p className="text-[9px] font-bold text-[#aeaeb2] uppercase tracking-[0.22em] mb-3">{children}</p>
          );

          // Thin bar meter — monochromatic, no colors
          const BarMeter = ({ pct, label, sublabel, warning }: { pct: number; label: string; sublabel: string; warning?: boolean }) => (
            <div>
              <div className="flex items-baseline justify-between mb-2">
                <span className="text-[13px] font-medium text-[#1d1d1f]">{label}</span>
                <span className={`text-[11px] font-medium ${warning ? 'text-[#ff3b30]' : 'text-[#aeaeb2]'}`}>{pct.toFixed(0)}%</span>
              </div>
              <div className="h-[2px] bg-[#f2f3f5] rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-700 ease-out bg-[#1d1d1f]"
                  style={{ width: `${Math.min(100, pct)}%`, opacity: warning ? 1 : 0.6 }} />
              </div>
              <p className="text-[10px] text-[#aeaeb2] mt-1.5">{sublabel}</p>
            </div>
          );

          const horasEconomizadas = Math.round(settingsTotalCases * 3.5 + settingsTotalAssets * 0.3);

          // Monthly production data (last 6 months)
          const now = new Date();
          const monthlyData = Array.from({ length: 6 }, (_, i) => {
            const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
            const label = d.toLocaleDateString('pt-BR', { month: 'short' });
            const count = activeAssets.filter(a => {
              const ad = new Date(a.createdAt || a.date);
              return ad.getMonth() === d.getMonth() && ad.getFullYear() === d.getFullYear();
            }).length;
            return { label, count };
          });
          const maxMonthly = Math.max(1, ...monthlyData.map(m => m.count));

          return (
            <div className="px-5 sm:px-10 md:px-12 pt-8 md:pt-10 pb-16 animate-fade-in">
              <div className="max-w-2xl">

                {/* Header */}
                <h1 className="text-3xl sm:text-4xl font-extralight tracking-tight text-[#1d1d1f] mb-1">Produção Científica</h1>
                <p className="text-[11px] font-medium text-[#86868b] mb-8 tracking-wider">Lon Suite 4.0</p>

                {/* Identity */}
                <div className="mb-6">
                  <SL>Perfil</SL>
                  <div className="bg-white rounded-apple-xl p-5 border border-black/[0.06] shadow-apple">
                    <div className="flex items-center gap-4">
                      <label className="group relative h-14 w-14 shrink-0 cursor-pointer overflow-hidden rounded-full bg-[#1d1d1f] text-white ring-1 ring-black/[0.06]">
                        {profileDraft.avatarUrl ? (
                          <img src={profileDraft.avatarUrl} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <span className="flex h-full w-full items-center justify-center text-[18px] font-semibold">
                            {(profileDraft.name || ownerName || currentUser.email || '?').charAt(0).toUpperCase()}
                          </span>
                        )}
                        <span className="absolute inset-0 flex items-center justify-center bg-black/40 text-[8px] font-bold uppercase tracking-[0.12em] opacity-0 transition-opacity group-hover:opacity-100">Foto</span>
                        <input type="file" accept="image/*" className="hidden" onChange={handleProfileAvatarSelected} />
                      </label>

                      <div className="min-w-0 flex-1 space-y-3">
                        <div>
                          <label className="mb-1 block text-[9px] font-bold uppercase tracking-[0.18em] text-[#aeaeb2]">Nome</label>
                          <input
                            value={profileDraft.name}
                            onChange={e => setProfileDraft(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="Seu nome profissional"
                            className="w-full rounded-[12px] border border-black/[0.06] bg-[#fafafa] px-3 py-2 text-[13px] font-medium text-[#1d1d1f] outline-none transition-all placeholder:text-[#c7c7cc] focus:border-[#1d1d1f]/20 focus:bg-white"
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-[9px] font-bold uppercase tracking-[0.18em] text-[#aeaeb2]">Área de atuação</label>
                          <input
                            value={profileDraft.specialty}
                            onChange={e => setProfileDraft(prev => ({ ...prev, specialty: e.target.value }))}
                            placeholder="Ex: Cirurgia vascular, cardiologia..."
                            className="w-full rounded-[12px] border border-black/[0.06] bg-[#fafafa] px-3 py-2 text-[13px] font-medium text-[#1d1d1f] outline-none transition-all placeholder:text-[#c7c7cc] focus:border-[#1d1d1f]/20 focus:bg-white"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between gap-3 border-t border-black/[0.04] pt-4">
                      <p className="min-w-0 truncate text-[10px] text-[#aeaeb2]">{currentUser?.email}</p>
                      <button onClick={handleSaveProfile} className="flex shrink-0 items-center gap-1.5 rounded-full bg-[#1d1d1f] px-4 py-2 text-[10px] font-bold uppercase tracking-[0.14em] text-white transition-all hover:bg-[#333] active:scale-95">
                        <Save size={12} />
                        Salvar
                      </button>
                    </div>
                  </div>
                </div>

                {/* Numbers — 3-column */}
                <div className="mb-6">
                  <SL>Patrimônio</SL>
                  <div className="grid grid-cols-3 gap-px bg-black/[0.04] rounded-apple-xl overflow-hidden border border-black/[0.05]">
                    {[
                      { n: settingsTotalAssets, label: 'Ativos' },
                      { n: settingsTotalCases, label: 'Cases' },
                      { n: horasEconomizadas, label: 'h estimadas' },
                    ].map(({ n, label }) => (
                      <div key={label} className="bg-white px-4 py-5 text-center">
                        <p className="text-3xl font-extralight text-[#1d1d1f] tracking-tight leading-none mb-1.5">{n}</p>
                        <p className="text-[9px] font-semibold text-[#aeaeb2] uppercase tracking-widest">{label}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Monthly production chart — thin bars */}
                <div className="mb-6">
                  <SL>Produção Mensal</SL>
                  <div className="bg-white rounded-apple-xl p-5 border border-black/[0.06] shadow-apple">
                    <div className="flex items-end justify-between gap-2 h-[72px]">
                      {monthlyData.map(({ label, count }) => (
                        <div key={label} className="flex-1 flex flex-col items-center gap-1.5">
                          <div className="w-full flex items-end justify-center" style={{ height: '52px' }}>
                            <div
                              className="w-full max-w-[24px] rounded-sm bg-[#1d1d1f] transition-all duration-700"
                              style={{ height: count === 0 ? '2px' : `${Math.max(6, (count / maxMonthly) * 52)}px`, opacity: count === 0 ? 0.12 : 0.75 }}
                            />
                          </div>
                          <span className="text-[8px] text-[#aeaeb2] font-medium uppercase">{label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* AI Ghostwriter */}
                <div className="mb-6">
                  <SL>Ferramentas</SL>
                  <button
                    onClick={() => setShowGhostwriter(true)}
                    className="w-full bg-white rounded-apple-xl px-5 py-4 border border-black/[0.06] shadow-apple text-left hover:shadow-apple-md transition-all flex items-center gap-4 group"
                  >
                    <div className="w-9 h-9 rounded-[10px] bg-[#f2f3f5] flex items-center justify-center group-hover:bg-[#1d1d1f] transition-all shrink-0">
                      <Sparkles size={15} className="text-[#86868b] group-hover:text-white transition-colors" strokeWidth={1.5} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-semibold text-[#1d1d1f]">AI Ghostwriter</p>
                      <p className="text-[10px] text-[#aeaeb2]">Gerar rascunho IMRAD com base nos seus cases</p>
                    </div>
                    <ChevronRight size={14} className="text-[#d1d1d6] group-hover:text-[#1d1d1f] shrink-0 transition-colors" />
                  </button>
                </div>

                {/* Usage bars */}
                <div className="mb-6">
                  <SL>Recursos</SL>
                  <div className="bg-white rounded-apple-xl p-5 border border-black/6 shadow-apple space-y-5">
                    <BarMeter
                      pct={storagePct}
                      label="Armazenamento"
                      sublabel={`${storageGB < 0.01 ? '< 0.01' : storageGB.toFixed(2)} GB de ${storageLimitGB} GB`}
                      warning={storagePct >= 90}
                    />
                    <div className="h-px bg-[#f5f5f7]" />
                    <BarMeter
                      pct={aiPct}
                      label="IA — chamadas mensais"
                      sublabel={`${aiCalls} de ${aiLimit} utilizadas`}
                      warning={aiPct >= 90}
                    />
                  </div>
                </div>

                {/* Danger zone */}
                <div className="mb-3">
                  <SL>Dados</SL>
                  <div className="bg-white rounded-apple-xl px-5 py-4 border border-black/6 shadow-apple flex items-center justify-between">
                    <p className="text-[12px] text-[#86868b]">Limpar todos os dados locais</p>
                    <button onClick={() => openConfirmDialog({
                      title: 'Limpar todos os dados?',
                      message: 'Remove todos os ativos e cases deste dispositivo permanentemente.',
                      onConfirm: () => { localStorage.clear(); window.location.reload(); }
                    })} className="text-[11px] font-semibold text-[#ff3b30] hover:underline transition-colors">
                      Limpar
                    </button>
                  </div>
                </div>

              </div>
            </div>
          );
        })()}
      </main>

      {/* Upload Type Selection Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-[500] flex items-end justify-center p-0 sm:items-center sm:p-6">
          <div className="absolute inset-0 bg-[#1d1d1f]/24" onClick={() => setShowUploadModal(false)} />

          <div className="relative w-full max-h-[88vh] overflow-y-auto rounded-t-[28px] border border-black/[0.06] bg-[#f7f6f4] p-5 shadow-[0_22px_70px_rgba(29,29,31,0.18)] animate-scale-in sm:max-w-[700px] sm:rounded-[32px] sm:p-8">
            <div className="text-center mb-7 sm:mb-9">
              <h2 className="text-2xl sm:text-[32px] font-light tracking-tight text-slate-900 mb-3">
                Como deseja carregar?
              </h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.22em] sm:tracking-[0.28em]">
                Escolha o modo de upload ideal para você
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 sm:gap-4 mb-7 sm:mb-9">
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
                className="group flex min-h-[198px] min-w-0 flex-col items-center justify-center rounded-[24px] border border-black/[0.055] bg-white p-5 text-center shadow-[0_10px_34px_rgba(29,29,31,0.06)] transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_48px_rgba(29,29,31,0.10)] sm:min-h-[220px] sm:p-6"
              >
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-[18px] bg-[#1d1d1f] text-white transition-transform duration-200 group-hover:scale-105 sm:h-16 sm:w-16">
                  <FileText size={28} strokeWidth={1.5} />
                </div>
                <h3 className="mb-2.5 max-w-full text-[17px] font-semibold text-slate-800">Ativos Individuais</h3>
                <p className="mx-auto max-w-[210px] text-[12px] leading-relaxed text-slate-500 sm:text-[12.5px]">
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
                className="group flex min-h-[198px] min-w-0 flex-col items-center justify-center rounded-[24px] border border-black/[0.055] bg-white p-5 text-center shadow-[0_10px_34px_rgba(29,29,31,0.045)] transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_48px_rgba(29,29,31,0.09)] sm:min-h-[220px] sm:p-6"
              >
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-[18px] bg-[#f2f3f5] text-[#1d1d1f] ring-1 ring-black/[0.055] transition-transform duration-200 group-hover:scale-105 sm:h-16 sm:w-16">
                  <Briefcase size={27} strokeWidth={1.5} />
                </div>
                <h3 className="mb-2.5 max-w-full text-[17px] font-semibold text-slate-800">Grupo de Arquivos</h3>
                <p className="mx-auto max-w-[210px] text-[12px] leading-relaxed text-slate-500 sm:text-[12.5px]">
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
          onClose={() => { setSelectedAsset(null); setNewAssetId(null); }}
          onSave={handleSaveAsset}
          onDelete={selectedAsset.isDeleted ? handlePermanentDelete : handleDeleteAsset}
          isTrashMode={Boolean(selectedAsset.isDeleted)}
          onRestore={() => handleRestoreAsset(selectedAsset.id)}
          onConfirmDialog={openConfirmDialog}
          showFieldHint={selectedAsset.id === newAssetId}
        />
      )}

      {/* Ghostwriter Modal */}
      {showGhostwriter && (
        <div className="fixed inset-0 z-[600] bg-black/30 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-6 animate-fade-in">
          <div className="bg-white rounded-t-[32px] sm:rounded-[28px] shadow-apple-xl w-full sm:max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-scale-in">
            <div className="flex items-center justify-between p-6 border-b border-black/[0.06]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-[10px] bg-[#1d1d1f] flex items-center justify-center">
                  <Sparkles size={16} className="text-white" strokeWidth={1.5} />
                </div>
                <div>
                  <h2 className="text-[16px] font-semibold text-[#1d1d1f]">AI Ghostwriter</h2>
                  <p className="text-[10px] text-[#86868b]">Rascunho de artigo baseado nos seus cases</p>
                </div>
              </div>
              <button onClick={() => { setShowGhostwriter(false); setGhostwriterResult(null); }} className="w-8 h-8 rounded-full bg-[#f2f3f5] hover:bg-[#e5e5ea] flex items-center justify-center transition-all">
                <X size={14} className="text-[#86868b]" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {!ghostwriterResult ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-2xl bg-[#f2f3f5] flex items-center justify-center mx-auto mb-5">
                    <FileText size={28} strokeWidth={1} className="text-[#86868b]" />
                  </div>
                  <h3 className="text-[17px] font-semibold text-[#1d1d1f] mb-2">Gerar Rascunho IMRAD</h3>
                  <p className="text-[13px] text-[#86868b] leading-relaxed max-w-sm mx-auto mb-8">
                    O Ghostwriter analisa seus {activeAssets.filter(a => a.type === 'case').length} cases documentados e gera um rascunho estruturado no formato IMRAD, pronto para adaptar e submeter.
                  </p>
                  <div className="grid grid-cols-2 gap-3 text-left mb-8 max-w-sm mx-auto">
                    {['Introdução', 'Metodologia', 'Resultados', 'Discussão'].map(s => (
                      <div key={s} className="flex items-center gap-2 px-3 py-2 bg-[#f2f3f5] rounded-[10px]">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#1d1d1f]" />
                        <span className="text-[11px] font-medium text-[#1d1d1f]">{s}</span>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={generateArticleDraft}
                    disabled={isGeneratingArticle || activeAssets.filter(a => a.type === 'case').length === 0}
                    className="px-8 py-3 bg-[#1d1d1f] text-white rounded-full text-[13px] font-semibold hover:bg-[#333] disabled:opacity-40 transition-all shadow-apple flex items-center gap-2 mx-auto"
                  >
                    {isGeneratingArticle ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                    {isGeneratingArticle ? 'Gerando rascunho...' : 'Gerar Rascunho'}
                  </button>
                  {activeAssets.filter(a => a.type === 'case').length === 0 && (
                    <p className="text-[11px] text-[#aeaeb2] mt-3">Crie pelo menos um case clínico para usar o Ghostwriter.</p>
                  )}
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[11px] font-bold text-[#86868b] uppercase tracking-widest">Rascunho gerado</span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(ghostwriterResult);
                        setCopiedGhostwriter(true);
                        setTimeout(() => setCopiedGhostwriter(false), 2000);
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-[#f2f3f5] hover:bg-[#e5e5ea] rounded-apple text-[11px] font-semibold text-[#1d1d1f] transition-all"
                    >
                      {copiedGhostwriter ? <CheckCircle2 size={12} className="text-emerald-500" /> : <Copy size={12} />}
                      {copiedGhostwriter ? 'Copiado!' : 'Copiar'}
                    </button>
                  </div>
                  <pre className="text-[12px] text-[#424245] leading-relaxed whitespace-pre-wrap font-sans bg-[#f5f5f7] rounded-[14px] p-5 overflow-auto max-h-[400px]">
                    {ghostwriterResult}
                  </pre>
                  <button onClick={() => setGhostwriterResult(null)} className="mt-4 text-[11px] font-medium text-[#86868b] hover:text-[#1d1d1f] transition-colors">
                    ← Gerar novamente
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
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
                className="flex-1 px-5 py-2.5 bg-[#f2f3f5] text-[#1d1d1f] rounded-apple-lg font-semibold text-[13px] hover:bg-black/8 transition-all">
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

      {appToast && (
        <div className="pointer-events-none fixed bottom-24 left-1/2 z-[700] w-[calc(100vw-32px)] max-w-sm -translate-x-1/2 animate-save-toast md:bottom-8">
          <div className={`mx-auto flex items-center justify-center gap-2 rounded-full px-4 py-3 text-[12px] font-semibold shadow-[0_18px_60px_rgba(0,0,0,0.18)] backdrop-blur-xl ${
            appToast.tone === 'warning'
              ? 'border border-amber-200 bg-amber-50 text-amber-800'
              : appToast.tone === 'info'
                ? 'border border-black/[0.06] bg-white/94 text-[#1d1d1f]'
                : 'bg-[#1d1d1f] text-white'
          }`}>
            {appToast.tone === 'warning' ? <AlertCircle size={14} /> : <CheckCircle2 size={14} />}
            <span>{appToast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
