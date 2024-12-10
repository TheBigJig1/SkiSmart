import "@/styles/routes/resort.css"
import { useEffect, useState } from 'react';
import ResortCard from "../components/resortCard"
import { jwtDecode } from "jwt-decode";

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

export interface WeatherObj {
    temperature: number;
    snowfall: number;
    snowDepth: number;
    precipitationProb: number;
    windSpeed: number;
    visibility: number;
    weatherAdvisories: string;
}

function Resort() {

    const [resorts, setResorts] = useState<ResortObj[]>([]);
    const [limit, setLimit] = useState(5);
    const [userZip, setZip] = useState('');
    const [inputValue, setInputValue] = useState('');

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

    useEffect(() => {
        if (!userZip) return;

        const listResorts = async (limit: number) => {
            try {
                // Fetch resorts from server

                // Endpoint is parameterized
                const response = await fetch(`http://localhost:8080/resorts/list?zip=${userZip}&limit=${limit}`, {
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

        listResorts(limit);

    }, [userZip, limit]);

    const handleButtonClick = () => {
        setInputValue('given text');
    };

    useEffect(() => {
        const searchResorts = async (inputValue: string) => {
            if(inputValue === '') {
                setLimit(5);
                return;
            }
            
            try {
                const response = await fetch(`http://localhost:8080/resorts/get?name=${inputValue}`, {
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
                    console.log('Resort search fetched successfully');
                    console.log(resorts);
                    return;
                }
            } catch (error) {
                console.error('Error:', error);
            }
        };
        searchResorts(inputValue);

    }, [inputValue]);

    return (
        <div className="resortContainer">
            <div className="resortBackground">
                <img src='src/assets/logoCircle.png' className="resortLogo"></img>
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
                <button className="searchButton" onClick={handleButtonClick}>Search</button>
            </div>
            <div className="resortContentContainer">
                {resorts && resorts.map((resort, resortIndex) => (
                    <ResortCard key={resortIndex}{...resort} />
                ))}

                <div>
                    <button className="moreResorts" onClick={() => {setLimit(limit + 5) }}>
                        More Resorts
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Resort