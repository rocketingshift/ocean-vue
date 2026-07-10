// src/webgl/objects/EarthMarkers.js
import * as THREE from 'three'
import { EARTH_MARKERS } from '@/data/chapters.js'

// Safe converters — handles Array, Vue reactive Proxy, {x,y,z} object, THREE.Vector3, undefined
function toArr3(v) {
  if (!v) return [0, 0, 0]
  if (Array.isArray(v)) return [Number(v[0] ?? 0), Number(v[1] ?? 0), Number(v[2] ?? 0)]
  return [Number(v.x ?? 0), Number(v.y ?? 0), Number(v.z ?? 0)]
}

function toArr4(v) {
  if (!v) return [0, 0, 0, 1]
  if (Array.isArray(v)) return [Number(v[0] ?? 0), Number(v[1] ?? 0), Number(v[2] ?? 0), Number(v[3] ?? 1)]
  return [Number(v.x ?? 0), Number(v.y ?? 0), Number(v.z ?? 0), Number(v.w ?? 1)]
}

export class EarthMarkers {
  constructor(scene) {
    this.scene = scene
    this.group = new THREE.Group()
    this.items = []
    this._build()
    scene.add(this.group)
  }

  _build() {
    const markerData = Array.isArray(EARTH_MARKERS) ? EARTH_MARKERS : []

    markerData.forEach((data) => {
      const pos    = toArr3(data.pos)
      const orient = toArr4(data.orient)

      const geo = new THREE.SphereGeometry(0.022, 12, 12)
      const mat = new THREE.MeshBasicMaterial({
        color       : 0x00e5ff,
        transparent : true,
        opacity     : 0,
        depthTest   : false,
      })

      const mesh = new THREE.Mesh(geo, mat)
      mesh.position.set(...pos)
      mesh.quaternion.set(...orient)
      mesh.renderOrder = 999
      mesh.userData    = { id: data.id ?? '', label: data.label ?? '' }

      this.group.add(mesh)
      this.items.push({ mesh, data })
    })
  }

  update(progress) {
    this.items.forEach(({ mesh, data }) => {
      const cp = data.chapterProgress ?? data.chapter ?? -1
      if (cp < 0) return
      const dist = Math.abs(progress - cp)
      mesh.material.opacity = dist < 0.06 ? Math.max(0, 1 - dist / 0.06) : 0
      mesh.material.needsUpdate = true
    })
  }

  setVisible(visible) {
    this.group.visible = visible
  }

  dispose() {
    this.items.forEach(({ mesh }) => {
      mesh.geometry.dispose()
      mesh.material.dispose()
    })
    this.scene.remove(this.group)
    this.items = []
  }
}
