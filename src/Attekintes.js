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
import { post } from './services/apiService';
import CircularProgress from '@mui/material/CircularProgress';
import { useState } from 'react';
import Backdrop from '@mui/material/Backdrop';

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

const Attekintes = ({ surveyTitle, questions, onClose, onBack, participantCount, creditCost, questionsCost, 
  sampleCost,  onSuccess, onError, filterData, availableCredits }) => {

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  const hasEnoughCredits = availableCredits >= creditCost;

  const handleSubmit = async () => {
    if (!hasEnoughCredits) {
      onError('Nincs elegendő kredit a kérdőív létrehozásához!');
      return;
    }

    console.log("Filter data in handleSubmit:", filterData);

    if (!surveyTitle || questions.some(q => !q.questionText)) {
      onError('Minden mező kitöltése kötelező!');
      return;
    }

    if (!acceptTerms) {
      onError('A feltételek elfogadása kötelező!');
      return;
    }

    setIsSubmitting(true);
    
    try {

      const delayPromise = new Promise(resolve => setTimeout(resolve, 1500));

      const postPromise = post('/companies/create-survey', {
        title: surveyTitle,
        questions: questions,
        participantCount: participantCount,
        filterCriteria: {
          vegzettseg: filterData.vegzettseg,
          korcsoport: filterData.korcsoport,
          regio: filterData.regio,
          nem: filterData.nem,
          anyagi: filterData.anyagi
        },
        creditCost: creditCost
      });

      await Promise.all([postPromise, delayPromise]);
      
      setIsSubmitting(false);
      onSuccess();
    } catch (error) {
      console.error('Error submitting survey:', error);
      setIsSubmitting(false);
      onError('Hiba történt a kérdőív létrehozása során');
    }
  };
  return (
    <>
    <Backdrop
        sx={{
          color: '#fff',
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          position: 'absolute'
        }}
        open={isSubmitting}
      >
        <CircularProgress color="primary" size={40} thickness={4} />
      </Backdrop>
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
          padding: "16px", 
          borderRadius: "16px", 
          backgroundColor: (theme) =>
            theme.palette.mode === "light"
              ? theme.palette.background.paper
              : "#1B2430",
          height: "auto",
          maxHeight: "calc(70vh - 100px)", 
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
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'center', 
        gap: { xs: 4, sm: 25 },
        mt: 5,
        mb: 5
      }}>
          
          <Box sx={{ textAlign: 'center' }}>
            <Typography 
              variant="h6" 
              sx={{ 
                textAlign: 'center', 
                mb: 0.5, 
                lineHeight: 1,
                fontSize: { xs: '1rem', sm: '1.1rem' } 
              }}
            >
              Költség
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'baseline' }}>
              <Typography 
                variant="h4" 
                sx={{ 
                  mr: 1, 
                  lineHeight: 1,
                  fontSize: { xs: '1.1rem', sm: '1.7rem' } 
                }}
              >
                {creditCost}
              </Typography>
              <Typography variant="h6" sx={{ lineHeight: 1, fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                kredit
              </Typography>
            </Box>
            <Typography variant="caption" sx={{ display: 'block', mt: 1, color: 'text.secondary' }}>
              (Kérdések: {questionsCost} kredit, Mintavétel: {sampleCost} kredit)
            </Typography>
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
            control={
              <Checkbox 
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
              />
            }
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
        mt: "auto",  
        mb: 2,       
      }}>
      <Button
          onClick={handleSubmit}
          variant="outlined"
          disabled={isSubmitting || !hasEnoughCredits || !acceptTerms}
          sx={{
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            width: "100px",
            border: "none", 
            borderRadius: "10px", 
            backgroundColor: (theme) => theme.palette.background.paper,
            color: (theme) => theme.palette.text.primary,
            "&:hover": {
              backgroundColor: (theme) =>
                theme.palette.mode === "dark" ? "#2c2c2c" : "#eaeaea",
            }
          }}
        >
          Megerősítés
        </Button>

      {!hasEnoughCredits && (
        <Typography 
          variant="caption" 
          color="error" 
          sx={{ 
            display: 'block', 
            textAlign: 'center', 
            mt: 1 
          }}
        >
          Nincs elegendő kredit a kérdőív létrehozásához!
        </Typography>
      )}

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
    </>
  );
};

export default Attekintes;