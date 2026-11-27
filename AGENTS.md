REHABOOM — Werkafspraken voor Claude en Codex
Datum: 22 november 2026 Eigenaar en eindbeslisser: Harry Doel: Claude (Anthropic) en Codex (OpenAI) werken allebei aan REHABOOM. Deze afspraken voorkomen dat versies uit elkaar lopen. Dit document wordt letterlijk overgenomen als AGENTS.md (Codex) en CLAUDE.md (Claude) in de root van de repository.


Lees dit document aan het begin van elke taak. Bij twijfel: stoppen en Harry vragen.
1. Huidige stand (23 november 2026, 19:00)
* GitHub main = v4.15 (fast-forward van v4.15-live, SHA1-gecontroleerd tegen de oude CLI-deploy). main is nu de enige bron van waarheid.
* Vercel-project rehaboom is gekoppeld aan GitHub; Production Branch = main. Productie (rehaboom.vercel.app) draait sinds 23 nov vanaf main (v4.15). Elke push of merge naar main gaat automatisch live. Andere branches krijgen alleen een preview-URL.
* Open PR #4: codex/v4.17-alle-3d-animaties → main (bevat v4.16 + v4.17). Door Claude gecontroleerd en goedgekeurd; wacht op telefoontest en merge door Harry.
* Open: claude/v4.18-sneller-laden, gebouwd bovenop v4.17 (zie sectie 9).
* Branches v4.10-live, v4.15-live, codex/v4.16-herstel en gh-pages zijn historisch. Niet meer op verder bouwen.

2. Eerst uitvoeren (eenmalig) — AFGEROND op 23 nov 2026: stap 1 (Codex), 2 en 3 (Claude) en 4 (Vercel stond al op main) zijn uitgevoerd.
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
* Voetbegrippen: BESLOTEN door Harry op 23 nov 2026: supinatie/pronatie = samengestelde beweging (supinatie = inversie + adductie + plantairflexie; pronatie = eversie + abductie + dorsaalflexie); inversie/eversie = kanteling van de voetzool. Dit is hoe de data in v4.17 al staat. Niet meer wijzigen. (Vervangt de keuze van oktober 2026.)
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
7. Openstaande punten (bijgewerkt 23 november 2026)
Opgelost in v4.16/v4.17 (PR #4): broncode in GitHub; offline-cache met niet-bestaande bestanden; ROM: 34 bewegingen met normwaarde, 12 bewust zonder graden met toelichting (ROMNOTE); M. Iliacus en M. ECRB op de lichaamskaart; combikaarten FDS/FDP, ECRL/ECRB en Iliopsoas niet meer dubbel; knop rechtsboven past op 390 px; voetbegrippen besloten.

Nog open:
1. Sneller laden: service worker downloadt bij installatie en bij elke versie opnieuw ±7 MB → Claude, branch claude/v4.18-sneller-laden.
2. Controlelijst voor review door een fysiotherapeut: KLAAR (23 nov), Claude Sheet "REHABOOM — Controlelijst fysiotherapeut" (46 bewegingen, 103 spieren, 18 testen). Correcties uit de review alleen via Harry verwerken.
3. Vezelarchitectuur bij 59 van 103 spieren leeg (bewust; alleen invullen met eenduidige bron).
4. Testen ontbreken voor elleboog, pols en enkel; geen sensitiviteit/specificiteit en doorverwijscriteria.
5. AVG: cliëntgegevens in localStorage onversleuteld; vereist vóór commercieel gebruik.
6. index.html (±377 kB) bevat data, opmaak en code door elkaar; opsplitsen zodat Claude en Codex parallel kunnen werken. Alleen na overleg met Harry.

8. Logboek
* 2026-11-22 — Claude: controle v4.10 (GitHub) en v4.15 (Vercel); dit document opgesteld.

* 2026-11-22 — Codex: alle 298 oorspronkelijke v4.15-bestanden per SHA1 hersteld. Lokale v4.16-herstelwijziging en 13 gerichte tests voorbereid. GitHub-overdracht is nog onvolledig: automatische goedkeuringscontrole blokkeert openbare publicatie van servercode. Niet mergen of als voltooid beschouwen. Zie LEESMIJ.md.

* 2026-11-22 — Codex: Harry heeft openbare publicatie inclusief servercode expliciet toegestaan. v4.15-live is volledig aangevuld en alle 298 oorspronkelijke bronbestanden zijn ook op GitHub per SHA1 gecontroleerd. v4.16 volgt als afzonderlijke herstelbranch. Geen merge naar main of productierelease uitgevoerd. De oorspronkelijke tests waren niet beschikbaar; 13 vervangende tests zijn toegevoegd in v4.16. Onafhankelijke controle door Claude en echte mobiele/offline/push-controle blijven vóór merge nodig.

* 2026-11-23 — Codex: Harry vraagt expliciet alle 3D-animaties te bouwen. v4.17 voegt oorspronkelijke schematische 3D-details en gezamenlijke camera-/afspeelbediening toe op codex/v4.17-alle-3d-animaties. Bestanden: index.html, motion-3d.js, nieuwe motion-details.js en motion-controls.js, premium.js/css, sw.js, packagebestanden, scripts/build.mjs en tests/motion.test.mjs. Geen directe productie-deploy; onafhankelijke baselinecontrole blijft open.

* 2026-11-23 — Claude: v4.15-live per SHA1 gelijk aan productie bevestigd en main daarnaartoe fast-forward gezet; productie draait nu vanaf main. v4.16 + v4.17 onafhankelijk gecontroleerd (build, 17 tests, service worker, datakruiscontrole, 390 × 844, 3D-viewer) en als PR #4 aangeboden. Harry koos de voetbegrippen (sectie 5). Claude start v4.18 (sneller laden), zie sectie 9.

9. Wie werkt waaraan (claims)
Werk alleen aan bestanden die niet door de ander geclaimd zijn. Claim vrijgeven = PR gemerged of hier doorgestreept.
* Claude — branch claude/v4.18-sneller-laden (sinds 23 nov 2026): sw.js, package.json, package-lock.json, LEESMIJ.md, tests/offline.test.mjs (nieuw), AGENTS.md, CLAUDE.md. Codex: deze bestanden niet aanpassen tot de PR gemerged is.
* Codex — geen open claim. Nieuw werk pas starten nadat PR #4 en de v4.18-PR zijn gemerged, vanaf de nieuwste main.

