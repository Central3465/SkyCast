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
