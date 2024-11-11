import '@/styles/routes/account.css';

function Account() {
    return (
        <div className="accountContainer">
            <div className="accountBackground">
                <div className="accountHeader">
                    <h1>Welcome #Name#!</h1>
                </div>
            </div>
            <div className="accountContentContainer">
                <div className="accountPersonal">
                    <div className="accountResorts">
                        <ol>
                            <h3>Your Resorts:</h3>
                            <li>Wisp</li>
                            <li>Timberline</li>
                            <li>Random Mountain</li>
                        </ol>
                    </div>
                    <div className="accountInfo">
                        <ul>
                            <h3>Your Info:</h3>
                            <li>Resorts Viewed: </li>
                            <li>Trips Completed: </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Account;