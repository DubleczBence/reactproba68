import React from 'react';
import { styled } from '@mui/material/styles';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';




const SzuroContainer = styled(Stack)(({ theme }) => ({
    height: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)',
    minHeight: '100%',
    padding: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      padding: theme.spacing(4),
    },
    '&::before': {
      content: '""',
      display: 'block',
      position: 'absolute',
      zIndex: -1,
      inset: 0,
      backgroundImage:
        'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
      backgroundRepeat: 'no-repeat',
      ...theme.applyStyles('dark', {
        backgroundImage:
          'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
      }),
    },
  }));


  const Szurooldal = ({ onReceiveData, onClose }) => {



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
  
  
  
    const ReceiveData = async () => {
        const filterData = {
          vegzettseg,
          korcsoport,
          regio,
          nem,
          anyagi
        };
      
        try {
          const response = await fetch('http://localhost:3001/api/main/szures', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(filterData)
          });

          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
      
        const data = await response.json();
        console.log('Filtered count:', data.count);
        alert(`Találatok száma: ${data.count}`);
        } catch (error) {
          console.error('Hiba a szűrés során:', error);
        }
      };


    




return (
  <SzuroContainer>

<FormControl sx={{ m: 1, minWidth: 240 }}>
  <InputLabel
    id="demo-simple-select-autowidth-label"
    sx={{
      fontSize: '1.2rem', // Betűméret növelése
      fontWeight: 'bold', // Félkövér szöveg
      lineHeight: '1.5',  // Sorköz méretének növelése
      
      '&.MuiInputLabel-shrink': {
        transform: 'translate(0, -1.8rem)', // Ha a mező fókuszált vagy tele van
      },
    }}
  >
    Legmagasabb végzettség
  </InputLabel>
  <Select
  labelId="demo-simple-select-autowidth-label"
  id="demo-simple-select-autowidth"
  value={vegzettseg}
  onChange={handleVegzettseg}
  autoWidth
  label="Legmagasabb végzettség"
  sx={{
    fontSize: '1.2rem', // Betűméret
    padding: '10px',    // Belső margó
    height: '60px',     // Gomb magassága
  }}
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
        <InputLabel
         id="demo-simple-select-autowidth-label"
         sx={{
          fontSize: '1.2rem', // Betűméret növelése
          fontWeight: 'bold', // Félkövér szöveg
          lineHeight: '1.5',  // Sorköz méretének növelése
          
          '&.MuiInputLabel-shrink': {
            transform: 'translate(0, -1.8rem)', // Ha a mező fókuszált vagy tele van
          },
        }}
         >
          Korcsoport
         </InputLabel>
        <Select
          labelId="demo-simple-select-autowidth-label"
          id="demo-simple-select-autowidth"
          value={korcsoport}
          onChange={handleKorcsoport}
          autoWidth
          label="Korcsoport"
          sx={{
            fontSize: '1.2rem', // Betűméret
            padding: '10px',    // Belső margó
            height: '60px',     // Gomb magassága
          }}
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
        <InputLabel id="demo-simple-select-autowidth-label"
        sx={{
          fontSize: '1.2rem', // Betűméret növelése
          fontWeight: 'bold', // Félkövér szöveg
          lineHeight: '1.5',  // Sorköz méretének növelése
          
          '&.MuiInputLabel-shrink': {
            transform: 'translate(0, -1.8rem)', // Ha a mező fókuszált vagy tele van
          },
        }}
        >
          Régió</InputLabel>
        <Select
          labelId="demo-simple-select-autowidth-label"
          id="demo-simple-select-autowidth"
          value={regio}
          onChange={handleRegio}
          autoWidth
          label="Régió"
          sx={{
            fontSize: '1.2rem', // Betűméret
            padding: '10px',    // Belső margó
            height: '60px',     // Gomb magassága
          }}
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
        <InputLabel id="demo-simple-select-autowidth-label"
        sx={{
          fontSize: '1.2rem', // Betűméret növelése
          fontWeight: 'bold', // Félkövér szöveg
          lineHeight: '1.5',  // Sorköz méretének növelése
          
          '&.MuiInputLabel-shrink': {
            transform: 'translate(0, -1.8rem)', // Ha a mező fókuszált vagy tele van
          },
        }}
        >
          Neme</InputLabel>
        <Select
          labelId="demo-simple-select-autowidth-label"
          id="demo-simple-select-autowidth"
          value={nem}
          onChange={handleNem}
          autoWidth
          label="Neme"
          sx={{
            fontSize: '1.2rem', // Betűméret
            padding: '10px',    // Belső margó
            height: '60px',     // Gomb magassága
          }}
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
        <InputLabel id="demo-simple-select-autowidth-label"
        sx={{
          fontSize: '1.2rem', // Betűméret növelése
          fontWeight: 'bold', // Félkövér szöveg
          lineHeight: '1.5',  // Sorköz méretének növelése
          
          '&.MuiInputLabel-shrink': {
            transform: 'translate(0, -1.8rem)', // Ha a mező fókuszált vagy tele van
          },
        }}
        >
          Havi nettó átlagkereset</InputLabel>
        <Select
          labelId="demo-simple-select-autowidth-label"
          id="demo-simple-select-autowidth"
          value={anyagi}
          onChange={handleAnyagi}
          autoWidth
          label="Havi nettó átlagkereset"
          sx={{
            fontSize: '1.2rem', // Betűméret
            padding: '10px',    // Belső margó
            height: '60px',     // Gomb magassága
          }}
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


      <Box
      sx={{
        display: "flex",         // Flexbox elrendezés
        flexDirection: "row",    // Vízszintes elrendezés
        alignItems: "center",    // Függőleges középre igazítás
        justifyContent: "center", // Vízszintes középre igazítás
        gap: 2,                  // Távolság a gombok között
        mt: 2,  
      }}>
      <Button
          onClick={ReceiveData}
          variant="outlined"
          sx={{
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            width: "82px",
            mb: 2,
            border: "none", // Körvonal (ha szükséges)
            borderRadius: "10px", // Lekerekített sarkok
            backgroundColor: (theme) => theme.palette.background.paper,
            color: (theme) => theme.palette.text.primary,
            "&:hover": {
              backgroundColor: "#eaeaea",
            },
          }}
        >
          Tovább
        </Button>



        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            width: "82px",
            mb: 2,
            border: "none", // Körvonal (ha szükséges)
            borderRadius: "10px", // Lekerekített sarkok
            backgroundColor: (theme) => theme.palette.background.paper,
            color: (theme) => theme.palette.text.primary,
            "&:hover": {
              backgroundColor: "#eaeaea",
            },
          }}
        >
          Vissza
        </Button>
        </Box>
        </SzuroContainer>
    );
    };

    export default Szurooldal;