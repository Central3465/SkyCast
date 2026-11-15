function convertTemp(celsius) {
    if (temperatureUnit === "F") {
        return (celsius * 9/5) + 32;
    }
    return celsius;
}

function formatTemp(celsius) {
    return `${Math.round(convertTemp(celsius))}°${temperatureUnit}`;
}

function toggleTempUnit() {
    temperatureUnit = (temperatureUnit == "C") ? "F" : "C";
    localStorage.setItem("temperatureUnit", temperatureUnit);
    updateunitbtn();
    if (currentWeatherData && currentloc) {
        displayWeather(currentloc, currentWeatherData);
    }
}

function updateunitbtn() {
    const unitbtn = document.getElementById("unitbtn");
    unitbtn.textContent = (temperatureUnit === "C") ? "°C" : "°F";
    unitbtn.setAttribute("aria-label", `Switch to ${temperatureUnit === "C" ? "Fahrenheit" : "Celsius"}`);
}

document.getElementById("unitbtn").addEventListener("click", toggleTempUnit);

updateUnitBtn();