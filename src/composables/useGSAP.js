import { gsap } from 'gsap'
import { watch } from 'vue'
import { useScrollStore } from '@/stores/useScrollStore'

export function useGSAP() {
  const scrollStore = useScrollStore()
  const _cleanups   = []

  /**
   * Drive một animation theo scroll progress
   * scrollStart, scrollEnd = 0→1 (relative to tổng scroll)
   */
  function onScrollProgress({ scrollStart, scrollEnd, onUpdate, ease = 'power1.out' }) {
    const proxy = { v: 0 }

    const stop = watch(
      () => scrollStore.scrollProgress,
      (p) => {
        const t = _clamp01((p - scrollStart) / (scrollEnd - scrollStart))
        gsap.to(proxy, {
          v: t,
          duration: 0.08,
          ease,
          overwrite: true,
          onUpdate: () => onUpdate(proxy.v),
        })
      },
    )
    _cleanups.push(stop)
    return stop
  }

  /** Clip-path reveal */
  function reveal(el, opts = {}) {
    if (!el) return
    return gsap.fromTo(el,
      { clipPath: 'inset(0 100% 0 0)', opacity: 0 },
      {
        clipPath: 'inset(0 0% 0 0)',
        opacity: 1,
        duration: opts.duration ?? 1.4,
        delay:    opts.delay    ?? 0,
        ease:     opts.ease     ?? 'power2.inOut',
      },
    )
  }

  /** Letter-by-letter title reveal */
  function revealChars(el, opts = {}) {
    if (!el) return
    const chars = [...el.querySelectorAll('.--char')]
    return gsap.fromTo(chars,
      { yPercent: 110, opacity: 0 },
      {
        yPercent: 0,
        opacity:  1,
        duration: 0.8,
        delay:    opts.delay ?? 0,
        stagger:  0.03,
        ease:     'power3.out',
      },
    )
  }

  /** Line reveal (overflow clip) */
  function revealLines(el, opts = {}) {
    if (!el) return
    const lines = [...el.querySelectorAll('.--line')]
    return gsap.fromTo(lines,
      { yPercent: 100 },
      {
        yPercent: 0,
        duration: 0.9,
        delay:    opts.delay ?? 0,
        stagger:  0.06,
        ease:     'power3.out',
      },
    )
  }

  function dispose() { _cleanups.forEach(fn => fn()) }

  function _clamp01(v) { return Math.min(1, Math.max(0, v)) }

  return { onScrollProgress, reveal, revealChars, revealLines, dispose }
}
