export interface CurriculumAim {
  id: string;
  code: string;
  textNo: string;
  textEn: string;
  category: string;
}

export interface CurriculumTrack {
  id: 'academic' | 'vocational';
  title: string;
  subtitle: string;
  code: string;
  url: string;
  aims: CurriculumAim[];
}

export const UDIR_CURRICULUM_TRACKS: Record<'academic' | 'vocational', CurriculumTrack> = {
  academic: {
    id: 'academic',
    title: 'Academic Specialization (Studieforberedende)',
    subtitle: 'Vg1 English • ENG01-06 (kv1035)',
    code: 'kv1035',
    url: 'https://www.udir.no/lk20/eng01-06/kompetansemaal-og-vurdering/kv1035',
    aims: [
      {
        id: 'kv1035-1',
        code: '1',
        category: 'Language & Learning',
        textNo: 'Bruke hensiktsmessige strategier for språklæring, tekstskaping og kommunikasjon',
        textEn: 'Use appropriate strategies for language learning, text creation, and communication',
      },
      {
        id: 'kv1035-2',
        code: '2',
        category: 'Digital & Resources',
        textNo: 'Ta i bruk egnede digitale ressurser og andre hjelpemidler i språklæring, tekstskaping og samhandling',
        textEn: 'Utilize suitable digital resources and other aids in language learning, text creation, and interaction',
      },
      {
        id: 'kv1035-3',
        code: '3',
        category: 'Communication',
        textNo: 'Bruke uttalemønstre i kommunikasjon',
        textEn: 'Employ pronunciation patterns in communication',
      },
      {
        id: 'kv1035-4',
        code: '4',
        category: 'Academic Language',
        textNo: 'Lytte til, forstå og bruke faglig språk i arbeid med egne muntlige og skriftlige tekster',
        textEn: 'Listen to, understand, and use academic language when working on own oral and written texts',
      },
      {
        id: 'kv1035-5',
        code: '5',
        category: 'Fluency & Nuance',
        textNo: 'Uttrykke seg nyansert og presist med flyt og sammenheng, med bruk av idiomatiske uttrykk og varierte setningsstrukturer tilpasset formål, mottaker og situasjon',
        textEn: 'Express oneself in a nuanced and precise manner with fluency and coherence, using idiomatic expressions and varied sentence structures adapted to purpose, recipient, and situation',
      },
      {
        id: 'kv1035-6',
        code: '6',
        category: 'Interaction',
        textNo: 'Innlede, holde i gang og avslutte samtaler og diskusjoner om ulike emner',
        textEn: 'Initiate, maintain, and conclude conversations and discussions on various topics',
      },
      {
        id: 'kv1035-7',
        code: '7',
        category: 'Listening & Comprehension',
        textNo: 'Forstå hovedinnhold og detaljer i ulike typer muntlige tekster om allmenne og faglige emner',
        textEn: 'Understand the main content and details of various types of oral texts about general and academic topics',
      },
      {
        id: 'kv1035-8',
        code: '8',
        category: 'Reading & Critical Sources',
        textNo: 'Lese og forstå ulike typer tekster av ulik lengde om ulike emner, og kritisk vurdere kilders pålitelighet',
        textEn: 'Read and understand different types of texts of varying lengths about various topics, and critically assess the reliability of sources',
      },
      {
        id: 'kv1035-9',
        code: '9',
        category: 'Writing & Reflection',
        textNo: 'Skrive ulike typer formelle og uformelle tekster, inkludert sammensatte tekster, med struktur og sammenheng som beskriver, drøfter, begrunner og reflekterer, tilpasset formål, mottaker og situasjon',
        textEn: 'Write different types of formal and informal texts, including multimodal texts, with structure and coherence that describe, discuss, justify, and reflect, adapted to purpose, recipient, and situation',
      },
      {
        id: 'kv1035-10',
        code: '10',
        category: 'Revision & Craft',
        textNo: 'Vurdere og bearbeide egne tekster ut fra faglige kriterier og kunnskap om språk',
        textEn: 'Evaluate and revise own texts based on academic criteria and linguistic knowledge',
      },
      {
        id: 'kv1035-11',
        code: '11',
        category: 'Global English',
        textNo: 'Beskrive sentrale trekk ved framveksten av engelsk som et globalt språk',
        textEn: 'Describe key features of the development of English as a global language',
      },
      {
        id: 'kv1035-12',
        code: '12',
        category: 'Society & History',
        textNo: 'Utforske og reflektere over mangfold og samfunnsforhold i den engelskspråklige verden ut fra historiske sammenhenger',
        textEn: 'Explore and reflect on diversity and social conditions in the English-speaking world based on historical contexts',
      },
      {
        id: 'kv1035-13',
        code: '13',
        category: 'Culture & Media',
        textNo: 'Diskutere og reflektere over form, innhold og virkemidler i engelskspråklige kulturelle uttrykksformer fra ulike medier, inkludert musikk, film og spill',
        textEn: 'Discuss and reflect on form, content, and literary devices in English-language cultural expressions from various media, including music, film, and gaming',
      },
    ],
  },
  vocational: {
    id: 'vocational',
    title: 'Vocational Programs (Yrkesfaglige)',
    subtitle: 'Vg1 & Vg2 English • ENG01-06 (kv1034)',
    code: 'kv1034',
    url: 'https://www.udir.no/lk20/eng01-06/kompetansemaal-og-vurdering/kv1034',
    aims: [
      {
        id: 'kv1034-1',
        code: '1',
        category: 'Learning & Digital',
        textNo: 'Bruke varierte språklæringsstrategier og digitale ressurser for å videreutvikle egen engelskkompetanse',
        textEn: 'Use varied language learning strategies and digital resources to develop own English proficiency',
      },
      {
        id: 'kv1034-2',
        code: '2',
        category: 'Work Terminology',
        textNo: 'Forstå og bruke fagterminologi muntlig og skriftlig i arbeidssituasjoner',
        textEn: 'Understand and use vocational terminology orally and in writing in workplace situations',
      },
      {
        id: 'kv1034-3',
        code: '3',
        category: 'Workplace Communication',
        textNo: 'Uttrykke seg nyansert og presist med flyt og sammenheng, inkludert idiomatiske uttrykk og varierte setningsstrukturer, tilpasset formål, mottaker og situasjon',
        textEn: 'Express oneself with nuance and precision with fluency and coherence, tailored to purpose, recipient, and situation',
      },
      {
        id: 'kv1034-4',
        code: '4',
        category: 'Vocational Discussions',
        textNo: 'Gjøre rede for andres argumentasjon og bruke og følge opp andres innspill i samtaler og diskusjoner om yrkesrelevante emner',
        textEn: 'Account for others’ arguments and build upon input in conversations and discussions on vocationally relevant topics',
      },
      {
        id: 'kv1034-5',
        code: '5',
        category: 'Language Connections',
        textNo: 'Bruke kunnskap om sammenhenger mellom engelsk og andre språk eleven kjenner til i egen språklæring',
        textEn: 'Apply knowledge of connections between English and other familiar languages in language learning',
      },
      {
        id: 'kv1034-6',
        code: '6',
        category: 'Grammar & Text',
        textNo: 'Bruke kunnskap om grammatikk og tekststruktur i arbeid med egne muntlige og skriftlige tekster',
        textEn: 'Apply knowledge of grammar and text structure when working on own oral and written texts',
      },
      {
        id: 'kv1034-7',
        code: '7',
        category: 'Text Analysis',
        textNo: 'Lese, diskutere og reflektere over innhold og virkemidler i ulike typer tekster, inkludert selvvalgte tekster',
        textEn: 'Read, discuss, and reflect on content and literary devices in different types of texts, including self-selected texts',
      },
      {
        id: 'kv1034-8',
        code: '8',
        category: 'Technical Documentation',
        textNo: 'Lese og sammenfatte faglig innhold fra engelskspråklig dokumentasjon',
        textEn: 'Read and summarize technical and vocational content from English-language manuals and documentation',
      },
      {
        id: 'kv1034-9',
        code: '9',
        category: 'Critical Source Evaluation',
        textNo: 'Lese og sammenligne ulike sakprosatekster om samme emne fra forskjellige kilder og kritisk vurdere hvor pålitelige kildene er',
        textEn: 'Read and compare non-fiction texts on the same topic from different sources and critically evaluate source reliability',
      },
      {
        id: 'kv1034-10',
        code: '10',
        category: 'Source Usage',
        textNo: 'Bruke ulike kilder på en kritisk, hensiktsmessig og etterrettelig måte',
        textEn: 'Use diverse sources in a critical, appropriate, and accountable manner',
      },
      {
        id: 'kv1034-11',
        code: '11',
        category: 'Vocational Documentation',
        textNo: 'Skape yrkesrelevante tekster med struktur og sammenheng som beskriver og dokumenterer eget arbeid tilpasset formål, mottaker og situasjon',
        textEn: 'Create vocationally relevant structured texts that describe and document own work, adapted to purpose, recipient, and situation',
      },
      {
        id: 'kv1034-12',
        code: '12',
        category: 'Revision & Criteria',
        textNo: 'Vurdere og bearbeide egne tekster ut fra faglige kriterier og kunnskap om språk',
        textEn: 'Evaluate and revise own texts based on professional criteria and linguistic knowledge',
      },
      {
        id: 'kv1034-13',
        code: '13',
        category: 'Working Language',
        textNo: 'Beskrive sentrale trekk ved framveksten av engelsk som arbeidsspråk',
        textEn: 'Describe key features of the emergence and role of English as an international working language',
      },
      {
        id: 'kv1034-14',
        code: '14',
        category: 'Global Diversity',
        textNo: 'Utforske og reflektere over mangfold og samfunnsforhold i den engelskspråklige verden ut fra historiske sammenhenger',
        textEn: 'Explore and reflect on diversity and social conditions in the English-speaking world based on historical contexts',
      },
      {
        id: 'kv1034-15',
        code: '15',
        category: 'Culture & Gaming',
        textNo: 'Diskutere og reflektere over form, innhold og virkemidler i engelskspråklige kulturelle uttrykksformer fra ulike medier, inkludert musikk, film og spill',
        textEn: 'Discuss and reflect on form, content, and devices in English cultural expressions across media, including music, film, and games',
      },
    ],
  },
};
