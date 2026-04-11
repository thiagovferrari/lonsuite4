
import React, { useState, useEffect, useRef } from 'react';
import { Asset, Attachment } from '../types';
import {
    X, Save, Trash2, ExternalLink, Download, FileText, MonitorPlay,
    PenLine, Activity, RotateCcw, Paperclip, Plus,
    Brain, AlertTriangle, ChevronLeft, ChevronRight, Briefcase
} from 'lucide-react';
import { analyzeAsset } from '../services/geminiService';
import { getAttachmentData, saveAttachmentData, deleteAttachmentData } from '../services/storageService';

interface AssetModalProps {
    asset: Asset;
    onClose: () => void;
    onSave: (updatedAsset: Asset) => void;
    onDelete: (id: string) => void;
    isTrashMode?: boolean;
    onRestore?: () => void;
    onConfirmDialog?: (opts: { title: string; message: string; onConfirm: () => void }) => void;
}

const AssetModal: React.FC<AssetModalProps> = ({
    asset, onClose, onSave, onDelete, isTrashMode = false, onRestore, onConfirmDialog
}) => {
    const [editedAsset, setEditedAsset] = useState<Asset>(asset);
    const [isEditingMetadata, setIsEditingMetadata] = useState(false);
    const [isEditingContent, setIsEditingContent] = useState(false);
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState(false);
    const [isProcessingManual, setIsProcessingManual] = useState(false);
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
    const [tagInput, setTagInput] = useState('');
    const [saveStatus, setSaveStatus] = useState<'' | 'salvando' | 'salvo'>('');
    const contentRef = useRef<HTMLDivElement>(null);

    const [thumbUrls, setThumbUrls] = useState<Record<string, string>>({});

    useEffect(() => {
        let cancelled = false;
        if (!asset.attachments) return;
        asset.attachments.forEach(att => {
            if (typeof att.type === 'string' && att.type.includes('image') && !thumbUrls[att.id]) {
                if (att.data) {
                    setThumbUrls(prev => ({...prev, [att.id]: att.data!}));
                } else {
                    getAttachmentData(att.id).then(data => {
                        if (data && !cancelled) setThumbUrls(prev => ({...prev, [att.id]: data}));
                    });
                }
            }
        });
        return () => { cancelled = true; };
    }, [asset.attachments]);

    useEffect(() => {
        setEditedAsset(asset);
        setDeleteConfirm(false);
        setIsEditingMetadata(false);
        setIsEditingContent(false);
        setIsEditingTitle(false);
        setCurrentSlideIndex(0);
    }, [asset]);

    const base64ToBlobAsync = async (base64: string, fallbackMime = 'application/pdf'): Promise<Blob | null> => {
        try {
            let dataUrl = base64;
            if (!dataUrl.startsWith('data:')) {
                dataUrl = `data:${fallbackMime};base64,${base64}`;
            }
            const res = await fetch(dataUrl);
            return await res.blob();
        } catch (e) {
            console.error('Blob conversion failed:', e);
            return null;
        }
    };

    useEffect(() => {
        let url: string | null = null;
        let cancelled = false;
        const load = async () => {
            if (typeof asset.thumbnail === 'string' && asset.thumbnail.startsWith('data:application/pdf')) {
                const blob = await base64ToBlobAsync(asset.thumbnail, 'application/pdf');
                if (blob && !cancelled) { url = URL.createObjectURL(blob); setPdfBlobUrl(url); }
            } else if (asset.type === 'pdf') {
                const data = await getAttachmentData(asset.id);
                if (data && !cancelled) {
                    if (data.startsWith('http')) {
                        setPdfBlobUrl(data);
                    } else {
                        const blob = await base64ToBlobAsync(data, 'application/pdf');
                        if (blob && !cancelled) { url = URL.createObjectURL(blob); setPdfBlobUrl(url); }
                    }
                }
            }
        };
        load();
        return () => { cancelled = true; if (url) URL.revokeObjectURL(url); };
    }, [asset]);

    const activeAttachment = editedAsset.attachments?.[currentSlideIndex];
    const [activeSlideBlobUrl, setActiveSlideBlobUrl] = useState<string | null>(null);

    useEffect(() => {
        let url: string | null = null;
        let cancelled = false;
        const load = async () => {
            if (!activeAttachment) return;
            if (activeAttachment.data) {
                const blob = await base64ToBlobAsync(activeAttachment.data, activeAttachment.type || 'application/octet-stream');
                if (blob && !cancelled) { url = URL.createObjectURL(blob); setActiveSlideBlobUrl(url); }
            } else {
                const data = await getAttachmentData(activeAttachment.id);
                if (data && !cancelled) {
                    if (data.startsWith('http')) {
                        setActiveSlideBlobUrl(data);
                    } else {
                        const blob = await base64ToBlobAsync(data, activeAttachment.type || 'application/octet-stream');
                        if (blob && !cancelled) { url = URL.createObjectURL(blob); setActiveSlideBlobUrl(url); }
                    }
                }
            }
        };
        load();
        return () => { cancelled = true; if (url) URL.revokeObjectURL(url); };
    }, [currentSlideIndex, asset.id, activeAttachment]);

    const handleNextSlide = () => { if (editedAsset.attachments) setCurrentSlideIndex(p => (p + 1) % editedAsset.attachments!.length); };
    const handlePrevSlide = () => { if (editedAsset.attachments) setCurrentSlideIndex(p => (p - 1 + editedAsset.attachments!.length) % editedAsset.attachments!.length); };

    const handleSaveAll = () => {
        setSaveStatus('salvando');
        setTimeout(() => {
            let final = { ...editedAsset };
            if (isEditingContent && contentRef.current) final.content = contentRef.current.innerHTML;
            onSave(final);
            setEditedAsset(final);
            setSaveStatus('salvo');
            setTimeout(() => setSaveStatus(''), 2000);
        }, 400);
    };

    const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && tagInput.trim()) {
            e.preventDefault();
            const newTags = [...(editedAsset.tags || []), tagInput.trim()];
            const final = { ...editedAsset, tags: newTags };
            setEditedAsset(final);
            onSave(final);
            setTagInput('');
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        const newTags = (editedAsset.tags || []).filter(t => t !== tagToRemove);
        const final = { ...editedAsset, tags: newTags };
        setEditedAsset(final);
        onSave(final);
    };

    const handleEditClick = () => {
        setIsEditingMetadata(true);
        setIsEditingTitle(true);
        if (asset.type === 'document') setIsEditingContent(true);
    };

    const handleDeleteClick = () => {
        if (deleteConfirm) { onDelete(asset.id); }
        else { setDeleteConfirm(true); setTimeout(() => setDeleteConfirm(false), 3000); }
    };

    const handleShareLink = () => {
        const shareUrl = `${window.location.origin}?share=${asset.id}&type=${asset.type === 'case' ? 'case' : 'asset'}`;
        navigator.clipboard.writeText(shareUrl);
        setCopyFeedback(true);
        setTimeout(() => setCopyFeedback(false), 2000);
        // Mostrar alerta simpes
        alert('Link de compartilhamento copiado!');
    };

    const handleDownload = async () => {
        const isGroup = (asset.attachments?.length ?? 0) > 1;

        if (isGroup && asset.attachments) {
            // ZIP download for grouped assets
            const JSZip = (await import('jszip')).default;
            const zip = new JSZip();
            for (const att of asset.attachments) {
                const data = att.data || (await getAttachmentData(att.id));
                if (data) {
                    // Convert base64 to binary
                    const base64Content = data.split(',')[1];
                    if (base64Content) {
                        zip.file(att.name, base64Content, { base64: true });
                    }
                }
            }
            const blob = await zip.generateAsync({ type: 'blob' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${(asset.title || 'arquivo').replace(/\s+/g, '_')}.zip`;
            document.body.appendChild(link); link.click(); document.body.removeChild(link);
            setTimeout(() => URL.revokeObjectURL(url), 100);
        } else {
            // Single file download
            const link = document.createElement('a');
            let blob: Blob | null = null;
            let fileName = (asset.title || 'arquivo').replace(/\s+/g, '_');
            if (asset.type === 'document' && asset.content) {
                blob = new Blob([asset.content], { type: 'text/html' });
                fileName += '.html';
            } else {
                if (typeof asset.thumbnail === 'string' && asset.thumbnail.startsWith('data:')) { blob = await base64ToBlobAsync(asset.thumbnail, 'application/octet-stream'); }
                else {
                    const data = await getAttachmentData(asset.id);
                    if (data) blob = await base64ToBlobAsync(data, 'application/octet-stream');
                }
                if (blob) fileName += `.${blob.type.split('/')[1] || 'bin'}`;
            }
            if (blob) {
                const url = URL.createObjectURL(blob);
                link.href = url; link.download = fileName;
                document.body.appendChild(link); link.click(); document.body.removeChild(link);
                setTimeout(() => URL.revokeObjectURL(url), 100);
            }
        }
    };

    const handleAttachmentDownload = async (att: Attachment) => {
        let data = att.data || (await getAttachmentData(att.id)) || undefined;
        if (data) {
            const blob = await base64ToBlobAsync(data, att.type || 'application/octet-stream');
            if (blob) {
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url; link.download = att.name;
                document.body.appendChild(link); link.click(); document.body.removeChild(link);
                setTimeout(() => URL.revokeObjectURL(url), 100);
                return;
            }
        }
    };

    const handleAddAttachment = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        Array.from(e.target.files).forEach(async (file: File) => {
            const reader = new FileReader();
            reader.onload = async () => {
                const base64 = reader.result as string;
                const attId = crypto.randomUUID();
                await saveAttachmentData(attId, base64);
                const newAtt: Attachment = { id: attId, name: file.name, type: file.type, size: file.size };
                const updated = { ...editedAsset, attachments: [...(editedAsset.attachments || []), newAtt] };
                setEditedAsset(updated); onSave(updated);
            };
            reader.readAsDataURL(file);
        });
    };

    const handleDeleteAttachment = async (attId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        const doDelete = () => {
            deleteAttachmentData(attId);
            const updated = editedAsset.attachments?.filter(a => a.id !== attId) || [];
            if (currentSlideIndex >= updated.length && updated.length > 0) setCurrentSlideIndex(updated.length - 1);
            const updatedAsset = { ...editedAsset, attachments: updated };
            setEditedAsset(updatedAsset); onSave(updatedAsset);
        };
        if (onConfirmDialog) {
            onConfirmDialog({ title: 'Remover anexo?', message: 'Este arquivo será removido permanentemente do ativo.', onConfirm: doDelete });
        } else { doDelete(); }
    };

    const handleProcessWithAI = async () => {
        if (!editedAsset.thumbnail) return;
        setIsProcessingManual(true);
        try {
            const mimeMatch = editedAsset.thumbnail.match(/:(.*?);/);
            const mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg';
            const base64Data = editedAsset.thumbnail.split(',')[1];
            const analysis = await analyzeAsset(base64Data, mimeType, 'Medicina');
            setEditedAsset(prev => ({ ...prev, ...analysis }));
        } catch { /* silent */ }
        finally { setIsProcessingManual(false); }
    };

    const renderPreview = () => {
        if (asset.type === 'document') {
            return (
                <div className="w-full h-full bg-white relative flex flex-col">
                    <div className="absolute top-5 right-6 z-20 flex gap-2">
                        {(isEditingContent || isEditingTitle) ? (
                            <button onClick={handleSaveAll} className="flex items-center gap-2 px-4 py-2 btn-ai rounded-full text-[11px] font-semibold hover:shadow-apple transition-all">
                                <Save size={13} /> Salvar
                            </button>
                        ) : (
                            <button onClick={handleEditClick} className="flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur border border-black/10 text-[#1d1d1f] rounded-full text-[11px] font-semibold hover:bg-white shadow-apple transition-all">
                                <PenLine size={13} /> Editar
                            </button>
                        )}
                    </div>
                    <div className="flex-1 overflow-y-auto custom-scrollbar px-10 py-14">
                        <div className="max-w-2xl mx-auto">
                            {isEditingTitle ? (
                                <input value={editedAsset.title} onChange={e => setEditedAsset({ ...editedAsset, title: e.target.value })}
                                    className="text-3xl font-semibold mb-8 text-[#1d1d1f] tracking-tight w-full border-b-2 border-[#4285F4]/40 focus:border-[#4285F4] outline-none pb-1 bg-transparent transition-all"
                                    placeholder="Título do Documento" />
                            ) : (
                                <h2 className="text-3xl font-semibold mb-8 text-[#1d1d1f] tracking-tight leading-tight">{editedAsset.title}</h2>
                            )}
                            <div ref={contentRef} contentEditable={isEditingContent} suppressContentEditableWarning
                                className={`prose prose-slate text-base leading-loose text-[#424245] outline-none ${isEditingContent ? 'ring-2 ring-[#4285F4]/20 rounded-xl p-4 bg-[#f5f5f7]/50' : ''}`}
                                dangerouslySetInnerHTML={{ __html: editedAsset.content || 'Sem conteúdo.' }} />
                        </div>
                    </div>
                </div>
            );
        }

        if (editedAsset.type === 'image' && editedAsset.attachments && editedAsset.attachments.length > 0) {
            return (
                <div className="w-full h-full bg-[#f5f5f7] flex flex-col relative overflow-hidden">
                    <div className="flex-1 relative flex items-center justify-center p-6 min-h-[400px]">
                        {activeSlideBlobUrl && typeof activeAttachment?.type === 'string' && activeAttachment.type.includes('image') ? (
                            <img src={activeSlideBlobUrl} alt="" className="max-w-full max-h-full object-contain rounded-apple-lg shadow-apple bg-white" />
                        ) : activeSlideBlobUrl && typeof activeAttachment?.type === 'string' && activeAttachment.type.includes('pdf') ? (
                            <iframe src={activeSlideBlobUrl} className="w-full h-full rounded-apple-lg shadow-apple bg-white border-none" />
                        ) : (
                            <div className="flex flex-col items-center justify-center text-[#86868b] gap-3">
                                <FileText size={48} strokeWidth={1} />
                                <p className="text-sm font-medium">Visualização não disponível</p>
                            </div>
                        )}
                        {editedAsset.attachments.length > 1 && (
                            <>
                                <button onClick={handlePrevSlide}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-white/95 backdrop-blur-sm rounded-full shadow-apple-md hover:bg-white text-[#1d1d1f] transition-all active:scale-95 hover:shadow-apple-lg">
                                    <ChevronLeft size={22} />
                                </button>
                                <button onClick={handleNextSlide}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-white/95 backdrop-blur-sm rounded-full shadow-apple-md hover:bg-white text-[#1d1d1f] transition-all active:scale-95 hover:shadow-apple-lg">
                                    <ChevronRight size={22} />
                                </button>
                                {/* Dot indicators */}
                                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 bg-black/20 backdrop-blur-sm rounded-full px-3 py-1.5">
                                    {editedAsset.attachments.map((_, idx) => (
                                        <button key={idx} onClick={() => setCurrentSlideIndex(idx)}
                                            className={`rounded-full transition-all ${currentSlideIndex === idx ? 'w-2 h-2 bg-white' : 'w-1.5 h-1.5 bg-white/50 hover:bg-white/70'}`} />
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                    {/* Thumbnail strip */}
                    <div className="h-[88px] bg-white/90 backdrop-blur border-t border-black/6 flex items-center gap-2.5 px-5 overflow-x-auto no-scrollbar shrink-0">
                        {editedAsset.attachments.map((att, idx) => (
                            <div key={att.id} onClick={() => setCurrentSlideIndex(idx)}
                                className={`w-[60px] h-[60px] rounded-apple overflow-hidden cursor-pointer transition-all border-2 relative shrink-0 group/thumb ${currentSlideIndex === idx ? 'border-[#4285F4] shadow-apple' : 'border-transparent opacity-50 hover:opacity-80'}`}>
                                {typeof att.type === 'string' && att.type.includes('image') ? (
                                    <img src={thumbUrls[att.id] || att.data} className="w-full h-full object-cover bg-[#f5f5f7]" />
                                ) : (
                                    <div className="w-full h-full bg-[#f5f5f7] flex items-center justify-center">
                                        <FileText size={18} className="text-[#86868b]" />
                                    </div>
                                )}
                                {!isTrashMode && (
                                    <button onClick={e => handleDeleteAttachment(att.id, e)}
                                        className="absolute top-0.5 right-0.5 p-0.5 bg-red-500/90 text-white rounded-full opacity-0 group-hover/thumb:opacity-100 transition-opacity hover:bg-red-600 shadow-sm">
                                        <X size={9} />
                                    </button>
                                )}
                            </div>
                        ))}
                        {/* Count indicator */}
                        <div className="ml-auto shrink-0 text-[10px] font-semibold text-[#86868b] bg-[#f5f5f7] px-2.5 py-1 rounded-full">
                            {currentSlideIndex + 1} / {editedAsset.attachments.length}
                        </div>
                    </div>
                </div>
            );
        }

        const isPdfType = asset.type === 'pdf' || (typeof asset.thumbnail === 'string' && asset.thumbnail.startsWith('data:application/pdf')) || (typeof asset.title === 'string' && asset.title.toLowerCase().endsWith('.pdf'));
        if (isPdfType) {
            return (
                <div className="w-full h-full space-y-0 bg-[#f5f5f7] flex flex-col relative z-0">
                    {pdfBlobUrl ? (
                        <iframe src={pdfBlobUrl} className="w-full h-full border-none flex-1" title="PDF Viewer" style={{ minHeight: '100%' }} />
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center gap-3 text-[#86868b]">
                            <FileText size={40} strokeWidth={1} />
                            <p className="text-sm font-medium">Carregando PDF...</p>
                        </div>
                    )}
                    {pdfBlobUrl && (
                        <div className="absolute bottom-5 left-1/2 -translate-x-1/2">
                            <button onClick={() => window.open(pdfBlobUrl, '_blank')}
                                className="px-5 py-2.5 bg-[#1d1d1f]/90 backdrop-blur text-white rounded-full shadow-apple-lg hover:bg-[#1d1d1f] transition-all flex items-center gap-2 text-[11px] font-semibold active:scale-95">
                                <ExternalLink size={13} /> Abrir em Nova Aba
                            </button>
                        </div>
                    )}
                </div>
            );
        }

        if (asset.thumbnail) {
            return <img src={asset.thumbnail} alt="Preview" className="w-full h-full object-contain bg-[#f5f5f7]" />;
        }

        return (
            <div className="w-full h-full flex flex-col items-center justify-center text-[#86868b] gap-4 bg-[#f5f5f7]">
                <MonitorPlay size={40} strokeWidth={1} className="opacity-40" />
                <p className="text-sm font-light">Visualização não disponível</p>
                <button onClick={handleDownload} className="text-[#4285F4] text-xs font-semibold hover:underline">Baixar Arquivo</button>
            </div>
        );
    };

    const evidenceBadge = (level?: string) => {
        const map: Record<string, string> = {
            'Alto': 'bg-emerald-100 text-emerald-700',
            'Moderado': 'bg-amber-100 text-amber-700',
            'Baixo': 'bg-[#f5f5f7] text-[#86868b]',
        };
        return map[level || 'Baixo'] || map['Baixo'];
    };

    const isContainerPdf = asset.type === 'pdf' || (typeof asset.thumbnail === 'string' && asset.thumbnail.startsWith('data:application/pdf')) || (typeof asset.title === 'string' && asset.title.toLowerCase().endsWith('.pdf'));

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center sm:p-2 md:p-6 animate-fade-in">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-md" onClick={onClose} />
            <div className={`relative w-full ${isContainerPdf ? 'md:max-w-7xl md:h-[96vh]' : 'md:max-w-5xl md:h-[88vh]'} h-[100dvh] bg-white md:rounded-apple-2xl shadow-apple-xl flex flex-col md:flex-row ring-1 ring-white/20 animate-scale-in overflow-hidden`}>

                {/* Preview (left) */}
                <div className="flex-1 relative flex items-center justify-center h-[50vh] md:h-full order-last md:order-first bg-[#f5f5f7]">
                    {renderPreview()}
                    <div className="md:hidden absolute top-4 left-4 z-10 pointer-events-none">
                        <button onClick={onClose} className="pointer-events-auto p-2 bg-white/25 backdrop-blur rounded-full text-white active:scale-95">
                            <X size={18} />
                        </button>
                    </div>
                </div>

                {/* Metadata panel (right) */}
                <div className="w-full md:w-[380px] shrink-0 bg-white flex flex-col h-[50vh] md:h-full border-l border-black/6 z-20">
                    {/* Header */}
                    <div className="px-6 py-5 border-b border-black/6 flex justify-between items-start shrink-0">
                        <div className="flex-1 min-w-0 mr-3">
                            {!isTrashMode ? (
                                <div className="relative group/title w-full flex items-center mb-1">
                                    <input
                                        value={editedAsset.title}
                                        onChange={e => setEditedAsset({ ...editedAsset, title: e.target.value })}
                                        onBlur={handleSaveAll}
                                        className="text-[17px] font-semibold text-[#1d1d1f] bg-transparent hover:bg-black/5 focus:bg-white border hover:border-black/10 border-transparent focus:border-[#4285F4]/40 focus:outline-none w-full px-1.5 py-0.5 rounded transition-all leading-snug"
                                        placeholder="Título do Ativo"
                                    />
                                    <PenLine size={13} className="text-[#86868b] opacity-0 group-hover/title:opacity-100 transition-opacity absolute right-2 pointer-events-none" />
                                </div>
                            ) : (
                                <h2 className="text-[17px] font-semibold text-[#1d1d1f] leading-snug break-words pr-2" style={{ overflowWrap: 'anywhere' }}>
                                    {editedAsset.title}
                                </h2>
                            )}
                            <p className="text-[11px] text-[#86868b] mt-1.5 flex items-center gap-1.5 uppercase tracking-wide">
                                {(asset.type === 'case' || (editedAsset.attachments?.length ?? 0) > 0) && <Briefcase size={10} className="text-[#4285F4]" />}
                                <span className="font-medium">{asset.type}</span>
                                <span className="opacity-40">·</span>
                                {new Date(asset.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: '2-digit' })}
                            </p>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                            {saveStatus && (
                                <span className={`text-[10px] font-bold tracking-wide uppercase ${saveStatus === 'salvo' ? 'text-emerald-500' : 'text-[#86868b] animate-pulse'}`}>
                                    {saveStatus === 'salvo' ? 'Salvo' : 'Salvando...'}
                                </span>
                            )}
                            <button onClick={onClose} className="hidden md:flex p-2 hover:bg-black/5 rounded-full text-[#86868b] hover:text-[#1d1d1f] transition-colors shrink-0">
                                <X size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Body */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar px-5 py-5 space-y-4">
                        {/* Action buttons */}
                        <div className="flex gap-2.5">
                            <button onClick={handleDownload}
                                className="w-full py-2.5 rounded-apple bg-[#f5f5f7] text-[#1d1d1f] text-[11px] font-semibold hover:bg-black/8 transition-colors flex items-center justify-center gap-1.5">
                                <Download size={13} /> Baixar Ativo
                            </button>
                        </div>


                        {/* Process with AI (manual assets only) */}
                        {editedAsset.tags?.length === 0 && !isTrashMode && (
                            <button onClick={handleProcessWithAI} disabled={isProcessingManual}
                                className="w-full py-2.5 btn-ai rounded-apple font-semibold text-[11px] disabled:opacity-50">
                                {isProcessingManual ? <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Brain size={13} className="text-blue-300" />}
                                {isProcessingManual ? 'Analisando...' : 'Processar com IA'}
                            </button>
                        )}

                        <div className="divider" />

                        {/* Evidence panel */}
                        <div className="bg-white border border-black/6 rounded-apple-lg overflow-hidden shadow-apple">
                            <div className="px-4 py-3 border-b border-black/6 flex items-center gap-2 bg-[#f5f5f7]/60">
                                <Activity size={13} className="text-[#86868b]" />
                                <span className="text-[10px] font-semibold text-[#86868b] uppercase tracking-widest">Painel de Evidências</span>
                            </div>
                            <div className="p-4 space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-[11px] text-[#86868b] font-medium">Nível</span>
                                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide ${evidenceBadge(editedAsset.evidenceLevel || asset.evidenceLevel)}`}>
                                        {editedAsset.evidenceLevel || asset.evidenceLevel || 'Baixo'}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-[11px] text-[#86868b] font-medium">Ano de Publicação</span>
                                    <span className="text-[11px] text-[#1d1d1f] font-semibold">{editedAsset.publicationYear || asset.publicationYear || '—'}</span>
                                </div>
                                <div>
                                    <span className="text-[11px] text-[#86868b] font-medium block mb-1.5">Achados Principais</span>
                                    <p className="text-[11px] text-[#424245] leading-relaxed bg-[#f5f5f7] p-2.5 rounded-apple">{editedAsset.keyFindings || asset.keyFindings || 'Nenhum dado extraído ainda.'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Scientific context */}
                        <div className="bg-[#f0f6ff] p-4 rounded-apple-lg border border-blue-100/50 group/ctx relative">
                            <div className="flex justify-between items-center mb-1.5">
                                <h3 className="text-[10px] font-semibold text-[#4285F4] uppercase tracking-widest flex items-center gap-1.5">
                                    Contexto Científico
                                    {!isTrashMode && <PenLine size={10} className="text-[#4285F4] opacity-50" />}
                                </h3>
                            </div>
                            {!isTrashMode ? (
                                <textarea value={editedAsset.scientificContext || ''}
                                    onChange={e => setEditedAsset({ ...editedAsset, scientificContext: e.target.value })}
                                    onBlur={handleSaveAll}
                                    placeholder="Adicione referências científicas aqui..."
                                    className="w-full text-[12px] text-[#424245] leading-relaxed bg-transparent hover:bg-white p-2 -ml-2 rounded border border-transparent hover:border-blue-200 focus:bg-white focus:outline-none focus:border-[#4285F4]/40 resize-none transition-all text-justify"
                                    rows={3} />
                            ) : (
                                <p className="text-[12px] text-[#424245] italic leading-relaxed text-justify">
                                    "{editedAsset.scientificContext || asset.scientificContext || 'Sem referência científica.'}"
                                </p>
                            )}
                        </div>

                            {/* Attachments */}
                            {editedAsset.attachments && editedAsset.attachments.length > 0 && (
                                <div className="mt-3 pt-3 border-t border-blue-100 space-y-2">
                                    {editedAsset.attachments.map(att => (
                                        <div key={att.id}
                                            className="bg-white border border-blue-100 text-[#1d1d1f] px-3 py-2.5 rounded-apple text-[11px] font-medium flex items-center gap-2 shadow-apple group/att">
                                            <div className="flex-1 flex items-center gap-2 cursor-pointer hover:text-[#4285F4] transition-colors min-w-0"
                                                onClick={() => handleAttachmentDownload(att)}>
                                                <Paperclip size={11} className="text-[#4285F4] shrink-0" />
                                                <span className="truncate">{att.name}</span>
                                            </div>
                                            {!isTrashMode && (
                                                <button onClick={e => handleDeleteAttachment(att.id, e)}
                                                    className="p-1 hover:bg-red-50 text-[#86868b] hover:text-red-500 rounded-lg transition-colors opacity-0 group-hover/att:opacity-100 shrink-0">
                                                    <Trash2 size={11} />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}

                        {/* Summary */}
                        <div className="group/sum -mt-1 pt-4 border-t border-black/6">
                            <div className="flex items-center gap-1.5 mb-1">
                                <h3 className="text-[10px] font-semibold text-[#86868b] uppercase tracking-widest">Resumo Visual</h3>
                                {!isTrashMode && <PenLine size={10} className="text-[#86868b] opacity-50" />}
                            </div>
                            {!isTrashMode ? (
                                <textarea value={editedAsset.summary || ''}
                                    onChange={e => setEditedAsset({ ...editedAsset, summary: e.target.value })}
                                    onBlur={handleSaveAll}
                                    placeholder="Descreva visualmente o ativo..."
                                    className="w-full text-[12px] text-[#424245] leading-relaxed bg-transparent hover:bg-[#f5f5f7] p-2 -ml-2 rounded border border-transparent hover:border-black/10 focus:bg-[#f5f5f7] focus:outline-none focus:border-[#4285F4]/40 resize-none transition-all"
                                    rows={2} />
                            ) : (
                                <p className="text-[12px] text-[#424245] leading-relaxed font-light">{asset.summary || 'Sem descrição.'}</p>
                            )}
                        </div>

                        {/* Tags */}
                        <div className="pt-4 border-t border-black/6">
                            <div className="flex items-center gap-1.5 mb-2.5">
                                <h3 className="text-[10px] font-semibold text-[#86868b] uppercase tracking-widest">Tags (Pressione Enter)</h3>
                            </div>
                            <div className="flex flex-wrap gap-1.5 mb-2">
                                {(editedAsset.tags || []).filter(t => typeof t === 'string').map((tag, idx) => (
                                    <span key={`${tag}-${idx}`}
                                        className="px-2.5 py-1 rounded-full bg-blue-50 text-[#4285F4] text-[11px] font-medium border border-blue-100 flex items-center gap-1">
                                        {tag}
                                        {!isTrashMode && (
                                            <button onClick={() => handleRemoveTag(tag)} className="hover:text-red-500 opacity-60 hover:opacity-100 transition-colors ml-0.5">
                                                <X size={10} />
                                            </button>
                                        )}
                                    </span>
                                ))}
                            </div>
                            {!isTrashMode && (
                                <div className="relative group/tag">
                                    <input 
                                        type="text" value={tagInput}
                                        onChange={e => setTagInput(e.target.value)}
                                        onKeyDown={handleAddTag}
                                        placeholder="Adicionar nova tag..."
                                        className="w-full px-2.5 py-2 text-[11px] bg-transparent hover:bg-[#f5f5f7] border hover:border-black/10 border-transparent focus:border-[#4285F4]/40 focus:bg-white rounded outline-none transition-all"
                                    />
                                    <Plus size={11} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#86868b] opacity-0 group-focus-within/tag:opacity-50 pointer-events-none" />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="px-5 py-4 border-t border-black/6 flex gap-2.5 shrink-0">
                        {isTrashMode ? (
                            <>
                                <button onClick={onRestore}
                                    className="flex-1 py-2.5 bg-[#e8f2fc] text-[#4285F4] rounded-apple font-semibold text-[11px] hover:bg-[#d4eafb] transition-colors flex items-center justify-center gap-1.5">
                                    <RotateCcw size={13} /> Restaurar
                                </button>
                                <button onClick={handleDeleteClick}
                                    className={`flex-1 py-2.5 rounded-apple font-semibold text-[11px] transition-all flex items-center justify-center gap-1.5 ${deleteConfirm ? 'bg-red-50 text-red-600 border border-red-300' : 'bg-transparent text-red-500 border border-red-500/30 hover:bg-red-50'}`}>
                                    {deleteConfirm ? <AlertTriangle size={13} /> : <Trash2 size={13} />}
                                    {deleteConfirm ? 'Confirmar?' : 'Excluir'}
                                </button>
                            </>
                        ) : (isEditingMetadata || isEditingContent || isEditingTitle) ? (
                            <button onClick={handleSaveAll}
                                className="w-full py-2.5 btn-ai rounded-apple font-semibold text-[11px] shadow-apple transition-all flex items-center justify-center gap-1.5">
                                <Save size={13} /> Salvar Alterações
                            </button>
                        ) : (
                            <button onClick={handleDeleteClick}
                                className={`w-full py-2.5 rounded-apple font-semibold text-[11px] transition-all flex items-center justify-center gap-1.5 ${deleteConfirm ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-[#f5f5f7] text-[#86868b] border border-black/6 hover:border-red-200 hover:text-red-500'}`}>
                                {deleteConfirm ? <><AlertTriangle size={13} /> Clique para confirmar</> : <><Trash2 size={13} /> Remover do Vault</>}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AssetModal;
