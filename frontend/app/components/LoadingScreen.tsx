import React, { useState, useEffect } from 'react';
import Loader from './ui/Loader';
import Image from 'next/image';

interface LoadingScreenProps {
  onLoadingComplete: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onLoadingComplete }) => {
  const [exitState, setExitState] = useState<'visible' | 'scaling' | 'exiting'>('visible');

  const floatingAnimation = {
    animation: 'floatingLogo 3s ease-in-out infinite',
  };

  const keyframes = `
    @keyframes floatingLogo {
      0%, 100% {
        transform: translateY(-10px);
      }
      50% {
        transform: translateY(0px);
      }
    }
  `;

  useEffect(() => {
    const scaleTimer = setTimeout(() => {
      setExitState('scaling');
    }, 2000);

    const exitTimer = setTimeout(() => {
      setExitState('exiting');
      setTimeout(onLoadingComplete, 1000);
    }, 2400);

    return () => {
      clearTimeout(scaleTimer);
      clearTimeout(exitTimer);
    };
  }, [onLoadingComplete]);

  return (
    <>
      <style>{keyframes}</style>
      <div
        className={`
          fixed inset-0 z-50
          flex flex-col items-center justify-center gap-8
          transition-all duration-1000 ease-in-out
          ${exitState === 'scaling' ? 'scale-150 opacity-90' : ''}
          ${exitState === 'exiting' ? 'scale-150 opacity-0 blur-xl' : ''}
        `}
        style={{ backgroundColor: '#a7e3ed' }}
      >
        <div className={`
          transition-transform duration-1000 ease-in-out
          flex flex-col items-center justify-center
          space-y-8
          ${exitState === 'scaling' ? 'scale-75' : ''}
          ${exitState === 'exiting' ? 'scale-0' : ''}
        `}>
          <div className="relative" style={floatingAnimation}>
            <Image
              src="/LogoPizzaPopote.png"
              alt="PizzaPopote Logo"
              width={120}
              height={120}
              priority
            />
          </div>
          <div className="relative">
            <Loader />
          </div>
        </div>
      </div>
    </>
  );
};

export default LoadingScreen;