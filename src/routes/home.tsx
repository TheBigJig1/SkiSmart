import '@/styles/routes/home.css';

function Home() {
    return (
        <div className="pageContainer">
            <div className="pageBackground">
                <img className="logo" src='src/assets/logoCircle.png'></img> 
                <div className="title">SkiSmart</div>
            </div>
            <div className="contentContainer">
                <div className="intro">
                    <h1>Welcome to SkiSmart: Your Ultimate Companion for Safer Skiing</h1>
                </div>
                <div className="mission">
                    <h2>Our Mission</h2>
                    <p>
                        MISSION STUFF MISSION STUFF MISSION STUFF MISSION STUFF MISSION STUFF MISSION STUFF
                        MISSION STUFF MISSION STUFF MISSION STUFF MISSION STUFF MISSION STUFF MISSION STUFF
                    </p>
                </div>
                <div className="NOAA">
                    <h2 className="NOAAText"> NOAA Data
                        <p>
                            NOAA NOAA NOAA NOAA NOAA NOAA NOAA NOAA NOAA NOAA NOAA NOAA
                            NOAA NOAA NOAA NOAA NOAA NOAA NOAA NOAA NOAA NOAA NOAA NOAA
                            NOAA NOAA NOAA NOAA NOAA NOAA NOAA NOAA NOAA NOAA NOAA NOAA
                        </p>
                    </h2>
                    <div className="NOAAImg"> </div>

                </div>
                <div className="team">
                    <div className="teamImg"></div>
                    <h2 className="teamText">The team
                        <p>
                            TEAM TEAM TEAM TEAM TEAM TEAM TEAM TEAM TEAM TEAM
                            TEAM TEAM TEAM TEAM TEAM TEAM TEAM TEAM TEAM TEAM
                            TEAM TEAM TEAM TEAM TEAM TEAM TEAM TEAM TEAM TEAM
                        </p>
                    </h2>
                </div>
                <div className="footer">
                    <h3>Ready to Elevate Your Skiing Experience?</h3>
                        <p>
                            <strong>Join SkiSmart today and glide into a safer, more informed adventure on the slopes.</strong>
                        </p>
                        <a href="./signin" style={{ textDecoration: 'none' }}>
                            <button style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer', background: 'black', color: 'white'}}>Get Started Now</button>
                        </a>
                    <hr />

                    <p style={{ fontStyle: 'italic', textAlign: 'center' }}>
                        Stay safe. Stay informed. Enjoy every moment with SkiSmart.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Home;