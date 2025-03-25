import * as React from 'react';
import PropTypes from 'prop-types';
import { ThemeProvider, createTheme, useColorScheme } from '@mui/material/styles';
import { inputsCustomizations } from './customizations/inputs';
import { dataDisplayCustomizations } from './customizations/dataDisplay';
import { feedbackCustomizations } from './customizations/feedback';
import { navigationCustomizations } from './customizations/navigation';
import { surfacesCustomizations } from './customizations/surfaces';
import { colorSchemes, typography, shadows, shape } from './themePrimitives';

function AppTheme({ children, disableCustomTheme, themeComponents }) {
  const videoRef = React.useRef(null);
  const [opacity, setOpacity] = React.useState(1);
  const { mode } = useColorScheme();

  const videoSource = mode === 'light' 
    ? "/kepek/AdobeStock_477969018_2.mp4" 
    : "/kepek/AdobeStock_477969018.mp4";

  React.useEffect(() => {
    const videoElement = videoRef.current;
    
    if (videoElement) {
      const handleLoadedMetadata = () => {
        const duration = videoElement.duration;
        
        const setFadeTimer = () => {
          const timeUntilEnd = (duration - videoElement.currentTime - 1) * 1000;
          if (timeUntilEnd > 0) {
            setTimeout(() => {
              const minOpacity = mode === 'light' ? 0.7 : 0;
              setOpacity(minOpacity);
              
              setTimeout(() => {
                setOpacity(1);
              }, 1000);
            }, timeUntilEnd);
          }
        };
        
        setFadeTimer();
        
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
  }, [mode]);

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
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: mode === 'light' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.3)',
          zIndex: -2,
        }}
      />
      
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
          zIndex: -3,
          opacity: opacity,
          transition: 'opacity 1s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <source src={videoSource} type="video/mp4" />
      </video>

      {children}
    </ThemeProvider>
  );
}

AppTheme.propTypes = {
  children: PropTypes.node,
  disableCustomTheme: PropTypes.bool,
  themeComponents: PropTypes.object,
};

export default AppTheme;