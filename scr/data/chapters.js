/**
 * chapters.js
 * Dữ liệu chapters — reconstruct từ CSS component names + earth_markers.json
 * scrollStart / scrollEnd = % của tổng scroll (0 → 1)
 */

export const TOTAL_SCROLL_VH = 2500

export const CHAPTERS = [
  {
    id:          0,
    slug:        'preloader',
    label:       null,
    scrollStart: 0,
    scrollEnd:   0.02,
    markerId:    null,
  },
  {
    id:          1,
    slug:        'introduction',
    label:       'Introduction',
    scrollStart: 0.02,
    scrollEnd:   0.10,
    markerId:    null,
  },
  {
    id:          2,
    slug:        'chapter-01',
    label:       'Chapter 01',
    scrollStart: 0.10,
    scrollEnd:   0.25,
    markerId:    0,   // earth_markers.json id 0
  },
  {
    id:          3,
    slug:        'chapter-02',
    label:       'Chapter 02',
    scrollStart: 0.25,
    scrollEnd:   0.40,
    markerId:    1,
  },
  {
    id:          4,
    slug:        'chapter-03',
    label:       'Chapter 03',
    scrollStart: 0.40,
    scrollEnd:   0.55,
    markerId:    2,
  },
  {
    id:          5,
    slug:        'chapter-04',
    label:       'Chapter 04',
    scrollStart: 0.55,
    scrollEnd:   0.68,
    markerId:    3,
  },
  {
    id:          6,
    slug:        'chapter-05',
    label:       'Chapter 05',
    scrollStart: 0.68,
    scrollEnd:   0.80,
    markerId:    4,
  },
  {
    id:          7,
    slug:        'chapter-06',
    label:       'Chapter 06',
    scrollStart: 0.80,
    scrollEnd:   0.92,
    markerId:    5,
  },
  {
    id:          8,
    slug:        'outro',
    label:       null,
    scrollStart: 0.92,
    scrollEnd:   1.0,
    markerId:    6,
  },
]

/**
 * Earth markers raw data từ earth_markers.json
 * pos = vị trí 3D trên sphere (unit vector)
 * orient = quaternion [x, y, z, w]
 */
export const EARTH_MARKERS = [
  { id: 0, pos: [-0.964,  0.207,  0.027], orient: [-0.068, -0.682, -0.064,  0.725] },
  { id: 1, pos: [-0.568, -0.469,  0.657], orient: [ 0.246, -0.325,  0.088,  0.909] },
  { id: 2, pos: [-0.752,  0.633,  0.078], orient: [-0.259, -0.611, -0.222,  0.714] },
  { id: 3, pos: [-0.203, -0.346,  0.901], orient: [ 0.162, -0.095,  0.016,  0.982] },
  { id: 4, pos: [ 0.303,  0.007,  0.939], orient: [-0.019,  0.167,  0.003,  0.986] },
  { id: 5, pos: [ 0.604, -0.144,  0.767], orient: [ 0.054,  0.338, -0.019,  0.939] },
  { id: 6, pos: [-0.676, -0.374,  0.613], orient: [ 0.169, -0.382,  0.071,  0.906] },
]

/**
 * Tìm chapter theo scroll progress (0→1)
 */
export function getChapterByProgress(progress) {
  return CHAPTERS.findLast(ch => progress >= ch.scrollStart) ?? CHAPTERS[0]
}
