import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// 2500vh scroll length — từ CSS phân tích được
export const TOTAL_SCROLL_VH = 2500

export const useScrollStore = defineStore('scroll', () => {

  /* ─── State ──────────────────────────────────────────────── */
  const scrollY           = ref(0)
  const scrollProgress    = ref(0)   // 0 → 1
  const totalScrollHeight = ref(0)   // px (set sau khi mount)
  const isScrolling       = ref(false)
  const direction         = ref(1)   //  1 = xuống, -1 = lên
  const currentChapter    = ref(0)   // index chapter hiện tại
  const scrollerEl        = ref(null)

  let _lastY       = 0
  let _stopTimer   = null

  /* ─── Computed ───────────────────────────────────────────── */
  const progressPercent = computed(() =>
    +(scrollProgress.value * 100).toFixed(2)
  )

  // Giá trị normalized cho từng đoạn animation (0→1)
  const sectionProgress = computed(() => {
    const p = scrollProgress.value
    return {
      preloader:    clamp01(remap(p, 0,    0.02)),
      intro:        clamp01(remap(p, 0.02, 0.08)),
      globe:        clamp01(remap(p, 0.08, 0.95)),
      outro:        clamp01(remap(p, 0.95, 1.0)),
    }
  })

  /* ─── Actions ────────────────────────────────────────────── */
  function setScrollerEl(el) { scrollerEl.value = el }
  function setTotalHeight(h) { totalScrollHeight.value = h }

  function onScroll(y) {
    direction.value = y >= _lastY ? 1 : -1
    _lastY          = y
    scrollY.value   = y

    if (totalScrollHeight.value > 0) {
      scrollProgress.value = clamp01(y / totalScrollHeight.value)
    }

    isScrolling.value = true
    clearTimeout(_stopTimer)
    _stopTimer = setTimeout(() => { isScrolling.value = false }, 150)
  }

  function setCurrentChapter(idx) { currentChapter.value = idx }

  function scrollTo(targetY, smooth = true) {
    scrollerEl.value?.scrollTo({
      top: targetY,
      behavior: smooth ? 'smooth' : 'instant',
    })
  }

  /* ─── Helpers ────────────────────────────────────────────── */
  function clamp01(v)           { return Math.min(1, Math.max(0, v)) }
  function remap(v, min, max)   { return (v - min) / (max - min) }

  return {
    scrollY, scrollProgress, totalScrollHeight,
    isScrolling, direction, currentChapter, scrollerEl,
    progressPercent, sectionProgress,
    setScrollerEl, setTotalHeight, onScroll,
    setCurrentChapter, scrollTo,
  }
})
