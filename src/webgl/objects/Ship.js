import * as THREE from 'three'

// Ship path trên globe (interpolated từ earth_markers positions)
const SHIP_PATH = [
  [-0.964,  0.207,  0.027],
  [-0.568, -0.469,  0.657],
  [-0.752,  0.633,  0.078],
  [-0.203, -0.346,  0.901],
  [ 0.303,  0.007,  0.939],
  [ 0.604, -0.144,  0.767],
  [-0.676, -0.374,  0.613],
].map(p => new THREE.Vector3(...p).normalize().multiplyScalar(1.08))

export class OceanShip {
  constructor(gltf) {
    this.group = new THREE.Group()

    gltf.scene.traverse(child => {
      if (child.isMesh) {
        child.castShadow    = true
        child.receiveShadow = true
      }
    })

    this.group.add(gltf.scene)
    this.group.scale.setScalar(0.05)

    // Spline path qua các markers
    this._curve = new THREE.CatmullRomCurve3(SHIP_PATH, true)
  }

  update(scrollProgress, elapsed) {
    // Ship đi theo path theo scroll
    const t   = (scrollProgress * 0.85) % 1
    const pos = this._curve.getPoint(t)
    this.group.position.copy(pos)

    // Ship hướng theo tangent của path
    const tangent = this._curve.getTangent(t)
    const up      = pos.clone().normalize()
    const matrix  = new THREE.Matrix4().lookAt(pos, pos.clone().add(tangent), up)
    this.group.quaternion.setFromRotationMatrix(matrix)

    // Bob animation
    const bob = Math.sin(elapsed * 2.5) * 0.003
    this.group.position.addScaledVector(up, bob)
  }
}
