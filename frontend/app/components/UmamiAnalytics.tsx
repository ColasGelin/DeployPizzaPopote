'use client';

import { useEffect } from 'react';

export function UmamiAnalytics() {
  useEffect(() => {
    const script = document.createElement('script');
    script.defer = true;
    script.src = 'https://cloud.umami.is/script.js';
    script.setAttribute('data-website-id', '917396ad-126f-4488-a9c7-14da37d88d2d');
    
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  return null;
}