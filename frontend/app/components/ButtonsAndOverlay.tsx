
import React from 'react';
import { TabButtons } from './TabButtons';
import ContactButtons from './ContactButtons';
import TeamContent from './TeamContent';
import { ScrollIndicator } from './ScrollIndicator';
import { buttonStyle, resetButtonStyle } from '@/app/styles/styles';

interface ButtonsAndOverlayProps {
  zoom: boolean;
  isExiting: boolean;
  activeTab: string | null;
  handleTabClick: (tab: string) => void;
  isCompact: boolean;
  showScrollIndicator: boolean;
  handleDiscoverClickWithAnimation: () => void;
  handleReset: () => void;
  isButtonHovered: boolean;
  isButtonClicked: boolean;
  setIsButtonHovered: (isHovered: boolean) => void;
  setIsButtonClicked: (isClicked: boolean) => void;
}

const ButtonsAndOverlay: React.FC<ButtonsAndOverlayProps> = ({
  zoom,
  isExiting,
  activeTab,
  handleTabClick,
  isCompact,
  showScrollIndicator,
  handleDiscoverClickWithAnimation,
  handleReset,
  isButtonHovered,
  isButtonClicked,
  setIsButtonHovered,
  setIsButtonClicked,
}) => {
  return (
    <>
      {(zoom || isExiting) && (
        <TabButtons 
          activeTab={activeTab} 
          setActiveTab={handleTabClick}
          isExiting={isExiting} 
        />
      )}

      {activeTab === 'L\'équipe' && <TeamContent />}
      
      <div style={{
        position: 'absolute',
        bottom: '25%',
        left: '50%',
        transform: 'translateX(-50%)',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        transition: 'all 0.5s ease',
      }}>
        {!zoom && (
          <button
            onClick={handleDiscoverClickWithAnimation}
            onMouseEnter={() => setIsButtonHovered(true)}
            onMouseLeave={() => {
              setIsButtonHovered(false);
              setIsButtonClicked(false);
            }}
            style={buttonStyle(isButtonHovered, isButtonClicked)}
          >
            Découvrir
          </button>
        )}
      </div>
      
      <div style={{
        position: 'absolute',
        bottom: isCompact ? '5%' : '15%',
        left: '50%',
        transform: 'translateX(-50%)',
        transition: 'all 1s ease',
      }}>
        <ContactButtons isCompact={isCompact} />
      </div>
      
      {zoom && (
        <button
          onClick={handleReset}
          onMouseEnter={() => setIsButtonHovered(true)}
          onMouseLeave={() => setIsButtonHovered(false)}
          style={resetButtonStyle(isButtonHovered)}
        >
          Retour
        </button>
      )}

      <ScrollIndicator show={showScrollIndicator} />
    </>
  );
};

export default ButtonsAndOverlay;