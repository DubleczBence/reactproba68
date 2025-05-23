import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';
import MuiCard from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { post } from './services/apiService';
import { get } from './services/apiService';

const HelyzetContainer = styled(MuiCard)(({ theme }) => ({
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



  const Helyzet = ({onClose, surveyId, lezaras}) => {
    const [completionData, setCompletionData] = useState({
      completionCount: 0,
      targetCount: 100
    });
    
    const [animatedValue, setAnimatedValue] = useState(0);
    const [openDialog, setOpenDialog] = useState(false);
  
    const completionPercentage = completionData.targetCount > 0 ? 
      (completionData.completionCount / completionData.targetCount) * 100 : 0;

      
  
      useEffect(() => {
        const duration = 2000;
        const steps = 60;
        const interval = duration / steps;
        let currentStep = 0;
      
        const timer = setInterval(() => {
          currentStep++;
          const progress = (currentStep / steps) * completionPercentage;
          setAnimatedValue(progress > completionPercentage ? completionPercentage : progress);
          
          if (currentStep >= steps || progress >= completionPercentage) {
            clearInterval(timer);
            setAnimatedValue(completionPercentage);
          }
        }, interval);
      
        return () => clearInterval(timer);
      }, [completionPercentage]);
    
  
      const handleCloseAndRefresh = () => {
        onClose();
        window.location.reload();
      };


      const handleOpenDialog = () => {
        setOpenDialog(true);
      };
  
      const handleCloseDialog = () => {
        setOpenDialog(false);
      };


      const handleConfirmClose = async () => {
        try {
          await post(`/companies/close-survey/${surveyId}`);
          
          setOpenDialog(false);
          if (lezaras) lezaras();
          handleCloseAndRefresh();
        } catch (error) {
          console.error('Hiba történt a kérdőív lezárása során:', error);
          alert('Hiba történt a kérdőív lezárása során. Kérjük, próbálja újra később.');
        }
      };
  


      useEffect(() => {
        const fetchSurveyStatus = async () => {
          try {
            const data = await get(`/main/survey-status/${surveyId}`);
            setCompletionData({
              completionCount: data.completion_count,
              targetCount: data.mintavetel
            });
          } catch (error) {
            console.error('Error fetching survey status:', error);
          }
        };
        fetchSurveyStatus();
      }, [surveyId]);

return (
  <HelyzetContainer
  noValidate
  autoComplete="off"
  variant="outlined"
  sx={{
    top: "4px",
    mt: 7, 
    width: "95% !important",
    height: "60% !important",
    maxWidth: "700px !important",
    position: "relative",
    padding: "10px",
    overflow: "auto",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  }}>

    
<Box position="relative" display="flex" flexDirection="column" alignItems="center" justifyContent="center" sx={{ mt: 6 }}>
<Box position="relative" display="flex" alignItems="center" justifyContent="center">
  <CircularProgress
    variant="determinate"
    value={animatedValue}
    size={250}
    thickness={3}
    sx={{
      transition: 'all 0.5s ease-in-out',
      color: (theme) => theme.palette.primary.main
    }}
  />
  <Box
    position="absolute"
    display="flex"
    alignItems="center"
    justifyContent="center"
  >
    <Typography variant="h2" component="div">
      {`${Math.round(animatedValue)}%`}
    </Typography>
  </Box>
</Box>


<Typography variant="h5" sx={{ mt: 6, textAlign: 'center' }}>
    {`${completionData.completionCount} / ${completionData.targetCount} kitöltő`}
  </Typography>

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
    onClick={handleCloseAndRefresh}
    variant="outlined"
    sx={{
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      width: "160px",
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
    Vissza a menübe
  </Button>
  <Button
    onClick={handleOpenDialog}
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
    Lezárás
  </Button>
</Box>

        <Button
            onClick={handleCloseAndRefresh}
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

          <Dialog
            open={openDialog}
            onClose={handleCloseDialog}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {"Kérdőív lezárása"}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Biztosan le szeretné zárni a kérdőívet? A lezárás után a kérdőív nem lesz elérhető a felhasználók számára.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog} color="primary">
                Nem
              </Button>
              <Button onClick={handleConfirmClose} color="primary" autoFocus>
                Igen
              </Button>
            </DialogActions>
          </Dialog>
        </HelyzetContainer>
    );
    };

    export default Helyzet;