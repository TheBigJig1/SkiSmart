import "@/styles/components/resortInfo.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { ResortObj, WeatherObj } from "../routes/resort"
import { fetchWeatherApi } from 'openmeteo';
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";

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
    
    const [thisWeather, setThisWeather] = useState<WeatherObj>({
        temperature:        0,
        snowfall:           0,
        snowDepth:          0,
        precipitationProb:  0,
        windSpeed:          0,
        visibility:         0,
        weatherAdvisories:  ""
    });

    const handleBookmark = () => {
        // TODO Implement bookmark functionality here
    };

    useEffect(() => {

        const params = {
	        "latitude": thisResort.Lat,
	        "longitude": thisResort.Long,
	        "hourly": ["temperature_2m", "precipitation_probability", "snowfall", "snow_depth", "visibility", "wind_speed_10m"],
            "temperature_unit": "fahrenheit",
	        "wind_speed_unit": "mph",
	        "precipitation_unit": "inch",
	        "forecast_hours": 12
        };
        const url = "https://api.open-meteo.com/v1/forecast";

        const fetchData = async () => {
            const responses = await fetchWeatherApi(url, params);
            console.log(responses);

        // Helper function to form time ranges
        const range = (start: number, stop: number, step: number) =>
	        Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);

        // Process first location. Add a for-loop for multiple locations or weather models
        const response = responses[0];

        // Attributes for timezone and location
        const utcOffsetSeconds = response.utcOffsetSeconds();;

        const hourly = response.hourly()!;

        // Note: The order of weather variables in the URL query and the indices below need to match!
        const weatherData = {

	        hourly: {
		        time: range(Number(hourly.time()), Number(hourly.timeEnd()), hourly.interval()).map(
			        (t) => new Date((t + utcOffsetSeconds) * 1000)
		        ),
		        temperature2m: hourly.variables(0)!.valuesArray()!,
		        precipitationProbability: hourly.variables(1)!.valuesArray()!,
		        snowfall: hourly.variables(2)!.valuesArray()!,
		        snowDepth: hourly.variables(3)!.valuesArray()!,
		        visibility: hourly.variables(4)!.valuesArray()!,
		        windSpeed10m: hourly.variables(5)!.valuesArray()!,
		        sunshineDuration: hourly.variables(6)!.valuesArray()!,
	        },

        };

        setThisWeather({
            temperature: parseFloat(weatherData.hourly.temperature2m[0].toFixed(2)),
            precipitationProb: parseFloat(weatherData.hourly.precipitationProbability[0].toFixed(2)),
            snowfall: parseFloat(weatherData.hourly.snowfall[0].toFixed(2)),
            snowDepth: parseFloat(weatherData.hourly.snowDepth[0].toFixed(2)),
            visibility: parseFloat(weatherData.hourly.visibility[0].toFixed(2)),
            windSpeed: parseFloat(weatherData.hourly.windSpeed10m[0].toFixed(2)),
            weatherAdvisories: ""
        });
       
        localStorage.setItem("curWeather", JSON.stringify(thisWeather));
    };

        fetchData();
    
    }, []);

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
                    <h3><a href={thisResort.HomeLink} target="_blank" rel="noopener noreferrer">Click here to visit {thisResort.Name} home</a></h3>
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
                    <h3><a href={thisResort.CameraLink} target="_blank" rel="noopener noreferrer">Click here to view {thisResort.Name} Cameras</a></h3>
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