import React, { useState } from 'react';
import {
  Users,
  Shuffle,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  Edit3,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ClassRoster } from '../../types';
import { useTheme } from '../../context/ThemeContext';

interface GroupMakerWidgetProps {
  roster: string[];
  classes: ClassRoster[];
  activeClassId: string;
  onSelectClass: (id: string) => void;
  onSaveClasses: (classes: ClassRoster[], newId?: string) => void;
  onClose?: () => void;
}

export const GroupMakerWidget: React.FC<GroupMakerWidgetProps> = ({
  roster,
  classes,
  activeClassId,
  onSelectClass,
  onSaveClasses,
}) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const currentClass = classes.find((c) => c.id === activeClassId) || classes[0];
  const allStudents = currentClass?.students || roster || [];

  const [groupCount, setGroupCount] = useState<number>(4);
  const [createdGroups, setCreatedGroups] = useState<string[][]>([]);
  const [copied, setCopied] = useState(false);

  // Group generation logic
  const handleGenerateGroups = () => {
    if (allStudents.length === 0) return;

    const shuffled = [...allStudents].sort(() => Math.random() - 0.5);
    const numGroups = Math.max(1, Math.min(groupCount, allStudents.length));
    const result: string[][] = Array.from({ length: numGroups }, () => []);

    shuffled.forEach((student, index) => {
      result[index % numGroups].push(student);
    });

    setCreatedGroups(result);

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch {}
  };

  const handleCopyGroups = () => {
    if (createdGroups.length === 0) return;
    const text = createdGroups
      .map((grp, i) => `Group ${i + 1}:\n${grp.map((s) => `• ${s}`).join('\n')}`)
      .join('\n\n');

    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full justify-between gap-2.5">
      {/* Top: Controls */}
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

        {/* Group Count Selector */}
        <div className="flex items-center gap-1">
          <span className="text-[11px] font-bold text-slate-400">Groups:</span>
          <select
            value={groupCount}
            onChange={(e) => setGroupCount(Number(e.target.value))}
            className={`px-2 py-1.5 text-xs font-bold rounded-xl border focus:outline-none ${
              isLight
                ? 'bg-slate-50 border-slate-300 text-slate-800'
                : 'bg-white/5 border-white/10 text-white'
            }`}
          >
            {[2, 3, 4, 5, 6, 7, 8].map((n) => (
              <option key={n} value={n} className="text-slate-900 bg-white">
                {n}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Group Display Area */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-2 min-h-0">
        {createdGroups.length === 0 ? (
          <div className="h-32 flex flex-col items-center justify-center text-center p-3 text-slate-400">
            <Users className="w-8 h-8 mb-1.5 opacity-50" />
            <span className="text-xs font-bold">No groups created yet</span>
            <span className="text-[10px] text-slate-400 mt-0.5">
              Click "Generate Groups" to randomly sort {allStudents.length} students.
            </span>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {createdGroups.map((group, idx) => (
              <div
                key={idx}
                className={`p-2.5 rounded-2xl border transition-all ${
                  isLight
                    ? 'bg-slate-50 border-slate-200'
                    : 'bg-white/5 border-white/10'
                }`}
              >
                <div className="flex items-center justify-between pb-1 mb-1 border-b border-slate-200 dark:border-white/10">
                  <span className="text-[11px] font-black text-cyan-600 dark:text-cyan-400">
                    Group {idx + 1}
                  </span>
                  <span className="text-[9px] font-semibold text-slate-400">
                    {group.length} students
                  </span>
                </div>
                <ul className="space-y-1">
                  {group.map((student, sIdx) => (
                    <li
                      key={sIdx}
                      className="text-xs font-medium truncate text-slate-700 dark:text-slate-200"
                    >
                      • {student}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 pt-1">
        <button
          onClick={handleGenerateGroups}
          disabled={allStudents.length === 0}
          className="flex-1 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-600 to-sky-600 hover:from-cyan-500 hover:to-sky-500 disabled:opacity-40 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-600/20 transition-all"
        >
          <Shuffle className="w-4 h-4" />
          <span>{createdGroups.length > 0 ? 'Re-shuffle Groups' : 'Generate Groups'}</span>
        </button>

        {createdGroups.length > 0 && (
          <button
            onClick={handleCopyGroups}
            className={`p-2.5 rounded-2xl border transition-all ${
              isLight
                ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
                : 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-200'
            }`}
            title="Copy groups to clipboard"
          >
            {copied ? (
              <Check className="w-4 h-4 text-emerald-500" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
        )}
      </div>
    </div>
  );
};
