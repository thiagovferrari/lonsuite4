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
  small: { minWidth: 112, gap: 10 },
  medium: { minWidth: 148, gap: 16 },
  large: { minWidth: 210, gap: 20 },
} as const;

const OVERSCAN_ROWS = 3;
const CARD_INFO_HEIGHT = 82;

const VirtualizedAssetGrid: React.FC<VirtualizedAssetGridProps> = ({ assets, tileSize, onOpenAsset, ownerName }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [viewport, setViewport] = useState({ top: 0, height: 900 });

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const updateWidth = () => setContainerWidth(element.clientWidth);
    updateWidth();

    const resizeObserver = new ResizeObserver(updateWidth);
    resizeObserver.observe(element);
    return () => resizeObserver.disconnect();
  }, []);

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
    const width = Math.max(containerWidth, config.minWidth);
    const columns = Math.max(1, Math.floor((width + config.gap) / (config.minWidth + config.gap)));
    const itemWidth = (width - config.gap * (columns - 1)) / columns;
    const rowHeight = Math.ceil(itemWidth * 1.25 + CARD_INFO_HEIGHT + config.gap);
    const totalRows = Math.ceil(assets.length / columns);
    const startRow = Math.max(0, Math.floor(viewport.top / rowHeight) - OVERSCAN_ROWS);
    const endRow = Math.min(totalRows, Math.ceil((viewport.top + viewport.height) / rowHeight) + OVERSCAN_ROWS);
    const startIndex = startRow * columns;
    const endIndex = Math.min(assets.length, endRow * columns);

    return {
      columns,
      gap: config.gap,
      rowHeight,
      startRow,
      endRow,
      startIndex,
      endIndex,
      totalHeight: totalRows * rowHeight,
    };
  }, [assets.length, containerWidth, tileSize, viewport.height, viewport.top]);

  const visibleAssets = assets.slice(layout.startIndex, layout.endIndex);

  return (
    <div ref={containerRef} className="relative w-full" style={{ minHeight: assets.length ? layout.totalHeight : 0 }}>
      <div
        className="grid absolute inset-x-0 top-0"
        style={{
          transform: `translateY(${layout.startRow * layout.rowHeight}px)`,
          gridTemplateColumns: `repeat(${layout.columns}, minmax(0, 1fr))`,
          gap: `${layout.gap}px`,
        }}
      >
        {visibleAssets.map(asset => (
          <AssetCard key={asset.id} asset={asset} onClick={onOpenAsset} ownerName={ownerName} />
        ))}
      </div>
    </div>
  );
};

export default React.memo(VirtualizedAssetGrid);
