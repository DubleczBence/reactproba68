import './App.css';
import React, { useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import SignUp from './SignUp';
import SignIn from './SignIn';
import Home from './Home';
import CompHome from './Comp_Home';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate(); // Helyezd a hookot ide
  

  const getToken = () => {
    return localStorage.getItem('token');
  };

  const handleSendData = async ({ data }) => {
    console.log('Received data from Home:', { data });

    const token = getToken(); // Token lekérése
    if (!token) {
      alert('Nincs bejelentkezve!');
      return;
    }

    const endpoint = 'http://localhost:3001/api/main/home';

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Token hozzáadása a fejlécben
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (response.ok) {
        alert('Adatok sikeresen elküldve!');
      } else {
        alert(`Hiba: ${result.error}`);
      }
    } catch (error) {
      console.error('Hiba az adatok küldése közben:', error);
      alert('Az adatok küldése nem sikerült. Kérlek, próbáld újra.');
    }
  };
  


  const HandleSignUpData = async ({ type, data }) => {
    console.log('Received data from SignUp:', { type, data });

    const endpoint =
      type === 'user'
        ? 'http://localhost:3001/api/users/sign-up'
        : 'http://localhost:3001/api/companies/sign-up';

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (response.ok) {
        alert('Registration successful!');
        navigate('/sign-in');
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error('Error during registration:', error);
      alert('Failed to register. Please try again.');
    }
  };

  const HandleSignInData = async ({ type, data }) => {
    console.log('Received data from SignIn:', { type, data });

    const endpoint =
      type === 'user'
        ? 'http://localhost:3001/api/users/sign-in'
        : 'http://localhost:3001/api/companies/sign-in';
  
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
        alert('Bejelentkezés sikeres!');
        setIsAuthenticated(true); // Frissítsd az autentikáció állapotát


         // Token mentése a localStorage-ba
         if (result.token) {
          localStorage.setItem('token', result.token);
        }


        if (type === 'user') {
          navigate('/home', { state: { userName: result.name } }); // Felhasználói név
        } else if (type === 'company') {
          navigate('/comp_home', { state: { companyName: result.cegnev } }); // Céges név
        }

      } else {
        alert(`Hiba: ${result.error}`);
      }
    } catch (error) {
      console.error('Hiba a bejelentkezés során:', error);
      alert('A bejelentkezés nem sikerült. Kérlek, próbáld újra.');
    }
  };
  

  const HandleSignOut = () => {
    setIsAuthenticated(false);
    navigate('/sign-in');
  };

  return (
    <Routes>
      <Route path="/" element={<SignIn  onSignIn={HandleSignInData}/>} />
      <Route path="/sign-in" element={<SignIn onSignIn={HandleSignInData} />} />
      <Route path="/sign-up" element={<SignUp onSignUp={HandleSignUpData} />} />
      <Route path="/home" element={ isAuthenticated ? (<Home onSendData={handleSendData} onSignOut={HandleSignOut} /> ) : ( <SignIn />)} />
      <Route path="/comp_home" element={isAuthenticated ? <CompHome onSignOut={HandleSignOut} /> : <SignIn />} />
    </Routes>
);
}

export default App;
