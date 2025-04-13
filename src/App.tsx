import { useState, ChangeEvent } from 'react'
import TattooViewer from './components/TattooViewer'
import './App.css'

function App() {
  const [tattooImage, setTattooImage] = useState<string | null>(null)
  const [scale, setScale] = useState(1)
  const [rotation, setRotation] = useState(0)

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setTattooImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="app-container">
      <h1>Tattoo Visualizer</h1>
      <div className="controls">
        <div className="control-group">
          <label htmlFor="image-upload" className="upload-button">
            Upload Tattoo Image
            <input
              type="file"
              id="image-upload"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: 'none' }}
            />
          </label>
        </div>
        
        <div className="control-group">
          <label>
            Size:
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={scale}
              onChange={(e) => setScale(Number(e.target.value))}
            />
          </label>
        </div>

        <div className="control-group">
          <label>
            Rotation:
            <input
              type="range"
              min="0"
              max="6.28"
              step="0.1"
              value={rotation}
              onChange={(e) => setRotation(Number(e.target.value))}
            />
          </label>
        </div>
      </div>

      <TattooViewer
        tattooImage={tattooImage}
        scale={scale}
        rotation={rotation}
      />
    </div>
  )
}

export default App
