import "@/styles/routes/resort.css"
import ResortCard from "../components/resortCard"

function Resort() {
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
            <ResortCard resortName="Timberline" snowfall="3 in." address="254 Four Seasons Dr, Davis, WV 26260" lat="39.0430555556" long="-79.3988888889" />
            <ResortCard resortName="The Wisp" snowfall="1.4 in." address="296 Marsh Hill Rd, McHenry, MD 21541" lat="39.558056" long="-79.363056"/>
        </div>
    </div>
    )
 }

 export default Resort