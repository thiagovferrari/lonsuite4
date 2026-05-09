import React, { useEffect, useState } from 'react';
import { Asset } from '../types';
import { Briefcase, File, FileText, Image, Layers, LockKeyhole, Shield, ShieldAlert, ShieldCheck } from 'lucide-react';
import { getFileTypeInfo } from '../utils/fileTypeUtils';
import { getAttachmentData } from '../services/storageService';

interface AssetCardProps {
  asset: Asset;
  tileSize: 'small' | 'medium' | 'large';
  onClick: (asset: Asset) => void;
  ownerName?: string;
}

const ROW_BY_SIZE = {
  small: 'h-[56px]',
  medium: 'h-[68px]',
  large: 'h-[82px]',
} as const;

const THUMB_BY_SIZE = {
  small: 'h-[22px] w-[22px]',
  medium: 'h-6 w-6',
  large: 'h-7 w-7',
} as const;

const SUMMARY_BY_SIZE = {
  small: 'hidden',
  medium: 'line-clamp-1',
  large: 'line-clamp-2',
} as const;

const AssetCard: React.FC<AssetCardProps> = ({ asset, tileSize, onClick, ownerName }) => {
  const [groupThumb, setGroupThumb] = useState<string | null>(null);
  const [thumbFailed, setThumbFailed] = useState(false);

  const fileInfo =
    asset.attachments && asset.attachments.length > 0
      ? getFileTypeInfo(asset.attachments[0].name, asset.attachments[0].type)
      : getFileTypeInfo(asset.title || 'file.pdf', asset.type);

  useEffect(() => {
    setThumbFailed(false);
    setGroupThumb(null);
    if (!asset.thumbnail && asset.attachments && asset.attachments.length > 0) {
      const firstAtt = asset.attachments[0];
      if (firstAtt.type?.startsWith('image/')) {
        getAttachmentData(firstAtt.id).then(data => {
          if (data) setGroupThumb(data);
        });
      }
    }
  }, [asset.id, asset.thumbnail, asset.attachments]);

  const isPdf = asset.type === 'pdf'
    || (typeof asset.title === 'string' && asset.title.toLowerCase().endsWith('.pdf'))
    || Boolean(asset.attachments?.[0]?.type?.includes('pdf'));
  const rawThumb = asset.thumbnail || asset.content || groupThumb;
  const isImageThumb = typeof rawThumb === 'string' && (rawThumb.startsWith('data:image') || rawThumb.startsWith('http') || rawThumb.startsWith('blob:'));
  const displayThumb = !isPdf && isImageThumb && !thumbFailed ? rawThumb : null;
  const displayTags = (asset.tags || []).filter((t): t is string => typeof t === 'string').slice(0, 2);
  const groupCount = asset.attachments?.length ?? 0;
  const secureId = asset.id ? asset.id.replace(/-/g, '').slice(0, 8).toUpperCase() : 'LOCAL';

  const evidenceConfig = {
    'Alto': { text: 'text-emerald-700', bg: 'bg-emerald-50', icon: ShieldCheck, label: 'verificado' },
    'Moderado': { text: 'text-amber-700', bg: 'bg-amber-50', icon: ShieldAlert, label: 'revisão' },
    'Baixo': { text: 'text-[#8e8e93]', bg: 'bg-[#f5f5f7]', icon: Shield, label: 'seguro' },
  };
  const evidence = evidenceConfig[asset.evidenceLevel || 'Baixo'] || evidenceConfig['Baixo'];
  const EvidenceIcon = evidence.icon;
  const TypeIcon = asset.type === 'image' ? Image : asset.type === 'pdf' ? FileText : asset.type === 'case' ? Briefcase : File;

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
    } catch {
      return '';
    }
  };

  return (
    <button
      onClick={() => onClick(asset)}
      className={`asset-timeline-card group relative grid w-full ${ROW_BY_SIZE[tileSize]} grid-cols-[50px_22px_28px_minmax(0,1fr)_auto] items-center gap-2 pr-2 text-left outline-none transition-colors hover:bg-white/50 focus-visible:bg-white/70 sm:grid-cols-[68px_28px_34px_minmax(0,1fr)_auto] sm:gap-3`}
      aria-label={asset.title}
    >
      <span className="justify-self-end text-[10px] font-medium tabular-nums text-[#a1a1a6]">
        {formatDate(asset.createdAt || asset.date)}
      </span>

      <span className="asset-timeline-axis relative flex h-full items-center justify-center">
        <span className="asset-timeline-dot h-1.5 w-1.5 rounded-full bg-[#6e6e73] transition-transform duration-200 group-hover:scale-125" />
      </span>

      <span className="relative flex items-center justify-center">
        {displayThumb ? (
          <img
            src={displayThumb}
            alt=""
            loading="lazy"
            decoding="async"
            onError={() => setThumbFailed(true)}
            className={`${THUMB_BY_SIZE[tileSize]} shrink-0 rounded-[4px] object-cover shadow-[0_7px_18px_rgba(29,29,31,0.10)] transition-all duration-300 group-hover:scale-110 group-hover:saturate-110`}
          />
        ) : (
          <span className={`${THUMB_BY_SIZE[tileSize]} flex shrink-0 items-center justify-center text-[#8e8e93] ${isPdf ? 'text-[#d92d20]' : ''}`}>
            <TypeIcon size={tileSize === 'large' ? 16 : 14} strokeWidth={1.25} />
          </span>
        )}
      </span>

      <span className="min-w-0">
        <span className="flex min-w-0 items-center gap-2">
          <span className="truncate text-[12px] font-semibold tracking-[-0.01em] text-[#1d1d1f] sm:text-[13px]">
            {asset.title || 'Ativo sem título'}
          </span>
          <span className={`hidden shrink-0 rounded-full px-2 py-0.5 text-[8px] font-bold uppercase tracking-[0.14em] sm:inline-flex ${evidence.bg} ${evidence.text}`}>
            <EvidenceIcon size={9} strokeWidth={1.55} className="mr-1" />
            {evidence.label}
          </span>
        </span>
        <span className={`${SUMMARY_BY_SIZE[tileSize]} mt-0.5 max-w-[760px] text-[11px] font-medium leading-snug text-[#8e8e93]`}>
          {asset.summary || asset.scientificContext || asset.description || fileInfo.label}
        </span>
      </span>

      <span className="hidden min-w-[150px] items-center justify-end gap-1.5 sm:flex">
        <span className="px-1.5 py-1 text-[9px] font-semibold text-[#a1a1a6]">
          #{secureId}
        </span>
        {displayTags.map((tag, idx) => (
          <span key={`${tag}-${idx}`} className="max-w-[76px] truncate rounded-full bg-[#f5f5f7] px-2 py-1 text-[9px] font-semibold text-[#6e6e73]">
            {tag}
          </span>
        ))}
        {groupCount > 0 && (
          <span className="flex items-center gap-1 rounded-full bg-[#1d1d1f] px-2 py-1 text-[9px] font-semibold text-white">
            <Layers size={10} /> {groupCount}
          </span>
        )}
        {ownerName && (
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#1d1d1f] text-[9px] font-bold text-white" title={ownerName}>
            {ownerName.charAt(0).toUpperCase()}
          </span>
        )}
        <LockKeyhole size={12} className="text-[#b8b8bd]" />
      </span>
    </button>
  );
};

export default React.memo(AssetCard);
