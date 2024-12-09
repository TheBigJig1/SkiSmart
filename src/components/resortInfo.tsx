import "@/styles/components/resortInfo.css";
import { useEffect, useState } from 'react';
import { ResortObj, WeatherObj } from "../routes/resort"
import { fetchWeatherApi } from 'openmeteo';
import "leaflet/dist/leaflet.css";
import L from 'leaflet';
import * as EsriLeaflet from 'esri-leaflet';

function ResortInfo() {

    // Get the current resort from local storage and intialize it
    let thisResortStr = localStorage.getItem("curResort");

    let thisResort: ResortObj = {
        ID: 0,
        Name: "",
        Address: "",
        Zipcode: "",
        Lat: 0,
        Long: 0,
        HomeLink: "",
        CameraLink: "",
        ImageLink: ""
    };

    if (thisResortStr) {
        thisResort = JSON.parse(thisResortStr);
    }

    const [thisWeather, setThisWeather] = useState<WeatherObj>({
        temperature: 0,
        snowfall: 0,
        snowDepth: 0,
        precipitationProb: 0,
        windSpeed: 0,
        visibility: 0,
        weatherAdvisories: ""
    });

    // Load the numerical weather data for the current resort
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

    // Function to toggle the bookmark status of the current resort
    const toggleBookmark = async () => {
        const token = localStorage.getItem('token') || ''
        const resortID = thisResort.ID;

        // Send a POST request to the server with the token and resort ID
        try {
            // Offering server chance to revoke token
            const response = await fetch('http://localhost:8080/users/togglebookmark', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
                body: JSON.stringify({ resortID }),
                credentials: 'include',
            });

            if (response.ok) {
                console.log('Bookmark toggled');
                // TODO Find way to indicate to the user whether or not the resort is bookmarked
            } else {
                console.error('Logout failed');
            }
        } catch (error) {
            // catch  error
            console.error('An error occurred', error);
            alert('An error occurred while bookmarking. Please try again.');
        }
    };

    // Declare state variables for the map and layers
    const [map, setMap] = useState<L.Map | null>(null);
    const [snowfallLayer, setSnowfallLayer] = useState<L.Layer | null>(null);
    const [advisoryLayer, setAdvisoryLayer] = useState<L.Layer | null>(null);
    const [isSnowfallLayerVisible, setIsSnowfallLayerVisible] = useState(true);
    const [isAdvisoryLayerVisible, setIsAdvisoryLayerVisible] = useState(true);

    // Initialize the map
    useEffect(() => {
        const mapInstance = L.map('map').setView([thisResort.Lat, thisResort.Long], 15);

        L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
            {
                attribution:
                    'Tiles © Esri — Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
            }
        ).addTo(mapInstance);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            {
                attribution: '&copy; OpenStreetMap contributors',
                opacity: 0.5, // Adjust opacity to ensure labels are visible over the imagery
            }
        ).addTo(mapInstance);

        const marker = L.marker([thisResort.Lat, thisResort.Long]).addTo(mapInstance);
        marker.bindPopup(thisResort.Name).openPopup();

        setMap(mapInstance);

        return () => {
            mapInstance.remove();
        };
    }, [thisResort.Lat, thisResort.Long]);

    // Snowfall layer
    useEffect(() => {
        if (map) {
            function getColor(d: number): string {
                return d > 12
                    ? '#FF0000' // red
                    : d > 9
                        ? '#FFA500' // orange
                        : d > 6
                            ? '#FFFF00' // yellow
                            : d > 3
                                ? '#6495ED' // navy blue
                                : d > 1
                                    ? '#ADD8E6' // light blue
                                    : '#D3D3D3'; // light gray
            }

            function snowfallStyle(feature: any) {
                return {
                    color: '#444',
                    weight: 1,
                    fillColor: getColor(feature.properties.grid_code), // Assuming grid_code represents snowfall amount
                    fillOpacity: 0.5,
                };
            }

            const snowForecastLayer = EsriLeaflet.featureLayer({
                url: 'https://services9.arcgis.com/RHVPKKiFTONKtxq3/arcgis/rest/services/NDFD_SnowFall_v1/FeatureServer/2',
                style: snowfallStyle,
            }).addTo(map);

            snowForecastLayer.bindPopup((layer) => {
                const props = (layer as L.Layer & { feature: any }).feature?.properties;
                return '<b>72 Hour Snow Forecast:</b> ' + (props?.label || 'N/A') + '<b> in<b>';
            });

            setSnowfallLayer(snowForecastLayer);

            // Initialize as hidden
            map.removeLayer(snowForecastLayer);
            setIsSnowfallLayerVisible(false); 
        }
    }, [map]);

    // Weather advisory layer
    useEffect(() => {
        if (map) {
            function advisoryStyle(feature: { properties: { Event: string } }) {
                const warningColor: { [key: string]: string } = {
                    'Winter Storm Warning': '#ff0000',
                    'Winter Weather Advisory': '#00ff00',
                    'Blizzard Warning': '#0000ff',
                };

                return {
                    color: '#444',
                    weight: 1,
                    fillColor: warningColor[feature.properties.Event] || '#ffcc00', // Default color if event not mapped
                    fillOpacity: 0.5,
                };
            }

            const advisoryLayer = EsriLeaflet.featureLayer({
                url: 'https://services9.arcgis.com/RHVPKKiFTONKtxq3/arcgis/rest/services/NWS_Watches_Warnings_v1/FeatureServer/6',
                style: advisoryStyle,
            }).addTo(map)

            advisoryLayer.bindPopup((layer) => {
                const props = (layer as L.Layer & { feature: any }).feature?.properties;

                // Constructing a popup HTML with multiple properties
                return `
                    <b>${props?.Event || 'N/A'}</b><br>
                    <b>Severity:</b> ${props?.Severity || 'N/A'}<br>
                    <b>Summary:</b> ${props?.Summary || 'N/A'}<br>
                    <b>Affected Areas:</b> ${props?.Affected || 'N/A'}<br>
                    <b>Urgency:</b> ${props?.Urgency || 'N/A'}<br>
                    <b>Details:</b> ${props?.Link ? `<a href="${props.Link}" target="_blank">Click here</a>` : 'N/A'}<br>
                `;
            });

            setAdvisoryLayer(advisoryLayer);

            // Initialize as hidden
            map.removeLayer(advisoryLayer);
            setIsAdvisoryLayerVisible(false);
        }
    }, [map]);

    const handleToggleForecast = () => {
        if (map && snowfallLayer) {
            if (isSnowfallLayerVisible) {
                map.removeLayer(snowfallLayer);
            } else {
                map.addLayer(snowfallLayer);
            }
            setIsSnowfallLayerVisible(!isSnowfallLayerVisible);
        }
    };

    const handleToggleAdvisory = () => {
        if (map && advisoryLayer) {
            if (isAdvisoryLayerVisible) {
                map.removeLayer(advisoryLayer);
            } else {
                map.addLayer(advisoryLayer);
            }
            setIsAdvisoryLayerVisible(!isAdvisoryLayerVisible);
        }
    }

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
                        <button className="favoriteButton" onClick={toggleBookmark}>★</button>
                    </div>
                    <img src={thisResort.ImageLink} alt="Resort" />
                    <h3>Address: {thisResort.Address}, {thisResort.Zipcode}</h3>
                    <h3>Coordinates: {thisResort.Lat}, {thisResort.Long}</h3>
                    <h3><a href={thisResort.HomeLink} target="_blank" rel="noopener noreferrer">Click here to visit {thisResort.Name} home</a></h3>
                </div>
                <div className="leaflet">
                    <h1>Interactive Mountain Map</h1>
                    <div id="map" style={{ width: '80%', height: '65vh' }}></div>
                    <div className="mapbuttons">
                        <button onClick={handleToggleForecast}>Toggle Snowfall Layer</button>
                        <button onClick={handleToggleAdvisory}>Toggle Advisory Layer</button>
                    </div>
                    <h3>
                        <a href={thisResort.CameraLink} target="_blank" rel="noopener noreferrer">
                            Click here to view {thisResort.Name} Cameras
                        </a>
                    </h3>
                </div>
                <div className="skiData">
                    <h1 className="skiIntro">Current Weather</h1>
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