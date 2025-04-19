'use client'

import { useState } from 'react'
import HumanModel from './components/HumanModel'
import Header from './components/Header'
import UploadTattoo from './components/UploadTattoo'
import ModelControls from './components/ModelControls'
import { TattooImage } from './lib/types'

export default function Home() {
  const [tattoos, setTattoos] = useState<TattooImage[]>([])
  const [activeTattoo, setActiveTattoo] = useState<TattooImage | null>(null)
  const [modelRotation, setModelRotation] = useState(0)
  
  const addTattoo = (newTattoo: TattooImage) => {
    setTattoos([...tattoos, newTattoo])
    setActiveTattoo(newTattoo)
  }
  
  const removeTattoo = (id: string) => {
    setTattoos(tattoos.filter(tattoo => tattoo.id !== id))
    if (activeTattoo?.id === id) {
      setActiveTattoo(tattoos.length > 1 ? tattoos[0] : null)
    }
  }
  
  const updateTattoo = (updatedTattoo: TattooImage) => {
    setTattoos(tattoos.map(tattoo => 
      tattoo.id === updatedTattoo.id ? updatedTattoo : tattoo
    ))
    setActiveTattoo(updatedTattoo)
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="card bg-gray-800 p-4 md:p-0 mb-8">
          <div className="flex flex-col md:flex-row">
            <div className="w-full md:w-3/4">
              <div className="canvas-container">
                <HumanModel 
                  activeTattoo={activeTattoo} 
                  rotation={modelRotation}
                  onTattooChange={updateTattoo}
                />
              </div>
            </div>
            
            <div className="w-full md:w-1/4 p-4">
              <UploadTattoo onUpload={addTattoo} />
              
              <div className="mt-6">
                <h3 className="text-xl font-bold mb-4">Your Tattoos</h3>
                <div className="flex flex-wrap gap-2">
                  {tattoos.map(tattoo => (
                    <div 
                      key={tattoo.id}
                      className={`relative p-1 border-2 rounded ${activeTattoo?.id === tattoo.id ? 'border-purple-500' : 'border-gray-700'}`}
                      onClick={() => setActiveTattoo(tattoo)}
                    >
                      <img 
                        src={tattoo.url} 
                        alt="Tattoo" 
                        className="w-16 h-16 object-cover"
                      />
                      <button 
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                        onClick={(e) => {
                          e.stopPropagation()
                          removeTattoo(tattoo.id)
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <ModelControls 
            onRotationChange={setModelRotation} 
            rotation={modelRotation}
            activeTattoo={activeTattoo}
            onTattooChange={updateTattoo}
          />
        </div>
      </div>
    </div>
  )
} 