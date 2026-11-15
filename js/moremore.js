// Open-Meteo returns local times without a timezone (e.g. "2026-11-15T16:30"),
// so take the clock time straight from the string instead of parsing it as a Date.
function formatLocalTime(isoTime) {
    if (!isoTime) return "not available";
    return isoTime.slice(11, 16);
}

function formatduration(seconds) {
    if (seconds == null) return "not available";
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
}

function getUVDesc(uv) {
    if (uv == null) return "not available";
    if (uv < 3) return `${uv} - Low`;
    if (uv < 6) return `${uv} - Moderate`;
    if (uv < 8) return `${uv} - High`;
    if (uv < 11) return `${uv} - Very High`;
    return `${uv} - EXTREME, AHHHHHHHHHHHHHHHHH!`;
}

function displaymoremore(weatherdata) {
    const daily = weatherdata.daily;
    if (!daily || !daily.time?.length) return;
    document.getElementById("sunset").textContent = formatLocalTime(daily.sunset?.[0]);
    document.getElementById("uvindex").textContent = getUVDesc(daily.uv_index_max?.[0]);
    document.getElementById("daylight").textContent = formatduration(daily.daylight_duration?.[0]);
}