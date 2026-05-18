# The Hearth

A perpetual calendar built on Connor's 13-month Greek-letter system, with Asatru holidays and seasonal themes woven into each month.

**Live:** https://lightbearer77.github.io/The-Hearth/

## What This Is

The seasonal/ritual counterpart to [The Forge](https://github.com/Lightbearer77/The-Forge). Where The Forge tracks tasks and execution, The Hearth marks time — Greek months, Asatru holidays, personal events, and the rhythms of the year.

## v0.1 Features

- 13-month Greek calendar (Alpha–Nu, 28 days each, plus Planning Day)
- Greek date primary, Gregorian date secondary on every cell
- Seasonal theme per month (Hearth, Stirring, Thaw, Sowing, Greening, Rising, Sun's Peak, First Fruit, Reaping, Gathering, Winter Nights, Descent, Yule)
- Asatru holidays pre-loaded — Þorrablót, Disting, Ostara, Sigrblót, Walpurgis, Midsummer, Freyfaxi, Haustblót, Winter Nights, Einherjar, Yule, Planning Day
- Events with title, description, location, time, and G1–G4 / Ritual / Holiday tagging
- Persistent storage via localStorage
- Mobile-first design

## v0.2 Roadmap

- Week and day views
- Recurring events
- PWA install + notifications
- Search and filter
- Ritual templates (month-open and month-close prompts)
- Export to ICS

## Stack

- React 18 + Vite
- Pure CSS (no framework)
- localStorage persistence (key: `hearth-calendar-v1`)
- GitHub Pages deployment via Actions

## Local Development

```
npm install
npm run dev
```

## Storage

Events live entirely in browser localStorage under `hearth-calendar-v1`. No backend, no auth, no cloud sync. Single-device for now.
