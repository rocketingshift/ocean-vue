import * as THREE from 'three'

export class OceanClouds {
  constructor(gltf) {
    this.group = new THREE.Group()

    gltf.scene.traverse(child => {
      if (!child.isMesh) return
      child.material = new THREE.MeshStandardMaterial({
        color:       0xffffff,
        transparent: true,
        opacity:     0.55,
        depthWrite:  false,
      })
    })

    this.group.add(gltf.scene)
    this.group.scale.setScalar(1.04)
  }

  update(elapsed) {
    // Clouds drift slowly
    this.group.rotation.y = elapsed * 0.008
    this.group.rotation.x = Math.sin(elapsed * 0.1) * 0.005
  }
}
