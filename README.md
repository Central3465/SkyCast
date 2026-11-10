# SkyCast

> *"A polished weather app."*
> That's what the previous README said, which was optimistic.

SkyCast is a weather app (you can call it that, but it's more like a website). You type in a city, it tells you what the sky is doing there. That's the whole point of this app, no waffle, just simple weather. It's plain HTML, CSS and Javascript, because React's time, blood and sweat isn't worth it for this simple prototype that I'm not even going to continue. 

Similarly to my other projects, this is part of Hackclub Terra event to which I lost track of what week this is, maybe Week 3. 

Weather data comes from the best [Open-Meteo](https://open-meteo.com/), which is free and needs no API key. Fortunately, I don't have to worry about any secrets. 

## Status: it's a work in progress, and not meant to be continued

The page looks nice. The search box looks nice. The refresh button looks nice. The site looks nice. You look nice. 

Whether any of them *do* anything is a separate question, I hope my code works. 

## What it's meant to do

- Search for a city by name.
- Show the current temperature, "feels-like" (subjective = no complaints), humidity, wind speed and precipitation.
- Show a weather description with an emoji as a form of TL:DR.
- Refresh the weather without retyping the city, ux feature. 
- Protecting your eyesight from your phone screen (there's a separate `mobile.css` to hopefully keep you from kissing your phone).

## Running it

There's no build step, no `npm install`, no dependencies, chef's kiss.

```bash
git clone https://github.com/Central3465/SkyCast.git
cd SkyCast
python3 -m http.server 8000
```

Or instead of python, you can use VS Code Live Server or open the HTML file directly.

## Project structure

Look above :D.
498 lines in total. It's a small project, so I'm sure I can save some time by not messing with the formatting for the project structure.

## Known issues (uh oh)

The following below are known issues, to which I may or may not fix depending on the impact:

1. Weather codes are not yet implemented as referenced by a placeholder "I'll do it later", the full list of these codes is somewhat longer. 
2. Refresh re-geocodes the city name instead of reusing the coordinates I already saved. It works in theory, in the same way that walking to the shop via the next town works in theory. 
3. Last updated shows the date, not the time, which is useful if you refresh once a day. I will fix this.
4. HTML still ships with placeholders, this is intentional in case the Javascript fails, so there are no empty gaps. 
5. The heading asks "is it going to rain today?" and then the app never answers that question. English teachers will love this, it's a rhetorical question!
6. Small stuff: I am illiterate, "whereever" is spelled wrong in the subtitle, city names are joined with a comma and no space. 

None of these is hard to fix. Together they are the solid foundation of a lovely static page and a convincing error message.

## Roadmap

- Fix the things in the list above.
- Add the rest of the weather codes.
- Show the time in "last updated".
- Use relative paths so it works on Github pages.
- Say whether it's actually going to rain today, as promised.
- Celsius / Fahrenheit toggle.
- A loading state that isn't just the word "Loading..." sitting there.
- Learn what a test is.

## Contributing

Issues and pull requests are welcome. Chances are I already know about the bugs, but it's nice to be told by someone else. It makes it feel less like talking to myself. 

## License
MIT License.