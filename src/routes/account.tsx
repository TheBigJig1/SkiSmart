import '@/styles/routes/account.css';
import { useState, useEffect } from 'react';

function Account() {

    const [name, setName] = useState('Guest');

  useEffect(() => {
    // Retrieve user data from localStorage
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user && user.first) {
      setName(user.first);
    }
  }, []);

    return (
        <div className="accountContainer">
            <div className="accountBackground">
                <div className="accountHeader">
                    <h1>Welcome {name}!</h1>
                </div>
            </div>
            <div className="accountContentContainer">
                <div className="accountPersonal">
                    <div className="accountResorts">
                        <ol>
                            <h3>Your Resorts:</h3>
                            <li>Wisp</li>
                            <li>Timberline</li>
                            <li>Hell</li>
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