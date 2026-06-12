# Selma's Teaching Journey 🍎🇲🇦

A wholesome educational RPG for the browser. Follow **Selma**, an English teacher
trainee at CRMEF Safi, on her journey north through Morocco — El Jadida, Azemmour,
Bir Jdid, Had Soualem — to the **Grand Teaching Inspection** in Casablanca.

Built with **Next.js 15 (App Router) · TypeScript · TailwindCSS 4 · Framer Motion · Zustand**.

## Play

```bash
npm install
npm run dev      # http://localhost:3000
```

Production:

```bash
npm run build
npm start
```

Deploy: push to a Git repo and import into [Vercel](https://vercel.com) — zero config needed.

## Features

- 🗺️ **Interactive world map** with route visualization, locked cities, animated travel
- 📜 **12 story quests** across 6 cities, with branching dialogue and decision flags
- 🎮 **10 mini-game systems**: vocabulary matching, lesson sequencing, grammar quizzes,
  behavior management, portfolio writing, assessment sorting, time management,
  classroom simulation, micro-teaching, and the six-section final inspection
- 👥 **10 NPCs** with portraits, biographies, relationship levels and personal story arcs
- 🌱 **Progression**: 6 stats (0–100), XP, 10 levels, 7 unlockable abilities with passive bonuses
- 🎒 **Inventory** with rarity, categories, icons and stat effects
- 📓 **Journal**: Selma's reflections adapt to how well each quest went
- 🏆 **12 achievements** (some hidden)
- 🔚 **3 endings** (Outstanding / Promising / Needs More Experience) weighted by the
  whole journey, plus graduation ceremony, statistics screen, rolling credits and **New Game+**
- 💾 **Saves**: auto-save plus 3 manual slots in LocalStorage
- 🔊 **Procedural audio**: per-city ambient themes and SFX synthesized at runtime
  (no audio files), individually mutable

## Architecture

```
src/
├── app/                 # App Router pages (menu, map, city, quest, victory…)
├── components/          # Reusable UI (Button, Card, Modal, Portrait…) + GameShell
├── features/            # Feature modules: map, cities, quests, dialogue,
│                        # minigames, player, inventory, journal, achievements,
│                        # menu, settings, victory
├── stores/              # Zustand stores (game, settings, ui)
├── data/                # Content: cities, NPCs, quests, dialogues, items, levels
├── lib/                 # Engines: progression, ending, achievements, save, audio
├── types/               # Strong types for every system
├── hooks/               # useAutoSave, usePlayClock, useCityMusic
└── utils/               # math/format helpers
```
