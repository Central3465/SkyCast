async function searchcity(city) {
    try {
        searchbtn.disabled = true;
        searchbtn.textContent = "Searching...";
        weathersection.classList.add("hidden");
        showstatus("Finding your city...");

        const geourl = new URL("https://geocoding-api.open-meteo.com/v1/search");
        geourl.search = new URLSearchParams({
            name: city,
            count: 1,
            language: "en",
            format: "json"
        });

        const response = await fetch(geourl);

        if (!response.ok) {
            throw new Error(`Location API: ${response.status} ${response.statusText}`);
        }

        const geodata = await response.json();

        if (!geodata.results || geodata.results.length === 0) {
            throw new Error("City not found. Try another location.");
        }

        currentloc = geodata.results[0];
        weathersection.classList.add("hidden");
        await refreshweather();

    } catch (error) {
        console.error(error);
        weathersection.classList.add("hidden");
        showstatus(error.message || "Something went wrong. Please try again.", true);
    } finally {
        searchbtn.disabled = false;
        searchbtn.textContent = "Search";
    }
}
