import '@/styles/routes/signin.css';
import skiMountains from '../assets/skiMountains.jpg';
import logo from '../assets/logo.png';


const Signin = () => {
  return (
    <div className="signin-container">
      <div className="signin-background" style={{ backgroundImage: `url(${skiMountains})` }}>
        <div className="signin-form">
          <div className="signin-logo">
            <img src={logo} alt="Skismart Logo" className="logo-image" />
            <h2 className="logo-text">Skismart</h2>
          </div>
          <form className="signin-form-fields">
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
              />
            </div>
            <div className="form-links">
              <a href="/signup" className="signup-link">
                Don't have an account? Create Account here
              </a>
              <a href="#" className="forgot-password-link">
                Forgot password?
              </a>
            </div>
            <div className="form-submit">
              <button type="submit" className="submit-button">
                Sign in
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className="contact-info">
        Contact Us: skismartwv@gmail.com (304) 449-4516
      </div>
    </div>
  );
};

 export default Signin