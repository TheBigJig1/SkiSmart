import "@/styles/components/resortInfo.css"

/*interface ResortInfoProps {
    name: string;
    backgroundImage: string;
    address: string;
    coordinates: {
        lat: number;
        lng: number;
    };
    weather: {
        temperature: number;
        windSpeed: number;
        humidity: number;
        snowDepth: number;
        visibility: number;
        sunrise: string;
        sunset: string;
        forecast: string;
    };
}

const ResortInfo: React.FC<ResortInfoProps> = ({
    name,
    backgroundImage,
    address,
    coordinates,
    weather,
}) => {
    return (
        <div style={{ backgroundImage: `url(${backgroundImage})` }}>
            <h1>{name}</h1>
            <p>{address}</p>
            <p>Coordinates: {coordinates.lat}, {coordinates.lng}</p>
            <div>
                <h2>Weather Information</h2>
                <p>Temperature: {weather.temperature}°C</p>
                <p>Wind Speed: {weather.windSpeed} km/h</p>
                <p>Humidity: {weather.humidity}%</p>
                <p>Snow Depth: {weather.snowDepth} cm</p>
                <p>Visibility: {weather.visibility} km</p>
                <p>Sunrise: {weather.sunrise}</p>
                <p>Sunset: {weather.sunset}</p>
                <p>Forecast: {weather.forecast}</p>
            </div>
        </div>
    );
};*/

function ResortInfo() {
    return (
        <div className="indvContainer">
            <div className="indvBackground">
                <img className="indvLogo" src='src/assets/logoCircle.png'></img> 
                <div className="indvTitle">SkiSmart</div>
            </div>
            <div className="indvPageContainer">
                <div className="pageInfo">
                    <h1>Resort Name</h1>
                        <img src="src/assets/TheWisp.jpg" alt="resort.png" />
                        <h3>Address: Resort</h3>
                        <h3>Coordinates: Latitude, Longitude</h3>
                </div>
                <div className="leaflet">
                    <h1>Interactive Mountain Map</h1>
                    <div className="mapContainer">
                        <img src="src/assets/map.png" alt="map" />
                    </div>
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
                        <h3 className="weatherAdvisories">Advisorys: TORNADO</h3>
                    </div>
                </div>
            </div>
        </div>
    );
}
2
export default ResortInfo;