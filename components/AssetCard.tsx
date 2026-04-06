import React, { useState, useEffect } from 'react';
import { Asset } from '../types';
import { Briefcase, FileText, Image, File, ShieldCheck, ShieldAlert, Shield } from 'lucide-react';
import { getFileTypeInfo } from '../utils/fileTypeUtils';
import { getAttachmentData } from '../services/storageService';

interface AssetCardProps {
  asset: Asset;
  onClick: (asset: Asset) => void;
}

const AssetCard: React.FC<AssetCardProps> = ({ asset, onClick }) => {
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
      <div className="relative bg-white rounded-apple-lg overflow-hidden border border-black/[0.06] hover:border-black/[0.12] hover:shadow-apple-md transition-all duration-300 hover:-translate-y-0.5 card-press flex flex-col">

        {/* Thumbnail — aspect ratio 4:5 */}
        <div className="aspect-[4/5] w-full relative overflow-hidden bg-[#f5f5f7]">
          {displayThumb ? (
            <img
              src={displayThumb}
              alt={asset.title}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            />
          ) : (
            <div className={`w-full h-full bg-gradient-to-br ${fileInfo.gradient} flex flex-col items-center justify-center gap-1.5`}>
              <div className="text-3xl filter drop-shadow">{fileInfo.icon}</div>
              <div className="text-[9px] font-semibold text-white/80 uppercase tracking-widest">{fileInfo.label}</div>
            </div>
          )}

          {/* Evidence Level Badge */}
          <div className={`absolute top-2 right-2 flex items-center gap-1 ${evidence.bg} backdrop-blur-sm px-1.5 py-0.5 rounded-md shadow-sm border border-black/5`}>
            <div className={`w-1.5 h-1.5 rounded-full ${evidence.color}`} />
            <span className={`text-[8px] font-bold uppercase tracking-wider ${evidence.text}`}>{evidence.label}</span>
          </div>

          {/* Group badge */}
          {groupCount > 0 && (
            <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/60 backdrop-blur-sm text-white px-1.5 py-0.5 rounded-md text-[9px] font-semibold shadow-sm">
              <Briefcase size={8} />
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
        </div>

        {/* Info */}
        <div className="px-2.5 py-2.5 flex flex-col gap-1">
          <h3 className="text-[10.5px] font-medium text-[#1d1d1f] line-clamp-2 leading-snug group-hover:text-[#4285F4] transition-colors">
            {asset.title || '—'}
          </h3>
          <div className="flex items-center justify-between gap-1">
            {displayTags.map((tag, idx) => (
              <span
                key={`${tag}-${idx}`}
                className="inline-block self-start px-1.5 py-0.5 rounded-md bg-[#f5f5f7] text-[#86868b] text-[9px] font-medium truncate max-w-[70%]"
              >
                {tag}
              </span>
            ))}
            {displayTags.length === 0 && (
              <span
                className="inline-block self-start px-1.5 py-0.5 rounded-md text-[9px] font-medium"
                style={{ backgroundColor: `${fileInfo.color}14`, color: fileInfo.color }}
              >
                {fileInfo.label}
              </span>
            )}
            <span className="text-[8px] text-[#aeaeb2] font-medium shrink-0">
              {formatDate(asset.updatedAt || asset.createdAt || asset.date)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetCard;