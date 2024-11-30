import "@/styles/components/resortInfo.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

interface ResortInfoProps {
    name:   string;
    address: string;
    zip:    string;
    lat:    number;
    long:   number;
    image:  string;
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
    const resortCoordinates = {
        lat: Number(localStorage.getItem("lat")),  // Example latitude
        lng: Number(localStorage.getItem("long")) // Example longitude
    };

    return (
        <div className="indvContainer">
            <div className="indvBackground">
                <img className="indvLogo" src='src/assets/logoCircle.png' alt="Logo" />
                <div className="indvTitle">SkiSmart</div>
            </div>
            <div className="indvPageContainer">
                <div className="pageInfo">
                    <h1>{localStorage.getItem("resortName")}</h1>
                    <img src={`src/assets/${localStorage.getItem("resortName")?.replace(" ", "")}.jpg`} alt="Resort" />
                    <h3>Address: {localStorage.getItem("address")}</h3>
                    <h3>Coordinates: {localStorage.getItem("lat")}, {localStorage.getItem("long")}</h3>
                </div>
                <div className="leaflet">
                    <h1>Interactive Mountain Map</h1>
                    <MapContainer
                        center={[resortCoordinates.lat, resortCoordinates.lng]}
                        zoom={13}
                        style={{ height: "80vh", width: "90vw" }}
                    >
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        />
                        <Marker position={[resortCoordinates.lat, resortCoordinates.lng]}>
                            <Popup>
                                Resort Location: {resortCoordinates.lat}, {resortCoordinates.lng}
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