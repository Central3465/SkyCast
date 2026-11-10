const seform = document.getElementById("sform");
const cityinput = document.getElementById("cityinput");
const searchbtn = document.getElementById("searchbtn");
const weathersection = document.getElementById("weather");
const statusbox = document.getElementById("status");

const weathercodes = {
    0: ["Clear sky", "☀️"],
    1: ["I'll do it later", "😫"]
}

function showstatus(msg, iserror = false) {
    statusbox.textContent = msg;
    statusbox.classList.remove("hidden", "error");
    if (iserror) {
        statusbox.classList.add("error");
    }
}

function hidestatus() {
    statusbox.classList.add("hidden");
}

async function searchcity(city) {
    try {
        searchbtn.disabled = true;
        searchbtn.textContent = "Searching...";
        weathersection.classList.add("hidden");
        showstatus("Finding your city....");
        const geourl = `https://geocoding-api.open-meteo.com/v1/search`;
        geourl.search = new URLSearchParams({
            name: city,
            count: 1,
            language: "en", 
            format: "json"
        });
        const response = await fetch(geourl);
        if (!response.ok) {
            throw new Error(`${response.status} ${response.statusText}`);
        }
        const geodata = await response.json();
        if (!geodata.results || geodata.results.length === 0) {
            throw new Error("city not found");
        }
        const location = geodata.results[0];
        showstatus("getting the latest weather...");
        const weatherurl = new URL(`https://api.open-meteo.com/v1/forecast`);
        weatherurl.search = new URLSearchParams({
            latitude: location.latitude,
            longitude: location.longitude,
            timezone: auto,
            current: [
                "temperature_2m",
                "relative_humidity_2m",
                "apparent_temperature",
                "precipitation",
                "weather_code",
                "wind_speed_10m",
            ].join(",")
        })
        const weatherresponse = await fetch(weatherurl);
        if (!weatherresponse.ok) {
            throw new Error(`${weatherresponse.status} ${weatherresponse.statusText}`);
        }
        const weatherdata =await weatherresponse.json();
        displayweather(location, weatherdata);
    } catch (error) {
        console.error(error);
        weathersection.classList.add("hidden");
        showstatus(error.message, true);
    } finally {
        searchbtn.disabled = false;
        searchbtn.textContent = "Search";
    }
}

function displayweather(location, weatherdata) {
    const current = weatherdata.current_weather;
    const weather = weathercodes[current.weathercode];
    document.getElementById("cityname").textContent = `${location.name}, ${location.country}`;
    document.getElementById("currentdate").textContent = new Intl.DateTimeFormat("en-GB", {
        dateStyle: "full",
        timeZone: weatherdata.timezone
    }).format(new Date());
    document.getElementById("temperature").textContent = Math.round(current.temperature_2m);
    document.getElementById("weather-desc").textContent = weather[0];
    document.getElementById("feelslike").textContent = Math.round(current.apparent_temperature);
    document.getElementById("humidity").textContent = `${current.relative_humidity_2m}%`;
    document.getElementById("precipitation").textContent = `${current.precipitation}mm`;
    document.getElementById("windspeed").textContent = `${current.wind_speed_10m}km/hour`;
    hidestatus();
    weathersection.classList.remove("hidden");
}

seform.addEventListener("submit", (e) => {
    e.preventDefault();
    const city = cityinput.value.trim();
    if (!city) {
        showstatus("Please enter a city name", true);
        return;
    }
    searchcity(city);
})