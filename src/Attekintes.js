import React from 'react';
import { styled } from '@mui/material/styles';
import MuiCard from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';
import Divider from '@mui/material/Divider';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import TextField from '@mui/material/TextField';

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

const Attekintes = ({ surveyTitle, questions, onClose, onBack, onNext }) => {
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
      <Typography variant="h4" sx={{ mb: 4 }}>
        {surveyTitle}
      </Typography>

      {questions.map((question, index) => (
        <Box key={index} sx={{ mb: 4 }}>
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
              rows={3}
              sx={{ mt: 1 }}
            />
          )}

          <Divider sx={{ mt: 3 }} />
        </Box>
      ))}

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