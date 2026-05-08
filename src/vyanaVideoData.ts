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

const MICRO_ORDER = ['Gota', 'Vaishnodevi', 'Shela', 'Thaltej', 'Bopal'] as const;

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
  'Untitled design (1).mp4',
  'Untitled design (2).mp4',
  'Untitled design.mp4',
  'WhatsApp Video 2026-05-07 at 1.02.58 PM.mp4',
  'WhatsApp Video 2026-05-07 at 12.10.13 PM.mp4',
  'WhatsApp Video 2026-05-07 at 12.33.26 PM.mp4',
  'WhatsApp Video 2026-05-07 at 12.36.54 PM.mp4',
  'WhatsApp Video 2026-05-07 at 12.38.40 PM.mp4',
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

function distributeUrls(urls: string[], locationIndex: number, locationCount: number, take: number): string[] {
  if (urls.length === 0) return [];
  const out: string[] = [];
  for (let j = 0; j < take; j++) {
    const idx = locationIndex + j * locationCount;
    out.push(urls[idx % urls.length]);
  }
  return out;
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

function buildClipsForMicro(
  areaTitle: string,
  areaDesc: string,
  locationIndex: number,
  locationCount: number,
  pool: string[],
): PropertyClip[] {
  const urls = distributeUrls(pool, locationIndex, locationCount, CLIPS_PER_MICRO);
  return urls.map((videoSrc, clipSlot) => {
    const meta = makeClipMeta(areaTitle, areaDesc, clipSlot);
    return {
      id: `${areaTitle}-clip${clipSlot}`,
      videoSrc,
      ...meta,
    };
  });
}

export function residentialClipsByTitle(title: string, areaDesc: string): PropertyClip[] {
  const idx = MICRO_ORDER.indexOf(title as (typeof MICRO_ORDER)[number]);
  if (idx < 0) return [];
  return buildClipsForMicro(title, areaDesc, idx, MICRO_ORDER.length, RESIDENTIAL_URLS);
}

export function commercialClipsByTitle(title: string, areaDesc: string): PropertyClip[] {
  const idx = MICRO_ORDER.indexOf(title as (typeof MICRO_ORDER)[number]);
  if (idx < 0) return [];
  return buildClipsForMicro(title, areaDesc, idx, MICRO_ORDER.length, COMMERCIAL_URLS);
}

export function industrialClipsByTitle(title: string, areaDesc: string): PropertyClip[] {
  const locationCount = 2;
  const idx = title === 'Naroda' ? 0 : title === 'Sanand' ? 1 : -1;
  if (idx < 0) return [];
  const take = 2;
  const urls = distributeUrls(INDUSTRIAL_URLS, idx, locationCount, take);
  return urls.map((videoSrc, clipSlot) => {
    const meta = makeClipMeta(title, areaDesc, clipSlot);
    return {
      id: `${title}-ind-${clipSlot}`,
      videoSrc,
      ...meta,
    };
  });
}
