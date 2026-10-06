import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  Award,
  BookOpen,
  Check,
  Plus,
  X,
  Search,
  ExternalLink,
  GraduationCap,
  Briefcase,
  Languages,
  CheckCircle2,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import {
  UDIR_CURRICULUM_TRACKS,
  CurriculumAim,
} from '../data/curriculumAims';

interface CurriculumAimsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentAims: string[];
  onToggleAim: (aimText: string) => void;
}

export const CurriculumAimsModal: React.FC<CurriculumAimsModalProps> = ({
  isOpen,
  onClose,
  currentAims,
  onToggleAim,
}) => {
  const { theme, highContrast } = useTheme();
  const isLight = theme === 'light';

  const [activeTrack, setActiveTrack] = useState<'academic' | 'vocational'>('academic');
  const [languageMode, setLanguageMode] = useState<'en' | 'no' | 'both'>('en');
  const [searchQuery, setSearchQuery] = useState('');
  const [lastToggledAim, setLastToggledAim] = useState<string | null>(null);

  // Close on Escape key
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

  const trackData = UDIR_CURRICULUM_TRACKS[activeTrack];
  const filteredAims = trackData.aims.filter((aim) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      aim.textEn.toLowerCase().includes(q) ||
      aim.textNo.toLowerCase().includes(q) ||
      aim.category.toLowerCase().includes(q) ||
      aim.code.includes(q)
    );
  });

  const getAimDisplayText = (aim: CurriculumAim) => {
    if (languageMode === 'en') return aim.textEn;
    if (languageMode === 'no') return aim.textNo;
    return `${aim.textEn}\n(${aim.textNo})`;
  };

  const isAimSelected = (aim: CurriculumAim) => {
    const normEn = aim.textEn.trim().toLowerCase();
    const normNo = aim.textNo.trim().toLowerCase();

    return currentAims.some((a) => {
      if (!a || !a.trim()) return false;
      const normA = a.trim().toLowerCase();
      return (
        normA === normEn ||
        normA === normNo ||
        (normA.length >= 10 && normA.includes(normEn)) ||
        (normA.length >= 10 && normA.includes(normNo)) ||
        (normEn.length >= 10 && normEn.includes(normA))
      );
    });
  };

  const handleItemClick = (aim: CurriculumAim) => {
    const textToInsert = getAimDisplayText(aim);
    onToggleAim(textToInsert);
    setLastToggledAim(aim.id);
    setTimeout(() => setLastToggledAim(null), 1500);
  };

  const handleAddAndClose = (aim: CurriculumAim) => {
    const textToInsert = getAimDisplayText(aim);
    onToggleAim(textToInsert);
    onClose();
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
        className={`w-full max-w-3xl max-h-[90vh] flex flex-col rounded-3xl border shadow-2xl overflow-hidden transition-colors ${
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
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-300 dark:border-white/15 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600/15 text-indigo-700 dark:text-indigo-300 flex items-center justify-center shrink-0">
              <Award className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black tracking-tight flex items-center gap-2 text-slate-900 dark:text-white">
                LK20 English Competence Aims (Udir)
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-600/15 text-indigo-800 dark:text-indigo-200 font-bold">
                  {currentAims.length} on board
                </span>
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                Click any aim to immediately add or remove it from your lesson board
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-xl text-slate-700 hover:text-slate-900 dark:text-slate-200 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors flex items-center gap-1.5 text-xs font-bold border border-slate-300 dark:border-white/20 cursor-pointer"
            title="Close (Esc)"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4 stroke-[2.5]" />
            <span>Close (Esc)</span>
          </button>
        </div>

        {/* Track Selector (Academic vs Vocational) */}
        <div className="px-4 sm:px-5 pt-3.5 pb-2.5 border-b border-slate-300 dark:border-white/15 shrink-0 space-y-3 bg-slate-50 dark:bg-white/5">
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => setActiveTrack('academic')}
              className={`p-3.5 rounded-2xl border text-left transition-all flex items-start gap-2.5 cursor-pointer ${
                activeTrack === 'academic'
                  ? 'bg-sky-700 text-white border-sky-800 shadow-md ring-2 ring-sky-500/40'
                  : isLight
                  ? 'bg-white hover:bg-slate-100 border-slate-300 text-slate-800'
                  : 'bg-white/10 hover:bg-white/15 border-white/10 text-white'
              }`}
            >
              <GraduationCap className="w-5 h-5 shrink-0 mt-0.5" />
              <div className="min-w-0">
                <div className="font-extrabold text-xs sm:text-sm">
                  Academic Line (kv1035)
                </div>
                <div
                  className={`text-[11px] font-medium truncate ${
                    activeTrack === 'academic' ? 'text-sky-100 font-semibold' : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  Studieforberedende Vg1 • 13 Aims
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setActiveTrack('vocational')}
              className={`p-3.5 rounded-2xl border text-left transition-all flex items-start gap-2.5 cursor-pointer ${
                activeTrack === 'vocational'
                  ? 'bg-indigo-700 text-white border-indigo-800 shadow-md ring-2 ring-indigo-500/40'
                  : isLight
                  ? 'bg-white hover:bg-slate-100 border-slate-300 text-slate-800'
                  : 'bg-white/10 hover:bg-white/15 border-white/10 text-white'
              }`}
            >
              <Briefcase className="w-5 h-5 shrink-0 mt-0.5" />
              <div className="min-w-0">
                <div className="font-extrabold text-xs sm:text-sm">
                  Vocational Line (kv1034)
                </div>
                <div
                  className={`text-[11px] font-medium truncate ${
                    activeTrack === 'vocational' ? 'text-indigo-100 font-semibold' : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  Yrkesfaglige Vg1 & Vg2 • 15 Aims
                </div>
              </div>
            </button>
          </div>

          {/* Search Bar & Language Toggle */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 pt-0.5">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search aims (e.g. 'digital', 'kilder', 'work', 'culture')..."
                className={`w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border focus:outline-none transition-colors ${
                  isLight
                    ? 'bg-white border-slate-300 text-slate-900 focus:border-indigo-600'
                    : 'bg-slate-800 border-white/20 text-white focus:border-indigo-400'
                }`}
              />
            </div>

            <div className="flex items-center gap-1 shrink-0 self-end sm:self-auto">
              <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 mr-1 flex items-center gap-1">
                <Languages className="w-3.5 h-3.5" /> Language:
              </span>
              <button
                type="button"
                onClick={() => setLanguageMode('en')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  languageMode === 'en'
                    ? 'bg-slate-950 text-white dark:bg-white dark:text-slate-950'
                    : 'text-slate-700 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white'
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => setLanguageMode('no')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  languageMode === 'no'
                    ? 'bg-slate-950 text-white dark:bg-white dark:text-slate-950'
                    : 'text-slate-700 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white'
                }`}
              >
                Norsk
              </button>
              <button
                type="button"
                onClick={() => setLanguageMode('both')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  languageMode === 'both'
                    ? 'bg-slate-950 text-white dark:bg-white dark:text-slate-950'
                    : 'text-slate-700 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white'
                }`}
              >
                Both
              </button>
            </div>
          </div>
        </div>

        {/* Competence Aims Clickable List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-2.5">
          {filteredAims.map((aim) => {
            const isAdded = isAimSelected(aim);
            const displayText = getAimDisplayText(aim);
            const justToggled = lastToggledAim === aim.id;

            return (
              <div
                key={aim.id}
                className={`group p-3.5 rounded-2xl border transition-all flex items-start gap-3 ${
                  isAdded
                    ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-950 dark:text-emerald-100 shadow-xs'
                    : isLight
                    ? 'bg-white hover:bg-indigo-50/50 border-slate-300 hover:border-indigo-400 shadow-xs'
                    : 'bg-white/10 hover:bg-white/15 border-white/10 hover:border-white/20'
                }`}
              >
                {/* Number Badge */}
                <div
                  className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black shrink-0 mt-0.5 transition-colors ${
                    isAdded
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'bg-slate-200 dark:bg-white/15 text-slate-800 dark:text-slate-100 group-hover:bg-indigo-700 group-hover:text-white'
                  }`}
                >
                  {isAdded ? <Check className="w-4 h-4 stroke-[3]" /> : aim.code}
                </div>

                {/* Content */}
                <div
                  className="flex-1 min-w-0 cursor-pointer"
                  onClick={() => handleItemClick(aim)}
                >
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-slate-200 dark:bg-white/15 text-slate-800 dark:text-slate-200">
                      {aim.category}
                    </span>
                    {isAdded && (
                      <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" /> Added to current screen
                      </span>
                    )}
                    {justToggled && (
                      <span className="text-[10px] font-extrabold text-indigo-700 dark:text-indigo-300 animate-pulse">
                        {isAdded ? 'Added!' : 'Removed!'}
                      </span>
                    )}
                  </div>
                  <div className="text-xs sm:text-sm font-semibold leading-relaxed whitespace-pre-line text-slate-900 dark:text-white">
                    {languageMode === 'both' ? (
                      <>
                        <span className="font-bold block text-slate-950 dark:text-white">
                          {aim.textEn}
                        </span>
                        <span className="text-xs text-slate-700 dark:text-slate-300 mt-1 block font-medium">
                          🇳🇴 {aim.textNo}
                        </span>
                      </>
                    ) : (
                      displayText
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center gap-1.5 shrink-0 self-start sm:self-center">
                  <button
                    type="button"
                    onClick={() => handleItemClick(aim)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                      isAdded
                        ? 'bg-emerald-700 hover:bg-rose-700 text-white shadow-xs'
                        : 'bg-indigo-50 dark:bg-indigo-950/70 hover:bg-indigo-700 text-indigo-900 dark:text-indigo-200 hover:text-white border border-indigo-300 dark:border-indigo-700'
                    }`}
                    title={isAdded ? 'Click to remove this aim' : 'Click to add to board'}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                        <span>Added</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5 stroke-[3]" />
                        <span>Add</span>
                      </>
                    )}
                  </button>

                  {!isAdded && (
                    <button
                      type="button"
                      onClick={() => handleAddAndClose(aim)}
                      className="px-2.5 py-1.5 rounded-xl text-[11px] font-bold text-slate-700 hover:text-indigo-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-white/10 transition-colors cursor-pointer hidden sm:block border border-slate-300 dark:border-white/15"
                      title="Add this aim and return to whiteboard immediately"
                    >
                      Add & Close
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Prominent Footer: Done & Return Button + Official Udir Link */}
        <div className="p-4 sm:px-6 border-t border-slate-300 dark:border-white/15 bg-slate-50 dark:bg-white/5 shrink-0 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 font-medium">
            <BookOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 stroke-[2.5]" />
            <span>
              Official curriculum from Norwegian Directorate for Education (Udir LK20)
            </span>
            <a
              href={trackData.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-indigo-700 dark:text-indigo-400 hover:underline font-bold ml-1"
            >
              <span>({trackData.code})</span>
              <ExternalLink className="w-3 h-3 stroke-[2.5]" />
            </a>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 rounded-2xl bg-indigo-700 hover:bg-indigo-600 text-white font-extrabold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Check className="w-4 h-4 stroke-[3]" />
            <span>Done & Return to Lesson ({currentAims.length} aims on board)</span>
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
