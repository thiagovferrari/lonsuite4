import React, { useState, useEffect } from 'react';
import { Asset } from '../types';
import { Briefcase, FileText, Image, File, ShieldCheck, ShieldAlert, Shield } from 'lucide-react';
import { getFileTypeInfo } from '../utils/fileTypeUtils';
import { getAttachmentData } from '../services/storageService';

interface AssetCardProps {
  asset: Asset;
  onClick: (asset: Asset) => void;
  ownerName?: string;
}

const AssetCard: React.FC<AssetCardProps> = ({ asset, onClick, ownerName }) => {
  const [groupThumb, setGroupThumb] = useState<string | null>(null);

  const fileInfo =
    asset.attachments && asset.attachments.length > 0
      ? getFileTypeInfo(asset.attachments[0].name, asset.attachments[0].type)
      : getFileTypeInfo(asset.title || 'file.pdf', asset.type);

  // Load first attachment thumbnail for grouped assets without a main thumbnail
  useEffect(() => {
    if (!asset.thumbnail && asset.attachments && asset.attachments.length > 0) {
      const firstAtt = asset.attachments[0];
      if (firstAtt.type?.startsWith('image/')) {
        getAttachmentData(firstAtt.id).then(data => {
          if (data) setGroupThumb(data);
        });
      }
    }
  }, [asset.thumbnail, asset.attachments]);

  const isPdf = asset.type === 'pdf' || (typeof asset.title === 'string' && asset.title.toLowerCase().endsWith('.pdf')) || (asset.attachments && asset.attachments[0]?.type?.includes('pdf'));
  const displayThumb = isPdf ? null : (asset.thumbnail || groupThumb);

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
      <div className="relative bg-white rounded-apple-lg overflow-hidden border border-black/[0.04] hover:border-black/[0.08] hover:shadow-apple-md transition-all duration-300 hover:-translate-y-0.5 card-press flex flex-col">

        {/* Thumbnail — aspect ratio 4:5 */}
        <div className="aspect-[4/5] w-full relative overflow-hidden bg-[#f2f3f5]">
          {displayThumb ? (
            <img
              src={displayThumb}
              alt={asset.title}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            />
          ) : (
            <div className={`w-full h-full bg-gradient-to-br ${fileInfo.gradient} flex flex-col items-center justify-center gap-1`}>
              <div className="text-xl sm:text-3xl filter drop-shadow">{fileInfo.icon}</div>
              <div className="text-[7px] sm:text-[9px] font-semibold text-white/80 uppercase tracking-widest">{fileInfo.label}</div>
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
              <Briefcase size={7} className="sm:w-[8px] sm:h-[8px]" />
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
        <div className="px-1.5 sm:px-2.5 py-1.5 sm:py-2.5 flex flex-col gap-0.5 sm:gap-1">
          <h3 className="text-[9px] sm:text-[10.5px] font-medium text-[#1d1d1f] leading-tight sm:leading-snug group-hover:text-[#4285F4] transition-colors break-words" style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', overflowWrap: 'anywhere', wordBreak: 'break-word' }}>
            {asset.title || '—'}
          </h3>
          <div className="flex items-center justify-between gap-0.5 sm:gap-1">
            {displayTags.map((tag, idx) => (
              <span
                key={`${tag}-${idx}`}
                className="inline-block self-start px-1 sm:px-1.5 py-0.5 rounded-md bg-[#f2f3f5] text-[#86868b] text-[7px] sm:text-[9px] font-medium truncate max-w-[70%]"
              >
                {tag}
              </span>
            ))}
            {displayTags.length === 0 && (
              <span
                className="inline-block self-start px-1 sm:px-1.5 py-0.5 rounded-md text-[7px] sm:text-[9px] font-medium"
                style={{ backgroundColor: `${fileInfo.color}14`, color: fileInfo.color }}
              >
                {fileInfo.label}
              </span>
            )}
            {ownerName && (
              <span className="text-[6px] sm:text-[8px] text-[#aeaeb2] font-medium shrink-0 truncate max-w-[45px] sm:max-w-[60px]">
                {ownerName}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetCard;
