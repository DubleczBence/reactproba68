import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import AppTheme from './AppTheme';
import CssBaseline from '@mui/material/CssBaseline';
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import ColorModeSelect from './ColorModeSelect';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import Avatar from '@mui/material/Avatar';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import Logout from '@mui/icons-material/Logout';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import Container from '@mui/material/Container';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import UserKredit from './userKredit';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { useTheme, createTheme, ThemeProvider } from '@mui/material/styles';
import { Snackbar, Alert } from '@mui/material';



const SimpleBottomNavigation = ({ value, onChange }) => {
  const theme = createTheme({
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 960,
        lg: 1280,
        xl: 1920,
        custom: 730
      },
    },
  });

  return (
    <BottomNavigation
      showLabels
      value={value}
      onChange={onChange}
      sx={{
        mt: 2, 
        mb: 3,
        backgroundColor: 'hsla(210, 100%, 10%, 0.1)', 
        boxShadow: theme.shadows[1],
        width: '18%',
      }}
    >
      <BottomNavigationAction label="Főoldal" icon={<DashboardIcon />} />
      <BottomNavigationAction label="Egyenleg" icon={<AccountBalanceWalletIcon />} />
    </BottomNavigation>
  );
};

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: 'auto',
  overflow: 'auto',
  backgroundColor: theme.palette.mode === 'light' 
    ? 'rgba(255, 255, 255, 0.8)'
    : 'rgba(2, 1, 14, 0.8)',
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  [theme.breakpoints.up('sm')]: {
    width: '700px',
  },
  ...theme.applyStyles('dark', {
    boxShadow:
      'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
      backgroundColor: 'rgba(18, 18, 18, 0.4)',
  }),
}));

const UserContainer = styled(Stack)(({ theme }) => ({
  height: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)',
  minHeight: '100%',
  padding: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(4),
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    inset: 0,
    backgroundColor: theme.palette.mode === 'light' 
      ? 'rgba(255, 255, 255, 0.3)'
      : 'rgba(0, 0, 0, 0.5)',
    zIndex: -1,
    pointerEvents: 'none',
  }
}));



const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});



const ProfileDialog = ({ open, onClose, userData, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    regio: '',
    anyagi: ''
  });

  useEffect(() => {
    if (userData) {
      setFormData({
        name: userData.name || '',
        regio: userData.regio || '',
        anyagi: userData.anyagi || ''
      });
    }
  }, [userData]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    const dataToSave = {};
    if (formData.name.trim() !== '') dataToSave.name = formData.name;
    if (formData.regio) dataToSave.regio = formData.regio;
    if (formData.anyagi) dataToSave.anyagi = formData.anyagi;
    
    onSave(dataToSave);
  };

  const regioOptions = [
    { value: '14', label: 'Nyugat-Dunántúl' },
    { value: '15', label: 'Közép-Dunántúl' },
    { value: '16', label: 'Közép-Magyarország' },
    { value: '17', label: 'Észak-Magyarország' },
    { value: '18', label: 'Észak-Alföld' },
    { value: '19', label: 'Dél-Alföld' }
  ];
  
  const anyagiOptions = [
    { value: '23', label: '< 100 000 Ft' },
    { value: '24', label: '100 000 Ft - 250 000 Ft' },
    { value: '25', label: '250 000 Ft - 500 000 Ft' },
    { value: '26', label: '500 000 Ft - 1 000 000 Ft' },
    { value: '27', label: '1 000 000 Ft - 1 500 000 Ft' },
    { value: '28', label: '1 500 000 Ft <' }
  ];
  
  const vegzettsegMap = {
    '1': 'Egyetem, főiskola stb. oklevéllel',
    '2': 'Középfokú végzettség érettségi nélkül, szakmai végzettséggel',
    '3': 'Középfokú végzettség érettségivel (szakmai végzettség nélkül)',
    '4': 'Középfokú végzettség érettségivel (szakmai végzettséggel)',
    '5': 'Általános iskola 8. osztálya',
    '6': '8 általános iskolánál kevesebb'
  };
  
  const nemMap = {
    '20': 'Férfi',
    '21': 'Nő',
    '22': 'Egyéb'
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Felhasználói profil</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
          <TextField
            fullWidth
            label="Név"
            name="name"
            value={formData.name}
            onChange={handleChange}
            InputLabelProps={{
              shrink: true,
              style: { transform: 'translate(0, -14px) scale(0.75)' }
            }}
          />
          
          <FormControl fullWidth>
          <InputLabel 
            shrink 
            style={{ transform: 'translate(0, -14px) scale(0.75)' }}
          >
            Régió
          </InputLabel>
            <Select
              name="regio"
              value={formData.regio}
              onChange={handleChange}
              label="Régió"
            >
              <MenuItem value="">
                <em>Nincs kiválasztva</em>
              </MenuItem>
              {regioOptions.map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <FormControl fullWidth>
            <InputLabel shrink 
            style={{ transform: 'translate(0, -14px) scale(0.75)' }}
            >
              Anyagi helyzet</InputLabel>
            <Select
              name="anyagi"
              value={formData.anyagi}
              onChange={handleChange}
              label="Anyagi helyzet"
            >
              <MenuItem value="">
                <em>Nincs kiválasztva</em>
              </MenuItem>
              {anyagiOptions.map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <TextField
            fullWidth
            label="Email"
            value={userData?.email || ''}
            InputProps={{ readOnly: true }}
            InputLabelProps={{
              shrink: true,
              style: { transform: 'translate(0, -14px) scale(0.75)' }
            }}
          />
          
          <TextField
            fullWidth
            label="Korcsoport"
            value={userData?.korcsoport || 'Nincs megadva'}
            InputProps={{ readOnly: true }}
            InputLabelProps={{
              shrink: true,
              style: { transform: 'translate(0, -14px) scale(0.75)' }
            }}
          />
          
          <TextField
            fullWidth
            label="Végzettség"
            value={vegzettsegMap[userData?.vegzettseg] || 'Nincs megadva'}
            InputProps={{ readOnly: true }}
            InputLabelProps={{
              shrink: true,
              style: { transform: 'translate(0, -14px) scale(0.75)' }
            }}
          />
          
          <TextField
            fullWidth
            label="Nem"
            value={nemMap[userData?.nem] || 'Nincs megadva'}
            InputProps={{ readOnly: true }}
            InputLabelProps={{
              shrink: true,
              style: { transform: 'translate(0, -14px) scale(0.75)' }
            }}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Mégse</Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained"
          disabled={!formData.name.trim()}
        >
          Mentés
        </Button>
      </DialogActions>
    </Dialog>
  );
};


const Home = ({ onSignOut, onSendData }) => {
  const theme = useTheme();  
  const location = useLocation();
  const userId = location.state?.userId;
  const [credits, setCredits] = useState(0);
  const [vegzettseg, setVegzettseg] = React.useState('');
  const [korcsoport, setKorcsoport] = React.useState(dayjs());
  const [regio, setRegio] = React.useState('');
  const [nem, setNem] = React.useState('');
  const [anyagi, setAnyagi] = React.useState('');
  const [isFormFilled, setIsFormFilled] = useState(false); 
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [name, setName] = useState('');
  const [showUserCreditPage, setShowUserCreditPage] = useState(false);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [userProfileData, setUserProfileData] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
  const [answers, setAnswers] = useState({});

  const [selectedSurvey, setSelectedSurvey] = useState(null);
  const [showSurvey, setShowSurvey] = useState(false);
  const [value, setValue] = useState(0);

  const handleNavigationChange = (event, newValue) => {
    setValue(newValue);
    if (newValue === 0) {
      setShowUserCreditPage(false);
    } else if (newValue === 1) {
      setShowUserCreditPage(true);
    }
  };


  const fetchUserProfile = useCallback(async () => {
    try {
      if (!userId) return;
      
      const response = await fetch(`http://localhost:3001/api/users/profile/${userId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch user profile');
      
      const data = await response.json();
      setUserProfileData(data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setSnackbar({
        open: true,
        message: 'Hiba történt a profil betöltése során',
        severity: 'error'
      });
    }
  }, [userId]);
  
  const handleSaveUserProfile = async (formData) => {
    try {
      if (!userId) return;
      
      if (Object.keys(formData).length === 0) {
        setSnackbar({
          open: true,
          message: 'Nincs módosítandó adat',
          severity: 'info'
        });
        setProfileDialogOpen(false);
        return;
      }
      
      const response = await fetch(`http://localhost:3001/api/users/profile/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) throw new Error('Failed to update user profile');
      
      await response.json();
      
      setSnackbar({
        open: true,
        message: 'Profil sikeresen frissítve',
        severity: 'success'
      });
      
      setProfileDialogOpen(false);
      fetchUserProfile();
      
      if (formData.name) {
        setName(formData.name);
      }
    } catch (error) {
      console.error('Error updating user profile:', error);
      setSnackbar({
        open: true,
        message: 'Hiba történt a profil mentése során',
        severity: 'error'
      });
    }
  };
  
  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);
  
  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar(prev => ({...prev, open: false}));
  };




  const fetchCredits = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/users/credits/${userId}`);
      const data = await response.json();
      setCredits(data.credits);
    } catch (error) {
      console.error('Error fetching credits:', error);
    }
  }, [userId]);
    

    useEffect(() => {
      fetchCredits();
    }, [userId, fetchCredits]);


  const handleCreditPurchase = (newCredits) => {
    setCredits(newCredits);
    fetchCredits()
  };


  const handleAnswerChange = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };


  const handleCloseSurvey = () => {
    setShowSurvey(false);
    setSelectedSurvey(null);
    fetchAvailableSurveys();
  };


  const handleVegzettseg = (event) => {
    setVegzettseg(event.target.value);
  };

  

  const handleKorcsoport = (newValue) => {
    setKorcsoport(newValue);
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



  const sendData = async () => {
    const data = {
      vegzettseg,
      korcsoport,
      regio,
      nem,
      anyagi,
    };

    try {
      const response = await fetch('http://localhost:3001/api/main/home', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(data)
      });
  
      if (response.ok) {
        setIsFormFilled(true);
        window.location.reload();
      }
    } catch (error) {
      console.error('Error sending data:', error);
    }
  };



const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };



  const [anchorEl, setAnchorEl] = React.useState(null);
  const openprofile = Boolean(anchorEl);
  const handleClickProfile = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseProfile = () => {
    setAnchorEl(null);
  };

  const [isCalendarOpen, setIsCalendarOpen] = useState(false);



  
  console.log(location);
  


  const [availableSurveys, setAvailableSurveys] = useState([]);


  const handleSubmitSurvey = async () => {
    try {
      if (!selectedSurvey || !selectedSurvey.id) {
        console.error('Selected survey is missing or invalid');
        return;
      }
  
      const surveyId = selectedSurvey.id;
      console.log('Submitting survey with ID:', surveyId);
      console.log('Selected survey data:', selectedSurvey);
  
      const creditAmount = Math.floor(selectedSurvey.creditCost / 3);
      console.log('Credit amount calculated:', creditAmount);
  
      const response = await fetch('http://localhost:3001/api/main/submit-survey', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          surveyId: surveyId,
          answers: Object.entries(answers).map(([questionId, value]) => ({
            questionId,
            value
          }))
        })
      });
  
      if (response.ok) {
        const transactionResponse = await fetch('http://localhost:3001/api/users/add-survey-transaction', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            userId: userId,
            amount: creditAmount,
            title: selectedSurvey.title,
            surveyId: surveyId
          })
        });
  
        if (!transactionResponse.ok) {
          throw new Error('Transaction failed');
        }
  
        await fetchCredits();
        handleCloseSurvey();
      }
    } catch (error) {
      console.error('Error submitting survey:', error);
    }
  };

  useEffect(() => {
    const checkIfSignedIn = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        setIsSignedIn(true);
        const response = await fetch('http://localhost:3001/api/main/check-form-filled', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const result = await response.json();
        if (result.isFormFilled) {
          setIsFormFilled(true);
        }
      }
    };
    checkIfSignedIn();
  }, []);




  const fetchAvailableSurveys = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/main/available-surveys', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      console.log('Fetched surveys:', data);
      console.log('Available survey IDs:', data.surveys ? data.surveys.map(s => s.id) : []);
      setAvailableSurveys(data.surveys || []);
    } catch (error) {
      console.error('Error fetching available surveys:', error);
      setAvailableSurveys([]);
    }
  };
  
  useEffect(() => {
    fetchAvailableSurveys();
  }, []);




  const handleSurveyClick = async (surveyId) => {
    try {
      console.log('Clicked on survey ID:', surveyId);
      
      const surveyInfo = availableSurveys.find(s => s.id === surveyId);
      console.log('Survey info from available surveys:', surveyInfo);
      
      if (!surveyInfo) {
        console.error('Survey not found in available surveys:', surveyId);
        return;
      }
  
      const response = await fetch(`http://localhost:3001/api/main/survey/${surveyId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const surveyData = await response.json();
      console.log('Survey data from API:', surveyData);
  
      const questions = Array.isArray(surveyData) ? surveyData : [];
      
      setSelectedSurvey({
        id: surveyId,
        title: surveyInfo.title,
        creditCost: surveyInfo.credit_cost,
        question: questions.map(q => ({
          ...q,
          survey_id: surveyId
        }))
      });
  
      setShowSurvey(true);
    } catch (error) {
      console.error('Error opening survey:', error);
    }
  };


  




  useEffect(() => {
    if (location.state) {
      setName(location.state.userName);
    }
  }, [location]);

  if (isSignedIn) {
    if (isFormFilled) {
  return (

    <ThemeProvider theme={theme}>
    <AppTheme {...onSendData}>
      <UserContainer direction="column" justifyContent="space-between">
      <React.Fragment>

      <Box 
  sx={{ 
    width: '100%', 
    mb: 4,
    mt: { xs: 6, sm: 0 }, 
    px: { xs: 1, sm: 2, md: 3 },
    position: 'relative',
    display: 'flex',
    flexDirection: { xs: 'column', md: 'row' },
    alignItems: 'center',
    justifyContent: 'space-between'
  }}
>
  <Typography
    component="h1"
    variant="h4"
    sx={{
      cursor: 'pointer',
      fontSize: { xs: '1.1rem', sm: '1.3rem', md: '1.6rem' },
      order: { xs: 2, md: 1 },
      mt: { xs: 2, md: -1 },
      position: 'relative',
      zIndex: 5,
      width: { xs: '100%', md: '25%' }, 
      textAlign: { xs: 'center', md: 'left' },
      pl: { md: 20 },
    }}
    onClick={() => {
      setShowUserCreditPage(true);
      setShowSurvey(false);
    }}
  >
    {credits} Kredit
  </Typography>
  
  <Typography
    component="h1"
    variant="h6"
    sx={{
      textAlign: 'center',
      fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' },
      order: { xs: 1, md: 2 },
      width: { xs: '100%', md: '50%' },
      mt: { xs: 1, md: 0 },
      mb: { xs: 1, md: 0 },
      whiteSpace: 'nowrap',
      zIndex: 4
    }}
  >
    Köszöntjük az oldalon, {name}!
  </Typography>

  <Box sx={{
    display: 'flex',
    gap: { xs: 2, sm: 3, md: 5 },
    order: { xs: 3, md: 3 },
    mt: { xs: 2, md: 0 },
    width: { xs: '100%', md: '25%' },
    justifyContent: { xs: 'center', md: 'flex-end' }
  }}>
    <ColorModeSelect sx={{ 
      display: 'flex',
      alignItems: 'center'
    }} />
    <Tooltip title="Account settings">
      <IconButton
        onClick={handleClickProfile}
        size="small"
        sx={{
          padding: 0,
          width: 40,
          height: 40,
          borderRadius: '50%',
          overflow: 'hidden',
        }}
        aria-controls={openprofile ? 'account-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={openprofile ? 'true' : undefined}
      >
        <Avatar sx={{ width: 40, height: 40 }} src="/static/images/avatar/2.jpg" />
      </IconButton>
    </Tooltip>
  </Box>
</Box>

      <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
  <SimpleBottomNavigation 
    value={value}
    onChange={handleNavigationChange}
    sx={{
      mt: 2,
      mb: 2,
      backgroundColor: theme.palette.background.default,
      boxShadow: theme.shadows[1],
      width: '18%',
      margin: '0 auto',
      position: 'fixed',
      top: '80px',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 1000
    }}
  />
</Box>

      {!showUserCreditPage && !showSurvey && (
          <Card
            variant="outlined"
            sx={{
              mt: 3,
              width: "95% !important",
              height: "70vh",
              maxWidth: "700px !important",
              position: "relative",
              padding: "20px",
              overflow: "auto",
              '& .MuiButton-root': {
              minHeight: '80px',
              height: '80px !important',
              flexShrink: 0
              }
            }}
          >
            <Typography variant="h4" sx={{ mt: 1, ml: 2, mb: 3 }}>
              Elérhető kérdőívek ({availableSurveys.length})
            </Typography>
            
            {availableSurveys.map((survey) => (
              <Button
                key={survey.id}
                onClick={() => handleSurveyClick(survey.id)}
                sx={{
                  height: "80px !important",
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
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Typography sx={{ fontSize: '1rem' }}>+</Typography>
                  <span style={{ fontSize: '1rem' }}>{Math.floor(survey.credit_cost / 3)}</span>
                </Box>
                <Typography variant="caption" sx={{ mt: -0.5 }}>
                  Kredit
                </Typography>
              </Box>
              </Button>
            ))}
          </Card>
        )}


        {showSurvey && selectedSurvey && (
          <Card
            variant="outlined"
            sx={{
              mt: 3, 
              width: "95% !important",
              height: "70vh !important",
              maxWidth: "700px !important",
              position: "relative",
              padding: "20px",
              overflow: "auto"
            }}
          >
            <Typography 
              variant="h4" 
              sx={{ 
                mt: 1, 
                ml: 2,
                fontWeight: 'bold',
                borderBottom: '2px solid',
                pb: 2,
                mb: 3
              }}
            >
              {selectedSurvey.title}
            </Typography>


            {selectedSurvey.question && selectedSurvey.question.map((question, index) => (
              <Container
                key={index}
                sx={{
                  padding: "16px",
                  borderRadius: "16px",
                  backgroundColor: (theme) =>
                    theme.palette.mode === "light"
                      ? theme.palette.background.paper
                      : "#1B2430",
                  height: "auto",
                  width: "98%",
                  position: "relative",
                  mt: 2
                }}
              >
                <Box sx={{ mb: 4, ml: 2 }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    {question.question}
                  </Typography>

                  {question.type === "radio" && (
                    <RadioGroup
                    value={answers[question.id] || ''}
                    onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                    >
                      {JSON.parse(question.frm_option).map((option, optIndex) => (
                        <FormControlLabel
                          key={optIndex}
                          value={option.label}
                          control={<Radio />}
                          label={option.label}
                        />
                      ))}
                    </RadioGroup>
                  )}

                  {question.type === "checkbox" && (
                    <FormGroup>
                      {JSON.parse(question.frm_option).map((option, optIndex) => (
                        <FormControlLabel
                          key={optIndex}
                          control={
                            <Checkbox 
                              checked={answers[question.id]?.includes(option.label) || false}
                              onChange={(e) => {
                                const currentAnswers = answers[question.id] || [];
                                const newAnswers = e.target.checked 
                                  ? [...currentAnswers, option.label]
                                  : currentAnswers.filter(value => value !== option.label);
                                handleAnswerChange(question.id, newAnswers);
                              }}
                            />
                          }
                          label={option.label}
                        />
                      ))}
                    </FormGroup>
                  )}

                  {question.type === "text" && (
                    <TextField
                      value={answers[question.id] || ''}
                      onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                      fullWidth
                      placeholder="Írja ide válaszát..."
                      multiline
                      sx={{ mt: 1 }}
                    />
                  )}
                </Box>
              </Container>
            ))}

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 2, mb: 2 }}>
              <Button
                onClick={handleCloseSurvey}
                variant="outlined"
              >
                Vissza a kérdőívekhez
              </Button>
              <Button
                onClick={handleSubmitSurvey}
                variant="contained"
                color="primary"
              >
                Küldés
              </Button>
            </Box>
          </Card>
        )}
        

        {!showSurvey && showUserCreditPage && (
          <UserKredit 
            onClose={() => setShowUserCreditPage(false)}
            currentCredits={credits}
            onPurchase={handleCreditPurchase}
            userId={userId}
          />
        )}

        <CssBaseline enableColorScheme />

        <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={openprofile}
        onClose={handleCloseProfile}
        onClick={handleCloseProfile}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5,
              '& .MuiAvatar-root': {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              '&::before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={() => {
          handleCloseProfile();
          setProfileDialogOpen(true);
        }}>
          <Avatar /> Profil
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleClickOpen}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>


      <ProfileDialog 
        open={profileDialogOpen}
        onClose={() => setProfileDialogOpen(false)}
        userData={userProfileData}
        onSave={handleSaveUserProfile}
      />

      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleSnackbarClose}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={snackbar.severity} 
          sx={{ 
            width: '100%',
            opacity: 0.9,
            color: 'white',
            '& .MuiAlert-icon': {
              color: 'white'
            },
            '& .MuiAlert-message': {
              color: 'white'
            },
            '& .MuiAlert-action': {
              padding: 0,
              color: 'white',
              '& .MuiButtonBase-root': {
                color: 'white',
                padding: '4px',
                bgcolor: 'transparent',
                border: 'none',
                boxShadow: 'none',
                '&:hover': {
                  bgcolor: 'transparent'
                }
              }
            },
            '&.MuiAlert-standardSuccess': {
              backgroundColor: 'rgba(46, 125, 50, 0.95)'
            },
            '&.MuiAlert-standardError': {
              backgroundColor: 'rgba(211, 47, 47, 0.95)'
            }
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
      
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"Kijelentkezés"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Biztosan ki szeretne jelentkezni?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Nem</Button>
          <Button onClick={onSignOut}>Igen</Button>
        </DialogActions>
      </Dialog>

      </React.Fragment>
    </UserContainer>
    </AppTheme>
    </ThemeProvider>
    )} else{ 
      return(
        <AppTheme {...onSendData}>
          <UserContainer direction="column" justifyContent="space-between">
            <React.Fragment>

            <CssBaseline enableColorScheme />

            <Box 
  sx={{ 
    width: '100%', 
    mb: 4,
    mt: { xs: 6, sm: 0 }, 
    px: { xs: 1, sm: 2, md: 3 },
    position: 'relative',
    display: 'flex',
    flexDirection: { xs: 'column', sm: 'row' },
    alignItems: 'center',
    justifyContent: 'space-between'
  }}
>
<Typography
  component="h1"
  variant="h4"
  sx={{
    visibility: 'hidden',
    fontSize: { xs: '1.1rem', sm: '1.3rem', md: '1.6rem' },
    order: { xs: 2, sm: 1 },
    mt: { xs: 2, sm: -2 },
    ml: { sm: 12, md: 18 },
    position: 'relative',
    zIndex: 5,
    width: { sm: '25%' },
    textAlign: { sm: 'left' }
  }}
>
  &nbsp;
</Typography>

  <Typography
    component="h1"
    variant="h6"
    sx={{
      textAlign: 'center',
      fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' },
      order: { xs: 1, sm: 2 },
      position: { sm: 'absolute' },
      left: { sm: '50%' },
      transform: { sm: 'translateX(-50%)' },
      width: { xs: '100%', sm: 'auto' },
      mt: { xs: 2, sm: -1 },
      whiteSpace: 'nowrap',
      zIndex: 4
    }}
  >
    Köszöntjük az oldalon, {name}!
  </Typography>
  
  <Box sx={{
    display: 'flex',
    gap: { xs: 2, sm: 3, md: 5 },
    order: { xs: 3, sm: 3 },
    mt: { xs: 0, sm: 0 },
    position: 'relative',
    right: { xs: 0, sm: -10, md: -20 },
    width: { sm: '25%' },
    justifyContent: 'flex-end'
  }}>
    <ColorModeSelect sx={{ 
      display: 'flex',
      alignItems: 'center'
    }} />
    <Tooltip title="Account settings">
      <IconButton
        onClick={handleClickProfile}
        size="small"
        sx={{
          padding: 0,
          width: 40,
          height: 40,
          borderRadius: '50%',
          overflow: 'hidden',
        }}
        aria-controls={openprofile ? 'account-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={openprofile ? 'true' : undefined}
      >
        <Avatar sx={{ width: 40, height: 40 }} src="/static/images/avatar/2.jpg" />
      </IconButton>
    </Tooltip>
  </Box>
</Box>
            
            <Card variant="outlined" sx={{ 
              width: { xs: '95%', sm: '600px' },
              maxWidth: '600px',
              mx: 'auto',
              mt: { xs: 0, sm: 2 }
            }}>
      
            <FormControl sx={{ m: 1, minWidth: 240 }}>
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
    <MenuItem value={2}>Középfokú végzettség érettségi nélkül, szakmai végzettséggel</MenuItem>
    <MenuItem value={3}>Középfokú végzettség érettségivel (szakmai végzettség nélkül)</MenuItem>
    <MenuItem value={4}>Középfokú végzettség érettségivel (szakmai végzettségel)</MenuItem>
    <MenuItem value={5}>Általános iskola 8. osztálya</MenuItem>
    <MenuItem value={6}>8 általános iskolánál kevesebb</MenuItem>
  </Select>
</FormControl>

<LocalizationProvider dateAdapter={AdapterDayjs}>
  <DatePicker 
    label="Születési dátum"
    value={korcsoport}
    onChange={handleKorcsoport}
    open={isCalendarOpen}
    onOpen={() => setIsCalendarOpen(true)}
    onClose={() => setIsCalendarOpen(false)}
    slotProps={{
      textField: {
        onClick: () => setIsCalendarOpen(true),
        sx: {
          width: '100%',
          '& .MuiInputBase-root': {
            fontSize: '1.2rem',
            padding: '10px',
            height: '60px',
            cursor: 'pointer'
          },
          '& .MuiInputLabel-root': {
            fontSize: '1.2rem',
            fontWeight: 'bold',
            lineHeight: '1.5'
          },
          '& .MuiInputAdornment-root': {
            marginRight: '8px'
          }
        }
      },
      popper: {
        sx: { zIndex: 1300 }
      }
    }}
  />
</LocalizationProvider>


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
          <MenuItem value={18}>Észak-Alföld</MenuItem>
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

      <Button
              type="submit"
              fullWidth
              variant="contained"
              onClick={sendData}
            >
              Küldés
      </Button>
    </Card>
  

        <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={openprofile}
        onClose={handleCloseProfile}
        onClick={handleCloseProfile}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5,
              '& .MuiAvatar-root': {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              '&::before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={() => {
          handleCloseProfile();
          setProfileDialogOpen(true);
        }}>
          <Avatar /> Profil
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleClickOpen}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>

      <ProfileDialog 
      open={profileDialogOpen}
      onClose={() => setProfileDialogOpen(false)}
      userData={userProfileData}
      onSave={handleSaveUserProfile}
    />

    <Snackbar 
      open={snackbar.open} 
      autoHideDuration={6000} 
      onClose={handleSnackbarClose}
    >
      
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"Kijelentkezés"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Biztosan ki szeretne jelentkezni?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Nem</Button>
          <Button onClick={onSignOut}>Igen</Button>
        </DialogActions>
      </Dialog>
      <Alert 
        onClose={handleSnackbarClose} 
        severity={snackbar.severity} 
        sx={{ 
          width: '100%',
          opacity: 0.9,
          color: 'white',
          '& .MuiAlert-icon': {
            color: 'white'
          },
          '& .MuiAlert-message': {
            color: 'white'
          },
          '& .MuiAlert-action': {
            padding: 0,
            color: 'white',
            '& .MuiButtonBase-root': {
              color: 'white',
              padding: '4px',
              bgcolor: 'transparent',
              border: 'none',
              boxShadow: 'none',
              '&:hover': {
                bgcolor: 'transparent'
              }
            }
          },
          '&.MuiAlert-standardSuccess': {
            backgroundColor: 'rgba(46, 125, 50, 0.95)'
          },
          '&.MuiAlert-standardError': {
            backgroundColor: 'rgba(211, 47, 47, 0.95)'
          }
        }}
      >
        {snackbar.message}
      </Alert>
    </Snackbar>
  </React.Fragment>
  </UserContainer>
</AppTheme>
  );
  }
}
};

export default Home;