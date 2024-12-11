import './styles/routes/signin.css';
import logo from '../assets/logoCircle.png';
import { useState } from 'react';

function Signin() {
  // State to store form inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      // Prepare form data
      const formData = new URLSearchParams();
      formData.append('email', email);
      formData.append('password', password);

      // Sending form data to server
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
      console.log(API_BASE_URL)

      const response = await fetch(`${API_BASE_URL}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
        // credentials: 'include',
      });

      if (response.ok) {
        // Handle successful response
        const data = await response.json();
        const token = data.token;

        // Store token in localstorage 
        localStorage.setItem('token', token);

        console.log('Login successful');

        // Redirect the user to account page
        window.location.href = '/account'
      } else {
        console.error('Login failed');
        alert('Invalid email or password');
      }
    } catch (error) {
      // catch login error
      console.error('An error occurred', error);
      alert('An error occurred during login. Please try again.');
    }
  }

  return (
    <div className="signin-background">
      <div className="signin-container">
        <div className="signin-form">
          <div className="signin-logo">
            <img src={logo} alt="SkiSmart Logo" className="logo-image" />
            <h2 className="logo-text">SkiSmart</h2>
          </div>
          <form className="signin-form-fields" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email" className="form-label">E-Mail:</label>
              <input
                type="email"
                autoComplete="email"
                required
                className="form-input"
                placeholder="user@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="password" className="form-label">Password:</label>
              <input
                type="password"
                autoComplete="current-password"
                required
                className="form-input"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="form-links">
              <div style={{ color: 'black' }}>
                Don't have an account?
              </div>
              <a href="/signup" className="signup-link">Create Account</a>
              <a href="#" className="forgot-password-link">
                Forgot password?
              </a>
            </div>
            <div className="form-submit">
              <button type="submit" className="submit-button">
                Sign in
              </button>
            </div>
            <div className="contact-info" style={{ width: '100%', textAlign: 'center', color: 'black', backgroundColor: 'rgba(0, 0, 0, 0)', fontSize: '12px' }}>
              Contact Us: skismartwv@gmail.com (304) 449-4516
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signin;