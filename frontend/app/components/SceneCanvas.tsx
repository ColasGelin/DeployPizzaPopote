import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { CameraController } from './CameraController';
import { Text2D } from './Text2D';
import NewsPlaneBackground from './NewsPlaneBackground';
import { AnimatedTrees } from './AnimatedTrees';
import { AnimatedCaravan } from './AnimatedCaravan';
import { PlaneBackgroundConfig } from './PlaneBackgroundConfig';
import { is } from '@react-three/fiber/dist/declarations/src/core/utils';
import { Title2D } from './Title2D';

interface SceneCanvasProps {
  cameraPosition: { x: number; y: number; z: number };
  cameraLookAt: { x: number; y: number; z: number };
  playCaravanAnimation: boolean;
  isCaravanReverse: boolean;
  isTreesAnimating: boolean;
}

const SceneCanvas: React.FC<SceneCanvasProps> = ({
  cameraPosition,
  cameraLookAt,
  playCaravanAnimation,
  isCaravanReverse,
  isTreesAnimating,
}) => {
  return (
    <Canvas shadows camera={{ position: [cameraPosition.x, cameraPosition.y, cameraPosition.z], fov: 50 }}>
      <color attach="background" args={['#a7e3ed']} />
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={0.5} castShadow />
      <React.Suspense fallback={null}>
        <AnimatedCaravan 
          playAnimation={playCaravanAnimation} 
          isReverse={isCaravanReverse}
          isTreesAnimating={isTreesAnimating}
        />
        <Environment preset="sunset" background={false} />
        <Text2D isTreesAnimating={isTreesAnimating}/>
        <Title2D/>
        <NewsPlaneBackground isTreesAnimating={isTreesAnimating}/>
        <AnimatedTrees isAnimating={isTreesAnimating} />
      </React.Suspense>
      <OrbitControls
        enableZoom={false}
        enableRotate={true}
        enablePan={false}
        target={[cameraLookAt.x, cameraLookAt.y, cameraLookAt.z]}
      />
      <CameraController position={cameraPosition} lookAt={cameraLookAt} />
    </Canvas>
  );
};

export default SceneCanvas;