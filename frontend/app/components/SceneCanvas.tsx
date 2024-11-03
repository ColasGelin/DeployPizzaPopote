import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Plane } from '@react-three/drei';
import { CameraController } from './CameraController';
import { Text2D } from './Text2D';
import NewsPlaneBackground from './NewsPlaneBackground';
import { AnimatedTrees } from './AnimatedTrees';
import { AnimatedCaravan } from './AnimatedCaravan';
import { Title2D } from './Title2D';

interface SceneCanvasProps {
  cameraPosition: { x: number; y: number; z: number };
  cameraLookAt: { x: number; y: number; z: number };
  playCaravanAnimation: boolean;
  isCaravanReverse: boolean;
  isTreesAnimating: boolean;
  handleTabClick: (tab: string) => void;
  isButtonClicked: boolean;
}

const SceneCanvas: React.FC<SceneCanvasProps> = ({
  cameraPosition,
  cameraLookAt,
  playCaravanAnimation,
  isCaravanReverse,
  isTreesAnimating,
  handleTabClick,
  isButtonClicked,
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

        {isButtonClicked && (
          <>
            <Plane 
              position={[-5.8, 1.5, 3.3]} 
              args={[2, 3]} 
              rotation={[0, 0.3, 0]}
              onClick={(e) => {
                e.stopPropagation();
                handleTabClick('Actualités');
              }}
            >
              <meshStandardMaterial transparent opacity={0} />
            </Plane>
            
            <Plane 
              position={[-3.7, 1.5, 3]} 
              args={[2, 3]} 
              rotation={[0, 0, 0]}
              onClick={(e) => {
                e.stopPropagation();
                handleTabClick('L\'équipe');
              }}
            >
              <meshStandardMaterial transparent opacity={0} />
            </Plane>
            
            <Plane 
              position={[-1.35, 1.5, 3]} 
              args={[2, 3]} 
              rotation={[0, -0.3, 0]}
              onClick={(e) => {
                e.stopPropagation();
                handleTabClick('Nos pizzas');
              }}
            >
              <meshStandardMaterial transparent opacity={0} />
            </Plane>
          </>
        )}
      </React.Suspense>
      <OrbitControls
        enableZoom={false}
        enableRotate={false}
        enablePan={false}
        target={[cameraLookAt.x, cameraLookAt.y, cameraLookAt.z]}
      />
      <CameraController position={cameraPosition} lookAt={cameraLookAt} />
    </Canvas>
  );
};

export default SceneCanvas;