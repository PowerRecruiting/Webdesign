# ED-Elektro (Live-Projekt) – Wärmepumpen-Landingpage

Framer-Projekt „ED-Elektro“ (GRncpWfUFfXslEuDw7mt). Beide Seiten als **Entwurf**:

| Seite | Inhalt |
|---|---|
| `/waermepumpe` | Landingpage nach dem Vorbild der Referenzseite |
| `/waermepumpe/preis` | `WaermepumpenFunnel` – alle Fragen, plus Frage 1 „Bestand oder Neubau“ |

## Aufbau `/waermepumpe`

1. **Hero** (`WpHero`) – Frage 1 direkt im Hero (Bestandsgebäude / Neubau → `/waermepumpe/preis?bauart=…`, Rechner startet bei Frage 2), 4 Häkchen, Bild mit Badges
2. Vertrauensleiste (`TrustBar`)
3. **Qualifikationen** – Meister, Elektro-/Klimakonzession, Techniker/Bachelor, 4,6 ★ Google (statt Siegel-Logos)
4. **Förderung** (`FoerderungKurz`) – knapp erklärt, ohne Kacheln; Full-Service „Das übernehmen wir für Sie“
5. **In 3 Schritten** (`SchritteBilder`) – mit Bildern, abwechselnd
6. **6 Gründe** (`Vorteile`)
7. **Wärmepumpe vs. Gas/Öl** (`HeizungsVergleich`) – Beispielwerte, alle editierbar
8. **Produkt** (`ProduktMHG`) – Eckdaten, Bild aus eigenem Projekt
9. Warum Ihre Nachbarn ED Elektro wählen (`Comparison`)
10. Preis und Leistungsumfang (`PriceTransparency`)
11. **Bewertungen** – Google-Note + Link; Liste echter Bewertungen startet leer
12. FAQ (mit FAQ-Markup) · Einzugsgebiet · Querverweis Klimaanlage · Abschluss-CTA · Sticky-Button mobil

Jedes neue Modul endet mit „Preis und Förderung prüfen“ → `/waermepumpe/preis` (Google-Ads-Parameter werden mitgenommen).

## Vor dem Livegang prüfen

- Vergleichswerte (Heizkosten, CO₂) und Förderangaben (Stand 21.07.2026) freigeben
- Qualifikationen: Bezeichnungen der Konzessionen/Abschlüsse bestätigen
- Bewertungen: echte Google-Bewertungen eintragen, Link auf das Google-Profil setzen
- Produktdaten MHG (Modellbezeichnung, ggf. Produktfoto)
- Ziel-URL (Webhook) im Funnel eintragen – sonst Testmodus ohne Versand
- Navigation/Footer um Klimaanlage & Wärmepumpe ergänzen; Querverweis auf der Klima-Seite zeigt noch auf `/dienstleistungen/wärmepumpen`
