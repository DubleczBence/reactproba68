import * as React from 'react';
import { useColorScheme } from '@mui/material/styles';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Box from '@mui/material/Box';
import optifyBright from './kepek/optify-bright.png';
import optifyDark from './kepek/optify-dark.png';

export default function ColorModeSelect(props) {
  const { mode, setMode } = useColorScheme();
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
        <MenuItem value="system">System</MenuItem>
        <MenuItem value="light">Light</MenuItem>
        <MenuItem value="dark">Dark</MenuItem>
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
