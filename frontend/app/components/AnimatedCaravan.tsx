'use client';

import React, { useRef, useEffect, useState } from 'react';
import { useGLTF, useAnimations } from '@react-three/drei';
import * as THREE from 'three';
import { GLTF } from 'three-stdlib';

type GLTFResult = GLTF & {
  nodes: {
    [key: string]: THREE.Mesh;
  };
  materials: {
    [key: string]: THREE.Material;
  };
  animations: THREE.AnimationClip[];
};

interface AnimatedCaravanProps {
  url?: string;
  scale?: [number, number, number];
  position?: [number, number, number];
  rotation?: [number, number, number];
  playAnimation: boolean;
  isReverse: boolean;
  isTreesAnimating: boolean;
}

export const AnimatedCaravan: React.FC<AnimatedCaravanProps> = ({
  url = "/CaravanFlat.glb",
  scale = [0.5, 0.5, 0.5],
  position = [-3, -0.2, 0],
  rotation = [0, Math.PI / 2, 0],
  playAnimation,
  isReverse,
  isTreesAnimating
}) => {
  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF(url) as GLTFResult;
  const { actions } = useAnimations(animations, group);
  const [currentActions, setCurrentActions] = useState<THREE.AnimationAction[]>([]);
  const isFirstExecution = useRef(true);

  useEffect(() => {
    const actionKeys = Object.keys(actions);
    console.log(actionKeys);
    if (actionKeys.length > 0) {
      const newActions = actionKeys.map(key => {
        const action = actions[key];
        if (action) {
          action.clampWhenFinished = true;
          action.setLoop(THREE.LoopOnce, 1);
        }
        return action;
      }).filter(action => action !== undefined) as THREE.AnimationAction[];
      setCurrentActions(newActions);
    }
  }, [actions]);

  useEffect(() => {
    if (currentActions.length > 0) {
      console.log(playAnimation, isTreesAnimating);
      console.log("action : ", currentActions);
      currentActions.forEach(action => {
        const actionName = action.getClip().name;
        if (["rearWheel", "carMovement", "frontWheel", "roueCaravan", "caravaan", "pancarteMenu", "CaravanWheels"].includes(actionName)) {
          // These animations should loop infinitely when trees are animated
          if (isTreesAnimating) {
            action.setLoop(THREE.LoopRepeat, Infinity);
            if (actionName === "carMovement")
              action.timeScale = 1.5;
            else
              action.timeScale = 1;
            action.paused = false;
            action.play();
          } else {
            action.setLoop(THREE.LoopOnce, 1);
            action.paused = true;
          }
        } else {
          // Other animations
          if (playAnimation && !isFirstExecution.current) {
            action.paused = false;
            if (isReverse) {
              action.timeScale = -1;
              // If the animation is at the start, move it to the end
              if (action.time === 0) {
                action.time = action.getClip().duration;
              }
              action.play();
            } else {
              action.timeScale = 0.7;
              action.play().reset();
            }
          }
        }
      });
      
      isFirstExecution.current = false;
    }
  }, [playAnimation, currentActions, isTreesAnimating]);

  return (
    <group ref={group} scale={scale} position={position} rotation={rotation}>
      <primitive object={scene} />
    </group>
  );
};

useGLTF.preload("/CaravanFlat.glb");