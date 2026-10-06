import React, { useState } from 'react';
import {
  BookOpen,
  Printer,
  Maximize2,
  Minimize2,
  Sun,
  Moon,
  Trash2,
  Save,
  Check,
  Sparkles,
  Contrast,
} from 'lucide-react';
import { LessonPlan, FontSizeScale } from '../types';
import { useTheme } from '../context/ThemeContext';
import { FontSizeControl } from './widgets/FontSizeControl';

interface TopHeaderProps {
  lesson: LessonPlan;
  onOpenLibrary: () => void;
  onOpenPrintModal: () => void;
  onSaveLesson: () => void;
  onClearBoard: () => void;
  isPresentationMode: boolean;
  onTogglePresentationMode: () => void;
  isSaved: boolean;
  globalFontSize?: FontSizeScale;
  onGlobalFontSizeChange?: (size: FontSizeScale) => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  lesson,
  onOpenLibrary,
  onOpenPrintModal,
  onSaveLesson,
  onClearBoard,
  isPresentationMode,
  onTogglePresentationMode,
  isSaved,
  globalFontSize = 'md',
  onGlobalFontSizeChange,
}) => {
  const { theme, toggleTheme, highContrast, toggleHighContrast } = useTheme();
  const isLight = theme === 'light';
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const toggleBrowserFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
    onTogglePresentationMode();
  };

  return (
    <header
      className={`relative z-20 w-full px-4 sm:px-6 py-2.5 backdrop-blur-md border-b transition-colors ${
        isLight
          ? 'bg-white/95 border-slate-300 text-slate-900 shadow-xs'
          : 'bg-slate-900/95 border-white/15 text-slate-100 shadow-sm'
      }`}
    >
      <div className="max-w-[1720px] mx-auto flex items-center justify-between gap-3">
        {/* Left: Brand & Library trigger */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-sky-600/30">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="font-extrabold text-sm sm:text-base tracking-tight block leading-tight text-slate-900 dark:text-white">
                LessonFlow
              </span>
            </div>
          </div>

          <div className="h-5 w-[1px] bg-slate-300 dark:bg-white/15 mx-1 hidden sm:block" />

          {/* Lessons Library Button */}
          <button
            onClick={onOpenLibrary}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border shadow-xs cursor-pointer ${
              isLight
                ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800'
                : 'bg-white/10 hover:bg-white/15 border-white/15 text-white'
            }`}
            title="Open lesson library & switch lessons"
            aria-label="Open lesson library"
          >
            <BookOpen className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
            <span className="hidden sm:inline">Lessons</span>
            <span className="text-[10px] px-1.5 py-0.2 bg-sky-500/15 text-sky-700 dark:text-sky-300 rounded font-bold">
              Library
            </span>
          </button>

          {/* Save Status */}
          <button
            onClick={onSaveLesson}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              isSaved
                ? 'text-emerald-700 dark:text-emerald-300'
                : 'text-amber-700 dark:text-amber-300 animate-pulse'
            }`}
            title={isSaved ? 'Changes auto-saved to browser' : 'Saving changes...'}
            aria-label={isSaved ? 'Changes auto-saved' : 'Saving changes'}
          >
            {isSaved ? (
              <>
                <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                <span className="text-[11px] hidden md:inline">Saved</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span className="text-[11px] hidden md:inline">Saving...</span>
              </>
            )}
          </button>
        </div>

        {/* Right Action Controls: Clear Board, Font Size, Print Button, Theme, High Contrast, Fullscreen */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Clear Board with confirmation */}
          <div className="relative">
            {showClearConfirm ? (
              <div
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs shadow-md animate-in fade-in zoom-in-95 ${
                  isLight
                    ? 'bg-rose-50 border-rose-300 text-rose-900'
                    : 'bg-rose-950/90 border-rose-500/50 text-rose-100'
                }`}
              >
                <span className="text-[11px] font-bold">Clear this screen?</span>
                <button
                  onClick={() => {
                    onClearBoard();
                    setShowClearConfirm(false);
                  }}
                  className="px-2 py-0.5 bg-rose-600 text-white rounded font-bold hover:bg-rose-700 text-[11px] cursor-pointer"
                  aria-label="Confirm clear screen"
                >
                  Yes
                </button>
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="px-1.5 py-0.5 text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white text-[11px] font-semibold cursor-pointer"
                  aria-label="Cancel clear screen"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowClearConfirm(true)}
                className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
                  isLight
                    ? 'hover:bg-slate-100 text-slate-700 hover:text-rose-700'
                    : 'hover:bg-white/10 text-slate-200 hover:text-rose-300'
                }`}
                title="Clear current screen content"
                aria-label="Clear current screen content"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden md:inline text-[11px]">Clear Screen</span>
              </button>
            )}
          </div>

          {/* Classroom Font Size Control */}
          {onGlobalFontSizeChange && (
            <div className="flex items-center gap-1" title="Screen Font Size">
              <FontSizeControl fontSize={globalFontSize} onChange={onGlobalFontSizeChange} />
            </div>
          )}

          {/* THE Print / PDF Export Button */}
          <button
            onClick={onOpenPrintModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-xs transition-all cursor-pointer"
            title="Export or print lesson summary & tasks"
            aria-label="Export or print lesson summary"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Print / PDF</span>
          </button>

          {/* High Contrast Mode Toggle (Universal Design WCAG 2.1 AAA) */}
          <button
            onClick={toggleHighContrast}
            className={`p-2 rounded-lg transition-colors border flex items-center gap-1 cursor-pointer ${
              highContrast
                ? 'bg-amber-400 text-slate-950 border-amber-500 font-extrabold shadow-sm'
                : isLight
                ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800'
                : 'bg-white/10 hover:bg-white/15 border-white/15 text-slate-200'
            }`}
            title={highContrast ? 'High Contrast Mode ON (Click to turn off)' : 'Toggle High Contrast Mode (WCAG AAA)'}
            aria-label="Toggle high contrast mode"
            aria-pressed={highContrast}
          >
            <Contrast className="w-3.5 h-3.5" />
            <span className="text-[11px] font-bold hidden lg:inline">
              {highContrast ? 'High Contrast' : 'Contrast'}
            </span>
          </button>

          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-lg transition-colors border cursor-pointer ${
              isLight
                ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-amber-700'
                : 'bg-white/10 hover:bg-white/15 border-white/15 text-amber-300'
            }`}
            title={isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            aria-label={isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
          >
            {isLight ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
          </button>

          {/* Fullscreen / Presentation View */}
          <button
            onClick={toggleBrowserFullscreen}
            className={`p-2 rounded-lg transition-colors border cursor-pointer ${
              isPresentationMode
                ? 'bg-sky-600 text-white border-sky-500 font-bold'
                : isLight
                ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800'
                : 'bg-white/10 hover:bg-white/15 border-white/15 text-white'
            }`}
            title={isPresentationMode ? 'Exit Full Screen' : 'Enter Full Screen Presentation'}
            aria-label={isPresentationMode ? 'Exit Full Screen' : 'Enter Full Screen Presentation'}
          >
            {isPresentationMode ? (
              <Minimize2 className="w-3.5 h-3.5" />
            ) : (
              <Maximize2 className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
