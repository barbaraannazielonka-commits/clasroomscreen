export interface TaskItem {
  id: string;
  text: string;
  completed: boolean;
}

export type FontSizeScale = 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export interface WidgetSizeConfig {
  width?: number; // width in pixels
  colSpan?: number; // 3, 4, 6, 8, 12
  height?: number; // height in pixels
  fontSize?: FontSizeScale;
}

export interface QuickLinkItem {
  id: string;
  title: string;
  url: string;
  description?: string;
  category?: string;
}

export interface TextAndImageData {
  text?: string;
  imageUrl?: string;
  imageCaption?: string;
  width?: number;
  height?: number;
  layout?: 'split' | 'text-only' | 'image-only' | 'stacked';
}

export interface WidgetVisibility {
  lessonInfo: boolean;
  tasks: boolean;
  link: boolean;
  youtube: boolean;
  image: boolean;
  timer: boolean;
  randomizer: boolean;
  groupMaker: boolean;
  textAndImage: boolean;
  soundLevel: boolean;
  clock: boolean;
}

export const EMPTY_WIDGET_VISIBILITY: WidgetVisibility = {
  lessonInfo: false,
  tasks: false,
  link: false,
  youtube: false,
  image: false,
  timer: false,
  randomizer: false,
  groupMaker: false,
  textAndImage: false,
  soundLevel: false,
  clock: false,
};

export const DEFAULT_WIDGET_VISIBILITY: WidgetVisibility = {
  ...EMPTY_WIDGET_VISIBILITY,
};

export interface LessonPage {
  id: string;
  title: string;
  widgetVisibility?: WidgetVisibility;
  competenceAims: string[];
  lessonObjectives: string[];
  tasks: TaskItem[];
  links?: QuickLinkItem[];
  linkUrl?: string;
  linkTitle?: string;
  youtubeUrl?: string;
  youtubeTitle?: string;
  imageUrl?: string;
  imageCaption?: string;
  notes?: string;
  textAndImage?: TextAndImageData;
  widgetSizes?: Record<string, WidgetSizeConfig>;
  globalFontSize?: FontSizeScale;
}

export interface LessonPlan {
  id: string;
  title: string;
  date: string;
  gradeLevel?: string;
  subject?: string;
  backgroundId?: string;
  timerMinutes?: number;
  activePageIndex?: number;
  pages: LessonPage[];
  lastEdited?: string;
}

export interface BackgroundOption {
  id: string;
  name: string;
  category: 'Classroom' | 'Nature' | 'Abstract' | 'Modern' | 'Minimal' | 'United Kingdom' | 'United States';
  url: string;
  thumbnail: string;
}

export interface ClassRoster {
  id: string;
  name: string;
  students: string[];
}
