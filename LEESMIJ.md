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
