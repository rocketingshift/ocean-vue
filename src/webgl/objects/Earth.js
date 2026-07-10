import * as THREE from 'three'
import { EARTH_MARKERS } from '@/data/chapters'

export class Earth {
  constructor(gltf, textures = {}) {
    this.group = new THREE.Group()
    this._buildEarth(gltf, textures)
  }

  _buildEarth(gltf, { diffuse, normal, roughness, clouds }) {
    gltf.scene.traverse(child => {
      if (!child.isMesh) return

      // Apply PBR material with KTX2 textures
      child.material = new THREE.MeshStandardMaterial({
        map:          diffuse   ?? null,
        normalMap:    normal    ?? null,
        roughnessMap: roughness ?? null,
        roughness:    0.7,
        metalness:    0.05,
      })
      child.castShadow    = true
      child.receiveShadow = true

      // Clone scale from original
      child.scale.setScalar(1)
    })

    this.earthMesh = gltf.scene
    this.group.add(this.earthMesh)

    // Cloud layer (slightly larger sphere)
    if (clouds) {
      const cloudGeo = new THREE.SphereGeometry(1.015, 64, 64)
      const cloudMat = new THREE.MeshStandardMaterial({
        map:         clouds,
        transparent: true,
        opacity:     0.6,
        depthWrite:  false,
        blending:    THREE.NormalBlending,
      })
      this.cloudMesh = new THREE.Mesh(cloudGeo, cloudMat)
      this.group.add(this.cloudMesh)
    }
  }

  update(scrollProgress, elapsed) {
    // Earth rotates slowly over the full scroll
    // Plus base slow auto-rotation
    const scrollRotation = scrollProgress * Math.PI * 2
    const autoRotation   = elapsed * 0.02

    this.earthMesh.rotation.y = scrollRotation + autoRotation

    // Cloud layer counter-rotates slightly
    if (this.cloudMesh) {
      this.cloudMesh.rotation.y = autoRotation * 1.1 + scrollRotation * 0.95
    }

    // Tilt animation
    this.group.rotation.z = Math.sin(scrollProgress * Math.PI) * 0.15
  }
}
