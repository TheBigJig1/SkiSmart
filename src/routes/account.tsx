import '@/styles/routes/account.css';
import { useState, useEffect } from 'react';
import { ResortObj } from "../routes/resort"
import ResortCard from "../components/resortCard"

import { jwtDecode } from 'jwt-decode';

/**
 * The Account component displays user account information and bookmarks.
 * 
 * @returns The Account component.
 */
function Account() {

    //  State variables
    const [name, setName] = useState('Guest');
    const [resorts, setResorts] = useState<ResortObj[]>([]);

    useEffect(() => {
        // Retrieve user data from localStorage
        const token = localStorage.getItem('token') || ''
        const decoded = jwtDecode(token) as { user: { email: string; first: string; last: string; zipcode: string } };
        const user = decoded.user;
        console.log(user);
        if (user && user.first) {
            setName(user.first);
        }

        // Load user bookmarks
        const loadBookmarks = async () => {
            try {
                // Fetch reviews from server

                // Endpoint is parameterized
                const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

                // Send request to server to load bookmarks
                const response = await fetch(`${API_BASE_URL}/users/loadbookmarks`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token
                    }
                });

                if (response.ok) {
                    // Handle successful response
                    const resorts = await response.json();

                    // Update reviews state variable
                    setResorts(resorts);

                    // Log reviews
                    console.log('bookmark list fetched successfully');
                    console.log(resorts);
                    return;
                }
            } catch (error) {
                console.error('Error:', error);
            }
        };

        loadBookmarks();

    }, []); // Effect run once

    /**
     * Handles user logout by revoking the token and redirecting to the home page.
     */
    const logoutHandler = async () => {
        const token = localStorage.getItem('token') || ''

        try {
            // Offering server chance to revoke token
            const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

            // Send request to server to logout
            const response = await fetch(`${API_BASE_URL}/users/logout`, {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
                },
                credentials: 'include',
            });

            // Check if logout was successful
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
                    <div className="accountInfo">
                        <ul>
                            <h3>Your Info:</h3>
                            <li>Resorts Viewed: </li>
                            <li>Trips Completed: </li>
                        </ul>
                    </div>
                    <div className="accountResorts">
                        {/* Load all resorts */}
                        <h1>Your Bookmarks</h1>
                        {resorts && resorts.map((resort, resortIndex) => (
                            <ResortCard key={resortIndex}{...resort} />
                        ))}
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