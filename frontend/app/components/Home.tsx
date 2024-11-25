'use client';
import React, { useState, useEffect } from 'react';
import { useSceneController } from '../hooks/useSceneController';
import SceneCanvas from './SceneCanvas';
import ButtonsAndOverlay from './ButtonsAndOverlay';

export default function Home() {
  const {
    zoom,
    isButtonHovered,
    isButtonClicked,
    activeTab,
    isExiting,
    isCompact,
    cameraPosition,
    cameraRotation,
    cameraLookAt,
    showScrollIndicator,
    handleDiscoverClick,
    handleReset,
    handleTabClick,
    setIsButtonHovered,
    setIsButtonClicked,
    isTreesAnimating,
    setIsTreesAnimating,
  } = useSceneController();

  const [playCaravanAnimation, setPlayCaravanAnimation] = useState(false);
  const [isCaravanReverse, setIsCaravanReverse] = useState(false);

  const handleDiscoverClickWithAnimation = () => {
    setIsTreesAnimating(false);
    handleDiscoverClick();
  };

  useEffect(() => {
    if (!isTreesAnimating) {
      setPlayCaravanAnimation(true);
      setIsCaravanReverse(true);
    } else {
      setPlayCaravanAnimation(true);
      setIsCaravanReverse(false);
    }
  }, [isTreesAnimating]);

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <SceneCanvas
        cameraPosition={cameraPosition}
        cameraRotation={cameraRotation}
        cameraLookAt={cameraLookAt}
        playCaravanAnimation={playCaravanAnimation}
        isCaravanReverse={isCaravanReverse}
        isTreesAnimating={isTreesAnimating}
        handleTabClick={handleTabClick}
        isButtonClicked={isButtonClicked}
      />
      <ButtonsAndOverlay
        zoom={zoom}
        isExiting={isExiting}
        activeTab={activeTab}
        handleTabClick={handleTabClick}
        isCompact={isCompact}
        showScrollIndicator={showScrollIndicator}
        handleDiscoverClickWithAnimation={handleDiscoverClickWithAnimation}
        handleReset={handleReset}
        isButtonHovered={isButtonHovered}
        isButtonClicked={isButtonClicked}
        setIsButtonHovered={setIsButtonHovered}
        setIsButtonClicked={setIsButtonClicked}
      />
    </div>
  );
}