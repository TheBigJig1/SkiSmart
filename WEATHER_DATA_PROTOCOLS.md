# Weather Data Protocols Used in SkiSmart

This document outlines the protocols and APIs used to retrieve and display weather data in the SkiSmart application.

## Overview

SkiSmart uses multiple protocols and data sources to provide comprehensive weather information and visualization for ski resorts. The weather data graphing and visualization primarily occurs in the `resortInfo.tsx` component.

## Protocols and APIs Used

### 1. **HTTPS/REST API - Open-Meteo Weather API**

**Purpose:** Fetching real-time weather forecast data

**Protocol:** HTTPS (Hypertext Transfer Protocol Secure)

**API Type:** REST API

**Endpoint:** `https://api.open-meteo.com/v1/forecast`

**Implementation Location:** `src/components/resortInfo.tsx` (lines 116-184)

**Data Retrieved:**
- Temperature (2m above ground)
- Precipitation probability
- Snowfall
- Snow depth
- Visibility
- Wind speed (10m above ground)

**Method:** The application uses the `fetchWeatherApi` function from the `openmeteo` npm package to make HTTP GET requests to the Open-Meteo API with parameters including latitude, longitude, and desired weather variables.

**Code Example:**
```typescript
const url = "https://api.open-meteo.com/v1/forecast";
const responses = await fetchWeatherApi(url, params);
```

### 2. **HTTPS/REST API - NOAA MapServer (Snow Depth Analysis)**

**Purpose:** Displaying snow depth layer on interactive map

**Protocol:** HTTPS

**API Type:** ArcGIS REST API

**Endpoint:** `https://mapservices.weather.noaa.gov/raster/rest/services/snow/NOHRSC_Snow_Analysis/MapServer/export`

**Implementation Location:** `src/components/resortInfo.tsx` (lines 281-347)

**Data Retrieved:**
- Real-time snow depth imagery
- Snow analysis raster data

**Method:** Uses REST API with dynamic bounding box parameters based on map viewport, projected using EPSG:3857 (Web Mercator) coordinate system. Returns PNG image overlays.

**Code Example:**
```typescript
const url = 'https://mapservices.weather.noaa.gov/raster/rest/services/snow/NOHRSC_Snow_Analysis/MapServer/export';
const imageUrl = `${url}?${queryString}&_=${timestamp}`;
const newSnowDepthLayer = L.imageOverlay(imageUrl, bounds, { opacity: 0.5 });
```

### 3. **HTTPS/REST API - NOAA/NDFD Snowfall Forecast (ArcGIS Feature Service)**

**Purpose:** Displaying 72-hour snowfall forecast

**Protocol:** HTTPS

**API Type:** ArcGIS Feature Service (REST API)

**Endpoint:** `https://services9.arcgis.com/RHVPKKiFTONKtxq3/arcgis/rest/services/NDFD_SnowFall_v1/FeatureServer/2`

**Implementation Location:** `src/components/resortInfo.tsx` (lines 351-394)

**Data Retrieved:**
- 72-hour snowfall forecast polygons
- Grid-based snowfall predictions with color coding

**Method:** Uses Esri Leaflet plugin to connect to ArcGIS Feature Service and render vector-based snowfall forecast data.

**Code Example:**
```typescript
const snowForecastLayer = EsriLeaflet.featureLayer({
    url: 'https://services9.arcgis.com/RHVPKKiFTONKtxq3/arcgis/rest/services/NDFD_SnowFall_v1/FeatureServer/2',
    style: snowfallStyle,
}).addTo(map);
```

### 4. **HTTPS/REST API - NWS Weather Warnings and Advisories (ArcGIS Feature Service)**

**Purpose:** Displaying active weather warnings and advisories

**Protocol:** HTTPS

**API Type:** ArcGIS Feature Service (REST API)

**Endpoint:** `https://services9.arcgis.com/RHVPKKiFTONKtxq3/arcgis/rest/services/NWS_Watches_Warnings_v1/FeatureServer/6`

**Implementation Location:** `src/components/resortInfo.tsx` (lines 398-448)

**Data Retrieved:**
- Active weather warnings (Winter Storm Warnings, Winter Weather Advisories, Blizzard Warnings)
- Advisory severity, urgency, and affected areas

**Method:** Uses Esri Leaflet to connect to National Weather Service ArcGIS Feature Service for real-time weather alerts.

**Code Example:**
```typescript
const advisoryLayer = EsriLeaflet.featureLayer({
    url: 'https://services9.arcgis.com/RHVPKKiFTONKtxq3/arcgis/rest/services/NWS_Watches_Warnings_v1/FeatureServer/6',
    style: advisoryStyle,
}).addTo(map)
```

### 5. **HTTPS - Base Map Tile Services**

**Purpose:** Providing base map imagery for the interactive map

**Protocols Used:**
- **Esri World Imagery:** `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}`
- **OpenStreetMap:** `https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`

**Implementation Location:** `src/components/resortInfo.tsx` (lines 254-265)

**Method:** Uses Leaflet.js tile layer protocol to load map tiles via HTTPS.

## Supporting Technologies

### Coordinate Projection Libraries
- **proj4** and **proj4leaflet**: Used to transform coordinates between EPSG:4326 (WGS84) and EPSG:3857 (Web Mercator) for proper alignment with NOAA map services.

### Mapping Libraries
- **Leaflet.js**: Core mapping library for rendering interactive maps
- **Esri Leaflet**: Extension library for integrating ArcGIS services with Leaflet maps
- **React Leaflet**: React wrapper for Leaflet functionality

### HTTP Client Libraries
- **openmeteo**: Specialized client for Open-Meteo API
- **axios**: General-purpose HTTP client (installed in dependencies)
- **Fetch API**: Native browser API for HTTP requests

## Data Formats

1. **JSON**: Used for API responses from Open-Meteo
2. **GeoJSON**: Used for vector features from ArcGIS Feature Services
3. **PNG Images**: Used for raster overlay images from NOAA MapServer
4. **Tile Images**: PNG tiles for base map layers

## Authentication and Security

- All weather data APIs are accessed via **HTTPS** (encrypted protocol)
- Open-Meteo API: Public API, no authentication required
- NOAA/ArcGIS Services: Public services, no authentication required
- User authentication for app features uses **JWT (JSON Web Tokens)** with Bearer authentication scheme

## Summary

The SkiSmart application uses **HTTPS** as the primary protocol for all weather data retrieval, with **REST APIs** serving as the architectural style for data exchange. The specific APIs include:

1. Open-Meteo Weather Forecast API (REST over HTTPS)
2. NOAA Snow Analysis MapServer (ArcGIS REST API over HTTPS)
3. NDFD Snowfall Forecast FeatureServer (ArcGIS REST API over HTTPS)
4. NWS Weather Warnings FeatureServer (ArcGIS REST API over HTTPS)
5. Base map tile services (Tile protocol over HTTPS)

All protocols ensure secure, encrypted transmission of weather data and support real-time visualization through the Leaflet.js mapping framework.
