import { useLoader } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { useGLTF, Clone } from '@react-three/drei'

export default function Model() {
  // const model = useLoader(GLTFLoader, 
  //   './hamburger-draco.glb',
  //   (loader) => {
  //     const dracoLoader = new DRACOLoader()
  //     dracoLoader.setDecoderPath('./draco/')
  //     loader.setDRACOLoader(dracoLoader)
  //   }
  // )

  const model = useGLTF("./hamburger-draco.glb")

  return <>
    <Clone object={model.scene} scale={.35} position-x={2} />
  </>
}

useGLTF.preload("./hamburger-draco.glb")