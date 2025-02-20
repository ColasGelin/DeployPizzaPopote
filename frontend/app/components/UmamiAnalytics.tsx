'use client';
import Script from 'next/script'

export function UmamiAnalytics() {
  return (
    <Script
      async
      defer
      data-website-id="917396ad-126f-4488-a9c7-14da37d88d2d"
      src="https://cloud.umami.is/script.js"
      strategy="afterInteractive"
    />
  )
}