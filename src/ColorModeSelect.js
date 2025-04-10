import * as React from 'react';
import { useColorScheme } from '@mui/material/styles';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Box from '@mui/material/Box';
import optifyDark from './kepek/optify-dark.png';
import optifyBright from './kepek/optify-bright.png';
import { useBackground } from './BackgroundContext';

export default function ColorModeSelect(props) {
  const { mode, setMode } = useColorScheme();
  const { setBackgroundImage } = useBackground();

  const MenuItemComponent = MenuItem;
  
  if (!mode) {
    return null;
  }
  
  const handleModeChange = (event) => {
    const newMode = event.target.value;
    setMode(newMode);

    if (newMode === 'light') {
      setBackgroundImage('/kepek/new_bg-bright.png');
    } else if (newMode === 'dark') {
      setBackgroundImage('/kepek/new_bg-dark.png');
    } else if (newMode === 'system') {
      const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setBackgroundImage(prefersDarkMode ? '/kepek/new_bg-dark.png' : '/kepek/new_bg-bright.png');
    }
  };

  const logoSrc = mode === 'light' ? optifyBright : optifyDark;
  
  return (
    <>
      <Select
        value={mode}
        onChange={handleModeChange}
        SelectDisplayProps={{
          'data-screenshot': 'toggle-mode',
        }}
        sx={{ 
          zIndex: 10,
          position: 'relative'
        }}
        {...props}
      >
        <MenuItemComponent value="system">Rendszer</MenuItemComponent>
        <MenuItemComponent value="light">Világos</MenuItemComponent>
        <MenuItemComponent value="dark">Sötét</MenuItemComponent>
      </Select>
      
      <Box 
        sx={{ 
          position: 'fixed', 
          top: '0.5rem', 
          left: '0.5rem',
          zIndex: 1000,
          pointerEvents: 'none',
          isolation: 'isolate'
        }}
      >
        <img
          src={logoSrc}
          alt="Optify Logo"
          style={{ 
            height: '60px',
            pointerEvents: 'none'
          }}
        />
      </Box>
    </>
  );
}