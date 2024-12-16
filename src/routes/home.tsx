import '@/styles/routes/home.css';
import { useEffect, useState } from 'react';
import { isAuthenticated } from '../utils/auth';

function Home() {
    
    const [authenticated, setAuthenticated] = useState(false);

    useEffect(() => {
        isAuthenticated() ? setAuthenticated(true) : setAuthenticated(false);
    }, []);

    return (
        <div className="pageContainer">
            <div className="pageBackground">
                <img className="logo" src='../assets/logoCircle.png'></img> 
                <div className="title">SkiSmart</div>
            </div>
            <div className="contentContainer">
                <div className="intro">
                    <h1>Welcome to SkiSmart<br></br>Your Ultimate Companion for Smarter Skiing</h1>
                </div>
                <div className="mission">
                    <h2>Our Mission</h2>
                    <p style={{textAlign: 'center' }}>
                        At SkiSmart, our mission is to enhance your skiing experience by providing you with the most 
                        accurate and up-to-date information. We aim to ensure your safety and enjoyment on the slopes 
                        through innovative technology and reliable data.
                    </p>
                    <ul>
                        <li>Provide real-time weather updates and forecasts.</li>
                        <li>Offer detailed trail maps and conditions.</li>
                        <li>Deliver safety tips and alerts for skiers of all levels.</li>
                        <li>Promote sustainable and responsible skiing practices.</li>
                    </ul>
                </div>
                <div className="popularResorts">
                    <h1>Explore Popular Resorts</h1>
                    <a href="/resorts">
                        <div className="exploreButtonContainer">
                            <img className="exploreButtonImg" src="../assets/exploreButton.png" alt="Explore Resorts" />
                        </div>
                    </a>
                </div>
                <div className="NOAA">
                    <div className="NOAAText">
                    <h2> NOAA Data</h2>
                        <p>
                            Our program leverages the comprehensive weather data provided by the National Oceanic and Atmospheric 
                            Administration (NOAA) to accurately predict snow conditions. By integrating real-time and historical 
                            weather data, including temperature, precipitation, and atmospheric pressure, we can offer precise forecasts 
                            and insights into snow conditions on the slopes. This data-driven approach ensures that skiers are well-informed 
                            about current and upcoming snow conditions, enhancing their safety and overall skiing experience.
                        </p>
                    </div>
                    <img className="NOAAImg" src='../assets/NOAALandingImg.png'></img> 
                </div>
                <div className="team">
                    <img className="teamImg" src='src\assets\Group Photo.JPG'></img> 
                    <div className="teamText">
                        <h2 className="teamText">The Team</h2>
                            <p>
                                We are a group of 8 Computer Science and Engineering students at WVU. We developed SkiSmart in our Intro to Software Engineering class.
                            </p>
                            <p>
                                Team Members: Michael Adams, Jaxon Fielding, Tristan Girardi, Tyler Lannon, Jacob Milkie, Logan Noroski, Landon Urcho, Caden Youngblood.
                            </p>
                    </div>
                </div>
                <div className="footer">
                    <h3>Ready to Elevate Your Skiing Experience?</h3>
                        <p>
                            <strong>Join SkiSmart today and glide into a safer, more informed adventure on the slopes.</strong>
                        </p>
                        <a href={authenticated ? "./account" : "./signin"} style={{ textDecoration: 'none' }}>
                            <button className="signinRedirect" style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer', background: 'black', color: 'white'}}>
                                {isAuthenticated() ? 'View Your Account' : 'Get Started Now'}
                            </button>
                        </a>
                    <p style={{ fontStyle: 'italic', textAlign: 'center' }}>
                        Stay safe. Stay informed. Enjoy every moment with SkiSmart.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Home;