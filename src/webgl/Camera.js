// src/webgl/Camera.js
import * as THREE from 'three'

const FOV = 45
const NEAR = 0.01
const FAR = 100

// Camera keyframes driven by scroll progress (0→1)
// pos: [x, y, z], target: [x, y, z]
export const CAM_KEYFRAMES = [
  { t: 0.00, pos: [0, 0.3, 4.5],  target: [0, 0, 0] },
  { t: 0.10, pos: [0, 0.2, 4.0],  target: [0, 0, 0] },
  { t: 0.20, pos: [1.5, 0.5, 3.5], target: [0, 0, 0] },
  { t: 0.35, pos: [2.0, 0.8, 3.0], target: [0, 0, 0] },
  { t: 0.50, pos: [0, 1.0, 3.5],  target: [0, 0.2, 0] },
  { t: 0.65, pos: [-2.0, 0.5, 3.0], target: [0, 0, 0] },
  { t: 0.80, pos: [-1.5, 0.3, 3.5], target: [0, 0, 0] },
  { t: 1.00, pos: [0, 0.3, 4.5],  target: [0, 0, 0] },
]

export class OceanCamera {
  constructor () {
    this.camera = new THREE.PerspectiveCamera(
      FOV,
      window.innerWidth / window.innerHeight,
      NEAR,
      FAR
    )
    // Default: y=0.3 thay vì y=0 — tránh Earth bị crop phần dưới
    this.camera.position.set(0, 0.3, 4.5)
    this.camera.lookAt(0, 0, 0)

    this._target = new THREE.Vector3(0, 0, 0)
    this._currentPos = new THREE.Vector3(0, 0.3, 4.5)
    this._lerpPos   = new THREE.Vector3(0, 0.3, 4.5)
    this._lerpTarget = new THREE.Vector3(0, 0, 0)
  }

  resize () {
    this.camera.aspect = window.innerWidth / window.innerHeight
    this.camera.updateProjectionMatrix()
  }

  /**
   * Update camera based on scroll progress (0→1)
   * Called every frame from Scene.js
   */
  updateFromScroll (progress) {
    const kf = CAM_KEYFRAMES
    let from = kf[0], to = kf[kf.length - 1]

    for (let i = 0; i < kf.length - 1; i++) {
      if (progress >= kf[i].t && progress <= kf[i + 1].t) {
        from = kf[i]
        to   = kf[i + 1]
        break
      }
    }

    const range = to.t - from.t
    const local = range === 0 ? 0 : (progress - from.t) / range
    const ease  = local < 0.5
      ? 2 * local * local
      : -1 + (4 - 2 * local) * local // easeInOutQuad

    this._currentPos.set(
      from.pos[0] + (to.pos[0] - from.pos[0]) * ease,
      from.pos[1] + (to.pos[1] - from.pos[1]) * ease,
      from.pos[2] + (to.pos[2] - from.pos[2]) * ease
    )

    const tx = from.target[0] + (to.target[0] - from.target[0]) * ease
    const ty = from.target[1] + (to.target[1] - from.target[1]) * ease
    const tz = from.target[2] + (to.target[2] - from.target[2]) * ease
    this._target.set(tx, ty, tz)

    // Smooth lerp để tránh giật
    this._lerpPos.lerp(this._currentPos, 0.05)
    this._lerpTarget.lerp(this._target, 0.05)

    this.camera.position.copy(this._lerpPos)
    this.camera.lookAt(this._lerpTarget)
  }
}
