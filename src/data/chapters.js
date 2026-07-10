/**
 * OceanX 2025 Year in Review — Chapter & Earth Marker Data
 *
 * pos    : vị trí trên mặt cầu đơn vị {x, y, z}
 * orient : quaternion xoay trái đất để vùng đó hướng về phía viewer
 */

export const EARTH_MARKERS = [
  // 0 — Atlantic Overview (0°N, 30°W)
  {
    id: 0,
    pos:    { x: -0.500, y:  0.000, z:  0.866 },
    orient: { x:  0.000, y:  0.259, z:  0.000, w:  0.966 },
  },
  // 1 — Arctic (80°N, 20°E)
  {
    id: 1,
    pos:    { x:  0.060, y:  0.985, z:  0.163 },
    orient: { x: -0.633, y: -0.133, z: -0.112, w:  0.754 },
  },
  // 2 — Mediterranean (36°N, 18°E)
  {
    id: 2,
    pos:    { x:  0.250, y:  0.588, z:  0.769 },
    orient: { x: -0.305, y: -0.149, z: -0.048, w:  0.939 },
  },
  // 3 — Indian Ocean (15°S, 70°E)
  {
    id: 3,
    pos:    { x:  0.908, y: -0.259, z:  0.330 },
    orient: { x:  0.107, y: -0.569, z:  0.075, w:  0.812 },
  },
  // 4 — Pacific (0°N, 150°W)
  {
    id: 4,
    pos:    { x: -0.500, y:  0.000, z: -0.866 },
    orient: { x:  0.000, y:  0.966, z:  0.000, w:  0.259 },
  },
  // 5 — Antarctic (70°S, 0°E)
  {
    id: 5,
    pos:    { x:  0.000, y: -0.940, z:  0.342 },
    orient: { x:  0.574, y:  0.000, z:  0.000, w:  0.819 },
  },
  // 6 — Red Sea (20°N, 38°E)
  {
    id: 6,
    pos:    { x:  0.579, y:  0.342, z:  0.741 },
    orient: { x: -0.164, y: -0.321, z: -0.057, w:  0.931 },
  },
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
 * Fallback: chapter cuối cùng nếu progress = 1.0 chính xác.
 */
export function getChapterByProgress(progress) {
  for (const ch of CHAPTERS) {
    if (progress >= ch.progress.start && progress < ch.progress.end) {
      return ch
    }
  }
  return CHAPTERS[CHAPTERS.length - 1]
}
