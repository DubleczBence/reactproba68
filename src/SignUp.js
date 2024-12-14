import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import AppTheme from './AppTheme';
import ColorModeSelect from './ColorModeSelect';
import { Link as RouterLink } from 'react-router-dom';
import Switch from '@mui/material/Switch';






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

const SignUpContainer = styled(Stack)(({ theme }) => ({
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

export default function SignUp(props) {
  const { onSignUp } = props;
  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
  const [nameError, setNameError] = React.useState(false);
  const [nameErrorMessage, setNameErrorMessage] = React.useState('');
  const [checked, setChecked] = React.useState(false);


  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [cegnev, setCegnev] = React.useState('');
  const [telefon, setTelefon] = React.useState('');
  const [ceg_email, setCeg_email] = React.useState('');
  const [jelszo, setJelszo] = React.useState('');
  const [telepules, setTelepules] = React.useState('');
  const [megye, setMegye] = React.useState('');
  const [ceges_szamla, setCeges_szamla] = React.useState('');
  const [hitelkartya, setHitelkartya] = React.useState('');
  const [adoszam, setAdoszam] = React.useState('');
  const [cegjegyzek, setCegjegyzek] = React.useState('');
  const [helyrajziszam, setHelyrajziszam] = React.useState('');


  const handleChange = (event) => {
    setChecked(event.target.checked);
  };


  const handleNameChange = (e) => setName(e.target.value);
  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);
  const handleCegnevChange = (e) => setCegnev(e.target.value);
  const handleTelefonChange = (e) => setTelefon(e.target.value);
  const handleCeg_emailChange = (e) => setCeg_email(e.target.value);
  const handleJelszoChange = (e) => setJelszo(e.target.value);
  const handleTelepulesChange = (e) => setTelepules(e.target.value);
  const handleMegyeChange = (e) => setMegye(e.target.value);
  const handleCeges_szamlaChange = (e) => setCeges_szamla(e.target.value);
  const handleHitelkartyaChange = (e) => setHitelkartya(e.target.value);
  const handleAdoszamChange = (e) => setAdoszam(e.target.value);
  const handleCegjegyzekChange = (e) => setCegjegyzek(e.target.value);
  const handleHelyrajziszamChange = (e) => setHelyrajziszam(e.target.value);
  







  const validateInputs = () => {
    let isValid = true;

    if (!checked) {
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setEmailError(true);
      setEmailErrorMessage('Please enter a valid email address.');
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage('');
    }

    if (!password || password.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage('Password must be at least 6 characters long.');
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage('');
    }

    if (!name || name.length < 1) {
      setNameError(true);
      setNameErrorMessage('Name is required.');
      isValid = false;
    } else {
      setNameError(false);
      setNameErrorMessage('');
    }
    }


    else{
    // Ha céges form van kiválasztva, további mezők validálása
      if (!cegnev || cegnev.length < 1) {
        alert('Cégnév is required.');
        isValid = false;
      }
      if (!telefon || telefon.length < 1) {
        alert('Telefonszám is required.');
        isValid = false;
      }
      if (!ceg_email || ceg_email.length < 1) {
        alert('Cég Email is required.');
        isValid = false;
      }
      if (!jelszo || jelszo.length < 1) {
        alert('Jelszo is required.');
        isValid = false;
      }
      if (!telepules || telepules.length < 1) {
        alert('Telepules is required.');
        isValid = false;
      }
      if (!megye || megye.length < 1) {
        alert('Megye is required.');
        isValid = false;
      }
      if (!ceges_szamla || ceges_szamla.length < 1) {
        alert('Céges számla is required.');
        isValid = false;
      }
      if (!hitelkartya || hitelkartya.length < 1) {
        alert('Hitelkartya is required.');
        isValid = false;
      }
      if (!adoszam || adoszam.length < 8) {
        alert('Adószám must be at least 8 characters.');
        isValid = false;
      }
      if (!cegjegyzek || cegjegyzek.length < 1) {
        alert('Cégjegyzékszám is required.');
        isValid = false;
      }
      if (!helyrajziszam || helyrajziszam.length < 1) {
        alert('Helyrajzi szám is required.');
        isValid = false;
      }
    }


    return isValid;
  };

  const handleSubmit = (event) => {
    event.preventDefault(); // Az űrlap alapértelmezett viselkedésének megakadályozása
    if (!validateInputs()) {
      return;
    }

    const data = new FormData(event.currentTarget);

    if (!checked) {
      // User adatok összegyűjtése
      const userData = {
        name: data.get('name'),
        email: data.get('email'),
        password: data.get('password'),
      };
      console.log('Sending user data to App.js:', userData);
      if (onSignUp) {
        onSignUp({ type: 'user', data: userData });
      }
    } else {
      // Céges adatok összegyűjtése
      const cegData = {
        cegnev: data.get('cegnev'),
        telefon: data.get('telefon'),
        ceg_email: data.get('ceg_email'),
        jelszo: data.get('jelszo'),
        telepules: data.get('telepules'),
        megye: data.get('megye'),
        ceges_szamla: data.get('ceges_szamla'),
        hitelkartya: data.get('hitelkartya'),
        adoszam: data.get('adoszam'),
        cegjegyzek: data.get('cegjegyzek'),
        helyrajziszam: data.get('helyrajziszam'),
      };
      console.log('Sending company data to App.js:', cegData);
      if (onSignUp) {
        onSignUp({ type: 'company', data: cegData });
      }
    }
  };

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <ColorModeSelect sx={{ position: 'fixed', top: '1rem', right: '1rem' }} />
      <SignUpContainer direction="column" justifyContent="space-between">
        <Card variant="outlined">
          <Typography
            component="h1"
            variant="h4"
            sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
          >
            Sign up
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: 2,
              maxHeight: '80vh', // Fix magasság, hogy a képernyőn belül maradjon
              overflowY: 'auto', // Görgetés engedélyezése
              paddingRight: 2,  // Scrollbar helyének biztosítása
             }}
          >
            <Stack direction="row" alignItems="center" spacing={2}>
            <Typography sx={{ visibility: checked ? 'hidden' : 'visible' }}>
              User
            </Typography>
            <Switch
              checked={checked}
              onChange={handleChange}
              inputProps={{ 'aria-label': 'controlled' }}
            />
            <Typography sx={{ visibility: checked ? 'visible' : 'hidden' }}>
              Cég
            </Typography>
            </Stack>

            {/* User Form */}
            {!checked && (
              <>
                <FormControl>
                  <FormLabel htmlFor="name">Full name</FormLabel>
                  <TextField
                    autoComplete="name"
                    name="name"
                    required
                    fullWidth
                    id="name"
                    placeholder="Jon Snow"
                    value={name}
                    onChange={handleNameChange}
                    error={nameError}
                    helperText={nameErrorMessage}
                    color={nameError ? 'error' : 'primary'}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel htmlFor="email">Email</FormLabel>
                  <TextField
                    required
                    fullWidth
                    id="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={handleEmailChange}
                    name="email"
                    autoComplete="email"
                    variant="outlined"
                    error={emailError}
                    helperText={emailErrorMessage}
                    color={passwordError ? 'error' : 'primary'}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel htmlFor="password">Password</FormLabel>
                  <TextField
                    required
                    fullWidth
                    name="password"
                    placeholder="••••••"
                    type="password"
                    id="password"
                    autoComplete="new-password"
                    value={password}
                    onChange={handlePasswordChange}
                    variant="outlined"
                    error={passwordError}
                    helperText={passwordErrorMessage}
                    color={passwordError ? 'error' : 'primary'}
                  />
                </FormControl>
              </>
            )}

             {/* Cég Form */}
            {checked && (
              <>
                <FormControl>
                  <FormLabel htmlFor="cegnev">Cégnév</FormLabel>
                  <TextField
                    required
                    fullWidth
                    name="cegnev"
                    id="cegnev"
                    placeholder="Cégnév"
                    value={cegnev}
                    onChange={handleCegnevChange}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel htmlFor="telefon">Telefonszám</FormLabel>
                  <TextField
                    required
                    fullWidth
                    name="telefon"
                    id="telefon"
                    placeholder="+36 20 123 4567"
                    value={telefon}
                    onChange={handleTelefonChange}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel htmlFor="ceg_email">Email</FormLabel>
                  <TextField
                    required
                    fullWidth
                    name="ceg_email"
                    id="ceg_email"
                    placeholder="ceg@email.com"
                    value={ceg_email}
                    onChange={handleCeg_emailChange}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel htmlFor="jelszo">Jelszó</FormLabel>
                  <TextField
                    required
                    fullWidth
                    type="password"
                    name="jelszo"
                    id="jelszo"
                    placeholder="••••••"
                    value={jelszo}
                    onChange={handleJelszoChange}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel htmlFor="telepules">Település</FormLabel>
                  <TextField
                    required
                    fullWidth
                    name="telepules"
                    id="telepules"
                    placeholder="Budapest"
                    value={telepules}
                    onChange={handleTelepulesChange}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel htmlFor="megye">Megye</FormLabel>
                  <TextField
                    required
                    fullWidth
                    name="megye"
                    id="megye"
                    placeholder="Pest"
                    value={megye}
                    onChange={handleMegyeChange}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel htmlFor="ceges_szamla">Céges számla</FormLabel>
                  <TextField
                    required
                    fullWidth
                    name="ceges_szamla"
                    id="ceges_szamla"
                    placeholder="12345678-12345678-12345678"
                    value={ceges_szamla}
                    onChange={handleCeges_szamlaChange}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel htmlFor="hitelkartya">Hitelkártya</FormLabel>
                  <TextField
                    required
                    fullWidth
                    name="hitelkartya"
                    id="hitelkartya"
                    placeholder="1234 5678 9012 3456"
                    value={hitelkartya}
                    onChange={handleHitelkartyaChange}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel htmlFor="adoszam">Adószám</FormLabel>
                  <TextField
                    required
                    fullWidth
                    name="adoszam"
                    id="adoszam"
                    placeholder="12345678-1-12"
                    value={adoszam}
                    onChange={handleAdoszamChange}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel htmlFor="cegjegyzek">Cégjegyzékszám</FormLabel>
                  <TextField
                    required
                    fullWidth
                    name="cegjegyzek"
                    id="cegjegyzek"
                    placeholder="01-09-123456"
                    value={cegjegyzek}
                    onChange={handleCegjegyzekChange}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel htmlFor="helyrajziszam">Helyrajzi szám</FormLabel>
                  <TextField
                    required
                    fullWidth
                    name="helyrajziszam"
                    id="helyrajziszam"
                    placeholder="12345/1"
                    value={helyrajziszam}
                    onChange={handleHelyrajziszamChange}
                  />
                </FormControl>
              </>
            )}

            <Button type="submit" fullWidth variant="contained">
              {checked ? 'Cég regisztráció' : 'User regisztráció'}
            </Button>


            <FormControlLabel
              control={<Checkbox value="allowExtraEmails" color="primary" />}
              label="I want to receive updates via email."
            />
            
          </Box>
          <Divider>
            <Typography sx={{ color: 'text.secondary' }}>or</Typography>
          </Divider>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography sx={{ textAlign: 'center' }}>
              Already have an account?{' '}
              <RouterLink
                to="/sign-in"
                variant="body2"
                sx={{ alignSelf: 'center' }}
              >
                Sign in
              </RouterLink>
            </Typography>
          </Box>
        </Card>
      </SignUpContainer>
    </AppTheme>
  );
}
