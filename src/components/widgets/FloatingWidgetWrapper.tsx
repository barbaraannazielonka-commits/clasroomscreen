import React, { useState, useRef, useEffect } from 'react';
import { X, GripHorizontal, Minus, Square } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface FloatingWidgetWrapperProps {
  id: string;
  title: string;
  width: number;
  height: number;
  defaultPosition?: { x: number; y: number };
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
  onResize?: (w: number, h: number) => void;
  onClose: () => void;
  children: React.ReactNode;
}

export const FloatingWidgetWrapper: React.FC<FloatingWidgetWrapperProps> = ({
  id,
  title,
  width,
  height,
  defaultPosition = { x: 100, y: 100 },
  minWidth = 240,
  minHeight = 160,
  maxWidth = 1400,
  maxHeight = 1000,
  onResize,
  onClose,
  children,
}) => {
  const { theme, highContrast } = useTheme();
  const isLight = theme === 'light';

  // Position state
  const [pos, setPos] = useState<{ x: number; y: number }>(() => {
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem(`fw_pos_${id}`);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {}
      }
    }
    return defaultPosition;
  });

  // Size state
  const [size, setSize] = useState({ width, height });
  const [isMinimized, setIsMinimized] = useState(false);
  const [isResizing, setIsResizing] = useState(false);

  useEffect(() => {
    setSize({ width, height });
  }, [width, height]);

  // Dragging state
  const isDraggingRef = useRef(false);
  const dragOffsetRef = useRef({ x: 0, y: 0 });

  // Resizing state
  const activeResizeType = useRef<'right' | 'bottom' | 'corner' | null>(null);
  const resizeStartPos = useRef({ x: 0, y: 0, w: width, h: height });

  const handleMouseDownHeader = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button')) return;
    isDraggingRef.current = true;
    dragOffsetRef.current = {
      x: e.clientX - pos.x,
      y: e.clientY - pos.y,
    };
    e.preventDefault();
  };

  const startEdgeResizing = (
    e: React.PointerEvent,
    type: 'right' | 'bottom' | 'corner'
  ) => {
    e.preventDefault();
    e.stopPropagation();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);

    activeResizeType.current = type;
    setIsResizing(true);
    resizeStartPos.current = {
      x: e.clientX,
      y: e.clientY,
      w: size.width,
      h: size.height,
    };
  };

  const handlePointerMoveResize = (e: React.PointerEvent) => {
    if (!activeResizeType.current) return;
    const deltaX = e.clientX - resizeStartPos.current.x;
    const deltaY = e.clientY - resizeStartPos.current.y;

    let newW = size.width;
    let newH = size.height;

    if (activeResizeType.current === 'right' || activeResizeType.current === 'corner') {
      newW = Math.min(Math.max(minWidth, resizeStartPos.current.w + deltaX), maxWidth);
    }

    if (activeResizeType.current === 'bottom' || activeResizeType.current === 'corner') {
      newH = Math.min(Math.max(minHeight, resizeStartPos.current.h + deltaY), maxHeight);
    }

    setSize({ width: newW, height: newH });
  };

  const handlePointerUpResize = (e: React.PointerEvent) => {
    if (activeResizeType.current) {
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {}
      activeResizeType.current = null;
      setIsResizing(false);
      if (onResize) {
        onResize(size.width, size.height);
      }
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDraggingRef.current) {
        const maxX = Math.max(0, window.innerWidth - size.width - 20);
        const maxY = Math.max(0, window.innerHeight - 80);
        const newX = Math.min(Math.max(10, e.clientX - dragOffsetRef.current.x), maxX);
        const newY = Math.min(Math.max(60, e.clientY - dragOffsetRef.current.y), maxY);
        setPos({ x: newX, y: newY });
      }
    };

    const handleMouseUp = () => {
      if (isDraggingRef.current) {
        isDraggingRef.current = false;
        sessionStorage.setItem(`fw_pos_${id}`, JSON.stringify(pos));
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [pos, size, id]);

  return (
    <div
      style={{
        left: `${pos.x}px`,
        top: `${pos.y}px`,
        width: `${size.width}px`,
        height: isMinimized ? 'auto' : `${size.height}px`,
      }}
      className={`fixed z-30 flex flex-col rounded-3xl border shadow-2xl backdrop-blur-xl transition-shadow select-none animate-in fade-in zoom-in-95 duration-150 group high-contrast-card ${
        isResizing ? 'ring-2 ring-sky-500/60' : ''
      } ${
        highContrast
          ? isLight
            ? 'bg-white border-2 border-black text-black'
            : 'bg-black border-2 border-white text-white'
          : isLight
          ? 'bg-white/98 border-slate-300 text-slate-900 shadow-xl'
          : 'bg-slate-900/98 border-white/20 text-slate-100 shadow-2xl'
      }`}
    >
      {/* Title bar / Drag Handle */}
      <div
        onMouseDown={handleMouseDownHeader}
        className={`flex items-center justify-between px-3.5 py-2.5 border-b cursor-grab active:cursor-grabbing rounded-t-3xl transition-colors ${
          isLight
            ? 'bg-slate-100 border-slate-300'
            : 'bg-white/5 border-white/10'
        }`}
      >
        <div className="flex items-center gap-2 min-w-0 pointer-events-none">
          <GripHorizontal className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 shrink-0" />
          <span className="font-extrabold text-xs tracking-tight truncate text-slate-900 dark:text-white">
            {title}
          </span>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1 rounded-lg text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10 transition-colors cursor-pointer"
            title={isMinimized ? 'Expand' : 'Minimize'}
            aria-label={isMinimized ? 'Expand widget' : 'Minimize widget'}
          >
            {isMinimized ? <Square className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
          </button>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-600 hover:text-rose-600 dark:text-slate-300 dark:hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
            title="Close widget"
            aria-label="Close widget"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Live Dimension Pill during Resizing */}
      {isResizing && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-40 bg-slate-950 text-white text-[11px] font-mono font-bold px-2.5 py-1 rounded-full shadow-lg border border-white/20 pointer-events-none animate-in fade-in">
          {Math.round(size.width)} × {Math.round(size.height)} px
        </div>
      )}

      {/* Widget Content */}
      {!isMinimized && (
        <div className="flex-1 overflow-hidden p-3 relative flex flex-col">
          {children}

          {/* Right Edge Touch/Drag Handle */}
          <div
            onPointerDown={(e) => startEdgeResizing(e, 'right')}
            onPointerMove={handlePointerMoveResize}
            onPointerUp={handlePointerUpResize}
            className="absolute top-2 bottom-2 -right-1 w-4 cursor-ew-resize z-20 flex items-center justify-center hover:bg-sky-500/25 active:bg-sky-500/50 rounded-full transition-all touch-none select-none"
            title="Touch & drag edge to adjust width"
          >
            <div className="w-1.5 h-8 rounded-full bg-slate-400 dark:bg-white/30 group-hover:bg-sky-600 group-hover:opacity-100 opacity-60 transition-all shadow-xs" />
          </div>

          {/* Bottom Edge Touch/Drag Handle */}
          <div
            onPointerDown={(e) => startEdgeResizing(e, 'bottom')}
            onPointerMove={handlePointerMoveResize}
            onPointerUp={handlePointerUpResize}
            className="absolute -bottom-1 left-2 right-2 h-4 cursor-ns-resize z-20 flex items-center justify-center hover:bg-sky-500/25 active:bg-sky-500/50 rounded-full transition-all touch-none select-none"
            title="Touch & drag edge to adjust height"
          >
            <div className="h-1.5 w-8 rounded-full bg-slate-400 dark:bg-white/30 group-hover:bg-sky-600 group-hover:opacity-100 opacity-60 transition-all shadow-xs" />
          </div>

          {/* Bottom-Right Corner Touch/Drag Handle */}
          <div
            onPointerDown={(e) => startEdgeResizing(e, 'corner')}
            onPointerMove={handlePointerMoveResize}
            onPointerUp={handlePointerUpResize}
            className="absolute -bottom-1 -right-1 w-6 h-6 cursor-nwse-resize z-30 flex items-center justify-center hover:bg-sky-500/30 active:bg-sky-500/60 rounded-br-2xl transition-all text-slate-500 hover:text-sky-600 touch-none select-none"
            title="Touch & drag corner to adjust width & height"
          >
            <svg className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 transition-opacity" viewBox="0 0 10 10" fill="currentColor">
              <circle cx="8" cy="8" r="1.3" />
              <circle cx="4" cy="8" r="1.3" />
              <circle cx="8" cy="4" r="1.3" />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
};
