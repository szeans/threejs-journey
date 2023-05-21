import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
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

// Fog
const fog = new THREE.Fog('#262837', .8, 15)

scene.fog = fog

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const doorColorTexture = textureLoader.load('/textures/door/color.jpg')
const doorAlphaTexture = textureLoader.load('/textures/door/alpha.jpg')
const doorAmbientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg')
const doorHeightTexture = textureLoader.load('/textures/door/height.jpg')
const doorNormalTexture = textureLoader.load('/textures/door/normal.jpg')
const doorMetalnessTexture = textureLoader.load('/textures/door/metalness.jpg')
const doorRoughnessTexture = textureLoader.load('/textures/door/roughness.jpg')

const bricksColorTexture = textureLoader.load('/textures/bricks/color.jpg')
const bricksAmbientOcclusionTexture = textureLoader.load('/textures/bricks/ambientOcclusion.jpg')
const bricksNormalTexture = textureLoader.load('/textures/bricks/normal.jpg')
const bricksRoughnessTexture = textureLoader.load('/textures/bricks/roughness.jpg')

const grassColorTexture = textureLoader.load('/textures/grass/color.jpg')
const grassAmbientOcclusionTexture = textureLoader.load('/textures/grass/ambientOcclusion.jpg')
const grassNormalTexture = textureLoader.load('/textures/grass/normal.jpg')
const grassRoughnessTexture = textureLoader.load('/textures/grass/roughness.jpg')

grassColorTexture.repeat.set(8, 8)
grassAmbientOcclusionTexture.repeat.set(8, 8)
grassNormalTexture.repeat.set(8, 8)
grassRoughnessTexture.repeat.set(8, 8)
grassColorTexture.wrapS = THREE.RepeatWrapping
grassAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping
grassNormalTexture.wrapS = THREE.RepeatWrapping
grassRoughnessTexture.wrapS = THREE.RepeatWrapping
grassColorTexture.wrapT = THREE.RepeatWrapping
grassAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping
grassNormalTexture.wrapT = THREE.RepeatWrapping
grassRoughnessTexture.wrapT = THREE.RepeatWrapping

const rockMossOriginal = textureLoader.load('/textures/rock_moss/Rock_Moss_diffuseOriginal.png')
const rockMossAO = textureLoader.load('/textures/rock_moss/Rock_Moss_ao.png')
const rockMossMetallic = textureLoader.load('/textures/rock_moss/Rock_Moss_metallic.png')
const rockMossNormal = textureLoader.load('/textures/rock_moss/Rock_Moss_normal.png')
const rockMossRoughness = textureLoader.load('/textures/rock_moss/Rock_Moss_smoothness.png')

/**
 * House
 */
const house = new THREE.Group()
scene.add(house)

// Walls
const walls = new THREE.Mesh(
  new THREE.BoxGeometry(4, 2.5, 4),
  new THREE.MeshStandardMaterial({
    map: bricksColorTexture,
    aoMap: bricksAmbientOcclusionTexture,
    normalMap: bricksNormalTexture,
    roughnessMap: bricksRoughnessTexture
  })
)
walls.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(walls.geometry.attributes.uv.array, 2))
walls.position.y = 1.25
walls.castShadow = true
house.add(walls)

// Roof
const roof = new THREE.Mesh(
  new THREE.ConeGeometry(3.5, 1.5, 4),
  new THREE.MeshStandardMaterial({ color: '#b35f45' })
)
roof.position.y = 2.5 + 1.5 / 2
roof.rotation.y = Math.PI * 1 / 4
roof.castShadow = true
house.add(roof)

// Door
const door = new THREE.Mesh(
  new THREE.PlaneGeometry(2.2, 2.2, 512, 512),
  new THREE.MeshStandardMaterial({
    transparent: true,
    map: doorColorTexture,
    alphaMap: doorAlphaTexture,
    aoMap: doorAmbientOcclusionTexture,
    displacementMap: doorHeightTexture,
    displacementScale: 0.1,
    normalMap: doorNormalTexture,
    metalnessMap: doorMetalnessTexture,
    roughnessMap: doorRoughnessTexture
  })
)
door.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array, 2))
door.position.y = 1
door.position.z = 2 + .001
house.add(door)

// Bushes
const bushGeometry = new THREE.SphereGeometry(1, 16, 16)
const bushMaterial = new THREE.MeshStandardMaterial({ color: `#89c854` })
const bush1 = new THREE.Mesh(bushGeometry, bushMaterial)
bush1.scale.set(.5, .5, .5)
bush1.position.set(-1, 0.2, 2.3)
bush1.castShadow = true
const bush2 = new THREE.Mesh(bushGeometry, bushMaterial)
bush2.scale.set(.3, .3, .3)
bush2.position.set(-1.5, 0.2, 2.1)
bush2.castShadow = true
const bush3 = new THREE.Mesh(bushGeometry, bushMaterial)
bush3.scale.set(.4, .4, .4)
bush3.position.set(1, 0.2, 2.3)
bush3.castShadow = true
const bush4 = new THREE.Mesh(bushGeometry, bushMaterial)
bush4.scale.set(.6, .46, .6)
bush4.position.set(2.1, 0.1, 1.3)
bush4.castShadow = true
house.add(bush1, bush2, bush3, bush4)

// Graveyard
const graves = new THREE.Group()
scene.add(graves)

const graveGeometry = new THREE.BoxGeometry(.6, .8, .2)
const graveMaterial = new THREE.MeshStandardMaterial({
  transparent: true,
  map: rockMossOriginal,
  aoMap: rockMossAO,
  normalMap: rockMossNormal,
  roughnessMap: rockMossRoughness,
  metalnessMap: rockMossMetallic,
})

for (let i = 0; i < 50; i++) {
  const angle = Math.random() * Math.PI * 2
  const radius = 3.5 + Math.random() * 6.2
  const x = radius * Math.sin(angle)
  const z = radius * Math.cos(angle)

  const grave = new THREE.Mesh(graveGeometry, graveMaterial)
  grave.position.set(x, .3, z)
  grave.rotation.y = (Math.random() - .5) * .5
  grave.rotation.z = (Math.random() - .5) * .2
  grave.castShadow = true
  graves.add(grave)
}

// Floor
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 20),
  new THREE.MeshStandardMaterial({
    map: grassColorTexture,
    aoMap: grassAmbientOcclusionTexture,
    normalMap: grassNormalTexture,
    roughnessMap: grassRoughnessTexture
  })
)
floor.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(floor.geometry.attributes.uv.array, 2))
floor.rotation.x = - Math.PI * 0.5
floor.position.y = 0
scene.add(floor)

/**
 * Ghosts
 */
const ghost1 = new THREE.PointLight('#ff00ff', 2, 3)
scene.add(ghost1)

const ghost2 = new THREE.PointLight('#00ffff', 2, 3)
scene.add(ghost2)

const ghost3 = new THREE.PointLight('#ffff00', 2, 3)
scene.add(ghost3)

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight('#b9d5ff', 0.11)
//gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001)
scene.add(ambientLight)

// Directional light
const moonLight = new THREE.DirectionalLight('#ffffff', 0.11)
moonLight.position.set(4, 5, - 2)
//gui.add(moonLight, 'intensity').min(0).max(1).step(0.001)
//gui.add(moonLight.position, 'x').min(- 5).max(5).step(0.001)
//gui.add(moonLight.position, 'y').min(- 5).max(5).step(0.001)
//gui.add(moonLight.position, 'z').min(- 5).max(5).step(0.001)
scene.add(moonLight)

// Door light
const doorLight = new THREE.PointLight('#ff7d46', .7, 7)
doorLight.position.set(0, 2.2, 2.5)
house.add(doorLight)

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
const camera = new THREE.PerspectiveCamera(65, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 5
camera.position.y = 4
camera.position.z = 8
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.minDistance = 7
controls.maxDistance = 10
controls.minPolarAngle = Math.PI / 5
controls.maxPolarAngle = Math.PI / 2.2

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor('#262837')
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

/**
 * Shadows
 */
moonLight.castShadow = true
doorLight.castShadow = true
ghost1.castShadow = true
ghost2.castShadow = true
ghost3.castShadow = true
floor.receiveShadow = true

doorLight.shadow.mapSize.height = 256
doorLight.shadow.mapSize.width = 256
doorLight.shadow.camera.far = 7

ghost1.shadow.mapSize.height = 256
ghost1.shadow.mapSize.width = 256
ghost1.shadow.camera.far = 7

ghost2.shadow.mapSize.height = 256
ghost2.shadow.mapSize.width = 256
ghost2.shadow.camera.far = 7

ghost3.shadow.mapSize.height = 256
ghost3.shadow.mapSize.width = 256
ghost3.shadow.camera.far = 7

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
  const elapsedTime = clock.getElapsedTime()

  // Update controls
  controls.update()

  // Move ghosts around 
  const ghost1Angle = elapsedTime * .5
  ghost1.position.x = 5 * Math.cos(ghost1Angle)
  ghost1.position.z = 5 * Math.sin(ghost1Angle)
  ghost1.position.y = (Math.sin(ghost1Angle * 2) + 1)

  const ghost2Angle = elapsedTime * .32
  ghost2.position.x = 4 * Math.sin(ghost2Angle)
  ghost2.position.z = 4 * Math.cos(ghost2Angle)
  ghost2.position.y = (Math.cos(ghost2Angle * 3) + 1)

  const ghost3Angle = - elapsedTime * .18
  ghost3.position.x = Math.sin(ghost2Angle) * (7 + Math.sin(elapsedTime * .32))
  ghost3.position.z = Math.cos(ghost2Angle) + (4 + Math.sin(elapsedTime * .18))
  ghost3.position.y = Math.cos(ghost2Angle * 3) + Math.sin(ghost2Angle * 2) + .5


  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()