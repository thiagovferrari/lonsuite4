import React, { useEffect, useState } from 'react';
import { Asset } from '../types';
import { Briefcase, Calendar, Database, File, FileText, Fingerprint, Image, Layers, LockKeyhole, Shield, ShieldAlert, ShieldCheck } from 'lucide-react';
import { getFileTypeInfo } from '../utils/fileTypeUtils';
import { getAttachmentData } from '../services/storageService';

interface AssetCardProps {
  asset: Asset;
  tileSize: 'small' | 'medium' | 'large';
  onClick: (asset: Asset) => void;
  ownerName?: string;
}

const HEIGHT_BY_SIZE = {
  small: 'h-[136px]',
  medium: 'h-[158px]',
  large: 'h-[182px]',
} as const;

const PREVIEW_BY_SIZE = {
  small: 'h-[82px] w-[62px]',
  medium: 'h-[98px] w-[74px]',
  large: 'h-[114px] w-[86px]',
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
  const displayTags = (asset.tags || []).filter((t): t is string => typeof t === 'string').slice(0, tileSize === 'large' ? 3 : 2);
  const groupCount = asset.attachments?.length ?? 0;
  const secureId = asset.id ? asset.id.replace(/-/g, '').slice(0, 10).toUpperCase() : 'LOCAL0000';

  const evidenceConfig = {
    'Alto': { text: 'text-emerald-700', bg: 'bg-emerald-50', ring: 'ring-emerald-200/70', icon: ShieldCheck, label: 'Verificado' },
    'Moderado': { text: 'text-amber-700', bg: 'bg-amber-50', ring: 'ring-amber-200/70', icon: ShieldAlert, label: 'Revisão' },
    'Baixo': { text: 'text-[#6e6e73]', bg: 'bg-[#f4f4f5]', ring: 'ring-black/[0.045]', icon: Shield, label: 'Seguro' },
  };
  const evidence = evidenceConfig[asset.evidenceLevel || 'Baixo'] || evidenceConfig['Baixo'];
  const EvidenceIcon = evidence.icon;

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
    } catch {
      return '';
    }
  };

  const TypeIcon = asset.type === 'image' ? Image : asset.type === 'pdf' ? FileText : asset.type === 'case' ? Briefcase : File;

  return (
    <button
      onClick={() => onClick(asset)}
      className={`asset-vault-card group relative flex w-full ${HEIGHT_BY_SIZE[tileSize]} overflow-hidden rounded-[22px] border border-black/[0.065] bg-white/82 p-3 text-left shadow-[0_14px_42px_rgba(29,29,31,0.055)] outline-none backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-black/[0.12] hover:bg-white hover:shadow-[0_24px_70px_rgba(29,29,31,0.10)] focus-visible:ring-4 focus-visible:ring-black/[0.07]`}
      aria-label={asset.title}
    >
      <div className="pointer-events-none absolute inset-0 opacity-70 transition-opacity duration-300 group-hover:opacity-100">
        <div className="absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent" />
        <div className="asset-vault-scan absolute inset-x-0 top-0 h-12 opacity-0 group-hover:opacity-100" />
      </div>

      <div className="relative mr-3 flex shrink-0 items-center">
        <div className={`${PREVIEW_BY_SIZE[tileSize]} asset-vault-media relative overflow-hidden rounded-[16px] border border-black/[0.055] bg-[#f5f6f7] shadow-[inset_0_1px_0_rgba(255,255,255,0.82),0_12px_32px_rgba(29,29,31,0.08)]`}>
          {displayThumb ? (
            <>
              <img
                src={displayThumb}
                alt=""
                loading="lazy"
                decoding="async"
                onError={() => setThumbFailed(true)}
                className="h-full w-full object-cover opacity-80 grayscale-[18%] saturate-[0.74] transition-all duration-500 group-hover:opacity-95 group-hover:grayscale-0 group-hover:saturate-100"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.12),rgba(29,29,31,0.10))]" />
            </>
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.96),rgba(241,242,244,0.80)_52%,rgba(224,226,230,0.86))] text-[#6e6e73]">
              <TypeIcon size={tileSize === 'large' ? 28 : 23} strokeWidth={1.25} />
              <span className="rounded-full bg-white/78 px-2 py-0.5 text-[8px] font-bold uppercase tracking-[0.16em] text-[#86868b] shadow-sm">
                {isPdf ? 'PDF' : fileInfo.label}
              </span>
            </div>
          )}

          <div className="pointer-events-none absolute inset-0 asset-anatomy-grid opacity-50" />
          {isPdf && <div className="absolute inset-x-0 top-0 h-1 bg-[#d92d20]/84" />}
          <div className="absolute bottom-1.5 right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-white/88 text-[#1d1d1f] shadow-sm backdrop-blur">
            <LockKeyhole size={10} strokeWidth={1.7} />
          </div>
        </div>
      </div>

      <div className="relative flex min-w-0 flex-1 flex-col py-0.5">
        <div className="mb-2 flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="mb-1 flex items-center gap-1.5 text-[8px] font-bold uppercase tracking-[0.18em] text-[#9a9aa0]">
              <Database size={10} strokeWidth={1.45} />
              Cofre #{secureId}
            </p>
            <h3 className="line-clamp-2 text-[12px] font-semibold leading-snug tracking-[-0.01em] text-[#1d1d1f] sm:text-[13px]">
              {asset.title || 'Ativo sem título'}
            </h3>
          </div>
          <span className={`flex shrink-0 items-center gap-1 rounded-full px-2 py-1 text-[9px] font-bold ${evidence.bg} ${evidence.text} ring-1 ${evidence.ring}`}>
            <EvidenceIcon size={10} strokeWidth={1.6} />
            <span className="hidden sm:inline">{evidence.label}</span>
          </span>
        </div>

        {tileSize !== 'small' && asset.summary && (
          <p className="line-clamp-2 max-w-[95%] text-[11px] font-medium leading-relaxed text-[#7c7c80]">
            {asset.summary}
          </p>
        )}

        <div className="mt-auto flex min-w-0 items-end justify-between gap-3">
          <div className="min-w-0">
            <div className="mb-2 flex flex-wrap gap-1.5">
              {(displayTags.length > 0 ? displayTags : [fileInfo.label]).map((tag, idx) => (
                <span key={`${tag}-${idx}`} className="max-w-[110px] truncate rounded-full bg-[#f2f3f5] px-2 py-1 text-[9px] font-semibold text-[#6e6e73] ring-1 ring-black/[0.035]">
                  {tag}
                </span>
              ))}
              {groupCount > 0 && (
                <span className="flex items-center gap-1 rounded-full bg-[#1d1d1f] px-2 py-1 text-[9px] font-semibold text-white">
                  <Layers size={10} /> {groupCount}
                </span>
              )}
            </div>
            <p className="flex items-center gap-1.5 text-[10px] font-medium text-[#9a9aa0]">
              <Calendar size={10} />
              {formatDate(asset.createdAt || asset.date)}
              {ownerName && <span className="hidden sm:inline">· {ownerName.split(' ')[0]}</span>}
            </p>
          </div>

          <div className="flex shrink-0 flex-col items-center gap-1 text-[#9a9aa0]">
            <Fingerprint size={tileSize === 'large' ? 20 : 17} strokeWidth={1.25} />
            <span className="text-[8px] font-bold uppercase tracking-[0.18em]">AES</span>
          </div>
        </div>
      </div>
    </button>
  );
};

export default React.memo(AssetCard);
