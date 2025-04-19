'use client';

import { Suspense, useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import LoadingSpinner from './LoadingSpinner';

// Dynamic import with no SSR to ensure it only runs on client
const ClientScene = dynamic(
  () => import('./ClientScene'),
  { 
    ssr: false,
    loading: () => <LoadingSpinner />
  }
);

export default function Scene3DWrapper({ rotation, onSceneLoaded }) {
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  // Only render the 3D scene when component is mounted on the client
  if (!isMounted) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }
  
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <ClientScene 
        rotation={rotation} 
        onSceneLoaded={onSceneLoaded}
      />
    </Suspense>
  );
} 