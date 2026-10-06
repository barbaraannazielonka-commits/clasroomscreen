import React, { useState } from 'react';
import {
  Target,
  Award,
  Plus,
  Trash2,
  X,
  CheckCircle2,
  Circle,
  BookOpen,
  GraduationCap,
} from 'lucide-react';
import { LessonPage, FontSizeScale, WidgetSizeConfig } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import { FontSizeControl, getFontSizeClasses } from './FontSizeControl';
import { CurriculumAimsModal } from '../CurriculumAimsModal';

interface ObjectivesWidgetProps {
  page: LessonPage;
  onUpdate: (fields: Partial<LessonPage>) => void;
  onClose: () => void;
  size?: WidgetSizeConfig;
  onResizeWidget?: (size: Partial<WidgetSizeConfig>) => void;
}

export const ObjectivesWidget: React.FC<ObjectivesWidgetProps> = ({
  page,
  onUpdate,
  onClose,
  size,
  onResizeWidget,
}) => {
  const { theme, highContrast } = useTheme();
  const isLight = theme === 'light';

  const [newObjectiveText, setNewObjectiveText] = useState('');
  const [newAimText, setNewAimText] = useState('');
  const [completedObjectives, setCompletedObjectives] = useState<Record<number, boolean>>({});
  const [isCurriculumModalOpen, setIsCurriculumModalOpen] = useState(false);

  const objectives = page.lessonObjectives || [];
  const aims = page.competenceAims || [];

  const currentFontSize: FontSizeScale =
    size?.fontSize || page.widgetSizes?.['lessonInfo']?.fontSize || page.globalFontSize || 'md';

  const fontClasses = getFontSizeClasses(currentFontSize);

  const handleFontSizeChange = (newSize: FontSizeScale) => {
    if (onResizeWidget) {
      onResizeWidget({ fontSize: newSize });
    } else {
      const currentSizes = page.widgetSizes || {};
      onUpdate({
        widgetSizes: {
          ...currentSizes,
          lessonInfo: { ...(currentSizes.lessonInfo || {}), fontSize: newSize },
        },
      });
    }
  };

  const handleAddObjective = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newObjectiveText.trim()) return;
    const updated = [...objectives, newObjectiveText.trim()];
    onUpdate({ lessonObjectives: updated });
    setNewObjectiveText('');
  };

  const handleRemoveObjective = (index: number) => {
    const updated = objectives.filter((_, idx) => idx !== index);
    onUpdate({ lessonObjectives: updated });
  };

  const handleAddAim = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newAimText.trim()) return;
    const updated = [...aims, newAimText.trim()];
    onUpdate({ competenceAims: updated });
    setNewAimText('');
  };

  const handleRemoveAim = (index: number) => {
    const updated = aims.filter((_, idx) => idx !== index);
    onUpdate({ competenceAims: updated });
  };

  const handleToggleCurriculumAim = (aimText: string) => {
    const cleanAim = aimText.trim();
    if (!cleanAim) return;
    const normClean = cleanAim.toLowerCase();

    const existingIndex = aims.findIndex((a) => {
      if (!a) return false;
      const normA = a.trim().toLowerCase();
      if (normA === normClean) return true;
      if (normA.length >= 15 && normClean.length >= 15) {
        return normA.includes(normClean) || normClean.includes(normA);
      }
      return false;
    });

    if (existingIndex >= 0) {
      const updated = aims.filter((_, idx) => idx !== existingIndex);
      onUpdate({ competenceAims: updated });
    } else {
      onUpdate({ competenceAims: [...aims, cleanAim] });
    }
  };

  const toggleObjectiveCheck = (index: number) => {
    setCompletedObjectives((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <div
      className={`h-full flex flex-col rounded-3xl border shadow-xl backdrop-blur-md p-4 sm:p-5 transition-all overflow-hidden high-contrast-card ${
        highContrast
          ? isLight
            ? 'bg-white border-2 border-black text-black'
            : 'bg-black border-2 border-white text-white'
          : isLight
          ? 'bg-white/98 border-slate-300 text-slate-900 shadow-md'
          : 'bg-slate-900/95 border-white/20 text-slate-100 shadow-xl'
      }`}
    >
      {/* Header with Title and Close Button */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-300 dark:border-white/15 shrink-0">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-sky-500/15 text-sky-700 dark:text-sky-300 flex items-center justify-center shrink-0">
            <Target className="w-4 h-4 stroke-[2.5]" />
          </div>
          <div className="min-w-0">
            <h3 className="font-extrabold text-sm sm:text-base tracking-tight truncate text-slate-900 dark:text-white">
              Objectives & Competence Aims
            </h3>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 font-medium truncate">
              Learning goals & LK20 curriculum standards
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <FontSizeControl fontSize={currentFontSize} onChange={handleFontSizeChange} />
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors shrink-0 cursor-pointer"
            title="Close widget"
            aria-label="Close widget"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Content Area: Stacked vertically below one another */}
      <div className="flex-1 min-h-0 my-3 flex flex-col gap-3.5 overflow-y-auto pr-1">
        {/* Section 1 (Top): Lesson Objectives */}
        <div
          className={`flex flex-col rounded-2xl border p-3.5 shrink-0 transition-colors ${
            isLight
              ? 'bg-sky-50/70 border-sky-200 shadow-xs'
              : 'bg-white/5 border-white/10 shadow-inner'
          }`}
        >
          {/* Section Header */}
          <div className="flex items-center justify-between pb-2 border-b border-sky-300/60 dark:border-white/10 shrink-0">
            <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-sky-800 dark:text-sky-300">
              <Target className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Lesson Objectives</span>
              <span className="ml-1 px-1.5 py-0.2 bg-sky-600/15 text-sky-800 dark:text-sky-200 rounded-full text-[10px] font-bold">
                {objectives.length}
              </span>
            </div>
            <span className="text-[10px] text-slate-600 dark:text-slate-300 font-semibold">
              "I can..." targets
            </span>
          </div>

          {/* Objectives List */}
          <div className="py-2 space-y-1.5">
            {objectives.length === 0 ? (
              <div className="py-3 px-3 rounded-xl border border-dashed border-sky-300 text-center text-slate-600 dark:text-slate-300 text-xs font-medium">
                No objectives added yet. Type an "I can..." target below.
              </div>
            ) : (
              objectives.map((obj, idx) => {
                const isDone = !!completedObjectives[idx];
                return (
                  <div
                    key={idx}
                    className={`group flex items-start gap-2 p-2.5 rounded-xl border transition-all ${
                      isDone
                        ? 'bg-emerald-500/15 border-emerald-500/40'
                        : isLight
                        ? 'bg-white hover:bg-slate-50 border-slate-300 text-slate-900 shadow-xs'
                        : 'bg-white/10 hover:bg-white/15 border-white/10 text-slate-100'
                    }`}
                  >
                    <button
                      onClick={() => toggleObjectiveCheck(idx)}
                      className="mt-0.5 text-sky-700 dark:text-sky-300 hover:text-emerald-700 transition-colors shrink-0 cursor-pointer"
                      title={isDone ? 'Mark as in progress' : 'Mark as mastered'}
                      aria-label={isDone ? 'Mark as in progress' : 'Mark as mastered'}
                    >
                      {isDone ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 stroke-[2.5]" />
                      ) : (
                        <Circle className="w-4 h-4 text-slate-500 dark:text-slate-400 group-hover:text-sky-600" />
                      )}
                    </button>
                    <div className={`flex-1 ${fontClasses.text} leading-relaxed font-medium`}>
                      <span className={isDone ? 'line-through text-slate-500 dark:text-slate-400' : 'text-slate-900 dark:text-white'}>
                        {obj}
                      </span>
                    </div>
                    <button
                      onClick={() => handleRemoveObjective(idx)}
                      className="opacity-0 group-hover:opacity-100 p-0.5 text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-300 transition-all shrink-0 cursor-pointer"
                      title="Delete objective"
                      aria-label="Delete objective"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {/* Quick Add Objective Input */}
          <form onSubmit={handleAddObjective} className="pt-2 border-t border-sky-300/60 dark:border-white/10 flex items-center gap-1.5 shrink-0">
            <input
              type="text"
              value={newObjectiveText}
              onChange={(e) => setNewObjectiveText(e.target.value)}
              placeholder="Add objective (e.g. 'I can explain the difference between...')"
              className={`flex-1 px-3 py-1.5 text-xs rounded-xl border focus:outline-none transition-colors ${
                isLight
                  ? 'bg-white border-slate-300 text-slate-900 focus:border-sky-600'
                  : 'bg-white/10 border-white/20 text-white focus:border-sky-400'
              }`}
            />
            <button
              type="submit"
              disabled={!newObjectiveText.trim()}
              className="px-3 py-1.5 rounded-xl bg-sky-700 hover:bg-sky-600 disabled:opacity-40 text-white text-xs font-bold flex items-center gap-1 shadow-xs transition-all shrink-0 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Add</span>
            </button>
          </form>
        </div>

        {/* Section 2 (Bottom): Competence Aims & Standards */}
        <div
          className={`flex flex-col rounded-2xl border p-3.5 shrink-0 transition-colors ${
            isLight
              ? 'bg-indigo-50/70 border-indigo-200 shadow-xs'
              : 'bg-white/5 border-white/10 shadow-inner'
          }`}
        >
          {/* Section Header with 1-Click Browse Curriculum Button */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-indigo-300/60 dark:border-white/10 shrink-0">
            <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-indigo-800 dark:text-indigo-300">
              <Award className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Competence Aims & Standards</span>
              <span className="ml-1 px-1.5 py-0.2 bg-indigo-600/15 text-indigo-800 dark:text-indigo-200 rounded-full text-[10px] font-bold">
                {aims.length}
              </span>
            </div>

            {/* 1-Click Curriculum Browser Button */}
            <button
              onClick={() => setIsCurriculumModalOpen(true)}
              className="px-2.5 py-1 bg-gradient-to-r from-indigo-700 to-sky-700 hover:from-indigo-600 hover:to-sky-600 text-white text-[11px] font-bold rounded-lg flex items-center gap-1.5 shadow-xs transition-all cursor-pointer self-start sm:self-auto shrink-0"
              title="Click to add official aims from Academic (kv1035) or Vocational (kv1034)"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Browse LK20 Curriculum</span>
            </button>
          </div>

          {/* Aims List */}
          <div className="py-2 space-y-1.5">
            {aims.length === 0 ? (
              <div className="py-4 px-3 rounded-xl border border-dashed border-indigo-300 text-center text-slate-600 dark:text-slate-300 text-xs flex flex-col items-center gap-1.5 font-medium">
                <GraduationCap className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                <span>No competence aims added yet.</span>
                <button
                  onClick={() => setIsCurriculumModalOpen(true)}
                  className="mt-1 px-3 py-1 bg-indigo-600/15 hover:bg-indigo-600/25 text-indigo-800 dark:text-indigo-200 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                >
                  Click to Pick from LK20 Academic (kv1035) or Vocational (kv1034)
                </button>
              </div>
            ) : (
              aims.map((aim, idx) => (
                <div
                  key={idx}
                  className={`group flex items-start gap-2.5 p-2.5 rounded-xl border transition-all ${
                    isLight
                      ? 'bg-white hover:bg-slate-50 border-slate-300 shadow-xs'
                      : 'bg-white/10 hover:bg-white/15 border-white/10'
                  }`}
                >
                  <div className="w-4 h-4 rounded-full bg-indigo-600/20 text-indigo-800 dark:text-indigo-300 flex items-center justify-center text-[9px] font-black shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <div className={`flex-1 ${fontClasses.text} leading-relaxed text-slate-900 dark:text-slate-100 font-medium whitespace-pre-line`}>
                    {aim}
                  </div>
                  <button
                    onClick={() => handleRemoveAim(idx)}
                    className="opacity-0 group-hover:opacity-100 p-0.5 text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-300 transition-all shrink-0 cursor-pointer"
                    title="Delete aim"
                    aria-label="Delete aim"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Quick Manual Add Input + Curriculum Shortcut */}
          <form onSubmit={handleAddAim} className="pt-2 border-t border-indigo-300/60 dark:border-white/10 flex items-center gap-1.5 shrink-0">
            <input
              type="text"
              value={newAimText}
              onChange={(e) => setNewAimText(e.target.value)}
              placeholder="Type custom aim or click Browse LK20 above..."
              className={`flex-1 px-3 py-1.5 text-xs rounded-xl border focus:outline-none transition-colors ${
                isLight
                  ? 'bg-white border-slate-300 text-slate-900 focus:border-indigo-600'
                  : 'bg-white/10 border-white/20 text-white focus:border-indigo-400'
              }`}
            />
            <button
              type="submit"
              disabled={!newAimText.trim()}
              className="px-3 py-1.5 rounded-xl bg-indigo-700 hover:bg-indigo-600 disabled:opacity-40 text-white text-xs font-bold flex items-center gap-1 shadow-xs transition-all shrink-0 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Add</span>
            </button>
          </form>
        </div>
      </div>

      {/* Curriculum Aims Browser Modal */}
      <CurriculumAimsModal
        isOpen={isCurriculumModalOpen}
        onClose={() => setIsCurriculumModalOpen(false)}
        currentAims={aims}
        onToggleAim={handleToggleCurriculumAim}
      />
    </div>
  );
};
