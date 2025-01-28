import React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';
import MuiCard from '@mui/material/Card';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import MuiInput from '@mui/material/Input';


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



  const Input = styled(MuiInput)`
  width: 42px;
`;


  const Mintavetel = ({ userCount, onClose, onBack }) => {





  const [value, setValue] = React.useState(50);

  const handleSliderChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleInputChange = (event) => {
    setValue(event.target.value === '' ? 0 : Number(event.target.value));
  };

  const handleBlur = () => {
    if (value < 0) {
      setValue(0);
    } else if (value > 100) {
      setValue(100);
    }
  };



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




    <Box sx={{ width: '90%', mx: 'auto', mt: 4, mb: 4 }}>
      <Typography id="input-slider" gutterBottom>
        Mintavetel
      </Typography>
      <Grid container spacing={2} sx={{ alignItems: 'center' }}>
        <Grid item>
        </Grid>
        <Grid item xs>
          <Slider
            value={typeof value === 'number' ? value : 50}
            onChange={handleSliderChange}
            aria-labelledby="input-slider"
            min={50}    // Setting minimum to 50
            max={1000}  // Setting maximum to 1000
          />
        </Grid>
        <Grid item>
          <Input
            value={value}
            size="small"
            onChange={handleInputChange}
            onBlur={handleBlur}
            inputProps={{
              step: 10,
              min: 50,
              max: 1000,
              type: 'number',
              'aria-labelledby': 'input-slider',
            }}
          />
        </Grid>
      </Grid>
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