import * as THREE from 'three'
import gsap from 'gsap'

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Object
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0xffffff })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

// Sizes
const sizes = {
    width: 800,
    height: 400
}

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 3
scene.add(camera)

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)

// clock
const clock = new THREE.Clock()

// gsap.to(mesh.position, { duration: 1, delay: 1, x: 2 })
// gsap.to(mesh.position, { duration: 1, delay: 2, x: 0 })

// animations
const tick = (() => {
  // clock
  const elapsedTime = clock.getElapsedTime()

  // update objects
  mesh.rotation.x = elapsedTime
  mesh.rotation.y = elapsedTime
  mesh.position.x = Math.sin(elapsedTime)
  mesh.position.y = Math.cos(elapsedTime)

  // render  <-- only need this in tick function when using gsap
  renderer.render(scene, camera)

  window.requestAnimationFrame(tick)
})

tick()