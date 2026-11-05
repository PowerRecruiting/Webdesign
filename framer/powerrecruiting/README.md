# PowerRecruiting – Framer-Website

Framer-Projekt: „Incomparable Answers“ (https://framer.com/projects/Incomparable-Answers--1U91dLcPIRRqF4C62i2B-7CHRr).
Dieser Ordner sichert die Code-Komponenten, die im Framer-Projekt liegen. Bearbeitet wird in Framer.

## Seiten

| Pfad | Inhalt |
|---|---|
| `/` | Landingpage Projektgewinnung Handwerk (Hero, Weiche, Trust, 4 Pains, Selbsttest, KVTA-System, Anzeigen-Galerie, Ergebnisse, Ablauf, Block Projektentwickler, Über mich, FAQ, Abschluss-CTA, Recruiting-Hinweis) |
| `/projektentwickler` | B2B-Seite (Sie-Ansprache), Vergütungsprinzip, Hinweis „keine Anlageberatung“ |
| `/recruiting` | Kurzseite mit Kontaktformular |
| `/projekt-check` | Funnel. Vorauswahl über `#handwerk` / `#projektentwickler` (Framer-Links) oder `?pfad=handwerk|projektentwickler` |
| `/impressum`, `/datenschutz`, `/agb` | Platzhalter, `noindex` |

## Code-Komponenten

| Datei | Zweck |
|---|---|
| `ProjektCheck.tsx` | Funnel inkl. Wirtschaftlichkeitsrechnung, Webhook, Calendly |
| `SelbstTest.tsx` | Interaktiver Selbsttest „Wie gewinnst du gerade deine Projekte?“ |
| `PainVisual.tsx` | SVG-Visualisierungen der 4 Pains |
| `ProductMockup.tsx` | Mockups: Terminkalender, Projekt-Detail, Dashboard, Anzeige |
| `AnzeigenGalerie.tsx` | Smartphone-Karussell (Reels/Storys), Inhalte über Property Controls |
| `KontaktFormular.tsx` | Kontaktformular Recruiting (Webhook) |
| `CookieHinweis.tsx` | Cookie-Hinweis (speichert Wahl in localStorage, Event `cookie-consent`) |

## Vor dem Livegang ausfüllen

- `ProjektCheck.tsx`: `PREIS_PRO_TERMIN` (PV, Wärmepumpe, Elektro, SHK), `WERBEBUDGET_AB`, `WEBHOOK_URL`, `CALENDLY_URL`
- `KontaktFormular.tsx`: `WEBHOOK_URL`
- FAQ-Antworten: Preise, Tage bis Kampagnenstart, Mindestlaufzeit/-menge
- Alle `[Platzhalter]` auf der Seite: Kennzahlen, Logos, Kundennamen, Fotos, Case-Karten, Team, Adresse, Telefon, E-Mail
- Methodenname „KVTA“ ist Arbeitstitel
- Akzentfarbe: Farbstil „Akzent (CI)“ in Framer (die Code-Komponenten haben eine eigene Farb-Property)
- Impressum, Datenschutz, AGB rechtlich prüfen lassen
