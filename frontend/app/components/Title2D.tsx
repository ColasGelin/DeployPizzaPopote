import React from 'react';
import { Text } from '@react-three/drei';
import { colors } from '@/app/styles/styles';
import { useThree } from '@react-three/fiber';

export const Title2D: React.FC = () => {
  const isMobile = window.innerWidth <= 768; // This threshold might need adjustment based on your needs

  if (isMobile) {
    return (
      <group position={[0, 9, -20]}>
        <Text
          position={[0, 7, 0]}
          scale={[5, 5, 5]}
          color={colors.TITLE}
          anchorX="center"
          anchorY="middle"
          fontSize={1}
          font="/fonts/New Pizza.otf"
          letterSpacing={0.01}
        >
          Pizza
        </Text>
        <Text
          position={[0, 2, 0]}
          scale={[5, 5, 5]}
          color={colors.TITLE}
          anchorX="center"
          anchorY="middle"
          fontSize={1}
          font="/fonts/New Pizza.otf"
          letterSpacing={0.01}
        >
          Po'pote
        </Text>
      </group>
    );
  }

  // Desktop version
  return (
    <Text
      position={[0, 9, -20]}
      scale={[6, 6, 6]}
      color={colors.TITLE}
      anchorX="center"
      anchorY="middle"
      fontSize={1}
      font="/fonts/New Pizza.otf"
      letterSpacing={0.01}
    >
      Pizza Po'pote
    </Text>
  );
};