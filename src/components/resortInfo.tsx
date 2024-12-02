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
        ImageLink:  ""
    };

    if (thisResortStr) {
        thisResort = JSON.parse(thisResortStr);
    }

    let thisWeather: WeatherObj = {
        temperature:    0,
        snowfall:       2,
        snowDepth:      0,
        cloudCover:     "",
        windSpeed:      0,
        sunTime:        "",
        visibility:     0,
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
                    <h1>{thisResort.Name} <button className="favoriteButton" onClick={handleBookmark}>★</button> </h1>
                    <img src={thisResort.ImageLink} alt="Resort" />
                    <h3>Address: {thisResort.Address}, {thisResort.Zipcode}</h3> 
                    <h3>Coordinates: {thisResort.Lat}, {thisResort.Long}</h3>
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
                </div>
                <div className="skiData">
                    <h1 className="skiIntro">Weather Data</h1>
                    <div className="skiConditions">
                        <h3 className="temperature">Temperature: {thisWeather.temperature}</h3>
                        <h3 className="snowfallRecent">Recent Snowfall: {thisWeather.snowfall}</h3>
                        <h3 className="snowDepth">Snow Depth:{thisWeather.snowDepth}</h3>
                        <h3 className="cloudCover">Cloud Cover: {thisWeather.cloudCover}</h3>
                        <h3 className="windSpeed">Wind Speed: {thisWeather.windSpeed}</h3>
                        <h3 className="sunTime">Sun Rise/Set: {thisWeather.sunTime}</h3>
                        <h3 className="visibility">Visibility: {thisWeather.visibility}</h3>
                        <h3 className="weatherAdvisories">Advisories: {thisWeather.weatherAdvisories}</h3>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ResortInfo;