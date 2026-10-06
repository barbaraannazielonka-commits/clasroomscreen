import React, { useState, useEffect } from 'react';
import {
  Users2,
  Sparkles,
  RotateCcw,
  UserCheck,
  Edit3,
  Check,
  X,
  Volume2,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ClassRoster } from '../../types';
import { useTheme } from '../../context/ThemeContext';

interface RandomizerWidgetProps {
  roster: string[];
  classes: ClassRoster[];
  activeClassId: string;
  onSelectClass: (id: string) => void;
  onSaveClasses: (classes: ClassRoster[], newId?: string) => void;
}

export const RandomizerWidget: React.FC<RandomizerWidgetProps> = ({
  roster,
  classes,
  activeClassId,
  onSelectClass,
  onSaveClasses,
}) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const [pickedStudent, setPickedStudent] = useState<string | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  const [displayRollName, setDisplayRollName] = useState('');
  const [pickedHistory, setPickedHistory] = useState<string[]>([]);
  const [excludeAlreadyPicked, setExcludeAlreadyPicked] = useState(true);

  // Edit Roster modal
  const [isEditingRoster, setIsEditingRoster] = useState(false);
  const [rosterDraft, setRosterDraft] = useState('');

  const currentClass = classes.find((c) => c.id === activeClassId) || classes[0];
  const allStudents = currentClass?.students || roster || [];

  // Eligible students
  const availableStudents = excludeAlreadyPicked
    ? allStudents.filter((s) => !pickedHistory.includes(s))
    : allStudents;

  const handlePickRandom = () => {
    if (allStudents.length === 0) return;

    const pool = availableStudents.length > 0 ? availableStudents : allStudents;
    if (availableStudents.length === 0) {
      setPickedHistory([]);
    }

    setIsRolling(true);
    let counter = 0;
    const maxTicks = 16;
    const intervalTime = 60;

    const interval = setInterval(() => {
      counter++;
      const randName = pool[Math.floor(Math.random() * pool.length)];
      setDisplayRollName(randName);

      if (counter >= maxTicks) {
        clearInterval(interval);
        const finalWinner = pool[Math.floor(Math.random() * pool.length)];
        setDisplayRollName(finalWinner);
        setPickedStudent(finalWinner);
        setIsRolling(false);
        setPickedHistory((prev) => [finalWinner, ...prev]);

        // Celebration confetti
        try {
          confetti({
            particleCount: 60,
            spread: 55,
            origin: { y: 0.6 },
          });
        } catch {}
      }
    }, intervalTime);
  };

  const handleOpenRosterEditor = () => {
    setRosterDraft(allStudents.join('\n'));
    setIsEditingRoster(true);
  };

  const handleSaveRosterEditor = () => {
    const parsed = rosterDraft
      .split(/[\n,]+/)
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, 30); // Max 30 students

    const updated = classes.map((c) =>
      c.id === currentClass.id ? { ...c, students: parsed } : c
    );
    onSaveClasses(updated);
    setIsEditingRoster(false);
  };

  return (
    <div className="flex flex-col h-full justify-between gap-2.5">
      {/* Top: Class Selector & Edit Roster button */}
      <div className="flex items-center justify-between gap-2">
        <select
          value={activeClassId}
          onChange={(e) => onSelectClass(e.target.value)}
          className={`flex-1 px-2.5 py-1.5 text-xs font-bold rounded-xl border focus:outline-none transition-colors ${
            isLight
              ? 'bg-slate-50 border-slate-300 text-slate-800'
              : 'bg-white/5 border-white/10 text-white'
          }`}
        >
          {classes.map((cls) => (
            <option key={cls.id} value={cls.id} className="text-slate-900 bg-white">
              {cls.name} ({cls.students.length} students)
            </option>
          ))}
        </select>

        <button
          onClick={handleOpenRosterEditor}
          className={`p-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1 transition-all ${
            isLight
              ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
              : 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-300'
          }`}
          title="Edit student names (up to 30)"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span className="text-[11px]">Roster</span>
        </button>
      </div>

      {/* Roster Edit Overlay */}
      {isEditingRoster ? (
        <div className="flex-1 flex flex-col justify-between py-1 animate-in fade-in">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold uppercase text-slate-400">
                Edit Roster (Max 30)
              </span>
              <span className="text-[10px] text-slate-400">
                1 name per line or comma-separated
              </span>
            </div>
            <textarea
              value={rosterDraft}
              onChange={(e) => setRosterDraft(e.target.value)}
              rows={4}
              className={`w-full p-2 text-xs rounded-xl border focus:outline-none ${
                isLight
                  ? 'bg-white border-sky-400 text-slate-900'
                  : 'bg-slate-800 border-sky-400 text-white'
              }`}
            />
          </div>
          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              onClick={() => setIsEditingRoster(false)}
              className="px-2.5 py-1 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveRosterEditor}
              className="px-3 py-1 bg-purple-600 text-white text-xs font-bold rounded-xl flex items-center gap-1"
            >
              <Check className="w-3 h-3" /> Save
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Main Stage: Roll Animation or Picked Student */}
          <div
            className={`flex-1 min-h-[90px] rounded-2xl border flex flex-col items-center justify-center p-3 text-center transition-all ${
              pickedStudent && !isRolling
                ? 'bg-purple-500/10 border-purple-500/30'
                : isLight
                ? 'bg-slate-50 border-slate-200'
                : 'bg-white/5 border-white/5'
            }`}
          >
            {isRolling ? (
              <div className="animate-pulse">
                <span className="text-xl sm:text-2xl font-black text-purple-600 dark:text-purple-400">
                  {displayRollName}
                </span>
                <span className="block text-[10px] text-slate-400 mt-0.5">
                  Selecting student...
                </span>
              </div>
            ) : pickedStudent ? (
              <div>
                <span className="text-[10px] font-bold uppercase text-purple-600 dark:text-purple-400 block mb-0.5">
                  Selected Student
                </span>
                <h4 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                  {pickedStudent}
                </h4>
              </div>
            ) : (
              <div className="text-slate-400 flex flex-col items-center">
                <Users2 className="w-7 h-7 mb-1 opacity-60" />
                <span className="text-xs font-bold">Ready to pick</span>
                <span className="text-[10px] text-slate-400">
                  {availableStudents.length} students in current pool
                </span>
              </div>
            )}
          </div>

          {/* Action Button: Pick Random Student */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePickRandom}
              disabled={isRolling || allStudents.length === 0}
              className="flex-1 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-40 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-purple-600/20 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isRolling ? 'Spinning...' : 'Pick Student'}</span>
            </button>

            {pickedHistory.length > 0 && (
              <button
                onClick={() => {
                  setPickedHistory([]);
                  setPickedStudent(null);
                }}
                className={`p-2.5 rounded-2xl border transition-all ${
                  isLight
                    ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-600'
                    : 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-300'
                }`}
                title="Reset picked history pool"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* History Pill Strip */}
          {pickedHistory.length > 0 && (
            <div className="text-[10px] flex items-center gap-1 overflow-x-auto no-scrollbar text-slate-400">
              <span className="font-bold shrink-0">Picked:</span>
              {pickedHistory.slice(0, 5).map((name, i) => (
                <span
                  key={i}
                  className="px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-600 dark:text-purple-300 truncate max-w-[85px] shrink-0"
                >
                  {name}
                </span>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};
