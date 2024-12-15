// This file is the main file that is rendered when the app is started. It contains the routes for the app and the navbar.

import "@/styles/components/resortCard.css"
import { ResortObj } from "../routes/resort";

// The ResortCard component is a card that displays information about a resort.
function ResortCard(resort: ResortObj ) {
    
    // Set the current resort in local storage
    async function setResort() {
        localStorage.setItem("curResort", JSON.stringify(resort));
    }

    return <div className="cardContainer">
        {/* Display the resort name */}
        <h1 className="resortName">{resort.Name}</h1>

        {/* Display the resort image */}
        <div className="resortImg">
            <img src={resort.ImageLink}></img>
        </div>
        
        {/* Display the resort information */}
        <div className="resortInfo">
            {/* Display the resort description */}
            <a href="/resortInfo">
                {/* Display the visit page button */}
                <button className="visitPageButton" onClick={setResort}>Visit Page</button>
            </a>

            {/* Display the resort address */}
            <div className="address">
                <h2>{resort.Address}, {resort.Zipcode}</h2>
            </div>
        </div>
    </div>
}

export default ResortCard