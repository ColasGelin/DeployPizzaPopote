import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

interface UmamiWindow extends Window {
  umami?: {
    track: (eventName: string, eventData?: Record<string, unknown>) => void;
  };
}

export const trackEvent = (
  eventName: string, 
  eventData?: Record<string, unknown>
): void => {
  if (typeof window !== 'undefined') {
    const w = window as UmamiWindow;
    if (w.umami) {
      w.umami.track(eventName, eventData);
    }
  }
};