import { useGLTF } from '@react-three/drei';
import { Group } from 'three';
import { useMemo } from 'react';

interface ModelProps {
  url: string;
  scale?: number[];
  position?: number[];
  rotation?: number[];
}

export function Model({ url, scale, position, rotation }: ModelProps) {
  const { scene } = useGLTF(url) as { scene: Group };
  const clonedScene = useMemo(() => scene.clone(), [scene]);
  
  if (scale) clonedScene.scale.set(scale[0], scale[1], scale[2]);
  if (position) clonedScene.position.set(position[0], position[1], position[2]);
  if (rotation) clonedScene.rotation.set(rotation[0], rotation[1], rotation[2]);
  
  return <primitive object={clonedScene} />;
}

interface TreeProps {
  scale?: number[];
  position?: number[];
  rotation?: number[];
}

export function Environment({ scale = [0.5, 0.5, 0.5], position = [0, -.15, -5], rotation = [0, Math.PI / 2, 0] }: TreeProps) {
  return <Model url="/Environment.glb" scale={scale} position={position} rotation={rotation} />;
}

