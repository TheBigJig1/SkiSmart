import '@/styles/routes/home.css';

function Home() {
    return (
        <div className="container">
            <div className="landingBackground">
                <img className="landingLogo" src='src/assets/logoCircle.png'></img> 
                <div className="landingTitle">SkiSmart</div>
            </div>
            <div className = "textContainer">
                <h1>Welcome to SkiSafe: Your Ultimate Companion for Safer Skiing</h1>
                <h2>Real-Time Weather and Ski Conditions at Your Fingertips</h2>
                    <p>
                        <strong>Experience the thrill of the slopes with confidence.</strong> SkiSafe provides you with current weather updates and detailed ski conditions for your favorite snow sports areas, ensuring you have all the information you need for a safe and enjoyable adventure.
                    </p>
                <h3>Why Choose SkiSafe?</h3>
                    <ul>
                        <li>
                            <strong>Stay Informed:</strong> Access real-time weather forecasts, snowfall reports, and temperature readings.
                        </li>
                        <li>
                            <strong>Know the Slopes:</strong> Get detailed information on trail conditions, lift statuses, and terrain parks.
                        </li>
                        <li>
                            <strong>Stay Connected:</strong> Share your experiences and always have ski patrol at your fingertips.
                        </li>
                        <li>
                            <strong>Safety Alerts:</strong> Receive immediate notifications about avalanche warnings, trail closures, and other safety concerns.
                        </li>
                        <li>
                            <strong>Plan Ahead:</strong> View extended forecasts and historical data to plan the perfect ski trip.
                        </li>
                        <li>
                            <strong>Personalized Experience:</strong> Customize your dashboard to focus on the locations and data that matter most to you.
                        </li>
                    </ul>
                <h3>Your Safety is Our Priority</h3>
                <p>
                At SkiSafe, we believe that safety enhances enjoyment. By providing accurate and timely information, we empower you to make informed decisions, reduce risks, and fully embrace the joy of snow sports.
                </p>
                <h3>Ready to Elevate Your Skiing Experience?</h3>
                    <p>
                        <strong>Join SkiSafe today and glide into a safer, more informed adventure on the slopes.</strong>
                    </p>
                    <a href="./signin" style={{ textDecoration: 'none' }}>
                        <button style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}>Get Started Now</button>
                    </a>
                <hr />

                <p style={{ fontStyle: 'italic', textAlign: 'center' }}>
                    Stay safe. Stay informed. Enjoy every moment with SnowSafe.
                </p>
            </div>
        </div>
    );
}

export default Home;