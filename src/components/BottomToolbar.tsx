import React, { useState } from 'react';
import {
  Target,
  CheckSquare,
  Link2,
  Tv,
  Image as ImageIcon,
  Hourglass,
  Users2,
  Users,
  FileImage,
  Volume2,
  Clock,
  Palette,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { WidgetVisibility } from '../types';
import { useTheme } from '../context/ThemeContext';

interface BottomToolbarProps {
  visibility: WidgetVisibility;
  onToggleWidget: (key: keyof WidgetVisibility) => void;
  onOpenBackgroundModal: () => void;
  onOpenLibrary: () => void;
}

export const BottomToolbar: React.FC<BottomToolbarProps> = ({
  visibility,
  onToggleWidget,
  onOpenBackgroundModal,
}) => {
  const { theme, highContrast } = useTheme();
  const isLight = theme === 'light';
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Widget toolbar items with WCAG 2.1 AA compliant contrast colors
  const tools = [
    {
      key: 'lessonInfo' as keyof WidgetVisibility,
      label: 'Aims',
      icon: Target,
      color: isLight ? 'text-sky-700' : 'text-sky-400',
      activeBg: 'bg-sky-600 text-white shadow-sky-600/30',
    },
    {
      key: 'tasks' as keyof WidgetVisibility,
      label: 'Tasks',
      icon: CheckSquare,
      color: isLight ? 'text-indigo-700' : 'text-indigo-400',
      activeBg: 'bg-indigo-600 text-white shadow-indigo-600/30',
    },
    {
      key: 'link' as keyof WidgetVisibility,
      label: 'Links',
      icon: Link2,
      color: isLight ? 'text-emerald-700' : 'text-emerald-400',
      activeBg: 'bg-emerald-600 text-white shadow-emerald-600/30',
    },
    {
      key: 'youtube' as keyof WidgetVisibility,
      label: 'Video',
      icon: Tv,
      color: isLight ? 'text-rose-700' : 'text-rose-400',
      activeBg: 'bg-rose-600 text-white shadow-rose-600/30',
    },
    {
      key: 'image' as keyof WidgetVisibility,
      label: 'Image',
      icon: ImageIcon,
      color: isLight ? 'text-teal-700' : 'text-teal-400',
      activeBg: 'bg-teal-600 text-white shadow-teal-600/30',
    },
    {
      key: 'timer' as keyof WidgetVisibility,
      label: 'Timer',
      icon: Hourglass,
      color: isLight ? 'text-amber-800' : 'text-amber-400',
      activeBg: 'bg-amber-600 text-white shadow-amber-600/30',
    },
    {
      key: 'randomizer' as keyof WidgetVisibility,
      label: 'Randomizer',
      icon: Users2,
      color: isLight ? 'text-purple-700' : 'text-purple-400',
      activeBg: 'bg-purple-600 text-white shadow-purple-600/30',
    },
    {
      key: 'groupMaker' as keyof WidgetVisibility,
      label: 'Groups',
      icon: Users,
      color: isLight ? 'text-cyan-800' : 'text-cyan-400',
      activeBg: 'bg-cyan-700 text-white shadow-cyan-700/30',
    },
    {
      key: 'textAndImage' as keyof WidgetVisibility,
      label: 'Text & Media',
      icon: FileImage,
      color: isLight ? 'text-blue-700' : 'text-blue-400',
      activeBg: 'bg-blue-600 text-white shadow-blue-600/30',
    },
    {
      key: 'soundLevel' as keyof WidgetVisibility,
      label: 'Sound Meter',
      icon: Volume2,
      color: isLight ? 'text-emerald-800' : 'text-emerald-400',
      activeBg: 'bg-emerald-700 text-white shadow-emerald-700/30',
    },
    {
      key: 'clock' as keyof WidgetVisibility,
      label: 'Clock',
      icon: Clock,
      color: isLight ? 'text-amber-800' : 'text-yellow-400',
      activeBg: 'bg-amber-600 text-white shadow-amber-600/30',
    },
  ];

  if (isCollapsed) {
    return (
      <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-40 transition-all">
        <button
          onClick={() => setIsCollapsed(false)}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full border shadow-xl backdrop-blur-md text-xs font-bold transition-all cursor-pointer ${
            isLight
              ? 'bg-white/98 border-slate-300 text-slate-900 hover:bg-slate-100 shadow-md'
              : 'bg-slate-900/95 border-white/20 text-white hover:bg-slate-800'
          }`}
          title="Expand classroom tools toolbar"
          aria-label="Expand classroom tools toolbar"
        >
          <ChevronUp className="w-4 h-4 text-sky-600 dark:text-sky-400 animate-bounce" />
          <span>Show Classroom Toolbar</span>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-40 max-w-[96vw] transition-all">
      <div
        className={`flex items-center gap-1 sm:gap-1.5 p-1.5 sm:p-2 rounded-2xl border shadow-2xl backdrop-blur-xl transition-all ${
          highContrast
            ? isLight
              ? 'bg-white border-2 border-black text-black'
              : 'bg-black border-2 border-white text-white'
            : isLight
            ? 'bg-white/98 border-slate-300 text-slate-900 shadow-xl'
            : 'bg-slate-900/95 border-white/20 text-slate-100 shadow-2xl'
        }`}
      >
        {/* Scrollable container for widgets */}
        <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto no-scrollbar max-w-[80vw] sm:max-w-none">
          {tools.map((tool) => {
            const isActive = !!visibility[tool.key];
            const Icon = tool.icon;

            return (
              <button
                key={tool.key}
                onClick={() => onToggleWidget(tool.key)}
                className={`relative flex flex-col items-center justify-center min-w-[52px] sm:min-w-[64px] min-h-[46px] py-1.5 px-2 rounded-xl text-[10px] sm:text-[11px] font-bold transition-all cursor-pointer ${
                  isActive
                    ? `${tool.activeBg} shadow-md`
                    : isLight
                    ? 'hover:bg-slate-100 text-slate-800'
                    : 'hover:bg-white/10 text-slate-200'
                }`}
                title={`Toggle ${tool.label}`}
                aria-label={`Toggle ${tool.label}`}
                aria-pressed={isActive}
              >
                <Icon
                  className={`w-4 h-4 sm:w-5 sm:h-5 mb-0.5 ${
                    isActive ? 'text-white' : tool.color
                  }`}
                />
                <span className="truncate max-w-[58px] leading-tight font-bold">
                  {tool.label}
                </span>

                {/* Active indicator dot with contrast ring */}
                {isActive && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 border-2 border-slate-900 rounded-full" />
                )}
              </button>
            );
          })}
        </div>

        {/* Separator */}
        <div className="h-7 w-[1px] bg-slate-300 dark:bg-white/20 mx-1 shrink-0" />

        {/* Wallpaper Picker Button */}
        <button
          onClick={onOpenBackgroundModal}
          className={`flex flex-col items-center justify-center min-w-[52px] sm:min-w-[64px] min-h-[46px] py-1.5 px-2 rounded-xl text-[10px] sm:text-[11px] font-bold transition-all shrink-0 cursor-pointer ${
            isLight
              ? 'hover:bg-slate-100 text-slate-800'
              : 'hover:bg-white/10 text-slate-200'
          }`}
          title="Change wallpaper background"
          aria-label="Change wallpaper background"
        >
          <Palette className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 dark:text-amber-400 mb-0.5" />
          <span className="truncate max-w-[58px] leading-tight font-bold">
            Wallpaper
          </span>
        </button>

        {/* Hide / Collapse Strip Button */}
        <button
          onClick={() => setIsCollapsed(true)}
          className={`flex flex-col items-center justify-center p-1.5 rounded-xl text-[10px] font-semibold transition-all shrink-0 cursor-pointer ${
            isLight
              ? 'hover:bg-slate-100 text-slate-600 hover:text-slate-900'
              : 'hover:bg-white/10 text-slate-300 hover:text-white'
          }`}
          title="Hide toolbar strip"
          aria-label="Hide toolbar strip"
        >
          <ChevronDown className="w-4 h-4" />
          <span className="text-[9px] leading-none">Hide</span>
        </button>
      </div>
    </div>
  );
};
