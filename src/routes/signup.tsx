import '@/styles/routes/signin.css';
import logo from '../assets/logoCircle.png';
import React, { useState } from 'react';

const Signup: React.FC = () => {
  const [formData, setFormData] = useState({
    fullname: '',
    email: '', 
    password: '',
    zipcode: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value} = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e:React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8080/user/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        // Handle successful response
        console.log('Account created successfully');
      } else {
        // Handle error response
        console.error('Error creating account');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

    return (
        <div className="signin-container">
            {/*id how to comment but pretend this isnt here*/}
            {/*need to change image based on window size*/}
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
                  value={formData.fullname}
                  onChange={handleChange}
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
                  value={formData.email}
                  onChange={handleChange}
                />
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
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="zipcode" className="form-label">Zipcode (Optional):</label>
                <input 
                    type="text"
                    name="zipcode"
                    className="form-input"
                    placeholder="XXXXX"
                    value={formData.zipcode}
                    onChange={handleChange}
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
    )
 }

 export default Signup