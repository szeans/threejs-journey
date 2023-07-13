import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js'
import { GroundProjectedSkybox } from 'three/addons/objects/GroundProjectedSkybox.js'

// Tweaks
const global = {}
global.envMapIntensity = 1

/**
 * Loaders
 */
const gltfLoader = new GLTFLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()
const rgbeLoader = new RGBELoader()
const textureLoader = new THREE.TextureLoader()

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// // LDR cube texture
// const environmentMap = cubeTextureLoader.load([
//   '/environmentMaps/0/px.png',
//   '/environmentMaps/0/nx.png',
//   '/environmentMaps/0/py.png',
//   '/environmentMaps/0/ny.png',
//   '/environmentMaps/0/pz.png',
//   '/environmentMaps/0/nz.png',
// ])
// scene.environment = environmentMap
// scene.background = environmentMap

// // HDR equirectangular
// rgbeLoader.load('/environmentMaps/blender-2k.hdr',
//   (environmentMap) => {
//     environmentMap.mapping = THREE.EquirectangularReflectionMapping

//     scene.background = environmentMap
//     scene.environment = environmentMap
//   })

// LDR equirectangular
// const environmentMap = textureLoader.load(
//   '/environmentMaps/anime.jpeg'
// )
// environmentMap.mapping = THREE.EquirectangularReflectionMapping
// scene.background = environmentMap
// scene.environment = environmentMap
// environmentMap.colorSpace = THREE.SRGBColorSpace

// Ground projected skybox
// rgbeLoader.load('/environmentMaps/2/2k.hdr', (environmentMap) => {
//   environmentMap.mapping = THREE.EquirectangularReflectionMapping
//   scene.environment = environmentMap

//   //skybox
//   const skybox = new GroundProjectedSkybox(environmentMap)
//   skybox.scale.setScalar(10)
//   scene.add(skybox)

//   gui.add(skybox, 'radius', 1, 200, .1).name('skyboxRadius')
//   gui.add(skybox, 'height', 1, 200, .1).name('skyboxHeight')
// })

/**
 * Real time environment map
 */
const environmentMap = textureLoader.load(
  '/environmentMaps/advanced.jpeg'
)
environmentMap.mapping = THREE.EquirectangularReflectionMapping
scene.background = environmentMap
scene.environment = environmentMap
environmentMap.colorSpace = THREE.SRGBColorSpace

const updateAllMaterials = () => {
  scene.traverse((child) => {
    if (child.isMesh && child.material.isMeshStandardMaterial) {
      child.material.envMapIntensity = global.envMapIntensity
    }
  })
}

gui.add(global, 'envMapIntensity').min(0).max(10).step(0.001).onChange(updateAllMaterials)
gui.add(scene, 'backgroundBlurriness').min(0).max(1).step(0.001)
gui.add(scene, 'backgroundIntensity').min(0).max(10).step(0.001)

// Holy Donut
const holyDonut = new THREE.Mesh(
  new THREE.TorusGeometry(8, .5),
  new THREE.MeshBasicMaterial({color : new THREE.Color(10, 8, 9)})
)
holyDonut.position.y = 3.5
holyDonut.layers.enable(1)
scene.add(holyDonut)

// Cube render target
const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(256, 
  {
    type: THREE.HalfFloatType
  })

scene.environment = cubeRenderTarget.texture

// Cube camera
const cubeCamera = new THREE.CubeCamera(.1, 100, cubeRenderTarget)
cubeCamera.layers.set(1)

/**
 * Models
 */
gltfLoader.load(
  '/models/FlightHelmet/glTF/FlightHelmet.gltf',
  (gltf) => {
    gltf.scene.scale.set(10, 10, 10)
    scene.add(gltf.scene)
    updateAllMaterials()
  }
)

/**
 * Torus Knot
 */
const torusKnot = new THREE.Mesh(
  new THREE.TorusKnotGeometry(1, 0.4, 100, 16),
  new THREE.MeshStandardMaterial({ roughness: 0, metalness: 1, color: 0xaaaaaa })
)
torusKnot.position.y = 4
torusKnot.position.x = -4
scene.add(torusKnot)

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
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(4, 5, 4)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.target.y = 3.5
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()
const tick = () => {
  // Time
  const elapsedTime = clock.getElapsedTime()

  // Real time environmentMap
  if (holyDonut) {
    holyDonut.rotation.x = Math.sin(elapsedTime) * 2

    cubeCamera.update(renderer, scene)
  }

  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()