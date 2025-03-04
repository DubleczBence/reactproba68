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
      <DialogTitle>Reset Password</DialogTitle>
      <DialogContent>
        {step === 'email' && (
          <>
            <DialogContentText>
              Enter your email address and we'll send you a verification code.
            </DialogContentText>
            <OutlinedInput
              autoFocus
              required
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              type="email"
              sx={{ mt: 2 }}
            />
            <Button 
              variant="contained" 
              fullWidth 
              onClick={handleSendCode}
              sx={{ mt: 2 }}
            >
              Send Code
            </Button>
          </>
        )}

        {step === 'code' && (
          <>
            <DialogContentText>
              Enter the 5-digit code sent to your email.
            </DialogContentText>
            <Stack spacing={2} sx={{ mt: 2 }}>
              <OutlinedInput
                required
                fullWidth
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Security Code"
              />
              <OutlinedInput
                required
                fullWidth
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                type="password"
                placeholder="New Password"
              />
              <Button 
                variant="contained" 
                fullWidth 
                onClick={handleVerifyCode}
              >
                Reset Password
              </Button>
            </Stack>
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
}

export default ForgotPassword;