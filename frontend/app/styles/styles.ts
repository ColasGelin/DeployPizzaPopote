import { police } from './fonts';

export const colors = {
  BLUE: '#4F72FF',
  GREEN: '#5F8637',
  RED: '#E75023',
  YELLOW: '#F9C651',
  BEIGE: '#FFEFE5',
  TITLE: '#FFEE22',
};

export const buttonStyle = (isHovered: boolean, isClicked: boolean): React.CSSProperties => ({
  padding: '10px 30px',
  fontSize: '30px',
  backgroundColor: isClicked ? colors.BLUE : (isHovered ? colors.GREEN : colors.BLUE),
  color: 'white',
  border: 'none',
  borderRadius: '30% 70% 70% 30% / 40% 60% 40% 60%',
  cursor: 'pointer',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.3s ease',
  transform: isHovered ? 'scale(1.1)' : 'scale(1)',
  fontFamily: police.style.fontFamily,
});

export const resetButtonStyle = (isHovered: boolean): React.CSSProperties => {
  // Get the base styles that will be the same for both mobile and desktop
  const baseStyles = {
    padding: '10px 20px',
    fontSize: '20px',
    backgroundColor: colors.RED,
    color: 'white',
    border: 'none',
    cursor: 'pointer',
    borderRadius: '70% 30% 30% 70% / 60% 40% 60% 40%',
    transition: 'transform 0.3s ease',
    transform: isHovered ? 'scale(1.1)' : 'scale(1)',
    fontFamily: police.style.fontFamily,
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  };

  // Check if we're on mobile using window.innerWidth
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  // Return different position styles based on screen size
  return {
    ...baseStyles,
    position: isMobile ? 'fixed' : 'absolute',
    top: isMobile ? 'auto' : '20px',
    left: isMobile ? '50%' : '20px',
    bottom: isMobile ? '15%' : 'auto',
    transform: isMobile 
      ? `translateX(-50%) ${isHovered ? 'scale(1.1)' : 'scale(1)'}` 
      : isHovered ? 'scale(1.1)' : 'scale(1)',
  };
};