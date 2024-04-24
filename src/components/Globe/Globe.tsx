"use client";

import { OrbitControls } from '@react-three/drei'
import { Canvas } from "@react-three/fiber";
import { Particles } from './Particles'
// import { useControls } from 'leva'
export default function Globe() {
  // Uncomment to adjust params
  // const props = useControls({
  //   focus: { value: 6, min: 3, max: 7, step: 0.01 },
  //   speed: { value: 6, min: 0.1, max: 100, step: 0.1 },
  //   aperture: { value: 3.8, min: 1, max: 5.6, step: 0.1 },
  //   fov: { value: 52, min: 0, max: 200 },
  //   curl: { value: 0.42, min: 0.01, max: 0.5, step: 0.01 },
  // })

 const props = {"focus":6,"speed":6,"aperture":3.8,"fov":52,"curl":0.42}
  return (
    <Canvas style={{ height: '100%' }} camera={{ fov: 25, position: [0, 0, 6] }}>
      <OrbitControls makeDefault autoRotate autoRotateSpeed={0.5} zoomSpeed={0.5} />
      <Particles {...props} />
    </Canvas>
  )
}
