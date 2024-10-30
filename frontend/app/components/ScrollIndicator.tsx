'use client'

import React, { useState, useEffect } from 'react';
import styles from '../styles/ScrollIndicator.module.css';

interface ScrollIndicatorProps {
  show: boolean;
}

export function ScrollIndicator({ show }: ScrollIndicatorProps) {
  const [opacity, setOpacity] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setVisible(true);
      setTimeout(() => setOpacity(1), 50);
    } else {
      setOpacity(0);
      setTimeout(() => setVisible(false), 500);
    }
  }, [show]);

  if (!visible) return null;

  return (
    <>
      <div 
        className={`${styles.scrollIndicator} ${styles.left}`} 
        style={{ opacity }}
      >
        <div 
          className={`${styles.arrow} ${styles.left}`} 
          style={{ "--rotation": "-45deg" } as React.CSSProperties} 
        />
      </div>
      <div 
        className={`${styles.scrollIndicator} ${styles.right}`} 
        style={{ opacity }}
      >
        <div 
          className={`${styles.arrow} ${styles.right}`} 
          style={{ "--rotation": "-45deg" } as React.CSSProperties} 
        />
      </div>
    </>
  );
}