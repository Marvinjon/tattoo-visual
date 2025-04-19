'use client';

import React, { Suspense, useRef } from 'react';
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, useGLTF } from '@react-three/drei';

// Make THREE available globally to avoid initialization issues
if (typeof window !== 'undefined') {
  window.THREE = THREE;
}

function Model({ rotation }) {
  const group = useRef(null);
  const { scene } = useGLTF('/models/human-model.glb');
  
  return (
    <group ref={group} rotation={[0, (rotation * Math.PI) / 180, 0]}>
      <primitive object={scene} scale={1} position={[0, -1, 0]} />
    </group>
  );
}

// Preload model
if (typeof window !== 'undefined') {
  useGLTF.preload('/models/human-model.glb');
}

export default function ClientScene({ rotation, onSceneLoaded }) {
  return (
    <div className="w-full h-full">
      <Canvas 
        shadows 
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        camera={{ position: [0, 1.5, 2.5], fov: 50 }}
        onCreated={({ gl, scene }) => {
          // Configure renderer
          gl.setClearColor(0x000000, 0);
          gl.physicallyCorrectLights = true;
          
          // Notify parent component
          if (onSceneLoaded) onSceneLoaded();
        }}
      >
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} castShadow />
        <pointLight position={[-10, -10, -10]} />
        
        <Suspense fallback={null}>
          <Model rotation={rotation} />
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
    </div>
  );
} 