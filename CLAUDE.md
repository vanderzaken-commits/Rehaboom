REHABOOM — Werkafspraken voor Claude en Codex
Datum: 22 november 2026 Eigenaar en eindbeslisser: Harry Doel: Claude (Anthropic) en Codex (OpenAI) werken allebei aan REHABOOM. Deze afspraken voorkomen dat versies uit elkaar lopen. Dit document wordt letterlijk overgenomen als AGENTS.md (Codex) en CLAUDE.md (Claude) in de root van de repository.


Lees dit document aan het begin van elke taak. Bij twijfel: stoppen en Harry vragen.
1. Huidige stand (22 november 2026)
Plek
	Versie
	Opmerking
	Vercel, project rehaboom → rehaboom.vercel.app
	v4.15 ("klikbare deltoideus")
	Gedeployed door Codex op 21 nov, rechtstreeks, niet via GitHub
	GitHub vanderzaken-commits/Rehaboom, branch v4.10-live
	v4.10
	Frontend van 18 nov, zonder servercode
	GitHub main en gh-pages
	v3.3
	Verouderd. NIET naar pushen of deployen tot stap 2 hieronder klaar is
	

Wat ontbreekt in GitHub en alleen bij Codex/Vercel staat:


* api/favorites.js, api/portal.js, api/testers.js
* lib/favorites.mjs, package-lock.json, tests/, scripts/deltoid-build.mjs
* gewijzigde index.html, motion-3d.js, sw.js, package.json, scripts/build.mjs (v4.15)
2. Eerst uitvoeren (eenmalig)
1. Codex: push de volledige v4.15-broncode naar een nieuwe branch v4.15-live in vanderzaken-commits/Rehaboom. Niet mergen.
2. Claude: controleer v4.15-live tegen de live deployment (SHA1 per bestand via Vercel) en zet hem daarna als nieuwe main.
3. Voeg dit document toe als AGENTS.md en CLAUDE.md in de root.
4. Koppel Vercel-project rehaboom aan GitHub-branch main (Production Branch = main), zodat een merge automatisch live gaat.
3. Vaste werkregels
1. GitHub main is de enige bron van waarheid. Wat niet in main staat, bestaat niet.
2. Nooit rechtstreeks naar Vercel deployen (geen vercel deploy, geen handmatige upload). Live gaat alleen via een merge naar main.
3. Elke taak op een eigen branch: codex/<onderwerp> of claude/<onderwerp>. Merge via een pull request.
4. Begin elke taak met de nieuwste main (git fetch + rebase/merge). Nooit verder bouwen op een oude zip of een oude sessie.
5. Niet tegelijk aan dezelfde bestanden werken. Laat Harry weten welke bestanden je aanraakt; de ander wacht tot die PR gemerged is.
6. Versienummer bij elke wijziging verhogen: cachenaam in sw.js (rehaboom-v4-16-...), commitbericht REHABOOM v4.16: ..., en LEESMIJ bijwerken.
7. De broncode moet gelijk zijn aan wat live staat. Geen build-scripts die bronbestanden tijdens de build herschrijven (zoals deltoid-build.mjs nu met sw.js doet); pas de bron zelf aan.
8. Na elke wijziging die een ander moet weten: korte notitie onderaan dit document (sectie 7) of in de PR-beschrijving.
4. Controle voor elke merge
* npm run build slaagt.
* npm test slaagt (map tests/ moet in de repo staan).
* App getest op telefoonformaat (390 × 844) zonder JavaScript-fouten in de console, alle tabbladen geopend.
* Geen horizontale overloop op 390 px breed.
* Service worker installeert. Elk bestand in de CORE-lijst van sw.js moet bestaan; één ontbrekend bestand laat de hele installatie mislukken en dan werkt de app niet offline.
* Datakruiscontrole: elke spiernaam in bewegingen, oefeningen en tests is terug te vinden in de spierkaarten (DETAILS), elke antagonist-koppeling bestaat, vlak–as-regel klopt.
5. Inhoudelijke regels (anatomie en kinesiologie)
* Taal: interface en data in het Nederlands, spiernamen in Latijnse conventie (M. ..., Mm. ...).
* Vlak ↔ as: sagittaal vlak ↔ frontale (transversale) as; frontaal vlak ↔ sagittale as; transversaal vlak ↔ longitudinale as.
* M/B/P: telt het aantal gewrichten dat een spier letterlijk overspant: [M] mono-articulair, [B] bi-articulair, [P] poly-articulair. Gebruik deze telling consequent; bij twijfel niet wijzigen maar aan Harry voorleggen.
* Voetbegrippen: OPEN VRAAG. In oktober koos Harry: supinatie/pronatie = kanteling in het frontale vlak, inversie/eversie = samengestelde beweging om de schuine as. De live data (v4.10) gebruikt het omgekeerde. Niets aan wijzigen tot Harry heeft gekozen; daarna hier vastleggen.
* Afbeeldingen: nooit een afbeeldings-URL verzinnen. Alleen toevoegen na echte controle van de bron. Toegestaan: Gray's Anatomy (publiek domein) en Anatomography/BodyParts3D (CC BY-SA 2.1 JP) via Wikimedia Commons; licentievermelding moet in de app zichtbaar zijn.
* Visible Body en andere commerciële atlassen: niets kopiëren of nabouwen.
* Geen medische claims. REHABOOM is een naslagwerk; inhoud wordt vóór klinisch gebruik door een fysiotherapeut gecontroleerd.
* Weglaten is beter dan gokken. Bij tegenstrijdige bronnen (bijvoorbeeld vezelarchitectuur) het veld leeg laten.
6. Ontwerp en techniek
* Mobiel eerst: tikvlakken minimaal ±40 px, segmentknoppen horizontaal scrollbaar (overflow-x:auto, white-space:nowrap).
* Huisstijl: Ink navy #14212B, sage-grijs #ECEEE6, coral #C6552F (agonisten/merk), staalblauw #2E6F8C (synergisten). Lettertypen: Barlow Condensed (koppen), Inter (tekst), IBM Plex Mono (datalabels).
* Navigatie met tegels en doorklikken heeft de voorkeur boven zoeklijsten.
* Cliëntgegevens (tab Begeleiding) staan nu onversleuteld in localStorage; alleen de portaal-sync is versleuteld (AES-GCM). Niet uitbreiden met gezondheidsgegevens zonder overleg met Harry (AVG).
* Alles wat Harry en eerder bespreekt, wordt uitgevoerd, tenzij samen anders besloten. Niets stilletjes laten vallen.
7. Openstaande punten (uit controle van 22 november 2026)
Kritiek:


1. Broncode v4.15 + servercode in GitHub zetten (sectie 2).
2. Offline werkt niet: sw.js cachet vooraf media/d9b59d53822a-still.webp, media/d9b59d53822a-thumb.webp en media/d9165fbdcd66-thumb.webp, die niet bestaan (404). Regels verwijderen of bestanden toevoegen.


Inhoud (gecontroleerd op v4.10, nog te bevestigen op v4.15): 3. Voetbegrippen: keuze van Harry afwachten (sectie 5). 4. ROM ontbreekt bij 12 van 46 bewegingen: schoudergordel (6), horizontale abductie/adductie schouder, endo/exorotatie knie, supinatie/pronatie voet. 5. M. Iliacus en M. Extensor Carpi Radialis Brevis hebben geen plek op de lichaamskaart (MUSCLE_REGION). 6. Combikaarten FDS/FDP, ECRL/ECRB en Iliopsoas naast de losse spieren: controleren op dubbele weergave.


Scherm: 7. Knop "Professional" rechtsboven valt ±10 px buiten een 390 px-scherm.
8. Logboek
* 2026-11-22 — Claude: controle v4.10 (GitHub) en v4.15 (Vercel); dit document opgesteld.

* 2026-11-22 — Codex: alle 298 oorspronkelijke v4.15-bestanden per SHA1 hersteld. Lokale v4.16-herstelwijziging en 13 gerichte tests voorbereid. GitHub-overdracht is nog onvolledig: automatische goedkeuringscontrole blokkeert openbare publicatie van servercode. Niet mergen of als voltooid beschouwen. Zie LEESMIJ.md.

* 2026-11-22 — Codex: Harry heeft openbare publicatie inclusief servercode expliciet toegestaan. v4.15-live is volledig aangevuld en alle 298 oorspronkelijke bronbestanden zijn ook op GitHub per SHA1 gecontroleerd. v4.16 volgt als afzonderlijke herstelbranch. Geen merge naar main of productierelease uitgevoerd. De oorspronkelijke tests waren niet beschikbaar; 13 vervangende tests zijn toegevoegd in v4.16. Onafhankelijke controle door Claude en echte mobiele/offline/push-controle blijven vóór merge nodig.
