import '@/styles/routes/account.css';

function Account() {
    return (
        <div className="accountContainer">
            <div className="accountContentContainer">
                <div className="accountHeader">
                    <h1>Welcome #Name#!</h1>
                </div>
                <div className="accountPersonal">
                    <div className="accountResorts">
                        <ol>
                            <h3>Your Resorts</h3>
                            <li>Wisp</li>
                            <li>Timberline</li>
                            <li>Hell</li>
                        </ol>
                    </div>
                    <div className="accountInfo">
                        <ul>
                            <li>Your name: </li>
                            <li>I dont know</li>
                            <li>uh</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Account;