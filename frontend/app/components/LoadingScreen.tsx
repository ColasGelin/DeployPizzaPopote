import React, { useState, useEffect } from 'react';
import { colors } from '@/app/styles/styles';
interface LoadingScreenProps {
  onLoadingComplete: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onLoadingComplete }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      onLoadingComplete();
    }, 100); // Ensure the loading screen shows for at least 2 seconds

    return () => clearTimeout(timer);
  }, [onLoadingComplete]);

  if (!loading) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.BEIGE,
      zIndex: 1000,
    }}>
      <div style={{
        width: '50px',
        height: '50px',
        border: '5px solid ' + colors.YELLOW,
        borderTop: '5px solid ' + colors.RED,
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
      }} />
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default LoadingScreen;