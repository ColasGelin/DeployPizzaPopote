'use client'
import React, { useState, useEffect } from 'react';
import styles from '@/app/styles/TabButtons.module.css';
import { police } from '../styles/fonts';
import { colors } from '../styles/styles';
import { trackEvent } from '@/lib/utils';

interface TabButtonProps {
  title: string;
  isActive: boolean;
  onClick: (title: string) => void;
  shape: string;
  delay: number;
  isExiting: boolean;
}

interface TabButtonsProps {
  activeTab: string | null;
  setActiveTab: (tab: string) => void;
  isExiting: boolean;
}

const TabButton: React.FC<TabButtonProps> = ({isExiting, title, isActive, onClick, shape, delay }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [hoverStartTime, setHoverStartTime] = useState<number | null>(null);

  const handleClick = () => {
    trackEvent('Navigation Click', {
      destination: title,
      previousTab: isActive ? 'same_tab' : 'different_tab',
    });
    onClick(title);
  };

  const handleHoverStart = () => {
    setIsHovered(true);
    setHoverStartTime(Date.now());
  };

  const handleHoverEnd = () => {
    setIsHovered(false);
    if (hoverStartTime) {
      const hoverDuration = Date.now() - hoverStartTime;
      if (hoverDuration > 300) {
        trackEvent('Navigation Hover', {
          tab: title,
          durationMs: hoverDuration
        });
      }
    }
    setHoverStartTime(null);
  };

  const getColor = () => {
    if (isActive || isHovered) {
      if (title === 'Actualités') return colors.RED;
      if (title === 'L\'équipe') return colors.BLUE;
      if (title === 'Nos pizzas') return colors.GREEN;
    }
    return colors.YELLOW;
  };

  return (
    <button
      onClick={handleClick}
      onMouseEnter={handleHoverStart}
      onMouseLeave={handleHoverEnd}
      className={`${styles.tabButton} ${isExiting ? styles.exiting : ''} ${styles.hoverGrow}`}
      style={{
        animationDelay: isExiting ? `` : `${delay}s`,
        borderRadius: shape,
        backgroundColor: getColor(),
        margin: '0 20px',
        fontFamily: police.style.fontFamily,
      }}
    >
      {title}
    </button>
  );
};

export const TabButtons: React.FC<TabButtonsProps> = ({ activeTab, setActiveTab, isExiting }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [tabStartTime, setTabStartTime] = useState<number | null>(null);
  const [currentTab, setCurrentTab] = useState<string | null>(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    if (activeTab && !isExiting) {
      const startTime = Date.now();
      setTabStartTime(startTime);
      setCurrentTab(activeTab);
    } else if (isExiting && currentTab) {
      if (tabStartTime) {
        const timeSpent = Date.now() - tabStartTime;
        trackEvent('Tab View Duration', {
          tab: currentTab,
          durationMs: timeSpent,
          exitType: 'return_button'
        });
      }
      setTabStartTime(null);
      setCurrentTab(null);
    }

    return () => {
      if (tabStartTime && currentTab) {
        const timeSpent = Date.now() - tabStartTime;
        trackEvent('Tab View Duration', {
          tab: currentTab,
          durationMs: timeSpent,
          exitType: 'tab_switch'
        });
      }
    };
  }, [activeTab, isExiting, currentTab]);

  const handleTabClick = (tabTitle: string) => {
    if (tabStartTime && currentTab && currentTab !== tabTitle) {
      const timeSpent = Date.now() - tabStartTime;
      trackEvent('Tab View Duration', {
        tab: currentTab,
        durationMs: timeSpent,
        exitType: 'tab_switch'
      });
    }
    
    console.log(`Tab clicked: ${tabTitle}`);
    setActiveTab(tabTitle);
  };

  const buttonShapes = {
    news: "60% 40% 70% 30% / 50% 60% 40% 50%",
    team: "55% 45% 67% 33% / 45% 40% 60% 55%",
    menu: "70% 30% 30% 70% / 60% 40% 60% 40%"
  };

  return (
    <div className={`${styles.tabButtonsContainer} ${isVisible ? styles.visible : ''} ${isExiting ? styles.exiting : ''}`}>
      <TabButton
        title="Actualités"
        isActive={activeTab === 'Actualités'}
        onClick={handleTabClick}
        shape={buttonShapes.news}
        delay={0}
        isExiting={isExiting}
      />
      <TabButton
        title="L'équipe"
        isActive={activeTab === 'L\'équipe'}
        onClick={handleTabClick}
        shape={buttonShapes.team}
        delay={0.2}
        isExiting={isExiting}
      />
      <TabButton
        title="Nos pizzas"
        isActive={activeTab === 'Nos pizzas'}
        onClick={handleTabClick}
        shape={buttonShapes.menu}
        delay={0.4}
        isExiting={isExiting}
      />
    </div>
  );
};

export default TabButtons;