import React from 'react';
import { styled } from '@mui/material/styles';
import MuiCard from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';

const AttekintesContainer = styled(MuiCard)(({ theme }) => ({
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

const Attekintes = ({ surveyTitle, questions, onClose, onBack, participantCount, creditCost, onSuccess, onError }) => {
  const handleSubmit = async () => {
    const token = localStorage.getItem('token');


    if (!surveyTitle || questions.some(q => !q.questionText)) {
      onError('Minden mező kitöltése kötelező!');
      return;
    }
    
    try {
      const response = await fetch('http://localhost:3001/api/companies/create-survey', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: surveyTitle,
          questions: questions
        })
      });
  
      if (response.ok) {
        onSuccess();
      } else {
        onError('Hiba történt a kérdőív létrehozása során');
      }
    } catch (error) {
      console.error('Error submitting survey:', error);
    }
  };
  return (
    <AttekintesContainer
      noValidate
      autoComplete="off"
      variant="outlined"
      sx={{
        mt: 7,
        width: "95% !important", 
        height: "70vh",
        maxWidth: "700px !important",
        position: "relative",
        padding: "20px",
        overflow: "auto"
      }}
    >
      <Typography variant="h4" sx={{ mt: 1, ml: 2 }}>
        Áttekintés
      </Typography>
      <Typography variant="h6" sx={{ ml: 2, mt: 2 }}>
        {surveyTitle}
      </Typography>

      {questions.map((question, index) => (
        <Container
        sx={{
          padding: "16px", // Belső térköz a Containerben
          borderRadius: "16px", // Lekerekített sarkok
          backgroundColor: (theme) =>
            theme.palette.mode === "light"
              ? theme.palette.background.paper
              : "#1B2430",
          height: "auto",
          maxHeight: "calc(70vh - 100px)", // Maximális magasság a Card magasságához igazítva
          width: "98%",
          
          
          position: "relative",
        }}
        >
        <Box key={index} sx={{ mb: 4, ml: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            {question.questionText}
          </Typography>

          {question.selectedButton === "radio" && (
            <RadioGroup>
              {question.options.map((option, optIndex) => (
                <FormControlLabel
                  key={optIndex}
                  value={option.label}
                  control={<Radio />}
                  label={option.label}
                />
              ))}
            </RadioGroup>
          )}

          {question.selectedButton === "checkbox" && (
            <FormGroup>
              {question.options.map((option, optIndex) => (
                <FormControlLabel
                  key={optIndex}
                  control={<Checkbox />}
                  label={option.label}
                />
              ))}
            </FormGroup>
          )}

          {question.selectedButton === "text" && (
            <TextField
              fullWidth
              placeholder="Írja ide válaszát..."
              multiline
              sx={{ mt: 1 }}
            />
          )}
        </Box>
        </Container>
      ))}

        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: 25, 
          mt: 5,
          mb: 5
        }}>
          
          <Box>
            <Typography variant="h6" sx={{ textAlign: 'center', mb: 0.5, lineHeight: 1 }}>
              Mintavétel
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'baseline' }}>
              <Typography variant="h4" sx={{ mr: 1, lineHeight: 1 }}>
                {participantCount}
              </Typography>
              <Typography variant="h6" sx={{ lineHeight: 1 }}>
                fő
              </Typography>
            </Box>
          </Box>

          
          <Box>
            <Typography variant="h6" sx={{ textAlign: 'center', mb: 0.5, lineHeight: 1 }}>
              Költség
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'baseline' }}>
              <Typography variant="h4" sx={{ mr: 1, lineHeight: 1 }}>
                {creditCost}
              </Typography>
              <Typography variant="h6" sx={{ lineHeight: 1 }}>
                kredit
              </Typography>
            </Box>
          </Box>
        </Box>


                <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          mt: 2,
          mb: 2
        }}>
          <FormControlLabel
            control={<Checkbox />}
            label="Elfogadom a feltételeket"
            sx={{
              '& .MuiTypography-root': {
                fontSize: '1rem'
              }
            }}
          />
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
    onClick={handleSubmit}
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
    Megerősítés
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
          minWidth: "0px",
          width: "22px",
          height: "22px",
          padding: 0
        }}
      >
        <CloseIcon />
      </Button>
    </AttekintesContainer>
  );
};

export default Attekintes;