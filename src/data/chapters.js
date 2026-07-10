// src/data/chapters.js

export const EARTH_MARKERS = [
  {
    id              : 'marker-pacific',
    label           : 'Pacific Route',
    pos             : [0.82,  0.12, -0.56],   // ← ARRAY, không phải object
    orient          : [0,     0,    0,     1], // ← ARRAY [x,y,z,w]
    chapterProgress : 0.10,
  },
  {
    id              : 'marker-suez',
    label           : 'Suez Canal',
    pos             : [0.51,  0.35,  0.79],
    orient          : [0,     0,     0,    1],
    chapterProgress : 0.25,
  },
  {
    id              : 'marker-singapore',
    label           : 'Singapore',
    pos             : [0.72, -0.05,  0.69],
    orient          : [0,     0,     0,    1],
    chapterProgress : 0.40,
  },
  {
    id              : 'marker-rotterdam',
    label           : 'Rotterdam',
    pos             : [0.21,  0.90,  0.38],
    orient          : [0,     0,     0,    1],
    chapterProgress : 0.55,
  },
  {
    id              : 'marker-la',
    label           : 'Los Angeles',
    pos             : [-0.94, 0.28,  0.20],
    orient          : [0,     0,     0,    1],
    chapterProgress : 0.70,
  },
  {
    id              : 'marker-dubai',
    label           : 'Dubai',
    pos             : [0.43,  0.28,  0.86],
    orient          : [0,     0,     0,    1],
    chapterProgress : 0.82,
  },
  {
    id              : 'marker-shanghai',
    label           : 'Shanghai',
    pos             : [0.60,  0.40,  0.69],
    orient          : [0,     0,     0,    1],
    chapterProgress : 0.92,
  },
]

export const CHAPTERS = [
  { id: 'intro',     title: 'Introduction',     progress: 0.00 },
  { id: 'chapter-1', title: 'Global Expansion', progress: 0.15 },
  { id: 'chapter-2', title: 'Key Routes',        progress: 0.30 },
  { id: 'chapter-3', title: 'Fleet Growth',      progress: 0.45 },
  { id: 'chapter-4', title: 'Sustainability',    progress: 0.60 },
  { id: 'chapter-5', title: 'Innovation',        progress: 0.75 },
  { id: 'chapter-6', title: 'Looking Ahead',     progress: 0.90 },
]

export function getChapterByProgress (progress) {
  let current = CHAPTERS[0]
  for (const ch of CHAPTERS) {
    if (progress >= ch.progress) current = ch
    else break
  }
  return current
}
