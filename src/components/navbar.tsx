import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '@/styles/components/navbar.css';

function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user is already signed in, for example by checking local storage or session
    const token = localStorage.getItem('authToken');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleSignOut = () => {
    // Sign the user out
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
    navigate('/');
  };

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
            <button className='signOutButton' onClick={handleSignOut}>
              Sign Out
            </button>
          </>
        ) : (
          <a href='/signin'>Sign In</a>
        )}
      </div>
    </div>
  );
}

export default Navbar;