# ED Elektro · Landingpage Klimaanlagen

SEO- und SEA-optimierte Unterseite `/klimaanlagen` für **ED Elektro und Klimasysteme** (Nieder-Olm · Mainz · Alzey), gebaut für das Framer-Projekt
`https://framer.com/projects/ED-Elektro--GRncpWfUFfXslEuDw7mt-eBaGN` (Vorlage: Node `XG1HgOBTY`).

## Aufbau

```
site.config.json            Telefon, E-Mail, Adresse, Formular-Endpunkt, Framer-Projekt  ← zuerst ausfüllen (alle TODO)
src/body.html               Inhalt der Seite (eine Quelle für beide Ausgaben)
src/styles.css              Styles, komplett unter .edk gekapselt
src/main.js                 Formular, Tracking, Anzeigen-Modus, Message Match
build.mjs                   erzeugt ↓
public/index.html           statische Seite (Vorschau oder eigenes Hosting)
framer/KlimaLandingpage.tsx Framer-Code-Komponente (gleicher Inhalt)
framer/seo.json             Titel, Beschreibung und Canonical für die Framer-Seiteneinstellungen
framer/sync.mjs             überträgt alles per Framer Server API
```

## In Framer übertragen

Voraussetzung: Node 22+ und ein API-Key aus Framer (Einstellungen → API Keys). Den Key nie ins Repo committen.

```bash
cd projects/ed-elektro-klimaanlagen/framer
npm install
FRAMER_API_KEY=… npm run sync          # Code-Datei + Seite /klimaanlagen (als Entwurf)
FRAMER_API_KEY=… npm run publish-site  # zusätzlich veröffentlichen
```

Das Skript
1. legt die Code-Datei `KlimaLandingpage.tsx` an oder aktualisiert sie,
2. klont beim ersten Lauf die Vorlagenseite nach `/klimaanlagen`. Navigation, Footer und Styles der Vorlage bleiben erhalten,
3. setzt die Komponente ein, mit ausgeschalteter eigener Kopf-/Fußzeile.

**Danach von Hand in Framer** (die Server API setzt keine Seiten-SEO-Felder):
- Seiten-Einstellungen `/klimaanlagen`: Titel und Beschreibung aus `framer/seo.json` eintragen, Social-Bild hochladen.
- Platzhalter-Inhalte der Vorlage zwischen Navigation und Footer löschen.
- Entwurf-Status entfernen und die Seite in Navigation und Footer der Hauptseite verlinken (interne Verlinkung).
- Telefon, E-Mail und Formular-Endpunkt lassen sich auch später direkt an der Komponente ändern (Property Controls).

Alternativ ohne Framer: `public/index.html` ist eigenständig lauffähig.

## SEO

| Element | Umsetzung |
| --- | --- |
| Haupt-Keyword | „Klimaanlage“ + Ort (Mainz, Nieder-Olm, Alzey), Nebenkeywords: Split-/Multi-Split-Klimaanlage, Klimaanlage Einbau/Montage/Kosten/Wartung, Klimaanlage mit Heizfunktion |
| Title (≤ 60 Z.) | `Klimaanlage kaufen & montieren in Mainz, Nieder-Olm, Alzey \| ED Elektro` |
| Meta-Description | Leistung + Region + Handlungsaufforderung |
| Struktur | genau eine H1, H2 pro Suchintention (Arten, Ablauf, Kosten, Region, FAQ) |
| Strukturierte Daten | JSON-LD `HVACBusiness`/`Electrician`, `Service`, `BreadcrumbList`, `FAQPage` (FAQ wird automatisch aus dem sichtbaren Text erzeugt) |
| Local SEO | Einsatzorte als Text + `areaServed`; Adresse und Telefon kommen ins Schema, sobald sie in `site.config.json` stehen |
| Technik | kein Bild und kein Framework im kritischen Pfad, gekapseltes CSS, mobil geprüft bei 320/375/414/768/1280 px ohne horizontales Scrollen |

## SEA (Google Ads)

**Finale URL:** `https://ed-elektro.de/klimaanlagen?lp=ads&kw={Anzeigengruppe}`
Tracking-Vorlage: `{lpurl}&utm_source=google&utm_medium=cpc&utm_campaign={campaignid}&utm_term={keyword}`

Die Seite reagiert automatisch auf Anzeigen-Traffic (`gclid`, `utm_medium=cpc` oder `lp=ads`):
- **Fokus-Modus:** Die Navigation wird ausgeblendet. Formular und Telefonnummer bleiben das einzige Ziel.
- **Message Match:** `kw=` tauscht die H1 gegen eine zur Anzeigengruppe passende Variante. Es gibt nur freigegebene Texte, nie freien Text aus der URL:
  `split`, `multisplit`, `mainz`, `alzey`, `niederolm`, `heizen`, `gewerbe`, `wartung`.
- **Offline-Conversions:** `gclid`/`gbraid`/`wbraid` und UTM-Werte werden für die Sitzung gespeichert und als versteckte Felder mitgesendet.
- **Conversions (`dataLayer` → GTM):** `generate_lead` (Formular erfolgreich), `form_start`, `phone_click`. In GTM als Google-Ads-Conversions anlegen.
- Mobil gibt es eine feste Leiste „Anrufen / Angebot anfragen“.

Vorschlag Anzeigengruppen und Keywords (Phrase/Exact):

| Anzeigengruppe (`kw=`) | Keywords |
| --- | --- |
| mainz | klimaanlage mainz, klimaanlage einbauen mainz, klimatechnik mainz |
| alzey / niederolm | klimaanlage alzey, klimaanlage nieder-olm, klimaanlage rheinhessen |
| split | split klimaanlage mit montage, split klimaanlage einbauen lassen |
| multisplit | multisplit klimaanlage einbauen, klimaanlage mehrere räume |
| heizen | klimaanlage mit heizfunktion, klimaanlage zum heizen |
| wartung | klimaanlage wartung, klimaanlage reinigen lassen |

Negative Keywords: `mobil, mobile, monoblock, kaufen günstig, auto, kfz, selber, diy, gebraucht, obi, bauhaus, media markt, job, ausbildung`.

Responsive-Search-Ad-Bausteine (Titel ≤ 30 Zeichen, Beschreibung ≤ 90 Zeichen):
- Titel: `Klimaanlage vom Fachbetrieb` · `Klimaanlage in Mainz` · `Split-Klimaanlage mit Montage` · `Kostenlose Besichtigung` · `Elektro + Kälte aus einer Hand` · `Kühlen & effizient heizen`
- Beschreibungen: `Beratung, Montage, Elektroanschluss und Wartung aus einer Hand. Jetzt anfragen.` · `Split- und Multi-Split-Anlagen für Haus, Wohnung und Gewerbe in Rheinhessen.`
- Sitelinks: Ablauf (`#ablauf`), Kosten (`#kosten`), Häufige Fragen (`#faq`), Angebot anfragen (`#angebot`)

## Offene Punkte vor dem Livegang

- [ ] Telefon, E-Mail und Adresse in `site.config.json` eintragen, dann `node build.mjs`.
- [ ] Formular-Endpunkt festlegen (z. B. Make-Webhook oder Formspree). Ohne Endpunkt öffnet das Formular eine vorausgefüllte E-Mail.
- [ ] Einsatzorte prüfen und ergänzen.
- [ ] FAQ zu Förderung und F-Gase fachlich gegenlesen; die Rechtslage ändert sich.
- [ ] Zertifizierungen, Herstellerpartner, Bewertungen und echte Projektfotos ergänzen, falls vorhanden. Auf der Seite ist bewusst nichts davon erfunden.
- [ ] Social-Bild `og-klimaanlagen.jpg` (1200 × 630) anlegen.
- [ ] Datenschutzerklärung um Formular und Google Ads/GTM ergänzen, Consent-Banner prüfen.
