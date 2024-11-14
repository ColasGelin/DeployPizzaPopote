'use client';
import React, { useState, useEffect} from 'react';
import { Text } from '@react-three/drei';
import { colors } from '@/app/styles/styles';
import { useFrame } from '@react-three/fiber';

interface MenuItem {
  id: number;
  Name: string;
  Description: string;
  Vegetarian: boolean;
  documentId: string;
}

interface Category {
  id: number;
  Name: string;
  menu_items: MenuItem[];
  documentId: string;
}

interface Menu {
  id: number;
  Name: string;
  menu_categories: Category[];
  documentId: string;
}

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
  const [Menu, setMenu] = useState<Menu | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [opacity, setOpacity] = useState(0);
  const [scale, setScale] = useState(0.95);

  const targetOpacity = isVisible ? 1 : 0;
  const targetScale = isVisible ? 1 : 0.95;
  const animationSpeed = 0.1;

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await fetch('http://localhost:1337/api/menus?populate[menu_categories][populate]=*');
        const data = await response.json();
        if (data.data && data.data.length > 0) {
          setMenu(data.data[0]);
          console.log(data.data[0]);
        } else {
          setError('No menu data found');
        }
      } catch (error) {
        console.error('Error fetching menu items:', error);
        setError('Error fetching menu items');
      }
    };
    fetchMenuItems();
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
      <group position={[-1.35, 2.5, 1.75]} visible={opacity > 0} scale={[scale, scale, scale]}>
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

  if (!Menu) {
    return null;
  }

  return (
    <group position={[-1.35, 2.5, 1.75]} visible={opacity > 0} scale={[scale, scale, scale]}>
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
        {Menu.Name}
      </Text>
      <group position={[-0.4, -0.15, 0]}>
        {Menu.menu_categories.map((category, categoryIndex) => {
          const previousCategoriesHeight = Menu.menu_categories
            .slice(0, categoryIndex)
            .reduce((sum, cat) => {
              return sum + (cat.menu_items.length * 0.15) + 0.15;
            }, 0);
          
          return (
            <group key={category.documentId} position={[0, -previousCategoriesHeight, 0]}>
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
                {category.Name}
              </Text>
              {category.menu_items.map((item, itemIndex) => (
                <group key={item.documentId} position={[0, -(itemIndex + 0.7) * 0.15, 0]}>
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
                      {item.Name || 'Unnamed item'}
                    </Text>
                    {item.Vegetarian && <VegetarianIcon position={[iconOffset, 0.01, 0]} opacity={opacity} />}
                  </group>
                  <Text
                    position={[0, -0.05, 0]}
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
                  >
                    {item.Description || 'No description available'}
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