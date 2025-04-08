import * as React from 'react';
import { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

function ForgotPassword({ open, handleClose, isCompany }) {
  const [step, setStep] = useState('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('success');

  const showAlert = (message, severity = 'success') => {
    setAlertMessage(message);
    setAlertSeverity(severity);
    setAlertOpen(true);
  };

  const handleCloseAlert = () => {
    setAlertOpen(false);
  };

  const handleSendCode = async () => {
    try {
      const endpoint = isCompany 
        ? 'https://optify.onrender.com/api/companies/forgot-password'
        : 'https://optify.onrender.com/api/users/forgot-password';
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: email 
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        showAlert('Biztonsági kód elküldve az email címre');
        setStep('code');
      } else {
        showAlert(data.error || 'Hiba történt a kód küldése során', 'error');
      }
    } catch (error) {
      console.error('Error sending code:', error);
      showAlert('Hiba történt a kód küldése során', 'error');
    }
  };

  const handleVerifyCode = async () => {
    try {
      const endpoint = isCompany 
        ? 'https://optify.onrender.com/api/companies/verify-reset-code'
        : 'https://optify.onrender.com/api/users/verify-reset-code';
      
      const requestBody = isCompany
        ? { ceg_email: email, code, newPassword }
        : { email, code, newPassword };
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        showAlert('Jelszó sikeresen visszaállítva');
        setTimeout(() => {
          handleClose();
          setStep('email');
          setEmail('');
          setCode('');
          setNewPassword('');
        }, 1500);
      } else {
        showAlert(data.error || 'Hiba történt a jelszó visszaállítása során', 'error');
      }
    } catch (error) {
      console.error('Error verifying code:', error);
      showAlert('Hiba történt a jelszó visszaállítása során', 'error');
    }
  };

  const handleReset = () => {
    setStep('email');
    setEmail('');
    setCode('');
    setNewPassword('');
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
        <DialogTitle>Jelszó visszaállítása {isCompany ? 'Cég' : 'Felhasználó'} számára</DialogTitle>
        <DialogContent>
          {step === 'email' && (
            <>
              <DialogContentText>
                Adja meg e-mail címét, és küldünk egy ellenőrző kódot.
              </DialogContentText>
              
              <OutlinedInput
                autoFocus
                required
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={isCompany ? "Céges email cím" : "Email cím"}
                type="email"
                sx={{ mt: 2 }}
              />
              <Button 
                variant="contained" 
                fullWidth 
                onClick={handleSendCode}
                sx={{ mt: 2 }}
                disabled={!email}
              >
                Kód küldése
              </Button>
            </>
          )}

          {step === 'code' && (
            <>
              <DialogContentText>
                Írja be az e-mailre küldött 5 számjegyű kódot.
              </DialogContentText>
              <Stack spacing={2} sx={{ mt: 2 }}>
                <OutlinedInput
                  required
                  fullWidth
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Biztonsági kód"
                />
                <OutlinedInput
                  required
                  fullWidth
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  type="password"
                  placeholder="Új jelszó"
                />
                <Button 
                  variant="contained" 
                  fullWidth 
                  onClick={handleVerifyCode}
                  disabled={!code || !newPassword}
                >
                  Jelszó visszaállítása
                </Button>
                <Button 
                  variant="outlined" 
                  fullWidth 
                  onClick={handleReset}
                >
                  Vissza
                </Button>
              </Stack>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Mégse</Button>
        </DialogActions>
      </Dialog>
      
      <Snackbar 
        open={alertOpen} 
        autoHideDuration={6000} 
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseAlert} severity={alertSeverity} sx={{ width: '100%' }}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </>
  );
}

export default ForgotPassword;