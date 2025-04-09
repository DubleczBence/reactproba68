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
import { useTheme, ThemeProvider } from '@mui/material/styles';
import { Snackbar, Alert } from '@mui/material';
import { get, post } from './services/apiService';
import { useMediaQuery } from '@mui/material';
import { useSpring, animated } from 'react-spring';
import CircularProgress from '@mui/material/CircularProgress';
import Backdrop from '@mui/material/Backdrop';
import { voucherOptions } from './userKredit';



const SimpleBottomNavigation = ({ value, onChange }) => {

  return (
    <BottomNavigation
      showLabels
      value={value}
      onChange={onChange}
      sx={{
        mt: 2, 
        mb: 3,
        backgroundColor: 'transparent',
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
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(8),
  overflow: 'auto !important',
  maxHeight: '70vh',
  backgroundColor: theme.palette.mode === 'light' 
    ? 'rgba(255, 255, 255, 0.55) !important'
    : 'rgba(0, 0, 5, 0.55) !important',
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  [theme.breakpoints.up('sm')]: {
    width: '700px',
    marginBottom: theme.spacing(10),
    },
  ...theme.applyStyles('dark', {
    boxShadow:
      'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
      backgroundColor: 'rgba(18, 18, 18, 0.4)',
  }),
  animation: 'fadeIn 0.5s ease-out',
  '@keyframes fadeIn': {
    '0%': {
      opacity: 0,
      transform: 'translateY(10px)',
    },
    '100%': {
      opacity: 1,
      transform: 'translateY(0)',
    },
  },
}));


const UserContainer = styled(Stack)(({ theme }) => ({
  height: '100vh',
  width: '100%',
  padding: theme.spacing(2),
  overflowY: 'auto !important',
  overflowX: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  paddingBottom: theme.spacing(12),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(4),
    paddingBottom: theme.spacing(16), 
  },
  '&::before': {
    content: '""',
    position: 'fixed',
    inset: 0,
    backgroundColor: theme.palette.mode === 'light'
      ? 'rgba(255, 255, 255, 0.2)'
      : 'rgba(0, 0, 0, 0.2)',
    zIndex: -1,
    pointerEvents: 'none',
  }
}));


const IllustrationContainer = styled(Box)(({ theme }) => ({
  display: 'none', // Mobilon elrejtjük
  [theme.breakpoints.up('md')]: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '50%',
    height: '100%',
    position: 'absolute',
    right: '-5%',
    top: 0,
    zIndex: 0,
    pointerEvents: 'none',
  },
  '& img': {
    transition: 'opacity 0.5s ease, transform 0.5s ease',
    opacity: 0,
    transform: 'translateY(20px)',
    animation: 'fadeInUp 0.7s forwards',
  },
  '@keyframes fadeInUp': {
    '0%': {
      opacity: 0,
      transform: 'translateY(20px)',
    },
    '100%': {
      opacity: 0.9,
      transform: 'translateY(0)',
    },
  },
}));


const TextCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const messages = [
    {
      title: "Jutalmazzuk a véleményedet.",
      subtitle: "Töltsd ki a kérdőíveket, gyűjts pontokat, és váltsd be értékes ajándékokra."
    },
    {
      title: "Követheted egyenleged.",
      subtitle: "Nézd meg mennyi kreditet gyűjtöttél és mire tudod beváltani őket."
    },
    {
      title: "Személyre szabott élmény.",
      subtitle: "Állítsd be profilodat és kapj neked szóló kérdőíveket."
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % messages.length);
    }, 14000);
    
    return () => clearInterval(interval);
  }, [messages.length]);

  const [textProps, api] = useSpring(() => ({
    opacity: 1,
    transform: 'translateY(0)',
    from: { opacity: 0, transform: 'translateY(20px)' },
    config: { duration: 800 }
  }));

  useEffect(() => {
    api.start({
      opacity: 1,
      transform: 'translateY(0)',
      from: { opacity: 0, transform: 'translateY(20px)' },
      reset: true
    });
  }, [activeIndex]);

  return (
    <Box>
      <animated.div style={textProps}>
        <Typography 
          variant="h3" 
          component="h2" 
          sx={{ 
            fontWeight: 'bold',
            mb: 2,
            fontSize: { md: '1.8rem', lg: '2.2rem', xl: '2.5rem' },
            color: theme => theme.palette.mode === 'light' ? '#003092' : 'inherit',
            wordWrap: 'break-word',
            hyphens: 'auto'
          }}
        >
          {messages[activeIndex].title}
        </Typography>
        <Typography variant="h6" sx={{ 
            mt: 3,
            fontSize: { md: '0.85rem', lg: '0.95rem', xl: '1.1rem' },
            color: theme => theme.palette.mode === 'light' ? '#003092' : 'inherit',
            wordWrap: 'break-word',
            hyphens: 'auto'
          }}>
          {messages[activeIndex].subtitle}
        </Typography>
      </animated.div>

      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        mt: 3, 
        gap: 1 
      }}>
        {messages.map((_, index) => (
          <Box
            key={index}
            component="span"
            onClick={() => setActiveIndex(index)}
            sx={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              backgroundColor: activeIndex === index 
                ? theme => theme.palette.mode === 'light' ? '#003092' : '#90caf9'
                : theme => theme.palette.mode === 'light' ? 'rgba(0, 48, 146, 0.3)' : 'rgba(144, 202, 249, 0.3)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              transform: activeIndex === index ? 'scale(1.3)' : 'scale(1)',
            }}
          />
        ))}
      </Box>
    </Box>
  );
};



const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});



const ProfileDialog = ({ open, onClose, userData, onSave, userVouchers }) => {
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
              style: { transform: 'translate(0, -17px) scale(0.75)' }
            }}
          />
          
          <FormControl fullWidth>
          <InputLabel 
            shrink 
            style={{ transform: 'translate(0, -17px) scale(0.75)' }}
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
            style={{ transform: 'translate(0, -17px) scale(0.75)' }}
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
              style: { transform: 'translate(0, -17px) scale(0.75)' }
            }}
          />
          
          <TextField
            fullWidth
            label="Korcsoport"
            value={userData?.korcsoport || 'Nincs megadva'}
            InputProps={{ readOnly: true }}
            InputLabelProps={{
              shrink: true,
              style: { transform: 'translate(0, -17px) scale(0.75)' }
            }}
          />
          
          <TextField
            fullWidth
            label="Végzettség"
            value={vegzettsegMap[userData?.vegzettseg] || 'Nincs megadva'}
            InputProps={{ readOnly: true }}
            InputLabelProps={{
              shrink: true,
              style: { transform: 'translate(0, -17px) scale(0.75)' }
            }}
          />
          
          <TextField
            fullWidth
            label="Nem"
            value={nemMap[userData?.nem] || 'Nincs megadva'}
            InputProps={{ readOnly: true }}
            InputLabelProps={{
              shrink: true,
              style: { transform: 'translate(0, -17px) scale(0.75)' }
            }}
          />
          
          {userVouchers && userVouchers.length > 0 && (
            <Box>
            <Typography variant="h6" sx={{ mb: 2 }}>Vásárolt kuponok</Typography>
            <Box sx={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: 2,
              justifyContent: 'flex-start'
            }}>
              {userVouchers.map((voucher) => {
                let imageName = 'default.png';
                
                voucherOptions.forEach(category => {
                  category.items.forEach(item => {
                    if (item.name === voucher.name || 
                        voucher.name.includes(item.name) || 
                        item.name.includes(voucher.name)) {
                      imageName = item.image;
                    }
                  });
                });
                
                return (
                  <Box 
                    key={voucher.id} 
                    sx={{ 
                      width: '80px', 
                      height: '80px', 
                      borderRadius: '8px',
                      overflow: 'hidden',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                      position: 'relative'
                    }}
                  >
                    <img 
                      src={`/kepek/${imageName}`} 
                      alt={voucher.name}
                      style={{ 
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'cover' 
                      }}
                    />
                    <Tooltip title={`${voucher.name} - ${voucher.credit_cost} kredit`}>
                      <Box sx={{ 
                        position: 'absolute', 
                        bottom: 0, 
                        left: 0, 
                        right: 0,
                        backgroundColor: 'rgba(0,0,0,0.6)',
                        color: 'white',
                        padding: '4px',
                        fontSize: '10px',
                        textAlign: 'center',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        {voucher.name}
                      </Box>
                    </Tooltip>
                  </Box>
                );
              })}
            </Box>
          </Box>
          )}
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
  const isUnder1400 = useMediaQuery('(max-width:1400px)');
  const [submittingSurvey, setSubmittingSurvey] = useState(false);

  const [confirmPurchaseOpen, setConfirmPurchaseOpen] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);
  const [userVouchers, setUserVouchers] = useState([]);
  
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

  const fetchCreditHistory = useCallback(async () => {
    try {
      if (!userId) return;
      
      console.log('Refreshing credit history for user:', userId);
      await get(`/users/credit-history/${userId}`);
    console.log('Credit history refreshed');
  } catch (error) {
    console.error('Error fetching credit history:', error);
  }
}, [userId]);


  const fetchUserProfile = useCallback(async () => {
    try {
      if (!userId) return;
      
      const response = await fetch(`https://optify.onrender.com/api/users/profile/${userId}`, {
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

  const handleVoucherSelect = (voucher) => {
    setSelectedVoucher(voucher);
    setConfirmPurchaseOpen(true);
  };

  const confirmVoucherPurchase = async () => {
    if (!selectedVoucher) return;
    
    try {
      const response = await post('/users/purchase-voucher', {
        userId: userId,
        voucherName: selectedVoucher.name,
        creditCost: selectedVoucher.creditCost
      });
      
      if (response.message && response.message.includes('success')) {
        setCredits(response.currentCredits || credits);
        fetchCredits();
        
        setPurchaseSuccess(true);
        fetchUserVouchers();
        
        setConfirmPurchaseOpen(false);
        
        setTimeout(() => {
          setPurchaseSuccess(false);
        }, 5000);
        
        setSnackbar({
          open: true,
          message: 'Sikeres kupon vásárlás! A kuponjait a profil menüben tekintheti meg.',
          severity: 'success'
        });
      } else {
        throw new Error(response.message || 'Sikertelen vásárlás');
      }
    } catch (error) {
      console.error('Error purchasing voucher:', error);
      setSnackbar({
        open: true,
        message: 'Hiba történt a kupon vásárlása során: ' + (error.message || 'Ismeretlen hiba'),
        severity: 'error'
      });
      setConfirmPurchaseOpen(false);
    }
  };

  const fetchUserVouchers = useCallback(async () => {
    try {
      if (!userId) return;
      
      const data = await get(`/users/vouchers/${userId}`);
      setUserVouchers(data.vouchers || []);
    } catch (error) {
      console.error('Error fetching user vouchers:', error);
    }
  }, [userId]);

  useEffect(() => {
    fetchUserVouchers();
  }, [fetchUserVouchers]);
  
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
      
      const response = await fetch(`https://optify.onrender.com/api/users/profile/${userId}`, {
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
      const data = await get(`/users/credits/${userId}`);
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
    if (!vegzettseg || !korcsoport || !regio || !nem || !anyagi) {
      alert('Kérjük, töltsön ki minden mezőt!');
      return;
    }
  
    const formattedData = {
      vegzettseg,
      korcsoport: korcsoport.format('YYYY-MM-DD'),
      regio,
      nem,
      anyagi,
      userId: userId
    };
  
    try {
      console.log('Sending data:', formattedData);
      await post('/main/home', formattedData);
      setIsFormFilled(true);
      window.location.reload();
    } catch (error) {
      console.error('Error sending data:', error);
      setSnackbar({
        open: true,
        message: 'Hiba történt az adatok küldése során. Kérjük, próbálja újra!',
        severity: 'error'
      });
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

  const isAllQuestionsAnswered = () => {
    if (!selectedSurvey || !selectedSurvey.question) return false;

    return selectedSurvey.question.every(question => {
      if (answers[question.id]) {
        if (question.type === "checkbox") {
          return Array.isArray(answers[question.id]) && answers[question.id].length > 0;
        }
        if (question.type === "text") {
          return answers[question.id].trim() !== '';
        }
        return true;
      }
      return false;
    });
  };


  const handleSubmitSurvey = async () => {
    try {
      if (!selectedSurvey || !selectedSurvey.id) {
        console.error('Selected survey is missing or invalid');
        return;
      }

      if (!isAllQuestionsAnswered()) {
        setSnackbar({
          open: true,
          message: 'Kérjük, válaszoljon minden kérdésre a küldés előtt!',
          severity: 'warning'
        });
        return;
      }

      setSubmittingSurvey(true);
    
      const surveyId = selectedSurvey.id;
      console.log('Submitting survey with ID:', surveyId);
      console.log('Selected survey data:', selectedSurvey);
    
      const creditAmount = Math.floor(selectedSurvey.creditCost / 3);
      console.log('Credit amount calculated:', creditAmount);

      const delayPromise = new Promise(resolve => setTimeout(resolve, 1500));
    
      const postPromise = post('/main/submit-survey', {
        surveyId: surveyId,
        answers: Object.entries(answers).map(([questionId, value]) => ({
          questionId,
          value
        }))
      });

      await Promise.all([postPromise, delayPromise]);
    
      await fetchCredits();
      await fetchCreditHistory();
      
      setSubmittingSurvey(false);
      handleCloseSurvey();
    } catch (error) {
      console.error('Error submitting survey:', error);
      setSubmittingSurvey(false);
    }
  };

  useEffect(() => {
    const checkIfSignedIn = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        setIsSignedIn(true);
        const response = await fetch('https://optify.onrender.com/api/main/check-form-filled', {
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
      const data = await get('/main/available-surveys');
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
    
      const surveyData = await get(`/main/survey/${surveyId}`);
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
      <Backdrop
          sx={{
            color: '#fff',
            zIndex: (theme) => theme.zIndex.drawer + 1,
            backgroundColor: 'rgba(0, 0, 0, 0.7)'
          }}
          open={submittingSurvey}
        >
          <CircularProgress color="primary" size={40} thickness={4} />
        </Backdrop>
      <React.Fragment>

      <IllustrationContainer>
        <img 
          key={showUserCreditPage ? "userCredit" : "userSurvey"}
          src={showUserCreditPage ? "/kepek/illustration-kitolto_kredit.png" : "/kepek/illustration-kitolto_kerdoiv.png"} 
          alt={showUserCreditPage ? "Kredit Illusztráció" : "Kérdőív Illusztráció"} 
          style={{ 
            maxWidth: '90%', 
            maxHeight: '90%',
            objectFit: 'contain',
            opacity: 0.9
          }} 
        />
      </IllustrationContainer>

      <Box sx={{ 
  position: 'absolute',
  left: { md: '4%', lg: '6%' },
  top: '35%',
  zIndex: 1,
  width: { md: '25%', lg: '20%' },
  maxWidth: '360px',
  display: (showUserCreditPage || isUnder1400) ? 'none' : { xs: 'none', md: 'block' },
  ml: { md: 0, lg: 2 },
  animation: 'fadeIn 0.7s forwards',
  opacity: 0,
  '@keyframes fadeIn': {
    '0%': {
      opacity: 0,
      transform: 'translateX(-20px)',
    },
    '100%': {
      opacity: 1,
      transform: 'translateX(0)',
    },
  },
}}>
  <TextCarousel />
</Box>

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
      color: theme => theme.palette.mode === 'light' ? '#003092' : 'inherit',
    }}
    onClick={() => {
      setShowUserCreditPage(true);
      setShowSurvey(false);
      setValue(1);
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
      zIndex: 4,
      color: theme => theme.palette.mode === 'light' ? '#003092' : 'inherit',
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

      <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', marginTop: { xs: 0.5, sm: 1 }, marginBottom: { xs: 0.5, sm: 1 }}}>
  <SimpleBottomNavigation 
    value={value}
    onChange={handleNavigationChange}
    sx={{
      backgroundColor: 'transparent',
      boxShadow: theme.shadows[1],
      width: { xs: '50%', sm: '18%' },
      margin: '0 auto',
      position: 'relative',
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
                mt: { xs: 2, sm: 2 },
                mb: { xs: 8, sm: 10 },
                width: "95% !important",
                height: { xs: "60vh", sm: "70vh" },
                minHeight: { xs: "60vh", sm: "70vh" },
                maxWidth: "700px !important",
                position: "relative",
                padding: "20px",
                overflow: "auto !important",
                overflowY: "scroll !important",
                WebkitOverflowScrolling: "touch",
                msOverflowStyle: "-ms-autohiding-scrollbar",
                '& .MuiButton-root': {
                  minHeight: '80px',
                  height: '80px !important',
                  flexShrink: 0
                },

                '&::-webkit-scrollbar': {
                  width: '8px',
                },
                '&::-webkit-scrollbar-track': {
                  background: 'rgba(0,0,0,0.1)',
                },
                '&::-webkit-scrollbar-thumb': {
                  background: 'rgba(0,0,0,0.2)',
                  borderRadius: '4px',
                }
                }}
            >
            <Typography variant="h5" sx={{ mt: 1, ml: 2, mb: 3 }}>
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
                  justifyContent: 'space-between',
                  boxShadow: (theme) => theme.palette.mode === 'light'
                  ? '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)'
                  : '0 1px 3px rgba(179, 179, 179, 0.36), 0 1px 2px rgba(179, 179, 179, 0.31)',
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
            mt: { xs: 2, sm: 2 },
            mb: { xs: 2, sm: 2 },
            width: "95% !important",
            height: { xs: "60vh", sm: "70vh" },
            minHeight: { xs: "60vh", sm: "70vh" },
            maxWidth: "700px !important",
            position: "relative",
            padding: "20px",
            overflow: "auto !important",
            overflowY: "scroll !important",
            WebkitOverflowScrolling: "touch",
            msOverflowStyle: "-ms-autohiding-scrollbar",
            '& .MuiButton-root': {
              minHeight: '80px',
              height: '80px !important',
              flexShrink: 0
            },

            '&::-webkit-scrollbar': {
              width: '8px',
            },
            '&::-webkit-scrollbar-track': {
              background: 'rgba(0,0,0,0.1)',
            },
            '&::-webkit-scrollbar-thumb': {
              background: 'rgba(0,0,0,0.2)',
              borderRadius: '4px',
            }
          }}
        >
            <Typography 
              variant="h5" 
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
                  mt: 2,
                  mb: 2,
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

          <Box sx={{ 
                display: 'flex', 
                gap: 2, 
                justifyContent: 'center', 
                mt: 4, 
                mb: 2,
                pt: 2,
                position: 'relative',
                bottom: 0,
                backgroundColor: theme => theme.palette.mode === 'light' 
                  ? 'rgba(255, 255, 255, 0.9)' 
                  : 'rgba(18, 18, 18, 0.9)',
                borderTop: '1px solid',
                borderColor: 'divider',
              }}>
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
                disabled={!isAllQuestionsAnswered() || submittingSurvey}
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
            onVoucherSelect={handleVoucherSelect}
          />
        )}

        <Dialog
          open={confirmPurchaseOpen}
          onClose={() => setConfirmPurchaseOpen(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Kupon vásárlás megerősítése"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Biztosan meg szeretné vásárolni a(z) {selectedVoucher?.name} kupont {selectedVoucher?.creditCost} kreditért?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmPurchaseOpen(false)}>Mégse</Button>
            <Button onClick={confirmVoucherPurchase} autoFocus>
              Vásárlás
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={purchaseSuccess}
          autoHideDuration={5000}
          onClose={() => setPurchaseSuccess(false)}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert 
            onClose={() => setPurchaseSuccess(false)} 
            severity="success" 
            sx={{ width: '100%' }}
          >
            Sikeres vásárlás! A kuponjait a profil menüben tekintheti meg.
          </Alert>
        </Snackbar>

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
          Kijelentkezés
        </MenuItem>
      </Menu>


      <ProfileDialog 
        open={profileDialogOpen}
        onClose={() => setProfileDialogOpen(false)}
        userData={userProfileData}
        onSave={handleSaveUserProfile}
        userVouchers={userVouchers}
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
        TransitionProps={{ 
          appear: true,
          timeout: 300
        }}
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

            <IllustrationContainer>
              <img 
                key={showUserCreditPage ? "userCredit" : "userSurvey"}
                src={showUserCreditPage ? "/kepek/illustration-kitolto_kredit.png" : "/kepek/illustration-kitolto_kerdoiv.png"} 
                alt={showUserCreditPage ? "Kredit Illusztráció" : "Kérdőív Illusztráció"} 
                style={{ 
                  maxWidth: '90%', 
                  maxHeight: '90%',
                  objectFit: 'contain',
                  opacity: 0.9
                }} 
              />
            </IllustrationContainer>

            <Box sx={{ 
              position: 'absolute',
              left: { md: '4%', lg: '6%' },
              top: '35%',
              zIndex: 1,
              width: { md: '25%', lg: '20%' },
              maxWidth: '360px',
              display: (showUserCreditPage || isUnder1400) ? 'none' : { xs: 'none', md: 'block' },
              ml: { md: 0, lg: 2 },
              animation: 'fadeIn 0.7s forwards',
              opacity: 0,
              '@keyframes fadeIn': {
                '0%': {
                  opacity: 0,
                  transform: 'translateX(-20px)',
                },
                '100%': {
                  opacity: 1,
                  transform: 'translateX(0)',
                },
              },
            }}>
              <TextCarousel />
            </Box>

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
      mt: { xs: 4, sm: -1 },
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
              mt: { xs: 0, sm: 10 },
              position: 'relative',
              zIndex: 1
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
          m: 1,
          minWidth: 240,
          width: 'auto',
          '& .MuiInputBase-root': {
            fontSize: '1.2rem',
            padding: '10px',
            height: '60px',
            cursor: 'pointer'
          },
          '& .MuiInputLabel-root': {
            fontSize: '1.2rem',
            fontWeight: 'bold',
            lineHeight: '1.5',
            transform: 'translate(0px, -20px) scale(0.75)',
            '&.Mui-focused, &.MuiFormLabel-filled': {
              transform: 'translate(0px, -20px) scale(0.75)'
            }
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
          Kijelentkezés
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
        TransitionProps={{ 
          appear: true,
          timeout: 300
        }}
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