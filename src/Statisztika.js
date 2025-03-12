import React, { useState, useEffect } from 'react';
import { Card, Button, Typography, Box, LinearProgress, Dialog, DialogTitle, DialogContent, List, ListItem } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '95%',
  maxWidth: '700px',
  height: '65%',
  padding: theme.spacing(4),
  marginTop: theme.spacing(7),
  overflow: 'auto'
}));

const AnswerBar = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(2),
  width: '100%'
}));

const Statisztika = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [textAnswers, setTextAnswers] = useState([]);
  const [companySurveys, setCompanySurveys] = useState([]);
  const [selectedSurvey, setSelectedSurvey] = useState(null);
  const [surveyAnswers, setSurveyAnswers] = useState([]);
  

  useEffect(() => {
    const fetchSurveys = async () => {
      const cegId = localStorage.getItem('cegId');
      const response = await fetch(`http://localhost:3001/api/main/company-surveys/${cegId}`);
      const data = await response.json();
      setCompanySurveys(data);
    };
    fetchSurveys();
  }, []);

  useEffect(() => {
    if (selectedSurvey) {
      const fetchAnswers = async () => {
        const response = await fetch(`http://localhost:3001/api/main/survey-answers/${selectedSurvey.id}`);
        const data = await response.json();
        setSurveyAnswers(data);
      };
      fetchAnswers();
    }
  }, [selectedSurvey]);

  const handleOpenTextAnswers = (answers) => {
    setTextAnswers(answers);
    setOpenDialog(true);
  };

  return (
    <>
      <Typography
        variant="h5"
        sx={{
          textAlign: 'center',
          mb: -4,
          mt: 6
        }}
      >
        Válasszon kérdőívet
      </Typography>
      <StyledCard variant="outlined">
        {!selectedSurvey ? (
          companySurveys.map(survey => (
            <Button
              key={survey.id}
              onClick={() => setSelectedSurvey(survey)}
              sx={{
                height: "80px",
                textAlign: "left",
                pl: 4,
                fontSize: "1.2rem",
                mb: 2,
                width: "100%",
                display: 'flex',
                justifyContent: 'space-between'
              }}
              variant="outlined"
            >
              <span>{survey.title}</span>
              <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 2, mr: 2 }}>
                <Typography>{survey.created_date}</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Typography>{Math.round(survey.completion_percentage)}%</Typography>
                  <Typography variant="caption">Kitöltöttség</Typography>
                </Box>
              </Box>
            </Button>
          ))
        ) : (
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 5 }}>
            <Typography variant="h3">
                {selectedSurvey.title}
            </Typography>
            <Typography variant="h5" sx={{ color: 'text.secondary' }}>
               kérdőív statisztikái
            </Typography>
            </Box>
            {surveyAnswers.map((question, qIndex) => (
            <Box key={qIndex} sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                {qIndex + 1}. {question.questionText} 
                <span style={{ fontWeight: 'normal', fontSize: '0.9em' }}>
                    ({question.type === 'radio' ? 'Feleletválasztó' : 
                    question.type === 'checkbox' ? 'Jelölőnégyzet' : 
                    'Szöveges válasz'})
                </span>
                </Typography>
                {question.type === 'text' ? (
                  <Button
                    variant="outlined"
                    onClick={() => handleOpenTextAnswers(question.answers)}
                    sx={{ width: '100%', mt: 1 }}
                  >
                    Szöveges válaszok megtekintése
                  </Button>
                ) : (
                  question.answers.map((answer, aIndex) => (
                    <AnswerBar key={aIndex}>
                      <Box sx={{ minWidth: 120 }}>
                        <Typography>{aIndex + 1}. {answer.option}</Typography>
                      </Box>
                      <Box sx={{ flex: 1, mr: 2 }}>
                        <LinearProgress 
                          variant="determinate" 
                          value={answer.percentage} 
                          sx={{ height: 20, borderRadius: 2 }}
                        />
                      </Box>
                      <Box sx={{ minWidth: 60 }}>
                        <Typography>{answer.count} ({answer.percentage}%)</Typography>
                      </Box>
                    </AnswerBar>
                  ))
                )}
              </Box>
            ))}
            <Button 
              onClick={() => setSelectedSurvey(null)}
              variant="outlined"
              sx={{ 
                mb: 2,
                display: 'block',
                margin: '0 auto',
                width: 'fit-content'
              }}
            >
              Vissza
            </Button>
          </Box>
        )}
      </StyledCard>

      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Szöveges válaszok</DialogTitle>
        <DialogContent>
          <List>
            {textAnswers.map((answer, index) => (
              <ListItem key={index} sx={{ borderBottom: 1, borderColor: 'divider', py: 2 }}>
                {answer.option}
              </ListItem>
            ))}
          </List>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Statisztika;