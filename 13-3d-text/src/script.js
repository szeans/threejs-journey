import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import * as dat from 'lil-gui'

/**
 * Base
 */
// Debug
//const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const matcap = textureLoader.load('/textures/matcaps/mine.png')

/**
 * Fonts
 */
const fontLoader = new FontLoader()
fontLoader.load(
  '/fonts/helvetiker_bold.typeface.json',
  (font) => {
    const textGeometry = new TextGeometry(
      'S P I N !',
      {
        font: font,
        size: 0.5,
        height: 0.2,
        curveSegments: 5,
        bevelEnabled: true,
        bevelThickness: 0.06,
        bevelSize: 0.05,
        bevelOffset: 0,
        bevelSegments: 3
      }
    )
    // textGeometry.computeBoundingBox()
    // textGeometry.translate(
    //   -(textGeometry.boundingBox.max.x-0.02) * .5,
    //   -(textGeometry.boundingBox.max.y-0.02) * .5,
    //   -(textGeometry.boundingBox.max.z-0.03) * .5,
    // )
    textGeometry.center()

    const textMaterial = new THREE.MeshMatcapMaterial({matcap})
    const text = new THREE.Mesh(textGeometry, textMaterial)
    scene.add(text)

    const torusKnotGeometry = new THREE.TorusKnotGeometry(0.3, .1, 75, 12)

    for (let i = 0; i < 100; i++) {
      const torusKnot = new THREE.Mesh(torusKnotGeometry, textMaterial)

      torusKnot.position.x = (Math.random() - .5) * 10
      torusKnot.position.y = (Math.random() - .5) * 10
      torusKnot.position.z = (Math.random() - .5) * 10

      torusKnot.rotation.x = Math.random() * Math.PI
      torusKnot.rotation.y = Math.random() * Math.PI

      let scaleRandom = Math.random()
      torusKnot.scale.set(scaleRandom, scaleRandom, scaleRandom)

      scene.add(torusKnot)
    }
  }
)

// Axes Helper


/**
 * Object
 */
// const cube = new THREE.Mesh(
//   new THREE.BoxGeometry(1, 1, 1),
//   new THREE.MeshBasicMaterial()
// )

// scene.add(cube)

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
camera.position.x = 1
camera.position.y = 1
camera.position.z = 4
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
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
  const elapsedTime = clock.getElapsedTime()

  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()