import React from 'react';
import { Type, Minus, Plus } from 'lucide-react';
import { FontSizeScale } from '../../types';

interface FontSizeControlProps {
  fontSize?: FontSizeScale;
  onChange: (size: FontSizeScale) => void;
  accentColor?: string;
}

const SIZES: FontSizeScale[] = ['sm', 'md', 'lg', 'xl', '2xl'];

export function getFontSizeClasses(scale: FontSizeScale = 'md'): { text: string; subtext: string } {
  switch (scale) {
    case 'sm':
      return { text: 'text-xs', subtext: 'text-[10px]' };
    case 'md':
      return { text: 'text-sm', subtext: 'text-xs' };
    case 'lg':
      return { text: 'text-base font-medium', subtext: 'text-xs' };
    case 'xl':
      return { text: 'text-lg font-semibold', subtext: 'text-sm' };
    case '2xl':
      return { text: 'text-xl font-bold', subtext: 'text-base' };
    default:
      return { text: 'text-sm', subtext: 'text-xs' };
  }
}

export const FontSizeControl: React.FC<FontSizeControlProps> = ({
  fontSize = 'md',
  onChange,
}) => {
  const currentIndex = SIZES.indexOf(fontSize);
  const safeIndex = currentIndex === -1 ? 1 : currentIndex;

  const handleDecrease = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (safeIndex > 0) {
      onChange(SIZES[safeIndex - 1]);
    }
  };

  const handleIncrease = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (safeIndex < SIZES.length - 1) {
      onChange(SIZES[safeIndex + 1]);
    }
  };

  const getLabel = () => {
    switch (fontSize) {
      case 'sm':
        return 'S';
      case 'md':
        return 'M';
      case 'lg':
        return 'L';
      case 'xl':
        return 'XL';
      case '2xl':
        return '2XL';
      default:
        return 'M';
    }
  };

  return (
    <div
      className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-600 dark:text-slate-300 shadow-xs"
      title={`Font Size: ${getLabel()} (Click + or - to adjust)`}
    >
      <Type className="w-3 h-3 text-slate-400 mr-0.5" />
      <button
        type="button"
        onClick={handleDecrease}
        disabled={safeIndex === 0}
        className="p-1 rounded hover:bg-slate-200 dark:hover:bg-white/15 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        title="Decrease font size"
      >
        <Minus className="w-2.5 h-2.5" />
      </button>
      <span className="text-[10px] font-black uppercase px-1 min-w-[20px] text-center select-none text-sky-600 dark:text-sky-400">
        {getLabel()}
      </span>
      <button
        type="button"
        onClick={handleIncrease}
        disabled={safeIndex === SIZES.length - 1}
        className="p-1 rounded hover:bg-slate-200 dark:hover:bg-white/15 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        title="Increase font size"
      >
        <Plus className="w-2.5 h-2.5" />
      </button>
    </div>
  );
};
