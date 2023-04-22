import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Galaxy
 */
const parameters = {
  count: 100000,
  size: 0.01,
  radius: 5,
  branches: 3,
  spin: 1,
  randomness: 0.2,
  randomnessPower: 3,
  insideColor: '#ff6030',
  outsideColor: '#1b3984',
}

let galaxyGeometry = null
let galaxyMaterial = null
let points = null

const generateGalaxy = () => {
  // Destory old galaxy
  if (points !== null) {
    galaxyGeometry.dispose()
    galaxyMaterial.dispose()
    scene.remove(points)
  }

  // Geometry
  galaxyGeometry = new THREE.BufferGeometry()
  const positions = new Float32Array(parameters.count * 3)
  const colors = new Float32Array(parameters.count * 3)

  const colorInside = new THREE.Color(parameters.insideColor)
  const colorOutside = new THREE.Color(parameters.outsideColor)

  for (let i = 0; i < parameters.count; i++) {
    const i3 = i * 3

    // Position
    const radius = Math.pow(Math.random(), 1.5) * parameters.radius
    const spinAngle = radius * parameters.spin
    const branchAngle = i % parameters.branches / parameters.branches * Math.PI * 2

    const randomX = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < .5 ? (1) : (-1))
    const randomY = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < .5 ? (1) : (-1))
    const randomZ = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < .5 ? (1) : (-1))

    positions[i3 + 0] = randomX + Math.cos(branchAngle + spinAngle) * radius
    positions[i3 + 1] = randomY
    positions[i3 + 2] = randomZ + Math.sin(branchAngle + spinAngle) * radius

    // Color
    const mixedColor = colorInside.clone()
    mixedColor.lerp(colorOutside, radius/(parameters.radius - 1))

    colors[i3 + 0] = mixedColor.r
    colors[i3 + 1] = mixedColor.g
    colors[i3 + 2] = mixedColor.b
  }

  galaxyGeometry.setAttribute(
    'position',
    new THREE.BufferAttribute(positions, 3)
  )

  galaxyGeometry.setAttribute(
    'color',
    new THREE.BufferAttribute(colors, 3)
  )

  // Material
  galaxyMaterial = new THREE.PointsMaterial({
    vertexColors: true,
    size: parameters.size,
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  })

  // Points
  points = new THREE.Points(galaxyGeometry, galaxyMaterial)
  scene.add(points)
}

generateGalaxy()
gui.add(parameters, 'count').min(100).max(1000000).step(5000).onFinishChange(generateGalaxy)
gui.add(parameters, 'size').min(.01).max(.1).step(.01).onFinishChange(generateGalaxy)
gui.add(parameters, 'radius').min(.1).max(20).step(.5).onFinishChange(generateGalaxy)
gui.add(parameters, 'branches').min(2).max(20).step(1).onFinishChange(generateGalaxy)
gui.add(parameters, 'spin').min(-5).max(5).step(.05).onFinishChange(generateGalaxy)
gui.add(parameters, 'randomness').min(0).max(2).step(.02).onFinishChange(generateGalaxy)
gui.add(parameters, 'randomnessPower').min(1).max(10).step(.05).onFinishChange(generateGalaxy)
gui.addColor(parameters, 'insideColor').onFinishChange(generateGalaxy)
gui.addColor(parameters, 'outsideColor').onFinishChange(generateGalaxy)

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
camera.position.x = 3
camera.position.y = 3
camera.position.z = 3
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

  points.position.y = Math.sin(elapsedTime) * .1
  points.rotation.y = elapsedTime * .1
  points.rotation.x = Math.sin(elapsedTime) * .05
  points.rotation.z = Math.cos(elapsedTime) * .05

  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()