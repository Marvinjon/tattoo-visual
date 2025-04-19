'use client'

import { useState } from 'react'
import { TattooImage } from '../lib/types'

interface ModelControlsProps {
  rotation: number
  onRotationChange: (rotation: number) => void
  activeTattoo: TattooImage | null
  onTattooChange?: (tattoo: TattooImage) => void
}

export default function ModelControls({ 
  rotation, 
  onRotationChange, 
  activeTattoo,
  onTattooChange
}: ModelControlsProps) {
  const [showAdvanced, setShowAdvanced] = useState(false)
  
  const updateTattooSize = (size: number) => {
    if (activeTattoo && onTattooChange) {
      onTattooChange({
        ...activeTattoo,
        size
      })
    }
  }
  
  return (
    <div className="controls">
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="flex items-center">
          <span className="text-sm text-gray-400 mr-2">Rotate Model:</span>
          <input
            type="range"
            min="0"
            max="360"
            value={rotation}
            onChange={(e) => onRotationChange(parseInt(e.target.value))}
            className="w-32 md:w-40 accent-purple-500"
          />
          <span className="text-sm text-gray-400 ml-2">{rotation}°</span>
        </div>
        
        {activeTattoo && (
          <button 
            className="text-sm text-gray-300 hover:text-white transition-colors"
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            {showAdvanced ? "Hide Advanced" : "Show Advanced Controls"}
          </button>
        )}
      </div>
      
      {showAdvanced && activeTattoo && (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center">
            <span className="text-sm text-gray-400 mr-2">Tattoo Size:</span>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={activeTattoo.size || 1}
              onChange={(e) => updateTattooSize(parseFloat(e.target.value))}
              className="w-32 md:w-40 accent-purple-500"
            />
            <span className="text-sm text-gray-400 ml-2">{activeTattoo.size?.toFixed(1) || 1}</span>
          </div>
        </div>
      )}
      
      <div className="flex gap-2">
        <button 
          className="upload-btn"
          onClick={() => onRotationChange(0)}
        >
          Reset Rotation
        </button>
      </div>
    </div>
  )
} 