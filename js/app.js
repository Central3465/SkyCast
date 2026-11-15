seform.addEventListener("submit", (e) => {
    e.preventDefault();

    const city = cityinput.value.trim();

    if (!city) {
        showstatus("Please enter a city name.", true);
        return;
    }

    searchcity(city);
});

refreshbtn.addEventListener("click", refreshweather);
locatebtn.addEventListener("click", findmylocation);
favouritebtn.addEventListener("click", togglefavourite);

renderfavourites();

window.addEventListener("offline", () => {
    showstatus("you're offline so skycast will not work as requests to open-meteo require a stable internet conneciton.", true)
})

window.addEventListener("online", () => {
    hidestatus()
})