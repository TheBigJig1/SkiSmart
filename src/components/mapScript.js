var map = L.map('map').setView([39.65280, -106.34053], 10);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
}).addTo(map);

function getColor(d) {
    return d > 12 ? '#FF0000' : // red
        d > 9 ? '#FFA500' : // orange
            d > 6 ? '#FFFF00' : // yellow
                d > 3 ? '#6495ED' : // navy blue
                    d > 1 ? '#ADD8E6' : // light blue
                        '#D3D3D3';  // light gray
}

function snowfallStyle(feature) {
    return {
        color: "#444",
        weight: 1,
        fillColor: getColor(feature.properties.grid_code), // Assuming grid_code represents snowfall amount
        fillOpacity: 0.5
    };
}

var snowForecastLayer = L.esri.featureLayer({
    url: 'https://services9.arcgis.com/RHVPKKiFTONKtxq3/arcgis/rest/services/NDFD_SnowFall_v1/FeatureServer/2',
    style: snowfallStyle
}).addTo(map);

// Popup on click to show the grid_code or label
snowForecastLayer.bindPopup(function (layer) {
    var props = layer.feature.properties;
    return "<b>Forecast Snowfall:</b> " + (props.label || 'N/A');
});

var layerAdded = true;

document.getElementById('toggleForecast').addEventListener('click', function () {
    if (layerAdded) {
        map.removeLayer(snowForecastLayer);
    } else {
        map.addLayer(snowForecastLayer);
    }
    layerAdded = !layerAdded;
});