import { Text, Html, ContactShadows, PresentationControls, Float, Environment, useGLTF } from '@react-three/drei'

export default function Experience() {
  const computer = useGLTF('https://threejs-journey.com/resources/models/macbook_model.gltf')

  return <>
    <color args={['#11191f']} attach="background" />

    <Environment preset="city" />

    <PresentationControls
      global
      rotation={[.13, 0, 0]}
      polar={[-0.4, 0.2]}
      aximuth={[-1, .75]}
      config={{ mass: 2, tension: 400 }}
      snap={{ mass: 4, tension: 400 }}>
      <Float rotationIntensity={0.3}>
        <rectAreaLight
          width={2.5}
          height={1.65}
          intensity={30}
          color={'#abcbff'}
          rotation={[0.1, Math.PI, 0]}
          position={[0, 0.55, -1.15]}
        />

        <Text
          font="/lobster-v30-latin-regular.woff"
          fontSize={1.3}
          position={[2.5, .7, .2]}
          rotation-y={-1.25}
        >szean</Text>

        <primitive
          object={computer.scene}
          position-y="-1.3"
        >
          <Html
            transform
            wrapperClass="screen"
            distanceFactor={1.17}
            position={[0, 1.56, -1.4]}
            rotation-x={-.256}
          >
            <iframe src="https://szeanchoi.com/" />
          </Html>
        </primitive>
      </Float>
    </PresentationControls >

    <ContactShadows
      position-y="-1.5"
      opacity={.4}
      scale={5}
      blur={3}
    />

  </>
}