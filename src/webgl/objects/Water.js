import * as THREE from 'three'

const VERT = /* glsl */`
  varying vec2  vUv;
  varying vec3  vWorldPos;
  varying vec3  vNormal;
  uniform float uTime;

  void main() {
    vUv      = uv;
    vNormal  = normalize(normalMatrix * normal);
    vec4 wp  = modelMatrix * vec4(position, 1.0);
    vWorldPos = wp.xyz;

    // Subtle vertex wave
    float wave = sin(position.x * 4.0 + uTime) * 0.005
               + sin(position.z * 3.0 + uTime * 0.8) * 0.003;
    vec3 pos   = position + vec3(0.0, wave, 0.0);

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`

const FRAG = /* glsl */`
  uniform sampler2D uNormalMap;
  uniform float     uTime;
  uniform vec3      uDeepColor;
  uniform vec3      uSurfaceColor;

  varying vec2 vUv;
  varying vec3 vWorldPos;
  varying vec3 vNormal;

  void main() {
    // Dual-scroll normal map for ripple effect
    vec2 uv1 = vUv * 8.0 + vec2(uTime * 0.018,  uTime * 0.010);
    vec2 uv2 = vUv * 5.0 - vec2(uTime * 0.012,  uTime * 0.022);
    vec3 n1  = texture2D(uNormalMap, uv1).rgb * 2.0 - 1.0;
    vec3 n2  = texture2D(uNormalMap, uv2).rgb * 2.0 - 1.0;
    vec3 n   = normalize(n1 + n2);

    // Fresnel
    vec3  viewDir = normalize(cameraPosition - vWorldPos);
    float fresnel = pow(1.0 - max(dot(viewDir, vNormal), 0.0), 3.0);

    // Color
    vec3 color = mix(uDeepColor, uSurfaceColor, fresnel * 0.6 + n.y * 0.1);

    // Specular glint
    float spec = pow(max(dot(reflect(-viewDir, n), vec3(0,1,0)), 0.0), 64.0);
    color += vec3(1.0, 1.0, 1.0) * spec * 0.3;

    gl_FragColor = vec4(color, 0.92);
  }
`

export class Water {
  constructor(normalMap, envMap) {
    const geo = new THREE.PlaneGeometry(20, 20, 64, 64)
    geo.rotateX(-Math.PI / 2)

    if (normalMap) {
      normalMap.wrapS = normalMap.wrapT = THREE.RepeatWrapping
    }

    this._mat = new THREE.ShaderMaterial({
      vertexShader:   VERT,
      fragmentShader: FRAG,
      transparent:    true,
      uniforms: {
        uNormalMap:   { value: normalMap ?? null },
        uTime:        { value: 0 },
        uDeepColor:   { value: new THREE.Color(0x000d15) },
        uSurfaceColor:{ value: new THREE.Color(0x0077b6) },
      },
    })

    this.mesh = new THREE.Mesh(geo, this._mat)
    this.mesh.position.y = -1.2
    this.mesh.receiveShadow = true
  }

  update(elapsed) {
    this._mat.uniforms.uTime.value = elapsed
  }
}
