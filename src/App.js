import './App.css';
import React, { useState, useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import SignUp from './SignUp';
import SignIn from './SignIn';
import Home from './Home';
import CompHome from './Comp_Home';
import AdminDashboard from './AdminDashboard'; 
import CustomizedSnackbars from './CustomizedSnackbars';
import { BackgroundProvider } from './BackgroundContext';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false); 
  const navigate = useNavigate(); 
  
  const validateToken = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsAuthenticated(false);
      setIsAdmin(false);
      return false;
    }
    try {
      setIsAuthenticated(true);
      setIsAdmin(localStorage.getItem('isAdmin') === 'true');
      return true;
    } catch (error) {
      setIsAuthenticated(false);
      setIsAdmin(false);
      localStorage.removeItem('token');
      localStorage.removeItem('isAdmin');
      return false;
    }
  };

  useEffect(() => {
    validateToken();
  }, []);

  const getToken = () => {
    return localStorage.getItem('token');
  };

  const handleSendData = async ({ data }) => {
    console.log('Received data from Home:', { data });

    const token = getToken(); 
    if (!token) {
      alert('Nincs bejelentkezve!');
      return;
    }

    const endpoint = 'https://optify.onrender.com/api/main/home';

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (response.ok) {
        setSnackbar({ open: true, message: 'Adatok sikeresen elküldve!', severity: 'success' });
      } else {
        setSnackbar({ open: true, message: `Error: ${result.error}`, severity: 'error' });
      }
    } catch (error) {
      console.error('Hiba az adatok küldése közben:', error);
      setSnackbar({ open: true, message: 'Az adatok küldése nem sikerült. Kérlek próbáld újra.', severity: 'error' });
    }
  };
  
  const HandleSignUpData = async ({ type, data }) => {
    console.log('Received data from SignUp:', { type, data });

    const endpoint =
      type === 'user'
        ? 'https://optify.onrender.com/api/users/sign-up'
        : 'https://optify.onrender.com/api/companies/sign-up';

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (response.ok) {
        setSnackbar({ open: true, message: 'Sikeres regisztráció!', severity: 'success' });
        navigate('/sign-in');
      } else {
        setSnackbar({ open: true, message: `Error: ${result.error}`, severity: 'error' });
      }
    } catch (error) {
      console.error('Error during registration:', error);
      setSnackbar({ open: true, message: 'Failed to register. Please try again.', severity: 'error' });
    }
  };

  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const HandleSignInData = async ({ type, data }) => {
    console.log('Received data from SignIn:', { type, data });

    const endpoint =
      type === 'user'
        ? 'https://optify.onrender.com/api/users/sign-in'
        : 'https://optify.onrender.com/api/companies/sign-in';
  
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
  
      console.log('Response:', response);
      const result = await response.json();
      console.log('Result:', result);
  
      if (response.ok) {
        setSnackbar({ open: true, message: 'Sikeres bejelentkezés!', severity: 'success' });
        setIsAuthenticated(true);
        
        if (result.token) {
          localStorage.setItem('token', result.token);
          
          if (result.isAdmin) {
            setIsAdmin(true);
            localStorage.setItem('isAdmin', 'true');
            navigate('/admin');
            return;
          } else {
            setIsAdmin(false);
            localStorage.setItem('isAdmin', 'false');
          }
          
          if (type === 'company') {
            localStorage.setItem('cegId', result.cegId);
          }
        }

        if (type === 'user') {
          console.log('User ID:', result.id);
          navigate('/home', { state: { userName: result.name, userId: result.id } }); 
        } else if (type === 'company') {
          navigate('/comp_home', { state: { companyName: result.cegnev, cegId: result.cegId } }); 
        }
      } else {
        setSnackbar({ open: true, message: `Error: ${result.error}`, severity: 'error' });
      }
    } catch (error) {
      console.error('Hiba a bejelentkezés során:', error);
      setSnackbar({ open: true, message: 'A bejelentkezés nem sikerült. Kérlek próbáld újra.', severity: 'error' });
    }
  };
  
  const HandleSignOut = () => {
    setIsAuthenticated(false);
    setIsAdmin(false);
    localStorage.removeItem('token');
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('cegId');
    navigate('/sign-in');
  };

  return (
    <BackgroundProvider>
    <div>
      <Routes>
        <Route path="/" element={<SignIn onSignIn={HandleSignInData}/>} />
        <Route path="/sign-in" element={<SignIn onSignIn={HandleSignInData} />} />
        <Route path="/sign-up" element={<SignUp onSignUp={HandleSignUpData} />} />
        <Route path="/home" element={isAuthenticated ? (<Home onSendData={handleSendData} onSignOut={HandleSignOut} />) : (<SignIn />)} />
        <Route path="/comp_home" element={isAuthenticated ? <CompHome onSignOut={HandleSignOut} /> : <SignIn />} />
        <Route path="/admin" element={isAuthenticated && isAdmin ? <AdminDashboard onSignOut={HandleSignOut} /> : <SignIn />} />
      </Routes>
      <CustomizedSnackbars
        open={snackbar.open}
        handleClose={handleCloseSnackbar}
        message={snackbar.message}
        severity={snackbar.severity}
      />
    </div>
    </BackgroundProvider>
  );
}

export default App;