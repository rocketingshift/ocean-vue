import * as THREE from 'three'

export class OceanRenderer {
  constructor() {
    // ✅ KHÔNG tạo renderer ở đây — chờ mount() để tránh WebGL context thừa
    this._renderer = null
  }

  _applySettings() {
    if (!this._renderer) return
    this._renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this._renderer.setSize(window.innerWidth, window.innerHeight)
    this._renderer.toneMapping         = THREE.ACESFilmicToneMapping
    this._renderer.toneMappingExposure = 1.2
    this._renderer.outputColorSpace    = THREE.SRGBColorSpace
  }

  get domElement() {
    return this._renderer?.domElement ?? null
  }

  /**
   * Tạo WebGL renderer và bind vào canvas của Vue component.
   * Chỉ tạo context 1 lần, không tạo trước trong constructor.
   * @param {HTMLCanvasElement} canvas
   */
  mount(canvas) {
    if (!canvas) {
      console.error('[Renderer] ❌ canvas null — abort mount')
      return
    }

    // Dispose renderer cũ nếu có (re-mount)
    if (this._renderer) {
      try {
        this._renderer.dispose()
        this._renderer.forceContextLoss()
      } catch (_) {}
      this._renderer = null
    }

    this._renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
    })

    this._applySettings()
    console.log('[Renderer] ✅ mounted to canvas')
  }

  render(scene, camera) {
    // Guard: nếu chưa mount hoặc camera chưa có
    if (!this._renderer || !camera) return
    this._renderer.render(scene, camera)
  }

  resize() {
    if (!this._renderer) return
    this._renderer.setSize(window.innerWidth, window.innerHeight)
    this._renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  }

  destroy() {
    if (!this._renderer) return
    try {
      this._renderer.dispose()
      this._renderer.forceContextLoss()
    } catch (_) {}
    this._renderer = null
    console.log('[Renderer] destroyed')
  }
}
