import React from 'react';
import { PulseLoader } from 'react-spinners';
import { useThemeStore } from '../store/theme';

export function Preloader() {
  const { isDarkMode } = useThemeStore();
  
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background">
      <PulseLoader
        color={isDarkMode ? '#ffffff' : '#000000'}
        size={15}
        margin={2}
      />
    </div>
  );
}