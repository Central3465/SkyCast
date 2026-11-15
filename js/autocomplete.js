const suggestionsbox = document.getElementById("suggestions");

let suggestiontimer;
let suggestionrequest = 0;
let activesuggestionindex = -1;
let currentsuggestions = []

function closesuggestions() {
    suggestionsbox.replaceChildren();
    suggestionsbox.classList.add("hidden");
    currentsuggestions = [];
    activesuggestionindex = -1
}

function choosesuggestion(location) {
    cityinput.value = location.name
    currentloc = location
    closesuggestions()
    weathersection.classList.add("hidden")
    refreshweather();
}

function updatesuggestionselection() {
    const buttons = suggestionsbox.querySelectorAll(".suggestion")
    buttons.forEach((b, i) => {
        const active = i === activesuggestionindex
        b.classList.toggle("active", active)
        b.setAttribute("aria-selected", String(active))
    })
    if (activesuggestionindex >= 0) {
        cityinput.setAttribute("aria-activedescendant", `suggestion-${activesuggestionindex}`)
    } else {
        cityinput.removeAttribute("aria-activedescendant")
    }
}

function displaysuggestions(results) {
    closesuggestions()

    if (!results || results.length === 0) return;

    currentsuggestions = results;

    results.forEach((l, i) => {
        const button = document.createElement("button")

        button.type = "button"
        button.id = `suggestion-${i}`
        button.className = "suggestion"
        button.setAttribute("role", "option")
        button.setAttribute("aria-selected", "false")

        const details = [l.admin1, l.country].filter(Boolean).join(", ")

        button.textContent = details ? `${l.name} - ${details}` : l.name

        button.addEventListener("click", () => {
            choosesuggestion(l)
        })

        suggestionsbox.appendChild(button)
    })

    suggestionsbox.classList.remove("hidden")
    cityinput.setAttribute("aria-expanded", "true")
}

async function getsuggestions(query) {
    const request = ++suggestionrequest

    try {
        const url = new URL("https://geocoding-api.open-meteo.com/v1/search")

        url.search = new URLSearchParams({
            name: query,
            count: 5,
            language: "en",
            format: "json"
        })

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Unable to load city suggestions whoops")
        }

        const data = await response.json()

        if (request !== suggestionrequest) return;

        displaysuggestions(data.results || [])
    } catch (error) {
        if (request === suggestionrequest) {
            console.warn("autocomplete:", error)
            closesuggestions()
        }
    }
}

cityinput.addEventListener("input", () => {
    clearTimeout(suggestiontimer);

    const query = cityinput.value.trim();

    if (query.length < 2) {
        suggestionrequest++;
        closesuggestions()
        return;
    }

    suggestiontimer = setTimeout(() => {
        getsuggestions(query);
    }, 350)
})

// i fucking hate keyboard navigation fuck accessibility shortcuts
cityinput.addEventListener("keydown", event => {
    if (event.key === "Escape") {
        closesuggestions()
        return
    }

    if (!currentsuggestions.length) return;

    if (event.key === "ArrowDown") {
        event.preventDefault()
        activesuggestionindex = (activesuggestionindex + 1) % currentsuggestions.length
    } else if (event.key === "ArrowUp") {
        event.preventDefault()
        activesuggestionindex = activesuggestionindex <= 0
            ? currentsuggestions.length - 1
            : activesuggestionindex - 1
    } else if (event.key === "Enter") {
        if (activesuggestionindex === -1) return;
        event.preventDefault()
        choosesuggestion(currentsuggestions[activesuggestionindex])
        return
    } else {
        return;
    }

    updatesuggestionselection()
})

document.addEventListener("click", event => {
    if (!suggestionsbox.contains(event.target) && event.target !== cityinput) {
        closesuggestions()
    }
})