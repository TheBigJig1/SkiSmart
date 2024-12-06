// WeatherLayer.tsx
import { useEffect, useState } from 'react';
import { useMap, GeoJSON, TileLayer } from 'react-leaflet';

const WeatherLayer: React.FC = () => {

    const [TileUrl, setTileUrl] = useState<string | null>(null);
    const [firstFeature, setFirstFeature] = useState<any | null>(null);

    const map = useMap();
    const API_URL = 'https://planetarycomputer.microsoft.com/api/stac/v1';

    async function fetchWeatherData(): Promise<GeoJSON.FeatureCollection> {
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
        return data;
    }

    const addWeatherLayer = async () => {
        try {
            const weatherData = await fetchWeatherData();

            // Here you would examine the returned features to determine which asset to use
            // For demonstration, we assume the first feature has a "rendered_preview" asset:
            const f1 = weatherData.features[0] as any;
            setFirstFeature(f1);

            if (firstFeature && firstFeature.assets && firstFeature.assets.rendered_preview) {
                // Set the tileUrl from the rendered preview asset
                const balls = firstFeature.assets.rendered_preview.href;
                console.log("Balls: ", balls);
                setTileUrl(balls);
                console.log("TileUrl: ", TileUrl);
                // setTileUrl("https://planetarycomputer.microsoft.com/api/data/v1/mosaic/8167fd2a30f179a980030ad19c008198/tiles/WebMercatorQuad/11/419/777@2x?assets=NDSI_Snow_Cover&colormap_name=modis-10A1&collection=modis-10A1-061&format=png")
            }
            
        } catch (error) {
            console.error('Error adding weather layer:', error);
        }
    };

    useEffect(() => {
        if (typeof window === 'undefined' || !map) return;
        
        console.log("Adding weather layer");
        addWeatherLayer();
        
    }, []);

    return (
        <>
            { TileUrl && (
                <TileLayer url={TileUrl} opacity={.6} />
            )}
        </>
    );
};

export default WeatherLayer;