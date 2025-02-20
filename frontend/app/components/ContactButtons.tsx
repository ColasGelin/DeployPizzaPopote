'use client'

import React, { ReactNode, useState, useEffect } from 'react';
import { Chewy } from 'next/font/google';
import { colors } from '../styles/styles';
import { fetchWithAuth } from '../admin/utils/api';
import { trackEvent } from '@/lib/utils';

export const police = Chewy({ subsets: ['latin'], weight: '400' });

interface IconButtonProps {
  href: string;
  ariaLabel: string;
  children: ReactNode;
  shape: string;
  text: string;
  isCompact: boolean;
}

interface ContactInfo {
  phone: string;
  email: string;
  instagram: string;
}

const IconButton: React.FC<IconButtonProps> = ({ href, ariaLabel, children, shape, text, isCompact }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [hoverStartTime, setHoverStartTime] = useState<number | null>(null);

  const handleClick = () => {
    trackEvent('contact_click', {
      type: ariaLabel,
      text: text,
      url: href
    });
  };

  const handleHoverStart = () => {
    setIsHovered(true);
    setHoverStartTime(Date.now());
  };

  const handleHoverEnd = () => {
    setIsHovered(false);
    if (hoverStartTime) {
      const hoverDuration = Date.now() - hoverStartTime;
      // Only track if hover was longer than 100ms to filter out accidental hovers
      if (hoverDuration > 100) {
        trackEvent('contact_hover', {
          type: ariaLabel,
          text: text,
          durationMs: hoverDuration
        });
      }
      setHoverStartTime(null);
    }
  };

  return (
    <a
      href={href}
      aria-label={ariaLabel}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick} 
      onMouseEnter={handleHoverStart}
      onMouseLeave={handleHoverEnd}
      style={{
        display: 'inline-flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        maxWidth: isHovered ? '250px' : '50px',
        height: '50px',
        borderRadius: isHovered ? '30px' : shape,
        backgroundColor: isHovered ? colors.RED : colors.YELLOW,
        color: 'white',
        margin: isCompact ? '0 10px' : '0 30px',
        padding: isHovered ? '0 10px' : '0',
        transition: 'all 0.5s ease',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textDecoration: 'none',
        fontFamily: police.style.fontFamily,
      }}
    >
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '50px',
        height: '50px',
        flexShrink: 0,
      }}>
        {children}
      </div>
      <span style={{
        maxWidth: isHovered ? '200px' : '0',
        opacity: isHovered ? 1 : 0,
        padding: isHovered ? '0 10px' : '0',
        marginLeft: isHovered ? '-10px' : '0',
        transition: 'all 0.5s ease',
        overflow: 'hidden',
        fontSize: '16px',
      }}>
        {text}
      </span>
    </a>
  );
};

interface ContactButtonsProps {
  isCompact: boolean;
}

const ContactButtons: React.FC<ContactButtonsProps> = ({ isCompact }) => {
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const response = await fetchWithAuth('/contact');
        const data = await response.json();
        console.log("data", data);
        setContactInfo(data);
      } catch (error) {
        console.error('Error fetching contact information:', error);
      }
    };
    fetchContactInfo();
  }, []);

  if (!contactInfo) {
    return null; // Or return a loading state
  }

  return (
    <div style={{ 
      marginTop: '20px', 
      display: 'flex', 
      justifyContent: 'center',
      transition: 'all 0.5s ease',
    }}>
      <IconButton
        href={`tel:${contactInfo.phone}`}
        ariaLabel={contactInfo.phone}
        shape="60% 40% 70% 30% / 50% 60% 40% 50%"
        text={contactInfo.phone}
        isCompact={isCompact}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
        </svg>
      </IconButton>
      <IconButton
        href={`mailto:${contactInfo.email}`}
        ariaLabel={contactInfo.email}
        shape="55% 45% 67% 30% / 45% 40% 60% 55%"
        text={contactInfo.email}
        isCompact={isCompact}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
          <polyline points="22,6 12,13 2,6"></polyline>
        </svg>
      </IconButton>
      <IconButton
        href={`https://www.instagram.com/${contactInfo.instagram.replace('@', '')}`}
        ariaLabel={contactInfo.instagram}
        shape="70% 30% 30% 70% / 60% 40% 60% 40%"
        text={contactInfo.instagram}
        isCompact={isCompact}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
        </svg>
      </IconButton>
    </div>
  );
};

export default ContactButtons;