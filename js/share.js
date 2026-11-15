const sharebtn = document.getElementById("sharebtn")

async function shareweather() {
    if (!currentloc || !currentWeatherData) {
        showstatus("no data to share", true)
        return
    }

    const current = currentWeatherData.current
    const weather = weathercodes[current.weather_code] || ["no data", "❌"]

    const city = [ currentloc.name, currentloc.admin1, currentloc.country].filter(Boolean).join(", ")

    const message = [
        `Weather in ${city}`,
        `Temperature is ${Math.round(convertTemp(current.temperature_2m))}৹${temperatureUnit}`,
        `Conditions are ${weather[0]}`,
        `Feels like ${formatTemp(current.apparent_temperature)}`,
        `Humidity is ${current.relative_humidity_2m}%`,
        `Wind speed is ${Math.round(current.wind_speed_10m)} km/h`,
        "",
        "Check it out on SkyCast (trust me it's the best app):",
        "https://central3465.github.io/SkyCast"
    ].join("\n")

    try {
        if (navigator.share) {
            await navigator.share({ title: `Weather in ${city}`, text: message})
        } else if (navigator.clipboard) {
            await navigator.clipboard.writeText(message)
            showstatus("copied to your clipboard!")
        } else {
            showstatus("uuhh i dont think your browser supports sharing", true)
        }
    } catch (error) {
        if (error.name !== "AbortError") { // no abortions!!!!!
            console.error("failed:", error)
            showstatus("unable to share weather", true)
        }
    } 
}

sharebtn.addEventListener("click", shareweather)