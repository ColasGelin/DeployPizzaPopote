'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group } from 'three';
import { Environment } from './Model';

interface AnimatedTreesProps {
  isAnimating: boolean;
}

export const AnimatedTrees: React.FC<AnimatedTreesProps> = ({ isAnimating }) => {
  const treeRef1 = useRef<Group>(null);
  const treeRef2 = useRef<Group>(null);
  const [currentSpeed, setCurrentSpeed] = useState(2);
  const maxSpeed = 2; // Maximum speed when fully animated
  const resetPosition = -20; // The x-position where the tree resets
  const startPosition = -70; // The x-position where the tree starts
  const spacing = 72; // The spacing between the two environments
  const decelerationRate = 0.991; // Rate at which the speed decreases (adjust as needed)

  useEffect(() => {
    if (isAnimating) {
      setCurrentSpeed(maxSpeed);
    }
  }, [isAnimating]);

  useFrame((state, delta) => {
    if (treeRef1.current && treeRef2.current) {
      if (isAnimating) {
        // Move both trees to the left at full speed
        treeRef1.current.position.x -= currentSpeed * delta;
        treeRef2.current.position.x -= currentSpeed * delta;
      } else if (currentSpeed > 0.01) {
        // Gradually slow down
        const newSpeed = currentSpeed * decelerationRate;
        setCurrentSpeed(newSpeed);
        
        // Move trees with decreasing speed
        treeRef1.current.position.x -= newSpeed * delta;
        treeRef2.current.position.x -= newSpeed * delta;
      }

      // Reset positions when trees move off-screen
      if (treeRef1.current.position.x < startPosition) {
        treeRef1.current.position.x = treeRef2.current.position.x + spacing;
      }
      if (treeRef2.current.position.x < startPosition) {
        treeRef2.current.position.x = treeRef1.current.position.x + spacing;
      }
    }
  });

  return (
    <>
      <group ref={treeRef1} position={[resetPosition, -.15, 5]}>
        <Environment />
      </group>
      <group ref={treeRef2} position={[resetPosition + spacing, -.15, 5]}>
        <Environment />
      </group>
    </>
  );
};