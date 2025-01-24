import React, { useState } from 'react';
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
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';


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
  /**
   * The value of the component.
   */
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




const SzuroContainer = styled(Stack)(({ theme }) => ({
  height: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)',
  minHeight: '100%',
  padding: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(4),
  },
  '&::before': {
    content: '""',
    display: 'block',
    position: 'absolute',
    zIndex: -1,
    inset: 0,
    backgroundImage:
      'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
    backgroundRepeat: 'no-repeat',
    ...theme.applyStyles('dark', {
      backgroundImage:
        'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
    }),
  },
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
        mt: 2, // Margin a tetejétől
        backgroundColor: theme.palette.background.default, 
        boxShadow: theme.shadows[1],
        width: '18%', // Szélesség növelése (arányos a konténerhez)
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


const CompHome = ({ onSignOut, onSendData }) => {
  const [credit, setCredit] = useState(120);
  const location = useLocation();
  console.log(location);
  const name = location.state?.userName || location.state?.companyName;



  const [vegzettseg, setVegzettseg] = React.useState('');
    const [korcsoport, setKorcsoport] = React.useState('');
    const [regio, setRegio] = React.useState('');
    const [nem, setNem] = React.useState('');
    const [anyagi, setAnyagi] = React.useState('');





    const handleVegzettseg = (event) => {
      setVegzettseg(event.target.value);
    };
  
    
  
    const handleKorcsoport = (event) => {
      setKorcsoport(event.target.value);
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
  
  
  
    const sendData = () => {
      const data = {
        vegzettseg,
        korcsoport,
        regio,
        nem,
        anyagi,
      };
      onSendData({ data });
    };
  




const [questions, setQuestions] = useState([{
  id: 1,
  selectedButton: "radio",
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
      id: uuidv4(), // Egyedi azonosító
      selectedButton: "radio",
      options: [{ id: uuidv4(), label: "" }], // Opció egyedi azonosítója
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
          // Hitelcsökkentés és új opció hozzáadása
          setCredit((prevCredit) => prevCredit - 10);
          return {
            ...q,
            options: [
              ...q.options,
              { id: uuidv4(), label: `Option ${q.options.length + 1}` },
            ],
          };
        } else if (q.options.length < 4) {
          // Új opció hozzáadása hitel nélkül
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
        const wasAboveLimit = question.options.length > 4; // Ellenőrizni, hogy 4 fölött volt-e
        const updatedOptions = question.options.filter(
          (option) => option.id !== optionId
        );

        // Ha korábban több mint 4 opció volt, növeljük a kreditet
        if (wasAboveLimit) {
          setCredit((prevCredit) => prevCredit + 10); // Hozzáadjuk a kreditet
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




    const [showFirstCard, setShowFirstCard] = React.useState(true); // Az első Card láthatósága
    const [showSecondCard, setShowSecondCard] = React.useState(true); // Az második Card láthatósága
    const [showThirdCard, setShowThirdCard] = React.useState(true); // Az harmadik Card láthatósága
  
    const handleClickOpenKerd = () => {
      setShowFirstCard(false); // Az első Card elrejtése
      setShowSecondCard(true); // A második Card megjelenítése
      setShowThirdCard(false);// A harmadik Card elrejtése
    };
  
    const handleCloseKerd = () => {
      setShowFirstCard(true); // Az első Card újra megjelenítése
      setShowSecondCard(false); // A második Card elrejtése
      setShowThirdCard(false);// A harmadik Card elrejtése
    };



    const handleClickOpenSzuro = () => {
      setShowFirstCard(false); // Az első Card elrejtése
      setShowSecondCard(false); // A második Card elrejtése
      setShowThirdCard(true);// A harmadik Card megjelenítése
    };


    const handleClickCloseSzuro = () => {
      setShowFirstCard(false); // Az első Card elrejtése
      setShowSecondCard(true); // A második Card megjelenítése
      setShowThirdCard(false);// A harmadik Card elrejtése
    };



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
        pt: 4, // Padding a tetején
      }}
    >

    

    <ColorModeSelect sx={{ position: 'absolute', top: '1rem', right: '5rem' }} />

    <IconButton aria-label="cart" sx={{ position: 'absolute', top: '1rem', right: '12.5rem' }}>
      <StyledBadge badgeContent={4} color="secondary">
        <MailIcon />
      </StyledBadge>
    </IconButton>
    

      {/* Tetején középen: "Ez a kezdőoldal." */}
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

      {/* Tetején középen, alatta a navigációs sáv */}
      <SimpleBottomNavigation
        value={value}
        onChange={(event, newValue) => setValue(newValue)}
      />

      {/* Bal felső sarok: "Köszöntjük az oldalon, {name}!" */}
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
            mt: 7, // Margin-top
            width: "95% !important",
            height: "60% !important",
            maxWidth: "700px !important",
          }}
        >
          <Button
            onClick={handleClickOpenKerd}
            sx={{
              height: "20% !important",
              justifyContent: "flex-start",
              textAlign: "left",
              pl: 4,
              fontSize: "1.2rem",
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

          <Button
            sx={{
              height: "20% !important",
              justifyContent: "flex-start",
              textAlign: "left",
              pl: 4,
              fontSize: "1.2rem",
            }}
            variant="outlined"
          >
            Cím
          </Button>
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
            mt: 7, // Margin-top
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
                fontSize: '1.2rem', // Növeli a label méretét
              },
            }}
            id='valami' label="Kérdőív címe" variant="standard" 
           />

{questions.map((question) => (
<Container
    key={question.id}
    maxWidth="fix"
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
      minHeight: "300px",
      overflow: "auto", // Görgetősáv megjelenítése
      position: "relative",
    }}
  >
    <TextField
            sx={{
              left: "10px",
              width: '25ch',
              height: '7ch',
              '& .MuiInputLabel-root': {
                fontSize: '1.1rem', // Növeli a label méretét
              },
            }}
            id={`question-${question.id}-label`} label="Kérdés" variant="standard" 
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
        border: "none", // Körvonal (ha szükséges)
        borderRadius: "16px", // Lekerekített sarkok
        backgroundColor: (theme) => theme.palette.background.paper,
        color: (theme) => theme.palette.text.primary,
        "&:hover": {
          backgroundColor: "#eaeaea",
        },
      }}
    >
      Opció hozzáadása
    </Button>
  )}


<Button
    onClick={() => handleRemoveQuestion(question.id)}
    sx={{
      position: "absolute", // A gomb abszolút pozíciója
      top: "8px",           // A Container tetejétől számított távolság
      right: "16px",        // A Container jobb szélétől számított távolság
      width: "22px",
      height: "22px",
      minWidth: "0px",       // Kis méretű gomb
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
          justifyContent: "center", // Vízszintesen középre igazítás
          alignItems: "center", // Függőlegesen középre igazítás
          height: "100vh", // Teljes magasságú konténer (ha szükséges)
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
            border: "none", // Körvonal (ha szükséges)
            borderRadius: "10px", // Lekerekített sarkok
            backgroundColor: (theme) => theme.palette.background.paper,
            color: (theme) => theme.palette.text.primary,
            "&:hover": {
              backgroundColor: "#eaeaea",
            },
          }}
        >
          Tovább
        </Button>
      </Box>


          <Button
            onClick={handleCloseKerd}
            sx={{
              position: "absolute", // Abszolút pozicionálás
              top: "8px", // Távolság a Card tetejétől
              right: "8px",
              width: "22px", // A gomb szélessége és magassága
              height: "22px",
              minWidth: "0px", // Minimalizálja a gomb alapértelmezett paddingjét
              padding: "0px", // Eltávolítja az extra belső térközt
              display: "flex", // Középre igazításhoz
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
        <Card
        variant="outlined"
        sx={{
          mt: 7, // Margin-top
          width: "95% !important",
          height: "60% !important",
          maxWidth: "700px !important",
        }}>
          

          <SzuroContainer>

<FormControl sx={{ m: 1, minWidth: 240 }}>
  <InputLabel
    id="demo-simple-select-autowidth-label"
    sx={{
      fontSize: '1.2rem', // Betűméret növelése
      fontWeight: 'bold', // Félkövér szöveg
      lineHeight: '1.5',  // Sorköz méretének növelése
      
      '&.MuiInputLabel-shrink': {
        transform: 'translate(0, -1.8rem)', // Ha a mező fókuszált vagy tele van
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
    fontSize: '1.2rem', // Betűméret
    padding: '10px',    // Belső margó
    height: '60px',     // Gomb magassága
  }}
>
    <MenuItem value="">
      <em>None</em>
    </MenuItem>
    <MenuItem value={1}>Egyetem, főiskola stb. oklevéllel</MenuItem>
    <MenuItem value={2}>Középfokú végzettség éretségi nélkül, szakmai végzetséggel</MenuItem>
    <MenuItem value={3}>Középfokú végzettség éretségivel (szakmai végzetség nélkül)</MenuItem>
    <MenuItem value={4}>Középfokú végzettség éretségivel (szakmai végzetségel)</MenuItem>
    <MenuItem value={5}>Általános iskola 8. osztálya</MenuItem>
    <MenuItem value={6}>8 általános iskolánál kevesebb</MenuItem>
  </Select>
</FormControl>



<FormControl sx={{ m: 1, minWidth: 130 }}>
        <InputLabel
         id="demo-simple-select-autowidth-label"
         sx={{
          fontSize: '1.2rem', // Betűméret növelése
          fontWeight: 'bold', // Félkövér szöveg
          lineHeight: '1.5',  // Sorköz méretének növelése
          
          '&.MuiInputLabel-shrink': {
            transform: 'translate(0, -1.8rem)', // Ha a mező fókuszált vagy tele van
          },
        }}
         >
          Korcsoport
         </InputLabel>
        <Select
          labelId="demo-simple-select-autowidth-label"
          id="demo-simple-select-autowidth"
          value={korcsoport}
          onChange={handleKorcsoport}
          autoWidth
          label="Korcsoport"
          sx={{
            fontSize: '1.2rem', // Betűméret
            padding: '10px',    // Belső margó
            height: '60px',     // Gomb magassága
          }}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value={7}>16 évesnél fiatalabb</MenuItem>
          <MenuItem value={8}>16-15</MenuItem>
          <MenuItem value={9}>26-35</MenuItem>
          <MenuItem value={10}>36-45</MenuItem>
          <MenuItem value={11}>46-55</MenuItem>
          <MenuItem value={12}>56-65</MenuItem>
          <MenuItem value={13}>66 éves vagy idősebb</MenuItem>
        </Select>
      </FormControl>





      <FormControl sx={{ m: 1, minWidth: 100 }}>
        <InputLabel id="demo-simple-select-autowidth-label"
        sx={{
          fontSize: '1.2rem', // Betűméret növelése
          fontWeight: 'bold', // Félkövér szöveg
          lineHeight: '1.5',  // Sorköz méretének növelése
          
          '&.MuiInputLabel-shrink': {
            transform: 'translate(0, -1.8rem)', // Ha a mező fókuszált vagy tele van
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
            fontSize: '1.2rem', // Betűméret
            padding: '10px',    // Belső margó
            height: '60px',     // Gomb magassága
          }}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value={14}>Nyugat-Dunántúl</MenuItem>
          <MenuItem value={15}>Közép-Dunántúl</MenuItem>
          <MenuItem value={16}>Közép-Magyarország</MenuItem>
          <MenuItem value={17}>Észak-Magyarország</MenuItem>
          <MenuItem value={18}>Észak-Alföldv</MenuItem>
          <MenuItem value={19}>Dél-Alföld</MenuItem>
        </Select>
      </FormControl>

      <FormControl sx={{ m: 1, minWidth: 100 }}>
        <InputLabel id="demo-simple-select-autowidth-label"
        sx={{
          fontSize: '1.2rem', // Betűméret növelése
          fontWeight: 'bold', // Félkövér szöveg
          lineHeight: '1.5',  // Sorköz méretének növelése
          
          '&.MuiInputLabel-shrink': {
            transform: 'translate(0, -1.8rem)', // Ha a mező fókuszált vagy tele van
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
            fontSize: '1.2rem', // Betűméret
            padding: '10px',    // Belső margó
            height: '60px',     // Gomb magassága
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
          fontSize: '1.2rem', // Betűméret növelése
          fontWeight: 'bold', // Félkövér szöveg
          lineHeight: '1.5',  // Sorköz méretének növelése
          
          '&.MuiInputLabel-shrink': {
            transform: 'translate(0, -1.8rem)', // Ha a mező fókuszált vagy tele van
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
            fontSize: '1.2rem', // Betűméret
            padding: '10px',    // Belső margó
            height: '60px',     // Gomb magassága
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


      <Box
      sx={{
        display: "flex",         // Flexbox elrendezés
        flexDirection: "row",    // Vízszintes elrendezés
        alignItems: "center",    // Függőleges középre igazítás
        justifyContent: "center", // Vízszintes középre igazítás
        gap: 2,                  // Távolság a gombok között
        mt: 2,  
      }}>
      <Button
          onClick={sendData}
          variant="outlined"
          sx={{
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            width: "82px",
            mb: 2,
            border: "none", // Körvonal (ha szükséges)
            borderRadius: "10px", // Lekerekített sarkok
            backgroundColor: (theme) => theme.palette.background.paper,
            color: (theme) => theme.palette.text.primary,
            "&:hover": {
              backgroundColor: "#eaeaea",
            },
          }}
        >
          Tovább
        </Button>



        <Button
          onClick={handleClickCloseSzuro}
          variant="outlined"
          sx={{
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            width: "82px",
            mb: 2,
            border: "none", // Körvonal (ha szükséges)
            borderRadius: "10px", // Lekerekített sarkok
            backgroundColor: (theme) => theme.palette.background.paper,
            color: (theme) => theme.palette.text.primary,
            "&:hover": {
              backgroundColor: "#eaeaea",
            },
          }}
        >
          Vissza
        </Button>
        </Box>
        </SzuroContainer>
          
        </Card>
        )}

      
      




  <Tooltip title="Account settings">
    <IconButton
      onClick={handleClickProfile}
      size="small"
      sx={{
        position: 'absolute',
        top: 16,
        right: 16,
        padding: 0, // Eltávolítja a belső margót
        width: 40, // Azonos szélesség, mint az Avatar
        height: 40, // Azonos magasság, mint az Avatar
        borderRadius: '50%', // Kör alakúvá teszi az IconButton-t
        overflow: 'hidden', // Eltünteti az esetleges tartalmi túllógást
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