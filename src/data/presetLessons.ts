import { LessonPage, LessonPlan, EMPTY_WIDGET_VISIBILITY } from '../types';

export function createBlankPage(pageNumber: number): LessonPage {
  return {
    id: `page-${Date.now()}-${pageNumber}-${Math.random().toString(36).substring(2, 7)}`,
    title: `Screen ${pageNumber}`,
    widgetVisibility: { ...EMPTY_WIDGET_VISIBILITY },
    competenceAims: [],
    lessonObjectives: [],
    tasks: [],
    links: [],
    linkUrl: '',
    linkTitle: '',
    youtubeUrl: '',
    youtubeTitle: '',
    imageUrl: '',
    imageCaption: '',
    notes: '',
    textAndImage: undefined,
  };
}

export const PRESET_LESSONS: LessonPlan[] = [
  {
    id: 'lesson-ecosystems',
    title: 'Ecosystem Dynamics & Energy Flow',
    date: new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }),
    gradeLevel: 'Grade 8',
    subject: 'Biology',
    backgroundId: 'bg-uk-london-skyline',
    timerMinutes: 15,
    activePageIndex: 0,
    lastEdited: 'Today',
    pages: [
      {
        id: 'page-1',
        title: 'Screen 1: Introduction',
        widgetVisibility: {
          lessonInfo: true,
          tasks: true,
          link: true,
          youtube: false,
          image: false,
          timer: false,
          randomizer: false,
          groupMaker: false,
          textAndImage: false,
          soundLevel: false,
          clock: false,
        },
        competenceAims: [
          'Analyze biotic and abiotic interactions within trophic levels',
          'Evaluate energy pyramids and 10% rule in food chains',
        ],
        lessonObjectives: [
          'Map a 4-tier food web from primary producers to apex consumers',
          'Calculate energy loss across 3 successive trophic levels',
        ],
        tasks: [
          {
            id: 't-1',
            text: 'Warm-up: Identify 3 producers in your local biome',
            completed: false,
          },
          {
            id: 't-2',
            text: 'Direct Instruction: Trophic efficiency & apex predators',
            completed: false,
          },
          {
            id: 't-3',
            text: 'Partner Activity: Food web diagramming exercise',
            completed: false,
          },
          {
            id: 't-4',
            text: 'Synthesis: 3-2-1 exit check on ecological balance',
            completed: false,
          },
        ],
        links: [
          {
            id: 'l-1',
            title: 'Ecosystem Simulation Model',
            url: 'https://phet.colorado.edu',
            description: 'Manipulate predator-prey populations in real time',
          },
          {
            id: 'l-2',
            title: 'Interactive Discussion Board',
            url: 'https://docs.google.com',
            description: 'Post your team hypothesis & question',
          },
        ],
        linkUrl: 'https://phet.colorado.edu',
        linkTitle: 'Ecosystem Simulation Model',
        youtubeUrl: 'https://www.youtube.com/watch?v=0h6Q4UvF5j0',
        youtubeTitle: 'Energy Flow in Ecosystems Crash Course',
        imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
        imageCaption: 'Temperate forest food chain model',
        textAndImage: {
          text: '### Key Vocabulary\n- **Biomass:** Total mass of organisms in a given area.\n- **Trophic Level:** Step in a nutritive series or food chain.\n- **Decomposer:** Breaks down organic material and recycles minerals.',
          imageUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80',
          imageCaption: 'Forest floor micro-ecosystem',
          layout: 'split',
          width: 580,
          height: 400,
        },
      },
      {
        id: 'page-2',
        title: 'Screen 2: Group Lab',
        widgetVisibility: {
          lessonInfo: true,
          tasks: true,
          link: true,
          youtube: false,
          image: false,
          timer: true,
          randomizer: false,
          groupMaker: false,
          textAndImage: false,
          soundLevel: false,
          clock: false,
        },
        competenceAims: [
          'Design and conduct structured inquiry using simulated variables',
        ],
        lessonObjectives: [
          'Collect 3 sets of predator-prey population data over 10 cycles',
        ],
        tasks: [
          {
            id: 't-201',
            text: 'Assemble with your assigned group of 3 or 4',
            completed: false,
          },
          {
            id: 't-202',
            text: 'Run Simulation 1: Baseline population equilibrium',
            completed: false,
          },
          {
            id: 't-203',
            text: 'Run Simulation 2: Introducing invasive herbivore species',
            completed: false,
          },
        ],
        links: [
          {
            id: 'l-3',
            title: 'Digital Lab Report Template',
            url: 'https://docs.google.com',
            description: 'Record tables and graph generation',
          },
        ],
      },
    ],
  },
];
