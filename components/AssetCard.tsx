import React, { useState, useEffect } from 'react';
import { Asset } from '../types';
import { Briefcase, Calendar, File, FileText, Image, ImageOff, Layers, Shield, ShieldAlert, ShieldCheck } from 'lucide-react';
import { getFileTypeInfo } from '../utils/fileTypeUtils';
import { getAttachmentData } from '../services/storageService';

interface AssetCardProps {
  asset: Asset;
  onClick: (asset: Asset) => void;
  ownerName?: string;
}

const AssetCard: React.FC<AssetCardProps> = ({ asset, onClick, ownerName }) => {
  const [groupThumb, setGroupThumb] = useState<string | null>(null);
  const [thumbFailed, setThumbFailed] = useState(false);

  const fileInfo =
    asset.attachments && asset.attachments.length > 0
      ? getFileTypeInfo(asset.attachments[0].name, asset.attachments[0].type)
      : getFileTypeInfo(asset.title || 'file.pdf', asset.type);

  // Load first attachment thumbnail for grouped assets without a main thumbnail
  useEffect(() => {
    setThumbFailed(false);
    if (!asset.thumbnail && asset.attachments && asset.attachments.length > 0) {
      const firstAtt = asset.attachments[0];
      if (firstAtt.type?.startsWith('image/')) {
        getAttachmentData(firstAtt.id).then(data => {
          if (data) setGroupThumb(data);
        });
      }
    }
  }, [asset.id, asset.thumbnail, asset.attachments]);

  const isPdf = asset.type === 'pdf' || (typeof asset.title === 'string' && asset.title.toLowerCase().endsWith('.pdf')) || (asset.attachments && asset.attachments[0]?.type?.includes('pdf'));
  const rawThumb = asset.thumbnail || asset.content || groupThumb;
  const isImageThumb = typeof rawThumb === 'string' && (rawThumb.startsWith('data:image') || rawThumb.startsWith('http') || rawThumb.startsWith('blob:'));
  const displayThumb = !isPdf && isImageThumb && !thumbFailed ? rawThumb : null;

  const getTypeIcon = () => {
    switch (asset.type) {
      case 'image': return Image;
      case 'pdf': return FileText;
      case 'case': return Briefcase;
      default: return File;
    }
  };

  const TypeIcon = getTypeIcon();
  const displayTags = (asset.tags || []).filter((t): t is string => typeof t === 'string').slice(0, 1);
  const groupCount = asset.attachments?.length ?? 0;

  const evidenceConfig = {
    'Alto': { color: 'bg-emerald-500', text: 'text-emerald-600', bg: 'bg-emerald-50', icon: ShieldCheck, label: 'Alto' },
    'Moderado': { color: 'bg-amber-500', text: 'text-amber-600', bg: 'bg-amber-50', icon: ShieldAlert, label: 'Mod.' },
    'Baixo': { color: 'bg-slate-400', text: 'text-slate-500', bg: 'bg-slate-50', icon: Shield, label: 'Baixo' },
  };
  const evidence = evidenceConfig[asset.evidenceLevel || 'Baixo'] || evidenceConfig['Baixo'];
  const EvidenceIcon = evidence.icon;

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
    } catch { return ''; }
  };

  return (
    <div
      onClick={() => onClick(asset)}
      className="group relative cursor-pointer animate-fade-in"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick(asset)}
      aria-label={asset.title}
    >
      <div className="relative bg-white rounded-[18px] overflow-hidden border border-black/[0.055] hover:border-black/[0.10] hover:shadow-[0_18px_54px_rgba(0,0,0,0.10)] transition-all duration-300 hover:-translate-y-0.5 card-press flex flex-col">

        {/* Thumbnail — aspect ratio 4:5 */}
        <div className="aspect-[4/5] w-full relative overflow-hidden bg-[#f2f3f5]">
          {displayThumb ? (
            <img
              src={displayThumb}
              alt={asset.title}
              loading="lazy"
              decoding="async"
              onError={() => setThumbFailed(true)}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            />
          ) : isPdf ? (
            <div className="relative h-full w-full overflow-hidden bg-[#f4f2ef]">
              <div className="absolute inset-x-0 top-0 h-1 bg-[#d92d20]" />
              <div className="absolute inset-0 bg-[linear-gradient(145deg,rgba(255,255,255,0.96),rgba(244,242,239,0.70))]" />
              <div className="absolute left-[16%] right-[16%] top-[12%] bottom-[10%] rounded-[10px] border border-black/[0.08] bg-white shadow-[0_18px_44px_rgba(0,0,0,0.10)]">
                <div className="h-full px-[12%] py-[16%]">
                  <div className="mb-[14%] h-[7%] w-[42%] rounded-full bg-[#d92d20]/80" />
                  <div className="space-y-[7%]">
                    <div className="h-1.5 rounded-full bg-black/[0.16]" />
                    <div className="h-1.5 rounded-full bg-black/[0.10]" />
                    <div className="h-1.5 w-[78%] rounded-full bg-black/[0.10]" />
                  </div>
                  <div className="mt-[22%] grid grid-cols-2 gap-[8%]">
                    <div className="aspect-square rounded-[7px] bg-[#f1f1f1]" />
                    <div className="space-y-[16%] pt-[8%]">
                      <div className="h-1 rounded-full bg-black/[0.10]" />
                      <div className="h-1 rounded-full bg-black/[0.08]" />
                      <div className="h-1 w-[70%] rounded-full bg-black/[0.08]" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between rounded-full bg-white/88 px-2.5 py-1.5 shadow-sm backdrop-blur">
                <span className="text-[8px] font-bold uppercase tracking-[0.16em] text-[#d92d20]">PDF</span>
                <FileText size={12} className="text-[#d92d20]" />
              </div>
            </div>
          ) : (
            <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-[#f3f4f6] px-3 text-center">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.95),rgba(243,244,246,0.72)_48%,rgba(224,226,230,0.88))]" />
              <div className="relative flex h-12 w-12 items-center justify-center rounded-[16px] bg-white text-[#86868b] shadow-[0_14px_38px_rgba(0,0,0,0.08)]">
                {asset.type === 'image' ? <ImageOff size={22} strokeWidth={1.4} /> : <TypeIcon size={22} strokeWidth={1.4} />}
              </div>
              <p className="relative mt-3 text-[9px] font-bold uppercase tracking-[0.16em] text-[#86868b]">{asset.type === 'image' ? 'Imagem' : fileInfo.label}</p>
              {asset.type === 'image' && (
                <p className="relative mt-1 max-w-[92px] text-[8px] font-medium leading-tight text-[#aeaeb2]">Miniatura indisponível</p>
              )}
            </div>
          )}

          {/* Owner name badge */}
          {ownerName && (
            <div className="absolute top-1 right-1 sm:top-2 sm:right-2 flex items-center gap-0.5 sm:gap-1 bg-white/80 backdrop-blur-sm px-1 sm:px-1.5 py-0.5 rounded-md shadow-sm border border-black/5">
              <div className="w-2.5 sm:w-3 h-2.5 sm:h-3 rounded-full bg-[#1d1d1f] flex items-center justify-center text-white text-[5px] sm:text-[6px] font-bold">{ownerName.charAt(0).toUpperCase()}</div>
              <span className="text-[6px] sm:text-[8px] font-semibold text-[#424245] truncate max-w-[40px] sm:max-w-[60px] hidden sm:inline">{ownerName.split(' ')[0]}</span>
            </div>
          )}

          {/* Group badge */}
          {groupCount > 0 && (
            <div className="absolute top-1 left-1 sm:top-2 sm:left-2 flex items-center gap-0.5 sm:gap-1 bg-black/60 backdrop-blur-sm text-white px-1 sm:px-1.5 py-0.5 rounded-md text-[7px] sm:text-[9px] font-semibold shadow-sm">
              <Layers size={7} className="sm:w-[8px] sm:h-[8px]" />
              <span>{groupCount}</span>
            </div>
          )}

          {/* Hover overlay with summary */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all duration-300 flex items-end opacity-0 group-hover:opacity-100">
            {asset.summary && (
              <div className="p-3 w-full">
                <p className="text-white text-[9px] font-medium leading-snug line-clamp-3 backdrop-blur-sm">
                  {asset.summary}
                </p>
              </div>
            )}
          </div>

          <div className="absolute bottom-1.5 left-1.5 right-1.5 flex justify-center sm:hidden">
            <span className="rounded-full bg-black/65 px-2.5 py-1 text-[8px] font-bold uppercase tracking-[0.12em] text-white shadow-sm backdrop-blur">
              Toque para abrir
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="px-2.5 py-2.5 sm:px-3 sm:py-3 flex min-h-[82px] flex-col gap-1.5">
          <h3 className="text-[10px] sm:text-[11.5px] font-semibold text-[#1d1d1f] leading-tight sm:leading-snug group-hover:text-[#4285F4] transition-colors break-words" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', overflowWrap: 'anywhere', wordBreak: 'break-word' }}>
            {asset.title || '—'}
          </h3>
          <div className="mt-auto flex items-center justify-between gap-1">
            {displayTags.map((tag, idx) => (
              <span
                key={`${tag}-${idx}`}
                className="inline-block self-start px-1.5 py-0.5 rounded-md bg-[#f2f3f5] text-[#86868b] text-[8px] sm:text-[9px] font-semibold truncate max-w-[70%]"
              >
                {tag}
              </span>
            ))}
            {displayTags.length === 0 && (
              <span
                className="inline-block self-start px-1.5 py-0.5 rounded-md text-[8px] sm:text-[9px] font-semibold"
                style={{ backgroundColor: `${fileInfo.color}14`, color: fileInfo.color }}
              >
                {fileInfo.label}
              </span>
            )}
            <span className={`ml-auto hidden items-center gap-1 rounded-full px-1.5 py-0.5 text-[8px] font-bold sm:flex ${evidence.bg} ${evidence.text}`}>
              <EvidenceIcon size={9} />
              {evidence.label}
            </span>
            <span className="flex items-center gap-1 text-[7px] sm:text-[8px] text-[#aeaeb2] font-medium shrink-0 truncate max-w-[54px] sm:max-w-[66px]">
              <Calendar size={9} />
              {formatDate(asset.createdAt || asset.date)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(AssetCard);
