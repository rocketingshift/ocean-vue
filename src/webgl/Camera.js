import * as THREE from 'three'

export class OceanCamera {
  constructor() {
    this.camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      10000
    )
    this.camera.position.set(0, 2, 8)
    this.camera.lookAt(0, 0, 0)

    // Scroll waypoints: 7 điểm tương ứng 7 chapters
    this._waypoints = [
      { pos: new THREE.Vector3(0,  2,  8),  look: new THREE.Vector3(0, 0, 0) }, // 0%
      { pos: new THREE.Vector3(3,  1,  5),  look: new THREE.Vector3(0, 0, 0) }, // ~14%
      { pos: new THREE.Vector3(-3, 0,  4),  look: new THREE.Vector3(0, 0, 0) }, // ~28%
      { pos: new THREE.Vector3(0,  3,  4),  look: new THREE.Vector3(0, 0, 0) }, // ~42%
      { pos: new THREE.Vector3(2, -1,  4),  look: new THREE.Vector3(0, 0, 0) }, // ~57%
      { pos: new THREE.Vector3(-2, 1,  4),  look: new THREE.Vector3(0, 0, 0) }, // ~71%
      { pos: new THREE.Vector3(0,  0, 10),  look: new THREE.Vector3(0, 0, 0) }, // 100%
    ]

    this._targetPos  = new THREE.Vector3()
    this._targetLook = new THREE.Vector3()
    this._smooth = 0.04 // lerp factor per frame
  }

  /**
   * Scroll-driven camera update.
   * ✅ Tên method PHẢI là update() — Scene.js gọi this.camCtrl.update(progress)
   * @param {number} progress - 0..1
   */
  update(progress) {
    const n      = this._waypoints.length - 1
    const clamped = Math.max(0, Math.min(1, progress))
    const scaled  = clamped * n
    const from    = Math.min(Math.floor(scaled), n - 1)
    const to      = from + 1
    const t       = scaled - from

    this._targetPos.lerpVectors(
      this._waypoints[from].pos,
      this._waypoints[to].pos,
      t
    )
    this._targetLook.lerpVectors(
      this._waypoints[from].look,
      this._waypoints[to].look,
      t
    )

    // Smooth interpolation
    this.camera.position.lerp(this._targetPos, this._smooth)
    this.camera.lookAt(this._targetLook)
  }

  resize() {
    this.camera.aspect = window.innerWidth / window.innerHeight
    this.camera.updateProjectionMatrix()
  }
}
