'use client';
import React, { useRef, useState } from 'react';
import { useAnimations, useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { LoopRepeat } from 'three';

interface ModelProps {
  url: string;
  isAnimating?: boolean;
  scale?: number[];
  position?: number[];
  rotation?: number[];
}

export function Model({
  url,
  isAnimating = false,
  scale = [0.5, 0.5, 0.5],
  position = [-3, -0.1, 0],
  rotation = [0, Math.PI / 2, 0]
}: ModelProps) {
  const groupRef = useRef(null);
  const { scene, animations } = useGLTF(url);
  const { actions } = useAnimations(animations, groupRef);
  const [currentSpeed, setCurrentSpeed] = useState(0.2);
  const maxSpeed = 0.5;
  const decelerationRate = 0.991;

  useFrame(() => {
    Object.values(actions).forEach(animation => {
      if (animation) {
        if (isAnimating && currentSpeed !== maxSpeed) {
          // Accelerate to max speed
          setCurrentSpeed(maxSpeed);
          animation.timeScale = maxSpeed;
          animation.paused = false;
          animation.play();
        } else if (!isAnimating && currentSpeed > 0.001) {
          // Gradually slow down
          const newSpeed = currentSpeed * decelerationRate;
          setCurrentSpeed(newSpeed);
          animation.timeScale = newSpeed;
        } else if (!isAnimating && currentSpeed <= 0.001) {
          // Stop completely when speed is very low
          animation.timeScale = 0;
          animation.paused = true;
        }
      }
    });
  });

  React.useEffect(() => {
    Object.values(actions).forEach(animation => {
      if (animation) {
        animation.play();
        animation.timeScale = isAnimating ? maxSpeed : 0;
        animation.setLoop(LoopRepeat, Infinity);
      }
    });
  }, [actions]);

  return (
    <group ref={groupRef}>
      <primitive
        object={scene}
        scale={scale}
        position={position}
        rotation={rotation}
      />
    </group>
  );
}

export function Environment({ isAnimating = false }) {
  return (
    <Model
      url="/TreePlanet.glb"
      isAnimating={isAnimating}
    />
  );
}