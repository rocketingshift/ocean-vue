import { onMounted, onUnmounted } from 'vue'
import { useScrollStore, TOTAL_SCROLL_VH } from '@/stores/useScrollStore'
import { useAppStore } from '@/stores/useAppStore'
import { getChapterByProgress } from '@/data/chapters'

export function useScroller(scrollerRef) {
  const scrollStore = useScrollStore()
  const appStore    = useAppStore()

  /* ─── Scroll handler ───────────────────────────────────── */
  function onScroll(e) {
    scrollStore.onScroll(e.target.scrollTop)
    _syncChapter()
  }

  function _syncChapter() {
    const ch = getChapterByProgress(scrollStore.scrollProgress)
    if (ch.id !== scrollStore.currentChapter) {
      scrollStore.setCurrentChapter(ch.id)
    }
  }

  /* ─── Total scroll height ──────────────────────────────── */
  function _computeTotalHeight() {
    const totalPx = (TOTAL_SCROLL_VH / 100) * window.innerHeight
    scrollStore.setTotalHeight(totalPx)
  }

  /* ─── Lifecycle ────────────────────────────────────────── */
  onMounted(() => {
    if (!scrollerRef.value) return
    scrollStore.setScrollerEl(scrollerRef.value)
    _computeTotalHeight()
    scrollerRef.value.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', _computeTotalHeight)
  })

  onUnmounted(() => {
    scrollerRef.value?.removeEventListener('scroll', onScroll)
    window.removeEventListener('resize', _computeTotalHeight)
  })

  return { scrollStore }
}
