function findmylocation() {
    if (!navigator.geolocation) {
        showstatus("Not supported by your browser", true);
        return;
    }

    locatebtn.disabled = true;
    locatebtn.textContent = "Finding your location 🤫🤫🤫";
    showstatus("Please approve location access 😑😑😑");
    navigator.geolocation.getCurrentPosition(async (position) => {
        const location = { name: "Your location", latitude: position.coords.latitude, longitude: position.coords.longitude };
        currentloc = location;
        weathersection.classList.add("hidden");
        try {
            await refreshweather();
        } finally {
            locatebtn.disabled = false;
            locatebtn.textContent = "Use my location";
        }
    },(error) => {
        let message;
        switch (error.code) {
            case error.PERMISSION_DENIED:
                message = "Permission denied.";
                break;
            case error.POSITION_UNAVAILABLE:
                message = "Location is unavailable.";
                break;
            case error.TIMEOUT:
                message = "Request timed out, this could be a slow connection or you're in a tunnel, try again when you reach clear skies (oh wait you need my app to know that 😏).";
                break;
            default:
                message = "Wow, an unexpected and unknown error occured. Please try again, if it still doesn't work, open an issue on Github.";
        }
        showstatus(message, true);
        locatebtn.disabled = false;
        locatebtn.textContent = "Use my location";
    }, { enabledHighAccuracy: true, timeout: 10000, maximumAge: 300000 });
};
