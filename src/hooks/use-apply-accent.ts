import { useEffect } from 'react';
import { useOltStore } from '@/store/olt-store';

/** Reflects the accent onto <html> (the theme is a single fixed dusk). */
export function useApplyAccent(): void {
  const accent = useOltStore((state) => state.settings.accent);
  useEffect(() => {
    document.documentElement.style.setProperty('--accent', accent);
  }, [accent]);
}
