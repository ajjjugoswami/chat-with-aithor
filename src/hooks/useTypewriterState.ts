import { useState, useEffect } from 'react';
import { isAnyTypewriterActive, addTypewriterStateListener } from '../utils/typewriterState';

export const useTypewriterState = () => {
  const [isTypewriterActive, setIsTypewriterActive] = useState(isAnyTypewriterActive);

  useEffect(() => {
    // Subscribe to typewriter state changes
    const unsubscribe = addTypewriterStateListener((isActive) => {
      setIsTypewriterActive(isActive);
    });

    // Set initial state
    setIsTypewriterActive(isAnyTypewriterActive());

    // Cleanup subscription on unmount
    return unsubscribe;
  }, []);

  return isTypewriterActive;
};
