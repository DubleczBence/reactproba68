import React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';
import MuiCard from '@mui/material/Card';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
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
  width: 80px;
  font-size: 18px;
`;


  const Mintavetel = ({ userCount, onClose, onBack, onNext }) => {





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

    <Typography variant="h4" sx={{ mt: 1, ml: 2 }}>
        Mintavétel
    </Typography>
    <Typography variant="h6" sx={{ mt: 2, alignItems: "center", justifyContent: "center", textAlign: "center" }}>
        A meghatározott célcsoportból
    </Typography>
    <Typography variant="h4" sx={{ alignItems: "center", justifyContent: "center", textAlign: "center" }}>
        {userCount} Fő
    </Typography>
    <Typography variant="h6" sx={{ alignItems: "center", justifyContent: "center", textAlign: "center" }}>
        Érhető el
    </Typography>




    <Box sx={{ width: '90%', mx: 'auto', mt: 4, mb: 4 }}>
      <Box container spacing={2} sx={{ alignItems: 'center' }}>
        <Box item>
        </Box>
        <Box item xs
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
        >
          <Typography sx={{ mr: 2 }}>50 fő</Typography>
          <Slider
            value={typeof value === 'number' ? value : 50}
            onChange={handleSliderChange}
            aria-labelledby="input-slider"
            min={50}
            max={1000}
            sx={{ width: '300px' }}
          />
          <Typography sx={{ ml: 2 }}>1000 fő</Typography>
        </Box>
      </Box>
      <Box item xs={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Input
          value={value}
          size="medium"
          onChange={handleInputChange}
          onBlur={handleBlur}
          sx={{ 
            width: '100px',  // Increased from 60px
            '& input': {
              fontSize: '20px',
              padding: '5px',
              textAlign: 'center'
            }
          }}
        />
      </Box>
    </Box>


    <Box
  sx={{
    display: "flex",         
    flexDirection: "row",    
    alignItems: "center",    
    justifyContent: "center", 
    gap: 2,                  
    mt: "auto",  // This will push the buttons to the bottom
    mb: 2,       // Add some margin at the bottom
  }}>
  <Button
    onClick={onNext}
    variant="outlined"
    sx={{
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      width: "82px",
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
        </MintavetelContainer>
    );
    };

    export default Mintavetel;