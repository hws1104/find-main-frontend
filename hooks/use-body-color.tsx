import { useEffect } from 'react';

export default function useBodyColor(color: string): void {
  useEffect(() => {
    const BODY_VAR = '--body-bg-color';
    document.documentElement.style.setProperty(BODY_VAR, color);
    return () => {
      document.documentElement.style.removeProperty(BODY_VAR);
    };
  }, [color]);
}
