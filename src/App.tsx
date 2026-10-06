import React, { useState, useEffect, useCallback } from 'react';
import {
  LessonPlan,
  LessonPage,
  WidgetVisibility,
  BackgroundOption,
  ClassRoster,
  TextAndImageData,
  WidgetSizeConfig,
  FontSizeScale,
  DEFAULT_WIDGET_VISIBILITY,
} from './types';
import { BACKGROUND_PRESETS } from './data/backgrounds';
import { createBlankPage, PRESET_LESSONS } from './data/presetLessons';
import {
  loadSavedLessons,
  saveLessonsToStorage,
  loadActiveLessonId,
  saveActiveLessonId,
  loadStudentRoster,
  saveStudentRoster,
  loadSavedClasses,
  saveSavedClasses,
  loadActiveClassId,
  saveActiveClassId,
  createNewLesson,
} from './utils/storage';

import { TopHeader } from './components/TopHeader';
import { PageNavigationBar } from './components/PageNavigationBar';
import { BottomToolbar } from './components/BottomToolbar';
import { ObjectivesWidget } from './components/widgets/ObjectivesWidget';
import { TasksWidget } from './components/widgets/TasksWidget';
import { LinkWidget } from './components/widgets/LinkWidget';
import { YouTubeWidget } from './components/widgets/YouTubeWidget';
import { ImageWidget } from './components/widgets/ImageWidget';
import { TimerWidget } from './components/widgets/TimerWidget';
import { RandomizerWidget } from './components/widgets/RandomizerWidget';
import { GroupMakerWidget } from './components/widgets/GroupMakerWidget';
import { TextAndImageWidget } from './components/widgets/TextAndImageWidget';
import { SoundLevelWidget } from './components/widgets/SoundLevelWidget';
import { ClockWidget } from './components/widgets/ClockWidget';
import { ResizableCard } from './components/widgets/ResizableCard';
import { FloatingWidgetWrapper } from './components/widgets/FloatingWidgetWrapper';
import { BackgroundPickerModal } from './components/widgets/BackgroundPickerModal';
import { LessonLibraryModal } from './components/LessonLibraryModal';
import { PrintExportModal } from './components/PrintExportModal';
import {
  Edit2,
  Check,
  LayoutGrid,
  Target,
  CheckSquare,
  Link2,
  Hourglass,
  Users2,
  Users,
  FileImage,
  Tv,
  Image as ImageIcon,
  Volume2,
  Clock,
  Sparkles,
  Plus,
} from 'lucide-react';
import { useTheme } from './context/ThemeContext';

export default function App() {
  const { theme, highContrast } = useTheme();
  const isLight = theme === 'light';

  // Lessons state
  const [lessons, setLessons] = useState<LessonPlan[]>(() => {
    const loaded = loadSavedLessons();
    return loaded && loaded.length > 0 ? loaded : PRESET_LESSONS;
  });
  const [activeLessonId, setActiveLessonId] = useState<string>(() =>
    loadActiveLessonId(lessons[0]?.id || PRESET_LESSONS[0]?.id || 'lesson-1')
  );

  // Active Lesson
  const activeLesson: LessonPlan =
    lessons.find((l) => l.id === activeLessonId) ||
    lessons[0] ||
    PRESET_LESSONS[0];

  // Pages within active lesson
  const pages: LessonPage[] =
    activeLesson?.pages && activeLesson.pages.length > 0
      ? activeLesson.pages
      : [createBlankPage(1)];
  const currentPageIndex = Math.min(
    Math.max(0, activeLesson?.activePageIndex ?? 0),
    pages.length - 1
  );
  const currentPage = pages[currentPageIndex] || pages[0] || createBlankPage(1);

  // Inline editing state for Title ONLY (no grade or subject boxes - Requirements 4 & 7)
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState(activeLesson?.title || '');

  // Keep draft updated when active lesson changes
  useEffect(() => {
    setTitleDraft(activeLesson?.title || '');
  }, [activeLessonId, activeLesson?.title]);

  // Saved Classes & Student Rosters by class (up to 30 students per class)
  const [classes, setClasses] = useState<ClassRoster[]>(() => loadSavedClasses());
  const [activeClassId, setActiveClassId] = useState<string>(() =>
    loadActiveClassId(classes[0]?.id || 'class-1')
  );

  const activeClassRoster = classes.find((c) => c.id === activeClassId) || classes[0];
  const studentRoster = activeClassRoster?.students || [];

  const handleSelectClass = (id: string) => {
    setActiveClassId(id);
    saveActiveClassId(id);
  };

  const handleSaveClasses = (updatedClasses: ClassRoster[], newActiveId?: string) => {
    setClasses(updatedClasses);
    saveSavedClasses(updatedClasses);
    if (newActiveId) {
      setActiveClassId(newActiveId);
      saveActiveClassId(newActiveId);
    }
  };

  // Wallpaper / Background state
  const [activeBackground, setActiveBackground] = useState<BackgroundOption>(() => {
    const bg = BACKGROUND_PRESETS.find((b) => b.id === activeLesson?.backgroundId);
    return bg || BACKGROUND_PRESETS[0];
  });

  // Widgets Visibility: Strictly stored and managed PER SCREEN so each screen is independent!
  const visibility: WidgetVisibility = currentPage?.widgetVisibility || DEFAULT_WIDGET_VISIBILITY;

  // Timer trigger from task
  const [timerMinutes, setTimerMinutes] = useState<number>(activeLesson?.timerMinutes || 15);

  // Modals & Overlays
  const [isBackgroundModalOpen, setIsBackgroundModalOpen] = useState(false);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [isPresentationMode, setIsPresentationMode] = useState(false);
  const [isSaved, setIsSaved] = useState(true);

  // Sync background if lesson changes
  useEffect(() => {
    if (activeLesson?.backgroundId) {
      const found = BACKGROUND_PRESETS.find((b) => b.id === activeLesson.backgroundId);
      if (found) setActiveBackground(found);
    }
  }, [activeLessonId, activeLesson?.backgroundId]);

  // Save lessons whenever modified
  const updateActiveLesson = useCallback(
    (updatedFields: Partial<LessonPlan>) => {
      setLessons((prev) => {
        const next = prev.map((lesson) => {
          if (lesson.id === activeLessonId) {
            return {
              ...lesson,
              ...updatedFields,
              lastEdited: 'Just now',
            };
          }
          return lesson;
        });
        saveLessonsToStorage(next);
        return next;
      });
      setIsSaved(false);
      setTimeout(() => setIsSaved(true), 1200);
    },
    [activeLessonId]
  );

  // Update current page fields
  const updateActivePage = useCallback(
    (updatedFields: Partial<LessonPage>) => {
      const updatedPages = pages.map((page, idx) => {
        if (idx === currentPageIndex) {
          return {
            ...page,
            ...updatedFields,
          };
        }
        return page;
      });
      updateActiveLesson({ pages: updatedPages });
    },
    [pages, currentPageIndex, updateActiveLesson]
  );

  const handleSelectPage = (index: number) => {
    updateActiveLesson({ activePageIndex: index });
  };

  const handleAddPage = () => {
    const newPage = createBlankPage(pages.length + 1);
    const updatedPages = [...pages, newPage];
    updateActiveLesson({
      pages: updatedPages,
      activePageIndex: updatedPages.length - 1,
    });
  };

  const handleDuplicatePage = (index: number) => {
    const target = pages[index];
    if (!target) return;
    const duplicated: LessonPage = {
      ...target,
      id: `page-${Date.now()}`,
      title: `${target.title} (Copy)`,
      widgetVisibility: target.widgetVisibility
        ? { ...target.widgetVisibility }
        : { ...DEFAULT_WIDGET_VISIBILITY },
      textAndImage: target.textAndImage ? { ...target.textAndImage } : undefined,
      tasks: target.tasks.map((t) => ({ ...t, id: `task-${Date.now()}-${Math.random()}` })),
      links: target.links
        ? target.links.map((l) => ({ ...l, id: `link-${Date.now()}-${Math.random()}` }))
        : [],
      competenceAims: [...target.competenceAims],
      lessonObjectives: [...target.lessonObjectives],
    };
    const updatedPages = [
      ...pages.slice(0, index + 1),
      duplicated,
      ...pages.slice(index + 1),
    ];
    updateActiveLesson({
      pages: updatedPages,
      activePageIndex: index + 1,
    });
  };

  const handleDeletePage = (index: number) => {
    if (pages.length <= 1) return;
    const updatedPages = pages.filter((_, idx) => idx !== index);
    const nextIndex = Math.min(currentPageIndex, updatedPages.length - 1);
    updateActiveLesson({
      pages: updatedPages,
      activePageIndex: nextIndex,
    });
  };

  const handleRenamePage = (index: number, newTitle: string) => {
    const updatedPages = pages.map((p, idx) =>
      idx === index ? { ...p, title: newTitle } : p
    );
    updateActiveLesson({ pages: updatedPages });
  };

  const handleClearBoard = () => {
    updateActivePage({
      competenceAims: [],
      lessonObjectives: [],
      tasks: [],
      imageUrl: '',
      imageCaption: '',
      youtubeUrl: '',
      youtubeTitle: '',
      links: [],
      linkUrl: '',
      linkTitle: '',
      notes: '',
    });
  };

  const handleSaveTitleChanges = () => {
    updateActiveLesson({
      title: titleDraft.trim() || "Today's Lesson",
      gradeLevel: '',
      subject: '',
    });
    setIsEditingTitle(false);
  };

  const handleSelectLesson = (id: string) => {
    setActiveLessonId(id);
    saveActiveLessonId(id);
  };

  const handleCreateLesson = () => {
    const newLesson = createNewLesson();
    const updated = [newLesson, ...lessons];
    setLessons(updated);
    saveLessonsToStorage(updated);
    setActiveLessonId(newLesson.id);
    saveActiveLessonId(newLesson.id);
  };

  const handleDuplicateLesson = (lessonToDup: LessonPlan) => {
    const duplicated: LessonPlan = {
      ...lessonToDup,
      id: `lesson-${Date.now()}`,
      title: `${lessonToDup.title} (Copy)`,
      lastEdited: 'Just now',
    };
    const updated = [duplicated, ...lessons];
    setLessons(updated);
    saveLessonsToStorage(updated);
    setActiveLessonId(duplicated.id);
    saveActiveLessonId(duplicated.id);
  };

  const handleDeleteLesson = (id: string) => {
    if (lessons.length <= 1) return;
    const filtered = lessons.filter((l) => l.id !== id);
    setLessons(filtered);
    saveLessonsToStorage(filtered);
    if (activeLessonId === id) {
      setActiveLessonId(filtered[0].id);
      saveActiveLessonId(filtered[0].id);
    }
  };

  const handleImportLessons = (imported: LessonPlan[]) => {
    const combined = [...imported, ...lessons];
    const unique = Array.from(new Map(combined.map((item) => [item.id, item])).values());
    setLessons(unique);
    saveLessonsToStorage(unique);
    setActiveLessonId(imported[0].id);
    saveActiveLessonId(imported[0].id);
  };

  const handleSaveRoster = (newRoster: string[]) => {
    if (activeClassRoster) {
      const updated = classes.map((c) =>
        c.id === activeClassRoster.id ? { ...c, students: newRoster } : c
      );
      handleSaveClasses(updated);
    }
  };

  const toggleWidget = (key: keyof WidgetVisibility) => {
    const currentVis = currentPage?.widgetVisibility || DEFAULT_WIDGET_VISIBILITY;
    const nextVis: WidgetVisibility = {
      ...currentVis,
      [key]: !currentVis[key],
    };
    updateActivePage({ widgetVisibility: nextVis });
  };

  const handleStartTimerForTask = (minutes?: number) => {
    setTimerMinutes(minutes || 15);
    const currentVis = currentPage?.widgetVisibility || DEFAULT_WIDGET_VISIBILITY;
    updateActivePage({
      widgetVisibility: {
        ...currentVis,
        timer: true,
      },
    });
  };

  const handleUpdateTextAndImage = (updated: Partial<TextAndImageData>) => {
    updateActivePage({
      textAndImage: {
        ...(currentPage.textAndImage || {}),
        ...updated,
      },
    });
  };

  // Check if any widget at all is visible
  const hasAnyWidgetVisible = Object.values(visibility).some(Boolean);

  const handleResizeWidget = (widgetKey: string, newSize: Partial<WidgetSizeConfig>) => {
    const currentSizes = currentPage.widgetSizes || {};
    const updated = {
      ...currentSizes,
      [widgetKey]: {
        ...(currentSizes[widgetKey] || {}),
        ...newSize,
      },
    };
    updateActivePage({ widgetSizes: updated });
  };

  // Compute dynamic grid spans based on which widgets are selected
  const primaryVisibleCount =
    (visibility.lessonInfo ? 1 : 0) +
    (visibility.tasks ? 1 : 0) +
    (visibility.link ? 1 : 0) +
    (visibility.youtube || visibility.image ? 1 : 0);

  const getColSpanClass = () => {
    if (primaryVisibleCount <= 1) return 'lg:col-span-12';
    if (primaryVisibleCount === 2) return 'lg:col-span-6';
    if (primaryVisibleCount === 3) return 'lg:col-span-4';
    return 'lg:col-span-3';
  };

  const colSpanClass = getColSpanClass();

  const getWidgetColSpanClass = (widgetKey: string) => {
    const userSpan = currentPage.widgetSizes?.[widgetKey]?.colSpan;
    if (userSpan) {
      if (userSpan === 3) return 'lg:col-span-3';
      if (userSpan === 4) return 'lg:col-span-4';
      if (userSpan === 6) return 'lg:col-span-6';
      if (userSpan === 8) return 'lg:col-span-8';
      if (userSpan === 12) return 'lg:col-span-12';
    }
    return colSpanClass;
  };

  return (
    <div
      className={`relative min-h-screen w-full flex flex-col font-['Plus_Jakarta_Sans',sans-serif] select-none overflow-hidden transition-colors ${
        isLight ? 'bg-slate-100 text-slate-800' : 'bg-slate-950 text-slate-100'
      }`}
    >
      {/* Background Image / Preset */}
      <div
        className="fixed inset-0 bg-cover bg-center transition-all duration-700 pointer-events-none"
        style={{ backgroundImage: `url(${activeBackground.url})` }}
      />
      {/* High contrast overlay for text legibility */}
      <div
        className={`absolute inset-0 pointer-events-none transition-colors wallpaper-dimmer ${
          highContrast
            ? isLight
              ? 'bg-white/95'
              : 'bg-black/92'
            : isLight
            ? 'bg-slate-100/80 backdrop-blur-[2px]'
            : 'bg-slate-950/45 backdrop-blur-[2px]'
        }`}
      />

      {/* Top Header - contains the ONE single Print / PDF button */}
      <TopHeader
        lesson={activeLesson}
        onOpenLibrary={() => setIsLibraryOpen(true)}
        onOpenPrintModal={() => setIsPrintModalOpen(true)}
        onSaveLesson={() => {
          saveLessonsToStorage(lessons);
          setIsSaved(true);
        }}
        onClearBoard={handleClearBoard}
        isPresentationMode={isPresentationMode}
        onTogglePresentationMode={() => setIsPresentationMode(!isPresentationMode)}
        isSaved={isSaved}
        globalFontSize={currentPage.globalFontSize || 'md'}
        onGlobalFontSizeChange={(newSize) => updateActivePage({ globalFontSize: newSize })}
      />

      {/* Main Classroom Canvas Viewport */}
      <main className="relative z-10 flex-1 overflow-y-auto px-4 sm:px-6 pt-3 pb-28">
        <div className="max-w-[1720px] mx-auto space-y-3.5">
          {/* Clean Lesson Headline with Direct Click-to-Edit (no grade/subject boxes) */}
          <div
            className={`flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pb-1 border-b ${
              isLight ? 'border-slate-300' : 'border-white/10'
            }`}
          >
            <div className="flex-1">
              {isEditingTitle ? (
                <div className="flex items-center gap-2 py-1 max-w-xl">
                  <input
                    type="text"
                    value={titleDraft}
                    onChange={(e) => setTitleDraft(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveTitleChanges();
                      if (e.key === 'Escape') setIsEditingTitle(false);
                    }}
                    placeholder="Lesson title..."
                    className={`text-lg sm:text-2xl font-bold border rounded-lg px-3 py-1 focus:outline-none flex-1 shadow-sm ${
                      isLight
                        ? 'bg-white border-sky-500 text-slate-900'
                        : 'bg-slate-900/90 border-sky-500 text-white'
                    }`}
                    autoFocus
                  />
                  <button
                    onClick={handleSaveTitleChanges}
                    className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1 shadow-sm transition-colors"
                  >
                    <Check className="w-3.5 h-3.5" /> Save
                  </button>
                </div>
              ) : (
                <div className="group flex items-baseline gap-2.5">
                  <h1
                    onClick={() => setIsEditingTitle(true)}
                    className={`text-xl sm:text-2xl font-extrabold tracking-tight cursor-pointer transition-colors flex items-center gap-2 ${
                      isLight
                        ? 'text-slate-900 hover:text-sky-700'
                        : 'text-white hover:text-sky-300 drop-shadow-md'
                    }`}
                    title="Click to rename lesson"
                  >
                    {activeLesson.title || "Today's Lesson"}
                    <Edit2
                      className={`w-3.5 h-3.5 opacity-0 group-hover:opacity-70 transition-opacity ${
                        isLight ? 'text-slate-500' : 'text-slate-300'
                      }`}
                    />
                  </h1>
                </div>
              )}
            </div>

            <div
              className={`text-xs font-semibold ${
                isLight ? 'text-slate-600' : 'text-slate-300'
              }`}
            >
              {activeLesson.date}
            </div>
          </div>

          {/* Multi-screen navigation tabs */}
          <PageNavigationBar
            pages={pages}
            activePageIndex={currentPageIndex}
            onSelectPage={handleSelectPage}
            onAddPage={handleAddPage}
            onDuplicatePage={handleDuplicatePage}
            onDeletePage={handleDeletePage}
            onRenamePage={handleRenamePage}
          />

          {/* When no widgets are displayed yet, show clear welcoming empty state */}
          {!hasAnyWidgetVisible && (
            <div
              className={`flex flex-col items-center justify-center min-h-[480px] p-6 sm:p-10 text-center rounded-3xl border-2 border-dashed transition-all ${
                isLight
                  ? 'bg-white/70 border-slate-300 text-slate-800 backdrop-blur-md shadow-sm'
                  : 'bg-slate-900/50 border-white/15 text-slate-100 backdrop-blur-md shadow-lg'
              }`}
            >
              <div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-3 shadow-lg ${
                  isLight ? 'bg-sky-100 text-sky-600' : 'bg-sky-500/20 text-sky-400'
                }`}
              >
                <LayoutGrid className="w-8 h-8" />
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight">
                {currentPage.title || `Screen ${currentPageIndex + 1}`} is Empty
              </h2>
              <p
                className={`text-xs sm:text-sm max-w-lg mt-1.5 ${
                  isLight ? 'text-slate-600' : 'text-slate-300'
                }`}
              >
                Select the widgets and tools you want to display on this screen, or pick a starter template below:
              </p>

              {/* Quick Template Presets */}
              <div className="flex flex-wrap items-center justify-center gap-2 mt-4 mb-6">
                <span className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">
                  Quick Layouts:
                </span>
                <button
                  onClick={() =>
                    updateActivePage({
                      widgetVisibility: {
                        ...visibility,
                        lessonInfo: true,
                        tasks: true,
                        link: true,
                      },
                    })
                  }
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all shadow-sm ${
                    isLight
                      ? 'bg-white hover:bg-slate-50 border-slate-300 text-slate-800'
                      : 'bg-white/10 hover:bg-white/15 border-white/15 text-white'
                  }`}
                >
                  ⚡ Lesson Starter (Aims + Tasks + Links)
                </button>
                <button
                  onClick={() =>
                    updateActivePage({
                      widgetVisibility: {
                        ...visibility,
                        tasks: true,
                        timer: true,
                      },
                    })
                  }
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all shadow-sm ${
                    isLight
                      ? 'bg-white hover:bg-slate-50 border-slate-300 text-slate-800'
                      : 'bg-white/10 hover:bg-white/15 border-white/15 text-white'
                  }`}
                >
                  ⏳ Focused Activity (Tasks + Timer)
                </button>
                <button
                  onClick={() =>
                    updateActivePage({
                      widgetVisibility: {
                        ...visibility,
                        tasks: true,
                        groupMaker: true,
                        randomizer: true,
                      },
                    })
                  }
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all shadow-sm ${
                    isLight
                      ? 'bg-white hover:bg-slate-50 border-slate-300 text-slate-800'
                      : 'bg-white/10 hover:bg-white/15 border-white/15 text-white'
                  }`}
                >
                  👥 Collaboration (Tasks + Groups + Randomizer)
                </button>
              </div>

              {/* Individual Widgets Selection Grid */}
              <div className="w-full max-w-3xl">
                <div className="text-[11px] font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2.5">
                  Or Click to Select Any Widget:
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                  <button
                    onClick={() => toggleWidget('lessonInfo')}
                    className={`p-3 rounded-2xl border text-left transition-all flex flex-col items-start gap-1 shadow-sm cursor-pointer ${
                      isLight
                        ? 'bg-sky-50 hover:bg-sky-100 border-sky-300 text-sky-950'
                        : 'bg-sky-500/15 hover:bg-sky-500/25 border-sky-500/30 text-sky-100'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <Target className="w-4 h-4 text-sky-700 dark:text-sky-400 stroke-[2.5]" />
                      <Plus className="w-3.5 h-3.5 text-sky-700 dark:text-sky-400 stroke-[2.5]" />
                    </div>
                    <span className="text-xs font-bold">Lesson Aims</span>
                    <span className="text-[10px] text-slate-700 dark:text-slate-300 font-medium line-clamp-1">Objectives & aims</span>
                  </button>

                  <button
                    onClick={() => toggleWidget('tasks')}
                    className={`p-3 rounded-2xl border text-left transition-all flex flex-col items-start gap-1 shadow-sm cursor-pointer ${
                      isLight
                        ? 'bg-indigo-50 hover:bg-indigo-100 border-indigo-300 text-indigo-950'
                        : 'bg-indigo-500/15 hover:bg-indigo-500/25 border-indigo-500/30 text-indigo-100'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <CheckSquare className="w-4 h-4 text-indigo-700 dark:text-indigo-400 stroke-[2.5]" />
                      <Plus className="w-3.5 h-3.5 text-indigo-700 dark:text-indigo-400 stroke-[2.5]" />
                    </div>
                    <span className="text-xs font-bold">Class Tasks</span>
                    <span className="text-[10px] text-slate-700 dark:text-slate-300 font-medium line-clamp-1">Tasks & checklist</span>
                  </button>

                  <button
                    onClick={() => toggleWidget('link')}
                    className={`p-3 rounded-2xl border text-left transition-all flex flex-col items-start gap-1 shadow-sm cursor-pointer ${
                      isLight
                        ? 'bg-emerald-50 hover:bg-emerald-100 border-emerald-300 text-emerald-950'
                        : 'bg-emerald-500/15 hover:bg-emerald-500/25 border-emerald-500/30 text-emerald-100'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <Link2 className="w-4 h-4 text-emerald-700 dark:text-emerald-400 stroke-[2.5]" />
                      <Plus className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400 stroke-[2.5]" />
                    </div>
                    <span className="text-xs font-bold">Links</span>
                    <span className="text-[10px] text-slate-700 dark:text-slate-300 font-medium line-clamp-1">Web links & student QR</span>
                  </button>

                  <button
                    onClick={() => toggleWidget('youtube')}
                    className={`p-3 rounded-2xl border text-left transition-all flex flex-col items-start gap-1 shadow-sm cursor-pointer ${
                      isLight
                        ? 'bg-rose-50 hover:bg-rose-100 border-rose-300 text-rose-950'
                        : 'bg-rose-500/15 hover:bg-rose-500/25 border-rose-500/30 text-rose-100'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <Tv className="w-4 h-4 text-rose-700 dark:text-rose-400 stroke-[2.5]" />
                      <Plus className="w-3.5 h-3.5 text-rose-700 dark:text-rose-400 stroke-[2.5]" />
                    </div>
                    <span className="text-xs font-bold">Video Player</span>
                    <span className="text-[10px] text-slate-700 dark:text-slate-300 font-medium line-clamp-1">YouTube embed</span>
                  </button>

                  <button
                    onClick={() => toggleWidget('image')}
                    className={`p-3 rounded-2xl border text-left transition-all flex flex-col items-start gap-1 shadow-sm cursor-pointer ${
                      isLight
                        ? 'bg-teal-50 hover:bg-teal-100 border-teal-300 text-teal-950'
                        : 'bg-teal-500/15 hover:bg-teal-500/25 border-teal-500/30 text-teal-100'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <ImageIcon className="w-4 h-4 text-teal-700 dark:text-teal-400 stroke-[2.5]" />
                      <Plus className="w-3.5 h-3.5 text-teal-700 dark:text-teal-400 stroke-[2.5]" />
                    </div>
                    <span className="text-xs font-bold">Image / Diagram</span>
                    <span className="text-[10px] text-slate-700 dark:text-slate-300 font-medium line-clamp-1">Visual diagram</span>
                  </button>

                  <button
                    onClick={() => toggleWidget('timer')}
                    className={`p-3 rounded-2xl border text-left transition-all flex flex-col items-start gap-1 shadow-sm cursor-pointer ${
                      isLight
                        ? 'bg-amber-50 hover:bg-amber-100 border-amber-300 text-amber-950'
                        : 'bg-amber-500/15 hover:bg-amber-500/25 border-amber-500/30 text-amber-100'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <Hourglass className="w-4 h-4 text-amber-800 dark:text-amber-400 stroke-[2.5]" />
                      <Plus className="w-3.5 h-3.5 text-amber-800 dark:text-amber-400 stroke-[2.5]" />
                    </div>
                    <span className="text-xs font-bold">Classroom Timer</span>
                    <span className="text-[10px] text-slate-700 dark:text-slate-300 font-medium line-clamp-1">Timer & stopwatch</span>
                  </button>

                  <button
                    onClick={() => toggleWidget('randomizer')}
                    className={`p-3 rounded-2xl border text-left transition-all flex flex-col items-start gap-1 shadow-sm cursor-pointer ${
                      isLight
                        ? 'bg-purple-50 hover:bg-purple-100 border-purple-300 text-purple-950'
                        : 'bg-purple-500/15 hover:bg-purple-500/25 border-purple-500/30 text-purple-100'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <Users2 className="w-4 h-4 text-purple-700 dark:text-purple-400 stroke-[2.5]" />
                      <Plus className="w-3.5 h-3.5 text-purple-700 dark:text-purple-400 stroke-[2.5]" />
                    </div>
                    <span className="text-xs font-bold">Randomizer</span>
                    <span className="text-[10px] text-slate-700 dark:text-slate-300 font-medium line-clamp-1">Pick random student</span>
                  </button>

                  <button
                    onClick={() => toggleWidget('groupMaker')}
                    className={`p-3 rounded-2xl border text-left transition-all flex flex-col items-start gap-1 shadow-sm cursor-pointer ${
                      isLight
                        ? 'bg-cyan-50 hover:bg-cyan-100 border-cyan-300 text-cyan-950'
                        : 'bg-cyan-500/15 hover:bg-cyan-500/25 border-cyan-500/30 text-cyan-100'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <Users className="w-4 h-4 text-cyan-800 dark:text-cyan-400 stroke-[2.5]" />
                      <Plus className="w-3.5 h-3.5 text-cyan-800 dark:text-cyan-400 stroke-[2.5]" />
                    </div>
                    <span className="text-xs font-bold">Group Maker</span>
                    <span className="text-[10px] text-slate-700 dark:text-slate-300 font-medium line-clamp-1">Up to 30 students</span>
                  </button>

                  <button
                    onClick={() => toggleWidget('textAndImage')}
                    className={`p-3 rounded-2xl border text-left transition-all flex flex-col items-start gap-1 shadow-sm cursor-pointer ${
                      isLight
                        ? 'bg-blue-50 hover:bg-blue-100 border-blue-300 text-blue-950'
                        : 'bg-blue-500/15 hover:bg-blue-500/25 border-blue-500/30 text-blue-100'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <FileImage className="w-4 h-4 text-blue-700 dark:text-blue-400 stroke-[2.5]" />
                      <Plus className="w-3.5 h-3.5 text-blue-700 dark:text-blue-400 stroke-[2.5]" />
                    </div>
                    <span className="text-xs font-bold">Text & Media</span>
                    <span className="text-[10px] text-slate-700 dark:text-slate-300 font-medium line-clamp-1">Notes & split image</span>
                  </button>

                  <button
                    onClick={() => toggleWidget('soundLevel')}
                    className={`p-3 rounded-2xl border text-left transition-all flex flex-col items-start gap-1 shadow-sm cursor-pointer ${
                      isLight
                        ? 'bg-emerald-50 hover:bg-emerald-100 border-emerald-300 text-emerald-950'
                        : 'bg-emerald-500/15 hover:bg-emerald-500/25 border-emerald-500/30 text-emerald-100'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <Volume2 className="w-4 h-4 text-emerald-800 dark:text-emerald-400 stroke-[2.5]" />
                      <Plus className="w-3.5 h-3.5 text-emerald-800 dark:text-emerald-400 stroke-[2.5]" />
                    </div>
                    <span className="text-xs font-bold">Sound Meter</span>
                    <span className="text-[10px] text-slate-700 dark:text-slate-300 font-medium line-clamp-1">Room volume limit</span>
                  </button>

                  <button
                    onClick={() => toggleWidget('clock')}
                    className={`p-3 rounded-2xl border text-left transition-all flex flex-col items-start gap-1 shadow-sm cursor-pointer ${
                      isLight
                        ? 'bg-amber-50 hover:bg-amber-100 border-amber-300 text-amber-950'
                        : 'bg-amber-500/15 hover:bg-amber-500/25 border-amber-500/30 text-amber-100'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <Clock className="w-4 h-4 text-amber-800 dark:text-yellow-400 stroke-[2.5]" />
                      <Plus className="w-3.5 h-3.5 text-amber-800 dark:text-yellow-400 stroke-[2.5]" />
                    </div>
                    <span className="text-xs font-bold">Class Clock</span>
                    <span className="text-[10px] text-slate-700 dark:text-slate-300 font-medium line-clamp-1">12h/24h time</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Primary Board Widgets (Lesson Objectives, Tasks, Link, Media) - each resizable by touching edge */}
          <div className="flex flex-wrap items-start gap-5">
            {/* Widget: Lesson Objectives & Competence Aims */}
            {visibility.lessonInfo && (
              <ResizableCard
                id="card-lessonInfo"
                defaultWidth={560}
                defaultHeight={540}
                width={currentPage.widgetSizes?.['lessonInfo']?.width}
                height={currentPage.widgetSizes?.['lessonInfo']?.height}
                onResize={(w, h) => handleResizeWidget('lessonInfo', { width: w, height: h })}
                className="max-w-full"
              >
                <ObjectivesWidget
                  page={currentPage}
                  onUpdate={updateActivePage}
                  onClose={() => toggleWidget('lessonInfo')}
                  size={currentPage.widgetSizes?.['lessonInfo']}
                  onResizeWidget={(sz) => handleResizeWidget('lessonInfo', sz)}
                />
              </ResizableCard>
            )}

            {/* Widget: Tasks */}
            {visibility.tasks && (
              <ResizableCard
                id="card-tasks"
                defaultWidth={480}
                defaultHeight={500}
                width={currentPage.widgetSizes?.['tasks']?.width}
                height={currentPage.widgetSizes?.['tasks']?.height}
                onResize={(w, h) => handleResizeWidget('tasks', { width: w, height: h })}
                className="max-w-full"
              >
                <TasksWidget
                  page={currentPage}
                  onUpdate={updateActivePage}
                  onClose={() => toggleWidget('tasks')}
                  size={currentPage.widgetSizes?.['tasks']}
                  onResizeWidget={(sz) => handleResizeWidget('tasks', sz)}
                />
              </ResizableCard>
            )}

            {/* Widget: Links Widget */}
            {visibility.link && (
              <ResizableCard
                id="card-link"
                defaultWidth={460}
                defaultHeight={500}
                width={currentPage.widgetSizes?.['link']?.width}
                height={currentPage.widgetSizes?.['link']?.height}
                onResize={(w, h) => handleResizeWidget('link', { width: w, height: h })}
                className="max-w-full"
              >
                <LinkWidget
                  page={currentPage}
                  onUpdate={updateActivePage}
                  onClose={() => toggleWidget('link')}
                  size={currentPage.widgetSizes?.['link']}
                  onResizeWidget={(sz) => handleResizeWidget('link', sz)}
                />
              </ResizableCard>
            )}

            {/* Widget: YouTube Video */}
            {visibility.youtube && (
              <ResizableCard
                id="card-youtube"
                defaultWidth={560}
                defaultHeight={420}
                width={currentPage.widgetSizes?.['youtube']?.width}
                height={currentPage.widgetSizes?.['youtube']?.height}
                onResize={(w, h) => handleResizeWidget('youtube', { width: w, height: h })}
                className="max-w-full"
              >
                <YouTubeWidget
                  youtubeUrl={currentPage.youtubeUrl}
                  youtubeTitle={currentPage.youtubeTitle}
                  onUpdate={(url, title) =>
                    updateActivePage({ youtubeUrl: url, youtubeTitle: title })
                  }
                  onClose={() => toggleWidget('youtube')}
                />
              </ResizableCard>
            )}

            {/* Widget: Image / Diagram */}
            {visibility.image && (
              <ResizableCard
                id="card-image"
                defaultWidth={520}
                defaultHeight={420}
                width={currentPage.widgetSizes?.['image']?.width}
                height={currentPage.widgetSizes?.['image']?.height}
                onResize={(w, h) => handleResizeWidget('image', { width: w, height: h })}
                className="max-w-full"
              >
                <ImageWidget
                  imageUrl={currentPage.imageUrl}
                  imageCaption={currentPage.imageCaption}
                  onUpdate={(url, caption) =>
                    updateActivePage({ imageUrl: url, imageCaption: caption })
                  }
                  onClose={() => toggleWidget('image')}
                />
              </ResizableCard>
            )}
          </div>
        </div>
      </main>

      {/* Floating Tools (Timer, Randomizer, Clock, Sound Level, Work Symbols) - each has an 'X' close button */}
      {!isPresentationMode && (
        <>
          {visibility.timer && (
            <FloatingWidgetWrapper
              id="timer"
              title="Classroom Timer"
              width={currentPage.widgetSizes?.['timer']?.width || 320}
              height={currentPage.widgetSizes?.['timer']?.height || 270}
              onResize={(w, h) => handleResizeWidget('timer', { width: w, height: h })}
              defaultPosition={{
                x: typeof window !== 'undefined' ? window.innerWidth - 350 : 850,
                y: 110,
              }}
              onClose={() => toggleWidget('timer')}
            >
              <TimerWidget initialMinutes={timerMinutes} />
            </FloatingWidgetWrapper>
          )}

          {visibility.randomizer && (
            <FloatingWidgetWrapper
              id="randomizer"
              title="Student Randomizer"
              width={currentPage.widgetSizes?.['randomizer']?.width || 340}
              height={currentPage.widgetSizes?.['randomizer']?.height || 300}
              onResize={(w, h) => handleResizeWidget('randomizer', { width: w, height: h })}
              defaultPosition={{
                x: typeof window !== 'undefined' ? window.innerWidth - 370 : 850,
                y: 410,
              }}
              onClose={() => toggleWidget('randomizer')}
            >
              <RandomizerWidget
                roster={studentRoster}
                classes={classes}
                activeClassId={activeClassId}
                onSelectClass={handleSelectClass}
                onSaveClasses={handleSaveClasses}
              />
            </FloatingWidgetWrapper>
          )}

          {visibility.groupMaker && (
            <FloatingWidgetWrapper
              id="groupMaker"
              title="Group Maker (Max 30 Students)"
              width={currentPage.widgetSizes?.['groupMaker']?.width || 420}
              height={currentPage.widgetSizes?.['groupMaker']?.height || 370}
              onResize={(w, h) => handleResizeWidget('groupMaker', { width: w, height: h })}
              defaultPosition={{
                x: typeof window !== 'undefined' ? Math.max(20, Math.floor(window.innerWidth / 2) - 210) : 380,
                y: 150,
              }}
              onClose={() => toggleWidget('groupMaker')}
            >
              <GroupMakerWidget
                roster={studentRoster}
                classes={classes}
                activeClassId={activeClassId}
                onSelectClass={handleSelectClass}
                onSaveClasses={handleSaveClasses}
                onClose={() => toggleWidget('groupMaker')}
              />
            </FloatingWidgetWrapper>
          )}

          {visibility.textAndImage && (
            <FloatingWidgetWrapper
              id="textAndImage"
              title="Text & Media"
              width={currentPage.widgetSizes?.['textAndImage']?.width || currentPage.textAndImage?.width || 580}
              height={currentPage.widgetSizes?.['textAndImage']?.height || currentPage.textAndImage?.height || 420}
              onResize={(w, h) => {
                handleResizeWidget('textAndImage', { width: w, height: h });
                handleUpdateTextAndImage({ width: w, height: h });
              }}
              defaultPosition={{
                x: typeof window !== 'undefined' ? Math.max(20, Math.floor(window.innerWidth / 2) - 290) : 340,
                y: 130,
              }}
              onClose={() => toggleWidget('textAndImage')}
            >
              <TextAndImageWidget
                data={currentPage.textAndImage}
                onUpdate={handleUpdateTextAndImage}
                onResizeWidget={(w, h) => {
                  handleResizeWidget('textAndImage', { width: w, height: h });
                  handleUpdateTextAndImage({ width: w, height: h });
                }}
                fontSize={currentPage.widgetSizes?.['textAndImage']?.fontSize}
                onFontSizeChange={(sz) => handleResizeWidget('textAndImage', { fontSize: sz })}
                onClose={() => toggleWidget('textAndImage')}
              />
            </FloatingWidgetWrapper>
          )}

          {visibility.clock && (
            <FloatingWidgetWrapper
              id="clock"
              title="Class Clock"
              width={currentPage.widgetSizes?.['clock']?.width || 280}
              height={currentPage.widgetSizes?.['clock']?.height || 210}
              onResize={(w, h) => handleResizeWidget('clock', { width: w, height: h })}
              defaultPosition={{
                x: 24,
                y: typeof window !== 'undefined' ? window.innerHeight - 300 : 500,
              }}
              onClose={() => toggleWidget('clock')}
            >
              <ClockWidget />
            </FloatingWidgetWrapper>
          )}

          {visibility.soundLevel && (
            <FloatingWidgetWrapper
              id="soundLevel"
              title="Sound Level Meter"
              width={currentPage.widgetSizes?.['soundLevel']?.width || 310}
              height={currentPage.widgetSizes?.['soundLevel']?.height || 270}
              onResize={(w, h) => handleResizeWidget('soundLevel', { width: w, height: h })}
              defaultPosition={{
                x: 24,
                y: 120,
              }}
              onClose={() => toggleWidget('soundLevel')}
            >
              <SoundLevelWidget />
            </FloatingWidgetWrapper>
          )}
        </>
      )}

      {/* Floating Bottom Toolbar - with link before video, no draw, and hide strip capability */}
      <BottomToolbar
        visibility={visibility}
        onToggleWidget={toggleWidget}
        onOpenBackgroundModal={() => setIsBackgroundModalOpen(true)}
        onOpenLibrary={() => setIsLibraryOpen(true)}
      />

      {/* Background Picker Modal */}
      <BackgroundPickerModal
        isOpen={isBackgroundModalOpen}
        onClose={() => setIsBackgroundModalOpen(false)}
        currentBgId={activeBackground.id}
        onSelectBackground={(bg) => {
          setActiveBackground(bg);
          updateActiveLesson({ backgroundId: bg.id });
        }}
        onUploadCustomBg={(dataUrl) => {
          const customBg: BackgroundOption = {
            id: `custom-${Date.now()}`,
            name: 'Custom Wallpaper',
            category: 'Modern',
            url: dataUrl,
            thumbnail: dataUrl,
          };
          setActiveBackground(customBg);
          updateActiveLesson({ backgroundId: customBg.id });
        }}
      />

      {/* Lesson Library & Storage Modal */}
      <LessonLibraryModal
        isOpen={isLibraryOpen}
        onClose={() => setIsLibraryOpen(false)}
        lessons={lessons}
        activeLessonId={activeLessonId}
        onSelectLesson={handleSelectLesson}
        onCreateLesson={handleCreateLesson}
        onDuplicateLesson={handleDuplicateLesson}
        onDeleteLesson={handleDeleteLesson}
        onImportLessons={handleImportLessons}
      />

      {/* Print / PDF Export Modal */}
      <PrintExportModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        lesson={activeLesson}
        activePageIndex={currentPageIndex}
      />
    </div>
  );
}
