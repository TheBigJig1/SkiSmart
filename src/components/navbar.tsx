import { useState, useEffect } from 'react';
import { isAuthenticated } from '../utils/auth';
import '../styles/components/navbar.css';
import logoImg from '../assets/logo.png';

function Navbar() {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    isAuthenticated() ? setAuthenticated(true) : setAuthenticated(false);
  }, []);


  return (
    <div className='navbarContainer'>
      <div className='navLeft'>
        <a href='/'>SkiSmart</a>
        <div className='imgContainer'>
          <img src={logoImg} alt="Logo" /></div>
      </div>

      <div className='navRight'>
        <a href='/'>Home</a>
        <a href='/resorts'>Resorts</a>
        <a href='/feedback'>Feedback</a>
        {authenticated ? (
          <>
            <a href='/account'>Account</a>
          </>
        ) : (
          <a href='/signin'>Sign In</a>
        )}
      </div>
    </div>
  );
}

export default Navbar;