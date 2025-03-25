import React, { useState, useEffect, useCallback } from 'react';
import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import BarChartIcon from '@mui/icons-material/BarChart';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { useLocation } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import ColorModeSelect from './ColorModeSelect';
import Button from '@mui/material/Button';
import AppTheme from './AppTheme';
import CssBaseline from '@mui/material/CssBaseline';
import { useTheme } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import Badge from '@mui/material/Badge';
import MailIcon from '@mui/icons-material/Mail';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import Logout from '@mui/icons-material/Logout';
import MuiCard from '@mui/material/Card';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CloseIcon from '@mui/icons-material/Close';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';
import ButtonGroup from '@mui/material/ButtonGroup';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import RadioGroup, { useRadioGroup } from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import PropTypes from 'prop-types';
import RemoveIcon from '@mui/icons-material/Remove';
import { v4 as uuidv4 } from 'uuid';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';
import Szuro from './Szuro';
import Mintavetel from './Mintavetel';
import Attekintes from './Attekintes';
import Helyzet from './Helyzet';
import { Snackbar, Alert } from '@mui/material';
import Kredit from './Kredit';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import Statisztika from './Statisztika';
import Stack from '@mui/material/Stack';
import FilterListIcon from '@mui/icons-material/FilterList';
import Popover from '@mui/material/Popover';
import Slider from '@mui/material/Slider';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';



const StyledFormControlLabel = styled((props) => <FormControlLabel {...props} />)(
  ({ theme }) => ({
    variants: [
      {
        props: { checked: true },
        style: {
          '.MuiFormControlLabel-label': {
            color: theme.palette.primary.main,
          },
        },
      },
    ],
  }),
);

function MyFormControlLabel(props) {
  const radioGroup = useRadioGroup();

  let checked = false;

  if (radioGroup) {
    checked = radioGroup.value === props.value;
  }

  return <StyledFormControlLabel checked={checked} {...props} />;
}

MyFormControlLabel.propTypes = {
  value: PropTypes.any,
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
    ? 'rgba(255, 255, 255, 0.8)' // Világos mód - fehér háttér
    : 'rgba(2, 1, 14, 0.8)', // Sötét mód - sötét háttér
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  [theme.breakpoints.up('sm')]: {
    width: '450px',
  },
  ...theme.applyStyles('dark', {
    boxShadow:
      'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
      backgroundColor: 'rgba(18, 18, 18, 0.4)',
  }),
}));




const CompHomeContainer = styled(Stack)(({ theme }) => ({
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
      ? 'rgba(255, 255, 255, 0.3)' // Világos háttér átlátszósággal
      : 'rgba(0, 0, 0, 0.5)', // Sötét háttér átlátszósággal
  zIndex: -1,
}
}));




const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: -3,
    top: 13,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: '0 4px',
  },
}));


const SimpleBottomNavigation = ({ value, onChange }) => {
    const theme = useTheme();

  return (
    <BottomNavigation
      showLabels
      value={value}
      onChange={onChange}
      sx={{
        mt: 2, 
        mb: 2,
        backgroundColor: theme.palette.mode === 'light' 
      ? 'rgba(255, 255, 255, 0.5)' // More transparent in light mode
      : theme.palette.background.default, // Keep original in dark mode 
        boxShadow: theme.shadows[1],
        width: '18%', 
      }}
    >
      <BottomNavigationAction label="Kérdőíveim" icon={<DashboardIcon />} />
      <BottomNavigationAction label="Egyenleg" icon={<AccountBalanceWalletIcon />} />
      <BottomNavigationAction label="Statisztika" icon={<BarChartIcon />} />
    </BottomNavigation>
  );
};


const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ProfileDialog = ({ open, onClose, companyData, onSave }) => {
  const [formData, setFormData] = useState({
    cegnev: '',
    telefon: ''
  });

  useEffect(() => {
    if (companyData) {
      setFormData({
        cegnev: companyData.cegnev || '',
        telefon: companyData.telefon ? companyData.telefon.toString() : ''
      });
    }
  }, [companyData]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    const dataToSave = {};
    if (formData.cegnev.trim() !== '') dataToSave.cegnev = formData.cegnev;
    if (formData.telefon.trim() !== '') dataToSave.telefon = formData.telefon;
    
    onSave(dataToSave);
  };


  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Cég profil</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Módosítható mezők */}
          <TextField
            fullWidth
            label="Cégnév"
            name="cegnev"
            value={formData.cegnev}
            onChange={handleChange}
          />
          
          <TextField
            fullWidth
            label="Telefonszám"
            name="telefon"
            value={formData.telefon}
            onChange={handleChange}
          />
          
          {/* Csak olvasható mezők */}
          <TextField
            fullWidth
            label="Email"
            value={companyData?.ceg_email || ''}
            InputProps={{ readOnly: true }}
          />
          
          <TextField
            fullWidth
            label="Település"
            value={companyData?.telepules || ''}
            InputProps={{ readOnly: true }}
          />
          
          <TextField
            fullWidth
            label="Megye"
            value={companyData?.megye || ''}
            InputProps={{ readOnly: true }}
          />
          
          <TextField
            fullWidth
            label="Céges számla"
            value={companyData?.ceges_szamla || ''}
            InputProps={{ readOnly: true }}
          />
          
          <TextField
            fullWidth
            label="Hitelkártya"
            value={companyData?.hitelkartya || ''}
            InputProps={{ readOnly: true }}
          />
          
          <TextField
            fullWidth
            label="Adószám"
            value={companyData?.adoszam || ''}
            InputProps={{ readOnly: true }}
          />
          
          <TextField
            fullWidth
            label="Cégjegyzékszám"
            value={companyData?.cegjegyzek || ''}
            InputProps={{ readOnly: true }}
          />
          
          <TextField
            fullWidth
            label="Helyrajzi szám"
            value={companyData?.helyrajziszam || ''}
            InputProps={{ readOnly: true }}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Mégse</Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained"
          disabled={!formData.cegnev.trim() || !formData.telefon.trim()}
        >
          Mentés
        </Button>
      </DialogActions>
    </Dialog>
  );
};




const CompHome = ({ onSignOut }) => {
  const [surveyTotalCost, setSurveyTotalCost] = useState(0);
  const [credits, setCredits] = useState(0);
  const location = useLocation();
  console.log(location);
  const name = location.state?.userName || location.state?.companyName;
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [showCreditPage, setShowCreditPage] = useState(false);
  const [selectedParticipants, setSelectedParticipants] = useState(50);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [companyProfileData, setCompanyProfileData] = useState(null);

  const [companySurveys, setCompanySurveys] = useState([]);
  const [selectedSurveyId, setSelectedSurveyId] = useState(null);

  const [openCardDialog, setOpenCardDialog] = useState({
    first: false,
    second: false,
    third: false,
    fourth: false,
    fifth: false,
    sixth: false
  });


  const fetchCompanyProfile = useCallback(async () => {
    try {
      const companyId = location.state?.cegId;
      if (!companyId) return;
      
      const response = await fetch(`http://localhost:3001/api/companies/profile/${companyId}`);
      if (!response.ok) throw new Error('Failed to fetch company profile');
      
      const data = await response.json();
      setCompanyProfileData(data);
    } catch (error) {
      console.error('Error fetching company profile:', error);
      setSnackbar({
        open: true,
        message: 'Hiba történt a cég profil betöltése során',
        severity: 'error'
      });
    }
  }, [location.state?.cegId, setSnackbar]);



  const handleSaveCompanyProfile = async (formData) => {
    try {
      const companyId = location.state?.cegId;
      if (!companyId) return;
      
      // Ellenőrizzük, hogy van-e mit frissíteni
      if (Object.keys(formData).length === 0) {
        setSnackbar({
          open: true,
          message: 'Nincs módosítandó adat',
          severity: 'info'
        });
        setProfileDialogOpen(false);
        return;
      }
      
      const response = await fetch(`http://localhost:3001/api/companies/profile/${companyId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) throw new Error('Failed to update company profile');
      
      await response.json();
      
      setSnackbar({
        open: true,
        message: 'Cég profil sikeresen frissítve',
        severity: 'success'
      });
      
      setProfileDialogOpen(false);
      fetchCompanyProfile(); // Frissítsük a profil adatokat
    } catch (error) {
      console.error('Error updating company profile:', error);
      setSnackbar({
        open: true,
        message: 'Hiba történt a cég profil mentése során',
        severity: 'error'
      });
    }
  };


  useEffect(() => {
    fetchCompanyProfile();
  }, [fetchCompanyProfile]);


  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
const [surveyFilter, setSurveyFilter] = useState({
  title: '',
  titleFilterType: 'contains', // 'startsWith', 'endsWith', 'equals', 'contains'
  date: '',
  dateFilterType: 'contains',
  completionMin: 0,
  completionMax: 100
});
const [filteredSurveys, setFilteredSurveys] = useState([]);

// Popover nyitás/zárás kezelése
const handleFilterClick = (event) => {
  setFilterAnchorEl(event.currentTarget);
};

const handleFilterClose = () => {
  setFilterAnchorEl(null);
};

const openFilter = Boolean(filterAnchorEl);
const filterId = openFilter ? 'survey-filter-popover' : undefined;

// Szűrő alkalmazása
const applyFilter = () => {
  const filtered = companySurveys.filter(survey => {
    // Cím szűrése a kiválasztott szűrési típus alapján
    let matchesTitle = true;
    if (surveyFilter.title) {
      const title = survey.title.toLowerCase();
      const filterText = surveyFilter.title.toLowerCase();
      
      switch (surveyFilter.titleFilterType) {
        case 'startsWith':
          matchesTitle = title.startsWith(filterText);
          break;
        case 'endsWith':
          matchesTitle = title.endsWith(filterText);
          break;
        case 'equals':
          matchesTitle = title === filterText;
          break;
        case 'contains':
        default:
          matchesTitle = title.includes(filterText);
          break;
      }
    }
    
    // Dátum szűrése a kiválasztott szűrési típus alapján
    let matchesDate = true;
    if (surveyFilter.date) {
      const date = survey.created_date.toLowerCase();
      const filterDate = surveyFilter.date.toLowerCase();
      
      switch (surveyFilter.dateFilterType) {
        case 'startsWith':
          matchesDate = date.startsWith(filterDate);
          break;
        case 'endsWith':
          matchesDate = date.endsWith(filterDate);
          break;
        case 'equals':
          matchesDate = date === filterDate;
          break;
        case 'contains':
        default:
          matchesDate = date.includes(filterDate);
          break;
      }
    }
    
    // Kitöltöttség szűrése
    const completion = Math.round(survey.completion_percentage);
    const matchesCompletion = completion >= surveyFilter.completionMin && completion <= surveyFilter.completionMax;
    
    return matchesTitle && matchesDate && matchesCompletion;
  });
  
  setFilteredSurveys(filtered);
  handleFilterClose();
};


// Szűrő törlése
const clearFilter = () => {
  setSurveyFilter({
    title: '',
    titleFilterType: 'contains',
    date: '',
    dateFilterType: 'contains',
    completionMin: 0,
    completionMax: 100
  });
  setFilteredSurveys([]);
  handleFilterClose();
};

// Használjuk a filteredSurveys-t, ha van benne elem, egyébként a companySurveys-t
const isFilterActive = surveyFilter.title !== '' || surveyFilter.date !== '' || 
                      surveyFilter.completionMin > 0 || surveyFilter.completionMax < 100;
const displayedSurveys = isFilterActive ? filteredSurveys : companySurveys;


  useEffect(() => {
    const fetchCredits = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/companies/credits/${localStorage.getItem('cegId')}`);
        const data = await response.json();
        setCredits(data.credits);
      } catch (error) {
        console.error('Error fetching credits:', error);
      }
    };
    fetchCredits();
  }, []);

  const handleCreditPurchase = (newCredits) => {
    setCredits(newCredits);
  };


  useEffect(() => {
    const fetchCompanySurveys = async () => {
      const response = await fetch(`http://localhost:3001/api/main/company-surveys/${location.state.cegId}`);
      const surveys = await response.json();
      setCompanySurveys(surveys);
    };
    fetchCompanySurveys();
  }, [location.state.cegId]);



  const [filterData, setFilterData] = useState({
    vegzettseg: null,
    korcsoport: null,
    regio: null,
    nem: null,
    anyagi: null
  });


const [questions, setQuestions] = useState([{
  id: 1,
  selectedButton: "radio",
  questionText: "",
  options: [{ id: 1, label: "" }]
}]);

  

  const handleButtonClick = (questionId, type) => {
    setQuestions((prev) =>
      prev.map((question) =>
        question.id === questionId
          ? { ...question, selectedButton: type }
          : question
      )
    );
  };



  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar(prev => ({...prev, open: false}));
  };



const handleAddQuestion = () => {
  if (credits >= 30) {
  setQuestions((prev) => [
    ...prev,
    {
      id: uuidv4(),
      selectedButton: "radio",
      options: [{ id: uuidv4(), label: "" }], 
    },
  ]);
  setSurveyTotalCost(prev => prev + 30);
  }
  else {
    alert("Nincs elegendő kredit a kérdés hozzáadásához!");
  }
};



const handleRemoveQuestion = (id) => {
  setQuestions(prev => {
    const questionToRemove = prev.find(q => q.id === id);
    const extraOptions = questionToRemove.options.length > 4 ? questionToRemove.options.length - 4 : 0;
    const creditToRefund = 30 + (extraOptions * 10);
    setCredits(prevCredit => prevCredit + creditToRefund);
    return prev.filter(q => q.id !== id);
  });
};





const handleLabelChange = (questionId, optionId, value) => {
  console.log("Question ID:", questionId);
  console.log("Option ID:", optionId);
  console.log("New Value:", value);
  setQuestions(prev =>
    prev.map((question) =>
      question.id === questionId
        ? {
            ...question,
            options: question.options.map((option) =>
              option.id === optionId ? { ...option, label: value } : option
            )
          }
        : question
    )
  );
};



const handleAddOption = (questionId) => {
  setQuestions((prev) =>
    prev.map((q) => {
      if (q.id === questionId) {
        if (q.options.length >= 4 && credits >= 10) {
          
          setSurveyTotalCost(prev => prev + 10);
          return {
            ...q,
            options: [
              ...q.options,
              { id: uuidv4(), label: "" },
            ],
          };
        } else if (q.options.length < 4) {
          
          return {
            ...q,
            options: [
              ...q.options,
              { id: uuidv4(), label: "" },
            ],
          };
        }
      }
      return q;
    })
  );
};



const handleRemoveOption = (questionId, optionId) => {
  setQuestions((prev) =>
    prev.map((question) => {
      if (question.id === questionId) {
        const wasAboveLimit = question.options.length > 4; 
        const updatedOptions = question.options.filter(
          (option) => option.id !== optionId
        );

        
        if (wasAboveLimit) {
          setCredits((prevCredit) => prevCredit + 10); 
        }

        return {
          ...question,
          options: updatedOptions,
        };
      }
      return question;
    })
  );
};

const handleCardDialogOpen = (cardName) => {
  setOpenCardDialog(prev => ({...prev, [cardName]: true}));
};

const handleCardDialogClose = (cardName) => {
  setOpenCardDialog(prev => ({...prev, [cardName]: false}));
};


    const [showFirstCard, setShowFirstCard] = React.useState(true); 
    const [showSecondCard, setShowSecondCard] = React.useState(true); 
    const [showThirdCard, setShowThirdCard] = React.useState(true); 
    const [showFourthCard, setShowFourthCard] = React.useState(true);
    const [showFifthCard, setShowFifthCard] = React.useState(true);
    const [showSixthCard, setShowSixthCard] = React.useState(true);
    const [showStatisztika, setShowStatisztika] = useState(false);
    const [filteredCount, setFilteredCount] = useState(0);
  
    const handleClickOpenKerd = () => {
      setShowFirstCard(false);
      setShowSecondCard(true);
      setShowThirdCard(false);
      setShowFourthCard(false);
      setShowFifthCard(false);
      setShowSixthCard(false);
    };
  
    const handleCloseKerd = () => {
      setShowFirstCard(true);
      setShowSecondCard(false);
      setShowThirdCard(false);
      setShowFourthCard(false);
      setShowFifthCard(false);
      setShowSixthCard(false);
    };



    const handleClickOpenSzuro = () => {
      setShowFirstCard(false);
      setShowSecondCard(false);
      setShowThirdCard(true);
      setShowFourthCard(false);
      setShowFifthCard(false);
      setShowSixthCard(false);
    };


    const handleClickCloseSzuro = () => {
      setShowFirstCard(false);
      setShowSecondCard(true);
      setShowThirdCard(false);
      setShowFourthCard(false);
      setShowFifthCard(false);
      setShowSixthCard(false);
    };


    const handleCloseIconClick = () => {
      setShowFirstCard(true);
      setShowSecondCard(false);
      setShowThirdCard(false);
      setShowFourthCard(false);
      setShowFifthCard(false);
      setShowSixthCard(false);
    };


    const handleShowMintavetel = (count, filterCriteria) => {
      setFilteredCount(count);
      setFilterData(filterCriteria);
      console.log("Filter data in Comp_Home:", filterCriteria);
      setShowFirstCard(false);
      setShowSecondCard(false);
      setShowThirdCard(false);
      setShowFourthCard(true);
      setShowFifthCard(false);
    };


    const handleClickCloseMintavetel = () => {
      setShowFirstCard(false);
      setShowSecondCard(false);
      setShowThirdCard(true);
      setShowFourthCard(false);
      setShowFifthCard(false);
      setShowSixthCard(false);
    };


    const handleClickOpenAttekintes = (participantCount) => {
      setSelectedParticipants(participantCount);
      setShowFirstCard(false); 
      setShowSecondCard(false); 
      setShowThirdCard(false);
      setShowFourthCard(false);
      setShowFifthCard(true);
      setShowSixthCard(false);
    };

    const handleCloseAttekintes = () => {
      setShowFirstCard(false); 
      setShowSecondCard(false);
      setShowThirdCard(false);
      setShowFourthCard(true);
      setShowFifthCard(false);
      setShowSixthCard(false);
    };


    const handleNavigationChange = (event, newValue) => {
      setValue(newValue);
      if (newValue === 0) {
        setShowCreditPage(false);
        setShowFirstCard(true);
        setShowSecondCard(false);
        setShowThirdCard(false);
        setShowFourthCard(false);
        setShowFifthCard(false);
        setShowSixthCard(false);
        setShowStatisztika(false);
      } else if (newValue === 1) {
        setShowCreditPage(true);
        setShowFirstCard(false);
        setShowSecondCard(false);
        setShowThirdCard(false);
        setShowFourthCard(false);
        setShowFifthCard(false);
        setShowSixthCard(false);
        setShowStatisztika(false);
      } else if (newValue === 2) {
        setShowCreditPage(false);
        setShowFirstCard(false);
        setShowSecondCard(false);
        setShowThirdCard(false);
        setShowFourthCard(false);
        setShowFifthCard(false);
        setShowSixthCard(false);
        setShowStatisztika(true);
      }
    };


    const handleSurveySuccess = () => {
      setCredits(prevCredits => prevCredits - surveyTotalCost);
      setSnackbar(prev => ({ 
        ...prev,
        open: true, 
        message: 'Kérdőív sikeresen létrehozva', 
        severity: 'success' 
      }));
      setShowFifthCard(false);
      setShowFourthCard(false);
      setShowThirdCard(false);
      setShowSecondCard(false);
      setShowFirstCard(false);
      setShowSixthCard(true);
    };
  
  
  
    const handleSurveyError = (errorMessage) => {
      setSnackbar(prev => ({
        ...prev,
        open: true,
        message: errorMessage,
        severity: 'error'
      }));
    };




    const [surveyTitle, setSurveyTitle] = useState('');


  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(0);

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

  return (
    <AppTheme>
      <React.Fragment>
      
        <CssBaseline enableColorScheme />
        <CompHomeContainer direction="column" justifyContent={showStatisztika ? "flex-start" : "space-between"}  sx={{
        position: 'relative',
        height: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        pt: 4, 
      }}>

    

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
  {/* Kredit megjelenítése */}
  <Typography
    component="h1"
    variant="h3"
    sx={{
      cursor: 'pointer',
      fontSize: { xs: '1.1rem', sm: '1.3rem', md: '1.6rem' },
      order: { xs: 2, md: 1 },
      mt: { xs: 2, md: -1 },
      position: 'relative',
      zIndex: 5,
      width: { xs: '100%', md: '25%' }, 
      textAlign: { xs: 'center', md: 'left' },
      pl: { md: 20 }, // Add padding to avoid logo overlap
    }}
    onClick={() => {
      setShowCreditPage(true);
      setValue(1);
    }}
  >
    {credits} Kredit
  </Typography>
  
  {/* Üdvözlő szöveg */}
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
  
  {/* Témaválasztás, értesítések és profil */}
  <Box sx={{
    display: 'flex',
    gap: { xs: 2, sm: 3, md: 4 },
    order: { xs: 3, md: 3 },
    mt: { xs: 2, md: 0 },
    width: { xs: '100%', md: '25%' },
    justifyContent: { xs: 'center', md: 'flex-end' }
  }}>
    <ColorModeSelect sx={{ 
      display: 'flex',
      alignItems: 'center'
    }} />
    
    <IconButton aria-label="notifications">
      <StyledBadge badgeContent={4} color="secondary">
        <MailIcon />
      </StyledBadge>
    </IconButton>
    
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



      <SimpleBottomNavigation
        value={value}
        onChange={handleNavigationChange}
      />


{showFirstCard && !showCreditPage && (
  <Box sx={{ 
    display: 'flex', 
    justifyContent: 'flex-end', 
    width: '95%', 
    maxWidth: '700px',
    mb: 0,
    mt: 4,
  }}>
    <Button
      aria-describedby={filterId}
      onClick={handleFilterClick}
      variant="outlined"
      sx={{
        minWidth: { xs: "50px", sm: "60px" },
        height: { xs: "40px", sm: "40px" },
        position: 'relative',
        bgcolor: (theme) => theme.palette.background.paper,
      }}
    >
      <FilterListIcon color={isFilterActive ? "primary" : "inherit"} />
      {isFilterActive && (
        <Box
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            width: 8,
            height: 8,
            borderRadius: '50%',
            bgcolor: 'primary.main',
          }}
        />
      )}
    </Button>
  </Box>
)}

      {/* Első Card */}
      { showFirstCard && !showCreditPage && (
  <Card
    variant="outlined"
    sx={{
      mt: 1,
      width: "95% !important",
      height: { xs: "auto", sm: "70%" }, // Mobil nézetben auto magasság
      maxWidth: "700px !important",
      overflow: "auto", // Biztosítja, hogy a tartalom ne csússzon ki
    }}
  >
    <Button
      onClick={handleClickOpenKerd}
      sx={{
        height: { xs: "auto", sm: "80px" }, // Mobil nézetben automatikus magasság
        minHeight: "60px", // Minimum magasság minden méretben
        width: "100%",
        justifyContent: "flex-start",
        textAlign: "left",
        pl: { xs: 2, sm: 4 }, // Kisebb padding mobil nézetben
        fontSize: { xs: "1rem", sm: "1.2rem" }, // Kisebb betűméret mobil nézetben
        flexShrink: 0,
        mb: 2,
        whiteSpace: "normal", // Engedi a sortörést
      }}
      variant="outlined"
      startIcon={
        <AddCircleOutlineIcon
          sx={{
            width: { xs: "24px", sm: "32px" }, // Kisebb ikon mobil nézetben
            height: { xs: "24px", sm: "32px" },
            mr: { xs: 1, sm: 2 },
          }}
        />
      }
    >
      Kérdőív létrehozása
    </Button>


    

    {/* Szűrő Popover */}
    <Popover
  id={filterId}
  open={openFilter}
  anchorEl={filterAnchorEl}
  onClose={handleFilterClose}
  anchorOrigin={{
    vertical: 'bottom',
    horizontal: 'right',
  }}
  transformOrigin={{
    vertical: 'top',
    horizontal: 'right',
  }}
>
  <Box sx={{ p: 3, width: 350 }}>
    <Typography variant="h6" gutterBottom>
      Kérdőívek szűrése
    </Typography>
    
    {/* Cím szűrése */}
    <Box sx={{ mb: 2 }}>
      <Typography variant="subtitle2" gutterBottom>
        Kérdőív címe
      </Typography>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <FormControl size="small" sx={{ width: '70%' }}>
        <Select
        value={surveyFilter.titleFilterType}
        onChange={(e) => setSurveyFilter({...surveyFilter, titleFilterType: e.target.value})}
        sx={{
          '& .MuiSelect-select': {
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            pr: 4 
          }
        }}
        renderValue={(value) => {
          const options = {
            contains: 'Tartalmazza',
            startsWith: 'Kezdődik...',
            endsWith: 'Végződik...',
            equals: 'Egyezik...'
          };
          return options[value] || value;
        }}
      >
            <MenuItem value="contains">Tartalmazza</MenuItem>
            <MenuItem value="startsWith">Ezzel kezdődik</MenuItem>
            <MenuItem value="endsWith">Ezzel végződik</MenuItem>
            <MenuItem value="equals">Pontosan egyezik</MenuItem>
          </Select>
        </FormControl>
        <TextField
          size="small"
          fullWidth
          value={surveyFilter.title}
          onChange={(e) => setSurveyFilter({...surveyFilter, title: e.target.value})}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
        />
      </Box>
    </Box>
    
    {/* Dátum szűrése */}
    <Box sx={{ mb: 2 }}>
      <Typography variant="subtitle2" gutterBottom>
        Dátum
      </Typography>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <FormControl size="small" sx={{ width: '70%' }}>
        <Select
        value={surveyFilter.dateFilterType}
        onChange={(e) => setSurveyFilter({...surveyFilter, dateFilterType: e.target.value})}
        sx={{
          '& .MuiSelect-select': {
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            pr: 4 
          }
        }}
        renderValue={(value) => {
          const options = {
            contains: 'Tartalmazza',
            startsWith: 'Kezdődik...',
            endsWith: 'Végződik...',
            equals: 'Egyezik...'
          };
          return options[value] || value;
        }}
      >
            <MenuItem value="contains">Tartalmazza</MenuItem>
            <MenuItem value="startsWith">Ezzel kezdődik</MenuItem>
            <MenuItem value="endsWith">Ezzel végződik</MenuItem>
            <MenuItem value="equals">Pontosan egyezik</MenuItem>
          </Select>
        </FormControl>
        <TextField
          size="small"
          fullWidth
          value={surveyFilter.date}
          onChange={(e) => setSurveyFilter({...surveyFilter, date: e.target.value})}
          placeholder="pl. 2023-05"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
        />
      </Box>
    </Box>
    
    {/* Kitöltöttség szűrése */}
    <Box sx={{ mt: 3 }}>
      <Typography variant="subtitle2" gutterBottom>
        Kitöltöttség (%)
      </Typography>
      <Slider
        value={[surveyFilter.completionMin, surveyFilter.completionMax]}
        onChange={(e, newValue) => setSurveyFilter({
          ...surveyFilter, 
          completionMin: newValue[0], 
          completionMax: newValue[1]
        })}
        valueLabelDisplay="auto"
        min={0}
        max={100}
      />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
        <Typography variant="caption">
          Min: {surveyFilter.completionMin}%
        </Typography>
        <Typography variant="caption">
          Max: {surveyFilter.completionMax}%
        </Typography>
      </Box>
    </Box>
    
    {/* Szűrés gombok */}
    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
      <Button onClick={clearFilter} color="inherit">
        Törlés
      </Button>
      <Button onClick={applyFilter} variant="contained">
        Szűrés
      </Button>
    </Box>
  </Box>
</Popover>


    {displayedSurveys.map(survey => (
      <Button
        key={survey.id}
        onClick={() => {
          setSelectedSurveyId(survey.id);
          setShowFirstCard(false);
          setShowSecondCard(false);
          setShowThirdCard(false);
          setShowFourthCard(false);
          setShowFifthCard(false);
          setShowSixthCard(true);
        }}
        sx={{
          height: { xs: "auto", sm: "80px" }, // Mobil nézetben automatikus magasság
          minHeight: { xs: "80px", sm: "80px" }, // Minimum magasság minden méretben
          flexShrink: 0,
          textAlign: "left",
          pl: { xs: 2, sm: 4 }, // Kisebb padding mobil nézetben
          fontSize: { xs: "0.9rem", sm: "1.2rem" }, // Kisebb betűméret mobil nézetben
          mb: 2,
          width: "100%",
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' }, // Mobil nézetben oszlopba rendezi
          alignItems: { xs: 'flex-start', sm: 'center' }, // Mobil nézetben balra igazít
          justifyContent: 'space-between',
          py: { xs: 2, sm: 0 }, // Extra padding-y mobil nézetben
          whiteSpace: "normal", // Engedi a sortörést
        }}
        variant="outlined"
      >
        <Typography 
          component="span" 
          sx={{ 
            fontSize: { xs: '0.9rem', sm: '1.2rem' },
            mb: { xs: 1, sm: 0 }, // Mobil nézetben alsó margó
            width: { xs: '100%', sm: 'auto' }, // Mobil nézetben teljes szélesség
            wordBreak: "break-word" // Hosszú szavak törése
          }}
        >
          {survey.title}
        </Typography>
        
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'row', sm: 'row' }, 
          alignItems: 'center', 
          gap: { xs: 1, sm: 2 }, 
          mr: { xs: 0, sm: 2 },
          width: { xs: '100%', sm: 'auto' }, // Mobil nézetben teljes szélesség
          justifyContent: { xs: 'space-between', sm: 'flex-end' } // Mobil nézetben szétosztja
        }}>
          <Typography
            component="span"
            sx={{
              width: "auto",
              minWidth: { xs: "auto", sm: "150px" }, // Mobil nézetben automatikus szélesség
              height: { xs: "auto", sm: "37px" }, // Mobil nézetben automatikus magasság
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "0 10px",
              fontSize: { xs: '0.8rem', sm: 'inherit' } // Kisebb betűméret mobil nézetben
            }}
          >
            {survey.created_date}
          </Typography>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            minWidth: { xs: "60px", sm: "auto" } // Fix szélesség mobil nézetben
          }}>
            <Typography sx={{ fontSize: { xs: '0.8rem', sm: 'inherit' } }}>
              {Math.round(survey.completion_percentage)}%
            </Typography>
            <Typography 
              variant="caption" 
              sx={{ 
                mt: -0.5,
                fontSize: { xs: '0.7rem', sm: '0.75rem' } // Kisebb betűméret mobil nézetben
              }}
            >
              Folyamatban
            </Typography>
          </Box>
        </Box>
      </Button>
    ))}
    {/* Ha nincs találat a szűrésre, jelenítsünk meg egy üzenetet */}
    {filteredSurveys.length === 0 && surveyFilter.title !== '' && (
      <Typography sx={{ textAlign: 'center', mt: 2, color: 'text.secondary' }}>
        Nincs a szűrésnek megfelelő kérdőív
      </Typography>
    )}
  </Card>
)}

      {/* Második Card */}
      {!showThirdCard && !showFirstCard && showSecondCard && (
  <Card
    noValidate
    autoComplete="off"
    variant="outlined"
    sx={{
      top: "4px",
      mt: 7,
      width: "95% !important",
      height: "70vh",
      maxWidth: "700px !important",
      position: "relative",
      padding: "10px",
      overflow: "auto",
    }}
  >
    <Button
      onClick={handleCloseKerd}
      sx={{
        position: "absolute",
        top: "8px",
        right: "8px",
        width: "22px",
        height: "22px",
        minWidth: "0px",
        padding: "0px",
      }}
    >
      <CloseIcon />
    </Button>
    <Button
      onClick={() => {
        setQuestions([{
          id: 1,
          selectedButton: "radio",
          questionText: "",
          options: [{ id: 1, label: "" }]
        }]);
        setCredits(credits);
        setSurveyTitle('');
      }}
      sx={{
        position: "absolute",
        top: "40px",
        right: "8px",
        width: "22px",
        height: "22px",
        minWidth: "0px",
        padding: "0px",
      }}
    >
      <RefreshIcon />
    </Button>
    <TextField
      sx={{
        left: "20px",
        width: '25ch',
        height: '7ch',
        mb: "20px",
        '& .MuiInputLabel-root': {
          fontSize: '1.2rem', 
        },
      }}
      id='valami' 
      label="Kérdőív címe" 
      variant="standard" 
      value={surveyTitle} 
      onChange={(e) => setSurveyTitle(e.target.value)}
    />

{questions.map((question, index) => (
<Container
    key={question.id}
    maxWidth="fix"
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
      minHeight: "300px",
      overflow: "auto", 
      position: "relative",
    }}
  >
    <TextField
            sx={{
              left: "10px",
              width: '25ch',
              height: '7ch',
              '& .MuiInputLabel-root': {
                fontSize: '1.1rem', 
              },
            }}
            id={`question-${question.id}-label`} label="Kérdés" variant="standard" value={question.questionText || ''} onChange={(e) => {
              setQuestions(prev => prev.map(q => 
                q.id === question.id 
                  ? {...q, questionText: e.target.value}
                  : q
              ));
            }}
           />


      <Typography
        component="h1"
        variant="subtitle2"
        sx={{
          mt: 2,
          textAlign: 'center',
        }}
      >
      Válaszadás típusa
      </Typography>



      <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        "& > *": {
          m: 1,
        },
      }}
    >
      <ButtonGroup
        variant="text"
        aria-label="Basic button group"
        sx={{
          "& .MuiButtonGroup-grouped": {
            border: "none",
            borderRadius: "20px",
            margin: "0 4px",
          },
        }}
      >
        <Button
          onClick={() => handleButtonClick(question.id, "radio")}
          sx={{
            backgroundColor: question.selectedButton === "radio" ? "#1976d2" : "transparent",
            color: question.selectedButton === "radio" ? "#fff" : "inherit",
            opacity: question.selectedButton === 'radio' ? 1 : 0.5,
          }}
        >
          {<RadioButtonCheckedIcon />} Feleletválasztó
        </Button>
        <Button
          onClick={() => handleButtonClick(question.id, "checkbox")}
          sx={{
            backgroundColor: question.selectedButton === "checkbox" ? "#1976d2" : "transparent",
            color: question.selectedButton === "checkbox" ? "#fff" : "inherit",
            opacity: question.selectedButton === 'checkbox' ? 1 : 0.5,
          }}
        >
          {<CheckBoxIcon />} Jelölőnégyzet
        </Button>
        <Button
          onClick={() => handleButtonClick(question.id, "text")}
          sx={{
            backgroundColor: question.selectedButton === "text" ? "#1976d2" : "transparent",
            color: question.selectedButton === "text" ? "#fff" : "inherit",
            opacity: question.selectedButton === 'text' ? 1 : 0.5,
          }}
        >
          {<TextFieldsIcon />} Szöveges válasz
        </Button>
      </ButtonGroup>
    </Box>

    <Box sx={{ width: 500, maxWidth: '100%' }}>
    {question.selectedButton === "radio" && (
          <RadioGroup>
            {question.options.map((option) => (
              <Box key={option.id} sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <Radio />
                <TextField
                  placeholder={`Option ${question.options.indexOf(option) + 1}`}
                  value={option.label}
                  onChange={(e) => handleLabelChange(question.id, option.id, e.target.value)}
                  sx={{ ml: 2 }}
                />
                  <Button
                  onClick={() => handleRemoveOption(question.id, option.id)}
                  color="error"
                  sx={{
                    ml: 30,
                    minWidth: "30px",
                    padding: "4px",
                    borderRadius: "20%",
                  }}
                >
                  <RemoveIcon />
                </Button>
              </Box>
            ))}
          </RadioGroup>
        )}

        {question.selectedButton === "checkbox" && (
          <FormGroup>
            {question.options.map((option) => (
              <Box key={option.id} sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <Checkbox />
                <TextField
                  placeholder={`Option ${question.options.indexOf(option) + 1}`}
                  value={option.label}
                  onChange={(e) => handleLabelChange(question.id, option.id, e.target.value)}
                  sx={{ ml: 2 }}
                />
                <Button
          onClick={() => handleRemoveOption(question.id, option.id)}
          color="error"
          sx={{
            ml: 30,
            minWidth: "30px",
            padding: "4px",
            borderRadius: "20%",
          }}
        >
          <RemoveIcon />
        </Button>
              </Box>
            ))}
          </FormGroup>
        )}

        {question.selectedButton === "text" && (
          <TextField
            placeholder="Szöveges válasz"
            fullWidth
            sx={{ mt: 2 }}
          />
        )}
  </Box>

  {(question.selectedButton === "radio" || question.selectedButton === "checkbox") && (
    <Button
      onClick={() => handleAddOption(question.id)}
      startIcon={<AddCircleOutlineIcon />}
      variant="outlined"
      sx={{
        border: "none", 
        borderRadius: "16px", 
        backgroundColor: (theme) => theme.palette.background.paper,
        color: (theme) => theme.palette.text.primary,
        "&:hover": {
          backgroundColor: (theme) =>
            theme.palette.mode === "dark" ? "#2c2c2c" : "#eaeaea",
        },
      }}
    >
      Opció hozzáadása
    </Button>
  )}


{index > 0 && (
  <Button
    onClick={() => handleRemoveQuestion(question.id)}
    sx={{
      position: "absolute", 
      top: "8px",           
      right: "16px",        
      width: "22px",
      height: "22px",
      minWidth: "0px",      
      padding: "0px",
    }}
  >
    <DeleteIcon />
  </Button>
)}



  
          
    
  </Container>
  ))}




      <Button
        onClick={handleAddQuestion}
        disabled={credits < 30}
        startIcon={<AddCircleOutlineIcon />}
        variant="outlined"
        sx={{ 
          mt: 0,
          justifyContent: "flex-start",
          pl: 2,
         }}
      >
        Kérdés hozzáadása
      </Button>




      <Typography 
        component="h1" 
        variant="subtitle1" 
        sx={{ 
          textAlign: 'center', 
          mt: 3,
          color: 'error.light' 
        }}
      >
        Költség: {surveyTotalCost} kredit
      </Typography>


      <Box
        sx={{
          display: "flex",
          justifyContent: "center", 
          alignItems: "center", 
          height: "100vh", 
        }}
      >
        <Button
          onClick={handleClickOpenSzuro}
          variant="outlined"
          sx={{
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            width: "82px",
            mb: 2,
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
      </Box>


          <Button
            onClick={handleCloseKerd}
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

          


        </Card>
        )}


        {/* Harmadik Card */}
        {!showFirstCard && !showSecondCard && showThirdCard && (
          <Szuro 
            onClose={() => handleCardDialogOpen('third')}
            onBack={handleClickCloseSzuro}
            onShowMintavetel={handleShowMintavetel}
            onFilterChange={setFilterData}
          />
        )}



        {/* Negyedik Card */}
        {!showFirstCard && !showSecondCard && !showThirdCard && showFourthCard && (
          <Mintavetel 
            userCount={filteredCount}
            onClose={() => handleCardDialogOpen('fourth')}
            onBack={handleClickCloseMintavetel}
            onNext={handleClickOpenAttekintes}
          />
        )}


        {/* Ötödik Card */}
        {!showFirstCard && !showSecondCard && !showThirdCard && !showFourthCard && showFifthCard && (
          <Attekintes
            surveyTitle={surveyTitle}
            questions={questions}
            onClose={() => handleCardDialogOpen('fifth')}
            onBack={handleCloseAttekintes}
            participantCount={selectedParticipants}
            creditCost={surveyTotalCost}
            onSuccess={handleSurveySuccess}
            onError={handleSurveyError}
            filterData={filterData}
          />
        )}


        {/* Hatodik Card */}
        {!showFirstCard && !showSecondCard && !showThirdCard && !showFourthCard && !showFifthCard && showSixthCard && (
          <Helyzet
          onClose={handleCloseIconClick}
          surveyId={selectedSurveyId}
          >
            
          </Helyzet>
        )}


        {/* Kredit oldal */}
        {showCreditPage && (
          <Kredit 
            onClose={() => setShowCreditPage(false)}
            currentCredits={credits}
            onPurchase={handleCreditPurchase}
          />
        )}


        {/* Statisztika oldal */}
{showStatisztika && (
  <Box sx={{ 
    position: 'absolute', 
    top: '200px',  // Állítsd be a kívánt magasságot
    left: 0,
    right: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    maxHeight: '70vh',
    zIndex: 1
  }}>
    <Statisztika 
      onClose={() => setShowStatisztika(false)}
    />
  </Box>
)}


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
          <Avatar /> Cég profil
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
              companyData={companyProfileData}
              onSave={handleSaveCompanyProfile}
            />

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

      {/* Third card dialog */}
      <Dialog
        open={openCardDialog.third}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => handleCardDialogClose('third')}
      >
        <DialogTitle>{"Megerősítés"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Biztosan be szeretné zárni a harmadik card-ot?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleCardDialogClose('third')}>Nem</Button>
          <Button onClick={() => {
            handleCardDialogClose('third');
            handleCloseIconClick();
          }}>Igen</Button>
        </DialogActions>
      </Dialog>

      {/* Fourth card dialog */}
      <Dialog
        open={openCardDialog.fourth}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => handleCardDialogClose('fourth')}
      >
        <DialogTitle>{"Megerősítés"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Biztosan be szeretné zárni a negyedik card-ot?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleCardDialogClose('fourth')}>Nem</Button>
          <Button onClick={() => {
            handleCardDialogClose('fourth');
            handleCloseIconClick();
          }}>Igen</Button>
        </DialogActions>
      </Dialog>

      {/* Fifth card dialog */}
      <Dialog
        open={openCardDialog.fifth}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => handleCardDialogClose('fifth')}
      >
        <DialogTitle>{"Megerősítés"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Biztosan be szeretné zárni az ötödik card-ot?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleCardDialogClose('fifth')}>Nem</Button>
          <Button onClick={() => {
            handleCardDialogClose('fifth');
            handleCloseIconClick();
          }}>Igen</Button>
        </DialogActions>
      </Dialog>
    

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
    </CompHomeContainer>
    </React.Fragment>
    </AppTheme>
  );
};


export default CompHome;