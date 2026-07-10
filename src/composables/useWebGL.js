import { ref, onUnmounted } from 'vue'
import { useWebGLStore } from '@/stores/useWebGLStore'
import { useScrollStore } from '@/stores/useScrollStore'

// ── Singleton state (persist across HMR) ─────────────────────────────────────
let _scene         = null
let _rafId         = null
let _isInitialized = false

export function useWebGL(canvas) {
  const webglStore  = useWebGLStore()
  const scrollStore = useScrollStore()
  const isReady     = ref(false)

  // ── Init ────────────────────────────────────────────────────────────────────

  async function init() {
    if (_isInitialized) {
      console.log('[useWebGL] already initialized, skip')
      return
    }
    _isInitialized = true
    console.log('[useWebGL] initializing...')

    try {
      // Dynamic import để tránh SSR issues
      const { OceanScene } = await import('@/webgl/Scene.js')
      _scene = new OceanScene()
      _scene.mount(canvas)

      // Bắt đầu render loop ngay (trước khi models load xong)
      _startLoop()

      // Poll isReady từ Scene
      _pollReady()

      // Fallback: force ready sau 5s dù models chưa load
      setTimeout(() => {
        if (!isReady.value) {
          console.warn('[useWebGL] ⚠️ fallback: forcing isReady after 5s')
          _setReady()
        }
      }, 5000)

    } catch (err) {
      console.error('[useWebGL] ❌ init error:', err)
      _setReady() // Đừng để UI treo nếu WebGL lỗi
    }
  }

  // ── Readiness ────────────────────────────────────────────────────────────────

  function _pollReady() {
    const check = () => {
      if (!_scene) return
      if (_scene.isReady && !isReady.value) {
        _setReady()
        return
      }
      if (!isReady.value) {
        requestAnimationFrame(check)
      }
    }
    requestAnimationFrame(check)
  }

  function _setReady() {
    isReady.value = true
    webglStore.setReady(true)
    console.log('[useWebGL] ✅ isReady = true')
  }

  // ── RAF Loop ─────────────────────────────────────────────────────────────────

  function _startLoop() {
    if (_rafId) return // đã chạy rồi

    const tick = () => {
      if (_scene) {
        try {
          // scrollProgress từ store — nếu chưa có thì dùng 0
          const progress = scrollStore.scrollProgress ?? 0
          _scene.update(progress)
        } catch (err) {
          // Log warning nhưng KHÔNG dừng loop
          console.warn('[useWebGL] tick error (loop continues):', err.message)
        }
      }
      _rafId = requestAnimationFrame(tick)
    }

    _rafId = requestAnimationFrame(tick)
    console.log('[useWebGL] RAF loop started')
  }

  function stop() {
    if (_rafId) {
      cancelAnimationFrame(_rafId)
      _rafId = null
      console.log('[useWebGL] RAF loop stopped')
    }
  }

  // ── Cleanup ──────────────────────────────────────────────────────────────────

  onUnmounted(() => {
    stop()
    if (_scene) {
      _scene.destroy()
      _scene = null
    }
    _isInitialized = false
    console.log('[useWebGL] cleanup done')
  })

  return { init, stop, isReady }
}
