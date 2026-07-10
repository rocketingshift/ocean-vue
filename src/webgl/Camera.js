// src/webgl/Camera.js
import * as THREE from 'three'

const FOV  = 45
const NEAR = 0.01
const FAR  = 100

// Scroll-driven keyframes  progress 0→1
const CAM_KEYFRAMES = [
  { t: 0.00, pos: [0,    0.3, 4.5], target: [0, 0,   0] },
  { t: 0.12, pos: [0,    0.2, 4.0], target: [0, 0,   0] },
  { t: 0.25, pos: [1.5,  0.5, 3.5], target: [0, 0,   0] },
  { t: 0.38, pos: [2.0,  0.8, 3.0], target: [0, 0,   0] },
  { t: 0.50, pos: [0,    1.0, 3.5], target: [0, 0.2, 0] },
  { t: 0.62, pos: [-2.0, 0.5, 3.0], target: [0, 0,   0] },
  { t: 0.75, pos: [-1.5, 0.3, 3.8], target: [0, 0,   0] },
  { t: 0.88, pos: [0,    0.5, 4.2], target: [0, 0,   0] },
  { t: 1.00, pos: [0,    0.3, 4.5], target: [0, 0,   0] },
]

export class OceanCamera {
  constructor () {
    this.camera = new THREE.PerspectiveCamera(
      FOV,
      window.innerWidth / window.innerHeight,
      NEAR,
      FAR
    )
    this.camera.position.set(0, 0.3, 4.5)
    this.camera.lookAt(0, 0, 0)

    // Internal lerp state
    this._destPos    = new THREE.Vector3(0, 0.3, 4.5)
    this._destLookAt = new THREE.Vector3(0, 0,   0)
    this._curPos     = new THREE.Vector3(0, 0.3, 4.5)
    this._curLookAt  = new THREE.Vector3(0, 0,   0)
  }

  /**
   * Called every RAF frame by Scene.update()
   * @param {number} progress  0→1 scroll progress
   */
  update (progress) {
    const kf = CAM_KEYFRAMES
    let from = kf[0]
    let to   = kf[kf.length - 1]

    for (let i = 0; i < kf.length - 1; i++) {
      if (progress >= kf[i].t && progress <= kf[i + 1].t) {
        from = kf[i]
        to   = kf[i + 1]
        break
      }
    }

    const range = to.t - from.t
    const local = range === 0 ? 0 : (progress - from.t) / range
    // easeInOutQuad
    const t = local < 0.5
      ? 2 * local * local
      : -1 + (4 - 2 * local) * local

    const lerp = (a, b, t) => a + (b - a) * t

    this._destPos.set(
      lerp(from.pos[0], to.pos[0], t),
      lerp(from.pos[1], to.pos[1], t),
      lerp(from.pos[2], to.pos[2], t)
    )
    this._destLookAt.set(
      lerp(from.target[0], to.target[0], t),
      lerp(from.target[1], to.target[1], t),
      lerp(from.target[2], to.target[2], t)
    )

    // Smooth approach (5% per frame ≈ ~0.3s lag at 60fps)
    this._curPos.lerp(this._destPos, 0.05)
    this._curLookAt.lerp(this._destLookAt, 0.05)

    this.camera.position.copy(this._curPos)
    this.camera.lookAt(this._curLookAt)
  }

  resize () {
    this.camera.aspect = window.innerWidth / window.innerHeight
    this.camera.updateProjectionMatrix()
  }
}
