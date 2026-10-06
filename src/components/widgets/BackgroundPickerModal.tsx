import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  Check,
  Upload,
  Image as ImageIcon,
  Search,
} from 'lucide-react';
import { BackgroundOption } from '../../types';
import { BACKGROUND_PRESETS } from '../../data/backgrounds';
import { useTheme } from '../../context/ThemeContext';

interface BackgroundPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentBgId: string;
  onSelectBackground: (bg: BackgroundOption) => void;
  onUploadCustomBg: (dataUrl: string) => void;
}

export const BackgroundPickerModal: React.FC<BackgroundPickerModalProps> = ({
  isOpen,
  onClose,
  currentBgId,
  onSelectBackground,
  onUploadCustomBg,
}) => {
  const { theme, highContrast } = useTheme();
  const isLight = theme === 'light';

  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [customUrl, setCustomUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Keyboard Escape listener
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const categories = [
    { id: 'All', label: 'All Wallpapers' },
    { id: 'United Kingdom', label: '🇬🇧 United Kingdom' },
    { id: 'United States', label: '🇺🇸 United States' },
  ];

  const filteredPresets = BACKGROUND_PRESETS.filter((bg) => {
    const matchesCategory =
      activeCategory === 'All' || bg.category === activeCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      bg.name.toLowerCase().includes(q) ||
      bg.category.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  const handleApplyCustomUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customUrl.trim()) return;
    onUploadCustomBg(customUrl.trim());
    setCustomUrl('');
    onClose();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        onUploadCustomBg(result);
        onClose();
      };
      reader.readAsDataURL(file);
    }
  };

  const modalContent = (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div
        className={`w-full max-w-4xl max-h-[90vh] flex flex-col rounded-3xl border shadow-2xl overflow-hidden transition-colors ${
          highContrast
            ? isLight
              ? 'bg-white border-2 border-black text-black'
              : 'bg-black border-2 border-white text-white'
            : isLight
            ? 'bg-white text-slate-900 border-slate-300 shadow-2xl'
            : 'bg-slate-900 text-slate-50 border-white/20 shadow-2xl'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-300 dark:border-white/15 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/15 text-amber-700 dark:text-amber-300 flex items-center justify-center shrink-0">
              <ImageIcon className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black tracking-tight flex items-center gap-2 text-slate-900 dark:text-white">
                Classroom Wallpapers & Backgrounds
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-800 dark:text-amber-200 font-bold">
                  UK & USA
                </span>
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                Choose an inspiring background for your whiteboard or projector
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer border border-slate-300 dark:border-white/20"
            title="Close (Esc)"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Categories Bar & Search Filter */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 px-6 py-3 border-b border-slate-300 dark:border-white/15 bg-slate-50 dark:bg-white/5 shrink-0">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-amber-600 text-white shadow-xs ring-2 ring-amber-500/30'
                    : isLight
                    ? 'bg-white hover:bg-slate-200 border border-slate-300 text-slate-800'
                    : 'bg-white/10 hover:bg-white/15 border border-white/10 text-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative w-full sm:w-64 shrink-0">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search UK & USA locations..."
              className={`w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border focus:outline-none transition-colors ${
                isLight
                  ? 'bg-white border-slate-300 text-slate-900 focus:border-amber-600'
                  : 'bg-slate-800 border-white/20 text-white focus:border-amber-400'
              }`}
            />
          </div>
        </div>

        {/* Wallpaper Grid */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
          {filteredPresets.map((bg) => {
            const isSelected = bg.id === currentBgId;

            return (
              <div
                key={bg.id}
                onClick={() => {
                  onSelectBackground(bg);
                  onClose();
                }}
                className={`group relative h-32 sm:h-36 rounded-2xl overflow-hidden cursor-pointer border-2 transition-all shadow-sm ${
                  isSelected
                    ? 'border-amber-500 ring-4 ring-amber-500/30 scale-[1.02]'
                    : 'border-transparent hover:border-amber-500 hover:scale-[1.01]'
                }`}
              >
                <img
                  src={bg.thumbnail || bg.url}
                  alt={bg.name}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-2.5">
                  <span className="text-[11px] font-extrabold text-white line-clamp-1 leading-snug drop-shadow-sm">
                    {bg.name}
                  </span>
                  <span className="text-[10px] text-amber-300 font-bold drop-shadow-sm">
                    {bg.category === 'United Kingdom' ? '🇬🇧 UK' : '🇺🇸 USA'}
                  </span>
                </div>

                {isSelected && (
                  <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-amber-600 text-white flex items-center justify-center shadow-lg border border-white">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Custom Upload / URL footer */}
        <div className="p-4 px-6 border-t border-slate-300 dark:border-white/15 bg-slate-50 dark:bg-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <form
            onSubmit={handleApplyCustomUrl}
            className="flex-1 flex gap-2 w-full"
          >
            <input
              type="text"
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
              placeholder="Or paste custom image URL..."
              className={`flex-1 px-3 py-1.5 text-xs rounded-xl border focus:outline-none transition-colors ${
                isLight
                  ? 'bg-white border-slate-300 text-slate-900 focus:border-amber-600'
                  : 'bg-slate-800 border-white/20 text-white focus:border-amber-400'
              }`}
            />
            <button
              type="submit"
              disabled={!customUrl.trim()}
              className="px-3.5 py-1.5 bg-amber-700 hover:bg-amber-600 disabled:opacity-40 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer"
            >
              Use URL
            </button>
          </form>

          <div className="shrink-0 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className={`w-full sm:w-auto px-4 py-1.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                isLight
                  ? 'bg-white hover:bg-slate-100 border-slate-300 text-slate-800 shadow-xs'
                  : 'bg-white/10 hover:bg-white/15 border-white/15 text-white'
              }`}
            >
              <Upload className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Upload Custom Image</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
