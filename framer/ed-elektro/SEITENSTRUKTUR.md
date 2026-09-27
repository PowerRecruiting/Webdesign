# ED Elektro – Seitenstruktur (Umbau 27.09.2026)

Ziel: Interessenten kommen von der Startseite direkt auf die beiden Kernthemen **Klimaanlage** und **Wärmepumpe**.

## Seitenbaum

```
/                         Startseite – Themenweiche im Hero
├── /klimaanlage          Oberseite Klima (+ Modul Großanlagen, Querverweis → Wärmepumpe)
│   └── /klimaanlage/preis    KlimaFunnel
├── /waermepumpe          Oberseite Wärmepumpe (Förderung, Planungstermin, Querverweis → Klima)
│   ├── /waermepumpe/preis    WaermepumpenFunnel
│   └── /waermepumpe/termin   WaermepumpenFunnel, Start mit Terminanfrage
├── /dienstleistungen     weitere Leistungen (CMS)
├── /b2b-bereich · /ueber-uns · /kontakt
```

Die fünf Themenseiten sind noch **Entwürfe**. Framer hat interne Seitenlinks beim Umbenennen automatisch nachgezogen; Link-Eigenschaften der Code-Komponenten wurden von Hand umgestellt.

## Umgesetzt

| Bereich | Änderung |
|---|---|
| Navigation (Header-Komponente) | Klimaanlage · Wärmepumpe · Leistungen · B2B-Bereich · Über uns · Kontakt – in allen Varianten; Tablet mit kleinerem Abstand |
| Startseite – Hero | `ThemenWeiche.tsx` rechts im Hero (anstelle des ausgeblendeten, nicht angebundenen Anfrageformulars); je Kachel „Mehr erfahren“ (Oberseite) und „Preis berechnen“ (Rechner). Tablet/Handy: untereinander |
| Startseite – Reihenfolge | FAQ von vor den Leistungen nach hinten (vor Blog) |
| Footer | „Klimaanlage und Wärmepumpe“ → zwei Links auf die Oberseiten |
| Klima-Seite | `Grossanlagen.tsx` nach „Leistungen“ (ohne Fachbegriff VRF), `Querverweis.tsx` → Wärmepumpe nach „Preis und Transparenz“ |
| Wärmepumpen-Seite | `Querverweis.tsx` → Klimaanlage nach „Leistungen“; falsche Links aus der Klima-Vorlage (Schritt 01, Leistungskacheln, Preisanker) auf `/waermepumpe/preis` korrigiert |

## Beim Livegang

1. Entwurfsstatus der fünf Themenseiten aufheben.
2. Weiterleitungen (301) anlegen, damit alte CMS-Detailseiten nicht mit den Oberseiten konkurrieren:
   - `/dienstleistungen/klimaanlagen-installation` → `/klimaanlage`
   - `/dienstleistungen/wärmepumpen` → `/waermepumpe`
   (Erst dann, sonst zeigen die Weiterleitungen auf unveröffentlichte Seiten.)
3. Google-Ads-Ziel-URLs auf `/klimaanlage` bzw. `/…/preis` setzen.

## Offene Punkte

- Klima-Einstiegspreis: Die Klima-Seite nennt „ab 2.600 € netto“, der KlimaFunnel und das Meeting vom 23.09. 2.800 € netto. In der Themenweiche steht 2.800 € netto = 3.332 € brutto.
- Großanlagen: Richtwert „≈ 3.000 € je Innengerät netto ab ca. 8 Innengeräten“ stammt aus dem Meeting vom 23.09. – freigeben lassen. CTA führt auf `/kontakt`.
- Footer-Social-Links zeigen noch auf Platzhalter (facebook.com/facebook usw.).
