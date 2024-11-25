import React, { useRef, useState, useEffect } from 'react';
import { TransformControls } from '@react-three/drei';
import { Group } from 'three';
import * as THREE from 'three';
import { useThree } from '@react-three/fiber';

interface TransformableControlsProps {
  children: React.ReactNode;
  orbitControlsRef?: React.RefObject<any>;
  id: string;
}

interface Transform {
  position: THREE.Vector3;
  rotation: THREE.Euler;
  scale: THREE.Vector3;
}

export const TransformableControls: React.FC<TransformableControlsProps> = ({
  children,
  orbitControlsRef,
  id
}) => {
  const groupRef = useRef<Group>(null);
  const childRef = useRef<Group>(null);
  const [history, setHistory] = useState<Transform[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const transformRef = useRef<any>(null);
  const [mode, setMode] = useState<'translate' | 'rotate' | 'scale'>('translate');
  const { scene } = useThree();

  // Find child's world position and set controls position
  useEffect(() => {
    if (childRef.current && groupRef.current) {
      const child = childRef.current.children[0];
      if (child) {
        const worldPosition = new THREE.Vector3();
        child.getWorldPosition(worldPosition);
        groupRef.current.position.copy(worldPosition);
        child.position.set(0, 0, 0);
        saveTransform();
      }
    }
  }, [children]);

  const saveTransform = () => {
    if (groupRef.current) {
      const newTransform: Transform = {
        position: groupRef.current.position.clone(),
        rotation: groupRef.current.rotation.clone(),
        scale: groupRef.current.scale.clone()
      };

      setHistory(prev => {
        const newHistory = [...prev.slice(0, historyIndex + 1), newTransform];
        setHistoryIndex(newHistory.length - 1);
        return newHistory;
      });
    }
  };

  const applyTransform = (transform: Transform) => {
    if (groupRef.current) {
      groupRef.current.position.copy(transform.position);
      groupRef.current.rotation.copy(transform.rotation);
      groupRef.current.scale.copy(transform.scale);
    }
  };

  const undo = () => {
    if (historyIndex > 0) {
      const prevTransform = history[historyIndex - 1];
      applyTransform(prevTransform);
      setHistoryIndex(historyIndex - 1);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const nextTransform = history[historyIndex + 1];
      applyTransform(nextTransform);
      setHistoryIndex(historyIndex + 1);
    }
  };

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey) {
        if (event.shiftKey && event.key.toLowerCase() === 'z') {
          event.preventDefault();
          redo();
        } else if (event.key.toLowerCase() === 'z') {
          event.preventDefault();
          undo();
        }
      }

      switch(event.key.toLowerCase()) {
        case 'q': // Toggle orbit controls with 'O' key
          if (orbitControlsRef?.current) {
            orbitControlsRef.current.enabled = !orbitControlsRef.current.enabled;
            console.log('Orbit controls:', orbitControlsRef.current.enabled ? 'enabled' : 'disabled');
          }
          break;
        case 'g':
          setMode('translate');
          break;
        case 'r':
          setMode('rotate');
          break;
        case 's':
          setMode('scale');
          break;
        case 'p':
          if (groupRef.current) {
            const position = groupRef.current.position;
            const rotation = groupRef.current.rotation;
            console.log(`Position for ${id}:`, {
              x: Number(position.x.toFixed(3)),
              y: Number(position.y.toFixed(3)),
              z: Number(position.z.toFixed(3))
            }, {
              x: Number(rotation.x.toFixed(3)),
              y: Number(rotation.y.toFixed(3)),
              z: Number(rotation.z.toFixed(3))
            });
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [historyIndex, history, id]);

  return (
    <>
      <group ref={groupRef}>
        <group ref={childRef}>
          {children}
        </group>
      </group>

      {groupRef.current && (
        <TransformControls
          ref={transformRef}
          object={groupRef.current}
          mode={mode}
          size={0.5}
          rotationSnap={Math.PI / 180}
          onMouseDown={() => {
            saveTransform();
          }}
          onMouseUp={() => {
            saveTransform();
          }}
        />
      )}
    </>
  );
};