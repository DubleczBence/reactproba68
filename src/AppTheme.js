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
  const { mode } = useColorScheme();

  const backgroundImage = mode === 'light' ? '/kepek/new_bg-bright.png' : '/kepek/new_bg-dark.png';

  const theme = React.useMemo(() => {
    return disableCustomTheme
      ? {}
      : createTheme({
          cssVariables: {
            colorSchemeSelector: 'data-mui-color-scheme',
            cssVarPrefix: 'template',
          },
          colorSchemes,
          typography: {
            ...typography,
            fontFamily: '"Poppins", sans-serif',
            h1: {
              fontFamily: '"Poppins", sans-serif',
            },
            h2: {
              fontFamily: '"Poppins", sans-serif',
            },
            h3: {
              fontFamily: '"Poppins", sans-serif',
            },
            h4: {
              fontFamily: '"Poppins", sans-serif',
            },
            h5: {
              fontFamily: '"Poppins", sans-serif',
            },
            h6: {
              fontFamily: '"Poppins", sans-serif',
            },
            subtitle1: {
              fontFamily: '"Poppins", sans-serif',
            },
            subtitle2: {
              fontFamily: '"Poppins", sans-serif',
            },
            body1: {
              fontFamily: '"Poppins", sans-serif',
            },
            body2: {
              fontFamily: '"Poppins", sans-serif',
            },
            button: {
              fontFamily: '"Poppins", sans-serif',
            },
            caption: {
              fontFamily: '"Poppins", sans-serif',
            },
            overline: {
              fontFamily: '"Poppins", sans-serif',
            },
          },
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
                  fontFamily: '"Poppins", sans-serif',
                },
                '*': {
                  fontFamily: '"Poppins", sans-serif',
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
          backgroundColor: mode === 'light' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)',
          zIndex: -2,
        }}
      />
      
      {/* Háttérkép a videó helyett */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          zIndex: -3,
          transition: 'background-image 0.5s ease-in-out',
        }}
      />

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