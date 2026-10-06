import React, { useState } from 'react';
import {
  Plus,
  Copy,
  Trash2,
  Edit2,
  Check,
  Monitor,
} from 'lucide-react';
import { LessonPage } from '../types';
import { useTheme } from '../context/ThemeContext';

interface PageNavigationBarProps {
  pages: LessonPage[];
  activePageIndex: number;
  onSelectPage: (index: number) => void;
  onAddPage: () => void;
  onDuplicatePage: (index: number) => void;
  onDeletePage: (index: number) => void;
  onRenamePage: (index: number, newTitle: string) => void;
}

export const PageNavigationBar: React.FC<PageNavigationBarProps> = ({
  pages,
  activePageIndex,
  onSelectPage,
  onAddPage,
  onDuplicatePage,
  onDeletePage,
  onRenamePage,
}) => {
  const { theme, highContrast } = useTheme();
  const isLight = theme === 'light';

  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [renameDraft, setRenameDraft] = useState('');

  const startRename = (index: number, currentTitle: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingIndex(index);
    setRenameDraft(currentTitle);
  };

  const saveRename = (index: number) => {
    if (renameDraft.trim()) {
      onRenamePage(index, renameDraft.trim());
    }
    setEditingIndex(null);
  };

  return (
    <div
      className={`flex items-center gap-1.5 p-1.5 rounded-2xl border backdrop-blur-md overflow-x-auto no-scrollbar shadow-sm transition-colors ${
        highContrast
          ? isLight
            ? 'bg-white border-2 border-black text-black'
            : 'bg-black border-2 border-white text-white'
          : isLight
          ? 'bg-white/95 border-slate-300 text-slate-900 shadow-xs'
          : 'bg-slate-900/90 border-white/15 text-slate-100 shadow-sm'
      }`}
    >
      <div className="flex items-center gap-1.5 pl-2 pr-2.5 border-r border-slate-300 dark:border-white/15 shrink-0">
        <Monitor className="w-4 h-4 text-sky-600 dark:text-sky-400" />
        <span className="text-[11px] font-black uppercase tracking-wider text-slate-700 dark:text-slate-200">
          Screens
        </span>
      </div>

      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
        {pages.map((page, idx) => {
          const isActive = idx === activePageIndex;
          const isEditing = editingIndex === idx;

          return (
            <div
              key={page.id || `page-${idx}`}
              onClick={() => onSelectPage(idx)}
              className={`group relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all border shrink-0 ${
                isActive
                  ? isLight
                    ? 'bg-sky-600 text-white border-sky-700 shadow-md ring-2 ring-sky-500/30'
                    : 'bg-sky-600 text-white border-sky-400 shadow-lg shadow-sky-950/50'
                  : isLight
                  ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
                  : 'bg-white/10 hover:bg-white/15 text-slate-200 border-white/10'
              }`}
            >
              <span
                className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-black ${
                  isActive
                    ? 'bg-white/25 text-white'
                    : isLight
                    ? 'bg-slate-300 text-slate-800'
                    : 'bg-white/20 text-slate-100'
                }`}
              >
                {idx + 1}
              </span>

              {isEditing ? (
                <div
                  className="flex items-center gap-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  <input
                    type="text"
                    value={renameDraft}
                    onChange={(e) => setRenameDraft(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') saveRename(idx);
                      if (e.key === 'Escape') setEditingIndex(null);
                    }}
                    autoFocus
                    className="w-24 px-1.5 py-0.5 text-xs text-slate-900 bg-white rounded border-2 border-sky-600 focus:outline-none"
                  />
                  <button
                    onClick={() => saveRename(idx)}
                    className="p-1 hover:bg-white/20 rounded text-white"
                    aria-label="Save screen title"
                  >
                    <Check className="w-3 h-3 stroke-[3]" />
                  </button>
                </div>
              ) : (
                <span
                  onDoubleClick={(e) => startRename(idx, page.title, e)}
                  className="max-w-[130px] truncate"
                  title={`${page.title} (Double click to rename)`}
                >
                  {page.title || `Screen ${idx + 1}`}
                </span>
              )}

              {/* Action buttons on active/hover */}
              {!isEditing && (
                <div
                  className={`flex items-center gap-0.5 transition-opacity ${
                    isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                  }`}
                >
                  <button
                    onClick={(e) => startRename(idx, page.title, e)}
                    className={`p-1 rounded hover:bg-black/15 dark:hover:bg-white/20 transition-colors ${
                      isActive ? 'text-white hover:text-white' : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
                    }`}
                    title="Rename screen"
                    aria-label="Rename screen"
                  >
                    <Edit2 className="w-3 h-3" />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDuplicatePage(idx);
                    }}
                    className={`p-1 rounded hover:bg-black/15 dark:hover:bg-white/20 transition-colors ${
                      isActive ? 'text-white hover:text-white' : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
                    }`}
                    title="Duplicate screen"
                    aria-label="Duplicate screen"
                  >
                    <Copy className="w-3 h-3" />
                  </button>

                  {pages.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeletePage(idx);
                      }}
                      className={`p-1 rounded hover:bg-rose-600/30 transition-colors ${
                        isActive ? 'text-white hover:text-rose-200' : 'text-slate-600 hover:text-rose-600 dark:text-slate-300 dark:hover:text-rose-300'
                      }`}
                      title="Delete screen"
                      aria-label="Delete screen"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add New Screen Tab */}
      <button
        onClick={onAddPage}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all shrink-0 shadow-xs cursor-pointer ${
          isLight
            ? 'bg-slate-100 hover:bg-sky-50 text-slate-800 hover:text-sky-800 border-slate-300 hover:border-sky-400'
            : 'bg-white/10 hover:bg-sky-500/20 text-slate-100 hover:text-sky-300 border-white/15 hover:border-sky-400/40'
        }`}
        title="Add new classroom screen"
        aria-label="Add new classroom screen"
      >
        <Plus className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400 stroke-[2.5]" />
        <span>Add Screen</span>
      </button>
    </div>
  );
};
