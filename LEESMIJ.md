# REHABOOM v2 — installeren op Android

Dit is een PWA: een web-app die je als app op je telefoon installeert. Na de eerste keer openen werkt hij ook offline.

## 1. Online zetten (kies één)

**Vercel, zonder GitHub (snelst)**
1. Ga op je computer naar vercel.com → *Add New* → *Project*.
2. Sleep de map `rehaboom-pwa` in het uploadvenster.
3. Framework: *Other*. Geen build-commando nodig. Klik *Deploy*.

**Vercel via GitHub (automatische updates)**
1. Maak een nieuwe repo, zet de inhoud van deze map erin en push.
2. Importeer de repo in Vercel. Framework: *Other*.
3. Elke `git push` zet daarna automatisch een nieuwe versie live.

## 2. Installeren op je Samsung / Android

1. Open de Vercel-link in **Chrome** op je telefoon.
2. Tik op ⋮ (rechtsboven) → **App installeren** (of *Toevoegen aan startscherm*).
3. REHABOOM staat nu als app op je startscherm, zonder adresbalk.

## 3. Updates

Pas `index.html` aan en zet de nieuwe versie online. Verhoog dan ook het versienummer in `sw.js` (`rehaboom-v2-2` → `rehaboom-v2-3`), zodat telefoons de nieuwe versie ophalen. Sluit en open de app één keer om de update te zien.

## Bestanden

- `index.html` — de app (schermen en logica)
- `data.js` — spierdata (90 spieren) en de 9 tests
- `manifest.webmanifest` — naam, kleuren en iconen voor installatie
- `sw.js` — offline ondersteuning
- `icons/` — app-iconen
- `vercel.json` — zorgt dat updates direct worden opgepikt
