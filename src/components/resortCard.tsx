import "@/styles/components/resortCard.css"
import { fetchWeatherApi } from 'openmeteo';
import { ResortObj } from "../routes/resort";

function ResortCard(resort: ResortObj ) {

    
    async function retrieveData() {
        
        localStorage.setItem("curResort", JSON.stringify(resort));

        const params = {
	        "latitude": resort.Lat,
	        "longitude": resort.Long,
	        "hourly": ["temperature_2m", "precipitation_probability", "snowfall", "snow_depth", "visibility", "wind_speed_10m"],
            "temperature_unit": "fahrenheit",
	        "wind_speed_unit": "mph",
	        "precipitation_unit": "inch",
	        "forecast_hours": 12
        };
        const url = "https://api.open-meteo.com/v1/forecast";
        const responses = await fetchWeatherApi(url, params);

        // Helper function to form time ranges
        const range = (start: number, stop: number, step: number) =>
	        Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);

        // Process first location. Add a for-loop for multiple locations or weather models
        const response = responses[0];

        // Attributes for timezone and location
        const utcOffsetSeconds = response.utcOffsetSeconds();;

        const current = response.current()!;
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

        localStorage.setItem("temperature", parseFloat(weatherData.hourly.temperature2m[0].toFixed(2)).toString());
        localStorage.setItem("precipitationProb", parseFloat(weatherData.hourly.precipitationProbability[0].toFixed(2)).toString());
        localStorage.setItem("snowfall", parseFloat(weatherData.hourly.snowfall[0].toFixed(2)).toString());
        localStorage.setItem("snowDepth", parseFloat(weatherData.hourly.snowDepth[0].toFixed(2)).toString());
        localStorage.setItem("visibility", parseFloat(weatherData.hourly.visibility[0].toFixed(2)).toString());
        localStorage.setItem("windSpeed", parseFloat(weatherData.hourly.windSpeed10m[0].toFixed(2)).toString());
    }

    return <div className="cardContainer">
        <h1 className="resortName">{resort.Name}</h1>
        <div className="resortImg">
            <img src={resort.ImageLink}></img>
        </div>
        <div className="resortInfo">
            <a href="/resortInfo">
                <button className="visitPageButton" onClick={retrieveData}>Visit Page</button>
            </a>
            <div className="address">
                <h2>{resort.Address}, {resort.Zipcode}</h2>
            </div>
        </div>
    </div>
}

export default ResortCard