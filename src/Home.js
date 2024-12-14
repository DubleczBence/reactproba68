import React from 'react';
import { useLocation } from 'react-router-dom';



const Home = ({ onSignOut }) => {

  const location = useLocation();
  console.log(location);
  const name = location.state?.userName || location.state?.companyName;

  return (
    <div>
      <h1>Köszöntjük az oldalon, {name}!</h1>
      <p>Ez a kezdőoldal.</p>
      <button onClick={onSignOut}>Kijelentkezés</button>
    </div>
  );
};

export default Home;