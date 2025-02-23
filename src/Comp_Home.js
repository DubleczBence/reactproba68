import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import BarChartIcon from '@mui/icons-material/BarChart';
import AddBoxIcon from '@mui/icons-material/AddBox';
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
import PersonAdd from '@mui/icons-material/PersonAdd';
import Settings from '@mui/icons-material/Settings';
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
import Szuro from './Szuro';
import Mintavetel from './Mintavetel';
import Attekintes from './Attekintes';
import Helyzet from './Helyzet';
import CustomizedSnackbars from './CustomizedSnackbars';


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
        backgroundColor: theme.palette.background.default, 
        boxShadow: theme.shadows[1],
        width: '18%', 
      }}
    >
      <BottomNavigationAction label="Új kérdőív" icon={<AddBoxIcon />} />
      <BottomNavigationAction label="Kérdőíveim" icon={<DashboardIcon />} />
      <BottomNavigationAction label="Statisztika" icon={<BarChartIcon />} />
    </BottomNavigation>
  );
};




const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});


const CompHome = ({ onSignOut }) => {
  const [credit, setCredit] = useState(120);
  const location = useLocation();
  console.log(location);
  const name = location.state?.userName || location.state?.companyName;
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const [selectedParticipants, setSelectedParticipants] = useState(50);

  const [companySurveys, setCompanySurveys] = useState([]);
  const [selectedSurveyId, setSelectedSurveyId] = useState(null);


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





const handleAddQuestion = () => {
  if (credit >= 30) {
  setQuestions((prev) => [
    ...prev,
    {
      id: uuidv4(),
      selectedButton: "radio",
      options: [{ id: uuidv4(), label: "" }], 
    },
  ]);
  setCredit(credit - 30);
  }
  else {
    alert("Nincs elegendő kredit a kérdés hozzáadásához!");
  }
};



const handleRemoveQuestion = (id) => {
  setQuestions((prev) => prev.filter((q) => q.id !== id));
  setCredit(credit + 30);
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
        if (q.options.length >= 4 && credit >= 10) {
          
          setCredit((prevCredit) => prevCredit - 10);
          return {
            ...q,
            options: [
              ...q.options,
              { id: uuidv4(), label: `Option ${q.options.length + 1}` },
            ],
          };
        } else if (q.options.length < 4) {
          
          return {
            ...q,
            options: [
              ...q.options,
              { id: uuidv4(), label: `Option ${q.options.length + 1}` },
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
          setCredit((prevCredit) => prevCredit + 10); 
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




    const [showFirstCard, setShowFirstCard] = React.useState(true); 
    const [showSecondCard, setShowSecondCard] = React.useState(true); 
    const [showThirdCard, setShowThirdCard] = React.useState(true); 
    const [showFourthCard, setShowFourthCard] = React.useState(true);
    const [showFifthCard, setShowFifthCard] = React.useState(true);
    const [showSixthCard, setShowSixthCard] = React.useState(true);
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
    


    const handleSurveySuccess = () => {
      setSnackbar({ 
        open: true, 
        message: 'Kérdőív sikeresen létrehozva', 
        severity: 'success' 
      });
      setShowFifthCard(false);
      setShowFourthCard(false);
      setShowThirdCard(false);
      setShowSecondCard(false);
      setShowFirstCard(false);
      setShowSixthCard(true);
    };
  
  
  
    const handleSurveyError = (errorMessage) => {
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error'
      });
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
    <Box
      sx={{
        position: 'relative',
        height: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        pt: 4, 
      }}
    >

    

    <ColorModeSelect sx={{ position: 'absolute', top: '1rem', right: '5rem' }} />

    <IconButton aria-label="cart" sx={{ position: 'absolute', top: '1rem', right: '12.5rem' }}>
      <StyledBadge badgeContent={4} color="secondary">
        <MailIcon />
      </StyledBadge>
    </IconButton>
    

      
      <Typography
        component="h1"
        variant="h6"
        sx={{
          textAlign: 'center',
          mb: 2,
        }}
      >
        Köszöntjük az oldalon, {name}!
      </Typography>

      
      <SimpleBottomNavigation
        value={value}
        onChange={(event, newValue) => setValue(newValue)}
      />

      
      <Typography
        component="h1"
        variant="h3"
        sx={{
          position: 'absolute',
          top: 26,
          left: 26,
        }}
      >
       {120} Kredit
      </Typography>





      {/* Első Card */}
      { showFirstCard && (
        <Card
          variant="outlined"
          sx={{
            mt: 7,
            width: "95% !important",
            height: "60% !important",
            maxWidth: "700px !important",
          }}
        >
          <Button
            onClick={handleClickOpenKerd}
            sx={{
              height: "80px !important",
              width: "100%",
              justifyContent: "flex-start",
              textAlign: "left",
              pl: 4,
              fontSize: "1.2rem",
              flexShrink: 0,
              mb: 2
            }}
            variant="outlined"
            startIcon={
              <AddCircleOutlineIcon
                sx={{
                  width: "32px",
                  height: "32px",
                  mr: 2,
                }}
              />
            }
          >
            Kérdőív létrehozása
          </Button>

          {companySurveys.map(survey => (
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
                  height: "80px !important",
                  width: "100%",
                  justifyContent: "flex-start",
                  textAlign: "left",
                  pl: 4,
                  fontSize: "1.2rem",
                  flexShrink: 0,
                  mb: 2
                }}
                variant="outlined"
              >
                {survey.title}
              </Button>
            ))}
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
            id='valami' label="Kérdőív címe" variant="standard" value={surveyTitle} onChange={(e) => setSurveyTitle(e.target.value)}
           />

{questions.map((question) => (
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
                  placeholder="Label megadása"
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
                  placeholder="Label megadása"
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

  {(question.selectedButton === "radio" || question.selectedButton === "checkbox" || question.selectedButton === "text") && (
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



  
          
    
  </Container>
  ))}




      <Button
        onClick={handleAddQuestion}
        disabled={credit < 30}
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




      <Typography component="h1" variant="subtitle1" sx={{ textAlign: 'center', mt: 3}}>{credit}/120 Kredit</Typography>


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
          onClose={handleCloseIconClick}
          onBack={handleClickCloseSzuro}
          onShowMintavetel={handleShowMintavetel}
          onFilterChange={setFilterData}
          >
          </Szuro>
        )}



        {/* Negyedik Card */}
        {!showFirstCard && !showSecondCard && !showThirdCard && showFourthCard && (
          <Mintavetel 
            userCount={filteredCount}
            onClose={handleCloseIconClick}
            onBack={handleClickCloseMintavetel}
            onNext={handleClickOpenAttekintes}
          />
        )}


        {/* Ötödik Card */}
        {!showFirstCard && !showSecondCard && !showThirdCard && !showFourthCard && showFifthCard && (
          <Attekintes
            surveyTitle={surveyTitle}
            questions={questions}
            onClose={handleCloseIconClick}
            onBack={handleCloseAttekintes}
            participantCount={selectedParticipants}
            creditCost={120 - credit}
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
          />
        )}


        <CustomizedSnackbars
          open={snackbar.open}
          handleClose={() => setSnackbar({ ...snackbar, open: false })}
          message={snackbar.message}
          severity={snackbar.severity}
        />


  <Tooltip title="Account settings">
    <IconButton
      onClick={handleClickProfile}
      size="small"
      sx={{
        position: 'absolute',
        top: 16,
        right: 16,
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
        <MenuItem onClick={handleCloseProfile}>
          <Avatar /> Profile
        </MenuItem>
        <MenuItem onClick={handleCloseProfile}>
          <Avatar /> My account
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleCloseProfile}>
          <ListItemIcon>
            <PersonAdd fontSize="small" />
          </ListItemIcon>
          Add another account
        </MenuItem>
        <MenuItem onClick={handleCloseProfile}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <MenuItem onClick={handleClickOpen}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>


      

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
      
    </Box>
    
    </React.Fragment>
    </AppTheme>
  );
};

export default CompHome;