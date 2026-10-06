import React, { useState } from 'react';
import {
  Link2,
  ExternalLink,
  Plus,
  Copy,
  Check,
  Trash2,
  QrCode,
  X,
  Globe,
  Sparkles,
} from 'lucide-react';
import { LessonPage, QuickLinkItem, WidgetSizeConfig, FontSizeScale } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import { FontSizeControl, getFontSizeClasses } from './FontSizeControl';

interface LinkWidgetProps {
  page: LessonPage;
  onUpdate: (fields: Partial<LessonPage>) => void;
  onClose: () => void;
  size?: WidgetSizeConfig;
  onResizeWidget?: (size: Partial<WidgetSizeConfig>) => void;
}

export const LinkWidget: React.FC<LinkWidgetProps> = ({
  page,
  onUpdate,
  onClose,
  size,
  onResizeWidget,
}) => {
  const { theme, highContrast } = useTheme();
  const isLight = theme === 'light';

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeQrUrl, setActiveQrUrl] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');

  const links: QuickLinkItem[] =
    page.links && page.links.length > 0
      ? page.links
      : page.linkUrl
      ? [{ id: 'link-main', title: page.linkTitle || 'Class Resource', url: page.linkUrl }]
      : [];

  const currentFontSize: FontSizeScale =
    size?.fontSize || page.widgetSizes?.['link']?.fontSize || page.globalFontSize || 'md';

  const fontClasses = getFontSizeClasses(currentFontSize);

  const handleFontSizeChange = (newSize: FontSizeScale) => {
    if (onResizeWidget) {
      onResizeWidget({ fontSize: newSize });
    } else {
      const currentSizes = page.widgetSizes || {};
      onUpdate({
        widgetSizes: {
          ...currentSizes,
          link: { ...(currentSizes.link || {}), fontSize: newSize },
        },
      });
    }
  };

  const handleCopy = (id: string, url: string) => {
    navigator.clipboard.writeText(url).catch(() => {});
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const handleAddLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl.trim()) return;

    let formattedUrl = newUrl.trim();
    if (!/^https?:\/\//i.test(formattedUrl)) {
      formattedUrl = `https://${formattedUrl}`;
    }

    let titleFallback = 'Web Resource';
    try {
      titleFallback = new URL(formattedUrl).hostname;
    } catch {
      titleFallback = formattedUrl;
    }

    const item: QuickLinkItem = {
      id: `link-${Date.now()}`,
      title: newTitle.trim() || titleFallback,
      url: formattedUrl,
    };

    const updated = [...links, item];
    onUpdate({
      links: updated,
      linkUrl: formattedUrl,
      linkTitle: item.title,
    });

    setNewTitle('');
    setNewUrl('');
  };

  const handleDeleteLink = (id: string) => {
    const updated = links.filter((l) => l.id !== id);
    onUpdate({
      links: updated,
      linkUrl: updated[0]?.url || '',
      linkTitle: updated[0]?.title || '',
    });
  };

  return (
    <div
      className={`h-full flex flex-col rounded-3xl border shadow-xl backdrop-blur-md p-5 transition-all relative overflow-hidden high-contrast-card ${
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
          <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0">
            <Link2 className="w-4 h-4 stroke-[2.5]" />
          </div>
          <div className="min-w-0">
            <h3 className="font-extrabold text-sm sm:text-base tracking-tight truncate text-slate-900 dark:text-white">
              Links
            </h3>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 font-medium truncate">
              Web links & scan codes for students
            </p>
          </div>
        </div>

        {/* Font Size & Close */}
        <div className="flex items-center gap-1.5 shrink-0">
          <FontSizeControl fontSize={currentFontSize} onChange={handleFontSizeChange} />

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
            title="Close widget"
            aria-label="Close widget"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* QR Code Popover Overlay */}
      {activeQrUrl && (
        <div className="my-2 p-3.5 rounded-2xl bg-slate-950 text-white flex flex-col items-center justify-center animate-in fade-in duration-200 shadow-xl border-2 border-white/20 shrink-0">
          <div className="flex items-center justify-between w-full pb-2 mb-2 border-b border-white/15">
            <span className="text-xs font-bold text-white truncate max-w-[200px]">
              Scan to open: {activeQrUrl}
            </span>
            <button
              onClick={() => setActiveQrUrl(null)}
              className="p-1 text-slate-300 hover:text-white rounded cursor-pointer"
              aria-label="Close QR code"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="bg-white p-3 rounded-xl shadow-lg border border-slate-200">
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(
                activeQrUrl
              )}`}
              alt="QR Code"
              className="w-32 h-32"
            />
          </div>
          <span className="text-[11px] text-slate-300 font-medium mt-2">
            Students scan with camera on phones or tablets
          </span>
        </div>
      )}

      {/* Links List */}
      <div className="flex-1 overflow-y-auto my-2 pr-1 space-y-2">
        {links.length === 0 ? (
          <div className="h-44 flex flex-col items-center justify-center text-center p-4 text-slate-600 dark:text-slate-300 font-medium">
            <Sparkles className="w-8 h-8 mb-2 text-emerald-600/60" />
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200">No links added</p>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
              Paste a URL below to share with your class.
            </p>
          </div>
        ) : (
          links.map((link) => (
            <div
              key={link.id}
              className={`group flex items-center justify-between gap-3 p-3 rounded-2xl border transition-all ${
                isLight
                  ? 'bg-slate-50 hover:bg-slate-100 border-slate-300 shadow-xs'
                  : 'bg-white/10 hover:bg-white/15 border-white/10'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0">
                  <Globe className="w-3.5 h-3.5 stroke-[2.5]" />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className={`${fontClasses.text} font-bold truncate text-slate-900 dark:text-white`}>
                    {link.title}
                  </h4>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 truncate font-mono">
                    {link.url}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => setActiveQrUrl(activeQrUrl === link.url ? null : link.url)}
                  className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-white/20 text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors cursor-pointer"
                  title="Show QR Code for students to scan"
                  aria-label="Show QR Code"
                >
                  <QrCode className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => handleCopy(link.id, link.url)}
                  className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-white/20 text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors cursor-pointer"
                  title="Copy link address"
                  aria-label="Copy link address"
                >
                  {copiedId === link.id ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 stroke-[3]" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>

                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-white/20 text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors"
                  title="Open in new tab"
                  aria-label="Open link in new tab"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <button
                  onClick={() => handleDeleteLink(link.id)}
                  className="p-1.5 rounded-lg hover:bg-rose-100 dark:hover:bg-rose-950/40 text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-300 transition-colors cursor-pointer"
                  title="Delete link"
                  aria-label="Delete link"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Link Input Form */}
      <form
        onSubmit={handleAddLink}
        className="pt-2 border-t border-slate-300 dark:border-white/15 flex flex-col gap-1.5 shrink-0"
      >
        <div className="flex items-center gap-1.5">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Link title (e.g. Kahoot, Google Doc)..."
            className={`flex-1 px-3 py-1.5 text-xs rounded-xl border focus:outline-none transition-colors ${
              isLight
                ? 'bg-white border-slate-300 text-slate-900 focus:border-emerald-600'
                : 'bg-white/10 border-white/20 text-white focus:border-emerald-400'
            }`}
          />
        </div>
        <div className="flex items-center gap-1.5">
          <input
            type="text"
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            placeholder="Paste URL (e.g. https://...)..."
            className={`flex-1 px-3 py-1.5 text-xs rounded-xl border focus:outline-none transition-colors ${
              isLight
                ? 'bg-white border-slate-300 text-slate-900 focus:border-emerald-600'
                : 'bg-white/10 border-white/20 text-white focus:border-emerald-400'
            }`}
          />
          <button
            type="submit"
            disabled={!newUrl.trim()}
            className="px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 disabled:opacity-40 text-white text-xs font-bold flex items-center gap-1 shadow-xs transition-all shrink-0 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Add</span>
          </button>
        </div>
      </form>
    </div>
  );
};
