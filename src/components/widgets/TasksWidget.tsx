import React, { useState } from 'react';
import {
  CheckSquare,
  Plus,
  Trash2,
  X,
  CheckCircle2,
  Circle,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { LessonPage, TaskItem, FontSizeScale, WidgetSizeConfig } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import { FontSizeControl, getFontSizeClasses } from './FontSizeControl';

interface TasksWidgetProps {
  page: LessonPage;
  onUpdate: (fields: Partial<LessonPage>) => void;
  onStartTimerForTask?: (minutes?: number) => void;
  onClose: () => void;
  size?: WidgetSizeConfig;
  onResizeWidget?: (size: Partial<WidgetSizeConfig>) => void;
}

export const TasksWidget: React.FC<TasksWidgetProps> = ({
  page,
  onUpdate,
  onClose,
  size,
  onResizeWidget,
}) => {
  const { theme, highContrast } = useTheme();
  const isLight = theme === 'light';

  const [newTaskText, setNewTaskText] = useState('');

  const tasks: TaskItem[] = page.tasks || [];
  const completedCount = tasks.filter((t) => t.completed).length;
  const progressPercent = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  const currentFontSize: FontSizeScale =
    size?.fontSize || page.widgetSizes?.['tasks']?.fontSize || page.globalFontSize || 'md';

  const fontClasses = getFontSizeClasses(currentFontSize);

  const handleFontSizeChange = (newSize: FontSizeScale) => {
    if (onResizeWidget) {
      onResizeWidget({ fontSize: newSize });
    } else {
      const currentSizes = page.widgetSizes || {};
      onUpdate({
        widgetSizes: {
          ...currentSizes,
          tasks: { ...(currentSizes.tasks || {}), fontSize: newSize },
        },
      });
    }
  };

  const handleToggleTask = (taskId: string) => {
    const updated = tasks.map((t) => {
      if (t.id === taskId) {
        const nextCompleted = !t.completed;
        if (nextCompleted && completedCount + 1 === tasks.length) {
          try {
            confetti({
              particleCount: 80,
              spread: 60,
              origin: { y: 0.6 },
            });
          } catch {
            // ignore
          }
        }
        return { ...t, completed: nextCompleted };
      }
      return t;
    });
    onUpdate({ tasks: updated });
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;

    const newTask: TaskItem = {
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      text: newTaskText.trim(),
      completed: false,
    };

    onUpdate({ tasks: [...tasks, newTask] });
    setNewTaskText('');
  };

  const handleDeleteTask = (taskId: string) => {
    onUpdate({ tasks: tasks.filter((t) => t.id !== taskId) });
  };

  return (
    <div
      className={`h-full flex flex-col rounded-3xl border shadow-xl backdrop-blur-md p-5 transition-all overflow-hidden high-contrast-card ${
        highContrast
          ? isLight
            ? 'bg-white border-2 border-black text-black'
            : 'bg-black border-2 border-white text-white'
          : isLight
          ? 'bg-white/98 border-slate-300 text-slate-900 shadow-md'
          : 'bg-slate-900/95 border-white/20 text-slate-100 shadow-xl'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-300 dark:border-white/15">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 flex items-center justify-center shrink-0">
            <CheckSquare className="w-4 h-4 stroke-[2.5]" />
          </div>
          <div className="min-w-0">
            <h3 className="font-extrabold text-sm sm:text-base tracking-tight truncate text-slate-900 dark:text-white">
              Class Tasks
            </h3>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 font-medium truncate">
              {completedCount} of {tasks.length} items finished ({progressPercent}%)
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

      {/* Progress Bar */}
      <div className="mt-3 shrink-0">
        <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-white/15 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-600 to-sky-600 transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Tasks List */}
      <div className="flex-1 overflow-y-auto my-3 pr-1 space-y-2">
        {tasks.length === 0 ? (
          <div className="h-44 flex flex-col items-center justify-center text-center p-4 text-slate-600 dark:text-slate-300 font-medium">
            <Sparkles className="w-8 h-8 mb-2 text-indigo-500/60" />
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200">No tasks set</p>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
              Add bellringers, activities, or exit tickets below.
            </p>
          </div>
        ) : (
          tasks.map((task, index) => (
            <div
              key={task.id || `task-${index}`}
              className={`group flex items-center gap-2.5 p-3 rounded-2xl border transition-all ${
                task.completed
                  ? 'bg-emerald-500/15 border-emerald-500/30'
                  : isLight
                  ? 'bg-slate-50 hover:bg-slate-100 border-slate-300 text-slate-900 shadow-xs'
                  : 'bg-white/10 hover:bg-white/15 border-white/10 text-slate-100'
              }`}
            >
              <button
                onClick={() => handleToggleTask(task.id)}
                className="text-indigo-700 dark:text-indigo-300 hover:text-emerald-700 transition-colors shrink-0 cursor-pointer"
                title={task.completed ? 'Mark incomplete' : 'Mark completed'}
                aria-label={task.completed ? 'Mark incomplete' : 'Mark completed'}
              >
                {task.completed ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 stroke-[2.5]" />
                ) : (
                  <Circle className="w-4 h-4 text-slate-500 dark:text-slate-400 group-hover:text-indigo-600" />
                )}
              </button>

              <span
                className={`flex-1 ${fontClasses.text} leading-relaxed font-medium ${
                  task.completed ? 'line-through text-slate-500 dark:text-slate-400' : 'text-slate-900 dark:text-white'
                }`}
              >
                {task.text}
              </span>

              {/* Delete Task */}
              <button
                onClick={() => handleDeleteTask(task.id)}
                className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-300 transition-all shrink-0 cursor-pointer"
                title="Delete task"
                aria-label="Delete task"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Add Task Input Form */}
      <form
        onSubmit={handleAddTask}
        className="pt-2 border-t border-slate-300 dark:border-white/15 flex items-center gap-2 shrink-0"
      >
        <input
          type="text"
          value={newTaskText}
          onChange={(e) => setNewTaskText(e.target.value)}
          placeholder="New task or classroom activity..."
          className={`flex-1 px-3 py-2 text-xs rounded-xl border focus:outline-none transition-colors ${
            isLight
              ? 'bg-white border-slate-300 text-slate-900 focus:border-indigo-600 focus:bg-white'
              : 'bg-white/10 border-white/20 text-white focus:border-indigo-400 focus:bg-white/15'
          }`}
        />

        <button
          type="submit"
          disabled={!newTaskText.trim()}
          className="px-4 py-2 rounded-xl bg-indigo-700 hover:bg-indigo-600 disabled:opacity-40 text-white text-xs font-bold flex items-center gap-1 shadow-xs transition-all shrink-0 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Add</span>
        </button>
      </form>
    </div>
  );
};
