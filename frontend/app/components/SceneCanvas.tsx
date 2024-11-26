import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import { CameraController } from './CameraController';
import { Text2D } from './Text2D';
import { Model } from './AnimatedTrees';
import { AnimatedCaravan } from './AnimatedCaravan';
import { Title2D } from './Title2D';
import NewsPanel from './NewsPanel';

interface SceneCanvasProps {
  cameraPosition: { x: number; y: number; z: number };
  cameraTilt: number;
  cameraLookAt: { x: number; y: number; z: number };
  playCaravanAnimation: boolean;
  isCaravanReverse: boolean;
  isTreesAnimating: boolean;
  handleTabClick?: (tab: string) => void;
  isButtonClicked: boolean;
}

const SceneCanvas: React.FC<SceneCanvasProps> = ({
  cameraPosition,
  cameraTilt,
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
        <Text2D isTreesAnimating={isTreesAnimating} />

          <Title2D />
        <Model isAnimating={isTreesAnimating} url='/TreePlanet.glb' />
      </React.Suspense>
      <CameraController
        position={cameraPosition}
        lookAt={cameraLookAt}
        tilt={cameraTilt}
      />
      <NewsPanel isTreesAnimating={isTreesAnimating}/>
      {/* <OrbitControls ref={orbitControlsRef} /> */}
    </Canvas>
    
  );
};

export default SceneCanvas;