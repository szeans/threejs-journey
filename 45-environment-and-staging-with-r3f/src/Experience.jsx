import { useFrame } from '@react-three/fiber'
import { Stage, Lightformer, Environment, Sky, ContactShadows, RandomizedLight, AccumulativeShadows, SoftShadows, BakeShadows, useHelper, OrbitControls } from '@react-three/drei'
import { useRef } from 'react'
import { Perf } from 'r3f-perf'
import { useControls } from 'leva'

import * as THREE from 'three'
import { Light } from '@mui/icons-material'

export default function Experience() {
  const cube = useRef()
  const directionalLight = useRef()
  useHelper(directionalLight, THREE.DirectionalLightHelper, 1)

  useFrame((state, delta) => {
    const time = state.clock.elapsedTime
    cube.current.rotation.y += delta * 0.2
    //cube.current.position.x = 2 + Math.sin(time)
  })

  const { color, opacity, blur } = useControls('contact shadows', {
    color: '#1d8f75',
    opacity: { value: 0.5, min: 0, max: 1 },
    blur: { value: 2.8, min: 0, max: 10 }
  })

  const { sunPosition } = useControls('sky', {
    sunPosition: { value: [1, 2, 3] }
  })

  const { envMapIntensity } = useControls('env map', {
    envMapIntensity: { value: 2, min: 0, max: 12 }
  })

  return <>
    {/* <Environment
      background
      preset="sunset"
      resolution={512}
      ground={{
        height: 7,
        radius: 28,
        scale: 100
      }}
    >
      <color args={['black']} attach="background" />
      <Lightformer position-z={-5}
        scale={10}
        color="cyan"
        intensity={10}
        form="ring"
      />
    </Environment>

    <SoftShadows size={25} samples={10} focus={0} /> */}

    <Perf position="top-left" />

    <OrbitControls makeDefault />

    {/*<AccumulativeShadows
      position-y={[-0.99]}
      scale={10}
      color="#316d39"
      opacity={0.8}
      frames={Infinity}
      temporal
      blend={100}
    >
      <RandomizedLight
        amount={8}
        radius={1}
        ambient={0.5}
        intensity={3}
        bias={0.001}
        position={[1, 2, 3]}
      />
</AccumulativeShadows>*/}

    {/* <ContactShadows position-y={0.05}
      resolution={512}
      far={5}
      color={color}
      opacity={opacity}
      blur={blur}
      frames={1}
    /> */}

    {/*<directionalLight
      castShadow
      ref={directionalLight}
      position={sunPosition}
      intensity={4.5}
      shadow-mapSize={[1024, 1024]}
    />
    <ambientLight intensity={1.5} /> 
    
<Sky sunPosition={sunPosition}/> */}


    {/* <mesh castShadow position-x={- 2} position-y={1}>
      <sphereGeometry />
      <meshStandardMaterial roughness={0.3} color="orange" envMapIntensity={envMapIntensity} />
    </mesh>

    <mesh castShadow ref={cube} position-x={2} scale={1.5} position-y={1}>
      <boxGeometry />
      <meshStandardMaterial roughness={0.2} color="mediumpurple" envMapIntensity={envMapIntensity} />
    </mesh>

    <mesh position-y={0} rotation-x={- Math.PI * 0.5} scale={10}>
      <planeGeometry />
      <meshStandardMaterial color="greenyellow" envMapIntensity={envMapIntensity} />
    </mesh> */}

    <Stage
      shadows={{
        type: 'contact',
        opacity: 0.8,
        blur: 3
      }}
      preset="portrait"
      intensity={6}
    >
      <mesh castShadow position-x={- 2} position-y={1}>
        <sphereGeometry />
        <meshStandardMaterial roughness={0.3} color="orange" envMapIntensity={envMapIntensity} />
      </mesh>

      <mesh castShadow ref={cube} position-x={2} scale={1.5} position-y={1}>
        <boxGeometry />
        <meshStandardMaterial roughness={0.2} color="mediumpurple" envMapIntensity={envMapIntensity} />
      </mesh>
    </Stage>
  </>
}