import React, { useState, useRef, useEffect } from 'react';

interface ResizableCardProps {
  id: string;
  defaultWidth?: number;
  defaultHeight?: number;
  width?: number;
  height?: number;
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
  onResize?: (w: number, h: number) => void;
  className?: string;
  children: React.ReactNode;
}

export const ResizableCard: React.FC<ResizableCardProps> = ({
  id,
  defaultWidth = 520,
  defaultHeight = 480,
  width,
  height,
  minWidth = 280,
  minHeight = 220,
  maxWidth = 1680,
  maxHeight = 1000,
  onResize,
  className = '',
  children,
}) => {
  const [currentWidth, setCurrentWidth] = useState<number>(width || defaultWidth);
  const [currentHeight, setCurrentHeight] = useState<number>(height || defaultHeight);
  const [isResizing, setIsResizing] = useState(false);

  useEffect(() => {
    if (width) setCurrentWidth(width);
  }, [width]);

  useEffect(() => {
    if (height) setCurrentHeight(height);
  }, [height]);

  const activeResizeType = useRef<'right' | 'bottom' | 'corner' | null>(null);
  const startPos = useRef({ x: 0, y: 0, w: defaultWidth, h: defaultHeight });

  const startResizing = (
    e: React.PointerEvent,
    type: 'right' | 'bottom' | 'corner'
  ) => {
    e.preventDefault();
    e.stopPropagation();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);

    activeResizeType.current = type;
    setIsResizing(true);
    startPos.current = {
      x: e.clientX,
      y: e.clientY,
      w: currentWidth,
      h: currentHeight,
    };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!activeResizeType.current) return;
    const deltaX = e.clientX - startPos.current.x;
    const deltaY = e.clientY - startPos.current.y;

    let newW = currentWidth;
    let newH = currentHeight;

    if (activeResizeType.current === 'right' || activeResizeType.current === 'corner') {
      newW = Math.min(Math.max(minWidth, startPos.current.w + deltaX), maxWidth);
      setCurrentWidth(newW);
    }

    if (activeResizeType.current === 'bottom' || activeResizeType.current === 'corner') {
      newH = Math.min(Math.max(minHeight, startPos.current.h + deltaY), maxHeight);
      setCurrentHeight(newH);
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (activeResizeType.current) {
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {}
      activeResizeType.current = null;
      setIsResizing(false);
      if (onResize) {
        onResize(currentWidth, currentHeight);
      }
    }
  };

  return (
    <div
      style={{
        width: `${currentWidth}px`,
        height: `${currentHeight}px`,
        maxWidth: '100%',
      }}
      className={`relative group shrink-0 transition-all ${
        isResizing ? 'ring-2 ring-sky-500/50 select-none' : ''
      } ${className}`}
    >
      <div className="w-full h-full overflow-hidden flex flex-col">
        {children}
      </div>

      {/* Live Dimension Pill during Resizing */}
      {isResizing && (
        <div className="absolute top-2 right-2 z-40 bg-slate-900/90 text-white text-[11px] font-mono font-bold px-2.5 py-1 rounded-full shadow-lg border border-white/20 pointer-events-none animate-in fade-in">
          {Math.round(currentWidth)} × {Math.round(currentHeight)} px
        </div>
      )}

      {/* Right Edge Touch/Drag Handle */}
      <div
        onPointerDown={(e) => startResizing(e, 'right')}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className="absolute top-2 bottom-2 -right-2 w-5 cursor-ew-resize z-20 flex items-center justify-center hover:bg-sky-500/25 active:bg-sky-500/50 rounded-full transition-all touch-none select-none"
        title="Touch & drag edge to adjust width"
      >
        <div className="w-1.5 h-10 rounded-full bg-slate-300/80 dark:bg-white/25 group-hover:bg-sky-500 group-hover:opacity-100 opacity-40 transition-all shadow-sm" />
      </div>

      {/* Bottom Edge Touch/Drag Handle */}
      <div
        onPointerDown={(e) => startResizing(e, 'bottom')}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className="absolute -bottom-2 left-2 right-2 h-5 cursor-ns-resize z-20 flex items-center justify-center hover:bg-sky-500/25 active:bg-sky-500/50 rounded-full transition-all touch-none select-none"
        title="Touch & drag edge to adjust height"
      >
        <div className="h-1.5 w-10 rounded-full bg-slate-300/80 dark:bg-white/25 group-hover:bg-sky-500 group-hover:opacity-100 opacity-40 transition-all shadow-sm" />
      </div>

      {/* Bottom-Right Corner Touch/Drag Handle */}
      <div
        onPointerDown={(e) => startResizing(e, 'corner')}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className="absolute -bottom-1.5 -right-1.5 w-7 h-7 cursor-nwse-resize z-30 flex items-center justify-center hover:bg-sky-500/30 active:bg-sky-500/60 rounded-br-2xl transition-all text-slate-400 hover:text-sky-500 touch-none select-none"
        title="Touch & drag corner to adjust width & height"
      >
        <svg className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" viewBox="0 0 10 10" fill="currentColor">
          <circle cx="8" cy="8" r="1.3" />
          <circle cx="4" cy="8" r="1.3" />
          <circle cx="8" cy="4" r="1.3" />
        </svg>
      </div>
    </div>
  );
};
