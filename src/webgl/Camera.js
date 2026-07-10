import * as THREE from 'three'
import { gsap } from 'gsap'

// Keyframes camera theo scroll progress
const CAM_KEYFRAMES = [
  { progress: 0,    pos: [0, 0, 4.5],  target: [0, 0, 0] },
  { progress: 0.08, pos: [0, 0.5, 3.5], target: [0, 0, 0] },
  { progress: 0.30, pos: [2, 0.2, 3],   target: [0, 0, 0] },
  { progress: 0.55, pos: [-1.5, 0.8, 3.2], target: [0, 0, 0] },
  { progress: 0.80, pos: [0, -0.5, 3.8], target: [0, 0, 0] },
  { progress: 1.0,  pos: [0, 0, 5],    target: [0, 0, 0] },
]

export class OceanCamera {
  constructor() {
    this.instance = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.01,
      100,
    )
    this.instance.position.set(0, 0, 4.5)
    this._target = new THREE.Vector3(0, 0, 0)
  }

  update(scrollProgress) {
    const kf = _interpolateKeyframes(CAM_KEYFRAMES, scrollProgress)

    gsap.to(this.instance.position, {
      x: kf.pos[0], y: kf.pos[1], z: kf.pos[2],
      duration: 1.2,
      ease: 'power2.out',
      overwrite: true,
    })

    this._target.set(...kf.target)
    this.instance.lookAt(this._target)
  }

  resize(w, h) {
    this.instance.aspect = w / h
    this.instance.updateProjectionMatrix()
  }
}

function _interpolateKeyframes(kfs, p) {
  let a = kfs[0], b = kfs[kfs.length - 1]
  for (let i = 0; i < kfs.length - 1; i++) {
    if (p >= kfs[i].progress && p <= kfs[i + 1].progress) {
      a = kfs[i]; b = kfs[i + 1]; break
    }
  }
  const t = a.progress === b.progress ? 1
    : (p - a.progress) / (b.progress - a.progress)

  return {
    pos:    a.pos.map((v, i) => v + (b.pos[i] - v) * t),
    target: a.target.map((v, i) => v + (b.target[i] - v) * t),
  }
}
