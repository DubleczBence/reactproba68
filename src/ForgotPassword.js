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

function ForgotPassword({ open, handleClose }) {
  const [step, setStep] = useState('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleSendCode = async () => {
    const response = await fetch('http://localhost:3001/api/users/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    if (response.ok) {
      setStep('code');
    }
  };

  const handleVerifyCode = async () => {
    const response = await fetch('http://localhost:3001/api/users/verify-reset-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code, newPassword })
    });
    if (response.ok) {
      handleClose();
      setStep('email');
      setEmail('');
      setCode('');
      setNewPassword('');
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle>Jelszó visszaállítása</DialogTitle>
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
              placeholder="Email cím"
              type="email"
              sx={{ mt: 2 }}
            />
            <Button 
              variant="contained" 
              fullWidth 
              onClick={handleSendCode}
              sx={{ mt: 2 }}
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
              >
                Jelszó visszaállítása
              </Button>
            </Stack>
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Mégse</Button>
      </DialogActions>
    </Dialog>
  );
}

export default ForgotPassword;