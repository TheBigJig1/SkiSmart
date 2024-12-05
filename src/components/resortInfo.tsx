import "@/styles/components/resortInfo.css";
import { MapContainer, TileLayer, useMap, Marker, Popup } from "react-leaflet";
import L from 'leaflet';
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

    const API_URL = 'https://planetarycomputer.microsoft.com/api/stac/v1';


    interface WeatherFeature {
        type: string;
        properties: {
          title?: string;
        };
        geometry: {
          type: string;
          coordinates: number[];
        };
    }

    interface GeoJSONResponse {
        type: string;
        features: WeatherFeature[];
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

    const toggleBookmark = async () => {
        const token = localStorage.getItem('token') || ''
        const resortID = thisResort.ID;

        // Send a POST request to the server with the token and resort ID
        try{
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

    const WeatherLayer: React.FC = () => {
        const map = useMap();
      
        useEffect(() => {
            async function fetchWeatherData(): Promise<WeatherFeature[]> {
                const response = await fetch(`${API_URL}/search`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/geo+json',
                  },
                  body: JSON.stringify({
                    collections: ['noaa-weather'], // Replace with the NOAA collection name
                    bbox: [-125, 25, -66, 49],    // Bounding box for the US
                    datetime: '2024-01-01T00:00:00Z/2024-12-31T23:59:59Z',
                    limit: 10,
                  }),
                });
              
                if (!response.ok) {
                  throw new Error('Failed to fetch weather data');
                }
              
                const data: GeoJSONResponse = await response.json();
                return data.features;
            }
    
            const addWeatherLayer = async () => {
                try {
                  const weatherData: WeatherFeature[] = await fetchWeatherData();
          
                  const weatherLayer = L.geoJSON(weatherData as any, {
                    onEachFeature: (feature, layer) => {
                      const title = feature.properties.title || 'No Title';
                      layer.bindPopup(`<strong>Weather Info:</strong><br>${title}`);
                    },
                    pointToLayer: (feature, latlng) => L.circleMarker(latlng),
                  });
          
                  weatherLayer.addTo(map);
                } catch (error) {
                  console.error('Error adding weather layer:', error);
                }
            };

            addWeatherLayer();
            
        }, [map]);
      
        return null;
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
                        <button className="favoriteButton" onClick={toggleBookmark}>★</button>
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
                        <WeatherLayer />
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