# REHABOOM v4.19 — anatomische 3D-weergave

424 bronstructuren, waaronder 219 spiermeshes links/rechts, uit BodyParts3D 3.0 (DBCLS, CC BY-SA 2.1 Japan), met afzonderlijke deltoideus- en trapeziusdelen. Botten en de geselecteerde spier, alle beschikbare spieren of alleen botten. Tik op een spier voor de bestaande spierkaart. Oorsprong, aanhechting en functie blijven uit de bestaande gegevens komen.

De bronvormen zijn met polygoonreductie geschikt gemaakt voor mobiel. Het rig en de vervorming visualiseren de bewegingsrichting; het zijn geen gemeten gewrichtshoeken, patiëntspecifieke anatomie of gevalideerde weefselmechanica. Niet elke tekstuele spieronderverdeling heeft een afzonderlijke bronmesh: daarvoor wordt geen segment verzonnen. De afzonderlijke M. Longissimus Lumborum heeft geen eigen bronmesh; de app vermeldt dit expliciet. Tekstuele vezelgroepen binnen een onverdeelde bronmesh worden niet als afzonderlijk gesegmenteerde anatomie voorgesteld. Manifest: `docs/anatomy-source-manifest.json`. Conversie: `scripts/anatomy-build.py`; niet onderdeel van de normale appbuild.

## Eerdere versies (historisch)

### REHABOOM v4.18 — sneller laden

## Nieuw

- Installeren downloadt alleen de app-schil (±1 MB in plaats van ±7 MB).
- De 3D-viewer, spierbeelden en atlasbeelden (±8,7 MB, 212 bestanden) worden daarna op de achtergrond binnengehaald, 4 tegelijk. Wat al binnen is, wordt niet opnieuw gedownload.
- Beelden en 3D staan in een aparte cache (`rehaboom-media`) die bij een update blijft staan. Een nieuwe versie kost daardoor ±1 MB in plaats van opnieuw ±7 MB. Een nieuwe bestandsversie gaat via een nieuwe `?v=` in de URL; de oude versie wordt dan opgeruimd.
- Na de eerste volledige achtergronddownload werkt alles offline, ook de 3D-viewer.

## Gecontroleerd

- `npm run build` en `npm test` (21 tests, waarvan 4 nieuw in `tests/offline.test.mjs`).
- Chromium 390 × 844: service worker installeert, mediacache gevuld (212/212), daarna offline herladen: alle tabbladen, afbeeldingen en de 3D-viewer werken, geen JavaScript-fouten.

Gebouwd op `codex/v4.17-alle-3d-animaties` (PR #4). Eerst PR #4 mergen.

# REHABOOM v4.17 — alle bewegingen in 3D

## Nieuw

- Alle 62 bestaande bewegings-ID’s gebruiken de 3D-viewer: 46 gewrichtsbewegingen, twee aanvullende heup-/stabilisatiedemonstraties en 14 detailbewegingen.
- De eerdere vlakke details voor vingers, duim, tenen, ribben en buikwand zijn vervangen door oorspronkelijke, scharnierende 3D-leermodellen. Dit zijn schematische modellen, geen gescande of klinisch gevalideerde anatomie.
- Alle viewers hebben eigen kijkhoek, hoogte, zoom, afspeelsnelheid en heen-en-terug-herhaling. De rotatie-as kan bij enkelvoudige rotaties zichtbaar worden gemaakt. Buikwandstabilisatie heeft geen vaste rotatie-as.
- Horizontaal slepen draait het model; dezelfde bediening is via schuifregelaars met het toetsenbord beschikbaar.
- Afspelen stopt aan het einde, tenzij herhalen is aangezet. Animaties pauzeren zodra het tabblad op de achtergrond staat.
- Ook de software-renderer toont alle 62 animaties; WebGL is niet vereist.
- Geen externe modellen, abonnementen of nieuwe afhankelijkheden toegevoegd. Bestaande spierdata, voetterminologie en ROM-referenties blijven behouden.

## Controle

`npm run build`, `npm test` en `node scripts/audit-data.mjs`.

De rendertests controleren elke animatie op zichtbare geometrie, verschillende begin-/eindstanden en eindige projectiecoördinaten. Ook camerabeweging, onafhankelijke viewers, afspeelsnelheid, eindstop en herhaling worden gecontroleerd.

## Status

Gebouwd op de bestaande herstelbranch v4.16, met de nieuwste main opgehaald ter vergelijking. Main bevat nog v3.3 en is niet als basis over de nieuwere broncode heen gezet. Deze wijziging staat op `codex/v4.17-alle-3d-animaties`; de v4.15-snapshot en v4.16-herstelbranch blijven beschikbaar. Publicatie loopt via GitHub. Geen directe Vercel-upload of merge naar productie.

De onafhankelijke baselinecontrole en inhoudelijke anatomiecontrole blijven open. De nieuwe modellen ondersteunen uitleg over de beweging; zij tonen geen individuele diagnose, gemeten bewegingsuitslag of exacte spierdeformatie. Het rechtenregister voor de nieuwe geometrie staat in `motion-assets.json`.

---

# REHABOOM v4.16 — voorgestelde herstelversie

Deze lokale branch bouwt op de exact herstelde v4.15-broncode. Alle 298 oorspronkelijke bestanden van Vercel zijn bewaard in de lokale branch recovery-v4.15; de SHA1-lijst staat in docs/v4.15-source-sha1.json.

## Wijzigingen

- Ontbrekende bestanden uit de serviceworker-CORE-lijst verwijderd; de offline-installatie wordt niet meer door die drie 404-responses geblokkeerd.
- Build kopieert de definitieve HTML en serviceworker byte voor byte en herschrijft geen bronbestanden. Testerpaneel, private-route-uitsluitingen en push-handler staan in de broncode zelf.
- Iliacus en extensor carpi radialis brevis aan de lichaamskaart gekoppeld; deltoideusdelen hebben ook een regiokoppeling.
- Iliopsoas, ECRL/ECRB en FDS/FDP worden bij bladeren en zoeken via de afzonderlijke spieren getoond. Bestaande groepskaarten en bewaarde groepsfavorieten blijven toegankelijk.
- ROM zonder betrouwbare standaardhoek toont de bestaande toelichting als referentie, in plaats van een leeg getal. Geen nieuwe numerieke ROM-waarden toegevoegd.
- Compacte weergave van de Professional-knop tot 430 px; tikvlakken minimaal 40 px.
- De miniatuur van flexor carpi ulnaris gebruikt het bestaande, bijbehorende bronbeeld.

## Controleren

npm ci
npm run build
npm test
node scripts/audit-data.mjs

13 gerichte tests slagen. De datacontrole van 46 bewegingen, oefening- en testverwijzingen, spierkaartregio’s en vlak-as-koppelingen heeft geen onopgeloste verwijzingen.

## Publicatiestatus

GitHub-branch v4.15-live bevat de volledige oorspronkelijke broncode. De 298 bronbestanden zijn ook na publicatie tegen de SHA1-lijst gecontroleerd. Harry heeft op 22 november 2026 expliciet ingestemd met openbare publicatie, inclusief de drie serverbestanden. Deze herstelwijziging staat op de aparte branch codex/v4.16-herstel. Er is niets samengevoegd met main en de productieversie is niet aangepast.

Vóór merge blijven nodig: onafhankelijke controle door Claude, echte mobiele browsercontrole op 390 × 844, en functionele controle van serviceworker/offline/push in de browser. Bestaande klinische inhoud moet nog inhoudelijk worden gevalideerd. De voetterminologie blijft ongewijzigd in afwachting van Harry’s keuze. Het ontbrekende EDL-bronbeeld blijft een apart mediapunt; de ontbrekende bestanden blokkeren de offline-installatie niet meer.
  
