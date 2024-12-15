// This file defines the Navbar component which is used to navigate through different pages of the application.

import { useState, useEffect } from 'react';
import { isAuthenticated } from '../utils/auth';
import '../styles/components/navbar.css';
import logoImg from '../assets/logo.png';

/**
 * The Navbar component is used to navigate through different pages of the application.
 * 
 * @returns {JSX.Element} - Returns the JSX element of the component.
 */
function Navbar() {
  // State to store the authentication status
  const [authenticated, setAuthenticated] = useState(false);

  // Check if the user is authenticated when the component mounts
  useEffect(() => {
    isAuthenticated() ? setAuthenticated(true) : setAuthenticated(false);
  }, []);


  return (
    <div className='navbarContainer'>
      <div className='navLeft'>
        {/* The logo and the name of the application */}
        <a href='/'>SkiSmart</a>
        <div className='imgContainer'>
          <img src={logoImg} alt="Logo" /></div>
      </div>

      {/* The navigation links */}
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