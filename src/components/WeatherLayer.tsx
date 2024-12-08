// import React, { useEffect, useState } from "react";
// import { MapContainer, TileLayer, useMap } from "react-leaflet";
// import { ResortObj } from "../routes/resort"
// import "leaflet/dist/leaflet.css";
// import L from 'leaflet';
// import * as EsriLeaflet from 'esri-leaflet';

// const WeatherLayer: React.FC = () => {
//     const [forecastLayerVisible, setForecastLayerVisible] = useState(false);
//     const [snowForecastLayer, setSnowForecastLayer] = useState<L.Layer | null>(
//         null
//     );

//     let thisResortStr = localStorage.getItem("curResort");

//     let thisResort: ResortObj = {
//         ID: 0,
//         Name: "",
//         Address: "",
//         Zipcode: "",
//         Lat: 0,
//         Long: 0,
//         HomeLink: "",
//         CameraLink: "",
//         ImageLink: ""
//     };

//     if (thisResortStr) {
//         thisResort = JSON.parse(thisResortStr);
//     }

//     const toggleForecastLayer = () => {
//         setForecastLayerVisible((prev) => !prev);
//     };

//     const addSnowForecastLayer = (map: L.Map) => {
//         function getColor(d: number): string {
//             return d > 12
//                 ? "#FF0000"
//                 : d > 9
//                     ? "#FFA500"
//                     : d > 6
//                         ? "#FFFF00"
//                         : d > 3
//                             ? "#6495ED"
//                             : d > 1
//                                 ? "#ADD8E6"
//                                 : "#D3D3D3";
//         }

//         function snowfallStyle(feature: any) {
//             return {
//                 color: "#444",
//                 weight: 1,
//                 fillColor: getColor(feature.properties.grid_code), // Assuming grid_code represents snowfall amount
//                 fillOpacity: 0.5,
//             };
//         }

//         const layer = EsriLeaflet.featureLayer({
//             url: "https://services9.arcgis.com/RHVPKKiFTONKtxq3/arcgis/rest/services/NDFD_SnowFall_v1/FeatureServer/2",
//             style: snowfallStyle,
//         });

//         layer.bindPopup((layer) => {
//             const props = (layer as L.Layer & { feature: any }).feature?.properties;
//             return `<b>Forecast Snowfall:</b> ${props?.label || "N/A"}`;
//         });

//         setSnowForecastLayer(layer);
//         map.addLayer(layer);
//     };

//     const SnowLayerControl: React.FC = () => {
//         const map = useMap();

//         useEffect(() => {
//             if (snowForecastLayer && !forecastLayerVisible) {
//                 map.removeLayer(snowForecastLayer);
//             } else if (snowForecastLayer && forecastLayerVisible) {
//                 map.addLayer(snowForecastLayer);
//             }
//         }, [forecastLayerVisible, snowForecastLayer, map]);

//         useEffect(() => {
//             addSnowForecastLayer(map);
//         }, [map]);

//         return null;
//     };

//     return (
//         <div>
//             <MapContainer
//                 center={[thisResort.Lat, thisResort.Long]}
//                 zoom={13}
//                 style={{ height: '60vh', width: '70vw' }}
//             >
//                 <TileLayer
//                     url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//                     attribution="© OpenStreetMap"
//                 />
//                 <SnowLayerControl />
//             </MapContainer>
//             <button onClick={toggleForecastLayer}>Toggle Snowfall Layer</button>
//         </div>
//     );
// };

// export default WeatherLayer;
