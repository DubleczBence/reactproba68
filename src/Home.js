import React from 'react';
import { useLocation } from 'react-router-dom';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';







const Home = ({ onSignOut }) => {


  const [vegzettseg, setVegzettseg] = React.useState('');
  const [korcsoport, setKorcsoport] = React.useState('');
  const [regio, setRegio] = React.useState('');
  const [nem, setNem] = React.useState('');
  const [anyagi, setAnyagi] = React.useState('');





  const handleVegzettseg = (event) => {
    setVegzettseg(event.target.value);
  };

  

  const handleKorcsoport = (event) => {
    setKorcsoport(event.target.value);
  };


  const handleRegio = (event) => {
    setRegio(event.target.value);
  };


  const handleNem = (event) => {
    setNem(event.target.value);
  };



  const handleAnyagi = (event) => {
    setAnyagi(event.target.value);
  };




  const location = useLocation();
  console.log(location);
  const name = location.state?.userName || location.state?.companyName;

  return (
    <div>
      <h1>Köszöntjük az oldalon, {name}!</h1>
      <p>Ez a kezdőoldal.</p>
      <button onClick={onSignOut}>Kijelentkezés</button>


      
      <FormControl sx={{ m: 1, minWidth: 240 }}>
        <InputLabel id="demo-simple-select-autowidth-label">Legmagasabb végzettség</InputLabel>
        <Select
          labelId="demo-simple-select-autowidth-label"
          id="demo-simple-select-autowidth"
          value={vegzettseg}
          onChange={handleVegzettseg}
          autoWidth
          label="Legmagasabb végzettség"
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value={1}>Egyetem, főiskola stb. oklevéllel</MenuItem>
          <MenuItem value={2}>Középfokú végzettség éretségi nélkül, szakmai végzetséggel</MenuItem>
          <MenuItem value={3}>Középfokú végzettség éretségivel (szakmai végzetség nélkül)</MenuItem>
          <MenuItem value={4}>Középfokú végzettség éretségivel (szakmai végzetségel)</MenuItem>
          <MenuItem value={5}>Általános iskola 8. osztálya</MenuItem>
          <MenuItem value={6}>8 általános iskolánál kevesebb</MenuItem>
        </Select>
      </FormControl>




      <FormControl sx={{ m: 1, minWidth: 130 }}>
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
          <MenuItem value={7}>16 évesnél fiatalabb</MenuItem>
          <MenuItem value={8}>16-15</MenuItem>
          <MenuItem value={9}>26-35</MenuItem>
          <MenuItem value={10}>36-45</MenuItem>
          <MenuItem value={11}>46-55</MenuItem>
          <MenuItem value={12}>56-65</MenuItem>
          <MenuItem value={13}>66 éves vagy idősebb</MenuItem>
        </Select>
      </FormControl>


      <FormControl sx={{ m: 1, minWidth: 100 }}>
        <InputLabel id="demo-simple-select-autowidth-label">Régió</InputLabel>
        <Select
          labelId="demo-simple-select-autowidth-label"
          id="demo-simple-select-autowidth"
          value={regio}
          onChange={handleRegio}
          autoWidth
          label="Régió"
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value={14}>Nyugat-Dunántúl</MenuItem>
          <MenuItem value={15}>Közép-Dunántúl</MenuItem>
          <MenuItem value={16}>Közép-Magyarország</MenuItem>
          <MenuItem value={17}>Észak-Magyarország</MenuItem>
          <MenuItem value={18}>Észak-Alföldv</MenuItem>
          <MenuItem value={19}>Dél-Alföld</MenuItem>
        </Select>
      </FormControl>

      <FormControl sx={{ m: 1, minWidth: 100 }}>
        <InputLabel id="demo-simple-select-autowidth-label">Neme</InputLabel>
        <Select
          labelId="demo-simple-select-autowidth-label"
          id="demo-simple-select-autowidth"
          value={nem}
          onChange={handleNem}
          autoWidth
          label="Neme"
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value={20}>Férfi</MenuItem>
          <MenuItem value={21}>Nő</MenuItem>
          <MenuItem value={22}>Egyéb</MenuItem>
        </Select>
      </FormControl>



      <FormControl sx={{ m: 1, minWidth: 220 }}>
        <InputLabel id="demo-simple-select-autowidth-label">Havi nettó átlagkereset</InputLabel>
        <Select
          labelId="demo-simple-select-autowidth-label"
          id="demo-simple-select-autowidth"
          value={anyagi}
          onChange={handleAnyagi}
          autoWidth
          label="Havi nettó átlagkereset"
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value={23}>{'<'} 100 000 Ft</MenuItem>
          <MenuItem value={24}>100 000 Ft - 250 000 Ft</MenuItem>
          <MenuItem value={25}>250 000 Ft - 500 000 Ft</MenuItem>
          <MenuItem value={26}>500 000 Ft - 1 000 000 Ft</MenuItem>
          <MenuItem value={27}>1 000 000 Ft - 1 500 000 Ft</MenuItem>
          <MenuItem value={28}>1 500 000 Ft {'<'}</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
};

export default Home;