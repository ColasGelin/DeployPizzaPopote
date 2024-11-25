import React, { useState } from 'react';
import { TabButtons } from './TabButtons';
import ContactButtons from './ContactButtons';
import TeamContent from './TeamContent';
import { ScrollIndicator } from './ScrollIndicator';
import { buttonStyle, resetButtonStyle } from '@/app/styles/styles';
import LegalMentions from './LegalMentions';

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
  const [isLegalOpen, setIsLegalOpen] = useState(false);

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
      <>
        <div style={{
          position: 'absolute',
          bottom: isCompact ? '5%' : '15%',
          left: '50%',
          transform: 'translateX(-50%)',
          transition: 'all 1s ease',
        }}>
          <ContactButtons isCompact={isCompact} />
        </div>
        <div style={{
          position: 'absolute',
          bottom: isCompact ? '2%' : '5%',
          left: '50%',
          transform: 'translateX(-50%)',
          transition: 'all 1s ease',
        }}>
          <button
            onClick={() => setIsLegalOpen(true)}
            style={{
              background: 'none',
              border: 'none',
              color: 'white',
              textDecoration: 'none',
              fontSize: '0.8rem',
              opacity: 0.7,
              cursor: 'pointer',
              transition: 'opacity 0.3s ease',
              padding: 0,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '1';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '0.7';
            }}
          >
            Mentions légales
          </button>
        </div>
      </>
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
      <LegalMentions 
        isOpen={isLegalOpen} 
        onClose={() => setIsLegalOpen(false)} 
      />
    </>
  );
};

export default ButtonsAndOverlay;