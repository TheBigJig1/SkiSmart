import '@/styles/routes/signin.css';
import skiMountains from '../assets/skiMountains.jpg';
import logo from '../assets/logoCircle.png';

function Signup() {
    return (
        <div className="signin-container">
            {/*id how to comment but pretend this isnt here*/}
            {/*need to change image based on window size*/}
        <div className="signin-background" style={{ backgroundImage: `url(${skiMountains})` }}>
          <div className="signin-form">
            <div className="signin-logo">
              <img src={logo} alt="Skismart Logo" className="logo-image" />
              <h2 className="logo-text">SkiSmart</h2>
            </div>
            <form className="signin-form-fields">
              <div className="form-group">
                <label htmlFor="full-name" className="form-label">Full Name:</label>
                <input 
                    required
                    className="form-input"
                    placeholder="Firstname Lastname"
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
              <div className="form-group">
                <label htmlFor="zipcode" className="form-label">Zipcode (Optional):</label>
                <input 
                    className="form-input"
                    placeholder="XXXXX"
                />
              </div>
              <div className="form-submit">
                <button type="submit" className="submit-button">
                  Create Account
                </button>
              </div>
            </form>
          </div>
          <div className="contact-info" style={{ position: 'absolute', bottom: '1rem', width: '100%', textAlign: 'center', color: 'white', backgroundColor: 'rgba(0, 0, 0, 0)', padding: '0.5rem 0' }}>
            Contact Us: skismartwv@gmail.com (304) 449-4516
          </div>
        </div>
      </div>
    )
 }

 export default Signup