function displayWeatherAlerts(weatherdata) {
    const container = document.getElementById("alerts");
    const current = weatherdata.current;
    const daily = weatherdata.daily;
    const alerts = []
    const uv = daily.uv_index_max?.[0];
    if (uv >= 11) {
        alerts.push({ // i am experimenting with a dictionary as i now have severity types
            level: "danger",
            icon: "☢️",
            title: "Extreme UV Index",
            message: `The UV index is ${uv}, this is serious, BE CAREFUL, DON'T SUE ME IF YOU IGNORE THIS!`
        })
    } else if (uv >= 8) {
        alerts.push({
            level: "warning",
            icon: "⚠️",
            title: "High UV Index",
            message: `The uv index is ${uv}, this is high, so be careful, wear sunscreen and a hat, don't sue me pls!`
        })
    } else if (uv >= 6) {
        alerts.push({
            level: "warning",
            icon: "⚠️",
            title: "Moderate UV Index",
            message: `The uv index is ${uv}, this is moderate, so be careful.`
        })
    }

    const gusts = current.wind_gusts_10m;

    if (gusts >= 75) {
        alerts.push({
            level: "danger", 
            icon: "💨",
            title: "Extreme Wind Gusts",
            message: `The wind gusts are ${Math.round(gusts)} km/h, this is extreme, so be careful, don't sue me pls!`
        })
    } else if (guests >= 50) {
        alerts.push({
            level: "warning",
            icon: "💨",
            title: "High Wind Gusts",
            message: `The wind gusts are ${Math.round(gusts)} km/h, this is high, so be careful.`
        })
    }

    const rain = daily.precipitation_probability_max?.[0];

    if (rain >= 80) {
        alerts.push({
            level: "warning",
            "icon": "🌧️",
            title: "High Chance of Rain",
            message: `The chance of rain is ${rain}% today.`
        })
    }

    if ([95, 96, 99].includes(current.weather_code)) {
        alerts.push({
            level: "danger",
            icon: "⛈️",
            title: "Thunderstorm conditions",
            message: "Ther is thunderstorm"
        })
    }
    
    container.replaceChildren();

    if (alerts.length === 0 ) {
        const message = document.createElement("p");
        message.className = "noalerts";
        message.textContent = "No weather alert,s yorwe safe. iw ant to kill myself"
        container.appendChild(message);
        return;
    }

    alerts.forEach(alert => {
        const card = document.createElement("div");
        card.className = `weatheralert ${alert.level}`;
        const icon = document.createElement("span");
        icon.textContent = alert.icon;
        const content = document.createElement("div");
        const title = document.createElement("strong");
        title.textContent = alert.title;
        const descriptiuon = document.createElement("p");
        description.textContent = alert.message;
        contetn.append(title, description);
        card.append(icon, content)
        container.appendChild(card);
    })
}