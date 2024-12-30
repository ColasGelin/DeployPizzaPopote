'use client'
//af9166e3ad10af6c870012824c05baa08aab04020b1837a2a08bd16014343bba80a08f5485b79394507fcbcbc715de9bf6653b4bb970dde623a673c00ca7588825b2b6f852c3f86b9547194da640e3b5537dbad9317dd280e964426e3ea0cf8c10342184cb813c32f3a2b33ebb9c529306f90c8fc966aa45b4a034dfc346cf1f
import { useState, useEffect, useRef } from 'react';
import { MathUtils } from 'three';

export const useSceneController = () => {

  const [isMobile, setIsMobile] = useState(false);

  interface Position {
    x: number;
    y: number;
    z: number;
  }

  // Define all positions
  const initialDesktopPosition: Position = { x: 0, y: 8, z: 30 };
  const initialMobilePosition: Position = { x: 0, y: 8, z: 40 };

  const desktopDiscoverPosition: Position = { x: -3.8, y: 1, z: 7 };
  const mobileDiscoverPosition: Position = { x: -3.6, y: 1, z: 20 };
  const DiscoverTilt: number = MathUtils.degToRad(4.5);

  const desktopDefaultTabPosition: Position = { x: 0, y: 2, z: 5 };
  const mobileDefaultTabPosition: Position = { x: 0, y: 2, z: 6 };

  const desktopEquipePosition: Position = { x: -3.85, y: 2, z: 3.5 };
  const mobileEquipePosition: Position = { x: -3.85, y: 2, z: 6.5 };

  const desktopPizzasPosition: Position = { x: -1.5, y: 2.3, z: 3 };
  const mobilePizzasPosition: Position = { x: -1.5, y: 2.3, z: 4.5 };

  // State for all positions
  const [initialPosition, setInitialPosition] = useState<Position>(initialDesktopPosition);
  const [discoverPosition, setDiscoverPosition] = useState<Position>(desktopDiscoverPosition);
  const [cameraTilt, setCameraTilt] = useState<number>(0);

  // Other state variables
  const defaultLookAt: Position = { x: 0, y: 2, z: 0 };
  const discoverLookAt: Position = { x: -3.8, y: 2, z: 0 };
  const defaultTabLookAt: Position = { x: 0, y: 1, z: 0 };
  const equipeLookAt: Position = { x: -3.85, y: 2, z: 0 };
  const pizzasLookAt: Position = { x: -1.5, y: 2.3, z: 0 };

  const [zoom, setZoom] = useState(false);
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [isExiting, setIsExiting] = useState(false);
  const [isCompact, setIsCompact] = useState(false);
  const [cameraPosition, setCameraPosition] = useState<Position>(initialDesktopPosition);
  const [cameraLookAt, setCameraLookAt] = useState<Position>(defaultLookAt);
  const [TabClicked, setTabClicked] = useState(false);
  const [showScrollIndicator, setShowScrollIndicator] = useState(false);
  const [isTreesAnimating, setIsTreesAnimating] = useState(true);
  const cameraYRef = useRef(2.2);

  // Set initial mobile/desktop state and update camera position
  useEffect(() => {
    const checkMobile = () => {
      const newIsMobile = window.innerWidth <= 768;
      setIsMobile(newIsMobile);
      
      // Update positions based on device type
      setInitialPosition(newIsMobile ? initialMobilePosition : initialDesktopPosition);
      setDiscoverPosition(newIsMobile ? mobileDiscoverPosition : desktopDiscoverPosition);
      
      // Update camera position
      setCameraPosition(newIsMobile ? initialMobilePosition : initialDesktopPosition);
    };

    // Run on mount and window resize
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  interface ActualitesScrollRef {
    y: number;
    x: number;
    z: number;
    minX: number;
    maxY: number;
    minZ: number;
    maxX: number;
    minY: number;
    maxZ: number;
  }

  const desktopActualitesScroll: ActualitesScrollRef = {
    y: 2.2,
    x: -5.9,
    z: 3.1,
    minX: -5.9,
    maxY: 2.2,
    minZ: 3.1,
    maxX: -5,
    minY: 0.5,
    maxZ: 3.8
  };

  const mobileActualitesScroll: ActualitesScrollRef = {
    x: -5,
    y: 2,
    z: 4,
    minX: -4.5,
    maxY: 2,
    minZ: 4.4,
    maxX: -4.05  ,
    minY: 0.4,
    maxZ: 4.6
  };

  const actualitesScrollRef = useRef<ActualitesScrollRef>(
    isMobile ? mobileActualitesScroll : desktopActualitesScroll
  );

  useEffect(() => {
    actualitesScrollRef.current = isMobile ? mobileActualitesScroll : desktopActualitesScroll;
  }, [isMobile]);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === 'e') {
        console.log('Camera Position:', {
          position: cameraPosition,
          lookAt: cameraLookAt,
          isMobile: isMobile
        });
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [cameraPosition, cameraLookAt]);

  useEffect(() => {
    const updateCameraPositionForCurrentState = (newIsMobile: boolean) => {
      // Update all position states
      setInitialPosition(newIsMobile ? initialMobilePosition : initialDesktopPosition);
      setDiscoverPosition(newIsMobile ? mobileDiscoverPosition : desktopDiscoverPosition);
      
      // Update actual camera position based on current state
      if (!zoom) {
        setCameraPosition(newIsMobile ? initialMobilePosition : initialDesktopPosition);
      } else if (isButtonClicked && !TabClicked) {
        setCameraPosition(newIsMobile ? mobileDiscoverPosition : desktopDiscoverPosition);
      } else {
        switch(activeTab) {
          case 'Actualités':
            const ref = actualitesScrollRef.current;
            actualitesScrollRef.current = newIsMobile ? mobileActualitesScroll : desktopActualitesScroll;
            // Maintain scroll progress when switching
            const progress = (ref.maxY - ref.y) / (ref.maxY - ref.minY);
            const newRef = newIsMobile ? mobileActualitesScroll : desktopActualitesScroll;
            const newY = newRef.maxY - progress * (newRef.maxY - newRef.minY);
            const newX = newRef.minX + (newRef.maxX - newRef.minX) * progress;
            const newZ = newRef.minZ + (newRef.maxZ - newRef.minZ) * progress;
            setCameraPosition({ x: newX, y: newY, z: newZ });
            setCameraTilt(0.35)
            break;
          case 'L\'équipe':
            setCameraPosition(newIsMobile ? mobileEquipePosition : desktopEquipePosition);
            break;
          case 'Nos pizzas':
            setCameraPosition(newIsMobile ? mobilePizzasPosition : desktopPizzasPosition);
            break;
          default:
            if (TabClicked) {
              setCameraPosition(newIsMobile ? mobileDefaultTabPosition : desktopDefaultTabPosition);
            }
        }
      }
    };

    const checkMobile = () => {
      const newIsMobile = window.innerWidth <= 768;
      updateCameraPositionForCurrentState(newIsMobile);
    };

    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [zoom, isButtonClicked, TabClicked, activeTab]); // Added dependencies

  const lastTouchY = useRef<number | null>(null);

  useEffect(() => {
    const handleScroll = (event: WheelEvent | TouchEvent) => {
      let deltaY = 0;
      
      if (event instanceof WheelEvent) {
        deltaY = event.deltaY;
      } else if (event instanceof TouchEvent) {
        if (event.touches.length === 0 || !event.touches[0]) return;
        
        const touch = event.touches[0];
        if (!lastTouchY.current) {
          lastTouchY.current = touch.clientY;
          return;
        }
        
        deltaY = (lastTouchY.current - touch.clientY) * 10; // Adjust sensitivity
        lastTouchY.current = touch.clientY;
      }

      if (activeTab === 'Nos pizzas') {
        const newY = Math.max(1, Math.min(2.3, cameraYRef.current - deltaY * 0.001));
        cameraYRef.current = newY;
        
        const baseX = -1.5;
        // Invert the scroll progress (1 at top, 0 at bottom)
        const scrollProgress = 1 - ((newY - 0.7) / (2.3 - 0.7));
        const xOffset = scrollProgress * .2; // Now 0.05 at top, 0 at bottom
        
        setCameraPosition(prev => ({
            ...prev,
            y: newY,
            x: baseX + xOffset
        }));
        setCameraLookAt(prev => ({ ...prev, y: newY }));
        
        setShowScrollIndicator(newY >= 1);
      } else if (activeTab === 'Actualités') {
        const scrollAmount = deltaY * 0.001;
        const ref = actualitesScrollRef.current;
        
        const newY = Math.max(ref.minY, Math.min(ref.maxY, ref.y - scrollAmount));
        const progress = (ref.maxY - newY) / (ref.maxY - ref.minY);
        const newX = ref.minX + (ref.maxX - ref.minX) * progress;
        const newZ = ref.minZ + (ref.maxZ - ref.minZ) * progress;
        
        ref.y = newY;
        ref.x = newX;
        ref.z = newZ;
        
        setCameraPosition({ x: newX, y: newY, z: newZ });
        if (!isMobile) {
          setCameraLookAt({
            x: -8.7 + (newX + 5.8) * 0.9,
            y: newY - 1.5,
            z: (newZ - 3.3) * 0.5
          });
          setCameraTilt(0.4);
        } else {
          setCameraLookAt(prev => ({ ...prev, y: newY - 1.5 }));
          setCameraTilt(0.35);
        }

        setShowScrollIndicator(newY > ref.minY);
      }
    };

    

    const handleTouchStart = (event: TouchEvent) => {
      lastTouchY.current = event.touches[0].clientY;
    };

    const handleTouchEnd = () => {
      lastTouchY.current = null;
    };

    window.addEventListener('wheel', handleScroll);
    window.addEventListener('touchmove', handleScroll);
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('wheel', handleScroll);
      window.removeEventListener('touchmove', handleScroll);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [activeTab, isMobile]);

  const handleDiscoverClick = () => {
    setZoom(true);
    setIsButtonClicked(true);
    setIsCompact(true);
    setTabClicked(false);
    setCameraPosition(discoverPosition);
    setCameraTilt(DiscoverTilt);  // Now it sets to actual tilt value when clicked
    setCameraLookAt(discoverLookAt);
};

  const handleTabClick = (tab: string) => {
    // Reset scroll position if we're switching tabs
    if (activeTab !== tab) {
      const ref = actualitesScrollRef.current;
      ref.y = ref.maxY;
      ref.x = ref.minX;
      ref.z = ref.minZ;
      
      // Also reset the pizzas scroll position
      if (tab === 'Nos pizzas') {
        cameraYRef.current = 2.2;
      }
    }

    setActiveTab(tab);
    setTabClicked(true);
    const currentIsMobile = window.innerWidth <= 768;
    
    switch(tab) {
      case 'Actualités':
        const ref = actualitesScrollRef.current;
        setCameraPosition({ x: ref.minX, y: ref.maxY, z: ref.minZ }); // Always start at top
        setCameraLookAt({ 
          x: currentIsMobile ? -8.7 : -8.7, 
          y: currentIsMobile ? 0.7 : 0.7, 
          z: currentIsMobile ? 0.1 : 0.05 
        });
        setShowScrollIndicator(true);
        setCameraTilt(0.4)
        break;
      case 'L\'équipe':
        setCameraPosition(currentIsMobile ? mobileEquipePosition : desktopEquipePosition);
        setCameraLookAt(equipeLookAt);
        setShowScrollIndicator(false);
        setCameraTilt(0.07);
        break;
      case 'Nos pizzas':
        setCameraTilt(0.07)
        setCameraPosition(currentIsMobile ? mobilePizzasPosition : desktopPizzasPosition);
        setCameraLookAt(pizzasLookAt);
        setShowScrollIndicator(true);
        break;
      default:
        setCameraPosition(currentIsMobile ? mobileDefaultTabPosition : desktopDefaultTabPosition);
        setCameraLookAt(defaultTabLookAt);
        setShowScrollIndicator(false);
    }
  };

  // You might also want to reset the scroll position in handleReset
  const handleReset = () => {
    // Reset scroll positions
    const ref = actualitesScrollRef.current;
    ref.y = ref.maxY;
    ref.x = ref.minX;
    ref.z = ref.minZ;
    cameraYRef.current = 2.2;
    if (TabClicked) {
      setActiveTab(null);
      setCameraPosition(discoverPosition);
      setCameraLookAt(discoverLookAt);
      setTabClicked(false);
      setShowScrollIndicator(false);
      setCameraTilt(DiscoverTilt);
    } else {
      setIsExiting(true);
      setZoom(false);
      setIsCompact(false);
      setIsButtonClicked(false);
      setIsButtonHovered(false);
      setCameraPosition(initialPosition);
      setCameraLookAt(defaultLookAt);
      setIsTreesAnimating(true);
      setTimeout(() => {
        setIsExiting(false);
      }, 500);
     setCameraTilt(0);
    }
  };

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'e' || event.key === 'E') {
        console.log(cameraPosition);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  },[cameraPosition]);

  return {
    zoom,
    isButtonHovered,
    isButtonClicked,
    activeTab,
    isExiting,
    isCompact,
    cameraPosition,
    cameraTilt,
    cameraLookAt,
    TabClicked,
    showScrollIndicator,
    handleDiscoverClick,
    handleReset,
    handleTabClick,
    setIsButtonHovered,
    setIsButtonClicked,
    isTreesAnimating,
    setIsTreesAnimating
  };
};