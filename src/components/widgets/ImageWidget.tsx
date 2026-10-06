import React, { useState, useRef } from 'react';
import { Image as ImageIcon, Edit2, Upload, Check, X, Sparkles, Maximize2 } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { WidgetSizeConfig } from '../../types';

interface ImageWidgetProps {
  imageUrl?: string;
  imageCaption?: string;
  onUpdate: (url: string, caption: string) => void;
  onClose: () => void;
  size?: WidgetSizeConfig;
  onResizeWidget?: (size: Partial<WidgetSizeConfig>) => void;
}

const PRESET_CHARTS = [
  {
    name: 'Scientific Method',
    url: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1200&q=80',
    caption: 'Scientific Method & Observation Framework',
  },
  {
    name: 'Cell Biology / Microscope',
    url: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=1200&q=80',
    caption: 'Cell Structure & Microscopic Specimen',
  },
  {
    name: 'Solar System Planetary',
    url: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=1200&q=80',
    caption: 'Planetary Orbit & Gravitational Equilibrium',
  },
];

export const ImageWidget: React.FC<ImageWidgetProps> = ({
  imageUrl = '',
  imageCaption = '',
  onUpdate,
  onClose,
}) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const [isEditing, setIsEditing] = useState(!imageUrl);
  const [urlDraft, setUrlDraft] = useState(imageUrl);
  const [captionDraft, setCaptionDraft] = useState(imageCaption);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    onUpdate(urlDraft.trim(), captionDraft.trim());
    setIsEditing(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setUrlDraft(result);
        onUpdate(result, captionDraft || file.name);
        setIsEditing(false);
      };
      reader.readAsDataURL(file);
    }
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
          <div className="w-6 h-6 rounded-lg bg-teal-500/10 text-teal-500 flex items-center justify-center shrink-0">
            <ImageIcon className="w-3.5 h-3.5" />
          </div>
          <span className="font-bold text-xs sm:text-sm truncate">
            {imageCaption || 'Classroom Diagram'}
          </span>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {imageUrl && !isEditing && (
            <button
              onClick={() => setIsFullscreen(true)}
              className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-white"
              title="View full screen image"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-white"
            title="Change image"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-white"
            title="Close image widget"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Editing State */}
      {isEditing ? (
        <form onSubmit={handleSave} className="flex-1 flex flex-col justify-between py-1">
          <div className="space-y-2">
            <div>
              <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                Image Caption / Title
              </label>
              <input
                type="text"
                value={captionDraft}
                onChange={(e) => setCaptionDraft(e.target.value)}
                placeholder="Caption..."
                className={`w-full px-3 py-1.5 text-xs rounded-xl border focus:outline-none ${
                  isLight
                    ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-teal-500'
                    : 'bg-white/5 border-white/10 text-white focus:border-teal-400'
                }`}
              />
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                Image URL
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={urlDraft}
                  onChange={(e) => setUrlDraft(e.target.value)}
                  placeholder="https://..."
                  className={`flex-1 px-3 py-1.5 text-xs rounded-xl border focus:outline-none ${
                    isLight
                      ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-teal-500'
                      : 'bg-white/5 border-white/10 text-white focus:border-teal-400'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-2.5 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1 text-slate-500 hover:text-slate-900 dark:hover:text-white"
                  title="Upload from device"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Upload</span>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
            </div>

            {/* Quick Chart Presets */}
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                Presets
              </span>
              <div className="flex flex-wrap gap-1.5">
                {PRESET_CHARTS.map((p) => (
                  <button
                    key={p.name}
                    type="button"
                    onClick={() => {
                      setUrlDraft(p.url);
                      setCaptionDraft(p.caption);
                      onUpdate(p.url, p.caption);
                      setIsEditing(false);
                    }}
                    className="px-2 py-0.5 text-[10px] rounded bg-teal-500/10 text-teal-600 dark:text-teal-400 font-semibold hover:bg-teal-500/20"
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            {imageUrl && (
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
              className="px-3 py-1.5 bg-teal-600 hover:bg-teal-500 disabled:opacity-40 text-white text-xs font-bold rounded-xl flex items-center gap-1 shadow-sm transition-colors"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Apply Image</span>
            </button>
          </div>
        </form>
      ) : imageUrl ? (
        <div className="relative flex-1 w-full rounded-2xl overflow-hidden bg-slate-950/20 flex flex-col justify-center items-center group">
          <img
            src={imageUrl}
            alt={imageCaption || 'Classroom diagram'}
            className="w-full h-full object-contain rounded-2xl transition-transform group-hover:scale-[1.01]"
          />
          {imageCaption && (
            <div className="absolute bottom-0 inset-x-0 bg-slate-950/80 backdrop-blur-sm px-3 py-1.5 text-center text-[11px] text-white font-medium truncate">
              {imageCaption}
            </div>
          )}
        </div>
      ) : (
        <div
          onClick={() => setIsEditing(true)}
          className="flex-1 flex flex-col items-center justify-center p-4 border border-dashed rounded-2xl cursor-pointer hover:border-teal-400 transition-colors text-slate-400"
        >
          <Sparkles className="w-6 h-6 mb-1 text-teal-400" />
          <span className="text-xs font-semibold">Click to add classroom image</span>
        </div>
      )}

      {/* Fullscreen Lightbox Modal */}
      {isFullscreen && (
        <div
          onClick={() => setIsFullscreen(false)}
          className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6 cursor-zoom-out animate-in fade-in"
        >
          <button
            onClick={() => setIsFullscreen(false)}
            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 text-white rounded-xl"
          >
            <X className="w-5 h-5" />
          </button>
          <img
            src={imageUrl}
            alt={imageCaption}
            className="max-w-[92vw] max-h-[85vh] object-contain rounded-2xl shadow-2xl"
          />
          {imageCaption && (
            <p className="text-white font-bold text-base mt-4 text-center max-w-2xl bg-black/50 px-4 py-2 rounded-xl backdrop-blur-sm">
              {imageCaption}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
