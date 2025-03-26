import * as React from 'react';
import { useColorScheme } from '@mui/material/styles';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Box from '@mui/material/Box';
import optifyBright from './kepek/optify-bright.png';
import optifyDark from './kepek/optify-dark.png';

export default function ColorModeSelect(props) {
  const { mode, setMode } = useColorScheme();
  
  React.useEffect(() => {
    const videoElement = document.querySelector('video');
    if (videoElement) {
      const videoSource = mode === 'light' || (mode === 'system' && window.matchMedia('(prefers-color-scheme: light)').matches)
      ? "/kepek/AdobeStock_477969018_2.mp4" 
      : "/kepek/AdobeStock_477969018.mp4";
      
      const sourceElement = videoElement.querySelector('source');
      if (sourceElement) {
        sourceElement.src = videoSource;
        videoElement.load();
      const playVideo = () => {
        if (document.body.contains(videoElement)) {
          const playPromise = videoElement.play();
          
          if (playPromise !== undefined) {
            playPromise.catch(error => {
              if (error.name !== 'AbortError') {
                console.error('Video play error:', error);
              }
            });
          }
        }
      };
      
      videoElement.addEventListener('loadeddata', playVideo, { once: true });
      
      return () => {
        videoElement.removeEventListener('loadeddata', playVideo);
      };
    }
  }
}, [mode]);

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