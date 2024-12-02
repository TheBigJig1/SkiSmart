import "@/styles/routes/resort.css"
import {useEffect, useState} from 'react';
import ResortCard from "../components/resortCard"
import { jwtDecode } from "jwt-decode";

export interface ResortObj {
    ID:         number;
    Name:       string;
    Address:    string;
    Zipcode:    string;
    Lat:        number;
    Long:       number;
    ImageLink:  string;
}

export interface WeatherObj {
    temperature:    number;
    snowfall:       number;
    snowDepth:      number;
    cloudCover:     string;
    windSpeed:      number;
    sunTime:        string;
    visibility:     number;
    weatherAdvisories: string;
}

function Resort() {

    const [resorts, setResorts] = useState<ResortObj[]>([]);
    const [limit, setLimit] = useState(3);
    const [userZip, setZip] = useState('');

    useEffect(() => {

        const token = localStorage.getItem('token') || ''
        const decoded = jwtDecode(token) as { user: { email: string; first: string; last: string; zipcode: string } };
        const user = decoded.user;
        console.log(user);
        if (user && user.zipcode) {
            setZip(user.zipcode);
        }
        
        // List reviews
        listResorts(limit);

        // TODO instead of loading a larger resort array each time limit is changed, append the offset + the next x resorts to the existing array

    }, [limit]); // Add limit as a dependency to re-fetch reviews when limit changes


    const listResorts = async (limit: number) => {
        try {
            // Fetch reviews from server

            // Endpoint is parameterized
            const response = await fetch(`http://localhost:8080/resorts/list?zip=${userZip}&limit=${limit}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if(response.ok) {
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
    }
    
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
                <input type="text" className="textBar" placeholder="Search for a resort..." />
                <button className="searchButton">Search</button>
            </div>
            <div className="resortContentContainer">
                {resorts && resorts.map((resort, resortIndex) => (
                    <ResortCard key={resortIndex}{...resort} />
                ))}
                
                <div>
                    <button className="moreResorts" onClick={() => { setLimit(limit + 3) }}>
                        More Resorts
                    </button>
                </div>
            </div>
        </div>
    )
 }

 export default Resort