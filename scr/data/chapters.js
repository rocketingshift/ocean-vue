/**
 * OceanX 2025 Year in Review — Chapter & Earth Marker Data
 *
 * pos    : [x, y, z]    — vị trí trên mặt cầu đơn vị
 * orient : [x, y, z, w] — quaternion xoay trái đất (THREE.Quaternion order)
 */

export const EARTH_MARKERS = [
  // 0 — Atlantic Overview (0°N, 30°W)
  { id: 0, pos: [-0.500,  0.000,  0.866], orient: [ 0.000,  0.259,  0.000,  0.966] },
  // 1 — Arctic (80°N, 20°E)
  { id: 1, pos: [ 0.060,  0.985,  0.163], orient: [-0.633, -0.133, -0.112,  0.754] },
  // 2 — Mediterranean (36°N, 18°E)
  { id: 2, pos: [ 0.250,  0.588,  0.769], orient: [-0.305, -0.149, -0.048,  0.939] },
  // 3 — Indian Ocean (15°S, 70°E)
  { id: 3, pos: [ 0.908, -0.259,  0.330], orient: [ 0.107, -0.569,  0.075,  0.812] },
  // 4 — Pacific (0°N, 150°W)
  { id: 4, pos: [-0.500,  0.000, -0.866], orient: [ 0.000,  0.966,  0.000,  0.259] },
  // 5 — Antarctic (70°S, 0°E)
  { id: 5, pos: [ 0.000, -0.940,  0.342], orient: [ 0.574,  0.000,  0.000,  0.819] },
  // 6 — Red Sea (20°N, 38°E)
  { id: 6, pos: [ 0.579,  0.342,  0.741], orient: [-0.164, -0.321, -0.057,  0.931] },
]

export const CHAPTERS = [
  {
    id:       0,
    title:    'OceanX 2025',
    subtitle: 'Year in Review',
    color:    '#4fc3f7',
    progress: { start: 0.00, end: 0.14 },
    marker:   EARTH_MARKERS[0],
  },
  {
    id:       1,
    title:    'Arctic Frontier',
    subtitle: 'Mapping the Melting North',
    color:    '#b3e5fc',
    progress: { start: 0.14, end: 0.28 },
    marker:   EARTH_MARKERS[1],
  },
  {
    id:       2,
    title:    'Mediterranean Deep',
    subtitle: 'Ancient Seas, New Discoveries',
    color:    '#0288d1',
    progress: { start: 0.28, end: 0.42 },
    marker:   EARTH_MARKERS[2],
  },
  {
    id:       3,
    title:    'Indian Ocean Expedition',
    subtitle: 'Biodiversity Below the Surface',
    color:    '#006064',
    progress: { start: 0.42, end: 0.56 },
    marker:   EARTH_MARKERS[3],
  },
  {
    id:       4,
    title:    'Pacific Odyssey',
    subtitle: "Crossing the World's Largest Ocean",
    color:    '#00838f',
    progress: { start: 0.56, end: 0.70 },
    marker:   EARTH_MARKERS[4],
  },
  {
    id:       5,
    title:    'Antarctic Survey',
    subtitle: 'Ice, Life and Climate',
    color:    '#80deea',
    progress: { start: 0.70, end: 0.84 },
    marker:   EARTH_MARKERS[5],
  },
  {
    id:       6,
    title:    'Red Sea & Gulf',
    subtitle: 'Coral Corridors',
    color:    '#e91e63',
    progress: { start: 0.84, end: 1.00 },
    marker:   EARTH_MARKERS[6],
  },
]

/**
 * Trả về chapter ứng với scrollProgress [0, 1].
 */
export function getChapterByProgress(progress) {
  for (const ch of CHAPTERS) {
    if (progress >= ch.progress.start && progress < ch.progress.end) {
      return ch
    }
  }
  return CHAPTERS[CHAPTERS.length - 1]
}
