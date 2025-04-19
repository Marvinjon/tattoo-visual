'use client'

import { Suspense, useRef, useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, useGLTF, Environment, ContactShadows } from '@react-three/drei'
import { TattooImage } from '../lib/types'
import LoadingSpinner from './LoadingSpinner'
import TattooOverlay from './TattooOverlay'

interface HumanModelProps {
  activeTattoo: TattooImage | null
  rotation: number
  onTattooChange?: (tattoo: TattooImage) => void
}

function Model({ rotation }: { rotation: number }) {
  const group = useRef(null)
  const { scene } = useGLTF('/models/human-model.glb')
  
  return (
    <group ref={group} rotation={[0, (rotation * Math.PI) / 180, 0]}>
      <primitive object={scene} scale={1} position={[0, -1, 0]} />
    </group>
  )
}

// Pre-load the model
useGLTF.preload('/models/human-model.glb')

export default function HumanModel(props: HumanModelProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 })
  const containerRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    if (!containerRef.current) return
    
    const updateSize = () => {
      if (containerRef.current) {
        setContainerSize({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight
        })
      }
    }
    
    updateSize()
    window.addEventListener('resize', updateSize)
    
    return () => window.removeEventListener('resize', updateSize)
  }, [])
  
  const handleUpdatePosition = (position: { x: number, y: number, z: number }) => {
    if (props.activeTattoo && props.onTattooChange) {
      props.onTattooChange({
        ...props.activeTattoo,
        position
      })
    }
  }
  
  return (
    <div ref={containerRef} className="relative h-full w-full">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <LoadingSpinner />
        </div>
      )}
      
      <Canvas 
        shadows 
        camera={{ position: [0, 1.5, 2.5], fov: 50 }}
        onCreated={() => setIsLoading(false)}
      >
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} castShadow />
        <pointLight position={[-10, -10, -10]} />
        
        <Suspense fallback={null}>
          <Model rotation={props.rotation} />
          <Environment preset="city" />
          <ContactShadows
            rotation={[Math.PI / 2, 0, 0]}
            position={[0, -1, 0]}
            opacity={0.5}
            width={10}
            height={10}
            blur={1}
            far={1}
          />
        </Suspense>
        
        <OrbitControls 
          enablePan={false}
          minDistance={1.5}
          maxDistance={4}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI - Math.PI / 6}
        />
      </Canvas>
      
      {props.activeTattoo && containerSize.width > 0 && (
        <TattooOverlay
          activeTattoo={props.activeTattoo}
          canvasWidth={containerSize.width}
          canvasHeight={containerSize.height}
          onUpdatePosition={handleUpdatePosition}
        />
      )}
      
      {props.activeTattoo && (
        <div className="absolute bottom-4 left-4 bg-gray-800 bg-opacity-70 p-2 rounded-lg">
          <p className="text-sm text-white">
            Showing: {props.activeTattoo.name}
          </p>
        </div>
      )}
    </div>
  )
} 