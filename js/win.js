function getwindDirection(degrees) {
    if (degrees == null) return "not available";

    const directions = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
    return directions[Math.round(degrees / 22.5) % 16];
}

function displayWindDetails(current) {
    const direction = current.wind_direction_10m;
    const gusts = current.wind_gusts_10m;
    document.getElementById("winddirection").textContent = direction == null ? "not available" : `${getwindDirection(direction)} (${Math.round(direction)})`
    document.getElementById("windcompass").style.transform = direction == null ? "rotate(0deg)" : `rotate(${direction}deg)`;
    document.getElementById("windcompass").textContent = direction == null ? "not available" : getwindDirection(direction);
    document.getElementById("windgusts").textContent = gusts == null ? "not available" : `${Math.round(gusts)} km/h`;
}