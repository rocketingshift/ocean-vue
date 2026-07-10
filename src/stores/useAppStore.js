import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAppStore = defineStore('app', () => {

  /* ─── State ──────────────────────────────────────────────── */
  const isLoaded     = ref(false)  // WebGL + assets done
  const isIntroduced = ref(false)  // user clicked "Start"
  const isMobile     = ref(false)  // viewport < 1024px
  const isDebug      = ref(false)  // ?debug in URL
  const svh          = ref(0)      // small viewport height unit (px)
  const vh           = ref(0)      // viewport height unit (px)

  /* ─── Computed ───────────────────────────────────────────── */
  const readyToExperience = computed(() => isLoaded.value && isIntroduced.value)

  /* ─── Actions ────────────────────────────────────────────── */
  function init() {
    isDebug.value = window.location.search.includes('debug')
    _checkMobile()
    _setViewportUnits()
    window.addEventListener('resize', _onResize)
  }

  function destroy() {
    window.removeEventListener('resize', _onResize)
  }

  function setLoaded(val)     { isLoaded.value     = val }
  function setIntroduced(val) { isIntroduced.value = val }

  function _checkMobile() {
    isMobile.value = window.innerWidth < 1024
  }

  function _setViewportUnits() {
    const h = window.innerHeight
    svh.value = h * 0.01
    vh.value  = h * 0.01
    document.documentElement.style.setProperty('--svh', `${svh.value}px`)
    document.documentElement.style.setProperty('--vh',  `${vh.value}px`)
  }

  function _onResize() {
    _checkMobile()
    _setViewportUnits()
  }

  return {
    isLoaded, isIntroduced, isMobile, isDebug, svh, vh,
    readyToExperience,
    init, destroy, setLoaded, setIntroduced,
  }
})
