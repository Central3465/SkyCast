const seform = document.getElementById("sform");
const cityinput = document.getElementById("cityinput");
const searchbtn = document.getElementById("searchbtn");
const weathersection = document.getElementById("weather");
const statusbox = document.getElementById("status");
const refreshbtn = document.getElementById("refreshbtn");
const lastupdated = document.getElementById("lastupdated");
const locatebtn = document.getElementById("locatebtn");
const favouriteslist = document.getElementById("favouriteslist");
const favouritebtn = document.getElementById("favouritebtn");

let currentloc = null;
let requestid = 0; // guards against stale responses overwriting newer ones
const HOURS_SHOWN = 8;
const FAVOURITES_KEY = "favourite-cities";
const CACHE_KEY = "cached-weather-data";
const CACHE_DUE = 10 * 60 * 1000;

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
        daily: [
            "precipitation_probability_max",
            "precipitation_sum",
            "weather_code",
            "temperature_2m_max",
            "temperature_2m_min"
        ].join(","),
        hourly: [
            "temperature_2m",
            "weather_code",
            "precipitation_probability",
        ].join(","),
        forecast_days: 5,
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
        weathersection.classList.add("hidden");
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
    const prob = weatherdata.daily.precipitation_probability_max[0];
    const fallrain = weatherdata.daily.precipitation_sum[0] ?? 0;
    const rainmsg = document.getElementById("rainmsg");
    const rainicon = document.getElementById("rainicon");

    if (prob === null || prob === undefined) {
        rainmsg.textContent = "No rain data available.";
        rainicon.textContent = "🌍";
    } else if (prob >= 50) {
        rainmsg.textContent = `${prob}% chance of rain. Expect ${fallrain} mm.`;
        rainicon.textContent = "🌧️";
    } else if (prob <= 5) {
        rainmsg.textContent = `${prob}% chance of rain. ${fallrain} mm expected, so an umbrella is probably not needed.`;
        rainicon.textContent = "🌤️";
    } else {
        rainmsg.textContent = `${prob}% chance of rain. Expect ${fallrain} mm.`;
        rainicon.textContent = "🌦️";
    }

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
    displayhourly(weatherdata);
    displaydaily(weatherdata);
    updatefavouritebtn();
    weathersection.classList.remove("hidden");
}

async function refreshweather() {
    if (!currentloc) return;

    refreshbtn.disabled = true;
    refreshbtn.textContent = "…";
    const thisrequest = ++requestid;
    showstatus("Getting the latest weather...");

    try {
        const weatherdata = await getweather(currentloc);
        if (thisrequest !== requestid) return;
        displayweather(currentloc, weatherdata);
    } catch (error) {
        console.error(error);
        if (thisrequest !== requestid) return;
        showstatus(error.message || "Unable to refresh weather. Please try again.", true);
    } finally {
        refreshbtn.disabled = false;
        refreshbtn.textContent = "↻";
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

function displayhourly(weatherdata) {
    const container = document.getElementById("hourlyforecast");
    const hourly = weatherdata.hourly;
    container.replaceChildren();
    if (!hourly || !hourly.time || hourly.time.length === 0) {
        container.textContent = "Hourly data unavailable.";
        return;
    }
    // current.time is 15-minute aligned so compare against the start of the current hour
    const currenthour = `${weatherdata.current.time.slice(0, 13)}:00`;
    let startIndex = hourly.time.findIndex(time => time >= currenthour);
    if (startIndex === -1) startIndex = 0;
    const nexthours = hourly.time.slice(startIndex, startIndex + HOURS_SHOWN);
    nexthours.forEach((time, index) => {
        const dataIndex = startIndex + index;
        const code = hourly.weather_code[dataIndex];
        const weather = weathercodes[code] || ["Unknown", "🌍"]; // fyi emoji was suggested by github copilot inline suggestions
        const probability = hourly.precipitation_probability[dataIndex];
        const card = document.createElement("div");
        card.className = "hourly-card";
        const timeElement = document.createElement("div");
        timeElement.className = "hourly-time";
        timeElement.textContent = time.split("T")[1].slice(0, 5);
        const icon = document.createElement("span");
        icon.className = "hourly-icon";
        icon.textContent = weather[1];
        const temperature = document.createElement("div");
        temperature.className = "hourly-temp";
        temperature.textContent = `${Math.round(hourly.temperature_2m[dataIndex])}°C`;
        const rain = document.createElement("div");
        rain.className = "hourly-rain";
        rain.textContent = probability == null ? "No data" : `${probability}%`;
        card.append(timeElement, icon, temperature, rain);
        container.appendChild(card);
    });
}

function displaydaily(weatherdata) {
    const container = document.getElementById("dailyforecast");
    const daily = weatherdata.daily;
    container.replaceChildren();
    if (!daily || !daily.time || daily.time.length === 0) {
        container.textContent = "Data unavailable.";
        return;
    }
    daily.time.slice(0, 5).forEach((date, index) => {
        const code = daily.weather_code[index];
        const weather = weathercodes[code] || ["Unknown", "🌍"];
        const card = document.createElement("div");
        card.className = "daily-card";
        const day = document.createElement("div");
        day.className = "daily-day";
        day.textContent = index === 0 ? "Today" : new Intl.DateTimeFormat("en-GB", { weekday: "short", timeZone: "UTC" }).format(new Date(`${date}T12:00:00Z`));
        const weatherinfo = document.createElement("div");
        weatherinfo.className = "daily-weather";
        const icon = document.createElement("span");
        icon.className = "daily-icon";
        icon.textContent = weather[1];
        const description = document.createElement("span");
        description.className = "daily-desc";
        description.textContent = weather[0];
        weatherinfo.append(icon, description);
        const temperatures = document.createElement("span");
        temperatures.className = "daily-temps";
        temperatures.textContent = `${Math.round(daily.temperature_2m_max[index])}°C / ${Math.round(daily.temperature_2m_min[index])}°C`;
        const rain = document.createElement("span");
        rain.className = "daily-rain";
        const probability = daily.precipitation_probability_max[index];
        rain.textContent = probability == null ? "No data" : `${probability}%`;
        card.append(day, weatherinfo, temperatures, rain);
        container.appendChild(card);
    });
}

function findmylocation() {
    if (!navigator.geolocation) {
        showstatus("Not supported by your browser", true);
        return;
    }

    locatebtn.disabled = true;
    locatebtn.textContent = "Finding your location 🤫🤫🤫";
    showstatus("Please approve location access 😑😑😑");
    navigator.geolocation.getCurrentPosition(async (position) => {
        const location = { name: "Your location", latitude: position.coords.latitude, longitude: position.coords.longitude };
        currentloc = location;
        weathersection.classList.add("hidden");
        try {
            await refreshweather();
        } finally {
            locatebtn.disabled = false;
            locatebtn.textContent = "Use my location";
        }
    },(error) => {
        let message;
        switch (error.code) {
            case error.PERMISSION_DENIED:
                message = "Permission denied.";
                break;
            case error.POSITION_UNAVAILABLE:
                message = "Location is unavailable.";
                break;
            case error.TIMEOUT:
                message = "Request timed out, this could be a slow connection or you're in a tunnel, try again when you reach clear skies (oh wait you need my app to know that 😏).";
                break;
            default:
                message = "Wow, an unexpected and unknown error occured. Please try again, if it still doesn't work, open an issue on Github.";
        }
        showstatus(message, true);
        locatebtn.disabled = false;
        locatebtn.textContent = "Use my location";
    }),
    { enabledHighAccuracy: true, timeout: 10000, maximumAge: 300000 };
};

locatebtn.addEventListener("click", findmylocation);

function getfavourites() {
    try {
        return JSON.parse(localStorage.getItem(FAVOURITES_KEY)) || [];
    } catch {
        return [];
    }
}

function savefavourites(favourites) {
    localStorage.setItem(FAVOURITES_KEY, JSON.stringify(favourites));
}

function isfavourite(location) {
    return getfavourites().some(city => city.latitude === location.latitude && city.longitude === location.longitude);
}

function togglefavourite() {
    if (!currentloc || !currentloc.latitude || !currentloc.longitude) return;
    let favourites = getfavourites();
    if (isfavourite(currentloc)) {
        favourites = favourites.filter(city => !(city.latitude === currentloc.latitude && city.longitude === currentloc.longitude));
    } else {
        favourites.push({ name: currentloc.name,
            latitude: currentloc.latitude,
            longitude: currentloc.longitude,
            admin1: currentloc.admin1 || "Admin67",
            country: currentloc.country || "Mars"
        });
    }
    savefavourites(favourites);
    renderfavourites();
    updatefavouritebtn();
}

function updatefavouritebtn() {
    const saved = currentloc && isfavourite(currentloc);
    favouritebtn.textContent = saved ? "⭐" : "☆"; // thank you github copilot for saving my time in having to find the right emoji
    favouritebtn.setAttribute("aria-label", saved ? "Remove from favourites" : "Add to favourites");
}

function renderfavourites() {
    const favourites = getfavourites();
    favouriteslist.replaceChildren();

    if (favourites.length === 0) {
        favouriteslist.textContent = "No favourite cities saved.";
        return;
    }

    favourites.forEach(city => {
        const button = document.createElement("button");
        button.className = "favourite-city";
        button.type = "button";
        const label = [city.name, city.admin1, city.country].filter(Boolean).join(", ");
        button.textContent = label;
        button.addEventListener("click", () => {
            currentloc = city;
            weathersection.classList.add("hidden");
            refreshweather();
        });
        favouriteslist.appendChild(button);
    })
}

favouritebtn.addEventListener("click", togglefavourite);
renderfavourites();