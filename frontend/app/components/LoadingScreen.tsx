import React, { useState, useEffect } from 'react';
import Loader from './ui/Loader';
import Image from 'next/image';

interface LoadingScreenProps {
  onLoadingComplete: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onLoadingComplete }) => {
  const [isExiting, setIsExiting] = useState(false);
  
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
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(onLoadingComplete, 1000);
    }, 2000);

    return () => clearTimeout(timer);
  }, [onLoadingComplete]);

  return (
    <>
      <style>{keyframes}</style>
      <div
        className={`
          fixed inset-0 z-50
          flex flex-col items-center justify-center gap-8
          transition-opacity duration-1000 ease-in-out
          ${isExiting ? 'opacity-0' : 'opacity-100'}
        `}
        style={{ backgroundColor: '#a7e3ed' }}
      >
        <div className="flex flex-col items-center justify-center space-y-8">
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