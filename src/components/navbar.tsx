import { useState, useEffect } from 'react';
import '@/styles/components/navbar.css';

function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if the user is already signed in, for example by checking local storage or session
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);


  return (
    <div className='navbarContainer'>
      <div className='navLeft'>
        <a href='/'>SkiSmart</a>
        <div className='imgContainer'>
          <img src='src/assets/logo.png' alt='Logo' />
        </div>
      </div>

      <div className='navRight'>
        <a href='/'>Home</a>
        <a href='/resorts'>Resorts</a>
        <a href='/feedback'>Feedback</a>
        {isAuthenticated ? (
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