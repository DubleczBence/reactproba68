import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import CssBaseline from '@mui/material/CssBaseline';
import FormControlLabel from '@mui/material/FormControlLabel';
import Divider from '@mui/material/Divider';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import MuiLink from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import ForgotPassword from './ForgotPassword';
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
  backgroundColor: 'rgba(9, 5, 58, 0.8)', // 90% átlátszatlan fehér háttér
  [theme.breakpoints.up('sm')]: {
    maxWidth: '450px',
  },
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  ...theme.applyStyles('dark', {
    boxShadow:
      'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
      backgroundColor: 'rgba(0, 2, 8, 0.8)', // 90% átlátszatlan sötét háttér
  }),
}));

const SignInContainer = styled(Stack)(({ theme }) => ({
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
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  zIndex: -1,
}
}));

export default function SignIn(props) {
  const { onSignIn } = props;
  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const [checked, setChecked] = React.useState(false);


    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [ceg_email, setCeg_email] = React.useState('');
    const [jelszo, setJelszo] = React.useState('');



    const handleChange = (event) => {
      setChecked(event.target.checked);
    };


    const handleEmailChange = (e) => setEmail(e.target.value);
    const handlePasswordChange = (e) => setPassword(e.target.value);

    const handleCeg_emailChange = (e) => setCeg_email(e.target.value);
    const handleJelszoChange = (e) => setJelszo(e.target.value);
    



  




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

    if (!password || password < 6) {
      setPasswordError(true);
      setPasswordErrorMessage('Password must be at least 6 characters long.');
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage('');
    }
  }

    
    else{
      if (!ceg_email || ceg_email.length < 1) {
        alert('Email is required.');
        isValid = false;
      }
      if (!jelszo || jelszo.length < 6) {
        alert('Jelszo must be at least 6 characters long.');
        isValid = false;
      }
    }
    return isValid;
  };



  const handleSubmit = (event) => {
    event.preventDefault(); 
    if (!validateInputs()) {
      return; 
    }
    
    const data = new FormData(event.currentTarget);


    if (!checked) {
   

    const userData = {
      email: data.get('email'),
      password: data.get('password'),
    };
    console.log('Sending data to App.js:', userData);
    if (onSignIn) {
      onSignIn({ type: 'user', data: userData }); 
    }
  } else {
    
    const cegData = {
      ceg_email: data.get('ceg_email'),
      jelszo: data.get('jelszo'),
    };
    console.log('Sending company data to App.js:', cegData);
    if (onSignIn) {
      onSignIn({ type: 'company', data: cegData });
    }
  }
};
  



  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  

    
  
    
  
  

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <SignInContainer direction="column" justifyContent="space-between">
        <ColorModeSelect sx={{ position: 'fixed', top: '1rem', right: '1rem' }} />
        
        <Card variant="outlined">
        
          <Typography
            component="h1"
            variant="h4"
            sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
          >
            Sign in
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              gap: 2,
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

            {/* User Form*/}
            {!checked && (
              <>
            <FormControl>
              <FormLabel htmlFor="email">User Email</FormLabel>
              <TextField
                error={emailError}
                helperText={emailErrorMessage}
                id="email"
                type="email"
                name="email"
                placeholder="your@email.com"
                value={email}
                onChange={handleEmailChange}
                autoComplete="email"
                autoFocus
                required
                fullWidth
                variant="outlined"
                color={emailError ? 'error' : 'primary'}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="password">User Password</FormLabel>
              <TextField
                error={passwordError}
                helperText={passwordErrorMessage}
                name="password"
                placeholder="••••••"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={handlePasswordChange}
                autoFocus
                required
                fullWidth
                variant="outlined"
                color={passwordError ? 'error' : 'primary'}
              />
            </FormControl>
            </>
            )}



            {/* Cég Form */}
            {checked && (
              <>
                <FormControl>
                  <FormLabel htmlFor="ceg_email">Cég Email</FormLabel>
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
                  <FormLabel htmlFor="jelszo">Cég Jelszó</FormLabel>
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
              </>
            )}



            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <ForgotPassword open={open} handleClose={handleClose} />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              onClick={validateInputs}
            >
              {checked ? 'Company Sign in' : 'User Sign in'}
            </Button>
            <MuiLink
              component="button"
              type="button"
              onClick={handleClickOpen}
              variant="body2"
              sx={{ alignSelf: 'center' }}
            >
              Forgot your password?
            </MuiLink>
          </Box>
          <Divider>or</Divider>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography sx={{ textAlign: 'center' }}>
              Don&apos;t have an account?{' '}
              <RouterLink
                to="/sign-up"
                variant="body2"
                sx={{ alignSelf: 'center' }}
              >
                Sign up
              </RouterLink>
            </Typography>
          </Box>
        </Card>
      </SignInContainer>
    </AppTheme>
  );
}
