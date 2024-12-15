import "@/styles/components/resortInfo.css";
import { useEffect, useState, useRef } from 'react';
import { ResortObj, WeatherObj } from "../routes/resort"
import { fetchWeatherApi } from 'openmeteo';
import "leaflet/dist/leaflet.css";
import L from 'leaflet';
import * as EsriLeaflet from 'esri-leaflet';
import proj4 from 'proj4';
import 'proj4leaflet';

/**
 * Interface representing a legend object.
 */
interface LegendProps {
    handleToggleDepth: (range: string) => void;
    isLegendVisible?: boolean;
}

/**
 * Legend component that displays the legend for the snow depth layer.
 * @param handleToggleDepth - Function to handle the toggle of snow depth range visibility.
 * @param isLegendVisible - Boolean indicating whether the legend is visible.
 * @returns A React component displaying the legend.
 */
const Legend: React.FC<LegendProps> = ({ handleToggleDepth, isLegendVisible }) => {
    // Legend items
    const legendItems = [
        { range: "0 - 0.39", color: "#d1d9db" },
        { range: "0.39 - 2.0", color: "#79c3c9" },
        { range: "2.0 - 3.9", color: "#5daac8" },
        { range: "3.9 - 9.8", color: "#3b88cb" },
        { range: "9.8 - 20", color: "#3265c1" },
        { range: "20 - 39", color: "#3e42b2" },
        { range: "39 - 59", color: "#5a2da5" },
        { range: "59 - 98", color: "#9628a8" },
        { range: "98 - 197", color: "#ad1b77" },
        { range: "197 - 295", color: "#7a1b43" },
        { range: "295 - 394", color: "#601a2d" },
        { range: "394 - 787", color: "#4d191f" },
    ];

    // Return null if the legend is not visible
    if (!isLegendVisible) return null;

    return (
        <div className="legend">
            <h4>Snow Depth (inches)</h4>
            <ul style={{ listStyleType: "none", padding: 0 }}>
                {legendItems.map((item, index) => (
                    <li
                        key={index}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            marginBottom: "5px",
                            cursor: "pointer",
                        }}
                        onClick={() => handleToggleDepth(item.range)} // Use wrapper function
                    >
                        <div
                            style={{
                                width: "20px",
                                height: "20px",
                                backgroundColor: item.color,
                                marginRight: "10px",
                            }}
                        ></div>
                        <span>{item.range}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

/**
 * ResortInfo component that displays information about a specific resort,
 * including weather data, interactive map, and bookmark functionality.
 * @returns A React component displaying resort information.
 */
function ResortInfo() {
    // Get the current resort from local storage and intialize it
    let thisResortStr = localStorage.getItem("curResort");

    // Initialize the current resort object
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

    // Parse the current resort object from local storage
    if (thisResortStr) {
        thisResort = JSON.parse(thisResortStr);
    }

    // Initialize the current weather object
    const [thisWeather, setThisWeather] = useState<WeatherObj>({
        temperature: 0,
        snowfall: 0,
        snowDepth: 0,
        precipitationProb: 0,
        windSpeed: 0,
        visibility: 0,
        weatherAdvisories: ""
    });

    /**
     * Fetches the weather data for the current resort from the OpenMeteo API.
     */
    useEffect(() => {
        // Parameters for the OpenMeteo API
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

        // Fetch the weather data from the OpenMeteo API
        const fetchData = async () => {
            // Fetch the weather data from the OpenMeteo API
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

            // Set the current weather object
            setThisWeather({
                temperature: parseFloat(weatherData.hourly.temperature2m[0].toFixed(2)),
                precipitationProb: parseFloat(weatherData.hourly.precipitationProbability[0].toFixed(2)),
                snowfall: parseFloat(weatherData.hourly.snowfall[0].toFixed(2)),
                snowDepth: parseFloat(weatherData.hourly.snowDepth[0].toFixed(2)),
                visibility: parseFloat(weatherData.hourly.visibility[0].toFixed(2)),
                windSpeed: parseFloat(weatherData.hourly.windSpeed10m[0].toFixed(2)),
                weatherAdvisories: ""
            });

            // Store the current weather object in local storage
            localStorage.setItem("curWeather", JSON.stringify(thisWeather));
        };

        // Fetch the weather data
        fetchData();

    }, []);

    /**
     * Toggles the bookmark status of the current resort.
     * Sends a POST request to the server to toggle the bookmark status.
     * @returns A Promise that resolves when the bookmark status is toggled.
     */
    const toggleBookmark = async () => {
        // Get the token from local storage
        const token = localStorage.getItem('token') || ''
        const resortID = thisResort.ID;

        // Send a POST request to the server with the token and resort ID
        try {
            // Offering server chance to revoke token
            const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

            const response = await fetch(`${API_BASE_URL}/users/togglebookmark`, {
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
    const [snowDepthLayer, setSnowDepthLayer] = useState<L.Layer | null>(null);
    const [snowfallLayer, setSnowfallLayer] = useState<L.Layer | null>(null);
    const [advisoryLayer, setAdvisoryLayer] = useState<L.Layer | null>(null);
    const [isLegendVisible, setIsLegendVisible] = useState(false);
    const [isSnowDepthLayerVisible, setIsSnowDepthLayerVisible] = useState(false);
    const [isSnowfallLayerVisible, setIsSnowfallLayerVisible] = useState(false);
    const [isAdvisoryLayerVisible, setIsAdvisoryLayerVisible] = useState(false);

    const snowDepthLayerRef = useRef<L.Layer | null>(null);

    /**
     * Initializes the map and adds a marker for the current resort.
     * The map is centered on the resort's coordinates.
     * The map is initialized with two base layers: World Imagery and OpenStreetMap.
     */
    useEffect(() => {
        const mapInstance = L.map('map', {
            // crs: crs102100,
            center: [thisResort.Lat, thisResort.Long],
            zoom: 15
        });

        // Add base layers
        L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
            {
                attribution: 'Tiles © Esri — Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
            }
        ).addTo(mapInstance);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            {
                attribution: '&copy; OpenStreetMap contributors',
                opacity: 0.5, // Adjust opacity to ensure labels are visible over the imagery
            }
        ).addTo(mapInstance);

        // Add a marker for the resort
        const marker = L.marker([thisResort.Lat, thisResort.Long]).addTo(mapInstance);
        marker.bindPopup(thisResort.Name).openPopup();

        // Set the map state variable
        setMap(mapInstance);

        return () => {
            mapInstance.remove();
        };
    }, [thisResort.Lat, thisResort.Long]);

    /**
     * Adds the snow depth layer to the map and updates it based on the map view.
     * The snow depth layer is fetched from the NOAA REST API.
     * Updates the snow depth layer when the map view changes.
     * @returns Updated map with the snow depth layer.
     */
    useEffect(() => {
        if (map) {
            // Update the snow depth overlay based on the map view
            const updateOverlay = () => {
                // NOAA REST API URL
                const url = 'https://mapservices.weather.noaa.gov/raster/rest/services/snow/NOHRSC_Snow_Analysis/MapServer/export';

                // Get the map bounds and size
                const bounds = map.getBounds();
                const size = map.getSize();

                // Convert the bounds to the required projection
                const sw = proj4('EPSG:4326', 'EPSG:3857', [bounds.getWest(), bounds.getSouth()]);
                const ne = proj4('EPSG:4326', 'EPSG:3857', [bounds.getEast(), bounds.getNorth()]);

                // Construct the bounding box and query string
                const bbox = `${sw[0]},${sw[1]},${ne[0]},${ne[1]}`;

                const params = {
                    dpi: '96',
                    transparent: 'true',
                    format: 'png32',
                    layers: 'show:3',
                    bbox: bbox,
                    bboxSR: '102100',
                    imageSR: '102100',
                    size: `${size.x},${size.y}`,
                    f: 'image'
                };

                const queryString = new URLSearchParams(params).toString();
                const timestamp = new Date().getTime();
                const imageUrl = `${url}?${queryString}&_=${timestamp}`;

                // Remove the existing snow depth layer if it exists
                if (snowDepthLayerRef.current) {
                    map.removeLayer(snowDepthLayerRef.current);
                }

                // Add the new snow depth layer to the map only if it is visible
                const newSnowDepthLayer = L.imageOverlay(imageUrl, bounds, { opacity: 0.5 });
                snowDepthLayerRef.current = newSnowDepthLayer;
                setSnowDepthLayer(newSnowDepthLayer);

                // Add the snow depth layer to the map if it is visible
                if (isSnowDepthLayerVisible) {
                    newSnowDepthLayer.addTo(map);
                }
            };

            // Initial overlay
            updateOverlay();

            // Update overlay on map movements
            map.on('moveend', updateOverlay);
            map.on('zoomend', updateOverlay);

            return () => {
                map.off('moveend', updateOverlay);
                map.off('zoomend', updateOverlay);
            };
        }
    }, [map, isSnowDepthLayerVisible]);

    /**
     * Adds the snowfall layer to the map and binds a popup to each feature.
     * The snowfall layer is fetched from the NOAA REST API.
     * Updates the snowfall layer when the map view changes.
     */
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
                    fillColor: getColor(feature.properties.grid_code),
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
        }
    }, [map]);

    /**
     * Adds the weather advisory layer to the map and binds a popup to each feature.
     * The weather advisory layer is fetched from the NOAA REST API.
     * Updates the weather advisory layer when the map view changes.
     */
    useEffect(() => {
        if (map) {
            /**
             * Function to style the advisory layer based on the event type.
             * @param feature - The feature to style.
             * @returns The style object for the feature.
             */
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

            // Add the advisory layer to the map
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
        }
    }, [map]);

    /**
     * Toggles the visibility of the snow depth layer on the map.
     */
    const handleToggleDepth = (): void => {
        if (map && snowDepthLayer) {
            if (isSnowDepthLayerVisible) {
                map.removeLayer(snowDepthLayer);
            } else {
                map.addLayer(snowDepthLayer);
            }
            setIsLegendVisible(!isLegendVisible);
            setIsSnowDepthLayerVisible(!isSnowDepthLayerVisible);
            console.log(`Legend status: ${isLegendVisible}`);
        }
    };

    /**
     * Toggles the visibility of the snowfall layer on the map.
     */
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

    /**
     * Toggles the visibility of the weather advisory layer on the map.
     */
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
                <img className="indvLogo" src='../assets/logoCircle.png' alt="Logo" />
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
                    <div id="map" style={{ width: '80%', height: '65vh', border: '2px solid black' }}>
                        <div className="legend-container">
                            <Legend handleToggleDepth={handleToggleDepth} isLegendVisible={isLegendVisible} />
                        </div>
                    </div>
                    <div className="mapbuttons">
                        <button onClick={handleToggleDepth}> {isSnowDepthLayerVisible ? 'Hide Snow Depth Layer' : 'Show Snow Depth Layer'}</button>
                        <button onClick={handleToggleForecast}>{isSnowfallLayerVisible ? 'Hide Snowfall Layer' : 'Show Snowfall Layer'}</button>
                        <button onClick={handleToggleAdvisory}>{isAdvisoryLayerVisible ? 'Hide Advisory Layer' : 'Show Advisory Layer'}</button>
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