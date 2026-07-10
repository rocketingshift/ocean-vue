import { KTX2Loader } from 'three/addons/loaders/KTX2Loader.js'
import { PATHS }      from '@/config/assets'

let _ktx2 = null

export class KTX2TextureLoader {
  constructor(renderer) {
    if (!_ktx2) {
      _ktx2 = new KTX2Loader()
      _ktx2.setTranscoderPath(PATHS.basis.transcoder)
      _ktx2.detectSupport(renderer)
    }
    this.loader = _ktx2
  }

  load(url, onProgress) {
    return new Promise((resolve, reject) => {
      this.loader.load(
        url,
        (tex) => { onProgress?.(); resolve(tex) },
        undefined,
        reject,
      )
    })
  }

  static dispose() {
    _ktx2?.dispose()
    _ktx2 = null
  }
}
