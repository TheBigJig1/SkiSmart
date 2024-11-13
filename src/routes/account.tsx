import '@/styles/routes/account.css';
import { useState, useEffect } from 'react';
import { jwtDecode }  from 'jwt-decode';

function Account() {

    const [name, setName] = useState('Guest');

    useEffect(() => {
        // Retrieve user data from localStorage

        const token = localStorage.getItem('token') || ''
        const decoded = jwtDecode(token) as { user: { email: string; first: string; last: string; zipcode: string } };
        const user = decoded.user;
        console.log(user);
        if (user && user.first) {
            setName(user.first);
        }
    }, []);

    const logoutHandler = async () => {
        const token = localStorage.getItem('token') || ''

        try{
            // Offering server chance to revoke token
            const response = await fetch('http://localhost:8080/users/logout', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
                },
                credentials: 'include',
            });

            if (response.ok) {
                console.log('Logging out');
                localStorage.removeItem('token');
                window.location.href = '/';
            } else {
                console.error('Logout failed');
                alert('Invalid email or password');
            }
        } catch (error) {
            // catch login error
            console.error('An error occurred', error);
            alert('An error occurred during logout. Please try again.');
        }
    };

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
                <div className="accountFooter">
                    <h3>Log out here</h3>
                        <a style={{ textDecoration: 'none' }}>
                            <button className="homeRedirect" 
                            onClick={logoutHandler} 
                            style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer', background: 'black', color: 'white'}}
                            >Log out</button>
                        </a>
                </div>
            </div>
        </div>
    );
}

export default Account;