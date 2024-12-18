'use client';
import React, { useState, useEffect } from 'react';
import { useSceneController } from '../hooks/useSceneController';
import SceneCanvas from './SceneCanvas';
import ButtonsAndOverlay from './ButtonsAndOverlay';
import LoadingScreen from './LoadingScreen';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const {
    zoom,
    isButtonHovered,
    isButtonClicked,
    activeTab,
    isExiting,
    isCompact,
    cameraPosition,
    cameraTilt,
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

  useEffect(() => {
    // Lock scrolling when component mounts
    document.body.style.position = 'fixed';
    document.body.style.overflow = 'hidden';
    document.body.style.width = '100%';
    document.body.style.height = '100%';

    return () => {
      document.body.style.position = '';
      document.body.style.overflow = '';
      document.body.style.width = '';
      document.body.style.height = '';
    };
  }, []);

  return (
    <>
      {isLoading && <LoadingScreen onLoadingComplete={() => setIsLoading(false)} />}
      <div
        style={{
          width: '100vw',
          height: '100vh',
          position: 'fixed',
          top: 0,
          left: 0,
          overflow: 'hidden',
          touchAction: 'none',
        }}
      >
        <SceneCanvas
          cameraPosition={cameraPosition}
          cameraTilt={cameraTilt}
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
    </>
  );
}