import * as THREE from 'three'
import { OceanRenderer }      from './Renderer'
import { OceanCamera }        from './Camera'
import { ModelLoader }        from './loaders/ModelLoader'
import { KTX2TextureLoader }  from './loaders/TextureLoader'
import { Earth }              from './objects/Earth'
import { Water }              from './objects/Water'
import { OceanShip }          from './objects/Ship'
import { OceanClouds }        from './objects/Clouds'
import { EarthMarkers }       from './objects/EarthMarkers'
import { PATHS }              from '@/config/assets'

export class OceanScene {
  constructor(canvas, opts = {}) {
    this.canvas   = canvas
    this.opts     = opts
    this.scene    = new THREE.Scene()
    this.clock    = new THREE.Clock()
    this.objects  = {}
  }

  async init() {
    this.renderer = new OceanRenderer(this.canvas)
    this.camera   = new OceanCamera()

    this.scene.background = new THREE.Color(0x000d15)
    this.scene.fog        = new THREE.FogExp2(0x000d15, 0.08)

    await this._loadAssets()
    this._setupLights()
    this._buildScene()
  }

  /* ─── Asset loading ────────────────────────────────────── */
  async _loadAssets() {
    const ml  = new ModelLoader()
    const ktx = new KTX2TextureLoader(this.renderer.instance)
    const tl  = new THREE.TextureLoader()
    const cb  = () => this.opts.onProgress?.()

    const results = await Promise.allSettled([
      ml.load(PATHS.models.earth,              cb),  // 0
      ml.load(PATHS.models.land,               cb),  // 1
      ml.load(PATHS.models.clouds,             cb),  // 2
      ml.load(PATHS.models.ship,               cb),  // 3
      ml.load(PATHS.models.seagull,            cb),  // 4
      ml.load(PATHS.models.buoy,               cb),  // 5
      ktx.load(PATHS.textures.earthDiffuse,    cb),  // 6
      ktx.load(PATHS.textures.earthNormal,     cb),  // 7
      ktx.load(PATHS.textures.earthRoughness,  cb),  // 8
      ktx.load(PATHS.textures.earthClouds,     cb),  // 9
      ktx.load(PATHS.textures.landDiffuse,     cb),  // 10
      ktx.load(PATHS.textures.waterDepth,      cb),  // 11
      tl.loadAsync(PATHS.textures.waterNormal).then(t => { cb(); return t }), // 12
      tl.loadAsync(PATHS.textures.envMap      ).then(t => { cb(); return t }), // 13
      tl.loadAsync(PATHS.textures.grid        ).then(t => { cb(); return t }), // 14
      ktx.load(PATHS.textures.buoyDiffuse,     cb),  // 15
      ktx.load(PATHS.textures.seagullDiffuse,  cb),  // 16
    ])

    const get = (i) => results[i].status === 'fulfilled'
      ? results[i].value
      : (this.opts.onError?.(results[i].reason), null)

    this._assets = {
      earthGltf:    get(0),  landGltf:     get(1),
      cloudsGltf:   get(2),  shipGltf:     get(3),
      seagullGltf:  get(4),  buoyGltf:     get(5),
      earthDiff:    get(6),  earthNorm:    get(7),
      earthRough:   get(8),  earthClouds:  get(9),
      landDiff:     get(10), waterDepth:   get(11),
      waterNorm:    get(12), envMap:       get(13),
      grid:         get(14), buoyDiff:     get(15),
      seagullDiff:  get(16),
    }
  }

  /* ─── Lights ───────────────────────────────────────────── */
  _setupLights() {
    const ambient = new THREE.AmbientLight(0x90e0ef, 0.25)
    this.scene.add(ambient)

    const sun = new THREE.DirectionalLight(0xffffff, 2.5)
    sun.position.set(5, 4, 3)
    sun.castShadow             = true
    sun.shadow.mapSize.set(2048, 2048)
    sun.shadow.camera.near     = 0.1
    sun.shadow.camera.far      = 30
    sun.shadow.camera.left     = -5
    sun.shadow.camera.right    = 5
    sun.shadow.camera.top      = 5
    sun.shadow.camera.bottom   = -5
    this.scene.add(sun)

    const hemi = new THREE.HemisphereLight(0x4fc3f7, 0x000d15, 0.6)
    this.scene.add(hemi)
  }

  /* ─── Build scene ──────────────────────────────────────── */
  _buildScene() {
    const a = this._assets

    if (a.earthGltf) {
      this.objects.earth = new Earth(a.earthGltf, {
        diffuse: a.earthDiff, normal: a.earthNorm,
        roughness: a.earthRough, clouds: a.earthClouds,
      })
      this.scene.add(this.objects.earth.group)
    }

    if (a.cloudsGltf) {
      this.objects.clouds = new OceanClouds(a.cloudsGltf)
      this.scene.add(this.objects.clouds.group)
    }

    if (a.shipGltf) {
      this.objects.ship = new OceanShip(a.shipGltf)
      this.scene.add(this.objects.ship.group)
    }

    this.objects.water = new Water(a.waterNorm, a.envMap)
    this.scene.add(this.objects.water.mesh)

    this.objects.markers = new EarthMarkers()
    this.scene.add(this.objects.markers.group)
  }

  /* ─── Per-frame update ─────────────────────────────────── */
  update(scrollProgress) {
    const elapsed = this.clock.getElapsedTime()

    this.camera.update(scrollProgress)
    this.objects.earth?.update(scrollProgress, elapsed)
    this.objects.clouds?.update(elapsed)
    this.objects.ship?.update(scrollProgress, elapsed)
    this.objects.water?.update(elapsed)
    this.objects.markers?.update(scrollProgress)

    this.renderer.instance.render(this.scene, this.camera.instance)
  }

  resize(w, h) {
    this.camera.resize(w, h)
    this.renderer.resize(w, h)
  }

  destroy() {
    this.scene.traverse(obj => {
      obj.geometry?.dispose()
      if (obj.material) {
        const mats = Array.isArray(obj.material) ? obj.material : [obj.material]
        mats.forEach(m => {
          Object.values(m).forEach(v => v?.isTexture && v.dispose())
          m.dispose()
        })
      }
    })
    this.renderer.instance.dispose()
  }
}
