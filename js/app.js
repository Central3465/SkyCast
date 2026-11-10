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