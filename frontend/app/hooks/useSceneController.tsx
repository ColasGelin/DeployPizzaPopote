import { useState, useEffect, useRef } from 'react';

export const useSceneController = () => {


  const isMobile = window.innerWidth <= 768;

  interface Position {
    x: number;
    y: number;
    z: number;
  }

  // Define all positions
  const initialDesktopPosition: Position = { x: 0, y: 2, z: 14 };
  const initialMobilePosition: Position = { x: 0, y: 2, z: 30 };

  const desktopDiscoverPosition: Position = { x: -3.5, y: 1, z: 7 };
  const mobileDiscoverPosition: Position = { x: -3.6, y: 1, z: 15 };

  const desktopDefaultTabPosition: Position = { x: 0, y: 2, z: 5 };
  const mobileDefaultTabPosition: Position = { x: 0, y: 2, z: 6 };

  const desktopEquipePosition: Position = { x: -3.7, y: 2, z: 3.5 };
  const mobileEquipePosition: Position = { x: -3.7, y: 2, z: 6.5 };

  const desktopPizzasPosition: Position = { x: -1.35, y: 2.3, z: 3 };
  const mobilePizzasPosition: Position = { x: -1.35, y: 2.3, z: 4 };

  // State for all positions
  const [initialPosition, setInitialPosition] = useState<Position>(
    isMobile ? initialMobilePosition : initialDesktopPosition
  );
  const [discoverPosition, setDiscoverPosition] = useState<Position>(
    isMobile ? mobileDiscoverPosition : desktopDiscoverPosition
  );

  // Other state variables
  const defaultLookAt: Position = { x: 0, y: 1, z: 0 };
  const discoverLookAt: Position = { x: -3.5, y: 2, z: 0 };
  const defaultTabLookAt: Position = { x: 0, y: 1, z: 0 };
  const equipeLookAt: Position = { x: -3.7, y: 2, z: 0 };
  const pizzasLookAt: Position = { x: -1.35, y: 2.3, z: 0 };

  const [zoom, setZoom] = useState(false);
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [isExiting, setIsExiting] = useState(false);
  const [isCompact, setIsCompact] = useState(false);
  const [cameraPosition, setCameraPosition] = useState<Position>(initialPosition);
  const [cameraLookAt, setCameraLookAt] = useState<Position>(defaultLookAt);
  const [TabClicked, setTabClicked] = useState(false);
  const [showScrollIndicator, setShowScrollIndicator] = useState(false);
  const [isTreesAnimating, setIsTreesAnimating] = useState(true);
  const cameraYRef = useRef(2.2);

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
    maxX: -5.55,
    minY: 0.65,
    maxZ: 3.5
  };

  const mobileActualitesScroll: ActualitesScrollRef = {
    x: -5.15,
    y: 2,
    z: 3.8,
    minX: -5.15,
    maxY: 2,
    minZ: 3.8,
    maxX: -4.9,
    minY: 0.65,
    maxZ: 4.2
  };

  const actualitesScrollRef = useRef<ActualitesScrollRef>(
    isMobile ? mobileActualitesScroll : desktopActualitesScroll
  );

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

  useEffect(() => {
    const handleScroll = (event: WheelEvent) => {
      if (activeTab === 'Nos pizzas') {
        const newY = Math.max(0.6, Math.min(2.3, cameraYRef.current - event.deltaY * 0.001));
        cameraYRef.current = newY;
        setCameraPosition(prev => ({ ...prev, y: newY }));
        setCameraLookAt(prev => ({ ...prev, y: newY }));
        setShowScrollIndicator(newY >= 1);
      } else if (activeTab === 'Actualités') {
        const scrollAmount = event.deltaY * 0.001;
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
          } else {
            setCameraLookAt(prev => ({ ...prev, y: newY - 1.5 }));
          }

        setShowScrollIndicator(newY > ref.minY);
      }
    };

    window.addEventListener('wheel', handleScroll);
    return () => {
      window.removeEventListener('wheel', handleScroll);
    };
  }, [activeTab]);

  const handleDiscoverClick = () => {
    setZoom(true);
    setIsButtonClicked(true);
    setIsCompact(true);
    setTabClicked(false);
    setCameraPosition(discoverPosition);
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
        break;
      case 'L\'équipe':
        setCameraPosition(currentIsMobile ? mobileEquipePosition : desktopEquipePosition);
        setCameraLookAt(equipeLookAt);
        setShowScrollIndicator(false);
        break;
      case 'Nos pizzas':
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