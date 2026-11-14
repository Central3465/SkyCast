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
        const code = daily.weathercode[index];
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
