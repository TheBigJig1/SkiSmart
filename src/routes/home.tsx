import '@/styles/routes/home.css';

function Home() {
    return (
        <div className="container">
            <div className="backgroundImg">
                <img src='src/assets/logoCircle.png' className="logo"></img> 
                <div className="title">SkiSmart</div>
            </div>
            <div className="textContainer">
                Home page info
            </div>
        </div>
    );
}

export default Home;