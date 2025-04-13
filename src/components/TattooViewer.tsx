import { useRef, useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

interface TattooViewerProps {
  tattooImage: string | null;
  scale: number;
  rotation: number;
}

function Model({ tattooImage, scale, rotation }: TattooViewerProps) {
  const { scene } = useGLTF('/human-model.glb');
  const textureLoader = new THREE.TextureLoader();
  const tattooTexture = tattooImage ? textureLoader.load(tattooImage) : null;

  // Apply texture to the model if available
  if (tattooTexture) {
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const material = child.material as THREE.MeshStandardMaterial;
        if (material) {
          material.map = tattooTexture;
          material.needsUpdate = true;
        }
      }
    });
  }

  return (
    <group 
      rotation={[0, rotation, 0]} 
      scale={[scale, scale, scale]}
      position={[0, -5, 0]} // Move the model even further down
    >
      <primitive object={scene} />
    </group>
  );
}

function LoadingScreen() {
  return (
    <div style={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      color: '#646cff',
      fontSize: '1.2rem',
      fontWeight: 'bold'
    }}>
      Loading 3D Model...
    </div>
  );
}

function ErrorScreen() {
  return (
    <div style={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      color: '#ff4646',
      fontSize: '1.2rem',
      textAlign: 'center'
    }}>
      <p>Error loading the 3D model.</p>
      <p style={{ fontSize: '1rem', marginTop: '1rem' }}>
        Please make sure 'human-model.glb' is placed in the public directory.
      </p>
    </div>
  );
}

export default function TattooViewer({ tattooImage, scale, rotation }: TattooViewerProps) {
  const [error, setError] = useState(false);

  return (
    <div style={{ width: '100%', height: '80vh', position: 'relative' }}>
      <Canvas
        camera={{ 
          position: [0, 2, 4], // Adjusted camera position for an even more zoomed-out view
          fov: 50, // Even wider field of view
          near: 0.1,
          far: 1000
        }}
        style={{ background: '#f0f0f0' }}
        onError={() => setError(true)}
      >
        <Suspense fallback={null}>
          {!error && (
            <>
              <ambientLight intensity={0.5} />
              <directionalLight position={[10, 10, 5]} intensity={1} />
              <Model tattooImage={tattooImage} scale={scale} rotation={rotation} />
              <OrbitControls
                enablePan={true}
                enableZoom={true}
                enableRotate={true}
                minDistance={4}
                maxDistance={20}
                target={[0, -3, 0]} // Adjusted target to match new model position
              />
            </>
          )}
        </Suspense>
      </Canvas>
      <Suspense fallback={<LoadingScreen />}>
        {error && <ErrorScreen />}
      </Suspense>
    </div>
  );
} 