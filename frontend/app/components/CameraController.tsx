'use client';
import { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { Vector3 } from 'three';

interface CameraControllerProps {
  position: { x: number; y: number; z: number };
  lookAt: { x: number; y: number; z: number };
  tilt?: number;
}

export function CameraController({ position, lookAt, tilt = 0 }: CameraControllerProps) {
  const { camera } = useThree();
  const targetPosition = useRef(new Vector3(position.x, position.y, position.z));
  const targetLookAt = useRef(new Vector3(lookAt.x, lookAt.y, lookAt.z));
  const currentLookAt = useRef(new Vector3());
  const targetTilt = useRef(tilt);
  const currentTilt = useRef(camera.rotation.z);
  const isFirstFrame = useRef(true);

  // Initialize currentLookAt on mount
  useEffect(() => {
    const lookAtVector = new Vector3();
    camera.getWorldDirection(lookAtVector);
    lookAtVector.multiplyScalar(10).add(camera.position);
    currentLookAt.current.copy(lookAtVector);
  }, []);

  useEffect(() => {
    targetPosition.current.set(position.x, position.y, position.z);
    targetLookAt.current.set(lookAt.x, lookAt.y, lookAt.z);
  }, [position, lookAt]);

  useEffect(() => {
    targetTilt.current = tilt;
  }, [tilt]);

  useFrame(() => {
    if (isFirstFrame.current) {
      const lookAtVector = new Vector3();
      camera.getWorldDirection(lookAtVector);
      lookAtVector.multiplyScalar(10).add(camera.position);
      currentLookAt.current.copy(lookAtVector);
      isFirstFrame.current = false;
    }

    if (!camera.position.equals(targetPosition.current)) {
      camera.position.lerp(targetPosition.current, 0.02);
    }

    if (!currentLookAt.current.equals(targetLookAt.current)) {
      currentLookAt.current.lerp(targetLookAt.current, 0.02);
      camera.lookAt(currentLookAt.current);
    }

    // Keeping original tilt handling
    currentTilt.current += (targetTilt.current - currentTilt.current) * 0.02;
    camera.rotation.z = currentTilt.current;
  });

  return null;
}