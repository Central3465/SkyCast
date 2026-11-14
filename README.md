# SkyCast

> A simple, polished weather explorer built with HTML, CSS and JavaScript. 

*"polished" is an overstatement, it's really not, there will be the occasional bugs and i will try to fix them*

## Features

- Search for a city by name or your location!.
- View current temperature, feels-like temperature, humidity, wind speed and precipitation.
- A nice TL:DR short summary with an emoji. 
- Refresh the current city's weather using saved coordinates.
- Responsive layout for desktop and mobile, sure.
- Loading (an animated loading state instead of the generic message 🤯) and error messages.
- A cleaner and darker UI, no more ugly old hags 🥳!

## How do I access it?

There will be a Github Pages link here and on the repo once I have it set up.

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

## Privacy

I respect your privacy. Although there is no need for a dedicated privacy policy page as this is just a small side project, this website only collects your location at the request from you, e.g: you must approve the location request. This website does not store your precise coodinates or send it anywhere, with the exception of storing your city for quicker access. If you have any queries or complaints (which I'm quite confused as to why), please consult with ChatGPT.

## Credits

Open-Meteo - https://open-meteo.com/

# Contributing

Sure, go ahead. Please, nothing too drastic without discussing with me first. Small bug fixes or UI changes are acceptable. 

## License

MIT