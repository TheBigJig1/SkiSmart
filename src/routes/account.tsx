import '@/styles/routes/account.css';

function Account() {
    return (
        <div className="accountContainer">
            <div className="accountBackground">
                <img className="accountLogo" src='src/assets/logoCircle.png'></img> 
                <div className="accountTitle">SkiSmart</div>
            </div>
            <div className="accountContentContainer">
                <div className="accountHeader">
                    <h1>Your personalized experience</h1>
                </div>
            </div>
        </div>
    );
}

export default Account;