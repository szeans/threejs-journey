import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

/**
 * Loaders
 */
const gltfLoader = new GLTFLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader

/**
 * Base
 */
// Debug
const gui = new dat.GUI()
const debugObject = {
}

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Update all materials
debugObject.envMapIntensity = 2.5

const updateAllMats = () => {
  scene.traverse((child) => {
    if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
      //child.material.envMap = envMap
      child.material.envMapIntensity = debugObject.envMapIntensity
      child.castShadow = true
      child.receiveShadow = true
    }
  })
}

gui.add(debugObject, 'envMapIntensity').min(0).max(10).step(.01).onChange(updateAllMats)

// Load ENVMap
const envMap = cubeTextureLoader.load([
  '/textures/environmentMaps/0/px.jpg',
  '/textures/environmentMaps/0/nx.jpg',
  '/textures/environmentMaps/0/py.jpg',
  '/textures/environmentMaps/0/ny.jpg',
  '/textures/environmentMaps/0/pz.jpg',
  '/textures/environmentMaps/0/nz.jpg'
])
envMap.encoding = THREE.sRGBEncoding
scene.background = envMap
scene.environment = envMap

/**
 * Models
 */
// gltfLoader.load(
//   '/models/FlightHelmet/glTF/FlightHelmet.gltf',
//   (gltf) => {
//     gltf.scene.scale.set(10, 10, 10)
//     gltf.scene.position.set(0, -4, 0)
//     gltf.scene.rotation.y = Math.PI * .5
//     scene.add(gltf.scene)

//     gui.add(gltf.scene.rotation, 'y').min(- Math.PI).max(Math.PI).step(.01).name('helmetRotation')

//     updateAllMats()
//   }
// )

const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/draco/')

gltfLoader.setDRACOLoader(dracoLoader)

let mixer = null

gltfLoader.load(
  '/models/myhb/hb.glb',
  (gltf) => {
    gltf.scene.scale.set(.3, .3, .3)
    gltf.scene.position.set(0, -1, 0)
    scene.add(gltf.scene)

    gui.add(gltf.scene.rotation, 'y').min(- Math.PI).max(Math.PI).step(.01).name('helmetRotation')

    //updateAllMats()
  }
)

/**
 * Light
 */
const directionalLight = new THREE.DirectionalLight('#ffffff', 3)
directionalLight.position.set(0.25, 3, -2.25)
directionalLight.castShadow = true
directionalLight.shadow.far = 15
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.normalBias = .05

// const directionalLightCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
// scene.add(directionalLightCameraHelper)

scene.add(directionalLight)
gui.add(directionalLight, 'intensity').min(0).max(10).step(.01).name('lightIntensity')
gui.add(directionalLight.position, 'x').min(-5).max(5).step(.01).name('lightX')
gui.add(directionalLight.position, 'y').min(-5).max(5).step(.01).name('lightY')
gui.add(directionalLight.position, 'z').min(-5).max(5).step(.01).name('lightZ')

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
camera.position.set(4, 1, - 4)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.physicallyCorrectLights = true
renderer.outputEncoding = THREE.sRGBEncoding
renderer.toneMappingExposure = 2
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

gui.add(renderer, 'toneMapping', {
  No: THREE.NoToneMapping,
  Linear: THREE.LinearToneMapping,
  Reinhard: THREE.ReinhardToneMapping,
  CINEON: THREE.CineonToneMapping,
  ACESFilmic: THREE.ACESFilmicToneMapping
})

gui.add(renderer, 'toneMappingExposure').min(0).max(10).step(.01)

/**
 * Animate
 */
const tick = () => {
  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()