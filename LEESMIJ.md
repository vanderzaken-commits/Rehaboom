# REHABOOM v4.15

Volledige oorspronkelijke broncode van deployment dpl_Cm1T7yNpqPLUp35pBcT7J8qj6jcF (21 november 2026), inclusief de drie serverfuncties, lib/favorites.mjs en package-lock.json. Alle 298 bronbestanden zijn per SHA1 gecontroleerd; zie docs/v4.15-source-sha1.json.

Deze herstelbranch behoudt de oorspronkelijke v4.15-code. Niet rechtstreeks deployen of samenvoegen: eerst onafhankelijke controle door Claude volgens AGENTS.md en CLAUDE.md.

## Bouwen

npm ci
npm run build

De oorspronkelijke build wijzigt sw.js en verrijkt de build-uitvoer. Dit wordt in de opvolgende herstelwijziging opgelost. De oorspronkelijke tests/ is niet in Vercel opgenomen en kon dus niet worden hersteld. Gerichte vervangende tests volgen in de opvolgende branch; npm test slaagt op deze historische snapshot nog niet.

## Bekende punten

Drie ontbrekende mediapaden blokkeren de serviceworker-installatie. De ontbrekende ROM-waarden, twee spierkaartkoppelingen, combinatiekaarten en mobiele knop worden apart onderzocht. Voetterminologie blijft ongewijzigd in afwachting van Harry’s keuze.
