// src/webgl/Scene.js
import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { KTX2Loader } from 'three/addons/loaders/KTX2Loader.js'
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'

import { OceanRenderer } from './Renderer.js'
import { OceanCamera } from './Camera.js'
import { Earth } from './objects/Earth.js'
import { Water } from './objects/Water.js'
import { EarthMarkers } from './objects/EarthMarkers.js'

import { ASSET_BASE, PATHS, TOTAL_ASSETS } from '@/config/assets.js'
import { useWebGLStore } from '@/stores/useWebGLStore.js'
import { useScrollStore } from '@/stores/useScrollStore.js'

let _instance = null

export class OceanScene {
  constructor (canvas) {
    if (_instance) return _instance
    _instance = this

    this.canvas    = canvas
    this.webglStore = useWebGLStore()
    this.scrollStore = useScrollStore()

    this.scene    = new THREE.Scene()
    this.renderer = new OceanRenderer(canvas)
    this.camCtrl  = new OceanCamera()
    this.camera   = this.camCtrl.camera

    this._loaded = 0
    this._objects = {}
    this._clock   = new THREE.Clock()

    this._init()
  }

  static getInstance (canvas) {
    if (_instance) return _instance
    return new OceanScene(canvas)
  }

  static destroy () {
    _instance = null
  }

  async _init () {
    this._setupLights()
    await this._loadAssets()
    this._buildScene()
    this.webglStore.setReady(true)
  }

  _setupLights () {
    // Ambient
    const ambient = new THREE.AmbientLight(0xffffff, 0.4)
    this.scene.add(ambient)

    // Key light (sun)
    const sun = new THREE.DirectionalLight(0xfff5e0, 2.5)
    sun.position.set(5, 3, 5)
    sun.castShadow = false
    this.scene.add(sun)

    // Rim light (blue)
    const rim = new THREE.DirectionalLight(0x4488ff, 0.8)
    rim.position.set(-5, -2, -3)
    this.scene.add(rim)

    // Fill
    const fill = new THREE.DirectionalLight(0xffffff, 0.3)
    fill.position.set(0, -5, 2)
    this.scene.add(fill)
  }

  async _loadAssets () {
    const renderer = this.renderer.renderer

    // KTX2 loader
    const ktx2 = new KTX2Loader()
    ktx2.setTranscoderPath(`${ASSET_BASE}/${PATHS.basisTranscoder}/../`)
    ktx2.detectSupport(renderer)

    // DRACO loader
    const draco = new DRACOLoader()
    draco.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/')

    // GLTF loader
    const gltf = new GLTFLoader()
    gltf.setKTX2Loader(ktx2)
    gltf.setDRACOLoader(draco)

    const onProgress = () => {
      this._loaded++
      this.webglStore.setProgress(Math.round((this._loaded / TOTAL_ASSETS) * 100))
    }

    try {
      // Load Earth
      const earthGltf = await this._loadGLTF(gltf, `${ASSET_BASE}/${PATHS.earthModel}`, onProgress)
      this._objects.earth = new Earth(earthGltf, ktx2, renderer)

      // Load additional models (astronaut, etc.) — graceful fail
      try {
        const astroGltf = await this._loadGLTF(gltf, `${ASSET_BASE}/${PATHS.astronautModel}`, onProgress)
        this._objects.astronaut = astroGltf.scene
        this._objects.astronaut.scale.setScalar(0.15)
        this._objects.astronaut.position.set(-0.9, 0.1, 0.4)
      } catch (e) {
        console.warn('Astronaut model skipped:', e.message)
        onProgress()
      }

      // Water plane
      this._objects.water = new Water()

      // Earth markers
      const markers = new EarthMarkers()
      this._objects.markers = markers

      // Ensure progress reaches 100
      while (this._loaded < TOTAL_ASSETS) onProgress()

    } catch (err) {
      console.error('Asset load error:', err)
      this.webglStore.setProgress(100)
      this.webglStore.setReady(true)
    }
  }

  _loadGLTF (loader, url, onProgress) {
    return new Promise((resolve, reject) => {
      loader.load(url, resolve, onProgress, reject)
    })
  }

  _buildScene () {
    const { earth, astronaut, water, markers } = this._objects

    if (earth?.group) this.scene.add(earth.group)
    if (astronaut)    this.scene.add(astronaut)
    if (water?.mesh)  this.scene.add(water.mesh)
    if (markers?.group) this.scene.add(markers.group)

    // Background: dark deep space / ocean
    this.scene.background = new THREE.Color(0x000a1a)

    // Fog for depth
    this.scene.fog = new THREE.FogExp2(0x000a1a, 0.08)
  }

  /** Called every frame from useWebGL composable */
  tick () {
    const delta    = this._clock.getDelta()
    const elapsed  = this._clock.getElapsedTime()
    const progress = this.scrollStore.scrollProgress  // 0→1

    // Update camera from scroll
    this.camCtrl.updateFromScroll(progress)

    // Animate Earth (slow rotation)
    if (this._objects.earth?.group) {
      this._objects.earth.group.rotation.y += delta * 0.03
    }

    // Animate water shader
    if (this._objects.water?.mesh) {
      const mat = this._objects.water.mesh.material
      if (mat.uniforms?.uTime) mat.uniforms.uTime.value = elapsed
    }

    // Update markers visibility based on scroll
    if (this._objects.markers) {
      this._objects.markers.updateFromScroll(progress)
    }

    this.renderer.renderer.render(this.scene, this.camera)
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
