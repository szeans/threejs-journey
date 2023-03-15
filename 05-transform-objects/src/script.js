import * as THREE from 'three'

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Objects
 */
/* the initial red rect 
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
const mesh = new THREE.Mesh(geometry, material)

// position the mesh
mesh.position.set(0.7, -0.6, 1)

// scale the mesh
mesh.scale.set(3,1,1)

// rotate the mesh
// prevent gimbal lock
mesh.rotation.reorder('YXZ')
mesh.rotation.x = Math.PI / 4
mesh.rotation.y = Math.PI / 4

// normalize the position to 1
// mesh.position.normalize()

scene.add(mesh)
*/

const group = new THREE.Group()
group.position.y = 1
group.scale.y = 2
group.rotation.y = 1
scene.add(group)

const cube1 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0xff0000 })
)

const cube2 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0x00ff00 })
)

const cube3 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0x0000ff })
)

cube2.position.x = -1.5
cube3.position.x = 1.5

group.add(cube1)
group.add(cube2)
group.add(cube3)


// axes helper
const axesHelper = new THREE.AxesHelper(2)
scene.add(axesHelper)

/**
 * Sizes
 */
const sizes = {
  width: 800,
  height: 600
}

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
//camera.position.set(1, -0.5, 5)
camera.position.z = 4
scene.add(camera)

// look at something
//camera.lookAt(mesh.position)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas
})

// length from center of scene
//console.log(mesh.position.length());

// distance from camera
//console.log(mesh.position.distanceTo(camera.position));

renderer.setSize(sizes.width, sizes.height)
renderer.render(scene, camera)