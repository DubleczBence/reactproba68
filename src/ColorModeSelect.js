import * as React from 'react';
import { useColorScheme } from '@mui/material/styles';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Box from '@mui/material/Box';
import optifyBright from './kepek/optify-bright.png';
import optifyDark from './kepek/optify-dark.png';

export default function ColorModeSelect(props) {
  const { mode, setMode } = useColorScheme();
  
  // Videó forrás frissítése a téma változásakor
  React.useEffect(() => {
    // Megkeressük a videó elemet a DOM-ban
    const videoElement = document.querySelector('video');
    if (videoElement) {
      // Beállítjuk a megfelelő videó forrást a téma alapján
      const videoSource = mode === 'light' 
        ? "/kepek/AdobeStock_477969018_2.mp4" 
        : "/kepek/AdobeStock_477969018.mp4";
      
      // Frissítjük a source elem src attribútumát
      const sourceElement = videoElement.querySelector('source');
      if (sourceElement) {
        sourceElement.src = videoSource;
        // Újratöltjük a videót, hogy az új forrás érvénybe lépjen
        videoElement.load();
        videoElement.play();
      }
    }
  }, [mode]); // A függőségi tömb tartalmazza a mode-ot, így a téma változásakor újra lefut

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
        {...props}
      >
        <MenuItem value="system">Rendszer</MenuItem>
        <MenuItem value="light">Világos</MenuItem>
        <MenuItem value="dark">Sötét</MenuItem>
      </Select>
      <Box sx={{ position: 'fixed', top: '0.5rem', left: '0.5rem' }}>
        <img
          src={mode === 'dark' ? optifyDark : optifyBright}
          alt="Optify Logo"
          style={{ height: '60px' }}
        />
      </Box>
    </>
  );
}