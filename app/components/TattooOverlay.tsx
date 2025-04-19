'use client'

import { useEffect, useRef, useState } from 'react'
import { TattooImage } from '../lib/types'

interface TattooOverlayProps {
  activeTattoo: TattooImage | null
  canvasWidth: number
  canvasHeight: number
  onUpdatePosition?: (position: { x: number, y: number, z: number }) => void
}

export default function TattooOverlay({ 
  activeTattoo, 
  canvasWidth, 
  canvasHeight,
  onUpdatePosition
}: TattooOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [startPos, setStartPos] = useState({ x: 0, y: 0 })
  
  useEffect(() => {
    // Reset position when tattoo changes
    if (activeTattoo?.position) {
      setPosition({ 
        x: activeTattoo.position.x || 0, 
        y: activeTattoo.position.y || 0 
      })
    } else {
      setPosition({ x: 0, y: 0 })
    }
  }, [activeTattoo])
  
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    if (!activeTattoo) return
    
    // Load the image
    const img = new Image()
    img.src = activeTattoo.url
    
    img.onload = () => {
      // Calculate size based on tattoo size property
      const scale = activeTattoo.size || 1
      const scaledWidth = img.width * 0.5 * scale
      const scaledHeight = img.height * 0.5 * scale
      
      // Position the tattoo with offset
      const centerX = canvas.width / 2
      const centerY = canvas.height / 2
      const x = centerX - scaledWidth / 2 + position.x
      const y = centerY - scaledHeight / 2 + position.y
      
      // Draw the tattoo
      ctx.save()
      ctx.globalAlpha = 0.85 // Semi-transparent
      ctx.drawImage(img, x, y, scaledWidth, scaledHeight)
      ctx.restore()
    }
  }, [activeTattoo, canvasWidth, canvasHeight, position])
  
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!activeTattoo) return
    
    const canvas = canvasRef.current
    if (!canvas) return
    
    setIsDragging(true)
    setStartPos({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    })
  }
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !activeTattoo) return
    
    const newPosition = {
      x: e.clientX - startPos.x,
      y: e.clientY - startPos.y
    }
    
    setPosition(newPosition)
  }
  
  const handleMouseUp = () => {
    if (isDragging && activeTattoo && onUpdatePosition) {
      setIsDragging(false)
      onUpdatePosition({ 
        x: position.x, 
        y: position.y, 
        z: activeTattoo.position?.z || 0 
      })
    }
  }
  
  return (
    <canvas
      ref={canvasRef}
      width={canvasWidth}
      height={canvasHeight}
      className={`absolute inset-0 ${activeTattoo ? 'cursor-move' : 'pointer-events-none'}`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    />
  )
} 