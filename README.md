# SkyCast

> A simple, polished weather explorer built with HTML, CSS and vanilla JavaScript.

SkyCast lets you search for a city and view its current weather. Weather data is provided by [Open-Meteo](https://open-meteo.com/), with no API key or server required.

## Features

- Search for a city by name.
- View current temperature, feels-like temperature, humidity, wind speed and precipitation.
- Read a plain-language weather description with an emoji.
- Refresh the current city's weather using saved coordinates.
- Responsive layout for desktop and mobile.
- Loading and error messages for API requests.

## Running locally

There is no build step, package installation or backend.

```bash
git clone https://github.com/Central3465/SkyCast.git
cd SkyCast
python3 -m http.server 8000
```

Open http://localhost:8000. VS Code Live Server also works.

## Project structure

```text
SkyCast/
├── index.html
├── css/
│   ├── style.css
│   └── mobile.css
├── js/
│   └── app.js
└── README.md
```

## Known issues

- [x] Implement the WMO weather-code descriptions and icons.
- [x] Refresh weather using the saved coordinates instead of geocoding the city again.
- [x] Show the last-updated time rather than the date.
- [x] Replace misleading HTML placeholders with neutral fallback text.
- [x] Reword the heading so it does not promise an unimplemented rain prediction.
- [x] Fix the "wherever" typo and location-name spacing.
- [ ] Add hourly and five-day forecasts.
- [ ] Add browser geolocation (with permission).
- [ ] Add locally saved favourite cities.
- [ ] Add Celsius/Fahrenheit selection.
- [ ] Improve loading feedback with a visual loading state.
- [ ] Add automated or manual browser tests.

## Data

SkyCast uses the [Open-Meteo Geocoding API](https://open-meteo.com/en/docs/geocoding-api) and [Forecast API](https://open-meteo.com/en/docs).

## License

MIT
