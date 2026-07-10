// Trỏ thẳng tới repo cũ trên GitHub — không cần copy file!
export const ASSET_BASE = 'https://raw.githubusercontent.com/rocketingshift/ocean-destop/main/2025.oceanx.org/2025.oceanx.org'

export const PATHS = {
  models: {
    earth:   `${ASSET_BASE}/webgl/models/earth.glb`,
    land:    `${ASSET_BASE}/webgl/models/land.glb`,
    clouds:  `${ASSET_BASE}/webgl/models/clouds.glb`,
    buoy:    `${ASSET_BASE}/webgl/models/buoy.glb`,
    ship:    `${ASSET_BASE}/webgl/models/ship.glb`,
    seagull: `${ASSET_BASE}/webgl/models/seagull.glb`,
  },
  textures: {
    earthDiffuse:   `${ASSET_BASE}/webgl/textures/earth_diffuse_grade.ktx2`,
    earthNormal:    `${ASSET_BASE}/webgl/textures/earth_normal.ktx2`,
    earthRoughness: `${ASSET_BASE}/webgl/textures/earth_roughness.ktx2`,
    earthClouds:    `${ASSET_BASE}/webgl/textures/earth_clouds.ktx2`,
    landDiffuse:    `${ASSET_BASE}/webgl/textures/land_diffuse.ktx2`,
    buoyDiffuse:    `${ASSET_BASE}/webgl/textures/bouy_diffuse.ktx2`,
    seagullDiffuse: `${ASSET_BASE}/webgl/textures/seagull_diffuse.ktx2`,
    shipDiffuse: [
      `${ASSET_BASE}/webgl/textures/ship_Diffuse.1001.ktx2`,
      `${ASSET_BASE}/webgl/textures/ship_Diffuse.1002.ktx2`,
      `${ASSET_BASE}/webgl/textures/ship_Diffuse.1003.ktx2`,
      `${ASSET_BASE}/webgl/textures/ship_Diffuse.1004.ktx2`,
    ],
    shipAO: [
      `${ASSET_BASE}/webgl/textures/ship_Ambient_Occlusion.1001.ktx2`,
      `${ASSET_BASE}/webgl/textures/ship_Ambient_Occlusion.1002.ktx2`,
      `${ASSET_BASE}/webgl/textures/ship_Ambient_Occlusion.1003.ktx2`,
      `${ASSET_BASE}/webgl/textures/ship_Ambient_Occlusion.1004.ktx2`,
    ],
    waterDepth:  `${ASSET_BASE}/webgl/textures/water-depth-2.ktx2`,
    waterNormal: `${ASSET_BASE}/webgl/textures/water-normal.webp`,
    envMap:      `${ASSET_BASE}/webgl/textures/ocean-envmap.jpg`,
    grid:        `${ASSET_BASE}/webgl/textures/grid.png`,
  },
  audio: {
    sfx: `${ASSET_BASE}/audio/sfx.webm`,
  },
  basis: {
    // basis transcoder cũng lấy từ repo cũ
    transcoder: `${ASSET_BASE}/basis/`,
  },
}

export const TOTAL_ASSETS = 17
