import * as THREE from 'three'

export class OceanRenderer {
  constructor() {
    // Tạo renderer với canvas nội bộ trước
    this._renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
    })

    this._applySettings()
  }

  _applySettings() {
    this._renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this._renderer.setSize(window.innerWidth, window.innerHeight)
    this._renderer.toneMapping        = THREE.ACESFilmicToneMapping
    this._renderer.toneMappingExposure = 1.2
    this._renderer.outputColorSpace   = THREE.SRGBColorSpace
  }

  get domElement() {
    return this._renderer.domElement
  }

  /**
   * Bind renderer tới <canvas> của Vue component.
   * Nếu canvas được cung cấp, dispose renderer cũ và tạo mới với canvas đó.
   * @param {HTMLCanvasElement} canvas
   */
  mount(canvas) {
    if (!canvas) return

    // Dispose renderer cũ
    try { this._renderer.dispose() } catch (_) {}

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
    this._renderer.render(scene, camera)
  }

  resize() {
    this._renderer.setSize(window.innerWidth, window.innerHeight)
    this._renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  }

  destroy() {
    try {
      this._renderer.dispose()
      this._renderer.forceContextLoss()
    } catch (_) {}
    console.log('[Renderer] destroyed')
  }
}
