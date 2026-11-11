const seform = document.getElementById("sform");
const cityinput = document.getElementById("cityinput");
const searchbtn = document.getElementById("searchbtn");
const weathersection = document.getElementById("weather");
const statusbox = document.getElementById("status");
const refreshbtn = document.getElementById("refreshbtn");
const lastupdated = document.getElementById("lastupdated");

let currentloc = null;
let lastWeatherRequest = null;

// WMO weather interpretation codes.
const weathercodes = {
    0: ["Clear sky", "☀️"],
    1: ["Mainly clear", "🌤️"],
    2: ["Partly cloudy", "⛅"],
    3: ["Overcast", "☁️"],
    45: ["Fog", "🌫️"],
    48: ["Depositing rime fog", "🌫️"],
    51: ["Light drizzle", "🌦️"],
    53: ["Moderate drizzle", "🌦️"],
    55: ["Dense drizzle", "🌧️"],
    56: ["Light freezing drizzle", "🌧️"],
    57: ["Dense freezing drizzle", "🌧️"],
    61: ["Slight rain", "🌦️"],
    63: ["Moderate rain", "🌧️"],
    65: ["Heavy rain", "🌧️"],
    66: ["Light freezing rain", "🌧️"],
    67: ["Heavy freezing rain", "🌧️"],
    71: ["Slight snowfall", "🌨️"],
    73: ["Moderate snowfall", "❄️"],
    75: ["Heavy snowfall", "❄️"],
    77: ["Snow grains", "🌨️"],
    80: ["Slight rain showers", "🌦️"],
    81: ["Moderate rain showers", "🌧️"],
    82: ["Violent rain showers", "⛈️"],
    85: ["Slight snow showers", "🌨️"],
    86: ["Heavy snow showers", "❄️"],
    95: ["Thunderstorm", "⛈️"],
    96: ["Thunderstorm with slight hail", "⛈️"],
    99: ["Thunderstorm with heavy hail", "⛈️"]
};

function showstatus(msg, iserror = false) {
    const msg2 = document.getElementById("statusmsg");
    msg2.textContent = msg;
    statusbox.classList.remove("hidden", "error");
    if (iserror) {
        statusbox.classList.add("error");
    }
}


function hidestatus() {
    statusbox.classList.add("hidden");
}

async function getweather(location) {
    const weatherurl = new URL("https://api.open-meteo.com/v1/forecast");

    weatherurl.search = new URLSearchParams({
        latitude: location.latitude,
        longitude: location.longitude,
        timezone: "auto",
        current: [
            "temperature_2m",
            "relative_humidity_2m",
            "apparent_temperature",
            "precipitation",
            "weather_code",
            "wind_speed_10m"
        ].join(",")
    });

    const weatherresponse = await fetch(weatherurl);

    if (!weatherresponse.ok) {
        throw new Error(`Weather API: ${weatherresponse.status} ${weatherresponse.statusText}`);
    }

    return weatherresponse.json();
}

async function searchcity(city) {
    try {
        searchbtn.disabled = true;
        searchbtn.textContent = "Searching...";
        weathersection.classList.add("hidden");
        showstatus("Finding your city...");

        const geourl = new URL("https://geocoding-api.open-meteo.com/v1/search");
        geourl.search = new URLSearchParams({
            name: city,
            count: 1,
            language: "en",
            format: "json"
        });

        const response = await fetch(geourl);

        if (!response.ok) {
            throw new Error(`Location API: ${response.status} ${response.statusText}`);
        }

        const geodata = await response.json();

        if (!geodata.results || geodata.results.length === 0) {
            throw new Error("City not found. Try another location.");
        }

        currentloc = geodata.results[0];
        await refreshweather();

    } catch (error) {
        console.error(error);
        weathersection.classList.add("hidden");
        showstatus(error.message || "Something went wrong. Please try again.", true);
    } finally {
        searchbtn.disabled = false;
        searchbtn.textContent = "Search";
    }
}

function displayweather(location, weatherdata) {
    const current = weatherdata.current;
    const weather = weathercodes[current.weather_code] || ["Unknown conditions", "🌍"];

    const locationparts = [
        location.name,
        location.admin1,
        location.country
    ].filter(Boolean);

    document.getElementById("cityname").textContent =
        [...new Set(locationparts)].join(", ");

    document.getElementById("date").textContent =
        new Intl.DateTimeFormat("en-GB", {
            dateStyle: "full",
            timeZone: weatherdata.timezone
        }).format(new Date());

    document.getElementById("wicon").textContent = weather[1];
    document.getElementById("temp").textContent = Math.round(current.temperature_2m);
    document.getElementById("weather-desc").textContent = weather[0];
    document.getElementById("feelslike").textContent = `${Math.round(current.apparent_temperature)}°C`;
    document.getElementById("humidity").textContent = `${current.relative_humidity_2m}%`;
    document.getElementById("precipitation").textContent = `${current.precipitation} mm`;
    document.getElementById("windspeed").textContent = `${Math.round(current.wind_speed_10m)} km/h`;

    const updatedAt = new Date(current.time);
    lastupdated.textContent = `Last updated: ${new Intl.DateTimeFormat("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: weatherdata.timezone
    }).format(updatedAt)}`;

    hidestatus();
    weathersection.classList.remove("hidden");
}

async function refreshweather() {
    if (!currentloc) return;

    refreshbtn.disabled = true;
    refreshbtn.textContent = "…";
    showstatus("Getting the latest weather...");

    try {
        const weatherdata = await getweather(currentloc);
        lastWeatherRequest = weatherdata;
        displayweather(currentloc, weatherdata);
    } catch (error) {
        console.error(error);
        showstatus(error.message || "Unable to refresh weather. Please try again.", true);
    } finally {
        refreshbtn.disabled = false;
        refreshbtn.textContent = "Refresh";
    }
}

seform.addEventListener("submit", (e) => {
    e.preventDefault();

    const city = cityinput.value.trim();

    if (!city) {
        showstatus("Please enter a city name.", true);
        return;
    }

    searchcity(city);
});

refreshbtn.addEventListener("click", refreshweather);
