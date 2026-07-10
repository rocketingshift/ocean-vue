import * as THREE    from 'three'
import { GLTFLoader }  from 'three/addons/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'
import { OceanRenderer } from './Renderer.js'
import { OceanCamera }   from './Camera.js'

// ─── Asset paths — VERIFIED từ GitHub API ───────────────────────────────────
// Repo gốc: rocketingshift/ocean-destop
// Cấu trúc thực: /2025.oceanx.org/2025.oceanx.org/webgl/models/*.glb
//
// ✅ Models tồn tại: earth.glb, clouds.glb, land.glb, ship.glb, buoy.glb, seagull.glb
// ❌ KHÔNG TỒN TẠI: astronaut.glb (đã bị loại bỏ)
const ASSET_BASE = 'https://raw.githubusercontent.com/rocketingshift/ocean-destop/main/2025.oceanx.org/2025.oceanx.org'
const DRACO_PATH = 'https://www.gstatic.com/draco/versioned/decoders/1.5.6/'

// ✅ Path đúng: phải có /webgl/ trước /models/
const MODEL_EARTH  = `${ASSET_BASE}/webgl/models/earth.glb`
const MODEL_CLOUDS = `${ASSET_BASE}/webgl/models/clouds.glb`

export class OceanScene {
  constructor() {
    this.scene    = new THREE.Scene()
    this.renderer = new OceanRenderer()
    // ✅ this.camCtrl = OceanCamera wrapper
    // ✅ this.camCtrl.camera = THREE.PerspectiveCamera (chỉ dùng để render)
    this.camCtrl  = new OceanCamera()

    this._earth       = null
    this._clouds      = null
    this._loadedCount = 0
    this._totalModels = 2  // earth + clouds
    this._isReady     = false
    this._clock       = new THREE.Clock()

    this._initBackground()
    this._initLights()
    this._initModels()

    this._onResize = this._handleResize.bind(this)
    window.addEventListener('resize', this._onResize)
  }

  // ── Setup ────────────────────────────────────────────────────────────────────

  _initBackground() {
    // Match variables.css: --color-bg: #000d15
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

    // ── Earth ────────────────────────────────────────────────────────────────
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
        // Fail gracefully — đừng block isReady
        console.warn('[Scene] ⚠️ earth.glb load failed:', err.message ?? err)
        this._onModelLoaded()
      }
    )

    // ── Clouds ───────────────────────────────────────────────────────────────
    loader.load(
      MODEL_CLOUDS,
      (gltf) => {
        this._clouds = gltf.scene
        this._clouds.scale.setScalar(1.84) // slightly larger sphere around earth
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
        console.warn('[Scene] ⚠️ clouds.glb load failed:', err.message ?? err)
        this._onModelLoaded()
      }
    )
  }

  _onModelLoaded() {
    this._loadedCount++
    console.log(`[Scene] ${this._loadedCount}/${this._totalModels} models done`)
    if (this._loadedCount >= this._totalModels) {
      this._isReady = true
      console.log('[Scene] ✅ isReady = true')
    }
  }

  // ── Public API ───────────────────────────────────────────────────────────────

  get isReady() { return this._isReady }

  /**
   * Attach renderer to existing <canvas> DOM element.
   * Called by useWebGL AFTER onMounted (canvasRef.value is available).
   */
  mount(canvas) {
    this.renderer.mount(canvas)
    console.log('[Scene] mounted to canvas')
  }

  /**
   * Main RAF tick — called every frame.
   * @param {number} progress - scroll progress 0..1
   */
  update(progress) {
    const elapsed = this._clock.getElapsedTime()

    // ✅ Camera update — OceanCamera.update(progress)
    //    KHÔNG GỌI this.camCtrl.camera.update() — method đó không tồn tại
    this.camCtrl.update(progress)

    // Earth rotates driven by both scroll + time
    if (this._earth) {
      this._earth.rotation.y = progress * Math.PI * 2 + elapsed * 0.05
    }

    // Clouds counter-rotate slightly
    if (this._clouds) {
      this._clouds.rotation.y = elapsed * 0.06 + progress * Math.PI * 1.9
    }

    // ✅ Render — dùng this.camCtrl.camera (THREE.PerspectiveCamera)
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
  }
}
