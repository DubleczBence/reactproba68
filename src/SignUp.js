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

  const [company_nameError, setCompanyNameError] = React.useState(false);
  const [company_nameErrorMessage, setCompanyNameErrorMessage] = React.useState('');
  const [company_phonenumberError, setCompanyPhonenumberError] = React.useState(false);
  const [company_phonenumberErrorMessage, setCompanyPhonenumberErrorMessage] = React.useState('');
  const [company_emailError, setCompanyEmailError] = React.useState(false);
  const [company_emailErrorMessage, setCompanyEmailErrorMessage] = React.useState('');
  const [company_passwordError, setCompanyPasswordError] = React.useState(false);
  const [company_passwordErrorMessage, setCompanyPasswordErrorMessage] = React.useState('');
  const [company_settlementError, setCompanySettlementError] = React.useState(false);
  const [company_settlementErrorMessage, setCompanySettlementErrorMessage] = React.useState('');
  const [company_countyError, setCompanyCountyError] = React.useState(false);
  const [company_countyErrorMessage, setCompanyCountyErrorMessage] = React.useState('');
  const [company_invoiceError, setCompanyInvoiceError] = React.useState(false);
  const [company_invoiceErrorMessage, setCompanyInvoiceErrorMessage] = React.useState('');
  const [company_creditcardError, setCompanyCreditcardError] = React.useState(false);
  const [company_creditcardErrorMessage, setCompanyCreditcardErrorMessage] = React.useState('');
  const [company_taxnumberError, setCompanyTaxnumberError] = React.useState(false);
  const [company_taxnumberErrorMessage, setCompanyTaxnumberErrorMessage] = React.useState('');
  const [company_registerError, setCompanyRegisterError] = React.useState(false);
  const [company_registerErrorMessage, setCompanyRegisterErrorMessage] = React.useState('');
  const [company_geographicnoError, setCompanyGeographicNoError] = React.useState(false);
  const [company_geographicnoErrorMessage, setCompanyGeographicNoErrorMessage] = React.useState('');
  const [checked, setChecked] = React.useState(false);
  const phoneRegex = /^[0-9+]+$/;


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
  const handleCegjegyzekChange = (e) => setCegjegyzek(e.target.value);
  const handleHelyrajziszamChange = (e) => setHelyrajziszam(e.target.value);
  

  const handleAdoszamChange = (e) => {
    const input = e.target.value.replace(/[^0-9]/g, ""); // Csak számok engedélyezése
    let formatted = input;
  
    // Formázás kötőjelekkel
    if (input.length > 8) {
      formatted = `${input.slice(0, 8)}-${input.slice(8, 9)}-${input.slice(9, 11)}`;
    } else if (input.length > 8) {
      formatted = `${input.slice(0, 8)}-${input.slice(8)}`;
    }
  
    setAdoszam(formatted);
  };




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
        setCompanyNameError(true);
        setCompanyNameErrorMessage('Company name is required.');
      isValid = false;
      } else {
        setCompanyNameError(false);
        setCompanyNameErrorMessage('');
      }

      if (!telefon || (telefon.startsWith('+36') && telefon.length !== 12) || (telefon.startsWith('06') && telefon.length !== 11) || (!telefon.startsWith('+36') && !telefon.startsWith('06')) || (!telefon.startsWith('+3620') && !telefon.startsWith('+3630') && !telefon.startsWith('+3670') && !telefon.startsWith('0620') && !telefon.startsWith('0630') && !telefon.startsWith('0670')) || !phoneRegex.test(telefon)) {
        setCompanyPhonenumberError(true);
        setCompanyPhonenumberErrorMessage('The phone number must be valid and Hungarian.');
      isValid = false;
      } else {
        setCompanyPhonenumberError(false);
        setCompanyPhonenumberErrorMessage('');
      }

      if (!ceg_email || !/\S+@\S+\.\S+/.test(ceg_email)) {
        setCompanyEmailError(true);
        setCompanyEmailErrorMessage('Please enter a valid email address.');
        isValid = false;
      }else {
        setCompanyEmailError(false);
        setCompanyEmailErrorMessage('');
      }

      if (!jelszo || jelszo.length < 6) {
        setCompanyPasswordError(true);
        setCompanyPasswordErrorMessage('Password must be at least 6 characters long.');
        isValid = false;
      } 
      else if (!/[A-Z]/.test(jelszo)) {
        setCompanyPasswordError(true);
        setCompanyPasswordErrorMessage('Password must contain at least one uppercase letter.');
        isValid = false;
      } 
      else if (!/[a-z]/.test(jelszo)) {
        setCompanyPasswordError(true);
        setCompanyPasswordErrorMessage('Password must contain at least one lowercase letter.');
        isValid = false;
      } 
      else if (!/[0-9]/.test(jelszo)) {
        setCompanyPasswordError(true);
        setCompanyPasswordErrorMessage('Password must contain at least one number.');
        isValid = false;
      } 
      else {
        setCompanyPasswordError(false);
        setCompanyPasswordErrorMessage('');
      }

      if (!telepules || telepules.length < 1) {
        setCompanySettlementError(true);
        setCompanySettlementErrorMessage('Settelment is required.');
        isValid = false;
      } 
      else {
        setCompanySettlementError(false);
        setCompanySettlementErrorMessage('');
      }

      if (!megye || megye.length < 1) {
        setCompanyCountyError(true);
        setCompanyCountyErrorMessage('County is required.');
        isValid = false;
      } 
      else {
        setCompanyCountyError(false);
        setCompanyCountyErrorMessage('');
      }

      if (!ceges_szamla || ceges_szamla.length !== 24 || !/^\d+$/.test(ceges_szamla)) {
        setCompanyInvoiceError(true);
        setCompanyInvoiceErrorMessage('Invoice must be 24 characters long and contain only numbers.');
        isValid = false;
      }
      else {
          setCompanyInvoiceError(false);
          setCompanyInvoiceErrorMessage('');
      }

      if (!hitelkartya || hitelkartya.length !== 16 || !/^\d+$/.test(hitelkartya)) {
        setCompanyCreditcardError(true);
        setCompanyCreditcardErrorMessage('Credit card number must be 16 digits and contain only numbers.');
        isValid = false;
      } 
      else {
          setCompanyCreditcardError(false);
          setCompanyCreditcardErrorMessage('');
      }

      if (!adoszam || adoszam.replace(/[^0-9]/g, "").length < 8) {
        setCompanyTaxnumberError(true);
        setCompanyTaxnumberErrorMessage("Az adószámnak legalább 8 számjegyűnek kell lennie.");
        isValid = false;
      } else {
        setCompanyTaxnumberError(false);
        setCompanyTaxnumberErrorMessage("");
      }

      if (!cegjegyzek || cegjegyzek.length !== 10 || !/^\d{10}$/.test(cegjegyzek)) {
        setCompanyRegisterError(true);
        setCompanyRegisterErrorMessage('Company register must be 10 digits long and contain only numbers.');
        isValid = false;
      } 
      else {
          setCompanyRegisterError(false);
          setCompanyRegisterErrorMessage('');
      }

      if (!helyrajziszam ||  helyrajziszam.length < 1 || !/^\d{1,4}[-/]\d{1,4}$/.test(helyrajziszam)) {
        setCompanyGeographicNoError(true);
        setCompanyGeographicNoErrorMessage('Geographic number is required and must contain only numbers, with an optional separator ("/" or "-").');
        isValid = false;
    } else {
        setCompanyGeographicNoError(false);
        setCompanyGeographicNoErrorMessage('');
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
                    error={company_nameError}
                    helperText={company_nameErrorMessage}
                    color={company_nameError ? 'error' : 'primary'}
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
                    error={company_phonenumberError}
                    helperText={company_phonenumberErrorMessage}
                    color={company_phonenumberError ? 'error' : 'primary'}
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
                    autoComplete="ceg_email"
                    variant="outlined"
                    error={company_emailError}
                    helperText={company_emailErrorMessage}
                    color={company_emailError ? 'error' : 'primary'}
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
                    variant="outlined"
                    error={company_passwordError}
                    helperText={company_passwordErrorMessage}
                    color={company_passwordError ? 'error' : 'primary'}
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
                    variant="outlined"
                    error={company_settlementError}
                    helperText={company_settlementErrorMessage}
                    color={company_settlementError ? 'error' : 'primary'}
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
                    variant="outlined"
                    error={company_countyError}
                    helperText={company_countyErrorMessage}
                    color={company_countyError ? 'error' : 'primary'}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel htmlFor="ceges_szamla">Számlaszám</FormLabel>
                  <TextField
                    required
                    fullWidth
                    name="ceges_szamla"
                    id="ceges_szamla"
                    placeholder="12345678-12345678-12345678"
                    value={ceges_szamla}
                    onChange={handleCeges_szamlaChange}
                    variant="outlined"
                    error={company_invoiceError}
                    helperText={company_invoiceErrorMessage}
                    color={company_invoiceError ? 'error' : 'primary'}
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
                    variant="outlined"
                    error={company_creditcardError}
                    helperText={company_creditcardErrorMessage}
                    color={company_creditcardError ? 'error' : 'primary'}
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
                    variant="outlined"
                    error={company_taxnumberError}
                    helperText={company_taxnumberErrorMessage}
                    color={company_taxnumberError ? 'error' : 'primary'}
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
                    variant="outlined"
                    error={company_registerError}
                    helperText={company_registerErrorMessage}
                    color={company_registerError ? 'error' : 'primary'}
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
                    variant="outlined"
                    error={company_geographicnoError}
                    helperText={company_geographicnoErrorMessage}
                    color={company_geographicnoError ? 'error' : 'primary'}
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
