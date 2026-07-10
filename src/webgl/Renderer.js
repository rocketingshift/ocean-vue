import * as THREE from 'three'

export class OceanRenderer {
  constructor(canvas) {
    this.instance = new THREE.WebGLRenderer({
      canvas,
      antialias:  true,
      alpha:      false,
      powerPreference: 'high-performance',
    })

    this.instance.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.instance.setSize(window.innerWidth, window.innerHeight)
    this.instance.setClearColor(0x000d15, 1)
    this.instance.shadowMap.enabled = true
    this.instance.shadowMap.type    = THREE.PCFSoftShadowMap
    this.instance.toneMapping       = THREE.ACESFilmicToneMapping
    this.instance.toneMappingExposure = 1.2
    this.instance.outputColorSpace   = THREE.SRGBColorSpace
  }

  resize(w, h) {
    this.instance.setSize(w, h)
    this.instance.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  }
}
