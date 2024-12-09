import '@/styles/routes/signin.css';
import logo from '../assets/logoCircle.png';
import React, { useState } from 'react';

const Signup: React.FC = () => {
  // State to store form inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullname, setFullname] = useState('');
  const [zipcode, setZipcode] = useState('');

  // State to store error messages
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Function to validate email format
  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  // Function to validate password strength
  const validatePassword = (password: string) => {
    // Password must be at least 8 characters long, contain at least one number and one special character
    const re = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
    return re.test(password);
  };

  const handleSubmit = async (e:React.FormEvent) => {
    e.preventDefault();

        // Reset error messages
        setEmailError('');
        setPasswordError('');
    
        // Validate email and password
        let valid = true;
        if (!validateEmail(email)) {
          setEmailError('Please enter a valid email address.');
          valid = false;
        }
    
        if (!validatePassword(password)) {
          setPasswordError('Password must be at least 8 characters long, contain at least one number and one special character.');
          valid = false;
        }
    
        if (!valid) {
          return;
        }

    try {

      const formData = new URLSearchParams();
      formData.append('fullname', fullname);
      formData.append('email', email);
      formData.append('password', password);
      formData.append('zipcode', zipcode);
      
      const response = await fetch('http://localhost:8080/users/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formData.toString(),
        // credentials: 'include',
      });

      if (response.ok) {
        // Handle successful response
        console.log('Account created successfully');
        alert('Account created successfully, redirecting to Sign In page!');
        window.location.href = '/signin';

      } else {
        // Handle error response
        console.error('Error creating account');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

    return (
      <div className="signin-background">
        <div className="signin-container">
          <div className="signin-form">
            <div className="signin-logo">
              <img src={logo} alt="Skismart Logo" className="logo-image" />
              <h2 className="logo-text">SkiSmart</h2>
            </div>
            <form className="signup-form-fields" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="full-name" className="form-label">Full Name:</label>
                <input
                  name="fullname"
                  required
                  className="form-input"
                  placeholder="Firstname Lastname"
                  value={fullname}
                  onChange={(e) => setFullname(e.target.value)}
            />
              </div>  
              <div className="form-group">
                <label htmlFor="email" className="form-label">E-Mail:</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="form-input"
                  placeholder="user@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {emailError && <p style={{ color: 'red' }}>{emailError}</p>}
              </div>
              <div className="form-group">
                <label htmlFor="password" className="form-label">Password:</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="form-input"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {passwordError && <p style={{ color: 'red' }}>{passwordError}</p>}
              </div>
              <div className="form-group">
                <label htmlFor="zipcode" className="form-label">Zipcode (Optional):</label>
                <input 
                    type="text"
                    name="zipcode"
                    className="form-input"
                    placeholder="XXXXX"
                    value={zipcode}
                    onChange={(e) => setZipcode(e.target.value)}
                />
              </div>
              <div className="form-submit">
                <button type="submit" className="submit-button">
                  Create Account
                </button>
              </div>
              <div className="contact-info" style={{ width: '100%', textAlign: 'center', color: 'black', backgroundColor: 'rgba(0, 0, 0, 0)'}}>
                Contact Us: skismartwv@gmail.com (304) 449-4516
              </div>
            </form>
          </div>
        </div>
      </div>
    )
 }

 export default Signup