async function getweather(location) {
    const cacheid = `${location.latitude},${location.longitude}`;
    try {
        const cache = JSON.parse(localStorage.getItem(CACHE_KEY) || "{}");
        const cached = cache[cacheid];
        if (cached && Date.now() - cached.timestamp < CACHE_DUE) {
            return cached.data;
        }
    } catch (error) {
        console.error("Error reading cache:", error);
    }
    const url = new URL("https://api.open-meteo.com/v1/forecast");
    url.search = new URLSearchParams({
        latitude: location.latitude,
        longitude: location.longitude,
        timezone: "auto", 
        daily: [
            "precipitation_probability_max",
            "precipitation_sum",
            "temperature_2m_max",
            "temperature_2m_min",
            "weathercode"
        ].join(","),
        hourly: [
            "temperature_2m",
            "weather_code",
            "precipitation_probability"
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
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Weather API: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    try {
        const cache = JSON.parse(localStorage.getItem(CACHE_KEY) || "{}");
        cache[cacheid] = { timestamp: Date.now(), data };
        const entries = Object.entries(cache).sort((a,b) => b[1].timestamp - a[1].timestamp).slice(0, 10);
        localStorage.setItem(CACHE_KEY, JSON.stringify(Object.fromEntries(entries)))
    } catch (error) {
        console.warn("Cannot save weather cache", error)
    }
    return data;
}