import { ref, onMounted, onUnmounted } from 'vue'
import { useWebGLStore }  from '@/stores/useWebGLStore'
import { useScrollStore } from '@/stores/useScrollStore'

// ─── Module-level singleton ──────────────────────────────────────────────────
let _scene         = null
let _rafId         = null
let _isInitialized = false

export function useWebGL(canvasRef) {
  const webglStore  = useWebGLStore()
  const scrollStore = useScrollStore()
  const isReady     = ref(false)

  // ── Init ──────────────────────────────────────────────────────────────────

  async function init() {
    if (_isInitialized) return
    _isInitialized = true

    // ✅ DOM element — canvasRef là Vue Ref, cần .value
    const canvasEl = canvasRef?.value ?? canvasRef
    if (!canvasEl || !(canvasEl instanceof HTMLCanvasElement)) {
      console.error('[useWebGL] ❌ canvas không hợp lệ:', canvasEl)
      _setReady()
      return
    }

    try {
      const { OceanScene } = await import('@/webgl/Scene.js')

      // ✅ Khai báo tổng số assets TRƯỚC khi tạo scene
      //    → Preloader sẽ hiện 0% → 50% → 100% thay vì mãi 0%
      webglStore.setTotalAssets(2)

      _scene = new OceanScene({
        // ✅ Callback progress: mỗi model load xong → tăng store counter
        onProgress: (loaded, total) => {
          webglStore.incrementLoaded()
          console.log(`[useWebGL] 📦 Progress: ${loaded}/${total}`)
        },
      })

      _scene.mount(canvasEl)
      _startLoop()
      _pollReady()

      // Fallback: force ready sau 10s (earth.glb + clouds.glb ~800KB each)
      // Đủ thời gian ngay cả khi mạng chậm ở VN
      setTimeout(() => {
        if (!isReady.value) {
          console.warn('[useWebGL] ⏱ 10s Timeout — forcing isReady')
          _setReady()
        }
      }, 10000)

    } catch (err) {
      console.error('[useWebGL] ❌ Init lỗi:', err)
      _setReady() // Đừng treo UI
    }
  }

  // ── Readiness polling ──────────────────────────────────────────────────────

  function _pollReady() {
    const check = () => {
      if (_scene?.isReady && !isReady.value) {
        _setReady()
        return
      }
      if (!isReady.value) requestAnimationFrame(check)
    }
    requestAnimationFrame(check)
  }

  function _setReady() {
    isReady.value = true
    webglStore.setReady(true)
    console.log('[useWebGL] ✅ isReady = true → preloader will dismiss')
  }

  // ── RAF loop ───────────────────────────────────────────────────────────────

  function _startLoop() {
    if (_rafId) return

    const tick = () => {
      if (_scene) {
        try {
          _scene.update(scrollStore.scrollProgress ?? 0)
        } catch (err) {
          console.warn('[useWebGL] tick lỗi (non-fatal):', err.message)
        }
      }
      _rafId = requestAnimationFrame(tick)
    }

    _rafId = requestAnimationFrame(tick)
    console.log('[useWebGL] ▶ RAF loop bắt đầu')
  }

  function stop() {
    if (_rafId) {
      cancelAnimationFrame(_rafId)
      _rafId = null
    }
  }

  // ── Lifecycle ──────────────────────────────────────────────────────────────

  // ✅ AUTO-INIT khi canvas mount vào DOM
  onMounted(() => {
    console.log('[useWebGL] onMounted — calling init()')
    init()
  })

  onUnmounted(() => {
    stop()
    if (_scene) {
      _scene.destroy()
      _scene = null
    }
    _isInitialized = false
    console.log('[useWebGL] 🧹 cleanup done')
  })

  return { stop, isReady }
}
