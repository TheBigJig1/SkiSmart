import '@/styles/routes/home.css';

function Home() {
    return (
        <div className="container">
            <div className="homeBackground">
                <img className="homeLogo" src='src/assets/logoCircle.png'></img> 
                <div className="homeTitle">SkiSmart</div>
            </div>
            <div className="textContainer">
                Home page info
            </div>
        </div>
    );
}

export default Home;