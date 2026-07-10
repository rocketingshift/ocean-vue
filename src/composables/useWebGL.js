// src/composables/useWebGL.js
import { onMounted, onBeforeUnmount } from 'vue'
import { OceanScene }     from '@/webgl/Scene.js'
import { useScrollStore } from '@/stores/useScrollStore.js'

// Module-level singletons (survive component re-renders)
let _scene = null
let _rafId = null

export function useWebGL (canvasRef) {
  const scrollStore = useScrollStore()

  // ── RAF Loop ───────────────────────────────────────────────
  function loop () {
    // scrollStore.scrollProgress is a Pinia getter → plain number 0→1
    const progress = scrollStore.scrollProgress ?? 0

    if (_scene) {
      try {
        _scene.update(progress)
      } catch (err) {
        // Log once, don't let errors stop the loop
        console.warn('[WebGL loop]', err.message)
      }
    }

    _rafId = requestAnimationFrame(loop)
  }

  function onResize () {
    if (_scene) _scene.resize()
  }

  // ── Lifecycle ──────────────────────────────────────────────
  onMounted(() => {
    if (!canvasRef.value) {
      console.error('[useWebGL] canvas ref is null')
      return
    }

    // Singleton: reuse if already created (hot reload / navigation)
    _scene = OceanScene.getInstance(canvasRef.value)

    window.addEventListener('resize', onResize, { passive: true })

    // Start RAF (cancel any previous loop first)
    if (_rafId) cancelAnimationFrame(_rafId)
    _rafId = requestAnimationFrame(loop)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('resize', onResize)
    // Cancel RAF but keep _scene alive (singleton)
    if (_rafId) {
      cancelAnimationFrame(_rafId)
      _rafId = null
    }
  })

  return {
    get scene () { return _scene }
  }
}
