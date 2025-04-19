'use client'

import { useState, useRef } from 'react'
import { TattooImage } from '../lib/types'
import { v4 as uuidv4 } from 'uuid'

interface UploadTattooProps {
  onUpload: (tattoo: TattooImage) => void
}

export default function UploadTattoo({ onUpload }: UploadTattooProps) {
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }
  
  const handleDragLeave = () => {
    setIsDragging(false)
  }
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files)
    }
  }
  
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files)
    }
  }
  
  const handleFiles = (files: FileList) => {
    const file = files[0]
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      
      reader.onload = (e) => {
        const newTattoo: TattooImage = {
          id: uuidv4(),
          url: e.target?.result as string,
          name: file.name,
          position: { x: 0, y: 0, z: 0 },
          size: 1,
          rotation: 0
        }
        
        onUpload(newTattoo)
      }
      
      reader.readAsDataURL(file)
    }
  }
  
  return (
    <div className="w-full">
      <h3 className="text-xl font-bold mb-4">Upload Tattoo</h3>
      
      <div 
        className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
          isDragging ? 'border-purple-500 bg-purple-500/10' : 'border-gray-700 hover:border-purple-500'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto mb-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
        
        <p className="text-sm text-gray-400">
          Drag & drop your tattoo image here or click to browse
        </p>
        
        <input 
          type="file" 
          className="hidden" 
          ref={fileInputRef}
          accept="image/*"
          onChange={handleFileInput}
        />
      </div>
      
      <div className="mt-4">
        <p className="text-xs text-gray-500">
          Supported formats: PNG, JPG, SVG (transparent background recommended)
        </p>
      </div>
    </div>
  )
} 