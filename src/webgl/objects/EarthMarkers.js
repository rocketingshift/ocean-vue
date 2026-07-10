import * as THREE from 'three'
import { EARTH_MARKERS } from '@/data/chapters'

export class EarthMarkers {
  constructor() {
    this.group   = new THREE.Group()
    this._meshes = []
    this._build()
  }

  _build() {
    EARTH_MARKERS.forEach(({ id, pos, orient }) => {
      // Marker dot
      const geo = new THREE.SphereGeometry(0.012, 16, 16)
      const mat = new THREE.MeshBasicMaterial({
        color:       0x90e0ef,
        transparent: true,
        opacity:     0,
      })
      const mesh = new THREE.Mesh(geo, mat)

      // Position on globe surface
      mesh.position.set(...pos)
      mesh.position.normalize().multiplyScalar(1.01)

      // Apply quaternion orientation
      mesh.quaternion.set(orient[0], orient[1], orient[2], orient[3])

      // Glow ring
      const ringGeo = new THREE.RingGeometry(0.018, 0.025, 32)
      const ringMat = new THREE.MeshBasicMaterial({
        color:       0x90e0ef,
        transparent: true,
        opacity:     0,
        side:        THREE.DoubleSide,
      })
      const ring = new THREE.Mesh(ringGeo, ringMat)
      mesh.add(ring)

      // Billboard: ring faces camera (done in update)
      ring.userData.isRing = true

      this.group.add(mesh)
      this._meshes.push({ mesh, mat, ringMat, id })
    })
  }

  update(scrollProgress) {
    // Markers fade in/out based on scroll proximity to their chapter
    const activeIdx = Math.floor(scrollProgress * (EARTH_MARKERS.length - 1))

    this._meshes.forEach(({ mesh, mat, ringMat, id }) => {
      const isActive = id === activeIdx
      const dist     = Math.abs(id - scrollProgress * (EARTH_MARKERS.length - 1))
      const opacity  = Math.max(0, 1 - dist * 1.2)

      mat.opacity     = opacity * 0.9
      ringMat.opacity = isActive ? 0.6 : opacity * 0.3

      // Pulse scale on active marker
      const pulse = isActive ? 1 + Math.sin(Date.now() * 0.004) * 0.15 : 1
      mesh.children[0]?.scale.setScalar(pulse)
    })
  }
}
