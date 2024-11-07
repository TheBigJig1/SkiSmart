import '@/styles/routes/signin.css';
import logo from '../assets/logoCircle.png';
import { useState } from 'react';

function Signin() {
  // State to store form inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Form submission handler
  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault(); // Prevent the default form submission

    try {
      // Sending the form data to the server
      const response = await fetch('http://localhost:8080/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (response.ok) {
        // Handle successful response (e.g., navigate to another page or display a message)
        console.log('Login successful');
        // Optionally, you can redirect the user:
        // window.location.href = '/';
      } else {
        // Handle error response
        console.error('Login failed');
        alert('Invalid email or password');
      }
    } catch (error) {
      console.error('An error occurred:', error);
      alert('An error occurred during login. Please try again.');
    }
  };

  return (
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
              Don't have an account? <a href="/signup" className="signup-link">Create Account</a>
            </div>
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
  );
};

export default Signin;