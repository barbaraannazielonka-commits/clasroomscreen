import React, { useState, useRef } from 'react';
import {
  BookOpen,
  Plus,
  Copy,
  Trash2,
  Download,
  Upload,
  Search,
  Check,
  X,
  Calendar,
  Layers,
} from 'lucide-react';
import { LessonPlan } from '../types';
import { useTheme } from '../context/ThemeContext';

interface LessonLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  lessons: LessonPlan[];
  activeLessonId: string;
  onSelectLesson: (id: string) => void;
  onCreateLesson: () => void;
  onDuplicateLesson: (lesson: LessonPlan) => void;
  onDeleteLesson: (id: string) => void;
  onImportLessons: (imported: LessonPlan[]) => void;
}

export const LessonLibraryModal: React.FC<LessonLibraryModalProps> = ({
  isOpen,
  onClose,
  lessons,
  activeLessonId,
  onSelectLesson,
  onCreateLesson,
  onDuplicateLesson,
  onDeleteLesson,
  onImportLessons,
}) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const [searchQuery, setSearchQuery] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const filteredLessons = lessons.filter((l) =>
    l.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(lessons, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `lessonflow-lessons-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (Array.isArray(parsed) && parsed.length > 0) {
            onImportLessons(parsed);
          }
        } catch (err) {
          console.error('Import parse error:', err);
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className={`w-full max-w-3xl max-h-[85vh] flex flex-col rounded-3xl border shadow-2xl overflow-hidden transition-colors ${
          isLight
            ? 'bg-white/95 border-slate-300 text-slate-800'
            : 'bg-slate-900/95 border-white/20 text-slate-100'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-sky-500/10 text-sky-500 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-extrabold tracking-tight">
                Lesson Plan Library & Storage
              </h2>
              <p className="text-xs text-slate-400">
                Manage, switch, or backup your saved classroom boards
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar: Search, Create, Import/Export */}
        <div className="p-4 px-6 border-b border-slate-200 dark:border-white/5 flex flex-wrap items-center justify-between gap-3">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search lessons..."
              className={`w-full pl-9 pr-3 py-2 text-xs rounded-xl border focus:outline-none ${
                isLight
                  ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-sky-500'
                  : 'bg-white/5 border-white/10 text-white focus:border-sky-400'
              }`}
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onCreateLesson();
                onClose();
              }}
              className="px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>New Lesson</span>
            </button>

            <button
              onClick={handleExportJson}
              className={`p-2 rounded-xl border text-xs font-semibold transition-all ${
                isLight
                  ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700'
                  : 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-300'
              }`}
              title="Backup lessons as JSON"
            >
              <Download className="w-4 h-4" />
            </button>

            <label
              className={`p-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                isLight
                  ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700'
                  : 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-300'
              }`}
              title="Import lessons from JSON"
            >
              <Upload className="w-4 h-4" />
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleImportFile}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Lessons List Grid */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {filteredLessons.map((item) => {
            const isActive = item.id === activeLessonId;
            const isDeleting = deleteConfirmId === item.id;
            const pageCount = item.pages ? item.pages.length : 1;

            return (
              <div
                key={item.id}
                onClick={() => {
                  onSelectLesson(item.id);
                  onClose();
                }}
                className={`group flex items-center justify-between gap-4 p-4 rounded-2xl border cursor-pointer transition-all ${
                  isActive
                    ? 'border-sky-500 ring-2 ring-sky-500/20 bg-sky-500/5'
                    : isLight
                    ? 'bg-slate-50/70 hover:bg-slate-100/80 border-slate-200'
                    : 'bg-white/5 hover:bg-white/10 border-white/5'
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                      isActive
                        ? 'bg-sky-500 text-white shadow-md'
                        : isLight
                        ? 'bg-slate-200 text-slate-600'
                        : 'bg-white/10 text-slate-300'
                    }`}
                  >
                    <BookOpen className="w-5 h-5" />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-extrabold text-sm truncate text-slate-900 dark:text-white">
                        {item.title}
                      </h4>
                      {isActive && (
                        <span className="px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-600 dark:text-sky-300 text-[10px] font-black uppercase tracking-wider">
                          Active
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {item.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Layers className="w-3 h-3" />
                        {pageCount} {pageCount === 1 ? 'screen' : 'screens'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div
                  className="flex items-center gap-1.5 shrink-0"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => onDuplicateLesson(item)}
                    className="p-2 rounded-xl text-slate-400 hover:text-sky-500 hover:bg-sky-500/10 transition-colors"
                    title="Duplicate lesson"
                  >
                    <Copy className="w-4 h-4" />
                  </button>

                  {lessons.length > 1 && (
                    <>
                      {isDeleting ? (
                        <div className="flex items-center gap-1 bg-rose-500/10 p-1 rounded-xl">
                          <button
                            onClick={() => {
                              onDeleteLesson(item.id);
                              setDeleteConfirmId(null);
                            }}
                            className="px-2 py-1 bg-rose-600 text-white rounded-lg text-xs font-bold hover:bg-rose-700"
                          >
                            Delete
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(null)}
                            className="px-2 py-1 text-slate-400 hover:text-white text-xs"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeleteConfirmId(item.id)}
                          className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                          title="Delete lesson"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
