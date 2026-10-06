import React, { useState } from 'react';
import { Tv, Edit2, Check, X, Sparkles } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface YouTubeWidgetProps {
  youtubeUrl?: string;
  youtubeTitle?: string;
  onUpdate: (url: string, title: string) => void;
  onClose: () => void;
}

function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

export const YouTubeWidget: React.FC<YouTubeWidgetProps> = ({
  youtubeUrl = '',
  youtubeTitle = 'Classroom Video',
  onUpdate,
  onClose,
}) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const [isEditing, setIsEditing] = useState(!youtubeUrl);
  const [urlDraft, setUrlDraft] = useState(youtubeUrl);
  const [titleDraft, setTitleDraft] = useState(youtubeTitle);

  const videoId = extractYouTubeId(youtubeUrl);

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    onUpdate(urlDraft.trim(), titleDraft.trim() || 'Classroom Video');
    setIsEditing(false);
  };

  return (
    <div
      className={`h-full flex flex-col rounded-3xl border shadow-xl backdrop-blur-md p-4 transition-all overflow-hidden ${
        isLight
          ? 'bg-white/90 border-slate-200/90 text-slate-800'
          : 'bg-slate-900/85 border-white/10 text-slate-100'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200 dark:border-white/10">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-6 h-6 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center shrink-0">
            <Tv className="w-3.5 h-3.5" />
          </div>
          <span className="font-bold text-xs sm:text-sm truncate">
            {youtubeTitle || 'Classroom Video'}
          </span>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-white"
            title="Edit video URL"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-white"
            title="Close video widget"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Editing View */}
      {isEditing ? (
        <form onSubmit={handleSave} className="flex-1 flex flex-col justify-between py-1">
          <div className="space-y-3">
            <div>
              <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                Video Title
              </label>
              <input
                type="text"
                value={titleDraft}
                onChange={(e) => setTitleDraft(e.target.value)}
                placeholder="Title..."
                className={`w-full px-3 py-1.5 text-xs rounded-xl border focus:outline-none ${
                  isLight
                    ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-red-500'
                    : 'bg-white/5 border-white/10 text-white focus:border-red-400'
                }`}
              />
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                YouTube URL
              </label>
              <input
                type="text"
                value={urlDraft}
                onChange={(e) => setUrlDraft(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className={`w-full px-3 py-1.5 text-xs rounded-xl border focus:outline-none ${
                  isLight
                    ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-red-500'
                    : 'bg-white/5 border-white/10 text-white focus:border-red-400'
                }`}
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            {youtubeUrl && (
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-3 py-1 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={!urlDraft.trim()}
              className="px-3 py-1.5 bg-red-600 hover:bg-red-500 disabled:opacity-40 text-white text-xs font-bold rounded-xl flex items-center gap-1 shadow-sm transition-colors"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Embed Video</span>
            </button>
          </div>
        </form>
      ) : videoId ? (
        <div className="relative flex-1 w-full rounded-2xl overflow-hidden bg-black shadow-inner min-h-[160px]">
          <iframe
            className="absolute inset-0 w-full h-full"
            src={`https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0&modestbranding=1`}
            title={youtubeTitle}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      ) : (
        <div
          onClick={() => setIsEditing(true)}
          className="flex-1 flex flex-col items-center justify-center p-4 border border-dashed rounded-2xl cursor-pointer hover:border-red-400 transition-colors text-slate-400"
        >
          <Sparkles className="w-6 h-6 mb-1 text-red-400" />
          <span className="text-xs font-semibold">Click to add YouTube video</span>
        </div>
      )}
    </div>
  );
};
