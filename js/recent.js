function getRecentSearches() {
    try {
        return JSON.parse(localStorage.getItem(RECENT_KEY)) || []
    } catch {
        return [];
    }
}

function saveRecentSearch(location) {
    if (!location || location.latitude == null || location.longitude == null) {
        return;
    }

    let recent = getRecentSearches()

    recent = recent.filter(city => city.latitude !== location.latitude || city.longitude !== location.longitude)

    recent.unshift({
        name: location.name,
        admin1: location.admin1 || "",
        country: location.country || "",
        latitude: location.latitude,
        longitude: location.longitude
    })

    recent = recent.slice(0, MAX_RECENT);

    localStorage.setItem(RECENT_KEY, JSON.stringify(recent))
    renderrecentsearches()
}

function renderrecentsearches() {
    const recent = getRecentSearches()

    recentlist.replaceChildren()

    if (recent.length === 0 ) {
        recentlist.textContent = "No recent searches yet."
        return;
    }

    recent.forEach(city => {
        const button = document.createElement("button")
        button.type = "button"
        button.className = "recent-city"
        button.textContent = `${[city.name, city.country].filter(Boolean).join(", ")}`
        button.addEventListener("click", () => {
            currentloc = city
            weathersection.classList.add("hidden")
            refreshweather()
        })
        recentlist.appendChild(button)
    })
}

function clearRecentSearches() {
    localStorage.removeItem(RECENT_KEY)
    renderrecentsearches()
}

clearrecentbtn.addEventListener("click", clearRecentSearches)
renderrecentsearches()