'use client';

import { useEffect } from 'react';

export function UmamiAnalytics() {
  useEffect(() => {
    const script = document.createElement('script');
    script.defer = true;
    script.src = 'https://cloud.umami.is/script.js';
    script.setAttribute('data-website-id', '3347e1a7-b39b-43ac-aadc-ded2d60fe4c');
    
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  return null;
}