function getfavourites() {
    try {
        return JSON.parse(localStorage.getItem(FAVOURITES_KEY)) || [];
    } catch {
        return [];
    }
}

function savefavourites(favourites) {
    localStorage.setItem(FAVOURITES_KEY, JSON.stringify(favourites));
}

function isfavourite(location) {
    return getfavourites().some(city => city.latitude === location.latitude && city.longitude === location.longitude);
}

function togglefavourite() {
    if (!currentloc || !currentloc.latitude || !currentloc.longitude) return;
    let favourites = getfavourites();
    if (isfavourite(currentloc)) {
        favourites = favourites.filter(city => !(city.latitude === currentloc.latitude && city.longitude === currentloc.longitude));
    } else {
        favourites.push({ name: currentloc.name,
            latitude: currentloc.latitude,
            longitude: currentloc.longitude,
            admin1: currentloc.admin1 || "Admin67",
            country: currentloc.country || "Mars"
        });
    }
    savefavourites(favourites);
    renderfavourites();
    updatefavouritebtn();
}

function updatefavouritebtn() {
    const saved = currentloc && isfavourite(currentloc);
    favouritebtn.textContent = saved ? "⭐" : "☆"; // thank you github copilot for saving my time in having to find the right emoji
    favouritebtn.setAttribute("aria-label", saved ? "Remove from favourites" : "Add to favourites");
}

function renderfavourites() {
    const favourites = getfavourites();
    favouriteslist.replaceChildren();

    if (favourites.length === 0) {
        favouriteslist.textContent = "No favourite cities saved.";
        return;
    }

    favourites.forEach(city => {
        const button = document.createElement("button");
        button.className = "favourite-city";
        button.type = "button";
        const label = [city.name, city.admin1, city.country].filter(Boolean).join(", ");
        button.textContent = label;
        button.addEventListener("click", () => {
            currentloc = city;
            weathersection.classList.add("hidden");
            refreshweather();
        });
        favouriteslist.appendChild(button);
    })
}
