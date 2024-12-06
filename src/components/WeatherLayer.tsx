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
        collections: ['modis-10A1-061'], // Replace with the NOAA collection name
        bbox: [-125, 25, -66, 49], // Bounding box for the US
        datetime: '2024-01-01T00:00:00Z/2024-12-31T23:59:59Z',
        limit: 20,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch weather data');
    }

    const data: GeoJSON.FeatureCollection = await response.json();
    console.log("data:", data);
    return data.features;
  }

  useEffect(() => {
    if (typeof window === 'undefined' || !map) return;

    const addWeatherLayer = async () => {
      try {
        const weatherData = await fetchWeatherData();

        // Log the fetched data
        console.log('Fetched weatherData:', weatherData);

        const validFeatures = weatherData.filter(f => {
          return f.geometry && Array.isArray(f.geometry && 'coordinates') && (f.geometry && 'coordinates').length > 0;
        });

        console.log("Feature geometries:", weatherData.map(f => f.geometry));
      
        if (validFeatures.length === 0) {
            console.warn('No valid features found in the data.');
            return;
        }

        const geojsonData: GeoJSON.FeatureCollection = {
            type: 'FeatureCollection',
            features: validFeatures,
        };

        L.geoJSON(geojsonData, {
            onEachFeature: (feature, layer) => {
                layer.bindPopup(
                    `<strong>Weather Info:</strong> <br>
                    ${feature.properties?.title || 'No Title'}`
                );
            },
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