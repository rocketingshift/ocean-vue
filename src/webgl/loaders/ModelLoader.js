import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

let _loader = null

export class ModelLoader {
  constructor() {
    if (!_loader) _loader = new GLTFLoader()
    this.loader = _loader
  }

  load(url, onProgress) {
    return new Promise((resolve, reject) => {
      this.loader.load(
        url,
        (gltf) => { onProgress?.(); resolve(gltf) },
        undefined,
        reject,
      )
    })
  }
}
