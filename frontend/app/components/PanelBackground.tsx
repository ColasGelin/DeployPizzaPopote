'use client'

import React, { useRef, useEffect, useState } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { Plane, Text } from '@react-three/drei';
import { Mesh, Vector3, TextureLoader, PerspectiveCamera, FrontSide } from 'three';
import * as THREE from 'three';

interface TextItem {
  text: string;
  position?: [number, number];
  color?: string;
  size?: number;
  boxWidth?: number;
  boxHeight?: number;
  boxBorderColor?: string;
  boxBorderSize?: number;
}

interface PlaneItem {
  imageUrl: string;
  position: [number, number];
  scale?: [number, number];
  borderColor?: string;
  borderSize?: number;
  text?: TextItem;
  title?: TextItem;
  dateAndPlace?: TextItem;
}

interface PanelBackgroundProps {
  isActive: boolean;
  isInvisible?: boolean;
  position?: [number, number, number];
  items: PlaneItem[];
}

const PanelBackground: React.FC<PanelBackgroundProps> = ({
  isActive,
  isInvisible = false,
  position = [-5, 2, 1],
  items
}) => {
  const { camera } = useThree();
  const planeRef = useRef<Mesh>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [loadedTextures, setLoadedTextures] = useState<THREE.Texture[]>([]);
  const [opacity, setOpacity] = useState(0);
  const [scale, setScale] = useState(1.5);

  const targetOpacity = isVisible ? 1 : 0;
  const targetScale = isVisible ? 1.25 : 0.95;
  const animationSpeed = 0.1; 

  useEffect(() => {
    if (isActive && !isInvisible) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1200);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [isActive, isInvisible]);

  useFrame(() => {
    setOpacity(prev => {
      const diff = targetOpacity - prev;
      return Math.abs(diff) < 0.01 ? targetOpacity : prev + diff * animationSpeed;
    });
  
    setScale(prev => {
      const diff = targetScale - prev;
      return Math.abs(diff) < 0.001 ? targetScale : prev + diff * animationSpeed;
    });
  });

  // Load and manage textures
  useEffect(() => {
    const textureLoader = new TextureLoader();
    Promise.all(
      items.map(item =>
        new Promise<THREE.Texture>((resolve) => {
          textureLoader.load(item.imageUrl, (loadedTexture) => {
            loadedTexture.needsUpdate = true;
            resolve(loadedTexture);
          });
        })
      )
    ).then(textures => {
      setLoadedTextures(textures);
    });
  }, [items]);

  // Calculate dimensions
  let planeHeight: number;
  let planeWidth: number;
  if (camera instanceof PerspectiveCamera) {
    const fov = camera.fov * (Math.PI / 180);
    const distance = 1;
    planeHeight = 4.7 * Math.tan(fov / 2) * distance;
    planeWidth = 1;
  } else {
    planeHeight = 4.4;
    planeWidth = 1;
  }

  // Position conversion utility
  const convert2DTo3D = (pos: [number, number], index: number): [number, number, number] => {
    return [
      pos[0] * planeWidth,
      pos[1] * planeHeight,
      0.01 + index * 0.001
    ];
  };

  return (
    <group
      position={new Vector3(...position)}
      rotation={[-0.64, 0.58, 0.54]}
      visible={opacity > 0}
      frustumCulled={false}
      scale={[scale, scale, scale]}
    >
      {/* Background plane */}
      <Plane
        ref={planeRef}
        args={[planeWidth, planeHeight]}
      >
        <meshBasicMaterial 
          color="#ff00ff" 
          opacity={opacity * 0} 
          transparent 
          side={FrontSide} 
        />
      </Plane>

      {/* Render items */}
      {items.map((item, index) => {
        console.log("rendering", item);
        const itemPosition = convert2DTo3D(item.position, index);
        const scale = item.scale || [0.2, 0.2];
        
        return (
          <group key={index} frustumCulled={false}>
            <group position={new Vector3(...itemPosition)}>
              <Plane 
                args={scale}
                position={[0, 0, 0.001]}
                frustumCulled={false}
              >
                <meshBasicMaterial
                  map={loadedTextures[index]}
                  transparent={true}
                  opacity={opacity}
                  side={FrontSide}
                  toneMapped={false}
                />
              </Plane>
            </group>

            {/* Render associated text elements with opacity */}
            {item.text && (
              <group 
                position={new Vector3(...convert2DTo3D(
                  item.text.position || [itemPosition[0], itemPosition[1] - scale[1] / 2 - 0.05],
                  index
                ))}
              >
                <Text
                  position={[0, 0, 0.002]}
                  fontSize={item.text.size || 0.03}
                  color={item.text.color || "white"}
                  anchorX="center"
                  anchorY="middle"
                  maxWidth={(item.text.boxWidth || 0.3) - 0.02}
                  overflowWrap="break-word"
                  font="/fonts/BulletJournal.otf"
                  textAlign='center'
                >
                  {item.text.text}
                </Text>
              </group>
            )}
            
            {/* Similar updates for title and dateAndPlace... */}
            {item.title && (
              <group 
                position={new Vector3(...convert2DTo3D(
                  item.title.position || [itemPosition[0], itemPosition[1] + scale[1] / 2 + 0.05],
                  index
                ))}
              >
                <Text
                  position={[0, 0, 0.002]}
                  fontSize={item.title.size || 0.03}
                  color={item.title.color || "white"}
                  anchorX="center"
                  anchorY="middle"
                  maxWidth={(item.title.boxWidth || 0.3) - 0.02}
                  overflowWrap="break-word"
                  font="/fonts/BulletJournal.otf"
                  textAlign='center'
                >
                  {item.title.text}
                </Text>
              </group>
            )}
            
            {item.dateAndPlace && (
              <group 
                position={new Vector3(...convert2DTo3D(
                  item.dateAndPlace.position || [itemPosition[0], itemPosition[1] + scale[1] / 2 + 0.15],
                  index
                ))}
              >
                <Text
                  position={[0, 0, 0.002]}
                  fontSize={item.dateAndPlace.size || 0.03}
                  color={item.dateAndPlace.color || "white"}
                  anchorX="center"
                  anchorY="middle"
                  maxWidth={(item.dateAndPlace.boxWidth || 0.3) - 0.02}
                  overflowWrap="break-word"
                  font="/fonts/BulletJournal.otf"
                  textAlign='center'
                >
                  {item.dateAndPlace.text}
                </Text>
              </group>
            )}
          </group>
        );
      })}
    </group>
  );
};

export default PanelBackground;