import React, { useState } from 'react';
import {
  FileImage,
  Columns,
  Rows,
  AlignLeft,
  Image as ImageIcon,
  Upload,
  Edit2,
  Check,
  Maximize2,
  Bold,
  List,
} from 'lucide-react';
import { TextAndImageData, FontSizeScale } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import { FontSizeControl, getFontSizeClasses } from './FontSizeControl';

interface TextAndImageWidgetProps {
  data?: TextAndImageData;
  onUpdate: (data: Partial<TextAndImageData>) => void;
  onResizeWidget?: (w: number, h: number) => void;
  onClose?: () => void;
  fontSize?: FontSizeScale;
  onFontSizeChange?: (size: FontSizeScale) => void;
}

export const TextAndImageWidget: React.FC<TextAndImageWidgetProps> = ({
  data,
  onUpdate,
  fontSize = 'md',
  onFontSizeChange,
}) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const [isEditingText, setIsEditingText] = useState(false);
  const [textDraft, setTextDraft] = useState(
    data?.text ||
      '### Lesson Notes\n• Key concept 1\n• Inquiry observation 2\n• Essential question: How does energy transfer through ecosystems?'
  );
  const [imageUrlDraft, setImageUrlDraft] = useState(
    data?.imageUrl ||
      'https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=800&q=80'
  );
  const [layout, setLayout] = useState<'split' | 'stacked' | 'text-only' | 'image-only'>(
    (data?.layout as any) || 'split'
  );
  const [localFontSize, setLocalFontSize] = useState<FontSizeScale>(fontSize);

  const fontClasses = getFontSizeClasses(localFontSize);

  const handleFontSizeUpdate = (newSize: FontSizeScale) => {
    setLocalFontSize(newSize);
    if (onFontSizeChange) {
      onFontSizeChange(newSize);
    }
  };

  const handleSaveText = () => {
    onUpdate({ text: textDraft, layout });
    setIsEditingText(false);
  };

  const handleLayoutChange = (newLayout: 'split' | 'stacked' | 'text-only' | 'image-only') => {
    setLayout(newLayout);
    onUpdate({ layout: newLayout });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setImageUrlDraft(result);
        onUpdate({ imageUrl: result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col h-full justify-between gap-2 overflow-hidden">
      {/* Mini control toolbar */}
      <div className="flex items-center justify-between pb-1 border-b border-slate-200 dark:border-white/10 shrink-0">
        <div className="flex items-center gap-1">
          <button
            onClick={() => handleLayoutChange('split')}
            className={`p-1 rounded-lg text-xs font-semibold ${
              layout === 'split'
                ? 'bg-blue-500 text-white'
                : 'text-slate-400 hover:text-slate-700 dark:hover:text-white'
            }`}
            title="Split side-by-side"
          >
            <Columns className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => handleLayoutChange('stacked')}
            className={`p-1 rounded-lg text-xs font-semibold ${
              layout === 'stacked'
                ? 'bg-blue-500 text-white'
                : 'text-slate-400 hover:text-slate-700 dark:hover:text-white'
            }`}
            title="Stacked vertical"
          >
            <Rows className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => handleLayoutChange('text-only')}
            className={`p-1 rounded-lg text-xs font-semibold ${
              layout === 'text-only'
                ? 'bg-blue-500 text-white'
                : 'text-slate-400 hover:text-slate-700 dark:hover:text-white'
            }`}
            title="Text only"
          >
            <AlignLeft className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => handleLayoutChange('image-only')}
            className={`p-1 rounded-lg text-xs font-semibold ${
              layout === 'image-only'
                ? 'bg-blue-500 text-white'
                : 'text-slate-400 hover:text-slate-700 dark:hover:text-white'
            }`}
            title="Image only"
          >
            <ImageIcon className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex items-center gap-1.5">
          <FontSizeControl fontSize={localFontSize} onChange={handleFontSizeUpdate} />
          <label className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer" title="Change Image">
            <Upload className="w-3.5 h-3.5" />
            <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
          </label>
          <button
            onClick={() => setIsEditingText(!isEditingText)}
            className={`p-1 rounded-lg ${
              isEditingText ? 'text-blue-500' : 'text-slate-400 hover:text-slate-700 dark:hover:text-white'
            }`}
            title="Edit text"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div
        className={`flex-1 overflow-hidden gap-3 ${
          layout === 'split'
            ? 'flex flex-row'
            : layout === 'stacked'
            ? 'flex flex-col'
            : 'flex'
        }`}
      >
        {/* Text Pane */}
        {layout !== 'image-only' && (
          <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
            {isEditingText ? (
              <div className="flex-1 flex flex-col justify-between">
                <textarea
                  value={textDraft}
                  onChange={(e) => setTextDraft(e.target.value)}
                  className={`w-full flex-1 p-2 ${fontClasses.text} rounded-xl border focus:outline-none resize-none font-mono ${
                    isLight
                      ? 'bg-white border-blue-400 text-slate-900'
                      : 'bg-slate-800 border-blue-400 text-white'
                  }`}
                  placeholder="Enter classroom notes, questions, or instructions..."
                />
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={handleSaveText}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold flex items-center gap-1"
                  >
                    <Check className="w-3 h-3" /> Save Notes
                  </button>
                </div>
              </div>
            ) : (
              <div className={`prose prose-sm dark:prose-invert max-w-none ${fontClasses.text} leading-relaxed overflow-y-auto whitespace-pre-wrap`}>
                {data?.text || textDraft}
              </div>
            )}
          </div>
        )}

        {/* Image Pane */}
        {layout !== 'text-only' && (
          <div className="flex-1 flex items-center justify-center overflow-hidden rounded-2xl bg-black/10 relative">
            <img
              src={data?.imageUrl || imageUrlDraft}
              alt="Classroom media"
              className="w-full h-full object-cover rounded-2xl"
            />
          </div>
        )}
      </div>
    </div>
  );
};
