import * as THREE from 'three'
import { GLTFLoader }  from 'three/addons/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'
import { OceanRenderer } from './Renderer.js'
import { OceanCamera }   from './Camera.js'

// ── Assets (inline, không qua assets.js để tránh import chain) ──────────────
const ASSET_BASE = 'https://raw.githubusercontent.com/rocketingshift/ocean-destop/main/2025.oceanx.org/2025.oceanx.org'
const DRACO_PATH = 'https://www.gstatic.com/draco/versioned/decoders/1.5.6/'

export class OceanScene {
  constructor() {
    // ✅ this.camCtrl = OceanCamera (wrapper)
    // ✅ this.camCtrl.camera = THREE.PerspectiveCamera (chỉ để render)
    this.scene    = new THREE.Scene()
    this.renderer = new OceanRenderer()
    this.camCtrl  = new OceanCamera()

    this._earth      = null
    this._astronaut  = null
    this._loadedCount = 0
    this._totalModels = 2
    this._isReady     = false

    this._initBackground()
    this._initLights()
    this._initModels()

    this._onResize = this._handleResize.bind(this)
    window.addEventListener('resize', this._onResize)
  }

  // ── Scene Setup ─────────────────────────────────────────────────────────────

  _initBackground() {
    this.scene.background = new THREE.Color(0x00000f)
    this.scene.fog = new THREE.FogExp2(0x00000f, 0.015)
  }

  _initLights() {
    const ambient = new THREE.AmbientLight(0x304060, 2)
    this.scene.add(ambient)

    const sun = new THREE.DirectionalLight(0xffffff, 4)
    sun.position.set(5, 5, 5)
    this.scene.add(sun)

    const rim = new THREE.DirectionalLight(0x2244ff, 2)
    rim.position.set(-4, 1, -4)
    this.scene.add(rim)
  }

  _initModels() {
    const draco = new DRACOLoader()
    draco.setDecoderPath(DRACO_PATH)

    const loader = new GLTFLoader()
    loader.setDRACOLoader(draco)

    // Earth
    loader.load(
      `${ASSET_BASE}/models/earth.glb`,
      (gltf) => {
        this._earth = gltf.scene
        this._earth.scale.setScalar(1.8)
        this._earth.position.set(0, 0, 0)
        this.scene.add(this._earth)
        this._onModelLoaded('earth')
      },
      undefined,
      (err) => {
        console.warn('[Scene] earth.glb load error:', err.message)
        this._onModelLoaded('earth') // đừng block isReady
      }
    )

    // Astronaut
    loader.load(
      `${ASSET_BASE}/models/astronaut.glb`,
      (gltf) => {
        this._astronaut = gltf.scene
        this._astronaut.scale.setScalar(0.25)
        this._astronaut.position.set(2.5, 0.5, 0.5)
        this.scene.add(this._astronaut)
        this._onModelLoaded('astronaut')
      },
      undefined,
      (err) => {
        console.warn('[Scene] astronaut.glb load error:', err.message)
        this._onModelLoaded('astronaut')
      }
    )
  }

  _onModelLoaded(name) {
    this._loadedCount++
    console.log(`[Scene] model loaded: ${name} (${this._loadedCount}/${this._totalModels})`)
    if (this._loadedCount >= this._totalModels) {
      this._isReady = true
      console.log('[Scene] ✅ isReady = true')
    }
  }

  // ── Public API ───────────────────────────────────────────────────────────────

  get isReady() {
    return this._isReady
  }

  /** Bind renderer to an existing <canvas> element */
  mount(canvas) {
    this.renderer.mount(canvas)
  }

  /**
   * Main update — called every RAF frame.
   * @param {number} progress - scroll progress 0..1
   */
  update(progress) {
    // ✅ 1. Update camera via wrapper — OceanCamera.update(progress)
    //    KHÔNG BAO GIỜ gọi this.camCtrl.camera.update() — THREE.PerspectiveCamera không có method đó
    this.camCtrl.update(progress)

    // 2. Animate Earth rotation
    if (this._earth) {
      this._earth.rotation.y += 0.0008
    }

    // 3. Render — dùng this.camCtrl.camera (THREE.PerspectiveCamera)
    this.renderer.render(this.scene, this.camCtrl.camera)
  }

  resize() {
    this.renderer.resize()
    this.camCtrl.resize()
  }

  _handleResize() {
    this.resize()
  }

  destroy() {
    window.removeEventListener('resize', this._onResize)
    this.renderer.destroy()
  }
}
