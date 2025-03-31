import * as React from 'react';
import { useColorScheme } from '@mui/material/styles';
import MenuItem from '@mui/material/MenuItem';  // Ez az import
import Select from '@mui/material/Select';
import Box from '@mui/material/Box';
import optifyDark from './kepek/optify-dark.png';

export default function ColorModeSelect(props) {
  const { mode, setMode } = useColorScheme();
  
  // Explicit hivatkozás a MenuItem komponensre, hogy az ESLint ne panaszkodjon
  const MenuItemComponent = MenuItem;
  
  if (!mode) {
    return null;
  }
  
  return (
    <>
      <Select
        value={mode}
        onChange={(event) => setMode(event.target.value)}
        SelectDisplayProps={{
          'data-screenshot': 'toggle-mode',
        }}
        sx={{ 
          zIndex: 10,
          position: 'relative'
        }}
        {...props}
      >
        {/* Itt használjuk a MenuItemComponent-et a MenuItem helyett */}
        <MenuItemComponent value="system">Rendszer</MenuItemComponent>
        <MenuItemComponent value="light">Világos</MenuItemComponent>
        <MenuItemComponent value="dark">Sötét</MenuItemComponent>
      </Select>
      
      <Box 
        sx={{ 
          position: 'fixed', 
          top: '0.5rem', 
          left: '0.5rem',
          zIndex: 5,
          pointerEvents: 'none'
        }}
      >
        <img
          src={optifyDark}
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