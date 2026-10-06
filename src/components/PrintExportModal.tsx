import React, { useState, useEffect } from 'react';
import {
  Printer,
  Download,
  X,
  CheckSquare,
  Target,
  Link2,
  FileText,
  Check,
  Layers,
  Sparkles,
  Info,
  ExternalLink,
} from 'lucide-react';
import { LessonPlan, LessonPage } from '../types';
import { useTheme } from '../context/ThemeContext';
import {
  downloadLessonPdf,
  generateLessonPdfBlob,
  PdfExportOptions,
} from '../utils/pdfExport';

interface PrintExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  lesson: LessonPlan;
  activePageIndex: number;
}

export const PrintExportModal: React.FC<PrintExportModalProps> = ({
  isOpen,
  onClose,
  lesson,
  activePageIndex,
}) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const [exportScope, setExportScope] = useState<'current' | 'all'>('current');
  const [statusMessage, setStatusMessage] = useState<{
    text: string;
    type: 'success' | 'info';
  } | null>(null);

  const [includeNotes, setIncludeNotes] = useState(true);
  const [includeLinks, setIncludeLinks] = useState(true);
  const [includeTasks, setIncludeTasks] = useState(true);
  const [includeObjectives, setIncludeObjectives] = useState(true);

  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);
  const [pdfFilename, setPdfFilename] = useState<string>('LessonFlow_Lesson_Plan.pdf');

  if (!isOpen) return null;

  const pagesToPrint: LessonPage[] =
    exportScope === 'current'
      ? [lesson.pages[activePageIndex] || lesson.pages[0]]
      : lesson.pages;

  const exportOptions: PdfExportOptions = {
    includeObjectives,
    includeTasks,
    includeLinks,
    includeNotes,
  };

  // Pre-generate live PDF blob URL whenever options or pages change
  useEffect(() => {
    try {
      const { blobUrl, filename } = generateLessonPdfBlob(lesson, pagesToPrint, exportOptions);
      setPdfBlobUrl(blobUrl);
      setPdfFilename(filename);
      return () => {
        if (blobUrl) {
          try {
            URL.revokeObjectURL(blobUrl);
          } catch {}
        }
      };
    } catch (err) {
      console.warn('PDF blob preparation error:', err);
    }
  }, [lesson, pagesToPrint, exportOptions]);

  // 1. SAVE AS PDF (100% Reliable Native Browser Download)
  const handleSaveAsPdf = () => {
    try {
      const res = downloadLessonPdf(lesson, pagesToPrint, exportOptions);
      setStatusMessage({
        text: `✓ PDF saved to your downloads: "${res.filename}"`,
        type: 'success',
      });
      setTimeout(() => setStatusMessage(null), 5000);
    } catch (err) {
      console.error('PDF download error:', err);
      // Fallback: If blobUrl is available, open or click directly
      if (pdfBlobUrl) {
        const tempLink = document.createElement('a');
        tempLink.href = pdfBlobUrl;
        tempLink.download = pdfFilename;
        tempLink.click();
        setStatusMessage({
          text: `✓ PDF downloaded via browser link: "${pdfFilename}"`,
          type: 'success',
        });
      } else {
        setStatusMessage({
          text: 'Error generating PDF. Please try again.',
          type: 'info',
        });
      }
    }
  };

  // 2. PRINT SHEET (Native synchronous window.print + fallback)
  const handlePrintSheet = () => {
    try {
      // Direct synchronous window.print() inside user interaction context
      window.print();
      setStatusMessage({
        text: '✓ System print dialog opened! Select your printer or choose "Save as PDF".',
        type: 'success',
      });
      setTimeout(() => setStatusMessage(null), 6000);
    } catch (err) {
      console.warn('Print dialog error:', err);
      // Fallback: trigger PDF download immediately
      handleSaveAsPdf();
      setStatusMessage({
        text: 'Printer blocked by browser environment — downloading PDF directly instead!',
        type: 'info',
      });
    }
  };

  return (
    <div
      id="print-modal-container"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-md animate-in fade-in duration-200 select-none print:p-0 print:bg-white print:fixed print:inset-0"
    >
      <div
        className={`w-full max-w-4xl max-h-[92vh] flex flex-col rounded-3xl border shadow-2xl overflow-hidden transition-colors ${
          isLight
            ? 'bg-white text-slate-800 border-slate-300'
            : 'bg-slate-900 text-slate-100 border-white/20'
        }`}
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-4 border-b border-slate-200 dark:border-white/10 shrink-0 print:hidden">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-sky-500/10 text-sky-500 flex items-center justify-center shrink-0">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black tracking-tight">
                Print & Export Lesson Plan
              </h2>
              <p className="text-xs text-slate-400">
                Direct PDF download and printer output for student handouts
              </p>
            </div>
          </div>

          {/* Action Buttons: Save as PDF & Print Sheet */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Direct Native PDF Download Anchor / Button */}
            {pdfBlobUrl ? (
              <a
                href={pdfBlobUrl}
                download={pdfFilename}
                onClick={() => {
                  setStatusMessage({
                    text: `✓ Downloading PDF: "${pdfFilename}"`,
                    type: 'success',
                  });
                  setTimeout(() => setStatusMessage(null), 5000);
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all cursor-pointer no-underline"
                title="Download clean .PDF document directly to your device"
              >
                <Download className="w-4 h-4" />
                <span>Save as PDF</span>
              </a>
            ) : (
              <button
                onClick={handleSaveAsPdf}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
                title="Download clean .PDF document directly to your device"
              >
                <Download className="w-4 h-4" />
                <span>Save as PDF</span>
              </button>
            )}

            {/* Direct Print Button */}
            <button
              onClick={handlePrintSheet}
              className="px-4 py-2 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md shadow-sky-600/20 transition-all cursor-pointer"
              title="Print document or send to printer"
            >
              <Printer className="w-4 h-4" />
              <span>Print Sheet</span>
            </button>

            {/* Optional Open in New Window/Tab link for tablets */}
            {pdfBlobUrl && (
              <a
                href={pdfBlobUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors hidden sm:flex items-center"
                title="Open PDF in new tab"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}

            {/* Close */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
              title="Close preview"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Status Toast / Alert Banner if print triggered */}
        {statusMessage && (
          <div
            className={`px-6 py-2.5 text-xs font-semibold flex items-center justify-between gap-2 transition-all shrink-0 ${
              statusMessage.type === 'success'
                ? 'bg-emerald-500/15 border-b border-emerald-500/30 text-emerald-800 dark:text-emerald-300'
                : 'bg-sky-500/15 border-b border-sky-500/30 text-sky-800 dark:text-sky-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>{statusMessage.text}</span>
            </div>
            <button
              onClick={() => setStatusMessage(null)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Options Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-2.5 bg-slate-50 dark:bg-white/5 border-b border-slate-200 dark:border-white/10 shrink-0 print:hidden text-xs">
          {/* Scope Selector */}
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Layers className="w-3.5 h-3.5" /> Scope:
            </span>
            <button
              onClick={() => setExportScope('current')}
              className={`px-3 py-1 rounded-lg font-bold transition-all ${
                exportScope === 'current'
                  ? 'bg-sky-500 text-white shadow-xs'
                  : 'bg-white dark:bg-white/10 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10'
              }`}
            >
              Current Screen ({activePageIndex + 1})
            </button>
            <button
              onClick={() => setExportScope('all')}
              className={`px-3 py-1 rounded-lg font-bold transition-all ${
                exportScope === 'all'
                  ? 'bg-sky-500 text-white shadow-xs'
                  : 'bg-white dark:bg-white/10 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10'
              }`}
            >
              All Screens ({lesson.pages.length})
            </button>
          </div>

          {/* Section Toggles */}
          <div className="flex items-center gap-2 font-medium">
            <span className="text-slate-400 hidden md:inline">Include:</span>
            <label className="flex items-center gap-1 cursor-pointer">
              <input
                type="checkbox"
                checked={includeObjectives}
                onChange={(e) => setIncludeObjectives(e.target.checked)}
                className="rounded text-sky-600 focus:ring-0"
              />
              <span>Aims</span>
            </label>
            <label className="flex items-center gap-1 cursor-pointer">
              <input
                type="checkbox"
                checked={includeTasks}
                onChange={(e) => setIncludeTasks(e.target.checked)}
                className="rounded text-sky-600 focus:ring-0"
              />
              <span>Tasks</span>
            </label>
            <label className="flex items-center gap-1 cursor-pointer">
              <input
                type="checkbox"
                checked={includeLinks}
                onChange={(e) => setIncludeLinks(e.target.checked)}
                className="rounded text-sky-600 focus:ring-0"
              />
              <span>Links</span>
            </label>
            <label className="flex items-center gap-1 cursor-pointer">
              <input
                type="checkbox"
                checked={includeNotes}
                onChange={(e) => setIncludeNotes(e.target.checked)}
                className="rounded text-sky-600 focus:ring-0"
              />
              <span>Notes</span>
            </label>
          </div>
        </div>

        {/* Printable Document Preview Area */}
        <div
          id="print-modal-scroll-area"
          className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-200/50 dark:bg-slate-950/70"
        >
          <div
            id="printable-lesson-sheet"
            className="max-w-[760px] mx-auto bg-white text-slate-900 p-8 sm:p-10 rounded-2xl shadow-xl border border-slate-200 space-y-8 select-text"
          >
            {pagesToPrint.map((pg, pageIdx) => (
              <div
                key={pg.id || pageIdx}
                className="screen-card pb-8 border-b-2 border-slate-200 last:border-b-0 last:pb-0"
              >
                {/* Header */}
                <div className="flex items-baseline justify-between border-b pb-3 mb-5">
                  <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                      {lesson.title || "Today's Lesson"}
                    </h1>
                    <h2 className="text-sm font-bold text-sky-700 mt-0.5">
                      {pg.title || `Screen ${pageIdx + 1}`}
                    </h2>
                  </div>
                  <div className="text-right text-xs text-slate-500 font-medium">
                    <div>{lesson.date}</div>
                    <div className="text-[11px] text-slate-400">
                      Screen {pageIdx + 1} of {pagesToPrint.length}
                    </div>
                  </div>
                </div>

                {/* Objectives & Competence Aims */}
                {includeObjectives && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-5">
                    {pg.lessonObjectives && pg.lessonObjectives.length > 0 && (
                      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                        <h3 className="text-xs font-black uppercase text-sky-800 tracking-wider flex items-center gap-1.5 mb-2">
                          <Target className="w-3.5 h-3.5 text-sky-600" />
                          Lesson Objectives
                        </h3>
                        <ul className="space-y-1.5">
                          {pg.lessonObjectives.map((obj, i) => (
                            <li key={i} className="text-xs text-slate-700 flex items-start gap-2">
                              <span className="w-4 h-4 rounded-full bg-sky-100 text-sky-800 flex items-center justify-center text-[9px] font-bold shrink-0 mt-0.5">
                                {i + 1}
                              </span>
                              <span className="leading-relaxed">{obj}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {pg.competenceAims && pg.competenceAims.length > 0 && (
                      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                        <h3 className="text-xs font-black uppercase text-indigo-800 tracking-wider flex items-center gap-1.5 mb-2">
                          <Target className="w-3.5 h-3.5 text-indigo-600" />
                          Competence Aims
                        </h3>
                        <ul className="space-y-1.5">
                          {pg.competenceAims.map((aim, i) => (
                            <li key={i} className="text-xs text-slate-700 flex items-start gap-2">
                              <span className="w-4 h-4 rounded-full bg-indigo-100 text-indigo-800 flex items-center justify-center text-[9px] font-bold shrink-0 mt-0.5">
                                {i + 1}
                              </span>
                              <span className="leading-relaxed">{aim}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {/* Tasks List */}
                {includeTasks && pg.tasks && pg.tasks.length > 0 && (
                  <div className="mb-5 p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <h3 className="text-xs font-black uppercase text-indigo-800 tracking-wider flex items-center gap-1.5 mb-2.5">
                      <CheckSquare className="w-3.5 h-3.5 text-indigo-600" />
                      Class Tasks & Checklist ({pg.tasks.length})
                    </h3>
                    <div className="space-y-2">
                      {pg.tasks.map((tsk, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between text-xs py-1 px-2 border-b border-slate-200/60 last:border-b-0"
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="w-4 h-4 border-2 border-slate-400 rounded shrink-0 flex items-center justify-center text-[10px] text-emerald-600 font-bold">
                              {tsk.completed ? '✓' : ''}
                            </div>
                            <span
                              className={`font-semibold leading-normal ${
                                tsk.completed ? 'line-through text-slate-400' : 'text-slate-800'
                              }`}
                            >
                              {tsk.text}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Links */}
                {includeLinks && pg.links && pg.links.length > 0 && (
                  <div className="mb-5 p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <h3 className="text-xs font-black uppercase text-emerald-800 tracking-wider flex items-center gap-1.5 mb-2.5">
                      <Link2 className="w-3.5 h-3.5 text-emerald-600" />
                      Classroom Links & Resources
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {pg.links.map((lnk, i) => (
                        <div key={i} className="p-2.5 rounded-lg bg-white border border-slate-200 text-xs">
                          <div className="font-bold text-slate-800 truncate">{lnk.title}</div>
                          <div className="text-[11px] text-sky-600 truncate mt-0.5">
                            {lnk.url}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Lesson Notes & Media */}
                {includeNotes && pg.textAndImage?.text && (
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <h3 className="text-xs font-black uppercase text-blue-800 tracking-wider flex items-center gap-1.5 mb-2">
                      <FileText className="w-3.5 h-3.5 text-blue-600" />
                      Lesson Notes & Instructions
                    </h3>
                    <div className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap font-sans">
                      {pg.textAndImage.text}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Document Footer */}
            <div className="pt-4 border-t border-slate-200 text-center text-[10px] text-slate-400 flex items-center justify-between">
              <span>Generated from LessonFlow</span>
              <span>{new Date().toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
