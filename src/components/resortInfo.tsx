import "@/styles/components/resortInfo.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { ResortObj, WeatherObj } from "../routes/resort"
import "leaflet/dist/leaflet.css";

function ResortInfo() {
    
    let thisResortStr = localStorage.getItem("curResort");
    
    let thisResort: ResortObj = {
        ID:         0,
        Name:       "",
        Address:    "",
        Zipcode:    "",
        Lat:        0,
        Long:       0,
        HomeLink:   "",
        CameraLink: "",
        ImageLink:  ""
    };

    if (thisResortStr) {
        thisResort = JSON.parse(thisResortStr);
    }

    let thisWeather: WeatherObj = {
        temperature:        Number(localStorage.getItem("temperature")),
        snowfall:           Number(localStorage.getItem("snowfall")),
        snowDepth:          Number(localStorage.getItem("snowDepth")),
        precipitationProb:  Number(localStorage.getItem("precipitationProb")),
        windSpeed:          Number(localStorage.getItem("windSpeed")),
        visibility:         Number(localStorage.getItem("visibility")),
        weatherAdvisories: "string"
    };
    

    const handleBookmark = () => {
        // Implement bookmark functionality here
    };

    return (
        <div className="indvContainer">
            <div className="indvBackground">
                <img className="indvLogo" src='src/assets/logoCircle.png' alt="Logo" />
                <div className="indvTitle">SkiSmart</div>
            </div>
            <div className="indvPageContainer">
                <div className="pageInfo">
                    <div className="titleContainer">
                        <h1>{thisResort.Name}</h1>
                        <button className="favoriteButton" onClick={handleBookmark}>★</button>
                    </div>
                    <img src={thisResort.ImageLink} alt="Resort" />
                    <h3>Address: {thisResort.Address}, {thisResort.Zipcode}</h3> 
                    <h3>Coordinates: {thisResort.Lat}, {thisResort.Long}</h3>
                    <h3><a href={thisResort.HomeLink} target="_blank" rel="noopener noreferrer">Click here to visit resort home</a></h3>
                </div>
                <div className="leaflet">
                    <h1>Interactive Mountain Map</h1>
                    <MapContainer
                        center={[thisResort.Lat, thisResort.Long]}
                        zoom={13}
                        style={{ height: "50vh", width: "55vw" }}
                    >
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        />
                        <Marker position={[thisResort.Lat, thisResort.Long]}>
                            <Popup>
                                Resort Location: {thisResort.Lat}, {thisResort.Long}
                            </Popup>
                        </Marker>
                    </MapContainer>
                    <h3><a href={thisResort.CameraLink} target="_blank" rel="noopener noreferrer">Click here to see resort Cameras</a></h3>
                </div>
                <div className="skiData">
                    <h1 className="skiIntro">Weather Data</h1>
                    <div className="skiConditions">
                        <h3 className="temperature">Temperature: {thisWeather.temperature}</h3>
                        <h3 className="snowfallRecent">Recent Snowfall: {thisWeather.snowfall} in</h3>
                        <h3 className="snowDepth">Snow Depth: {thisWeather.snowDepth} in</h3>
                        <h3 className="windSpeed">Wind Speed: {thisWeather.windSpeed} mph</h3>
                        <h3 className="visibility">Visibility: {thisWeather.visibility} ft</h3>
                        <h3 className="precipitationProb">Precipitation Probability: {thisWeather.precipitationProb}%</h3>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ResortInfo;