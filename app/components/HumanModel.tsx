'use client'

import { useRef, useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import LoadingSpinner from './LoadingSpinner'
import { TattooImage } from '../lib/types'
import Scene3DWrapper from './Scene3DWrapper'

// Dynamic Tattoo Overlay with no SSR
const TattooOverlay = dynamic(
  () => import('./TattooOverlay'),
  { ssr: false }
)

interface HumanModelProps {
  activeTattoo: TattooImage | null
  rotation: number
  onTattooChange?: (tattoo: TattooImage) => void
}

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
  
  const handleSceneLoaded = () => {
    setIsLoading(false)
  }
  
  return (
    <div ref={containerRef} className="relative h-full w-full">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <LoadingSpinner />
        </div>
      )}
      
      <Scene3DWrapper
        rotation={props.rotation}
        onSceneLoaded={handleSceneLoaded}
      />
      
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