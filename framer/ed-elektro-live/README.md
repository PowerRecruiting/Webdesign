# ED-Elektro (Live-Projekt) – Wärmepumpen-Landingpage

Framer-Projekt „ED-Elektro“ (GRncpWfUFfXslEuDw7mt). Beide Seiten als **Entwurf**:

| Seite | Inhalt |
|---|---|
| `/waermepumpe` | Landingpage nach dem Vorbild der Referenzseite |
| `/waermepumpe/preis` | `WaermepumpenFunnel` – alle Fragen, plus Frage 1 „Bestand oder Neubau“ |

## Aufbau `/waermepumpe`

1. **Hero** (`WpHero`) – Frage 1 direkt im Hero (Bestandsgebäude / Neubau → `/waermepumpe/preis?bauart=…`, Rechner startet bei Frage 2), 4 Häkchen, Bild mit Badges
2. Vertrauensleiste (`TrustBar`) – „Meisterbetrieb für Elektrotechnik, Heizung und Sanitär“ (WP-01)
3. **Qualifikationen** – Meister (Elektro, Heizung, Sanitär), Elektro-/Klimakonzession, Techniker/Bachelor, 4,6 ★ Google (statt Siegel-Logos)
4. **Förderung** (`FoerderungKurz`) – knapp erklärt, ohne Kacheln; Full-Service „Das übernehmen wir für Sie“
5. **In 3 Schritten** (`SchritteBilder`) – mit Bildern, abwechselnd
6. **6 Gründe** (`Vorteile`)
7. **Wärmepumpe vs. Gas/Öl** (`HeizungsVergleich`) – Beispielwerte, alle editierbar
8. **Produkt** (`ProduktMHG`) – Eckdaten, Bild aus eigenem Projekt
8b. **Heizung und Elektrik aus einer Hand** (`AusEinerHand`, WP-04) – Textvorschlag, **Freigabe Jemmy offen**
9. Warum Ihre Nachbarn ED Elektro wählen (`Comparison`)
10. Preis und Leistungsumfang (`PriceTransparency`)
11. **Bewertungen** – Google-Note + Link; Liste echter Bewertungen startet leer
12. FAQ (mit FAQ-Markup, inkl. Elektrik-Frage WP-05) · Einzugsgebiet · Querverweis Klimaanlage · Abschluss-CTA · Sticky-Button mobil

Jedes neue Modul endet mit „Preis und Förderung prüfen“ → `/waermepumpe/preis` (Google-Ads-Parameter werden mitgenommen).

## Cookie-Banner & Google Consent Mode v2

`cookie-consent.html` liegt in Framer unter Site Settings › Custom Code › **Start of `<head>`** und gilt damit für alle Seiten. Es läuft vor dem bestehenden GTM-Snippet (`GTM-5ZV5KQLS`, Ende von `<head>`).

- Standard: `analytics_storage`, `ad_storage`, `ad_user_data` und `ad_personalization` stehen auf `denied`. Dazu kommen `ads_data_redaction` und `url_passthrough`, damit die gclid ohne Cookies erhalten bleibt.
- Der Banner hat drei Buttons: „Alle akzeptieren“, „Nur notwendige“ und „Einstellungen“ mit den Kategorien Statistik (GA4) und Marketing (Google Ads). Die Auswahl liegt in `localStorage` unter `ed_consent_v1`. Beim nächsten Besuch wird sie vor dem Laden von GTM wieder gesetzt.
- dataLayer-Events: `cookie_consent_update` bei einer neuen Wahl und `cookie_consent_restore` beim Wiederbesuch, jeweils mit `consent_statistik` und `consent_marketing`.
- Wieder öffnen: Footer-Link „Cookie-Einstellungen“ (`/datenschutz#cookie-einstellungen`, Scroll-Target am Embed der Datenschutzseite) oder `window.edCookieSettings()`.
- **In GTM prüfen:** GA4- und Google-Ads-Tags respektieren Consent Mode automatisch. Tags anderer Anbieter (z. B. Meta Pixel oder Hotjar) brauchen unter „Einwilligungseinstellungen“ die zusätzliche Einwilligung `ad_storage` oder `analytics_storage`, oder sie werden über das Event `cookie_consent_update` ausgelöst.

## Vor dem Livegang prüfen

- **WP-03:** `/waermepumpe` und `/waermepumpe/preis` sind Entwürfe (Draft) und werden deshalb nicht veröffentlicht. In der Framer-Vorschau führen die Hero-Buttons (`/waermepumpe/preis?bauart=…`) ins Leere. Zum Launch bei beiden Seiten „Draft“ ausschalten, veröffentlichen und auf der Live-URL mobil und am Desktop bis zum Versand durchklicken.
- **WP-02:** Logos (Meisterbetrieb, Elektrokonzession) fehlen noch. Danach 1–2 Symbole in Vertrauensleiste/Qualifikationen ersetzen.
- **WP-04:** Text „Aus einer Hand“ von Jemmy freigeben lassen. Danach Callouts in Google Ads ergänzen (WP-07).
- **WP-06:** Referenz-Kurzstory erst nach Kundenfreigabe.

- Vergleichswerte (Heizkosten, CO₂) und Förderangaben (Stand 21.07.2026) freigeben
- Qualifikationen: Bezeichnungen der Konzessionen/Abschlüsse bestätigen
- Bewertungen: echte Google-Bewertungen eintragen, Link auf das Google-Profil setzen
- Produktdaten MHG (Modellbezeichnung, ggf. Produktfoto)
- Funnels senden über das Framer-Formular von `/kontakt` (Eigenschaft „Framer-Formular“) an dasselbe Ziel wie das Kontaktformular. Nach dem Publish einmal testweise absenden. „Webhook (optional)“ schickt zusätzlich an ein CRM.
- Navigation/Footer um Klimaanlage & Wärmepumpe ergänzen; Querverweis auf der Klima-Seite zeigt noch auf `/dienstleistungen/wärmepumpen`
