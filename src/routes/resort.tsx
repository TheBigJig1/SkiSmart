import "@/styles/routes/resort.css"
import ResortCard from "../components/resortCard"
function Resort() {
    return (
    <div className="pageContainer">
        <div className="pageBackground">
            <img src='src/assets/logoCircle.png' className="logo"></img>
            <div className="title">SkiSmart</div>
        </div>
        <div className="contentContainer">
            <ResortCard resortName="Timberline" snowfall="3 in." address="254 Four Seasons Dr, Davis, WV 26260"/>
            <ResortCard resortName="The Wisp" snowfall="1.4 in." address="296 Marsh Hill Rd, McHenry, MD 21541"/>
        </div>
    </div>
    )
 }

 export default Resort