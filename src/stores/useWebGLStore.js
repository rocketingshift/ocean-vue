import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useWebGLStore = defineStore('webgl', () => {

  /* ─── State ──────────────────────────────────────────────── */
  const isReady       = ref(false)
  const isRendering   = ref(false)
  const loadedCount   = ref(0)
  const totalAssets   = ref(0)
  const activeMarker  = ref(null)   // earth marker id (0–6)
  const errors        = ref([])

  // References tới Three.js objects (non-reactive, dùng shallowRef)
  const sceneRef    = ref(null)
  const cameraRef   = ref(null)
  const rendererRef = ref(null)

  /* ─── Computed ───────────────────────────────────────────── */
  const loadProgress = computed(() =>
    totalAssets.value > 0
      ? +(loadedCount.value / totalAssets.value).toFixed(3)
      : 0
  )
  const loadPercent  = computed(() => Math.round(loadProgress.value * 100))
  const hasError     = computed(() => errors.value.length > 0)

  /* ─── Actions ────────────────────────────────────────────── */
  function setScene(s)    { sceneRef.value    = s }
  function setCamera(c)   { cameraRef.value   = c }
  function setRenderer(r) { rendererRef.value = r }

  function setTotalAssets(n) { totalAssets.value = n }

  function incrementLoaded(n = 1) {
    loadedCount.value = Math.min(totalAssets.value, loadedCount.value + n)
  }

  function setReady(val)       { isReady.value      = val }
  function setRendering(val)   { isRendering.value  = val }
  function setActiveMarker(id) { activeMarker.value = id }

  function addError(err) {
    errors.value.push(String(err))
    console.error('[WebGL Error]', err)
  }

  function reset() {
    isReady.value      = false
    isRendering.value  = false
    loadedCount.value  = 0
    totalAssets.value  = 0
    activeMarker.value = null
    errors.value       = []
    sceneRef.value     = null
    cameraRef.value    = null
    rendererRef.value  = null
  }

  return {
    isReady, isRendering, loadedCount, totalAssets,
    activeMarker, errors, sceneRef, cameraRef, rendererRef,
    loadProgress, loadPercent, hasError,
    setScene, setCamera, setRenderer,
    setTotalAssets, incrementLoaded,
    setReady, setRendering, setActiveMarker,
    addError, reset,
  }
})
