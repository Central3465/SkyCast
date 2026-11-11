# SkyCast

> A simple, polished weather explorer built with HTML, CSS and JavaScript. 

*"polished" is an overstatement, it's really not, there will be the occasional bugs and i will try to fix them*

## Features

- Search for a city by name.
- View current temperature, feels-like temperature, humidity, wind speed and precipitation.
- A nice TL:DR short summary with an emoji. 
- Refresh the current city's weather using saved coordinates.
- Responsive layout for desktop and mobile, sure.
- Loading (an animated loading state instead of the generic message 🤯) and error messages.

## Running locally

There is no build step, package installation or backend 🥳.

```bash
git clone https://github.com/Central3465/SkyCast.git
cd SkyCast
python3 -m http.server 8000
```

Open http://localhost:8000. VS Code Live Server also works, and is my preferred way.

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

## Credits

Open-Meteo - https://open-meteo.com/

# Contributing

Sure, go ahead. Please, nothing too drastic without discussing with me first. Small bug fixes or UI changes are acceptable. 

## License

MIT