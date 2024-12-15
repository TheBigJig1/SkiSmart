import "@/styles/routes/resort.css"
import { useEffect, useState } from 'react';
import ResortCard from "../components/resortCard"
import { jwtDecode } from "jwt-decode";

/**
 * Interface representing a resort object.
 */
export interface ResortObj {
    ID: number;
    Name: string;
    Address: string;
    Zipcode: string;
    Lat: number;
    Long: number;
    HomeLink: string;
    CameraLink: string;
    ImageLink: string;
}

/**
 * Interface representing a weather object.
 */
export interface WeatherObj {
    temperature: number;
    snowfall: number;
    snowDepth: number;
    precipitationProb: number;
    windSpeed: number;
    visibility: number;
    weatherAdvisories: string;
}

/**
 * Resort component that displays the resort page containing a list of resorts.
 */
function Resort() {

    // State variables
    const [resorts, setResorts] = useState<ResortObj[]>([]);
    const [limit, setLimit] = useState(5);
    const [userZip, setZip] = useState('');
    const [inputValue, setInputValue] = useState('');
    const [search, setSearch] = useState(false);

    /**
        * Fetches the user's zipcode from the token stored in localStorage.
    */
    useEffect(() => {
        const token = localStorage.getItem('token') || '';
        if (token) {
            const decoded = jwtDecode(token) as {
                user: { email: string; first: string; last: string; zipcode: string };
            };
            const user = decoded.user;
            if (user && user.zipcode) {
                setZip(user.zipcode);
                console.log('Token call zip: ', user.zipcode);
            }
        } else {
            setZip('26505');
        }
    }, []);

    /**
     * Fetches a list of resorts from the server.
     * @param limit - The number of resorts to fetch.
     */
    const listResorts = async (limit: number) => {
        try {
            // Fetch resorts from server

            // Endpoint is parameterized
            const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

            const response = await fetch(`${API_BASE_URL}/resorts/list?zip=${userZip}&limit=${limit}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                // Handle successful response
                const resorts = await response.json();

                // Update reviews state variable
                setResorts(resorts);

                // Log reviews
                console.log('Resort list fetched successfully');
                console.log(resorts);
                return;
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    /**
     * Fetches a list of resorts from the server.
     * Recall the listResorts function when the userZip or limit state variables change.
     * @param limit - The number of resorts to fetch.
     */
    useEffect(() => {
        if (!userZip) return;

        listResorts(limit);

    }, [userZip, limit]);

    /**
     * Fetches a list of resorts from the server.
     * Recall the listResorts function when the search state variable changes.
     * @param inputValue - The search input value.
     */
    useEffect(() => {
        // If search is false, return
        if (!search) return;

        // Function to search for resorts by string fragment in name
        const searchResorts = async (inputValue: string) => {
            if (inputValue === '') {
                setLimit(5);
                listResorts(limit);
                return;
            }

            try {
                const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

                // Send request to server to search for resorts
                const response = await fetch(`${API_BASE_URL}/resorts/get?name=${inputValue}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    // Handle successful response
                    const resorts = await response.json();

                    // Update resorts state variable
                    setResorts(resorts);

                    // Log resorts
                    console.log('Resort search fetched successfully');
                    console.log(resorts);
                    return;
                }
            } catch (error) {
                console.error('Error:', error);
            }
        };
        searchResorts(inputValue);

    }, [search]);

    /**
     * Function to set the search state variable to false if the search bar is empty.
     * @param inputValue - The search input value.
     */
    useEffect(() => {
        if (inputValue == '') {
            setSearch(false);
        }
    }, [inputValue]);

    return (
        <div className="resortContainer">
            <div className="resortBackground">
                <img src='../assets/logoCircle.png' className="resortLogo"></img>
                <div className="resortTitle">SkiSmart</div>
            </div>
            <div className="resortText">
                <h1 className="resortText">Find Your Resort</h1>
            </div>
            <div className="searchbar">
                <input
                    type="text"
                    className="textBar"
                    placeholder="Search for a resort..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                />
                <button className="searchButton" onClick={() => { setSearch(true) }}>Search</button>
            </div>
            <div className="resortContentContainer">
                {/* Load all resorts from resort */}
                {resorts && resorts.map((resort, resortIndex) => (
                    <ResortCard key={resortIndex}{...resort} />
                ))}

                <div>
                    <button className="moreResorts" onClick={() => { setLimit(limit + 5) }}>
                        More Resorts
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Resort