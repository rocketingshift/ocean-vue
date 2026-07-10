import { onMounted, onUnmounted } from 'vue'
import { useWebGLStore }  from '@/stores/useWebGLStore'
import { useScrollStore } from '@/stores/useScrollStore'
import { useAppStore }    from '@/stores/useAppStore'
import { OceanScene }     from '@/webgl/Scene'
import { TOTAL_ASSETS }   from '@/config/assets'

let _scene = null  // singleton WebGL scene

export function useWebGL(canvasRef) {
  const webglStore  = useWebGLStore()
  const scrollStore = useScrollStore()
  const appStore    = useAppStore()
  let   _raf        = null

  /* ─── Init ─────────────────────────────────────────────── */
  async function init() {
    if (!canvasRef.value) return
    webglStore.setTotalAssets(TOTAL_ASSETS)

    try {
      _scene = new OceanScene(canvasRef.value, {
        debug:      appStore.isDebug,
        onProgress: () => webglStore.incrementLoaded(1),
        onError:    (e) => webglStore.addError(e),
      })

      await _scene.init()

      webglStore.setScene(_scene.scene)
      webglStore.setCamera(_scene.camera.instance)
      webglStore.setRenderer(_scene.renderer.instance)
      webglStore.setReady(true)
      appStore.setLoaded(true)

      _startLoop()
    } catch (e) {
      webglStore.addError(e)
    }
  }

  /* ─── RAF loop ─────────────────────────────────────────── */
  function _startLoop() {
    webglStore.setRendering(true)
    const tick = () => {
      _raf = requestAnimationFrame(tick)
      _scene?.update(scrollStore.scrollProgress)
    }
    _raf = requestAnimationFrame(tick)
  }

  function _stopLoop() {
    if (_raf) cancelAnimationFrame(_raf)
    _raf = null
    webglStore.setRendering(false)
  }

  /* ─── Resize ───────────────────────────────────────────── */
  function _onResize() {
    _scene?.resize(window.innerWidth, window.innerHeight)
  }

  /* ─── Lifecycle ────────────────────────────────────────── */
  onMounted(() => {
    init()
    window.addEventListener('resize', _onResize)
  })

  onUnmounted(() => {
    _stopLoop()
    _scene?.destroy()
    _scene = null
    webglStore.reset()
    window.removeEventListener('resize', _onResize)
  })

  return { webglStore }
}
