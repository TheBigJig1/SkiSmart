import React from 'react';
import '../styles/routes/home.css';
import homeBackground from '../assets/homeBackground.jpeg';

function Home() {
    return (
        <div>
            <div className="image-container">
                <img src={homeBackground} alt="Top Image" />
            </div>
            <div>
                Home page
            </div>
        </div>
    );
}

export default Home;