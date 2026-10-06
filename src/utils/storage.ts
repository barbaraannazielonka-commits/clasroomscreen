import { LessonPlan, ClassRoster } from '../types';
import { PRESET_LESSONS, createBlankPage } from '../data/presetLessons';

const LESSONS_KEY = 'cs_saved_lessons';
const ACTIVE_LESSON_KEY = 'cs_active_lesson_id';
const CLASSES_KEY = 'cs_saved_classes';
const ACTIVE_CLASS_KEY = 'cs_active_class_id';
const ROSTER_KEY = 'cs_student_roster';

export const DEFAULT_CLASSES: ClassRoster[] = [
  {
    id: 'class-1',
    name: 'Period 1 - Biology',
    students: [
      'Alexander Chen',
      'Amara Okafor',
      'Benjamin Miller',
      'Camila Rodriguez',
      'Daniel Kim',
      'Elena Rostova',
      'Ethan Vance',
      'Fatima Al-Mansoor',
      'Gabriel Santos',
      'Grace Hopper',
      'Isabella Rossi',
      'Jacob Davies',
      'Kavita Patel',
      'Liam O\'Connor',
      'Maya Lin',
      'Noah Williams',
      'Olivia Zhang',
      'Lucas Martinez',
      'Sophia Taylor',
      'Tyler Brooks',
      'Victoria Chase',
      'William Scott',
      'Zara Hassan',
      'Marcus Wright',
    ],
  },
  {
    id: 'class-2',
    name: 'Period 3 - Science 8A',
    students: [
      'Aiden Smith',
      'Ava Johnson',
      'Brandon Lee',
      'Chloe Martin',
      'David Garcia',
      'Emma Watson',
      'Felix Morales',
      'Hannah Baker',
      'Ian Wright',
      'Julia Roberts',
      'Leo Valdez',
      'Mia Hernandez',
      'Nathan Drake',
      'Penelope Cruz',
      'Quinn Larson',
      'Ryan Reynolds',
      'Samantha Reed',
      'Theo Von',
    ],
  },
  {
    id: 'class-3',
    name: 'Period 5 - Honors Biology',
    students: [
      'Aria Stark',
      'Brian Nelson',
      'Clara Oswald',
      'Dmitri Petrov',
      'Eva Green',
      'Finnian Bell',
      'Genevieve Wu',
      'Henry Cavill',
      'Ivy Walker',
      'Jasper Hale',
      'Kira Nerys',
      'Logan Roy',
      'Nadia Comaneci',
      'Owen Grady',
      'Phoebe Waller',
    ],
  },
];

export function loadSavedLessons(): LessonPlan[] {
  if (typeof window === 'undefined') return PRESET_LESSONS;
  try {
    const raw = localStorage.getItem(LESSONS_KEY);
    if (!raw) {
      saveLessonsToStorage(PRESET_LESSONS);
      return PRESET_LESSONS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch (err) {
    console.warn('Failed to parse saved lessons from localStorage:', err);
  }
  return PRESET_LESSONS;
}

export function saveLessonsToStorage(lessons: LessonPlan[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LESSONS_KEY, JSON.stringify(lessons));
  } catch (err) {
    console.error('Failed to save lessons to localStorage:', err);
  }
}

export function loadActiveLessonId(fallback: string): string {
  if (typeof window === 'undefined') return fallback;
  try {
    const saved = localStorage.getItem(ACTIVE_LESSON_KEY);
    if (saved) return saved;
  } catch (err) {
    console.warn('Failed to get active lesson id:', err);
  }
  return fallback;
}

export function saveActiveLessonId(id: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(ACTIVE_LESSON_KEY, id);
  } catch (err) {
    console.error('Failed to save active lesson id:', err);
  }
}

export function loadSavedClasses(): ClassRoster[] {
  if (typeof window === 'undefined') return DEFAULT_CLASSES;
  try {
    const raw = localStorage.getItem(CLASSES_KEY);
    if (!raw) {
      saveSavedClasses(DEFAULT_CLASSES);
      return DEFAULT_CLASSES;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch (err) {
    console.warn('Failed to parse saved classes from localStorage:', err);
  }
  return DEFAULT_CLASSES;
}

export function saveSavedClasses(classes: ClassRoster[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CLASSES_KEY, JSON.stringify(classes));
  } catch (err) {
    console.error('Failed to save classes to localStorage:', err);
  }
}

export function loadActiveClassId(fallback: string): string {
  if (typeof window === 'undefined') return fallback;
  try {
    const saved = localStorage.getItem(ACTIVE_CLASS_KEY);
    if (saved) return saved;
  } catch (err) {
    console.warn('Failed to get active class id:', err);
  }
  return fallback;
}

export function saveActiveClassId(id: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(ACTIVE_CLASS_KEY, id);
  } catch (err) {
    console.error('Failed to save active class id:', err);
  }
}

export function loadStudentRoster(): string[] {
  if (typeof window === 'undefined') return DEFAULT_CLASSES[0].students;
  try {
    const raw = localStorage.getItem(ROSTER_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (err) {
    console.warn('Failed to load roster:', err);
  }
  return DEFAULT_CLASSES[0].students;
}

export function saveStudentRoster(roster: string[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(ROSTER_KEY, JSON.stringify(roster));
  } catch (err) {
    console.error('Failed to save roster:', err);
  }
}

export function createNewLesson(): LessonPlan {
  const newId = `lesson-${Date.now()}`;
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  return {
    id: newId,
    title: 'New Lesson Plan',
    date: today,
    gradeLevel: 'Grade 8',
    subject: 'General',
    backgroundId: 'bg-chalkboard',
    timerMinutes: 15,
    activePageIndex: 0,
    lastEdited: 'Just now',
    pages: [createBlankPage(1)],
  };
}
