import "@/styles/components/resortCard.css"
import { ResortObj } from "../routes/resort";

function ResortCard(resort: ResortObj ) {
    
    async function setResort() {
        localStorage.setItem("curResort", JSON.stringify(resort));
    }

    return <div className="cardContainer">
        <h1 className="resortName">{resort.Name}</h1>
        <div className="resortImg">
            <img src={resort.ImageLink}></img>
        </div>
        <div className="resortInfo">
            <a href="/resortInfo">
                <button className="visitPageButton" onClick={setResort}>Visit Page</button>
            </a>
            <div className="address">
                <h2>{resort.Address}, {resort.Zipcode}</h2>
            </div>
        </div>
    </div>
}

export default ResortCard