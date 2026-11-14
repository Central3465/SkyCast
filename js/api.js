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
