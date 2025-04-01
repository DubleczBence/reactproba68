import React, { createContext, useState, useContext, useEffect } from 'react';
import { useColorScheme } from '@mui/material/styles';

const BackgroundContext = createContext();

export const BackgroundProvider = ({ children }) => {
  const { mode } = useColorScheme();
  
  // Inicializáljuk a háttérképet a localStorage-ból vagy a téma alapján
  const [backgroundImage, setBackgroundImage] = useState(() => {
    const savedBackground = localStorage.getItem('backgroundImage');
    if (savedBackground) {
      return savedBackground;
    }
    
    // Ha nincs mentett háttérkép, a téma alapján állítjuk be
    if (mode === 'light') {
      return '/kepek/new_bg-bright.png';
    } else if (mode === 'dark') {
      return '/kepek/new_bg-dark.png';
    } else if (mode === 'system') {
      const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      return prefersDarkMode ? '/kepek/new_bg-dark.png' : '/kepek/new_bg-bright.png';
    }
    
    return '/kepek/new_bg-dark.png'; // Alapértelmezett
  });
  
  // Ha változik a háttérkép, mentjük localStorage-ba
  useEffect(() => {
    localStorage.setItem('backgroundImage', backgroundImage);
  }, [backgroundImage]);
  
  // Ha változik a téma, frissítjük a háttérképet
  useEffect(() => {
    if (mode === 'light') {
      setBackgroundImage('/kepek/new_bg-bright.png');
    } else if (mode === 'dark') {
      setBackgroundImage('/kepek/new_bg-dark.png');
    } else if (mode === 'system') {
      const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setBackgroundImage(prefersDarkMode ? '/kepek/new_bg-dark.png' : '/kepek/new_bg-bright.png');
    }
  }, [mode]);

  return (
    <BackgroundContext.Provider value={{ backgroundImage, setBackgroundImage }}>
      {children}
    </BackgroundContext.Provider>
  );
};

export const useBackground = () => useContext(BackgroundContext);