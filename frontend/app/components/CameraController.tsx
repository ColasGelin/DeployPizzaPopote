'use client';

import { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { Vector3 } from 'three';

interface CameraControllerProps {
  position: { x: number; y: number; z: number };
  lookAt: { x: number; y: number; z: number };
}

export function CameraController({ position, lookAt }: CameraControllerProps) {
  const { camera } = useThree();
  const targetPosition = useRef(new Vector3(position.x, position.y, position.z));
  const targetLookAt = useRef(new Vector3(lookAt.x, lookAt.y, lookAt.z));
  const currentLookAt = useRef(new Vector3(lookAt.x, lookAt.y, lookAt.z));

  useEffect(() => {
    targetPosition.current.set(position.x, position.y, position.z);
    targetLookAt.current.set(lookAt.x, lookAt.y, lookAt.z);
  }, [position, lookAt]);

  useFrame(() => {
    // Smoothly update camera position
    camera.position.lerp(targetPosition.current, 0.02);

    // Smoothly update lookAt
    currentLookAt.current.lerp(targetLookAt.current, 0.02);

    // Apply the smooth lookAt
    camera.lookAt(currentLookAt.current);
  });

  return null;
}