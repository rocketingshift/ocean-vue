// src/webgl/Scene.js
import * as THREE from 'three'
import { GLTFLoader }  from 'three/addons/loaders/GLTFLoader.js'
import { KTX2Loader }  from 'three/addons/loaders/KTX2Loader.js'
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'

import { OceanRenderer } from './Renderer.js'
import { OceanCamera }   from './Camera.js'
import { Earth }         from './objects/Earth.js'
import { Water }         from './objects/Water.js'
import { EarthMarkers }  from './objects/EarthMarkers.js'

import { ASSET_BASE, PATHS, TOTAL_ASSETS } from '@/config/assets.js'
import { useWebGLStore }  from '@/stores/useWebGLStore.js'
import { useScrollStore } from '@/stores/useScrollStore.js'

// ─── Singleton ────────────────────────────────────────────────
let _instance = null

export class OceanScene {
  constructor (canvas) {
    if (_instance) return _instance
    _instance = this

    this.canvas = canvas

    // Pinia stores
    this.webglStore  = useWebGLStore()
    this.scrollStore = useScrollStore()

    // Three.js core
    this.scene    = new THREE.Scene()
    this.renderer = new OceanRenderer(canvas)

    // camCtrl = OceanCamera instance  (has .update(p), .camera, .resize())
    // camCtrl.camera = THREE.PerspectiveCamera (has NO .update())
    this.camCtrl = new OceanCamera()

    this._objects = {}
    this._loaded  = 0
    this._clock   = new THREE.Clock()

    this._init()
  }

  static getInstance (canvas) {
    if (_instance) return _instance
    return new OceanScene(canvas)
  }

  static destroy () { _instance = null }

  // ─────────────────────────────────────────────────────────────
  // Private
  // ─────────────────────────────────────────────────────────────

  async _init () {
    this._setupLights()
    await this._loadAssets()
    this._buildScene()
    // Reset clock AFTER load so first delta is small
    this._clock.start()
    this.webglStore.setReady(true)
  }

  _setupLights () {
    this.scene.add(new THREE.AmbientLight(0xffffff, 0.4))

    const sun = new THREE.DirectionalLight(0xfff5e0, 2.5)
    sun.position.set(5, 3, 5)
    this.scene.add(sun)

    const rim = new THREE.DirectionalLight(0x4488ff, 0.8)
    rim.position.set(-5, -2, -3)
    this.scene.add(rim)

    const fill = new THREE.DirectionalLight(0xffffff, 0.3)
    fill.position.set(0, -5, 2)
    this.scene.add(fill)
  }

  async _loadAssets () {
    const r = this.renderer.renderer

    // ── KTX2 ────────────────────────────────────────────────
    const ktx2 = new KTX2Loader()
    try {
      // basis folder is alongside the model files
      ktx2.setTranscoderPath(`${ASSET_BASE}/basis/`)
      ktx2.detectSupport(r)
    } catch (e) { console.warn('KTX2 init:', e.message) }

    // ── DRACO ────────────────────────────────────────────────
    const draco = new DRACOLoader()
    draco.setDecoderPath(
      'https://www.gstatic.com/draco/versioned/decoders/1.5.6/'
    )

    // ── GLTF ─────────────────────────────────────────────────
    const gltf = new GLTFLoader()
    gltf.setKTX2Loader(ktx2)
    gltf.setDRACOLoader(draco)

    const tick = () => {
      this._loaded = Math.min(this._loaded + 1, TOTAL_ASSETS)
      this.webglStore.setProgress(
        Math.round((this._loaded / TOTAL_ASSETS) * 100)
      )
    }

    // Earth — required
    try {
      const eg = await this._gltfLoad(
        gltf, `${ASSET_BASE}/${PATHS.earthModel}`, tick
      )
      this._objects.earth = new Earth(eg, ktx2, r)
    } catch (e) {
      console.error('Earth load failed:', e)
      tick()
    }

    // Optional extra models (only loads if key exists in PATHS)
    const extras = ['astronautModel', 'fishModel', 'coralModel', 'shipModel']
    for (const key of extras) {
      if (!PATHS[key]) { continue }
      try {
        const g = await this._gltfLoad(
          gltf, `${ASSET_BASE}/${PATHS[key]}`, tick
        )
        const obj = g.scene
        obj.scale.setScalar(0.12)
        obj.position.set(-0.9, 0.1, 0.4)
        this._objects[key] = obj
      } catch (e) {
        console.warn(`${key} skipped:`, e.message)
        tick()
      }
    }

    // Water plane
    try {
      this._objects.water = new Water()
      tick()
    } catch (e) {
      console.warn('Water skipped:', e.message)
      tick()
    }

    // Earth markers
    try {
      this._objects.markers = new EarthMarkers()
      tick()
    } catch (e) {
      console.warn('Markers skipped:', e.message)
      tick()
    }

    // Pad to 100 %
    while (this._loaded < TOTAL_ASSETS) tick()
  }

  _gltfLoad (loader, url, onProgress) {
    return new Promise((resolve, reject) =>
      loader.load(url, resolve, onProgress, reject)
    )
  }

  _buildScene () {
    const o = this._objects

    if (o.earth?.group)      this.scene.add(o.earth.group)
    if (o.astronautModel)    this.scene.add(o.astronautModel)
    if (o.fishModel)         this.scene.add(o.fishModel)
    if (o.coralModel)        this.scene.add(o.coralModel)
    if (o.shipModel)         this.scene.add(o.shipModel)
    if (o.water?.mesh)       this.scene.add(o.water.mesh)
    if (o.markers?.group)    this.scene.add(o.markers.group)

    this.scene.background = new THREE.Color(0x000a1a)
    this.scene.fog = new THREE.FogExp2(0x000a1a, 0.06)
  }

  // ─────────────────────────────────────────────────────────────
  // Public  (called by useWebGL.js every RAF frame)
  // ─────────────────────────────────────────────────────────────

  /**
   * @param {number} progress  scroll 0→1  (from scrollStore)
   *
   * CHAIN:
   *   useWebGL → scene.update(p)
   *           → this.camCtrl.update(p)   ← OceanCamera instance ✅
   *           → render(scene, this.camCtrl.camera)  ← THREE.PerspectiveCamera ✅
   *
   * NEVER call this.camCtrl.camera.update() — PerspectiveCamera has no .update()
   */
  update (progress) {
    const delta   = this._clock.getDelta()
    const elapsed = this._clock.getElapsedTime()
    const o       = this._objects

    // ── 1. Camera (OceanCamera.update — NOT THREE.Camera) ────
    this.camCtrl.update(progress)

    // ── 2. Animate Earth ─────────────────────────────────────
    if (o.earth?.group) {
      o.earth.group.rotation.y += delta * 0.025
    }

    // ── 3. Water shader time ─────────────────────────────────
    const wUni = o.water?.mesh?.material?.uniforms
    if (wUni?.uTime) {
      wUni.uTime.value = elapsed
    }

    // ── 4. Markers (guard: method may not exist) ─────────────
    if (typeof o.markers?.updateFromScroll === 'function') {
      o.markers.updateFromScroll(progress)
    }

    // ── 5. Render ─────────────────────────────────────────────
    // this.camCtrl.camera = THREE.PerspectiveCamera ✅
    this.renderer.renderer.render(this.scene, this.camCtrl.camera)
  }

  resize () {
    this.renderer.resize()
    this.camCtrl.resize()
  }

  dispose () {
    this.renderer.renderer.dispose()
    _instance = null
  }
}
