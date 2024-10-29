import '@/styles/routes/signin.css';
import skiMountains from '../assets/skiMountains.jpg';
import logo from '../assets/logoCircle.png';

const Signin = () => {
  return (
    <div className="signin-container">
      <div className="signin-background">
        <div className="signin-form">
          <div className="signin-logo">
            <img src={logo} alt="Skismart Logo" className="logo-image" />
            <h2 className="logo-text">SkiSmart</h2>
          </div>
          <form className="signin-form-fields">
            <div className="form-group">
              <label htmlFor="email" className="form-label">E-Mail:</label>
              <input
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
                type="password"
                autoComplete="current-password"
                required
                className="form-input"
                placeholder="Password"
              />
            </div>
            <div className="form-links">
              <div style={{ color: 'black' }}>Don't have an account? <a href="/signup" className="signup-link">Create Account</a></div>
              <a href="#" className="forgot-password-link">
                Forgot password?
              </a>
            </div>
            <div className="form-submit">
              <button type="submit" className="submit-button">
                Sign in
              </button>
            </div>
            <div className="contact-info" style={{ width: '100%', textAlign: 'center', color: 'black', backgroundColor: 'rgba(0, 0, 0, 0)', fontSize: '12'}}>
                Contact Us: skismartwv@gmail.com (304) 449-4516
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

 export default Signin