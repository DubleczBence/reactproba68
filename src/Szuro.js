import React from 'react';
import { styled } from '@mui/material/styles';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';
import MuiCard from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import { post } from './services/apiService';



const SzuroContainer = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: 'auto',
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  [theme.breakpoints.up('sm')]: {
    width: '450px',
  },
  ...theme.applyStyles('dark', {
    boxShadow:
      'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
      }),
  }));


  const Szurooldal = ({ onReceiveData, onClose, onBack, onShowMintavetel }) => {



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
        console.log("Filter data being sent:", filterData);
      
        try {
          const data = await post('/main/szures', filterData);
          onShowMintavetel(data.count, filterData);
        } catch (error) {
          console.error('Hiba a szűrés során:', error);
        }
      };


    




return (
  <SzuroContainer 
  noValidate
  autoComplete="off"
  variant="outlined"
  sx={{
    top: "3px",
    mt: 4, 
    width: "95% !important",
    height: "76% !important",
    maxWidth: "700px !important",
    position: "relative",
    padding: "10px",
    overflow: "auto",
  }}>

    <Typography variant="h4" sx={{ mt: 1, ml: 2 }}>
        Célcsoport
    </Typography>

<FormControl sx={{ m: 1, minWidth: 240, mt: 4 }}>
  <InputLabel
    id="demo-simple-select-autowidth-label"
    sx={{
      fontSize: '1.2rem', 
      fontWeight: 'bold', 
      lineHeight: '1.5',  
      
      '&.MuiInputLabel-shrink': {
        transform: 'translate(0, -1.8rem)', 
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
    fontSize: '1.2rem', 
    padding: '10px',    
    height: '60px',     
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
          fontSize: '1.2rem', 
          fontWeight: 'bold', 
          lineHeight: '1.5',  
          
          '&.MuiInputLabel-shrink': {
            transform: 'translate(0, -1.8rem)', 
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
            fontSize: '1.2rem', 
            padding: '10px',    
            height: '60px',     
          }}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value="16-25">16-25 év</MenuItem>
          <MenuItem value="26-35">26-35 év</MenuItem>
          <MenuItem value="36-45">36-45 év</MenuItem>
          <MenuItem value="46-55">46-55 év</MenuItem>
          <MenuItem value="56-65">56-65 év</MenuItem>
          <MenuItem value="66-120">66 év felett</MenuItem>
        </Select>
      </FormControl>





      <FormControl sx={{ m: 1, minWidth: 100 }}>
        <InputLabel id="demo-simple-select-autowidth-label"
        sx={{
          fontSize: '1.2rem', 
          fontWeight: 'bold', 
          lineHeight: '1.5',  
          
          '&.MuiInputLabel-shrink': {
            transform: 'translate(0, -1.8rem)', 
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
            fontSize: '1.2rem', 
            padding: '10px',    
            height: '60px',     
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
          fontSize: '1.2rem', 
          fontWeight: 'bold', 
          lineHeight: '1.5',  
          
          '&.MuiInputLabel-shrink': {
            transform: 'translate(0, -1.8rem)', 
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
            fontSize: '1.2rem', 
            padding: '10px',    
            height: '60px',     
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
          fontSize: '1.2rem', 
          fontWeight: 'bold', 
          lineHeight: '1.5', 
          
          '&.MuiInputLabel-shrink': {
            transform: 'translate(0, -1.8rem)', 
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
            fontSize: '1.2rem', 
            padding: '10px',    
            height: '60px',     
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
        display: "flex",         
        flexDirection: "row",    
        alignItems: "center",    
        justifyContent: "center", 
        gap: 2,                  
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
            border: "none", 
            borderRadius: "10px", 
            backgroundColor: (theme) => theme.palette.background.paper,
            color: (theme) => theme.palette.text.primary,
            "&:hover": {
          backgroundColor: (theme) =>
            theme.palette.mode === "dark" ? "#2c2c2c" : "#eaeaea",
            },
          }}
        >
          Tovább
        </Button>



        <Button
          onClick={onBack}
          variant="outlined"
          sx={{
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            width: "82px",
            mb: 2,
            border: "none", 
            borderRadius: "10px", 
            backgroundColor: (theme) => theme.palette.background.paper,
            color: (theme) => theme.palette.text.primary,
            "&:hover": {
          backgroundColor: (theme) =>
            theme.palette.mode === "dark" ? "#2c2c2c" : "#eaeaea",
            },
          }}
        >
          Vissza
        </Button>
        </Box>

        <Button
            onClick={onClose}
            sx={{
              position: "absolute", 
              top: "8px", 
              right: "8px",
              width: "22px", 
              height: "22px",
              minWidth: "0px", 
              padding: "0px", 
              display: "flex", 
              alignItems: "center",
              justifyContent: "center",
            }}
            >
            
              <CloseIcon
                sx={{
                  width: "22px",
                  height: "22px",
                }}
              />
            
          
          </Button>
        </SzuroContainer>
    );
    };

    export default Szurooldal;