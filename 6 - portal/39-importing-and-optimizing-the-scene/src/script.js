import * as dat from 'lil-gui'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import firefliesVertexShader from './shaders/fireflies/vertex.glsl'
import firefliesFragmentShader from './shaders/fireflies/fragment.glsl'
import portalVertexShader from './shaders/portal/vertex.glsl'
import portalFragmentShader from './shaders/portal/fragment.glsl'

/**
 * Spector
 */


/**
 * Base
 */
// Debug
const debugObject = {}

const gui = new dat.GUI({
  width: 400
})

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Loaders
 */
// Texture loader
const textureLoader = new THREE.TextureLoader()

// Draco loader
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('draco/')

// GLTF loader
const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)

/**
 * Materials
 */
const bakedTexture = textureLoader.load('Baked.jpg')
bakedTexture.colorSpace = THREE.SRGBColorSpace
const bakedMaterial = new THREE.MeshBasicMaterial({ map: bakedTexture })
bakedTexture.flipY = false

// Pole Light Material
const poleLightMat = new THREE.MeshBasicMaterial({ color: 0xffffe5 })

// Portal Light Material
debugObject.portalColorStart = '#171972'
debugObject.portalColorEnd = '#ffffff'

gui.addColor(debugObject, 'portalColorStart').onChange(() => {
  portalLightMat.uniforms.uColorStart.value.set(debugObject.portalColorStart)
})

gui.addColor(debugObject, 'portalColorEnd').onChange(() => {
  portalLightMat.uniforms.uColorEnd.value.set(debugObject.portalColorEnd)
})

const portalLightMat = new THREE.ShaderMaterial({
  uniforms: {
    uTime: { value: 0 },
    uColorStart: { value: new THREE.Color(debugObject.portalColorStart) },
    uColorEnd: { value: new THREE.Color(debugObject.portalColorEnd) }
  },
  vertexShader: portalVertexShader,
  fragmentShader: portalFragmentShader
})

/**
 * Model
 */
gltfLoader.load(
  'portal.glb',
  (gltf) => {
    const bakedMesh = gltf.scene.children.find(child => child.name === "Baked")

    const poleLight1 = gltf.scene.children.find(child => child.name === "Light_lamp")
    const poleLight2 = gltf.scene.children.find(child => child.name === "Light_lamp001")
    const portalLight = gltf.scene.children.find(child => child.name === "Circle")

    bakedMesh.material = bakedMaterial

    poleLight1.material = poleLightMat
    poleLight2.material = poleLightMat
    portalLight.material = portalLightMat

    scene.add(gltf.scene)
  }
)

/**
 * Fireflies
 */
const firefliesGeo = new THREE.BufferGeometry()
const firefliesCount = 30
const positionArr = new Float32Array(firefliesCount * 3)
const scaleArray = new Float32Array(firefliesCount)

for (let i = 0; i < firefliesCount; i++) {
  positionArr[i * 3 + 0] = (Math.random() - .5) * 4
  positionArr[i * 3 + 1] = Math.random() * 1.5
  positionArr[i * 3 + 2] = (Math.random() - .5) * 4

  scaleArray[i] = Math.random()
}

firefliesGeo.setAttribute('position', new THREE.BufferAttribute(positionArr, 3))
firefliesGeo.setAttribute('aScale', new THREE.BufferAttribute(scaleArray, 1))

// Material
const firefliesMaterial = new THREE.ShaderMaterial({
  uniforms: {
    uTime: { value: 0 },
    uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
    uSize: { value: 250.0 }
  },
  vertexShader: firefliesVertexShader,
  fragmentShader: firefliesFragmentShader,
  transparent: true,
  blending: THREE.AdditiveBlending,
  depthWrite: false
})

gui.add(firefliesMaterial.uniforms.uSize, 'value').min(0).max(500).step(1).name('firefliesSize')

// Points
const fireflies = new THREE.Points(firefliesGeo, firefliesMaterial)
scene.add(fireflies)

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  // Update camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  // Update renderer
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

  // Update Fireflies
  firefliesMaterial.uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio, 2)
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 4
camera.position.y = 2
camera.position.z = 4
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.dampingFactor = .03
controls.minDistance = 3;
controls.maxDistance = 8;
controls.minPolarAngle = 0; // radians
controls.maxPolarAngle = Math.PI/2 - .1 // radians

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

debugObject.clearColor = '#191722'
renderer.setClearColor(debugObject.clearColor)
gui.addColor(debugObject, 'clearColor').onChange(() => {
  renderer.setClearColor(debugObject.clearColor)
})

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
  const elapsedTime = clock.getElapsedTime()

  // Update materials
  firefliesMaterial.uniforms.uTime.value = elapsedTime
  portalLightMat.uniforms.uTime.value = elapsedTime

  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()