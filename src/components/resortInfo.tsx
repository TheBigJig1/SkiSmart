import "@/styles/components/resortInfo.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";

interface ResortObj {
    ID:         number;
    Name:       string;
    Address:    string;
    Zipcode:    string;
    Lat:        number;
    Long:       number;
    ImageLink:  string;
}

interface weatherInfoProps {
    temperature:    number;
    snowfall:       number;
    snowDepth:      number;
    cloudCover:     string;
    windSpeed:      number;
    sunTime:        string;
    visibility:     number;
    weatherAdvisories: string;
}

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

    return (
        <div className="indvContainer">
            <div className="indvBackground">
                <img className="indvLogo" src='src/assets/logoCircle.png' alt="Logo" />
                <div className="indvTitle">SkiSmart</div>
            </div>
            <div className="indvPageContainer">
                <div className="pageInfo">
                    <h1>{thisResort.Name}</h1>
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
                        <h3 className="temperature">Temperature: 0°C</h3>
                        <h3 className="snowfallRecent">Forecast: Clear</h3>
                        <h3 className="snowDepth">Snow Depth: 0 cm</h3>
                        <h3 className="cloudCover">Sun Level: bright</h3>
                        <h3 className="windSpeed">Wind Speed: 0 km/h</h3>
                        <h3 className="sunTime">Sunrise: 00:00</h3>
                        <h3 className="visibility">Visibility: 0 km</h3>
                        <h3 className="weatherAdvisories">Advisories: TORNADO</h3>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ResortInfo;