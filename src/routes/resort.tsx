import "@/styles/routes/resort.css"
import ResortCard from "../components/resortCard"

function Resort() {
    return (
    <div className="resortContainer">
        <div className="resortBackground">
            <img src='src/assets/logoCircle.png' className="resortLogo"></img>
            <div className="resortTitle">SkiSmart</div>
        </div>
        <div className="resortContentContainer">
            <ResortCard resortName="Timberline" snowfall="3 in." address="254 Four Seasons Dr, Davis, WV 26260"/>
            <ResortCard resortName="The Wisp" snowfall="1.4 in." address="296 Marsh Hill Rd, McHenry, MD 21541"/>
        </div>
    </div>
    )
 }

 export default Resort