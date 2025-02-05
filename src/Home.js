import React, { useState, useEffect } from 'react';
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
import PersonAdd from '@mui/icons-material/PersonAdd';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';


const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(5),
  margin: 'auto',
  [theme.breakpoints.up('sm')]: {
    maxWidth: '700px',
  },
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  ...theme.applyStyles('dark', {
    boxShadow:
      'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
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



const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});



const Home = ({ onSignOut, onSendData }) => {


  const [vegzettseg, setVegzettseg] = React.useState('');
  const [korcsoport, setKorcsoport] = React.useState(dayjs());
  const [regio, setRegio] = React.useState('');
  const [nem, setNem] = React.useState('');
  const [anyagi, setAnyagi] = React.useState('');
  const [isFormFilled, setIsFormFilled] = useState(false); // Itt hozd létre az állapotot
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [name, setName] = useState('');
  





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





  const location = useLocation();
  console.log(location);



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

  useEffect(() => {
    if (location.state) {
      setName(location.state.userName);
    }
  }, [location]);

  if (isSignedIn) {
    if (isFormFilled) {
  return (

    <AppTheme {...onSendData}>
      <UserContainer direction="column" justifyContent="space-between">
      <React.Fragment>
          <CssBaseline enableColorScheme />
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
      
      <ColorModeSelect sx={{ position: 'absolute', top: '1rem', right: '5rem' }} />
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

      </React.Fragment>
    </UserContainer>
    </AppTheme>
    )} else{ 
      return(
        <AppTheme {...onSendData}>
          <UserContainer direction="column" justifyContent="space-between">
            <React.Fragment>


            <CssBaseline enableColorScheme />


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
            
            <ColorModeSelect sx={{ position: 'absolute', top: '1rem', right: '5rem' }} />
            

            <Card variant="outlined">
    

      
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





<LocalizationProvider dateAdapter={AdapterDayjs}>
  <DatePicker 
    label="Születési dátum"
    value={korcsoport}
    onChange={handleKorcsoport}
    sx={{
      '& .MuiInputBase-root': {
        fontSize: '1.2rem',
        padding: '10px',
        height: '60px',
      },
      '& .MuiInputLabel-root': {
        fontSize: '1.2rem',
        fontWeight: 'bold',
        lineHeight: '1.5',
      }
    }}
  />
</LocalizationProvider>


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

      <Button
              type="submit"
              fullWidth
              variant="contained"
              onClick={sendData}
            >
              Küldés
      </Button>
    </Card>
  


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
  </React.Fragment>
  </UserContainer>
</AppTheme>
  );
  }
}
};

export default Home;