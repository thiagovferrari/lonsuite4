import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Asset } from '../types';
import AssetCard from './AssetCard';

interface VirtualizedAssetGridProps {
  assets: Asset[];
  tileSize: 'small' | 'medium' | 'large';
  onOpenAsset: (asset: Asset) => void;
  ownerName?: string;
}

const GRID_CONFIG = {
  small: { height: 56 },
  medium: { height: 68 },
  large: { height: 82 },
} as const;

const OVERSCAN_ROWS = 3;

const VirtualizedAssetGrid: React.FC<VirtualizedAssetGridProps> = ({ assets, tileSize, onOpenAsset, ownerName }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [viewport, setViewport] = useState({ top: 0, height: 900 });

  useEffect(() => {
    let frame = 0;
    const updateViewport = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const element = containerRef.current;
        if (!element) return;
        const rect = element.getBoundingClientRect();
        setViewport({
          top: Math.max(0, -rect.top),
          height: window.innerHeight,
        });
      });
    };

    updateViewport();
    window.addEventListener('scroll', updateViewport, { passive: true });
    window.addEventListener('resize', updateViewport);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', updateViewport);
      window.removeEventListener('resize', updateViewport);
    };
  }, []);

  const layout = useMemo(() => {
    const config = GRID_CONFIG[tileSize];
    const rowHeight = config.height;
    const totalRows = assets.length;
    const startRow = Math.max(0, Math.floor(viewport.top / rowHeight) - OVERSCAN_ROWS);
    const endRow = Math.min(totalRows, Math.ceil((viewport.top + viewport.height) / rowHeight) + OVERSCAN_ROWS);
    const startIndex = startRow;
    const endIndex = Math.min(assets.length, endRow);

    return {
      rowHeight,
      startRow,
      endRow,
      startIndex,
      endIndex,
      totalHeight: totalRows * rowHeight,
    };
  }, [assets.length, tileSize, viewport.height, viewport.top]);

  const visibleAssets = assets.slice(layout.startIndex, layout.endIndex);

  return (
    <div ref={containerRef} className="asset-timeline-stack relative mx-auto w-full max-w-[1280px]" style={{ minHeight: assets.length ? layout.totalHeight : 0 }}>
      <div
        className="absolute inset-x-0 top-0"
        style={{
          transform: `translateY(${layout.startRow * layout.rowHeight}px)`,
        }}
      >
        {visibleAssets.map(asset => (
          <AssetCard key={asset.id} asset={asset} tileSize={tileSize} onClick={onOpenAsset} ownerName={ownerName} />
        ))}
      </div>
    </div>
  );
};

export default React.memo(VirtualizedAssetGrid);
