import * as React from 'react';
import PropTypes from 'prop-types';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { inputsCustomizations } from './customizations/inputs';
import { dataDisplayCustomizations } from './customizations/dataDisplay';
import { feedbackCustomizations } from './customizations/feedback';
import { navigationCustomizations } from './customizations/navigation';
import { surfacesCustomizations } from './customizations/surfaces';
import { colorSchemes, typography, shadows, shape } from './themePrimitives';

function AppTheme({ children, disableCustomTheme, themeComponents }) {
  const videoRef = React.useRef(null);
  const [opacity, setOpacity] = React.useState(1);

  React.useEffect(() => {
    const videoElement = videoRef.current;
    
    if (videoElement) {
      // Videó időtartamának lekérdezése betöltés után
      const handleLoadedMetadata = () => {
        const duration = videoElement.duration;
        
        // Időzítő beállítása a videó vége előtt 1 másodperccel
        const setFadeTimer = () => {
          const timeUntilEnd = (duration - videoElement.currentTime - 1) * 1000;
          if (timeUntilEnd > 0) {
            setTimeout(() => {
              // Fokozatos elhalványítás
              setOpacity(0);
              
              // Újra láthatóvá tesszük, amikor a videó újraindul
              setTimeout(() => {
                setOpacity(1);
              }, 1000);
            }, timeUntilEnd);
          }
        };
        
        // Időzítő beállítása, amikor a videó elindul
        setFadeTimer();
        
        // Időzítő beállítása minden újraindításkor
        videoElement.addEventListener('seeked', setFadeTimer);
        videoElement.addEventListener('play', setFadeTimer);
      };
      
      videoElement.addEventListener('loadedmetadata', handleLoadedMetadata);
      
      return () => {
        videoElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
        videoElement.removeEventListener('seeked', handleLoadedMetadata);
        videoElement.removeEventListener('play', handleLoadedMetadata);
      };
    }
  }, []);

  const theme = React.useMemo(() => {
    return disableCustomTheme
      ? {}
      : createTheme({
          cssVariables: {
            colorSchemeSelector: 'data-mui-color-scheme',
            cssVarPrefix: 'template',
          },
          colorSchemes,
          typography,
          shadows,
          shape,
          components: {
            ...inputsCustomizations,
            ...dataDisplayCustomizations,
            ...feedbackCustomizations,
            ...navigationCustomizations,
            ...surfacesCustomizations,
            ...themeComponents,
            MuiCssBaseline: {
              styleOverrides: {
                body: {
                  margin: 0,
                  padding: 0,
                  overflow: 'hidden',
                },
              },
            },
          },
        });
  }, [disableCustomTheme, themeComponents]);

  if (disableCustomTheme) {
    return <React.Fragment>{children}</React.Fragment>;
  }

  return (
    <ThemeProvider theme={theme} disableTransitionOnChange>
      {/* Háttérvideó */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          objectFit: 'cover',
          zIndex: -1,
          opacity: opacity,
          transition: 'opacity 1s ease-in-out',
        }}
      >
        <source src="/kepek/AdobeStock_477969018.mp4" type="video/mp4" />
      </video>

      {/* Az alkalmazás tartalma */}
      {children}
    </ThemeProvider>
  );
}

AppTheme.propTypes = {
  children: PropTypes.node,
  /**
   * This is for the docs site. You can ignore it or remove it.
   */
  disableCustomTheme: PropTypes.bool,
  themeComponents: PropTypes.object,
};

export default AppTheme;