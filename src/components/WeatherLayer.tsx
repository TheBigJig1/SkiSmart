// WeatherLayer.tsx
import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';

const WeatherLayer: React.FC = () => {
  const map = useMap();
  const API_URL = 'https://planetarycomputer.microsoft.com/api/stac/v1';

  async function fetchWeatherData(): Promise<GeoJSON.Feature[]> {
    const response = await fetch(`${API_URL}/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/geo+json',
      },
      body: JSON.stringify({
        collections: ['noaa-weather'], // Replace with the NOAA collection name
        bbox: [-125, 25, -66, 49], // Bounding box for the US
        datetime: '2024-01-01T00:00:00Z/2024-12-31T23:59:59Z',
        limit: 10,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch weather data');
    }

    const data: GeoJSON.FeatureCollection = await response.json();
    return data.features;
  }

  useEffect(() => {
    const addWeatherLayer = async () => {
      try {
        const weatherData = await fetchWeatherData();

        const geojsonData: GeoJSON.FeatureCollection = {
          type: 'FeatureCollection',
          features: weatherData,
        };

        L.geoJSON(geojsonData, {
          onEachFeature: (feature, layer) => {
            layer.bindPopup(
              `<strong>Weather Info:</strong> <br>
              ${feature.properties?.title || 'No Title'}`
            );
          },
          pointToLayer: (_feature, latlng) => L.circleMarker(latlng),
        }).addTo(map);
      } catch (error) {
        console.error('Error adding weather layer:', error);
      }
    };

    addWeatherLayer();
  }, [map]);

  return null;
};

export default WeatherLayer;