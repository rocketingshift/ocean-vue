import * as THREE    from 'three'
import { GLTFLoader }  from 'three/addons/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'
import { OceanRenderer } from './Renderer.js'
import { OceanCamera }   from './Camera.js'

// ─── Asset paths — VERIFIED từ GitHub API ───────────────────────────────────
// earth.glb: 803 KB | clouds.glb: 828 KB — cả hai tồn tại và đúng path
const ASSET_BASE = 'https://raw.githubusercontent.com/rocketingshift/ocean-destop/main/2025.oceanx.org/2025.oceanx.org'
const DRACO_PATH = 'https://www.gstatic.com/draco/versioned/decoders/1.5.6/'

const MODEL_EARTH  = `${ASSET_BASE}/webgl/models/earth.glb`
const MODEL_CLOUDS = `${ASSET_BASE}/webgl/models/clouds.glb`

export class OceanScene {
  /**
   * @param {Object}   [opts]
   * @param {Function} [opts.onProgress] - (loadedCount, totalCount) → void
   *   Gọi mỗi khi 1 model load xong (hoặc fail). Dùng để cập nhật store progress.
   */
  constructor({ onProgress } = {}) {
    this.scene    = new THREE.Scene()
    this.renderer = new OceanRenderer()
    this.camCtrl  = new OceanCamera()

    this._earth       = null
    this._clouds      = null
    this._loadedCount = 0
    this._totalModels = 2  // earth + clouds
    this._isReady     = false
    this._clock       = new THREE.Clock()

    // ✅ Progress callback — gọi khi model load xong
    this._onProgress = (typeof onProgress === 'function') ? onProgress : () => {}

    this._initBackground()
    this._initLights()
    this._initModels()

    this._onResize = this._handleResize.bind(this)
    window.addEventListener('resize', this._onResize)
  }

  // ── Setup ─────────────────────────────────────────────────────────────────

  _initBackground() {
    this.scene.background = new THREE.Color(0x000d15)
    this.scene.fog = new THREE.FogExp2(0x000d15, 0.008)
  }

  _initLights() {
    const ambient = new THREE.AmbientLight(0x304060, 1.5)
    this.scene.add(ambient)

    const sun = new THREE.DirectionalLight(0xffffff, 4)
    sun.position.set(5, 5, 5)
    this.scene.add(sun)

    const rim = new THREE.DirectionalLight(0x2244aa, 1.5)
    rim.position.set(-4, 1, -4)
    this.scene.add(rim)
  }

  _initModels() {
    const draco = new DRACOLoader()
    draco.setDecoderPath(DRACO_PATH)

    const loader = new GLTFLoader()
    loader.setDRACOLoader(draco)

    // ── Earth ─────────────────────────────────────────────────────────────
    loader.load(
      MODEL_EARTH,
      (gltf) => {
        this._earth = gltf.scene
        this._earth.scale.setScalar(1.8)
        this._earth.position.set(0, 0, 0)
        this.scene.add(this._earth)
        console.log('[Scene] ✅ earth.glb loaded')
        this._onModelLoaded()
      },
      undefined,
      (err) => {
        console.warn('[Scene] ⚠️ earth.glb failed:', err?.message ?? err)
        this._onModelLoaded()  // fail gracefully — vẫn cộng count
      }
    )

    // ── Clouds ────────────────────────────────────────────────────────────
    loader.load(
      MODEL_CLOUDS,
      (gltf) => {
        this._clouds = gltf.scene
        this._clouds.scale.setScalar(1.84)
        this._clouds.position.set(0, 0, 0)
        this._clouds.traverse(child => {
          if (child.isMesh) {
            child.material.transparent = true
            child.material.opacity     = 0.45
            child.material.depthWrite  = false
          }
        })
        this.scene.add(this._clouds)
        console.log('[Scene] ✅ clouds.glb loaded')
        this._onModelLoaded()
      },
      undefined,
      (err) => {
        console.warn('[Scene] ⚠️ clouds.glb failed:', err?.message ?? err)
        this._onModelLoaded()
      }
    )
  }

  _onModelLoaded() {
    this._loadedCount++
    console.log(`[Scene] 📦 ${this._loadedCount}/${this._totalModels} models done`)

    // ✅ Báo progress lên useWebGL → store → Preloader loadPercent
    this._onProgress(this._loadedCount, this._totalModels)

    if (this._loadedCount >= this._totalModels) {
      this._isReady = true
      console.log('[Scene] ✅ isReady = true — all models done')
    }
  }

  // ── Public API ─────────────────────────────────────────────────────────────

  get isReady() { return this._isReady }

  mount(canvas) {
    this.renderer.mount(canvas)
    console.log('[Scene] 🎯 mounted to canvas')
  }

  update(progress) {
    const elapsed = this._clock.getElapsedTime()

    this.camCtrl.update(progress)

    if (this._earth) {
      this._earth.rotation.y = progress * Math.PI * 2 + elapsed * 0.05
    }
    if (this._clouds) {
      this._clouds.rotation.y = elapsed * 0.06 + progress * Math.PI * 1.9
    }

    this.renderer.render(this.scene, this.camCtrl.camera)
  }

  resize() {
    this.renderer.resize()
    this.camCtrl.resize()
  }

  _handleResize() { this.resize() }

  destroy() {
    window.removeEventListener('resize', this._onResize)
    this.renderer.destroy()
    console.log('[Scene] destroyed')
  }
}
