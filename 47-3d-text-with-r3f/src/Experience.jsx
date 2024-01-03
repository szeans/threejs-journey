import { useMatcapTexture, Center, Text3D, OrbitControls } from '@react-three/drei'
import { Perf } from 'r3f-perf'
import { useRef, useEffect } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'

const torusGeometry = new THREE.TorusGeometry()
const matcapMat = new THREE.MeshMatcapMaterial()

export default function Experience() {
  const donutGroup = useRef()

  const [matcapTexture] = useMatcapTexture('385264_A1D3E2_86ADC1_6E94A8', 512)

  useEffect(() => {
    matcapTexture.colorSpace = THREE.SRGBColorSpace
    matcapTexture.needsUpdate = true
    matcapMat.matcap = matcapTexture
    matcapMat.needsUpdate = true
  }), []

  useFrame((state, delta) => {
    for (const donut of donutGroup.current.children) {
      donut.rotation.y += 0.2 * delta
    }
  })

  return <>

    <Perf position="top-left" />

    <OrbitControls makeDefault />

    <Center>
      <Text3D
        material={matcapMat}
        font='./fonts/helvetiker_regular.typeface.json'
        size={0.5}
        height={.25}
        curveSegments={12}
        bevelEnabled
        bevelThickness={0.05}
        bevelSize={0.02}
        bevelOffset={0}
        bevelSegments={5}
      >
        MEOWNGES
      </Text3D>
    </Center>

    <group ref={donutGroup}>
      {[...Array(100)].map((value, index) =>
        <mesh
          key={index}
          geometry={torusGeometry}
          material={matcapMat}
          position={[(Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10]}
          scale={0.2 + (Math.random() * 0.2)}
          rotation={[
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            0
          ]}
        />
      )}
    </group>

  </>
}