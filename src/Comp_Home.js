import * as React from 'react';
import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import BarChartIcon from '@mui/icons-material/BarChart';
import AddBoxIcon from '@mui/icons-material/AddBox';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { useLocation } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import ColorModeSelect from './ColorModeSelect';
import Button from '@mui/material/Button';
import AppTheme from './AppTheme';
import CssBaseline from '@mui/material/CssBaseline';
import { useTheme } from '@mui/material/styles';

const SimpleBottomNavigation = ({ value, onChange }) => {
    const theme = useTheme();

  return (
    <BottomNavigation
      showLabels
      value={value}
      onChange={onChange}
      sx={{
        mt: 2, // Margin a tetejétől
        backgroundColor: theme.palette.background.default, 
        boxShadow: theme.shadows[1],
        width: '18%', // Szélesség növelése (arányos a konténerhez)
      }}
    >
      <BottomNavigationAction label="Kezdő oldal" icon={<DashboardIcon />} />
      <BottomNavigationAction label="Új kérdőív" icon={<AddBoxIcon />} />
      <BottomNavigationAction label="Statisztika" icon={<BarChartIcon />} />
    </BottomNavigation>
  );
};

const CompHome = ({ onSignOut }) => {
  const location = useLocation();
  console.log(location);
  const name = location.state?.userName || location.state?.companyName;

  const [value, setValue] = React.useState(0);

  return (
    <AppTheme>
        <CssBaseline enableColorScheme />
    <Box
      sx={{
        position: 'relative',
        height: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        pt: 4, // Padding a tetején
      }}
    >
    <ColorModeSelect sx={{ position: 'absolute', top: '1rem', right: '10rem' }} />
    

      {/* Tetején középen: "Ez a kezdőoldal." */}
      <Typography
        component="h1"
        variant="h4"
        sx={{
          textAlign: 'center',
        }}
      >
        Ez a kezdőoldal.
      </Typography>

      {/* Tetején középen, alatta a navigációs sáv */}
      <SimpleBottomNavigation
        value={value}
        onChange={(event, newValue) => setValue(newValue)}
      />

      {/* Bal felső sarok: "Köszöntjük az oldalon, {name}!" */}
      <Typography
        component="h1"
        variant="h6"
        sx={{
          position: 'absolute',
          top: 16,
          left: 16,
        }}
      >
        Köszöntjük az oldalon, {name}!
      </Typography>

      {/* Jobb felső sarok: Kijelentkezés gomb */}
      <Button
        type="submit"
        variant="contained"
        onClick={onSignOut}
        sx={{
          position: 'absolute',
          top: 16,
          right: 16,
        }}
      >
        Kijelentkezés
      </Button>
    </Box>
    </AppTheme>
  );
};

export default CompHome;
