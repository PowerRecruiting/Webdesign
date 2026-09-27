# ED Elektro – Wärmepumpen-Landingpage & Funnel

Umgesetzt im Framer-Projekt **ED-Elektro (Testseite)**, beide Seiten als Entwurf (nicht veröffentlicht):

| Seite | Zweck |
|---|---|
| `/waermepumpe` | Landingpage (Google-Ads-Ziel, SEO) – alle CTAs führen in den Funnel |
| `/waermepumpe/preis` | Funnel: Heizlast → Leistungsklasse → Preis → Planungstermin |
| `/waermepumpe/termin` | Sekundär-CTA „Direkt Planungstermin vereinbaren“: gleicher Funnel, startet direkt mit der Terminanfrage |

Beide Seiten bauen auf den Klima-Seiten (`/klimaanlage`, `/klimaanlage/preis`) auf: gleicher Header, gleicher Footer, gleiche Code-Komponenten, gleiche Tonalität.

## Positionierung (aus den Meetings mit Jemmy, 09./16./23.09.2026)

- **Regionaler Meisterbetrieb statt Vertriebsgesellschaft:** eigene Monteure, fester Ansprechpartner, kein Verkäufer im Wohnzimmer.
- **Direktheit:** Der Preis ist sichtbar, **bevor** jemand Kontaktdaten eingibt. Der CTA ist ein Vor-Ort-Termin, kein Verkaufsanruf.
- **Förderung als Service:** ED stellt den Hauptantrag, der Kunde gibt danach nur noch seine Daten ein.
- **Kernregionen:** Wörrstadt, Mainz, Alzey, Worms, Bad Kreuznach.

## Landingpage – Aufbau (Stand Briefing 27.09.2026)

Conversion-Weg in zwei Stufen: **Förderung verstehen → Preis online sehen → Planungstermin vor Ort.**
Die Förderung wird als Full-Service kommuniziert – ED Elektro stellt den Antrag. Bewusst **kein Förderrechner**.

1. Hero: „Wärmepumpe vom Elektro-Meister aus Wörrstadt“ · „Preis online sehen, Förderung erledigen wir, Planung persönlich vor Ort.“ · CTA „Preis berechnen“ + „Direkt Planungstermin vereinbaren“
2. Vertrauensleiste (Meisterbetrieb, 12 Jahre, 3.000+ Aufträge, eigene Monteure)
3. **Modul A – Förderung** (`Foerderung.tsx`): „Bis zu 22.400 € Zuschuss für Ihre neue Heizung“, drei Kacheln (30 % Grund · +16 % Klima · +10–40 % Einkommen), statische Beispielrechnung in Euro, Full-Service-Block „Wir kümmern uns um den Antrag“ (3 Schritte), Stichtag- und Wichtig-Zeile, Fußnote. Sätze als Eigenschaften pflegbar (Änderung 2027).
4. Rechner-Einstieg „Was kostet eine Wärmepumpe in Rheinhessen?“ (CalculatorEntry → `/waermepumpe/preis`)
5. **Modul C – Planungstermin** (`Planungstermin.tsx`): „Online sehen Sie den Preis. Vor Ort planen wir Ihre Anlage.“ – vier Prüfpunkte (Heizlast, Heizkörper/Vorlauf, Aufstellort/Schall, Stromanschluss/Zählerschrank), Nutzen-Zeile, CTA + Telefon
6. „Kennen Sie das?“ – Heizkosten, alte Heizung, Altbau, Förder-Dschungel, Vertriebsvermittler, keine Preistransparenz
7. Ablauf in vier Schritten (online angeben → Heizlast & Preis → Telefonat → Vor-Ort-Termin, Angebot und Förderantrag)
8. Einblicke (Bildergalerie)
9. Leistungen: Luft-Wasser-Wärmepumpe (MHG), Warmwasser, Austausch der alten Heizung, Förderantrag und Wartung
10. Fachbetrieb statt Vertriebsvermittler (Vergleich)
11. Preis & Transparenz: ab 20.883 € brutto (6–8 kW ohne WW), was enthalten ist, was separat kommt
12. Abschluss-CTA · Regionaler Beweis · FAQ (Altbau, Heizlast, Dauer, Förderung, Warmwasser, Einzugsgebiet) · Final-CTA

Mobil zusätzlich: **Sticky-Button** „Preis berechnen“ + Telefon-Icon (`StickyMobileCta.tsx`, ab Tablet ausgeblendet).

## Funnel – Fragen (bedingt, 6–8 Schritte je nach Antwort)

| # | Frage | Nur wenn … |
|---|---|---|
| 1 | Gebäude (EFH, DHH/RH, ZFH, MFH/Gewerbe) | – (MFH/Gewerbe → individuell) |
| 2 | Heizung heute (Gas, Öl, Strom/Nachtspeicher, Sonstiges, Neubau) | kein MFH |
| 3 | Jahresverbrauch: Zahl in kWh / Liter Heizöl / m³ Erdgas, oder „weiß ich nicht“ | kein Neubau |
| 4 | Wohnfläche | Verbrauch unbekannt oder Neubau |
| 5 | Baujahr / Sanierungsstand | wie 4 |
| 6 | Heizflächen (FBH, Heizkörper, beides, keine) | – („keine“ → individuell) |
| 7 | Warmwasser über Wärmepumpe (ja / nein / weiß nicht) | – |
| 8 | Personen im Haushalt | Flächen-Schätzung und WW nicht „nein“ |
| 9 | Demontage alte Heizung | kein Neubau |
| 10 | Zeitraum | – |

## Rechenlogik

**Heizlast**

- Über den Verbrauch: `kWh × Nutzungsgrad (85 %, Strom 100 %) ÷ 2.000 Vollbenutzungsstunden`
  (1 Liter Heizöl ≈ 1 m³ Erdgas ≈ 10 kWh)
- Über die Fläche: `m² × W/m²` (vor 1978: 120 · 1978–94: 90 · 1995–2015: 60 · ab 2016: 40) + 0,25 kW je Person für Warmwasser
- Heizkörper (oder beides): +10 % Auslegungszuschlag
- Leistungsklasse: die nächste ≥ Heizlast aus 6 / 8 / 12 / 18 kW. Über 18 kW → gewerblich/individuell

**Preise (Tabelle ED Elektro, netto → brutto mit 19 %)**

| Klasse | ohne WW | mit WW |
|---|---|---|
| 6 kW | 17.549 € / 20.883 € | 21.814 € / 25.958 € |
| 8 kW | 17.549 € / 20.883 € | 21.814 € / 25.958 € |
| 12 kW | 18.134 € / 21.579 € | 22.074 € / 26.268 € |
| 18 kW | 18.654 € / 22.198 € | 23.244 € / 27.660 € |

Demontage der alten Heizung: +600 € netto im Ab-Preis (600–700 € laut Meeting). Angezeigt werden **beide Varianten parallel als Brutto-Ab-Preis**. Die Variante, die zu den Angaben passt, ist hervorgehoben.

Alle Preise, Zuschläge und Annahmen sind in Framer als Eigenschaften der Komponente editierbar, ohne den Code anzufassen.

## Tracking & Übergabe

- `dataLayer`-Events: `calculator_start`, `calculator_result` (Heizlast, Klasse, WW), `lead_submit` (Wert 1.500 €, anpassbar), jeweils mit `funnel: "waermepumpe"`
- „Ziel-URL“ (Webhook) ist leer → Testmodus: kein Versand, kein Conversion-Event. Für den Livegang die gleiche URL wie beim KlimaFunnel eintragen (FormSpark / Monday / Powerbird-Schnittstelle).

## Offen / mit Jemmy abstimmen

- Förderzahlen (30 % / +16 % / +10–40 %, max. 80 % auf 28.000 €, Stichtag 2027) vor Launch gegen die KfW-Seite prüfen – Stand laut Briefing 21.07.2026
- Planungstermin kostenlos oder anrechenbare Gebühr? Bis dahin steht auf den Termin-Stellen bewusst nur „unverbindlich“
- kW-Faustformel: Briefing nennt Öl-Liter ÷ 250 bzw. Gas-kWh ÷ 2.500, Baujahr-Stufen 1979–2001 / 2002–2015 und Grenze 16 kW; umgesetzt ist die Variante aus dem Meeting (Preistabelle bis 18 kW). Welche gilt?

- Seine Tabelle Jahresverbrauch → Wärmepumpentyp (hat er im Backend). Bis dahin gelten die Faustwerte oben; alle sind als Eigenschaften anpassbar.
- Heizkörper-Zuschlag 10 % und W/m²-Werte bestätigen
- MHG-Modellnamen je Leistungsklasse (aktuell nur „MHG, x kW“)
- Liste „Was separat angeboten wird“ (Heizkörpertausch, Zählerschrank) prüfen
- Wärmepumpen-Bilder für Hero und Galerie (aktuell Porträt bzw. Klima-Referenzen)
- Conversion-Wert pro Lead
