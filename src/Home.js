import React from 'react';
import { useLocation } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';


const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};



const vegzettsegek = [
  'Egyetem, főiskola stb. oklevéllel',
  'Középfokú végzettség éretségi nélkül, szakmai végzetséggel',
  'Középfokú végzettség éretségivel (szakmai végzetség nélkül)',
  'Középfokú végzettség éretségivel (szakmai végzetségel)',
  'Általános iskola 8. osztálya',
  '8 általános iskolánál kevesebb',
];



function getStyles(vegzettseg, VegzettsegName, theme) {
  return {
    fontWeight: VegzettsegName.includes(vegzettseg)
      ? theme.typography.fontWeightMedium
      : theme.typography.fontWeightRegular,
  };
}


const Home = ({ onSignOut }) => {


  const theme = useTheme();
  const [VegzettsegName, setVegzettsegName] = React.useState([]);
  const [korcsoport, setKorcsoport] = React.useState('');
  const [regio, setRegio] = React.useState('');



  const handleVegzettseg= (event) => {
    const {
      target: { value },
    } = event;
    setVegzettsegName(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };



  const handleKorcsoport = (event) => {
    setKorcsoport(event.target.value);
  };


  const handleRegio = (event) => {
    setRegio(event.target.value);
  };



  const location = useLocation();
  console.log(location);
  const name = location.state?.userName || location.state?.companyName;

  return (
    <div>
      <h1>Köszöntjük az oldalon, {name}!</h1>
      <p>Ez a kezdőoldal.</p>
      <button onClick={onSignOut}>Kijelentkezés</button>


      <FormControl sx={{ m: 1, width: 300 }}>
        <InputLabel id="demo-multiple-chip-label">Végzettség</InputLabel>
        <Select
          labelId="demo-multiple-chip-label"
          id="demo-multiple-chip"
          multiple
          value={VegzettsegName}
          onChange={handleVegzettseg}
          input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((value) => (
                <Chip key={value} label={value} />
              ))}
            </Box>
          )}
          MenuProps={MenuProps}
        >
          {vegzettsegek.map((vegzettseg) => (
            <MenuItem
              key={vegzettseg}
              value={vegzettseg}
              style={getStyles(vegzettseg, VegzettsegName, theme)}
            >
              {vegzettseg}
            </MenuItem>
          ))}
        </Select>
      </FormControl>


      <FormControl sx={{ m: 1, minWidth: 80 }}>
        <InputLabel id="demo-simple-select-autowidth-label">Korcsoport</InputLabel>
        <Select
          labelId="demo-simple-select-autowidth-label"
          id="demo-simple-select-autowidth"
          value={korcsoport}
          onChange={handleKorcsoport}
          autoWidth
          label="Korcsoport"
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value={20}>16 évesnél fiatalabb</MenuItem>
          <MenuItem value={21}>16-15</MenuItem>
          <MenuItem value={22}>26-35</MenuItem>
          <MenuItem value={23}>36-45</MenuItem>
          <MenuItem value={24}>46-55</MenuItem>
          <MenuItem value={25}>56-65</MenuItem>
          <MenuItem value={26}>66 éves vagy idősebb</MenuItem>
        </Select>
      </FormControl>


      <FormControl sx={{ m: 1, minWidth: 80 }}>
        <InputLabel id="demo-simple-select-autowidth-label">Régió</InputLabel>
        <Select
          labelId="demo-simple-select-autowidth-label"
          id="demo-simple-select-autowidth"
          value={regio}
          onChange={handleRegio}
          autoWidth
          label="Korcsoport"
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value={27}>Nyugat-Dunántúl</MenuItem>
          <MenuItem value={28}>Közép-Dunántúl</MenuItem>
          <MenuItem value={29}>Közép-Magyarország</MenuItem>
          <MenuItem value={30}>Észak-Magyarország</MenuItem>
          <MenuItem value={31}>Észak-Alföldv</MenuItem>
          <MenuItem value={32}>Dél-Alföld</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
};

export default Home;