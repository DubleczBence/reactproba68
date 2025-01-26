import React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';
import MuiCard from '@mui/material/Card';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';



const MintavetelContainer = styled(MuiCard)(({ theme }) => ({
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




  const marks = [
    {
      value: 50,
      label: '50 fő',
    },
    {
      value: 100,
      label: '100 fő',
    },
    {
      value: 200,
      label: '200 fő',
    },
    {
      value: 500,
      label: '500 fő',
    },
    {
        value: 1000,
        label: '1000 fő',
      },
  ];
  
  function valuetext(value) {
    return `${value} fő`;
  }





  const Mintavetel = ({ userCount, onClose, onBack }) => {



return (
  <MintavetelContainer 
  noValidate
  autoComplete="off"
  variant="outlined"
  sx={{
    top: "4px",
    mt: 7, // Margin-top
    width: "95% !important",
    height: "60% !important",
    maxWidth: "700px !important",
    position: "relative",
    padding: "10px",
    overflow: "auto",
  }}>

    <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
        Elérhető felhasználók száma: {userCount}
    </Typography>


    <Box sx={{ width: 400, mx: 'auto' }}>
      <Slider
        aria-label="Restricted values"
        defaultValue={50}
        getAriaValueText={valuetext}
        step={null}
        valueLabelDisplay="auto"
        marks={marks}
        min={50}        // Added min value
        max={1000}      // Added max value
      />
    </Box>



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
          onClick={onBack}
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

        <Button
            onClick={onClose}
            sx={{
              position: "absolute", // Abszolút pozicionálás
              top: "8px", // Távolság a Card tetejétől
              right: "8px",
              width: "22px", // A gomb szélessége és magassága
              height: "22px",
              minWidth: "0px", // Minimalizálja a gomb alapértelmezett paddingjét
              padding: "0px", // Eltávolítja az extra belső térközt
              display: "flex", // Középre igazításhoz
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
        </MintavetelContainer>
    );
    };

    export default Mintavetel;