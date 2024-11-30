import "@/styles/routes/resort.css"
import {useEffect, useState} from 'react';
import ResortCard from "../components/resortCard"

interface ResortObj {
    id:     number;
    name:   string;
    address: string;
    lat:    number;
    long:   number;
    image:  string;
}

function Resort() {

    const [resorts, setResorts] = useState<ResortObj[]>([]);
    const [limit, setLimit] = useState(3);

    useEffect(() => {
        // List reviews
        listResorts(limit);

        // TODO instead of loading a larger resort array each time limit is changed, append the offset + the next x resorts to the existing array

    }, [limit]); // Add limit as a dependency to re-fetch reviews when limit changes


    const listResorts = async (limit: number) => {
        try {
            // Fetch reviews from server

            // Endpoint is parameterized
            const response = await fetch(`http://localhost:8080/resorts/list?limit=${limit}`, {
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
                console.log('Reviews fetched successfully');
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
                <ResortCard resortName="Timberline" image="https://elkinsrandolphwv.com/wp-content/uploads/2020/10/Timberline-1568x1045.jpg" snowfall="3 in." address="254 Four Seasons Dr, Davis, WV 26260" lat="39.0430555556" long="-79.3988888889" />
                <ResortCard resortName="The Wisp" image="https://d15zjc2r4e8kr7.cloudfront.net/8517/blog/IMG_2822.jpg" snowfall="1.4 in." address="296 Marsh Hill Rd, McHenry, MD 21541" lat="39.558056" long="-79.363056"/>
                <div>
                    <button className="moreResorts" 
                    onClick={() => {setLimit(limit + 3) }}>More Resorts</button>
                </div>
            </div>
        </div>
    )
 }

 export default Resort