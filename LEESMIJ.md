# REHABOOM v4.10 (Premium)

Broncode van de versie die op https://rehaboom.vercel.app draait (deployment van 18 november 2026).

## Bouwen
`npm run build` controleert de scripts en kopieert de app naar `dist/`. Een build uit deze map levert exact dezelfde bestanden op als de live versie.

## Let op: servercode ontbreekt nog
De live versie heeft drie serverfuncties die niet uit Vercel terug te halen waren:
- `api/favorites.js` (favorieten synchroniseren)
- `api/portal.js` (versleuteld cliëntportaal)
- `api/testers.js` (testerspaneel)
- en `lib/favorites.mjs`, `package-lock.json` en `tests/`

Zet deze bestanden in deze branch voordat je hem samenvoegt met `main`. Zonder deze bestanden zou een automatische deploy vanuit `main` die functies uitschakelen.
