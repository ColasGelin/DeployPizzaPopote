'use client';
import React, { useState, useEffect } from 'react';
import { Text } from '@react-three/drei';
import { colors } from '@/app/styles/styles';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface MenuItem {
  id: number;
  category_id: number;
  name: string;
  description: string;
  hasVegetarianIcon: number;
}

interface Category {
  id: number;
  name: string;
  items: MenuItem[];
}

const API_URL = 'http://64.226.114.142:3001/api';

const VegetarianIcon: React.FC<{ position: [number, number, number]; opacity: number }> = ({ position, opacity }) => (
  <group position={position}>
    <mesh>
      <circleGeometry args={[0.012, 32]} />
      <meshBasicMaterial color="green" transparent opacity={opacity} />
    </mesh>
    <Text
      color="white"
      fontSize={0.015}
      anchorX="center"
      anchorY="middle"
      material-transparent
      material-opacity={opacity}
    >
      V
    </Text>
  </group>
);

export const Text2D: React.FC<{ isTreesAnimating?: boolean }> = ({
  isTreesAnimating,
}) => {
  const [menuData, setMenuData] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [opacity, setOpacity] = useState(0);
  const [scale, setScale] = useState(0.95);

  const targetOpacity = isVisible ? 1 : 0;
  const targetScale = isVisible ? 0.9 : 0.8;
  const animationSpeed = 0.1;

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await fetch(`${API_URL}/menu`);
        const data = await response.json();
        setMenuData(data);
      } catch (error) {
        console.error('Error fetching menu items:', error);
        setError('Error fetching menu items');
      }
    };
    fetchMenu();
  }, []);

  useEffect(() => {
    if (!isTreesAnimating) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 800);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [isTreesAnimating]);

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

  const iconOffset = -0.04;

  if (error) {
    return (
      <group position={[-1.47, 1.88, 1.75]} visible={opacity > 0} scale={[scale, scale, scale]}>
        <Text 
          color='red' 
          fontSize={0.08} 
          maxWidth={2} 
          lineHeight={1} 
          textAlign="center" 
          font="/fonts/Crayone.otf"
          material-transparent
          material-opacity={opacity}
        >
          {error}
        </Text>
      </group>
    );
  }

  if (!menuData.length) {
    return null;
  }

  return (
    <group position={[-1.49, 2.65, 1.74]} visible={opacity > 0} scale={[scale, scale, scale]} rotation={[0, 0.003, -6.22]}>
      <Text 
        color={colors.GREEN} 
        fontSize={0.12} 
        maxWidth={2} 
        lineHeight={1} 
        letterSpacing={0.02} 
        textAlign="center" 
        font="/fonts/Crayone.otf"
        material-transparent
        material-opacity={opacity}
      >
        Nos pizzas
      </Text>
      <group position={[-0.4, -0.15, 0]}>
        {menuData.map((category, categoryIndex) => {
          const previousCategoriesHeight = menuData
            .slice(0, categoryIndex)
            .reduce((sum, cat) => {
              return sum + (cat.items.length * 0.15) + 0.15;
            }, 0);
          
          return (
            <group key={category.id} position={[0, -previousCategoriesHeight, 0]}>
              <Text
                color={colors.YELLOW}
                fontSize={0.08}
                maxWidth={1.8}
                lineHeight={1}
                letterSpacing={0.02}
                textAlign="left"
                font="/fonts/Crayone.otf"
                anchorX="left"
                position={[-0.06, 0, 0]}
                material-transparent
                material-opacity={opacity}
              >
                {category.name}
              </Text>
              {category.items.map((item, itemIndex) => (
                <group key={item.id} position={[0, -(itemIndex + 0.7) * 0.15, 0]}>
                  <group>
                    <Text
                      color={colors.RED}
                      fontSize={0.06}
                      maxWidth={1.8}
                      lineHeight={1}
                      letterSpacing={0.02}
                      textAlign="left"
                      font="/fonts/Crayone.otf"
                      anchorX="left"
                      material-transparent
                      material-opacity={opacity}
                    >
                      {item.name || 'Unnamed item'}
                    </Text>
                    {Boolean(item.hasVegetarianIcon) && 
                      <VegetarianIcon position={[iconOffset, 0.01, 0]} opacity={opacity} />
                    }
                  </group>
                  <Text
                    position={[0, item.description ? -0.05 : 0, 0]}
                    color={colors.YELLOW}
                    fontSize={0.03}
                    maxWidth={2}
                    lineHeight={1.2}
                    letterSpacing={0.01}
                    textAlign="left"
                    font="/fonts/Crayone.otf"
                    anchorX="left"
                    material-transparent
                    material-opacity={opacity}
                    material-side={THREE.DoubleSide}
                  >
                    {item.description || ''}
                  </Text>
                </group>
              ))}
            </group>
          );
        })}
      </group>
    </group>
  );
};