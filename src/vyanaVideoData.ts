import { vyanaMp4Url } from './vyanaVideoPaths';

const r = (f: string) => vyanaMp4Url('residantial', f);
const c = (f: string) => vyanaMp4Url('comracial', f);
const i = (f: string) => vyanaMp4Url('industrial', f);

export type PropertyClip = {
  id: string;
  videoSrc: string;
  name: string;
  tagline: string;
  specs: string[];
  description: string;
  highlights: string[];
};

const MICRO_ORDER = ['Iscon', 'Vaishnodevi', 'Shela', 'Thaltej', 'Bopal'] as const;

/**
 * Every `.mp4` under `public/video for vyana/residantial/` (alphabetical).
 * Re-run `ls` after adding files and sync this list.
 */
export const RESIDENTIAL_FOLDER_FILENAMES = [
  'download (2).mp4',
  'download (3).mp4',
  'download (4).mp4',
  'download (43).mp4',
  'download (5).mp4',
  'download.mp4',
].sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));

const RESIDENTIAL_URLS = RESIDENTIAL_FOLDER_FILENAMES.map((f) => r(f));

/** Numeric c1…c11 */
export const COMMERCIAL_FOLDER_FILENAMES = Array.from({ length: 11 }, (_, n) => `c${n + 1}.mp4`);
const COMMERCIAL_URLS = COMMERCIAL_FOLDER_FILENAMES.map((f) => c(f));

export const INDUSTRIAL_FOLDER_FILENAMES = [
  'Vyana Reality (1).mp4',
  'Vyana Reality (2).mp4',
  'Vyana Reality (3).mp4',
  'Vyana Reality (4).mp4',
  'Vyana Reality (5).mp4',
];
const INDUSTRIAL_URLS = INDUSTRIAL_FOLDER_FILENAMES.map((f) => i(f));

const CLIPS_PER_MICRO = 3;

const MASTER_POOL = [...RESIDENTIAL_URLS, ...COMMERCIAL_URLS, ...INDUSTRIAL_URLS];

function getGlobalClips(
  areaTitle: string,
  areaDesc: string,
  basePoolIndex: number,
  count: number,
  prefix: string
): PropertyClip[] {
  const clips: PropertyClip[] = [];
  for (let j = 0; j < count; j++) {
    const poolIdx = basePoolIndex + j;
    if (poolIdx >= MASTER_POOL.length) break;

    const videoSrc = MASTER_POOL[poolIdx];
    const meta = makeClipMeta(areaTitle, areaDesc, j);
    clips.push({
      id: `${prefix}-${areaTitle}-${j}`,
      videoSrc,
      ...meta,
    });
  }
  return clips;
}

function makeClipMeta(areaTitle: string, areaDesc: string, clipSlot: number): Omit<PropertyClip, 'id' | 'videoSrc'> {
  return {
    name: `${areaTitle} · Estate ${String(clipSlot + 1).padStart(2, '0')}`,
    tagline: 'Private inventory · Vyana curated',
    specs: ['Configuration on request', 'Discreet site access', 'Documentation desk-ready'],
    description: `${areaDesc}\n\nA Vyana-qualified asset in the ${areaTitle} micro-market. Short-listed for buyers who value precision over volume — schedule a private walkthrough or request the inventory memo.`,
    highlights: [
      'Curated only after title & corridor checks',
      'Concierge for NRI / HNI timelines',
      'Pricing aligned to live micro-market comps',
    ],
  };
}

export function residentialClipsByTitle(title: string, areaDesc: string): PropertyClip[] {
  const idx = MICRO_ORDER.indexOf(title as (typeof MICRO_ORDER)[number]);
  if (idx < 0) return [];
  // Assign 2 unique videos per residential location (0-9)
  return getGlobalClips(title, areaDesc, idx * 2, 2, 'res');
}

export function commercialClipsByTitle(title: string, areaDesc: string): PropertyClip[] {
  const idx = MICRO_ORDER.indexOf(title as (typeof MICRO_ORDER)[number]);
  if (idx < 0) return [];
  // Assign 2 unique videos per commercial location starting from index 10 (10-19)
  return getGlobalClips(title, areaDesc, 10 + idx * 2, 2, 'com');
}

export function industrialClipsByTitle(title: string, areaDesc: string): PropertyClip[] {
  const idx = title === 'Naroda' ? 0 : title === 'Sanand' ? 1 : -1;
  if (idx < 0) return [];
  // Assign 1 unique video per industrial location starting from index 20 (20-21)
  return getGlobalClips(title, areaDesc, 20 + idx, 1, 'ind');
}
