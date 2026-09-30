import { addPropertyControls, ControlType } from "framer"
import { useId } from "react"
import type { CSSProperties, ReactNode } from "react"
import { balancedText, breakpoints, fontFamily, styleHtml, tokens } from "https://framer.com/m/tokens-x6g0t9.js@tWKhZJ2SyC5SsFax1CzI"
import { trackCta, withQuery } from "https://framer.com/m/tracking-JmBWDZ.js@lcHsNL6PUwr6EaepsGIe"

/* Standardinhalte der Listen (auch als defaultValue der Eigenschaften) */
const D_QUALIFIKATIONEN_ITEMS = [
            { titel: "Meisterbetrieb", text: "Elektrotechnik" },
            { titel: "Elektrokonzession", text: "beim Netzbetreiber eingetragen" },
            { titel: "Kälte- & Klimakonzession", text: "zertifizierter Fachbetrieb" },
            { titel: "Techniker & Bachelor", text: "Planung auf Ingenieursniveau" },
            { titel: "4,6 ★ Google", text: "Bewertungen unserer Kunden" },
        ]
const D_FOERDERUNGKURZ_SERVICE = [
            { text: "Wir prüfen, welche Förderung Ihnen zusteht" },
            { text: "Wir stellen den Antrag – rechtzeitig vor Baubeginn" },
            { text: "Sie geben nur noch Ihre Daten ein" },
            { text: "Nach der Montage erhalten Sie alle Nachweise für die Auszahlung" },
        ]
const D_SCHRITTEBILDER_STEPS = [
            { titel: "Preis und Heizlast in 2 Minuten", text: "Sie beantworten ein paar Fragen zu Haus und Heizung und sehen sofort, welche Wärmepumpe passt und was sie kostet – ohne Kontaktdaten.", bild: { src: "https://framerusercontent.com/images/rD9ZyCZ6YVDZfoaQV6gTeNGdQ.jpg", alt: "Monteur von ED Elektro im Gespräch" } },
            { titel: "Planung und Montage vom Meister", text: "Der Meister prüft vor Ort Heizlast, Heizkörper, Aufstellort und Stromanschluss. Danach erhalten Sie einen Festpreis. Montiert wird von unseren eigenen Monteuren.", bild: { src: "https://framerusercontent.com/images/mOu31CdRZWiA3c0AL5WnXW8tWU.jpg", alt: "Monteure tragen ein Außengerät" } },
            { titel: "Günstig heizen – mit Zuschuss", text: "Wir nehmen die Anlage in Betrieb, weisen Sie ein und kümmern uns um den Förderantrag. Auch danach bleiben wir Ihr Ansprechpartner.", bild: { src: "https://framerusercontent.com/images/hkD6S8G6v8q61lK4oSUaokEG1s.jpg", alt: "Installierte Wärmepumpe mit Speicher im Heizungsraum" } },
        ]
const D_VORTEILE_ITEMS = [
            { label: "Bis zu 80 % Zuschuss", titel: "Staatliche Förderung", text: "Der Staat übernimmt einen großen Teil der Kosten – den Antrag stellen wir für Sie." },
            { label: "Aus 1 kWh Strom werden 3–4 kWh Wärme", titel: "Niedrige Heizkosten", text: "Die Wärmepumpe holt den Großteil der Energie kostenlos aus der Außenluft." },
            { label: "Kein Öl, kein Gas", titel: "Unabhängig heizen", text: "Keine Brennstofflieferung, kein Tank und kein steigender CO₂-Preis auf Ihre Heizung." },
            { label: "Oft ohne Heizkörpertausch", titel: "Auch im Altbau", text: "Mit der richtigen Auslegung funktioniert die Wärmepumpe in vielen Bestandshäusern – das prüfen wir vor Ort." },
            { label: "Heizung und Warmwasser", titel: "Alles aus einem Gerät", text: "Mit Trinkwasserspeicher liefert die Wärmepumpe auch Ihr Warmwasser." },
            { label: "Ein Ansprechpartner", titel: "Wartung vom selben Team", text: "Wir montieren, warten und sind bei Fragen schnell da – aus Wörrstadt, nicht aus dem Callcenter." },
        ]
const D_HEIZUNGSVERGLEICH_KRITERIEN = [
            { titel: "Heizkosten pro Jahr", einheit: "€", wp: 1600, gas: 2650, oel: 2350, besser: "niedrig" },
            { titel: "CO₂-Ausstoß pro Jahr", einheit: "t", wp: 2.2, gas: 4.5, oel: 5.9, besser: "niedrig" },
            { titel: "Mögliche Förderung", einheit: "%", wp: 80, gas: 0, oel: 0, besser: "hoch" },
        ]
const D_PRODUKTMHG_KENNZAHLEN = [
            { wert: "6–18 kW", label: "Leistungsklassen" },
            { wert: "bis 80 %", label: "Förderung" },
            { wert: "1", label: "Ansprechpartner" },
        ]
const D_PRODUKTMHG_DATEN = [
            { label: "Hersteller", wert: "MHG Heiztechnik" },
            { label: "Bauart", wert: "Luft-Wasser-Wärmepumpe" },
            { label: "Leistungsklassen", wert: "6 · 8 · 12 · 18 kW" },
            { label: "Warmwasser", wert: "optional mit Trinkwasserspeicher" },
            { label: "Heizflächen", wert: "Fußbodenheizung und Heizkörper" },
            { label: "Einbau & Wartung", wert: "ED Elektro Meisterbetrieb" },
            { label: "Förderantrag", wert: "übernehmen wir" },
        ]

/**
 * Module der Wärmepumpen-Seite nach dem Vorbild der Referenzseite.
 * Eine Datei, mehrere benannte Komponenten – alle mit identischem
 * Abschnitts-Rahmen und demselben Button „Preis und Förderung prüfen“.
 *
 *   Qualifikationen   Leiste mit Abschlüssen/Konzessionen (statt Siegeln)
 *   FoerderungKurz    Förderung knapp erklärt, Full-Service im Vordergrund
 *   SchritteBilder    „In 3 Schritten …“ mit Bildern, abwechselnd
 *   Vorteile          6 nummerierte Gründe
 *   HeizungsVergleich Wärmepumpe vs. Gas/Öl (Beispielwerte, editierbar)
 *   ProduktMHG        Produktmodul mit Eckdaten
 *   Bewertungen       Google-Bewertung + echte Kundenstimmen (Liste startet leer)
 */

const FUNNEL = "/waermepumpe/preis"

/* ------------------------------------------------------------ Rahmen */

function useScope(prefix: string) {
    const id = useId()
    return { headingId: id, scope: `${prefix}-${id.replace(/[^a-zA-Z0-9-]/g, "")}` }
}

const baseCss = (s: string, bg: string) => `
.${s} { width: 100%; background: ${bg}; font-family: ${fontFamily.body}; color: ${tokens.color.textMuted}; }
.${s} *, .${s} *::before, .${s} *::after { box-sizing: border-box; }
.${s} h2, .${s} h3, .${s} p, .${s} li, .${s} span { overflow-wrap: break-word; }
.${s}__inner { width: 100%; max-width: ${tokens.maxWidth}px; margin: 0 auto; padding: ${tokens.space[7]}px ${tokens.space[4]}px; }
.${s}__head { display: flex; flex-direction: column; align-items: flex-start; text-align: left; margin: 0 0 ${tokens.space[6]}px; max-width: 760px; }
.${s}__pill { display: inline-flex; padding: 5px 12px; border-radius: 999px; background: #EAF0FC; color: ${tokens.color.primary}; font-size: .8125rem; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; }
.${s}__h2 { margin: ${tokens.space[3]}px 0 0; font-family: ${fontFamily.heading}; font-size: ${tokens.font.h2}; font-weight: 700; line-height: 1.15; letter-spacing: -0.015em; color: ${tokens.color.text}; }
.${s}__intro { margin: ${tokens.space[3]}px 0 0; font-size: ${tokens.font.body}; line-height: 1.55; }
.${s}__ctaWrap { display: flex; flex-direction: column; align-items: stretch; gap: 8px; margin-top: ${tokens.space[6]}px; }
.${s}__cta { display: inline-flex; align-items: center; justify-content: center; gap: 8px; min-height: 54px; padding: 14px 24px; text-align: center; line-height: 1.25; border-radius: ${tokens.radius.md}px;
  background: ${tokens.color.primary}; color: #fff; font-family: ${fontFamily.heading}; font-size: 1.0625rem; font-weight: 600; text-decoration: none; }
.${s}__cta:hover { background: ${tokens.color.primaryDark}; }
.${s}__ctaNote { font-size: .875rem; line-height: 1.45; color: #64748B; text-align: center; }
@media (min-width: ${breakpoints.tablet}px) {
  .${s}__inner { padding: ${tokens.space[9]}px ${tokens.space[6]}px; }
  .${s}__head { margin-bottom: ${tokens.space[7]}px; }
  .${s}__ctaWrap { flex-direction: row; align-items: center; gap: 16px; margin-top: ${tokens.space[7]}px; }
  .${s}__ctaNote { text-align: left; }
}
`

function Head({ s, id, pill, heading, intro }: { s: string; id: string; pill?: string; heading: string; intro?: string }) {
    return (
        <div className={`${s}__head`}>
            {pill && <span className={`${s}__pill`}>{pill}</span>}
            <h2 id={id} className={`${s}__h2`} style={balancedText}>{heading}</h2>
            {intro && <p className={`${s}__intro`} style={balancedText}>{intro}</p>}
        </div>
    )
}

function Cta({ s, label, note, modul, link = FUNNEL }: { s: string; label: string; note: string; modul: string; link?: string }) {
    return (
        <div className={`${s}__ctaWrap`}>
            <a className={`${s}__cta`} href={link}
                onClick={(e) => {
                    trackCta(modul as any)
                    const url = withQuery(link)
                    if (typeof window !== "undefined" && url !== link) { e.preventDefault(); window.location.href = url }
                }}>
                {label} <Arrow />
            </a>
            {note && <span className={`${s}__ctaNote`}>{note}</span>}
        </div>
    )
}

const CTA_DEFAULT = "Preis und Förderung prüfen"
const NOTE_DEFAULT = "Kostenlos und unverbindlich · in 2 Minuten · ohne Kontaktdaten"

const ctaControls = {
    ctaLabel: { type: ControlType.String, title: "Button", defaultValue: CTA_DEFAULT },
    ctaNote: { type: ControlType.String, title: "Button-Hinweis", defaultValue: NOTE_DEFAULT },
    showCta: { type: ControlType.Boolean, title: "Button zeigen", defaultValue: true },
}

interface Base { heading: string; intro: string; ctaLabel: string; ctaNote: string; showCta: boolean; style?: CSSProperties }

/* ------------------------------------------------ 1. Qualifikationen */

/**
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight auto
 */
export function Qualifikationen(props: { titel: string; items: { titel: string; text: string }[]; style?: CSSProperties }) {
    const {
        titel = "Qualifikation statt Vertriebsversprechen",
        items: itemsIn = D_QUALIFIKATIONEN_ITEMS,
        style,
    } = props
    const items = Array.isArray(itemsIn) && itemsIn.length ? itemsIn : D_QUALIFIKATIONEN_ITEMS
    const { scope: s } = useScope("ed-qual")
    const css = baseCss(s, "#fff") + `
.${s}__inner { padding-top: ${tokens.space[6]}px; padding-bottom: ${tokens.space[6]}px; }
.${s}__t { margin: 0 0 ${tokens.space[3]}px; text-align: left; font-size: .8125rem; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; color: #64748B; }
.${s}__row { display: grid; grid-template-columns: minmax(0,1fr); gap: 6px; margin: 0; padding: 0; list-style: none; }
.${s}__b { display: flex; align-items: center; gap: 12px; padding: 8px 12px; min-width: 0; border: 1px solid ${tokens.color.line}; border-radius: ${tokens.radius.sm + 4}px; }
.${s}__seal { width: 30px; height: 30px; flex: 0 0 30px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center;
  border: 2px solid ${tokens.color.primary}; color: ${tokens.color.primary}; }
.${s}__bt { display: block; font-family: ${fontFamily.heading}; font-size: .875rem; font-weight: 700; color: ${tokens.color.text}; line-height: 1.2; }
.${s}__bx { display: block; font-size: .8125rem; color: #64748B; line-height: 1.3; margin-top: 2px; }
@media (min-width: ${breakpoints.tablet}px) { .${s}__row { grid-template-columns: repeat(3, minmax(0,1fr)); gap: ${tokens.space[3]}px; } .${s}__bt { font-size: .9375rem; } .${s}__seal { width: 40px; height: 40px; flex-basis: 40px; } }
@media (min-width: ${breakpoints.desktop}px) { .${s}__row { grid-template-columns: repeat(${Math.max(items.length, 1)}, minmax(0,1fr)); } }
`
    return (
        <section lang="de" className={s} style={style} aria-label={titel}>
            <style dangerouslySetInnerHTML={styleHtml(css)} />
            <div className={`${s}__inner`}>
                <p className={`${s}__t`}>{titel}</p>
                <ul className={`${s}__row`}>
                    {items.map((q, i) => (
                        <li key={i} className={`${s}__b`}>
                            <span className={`${s}__seal`}><Seal /></span>
                            <span><span className={`${s}__bt`}>{q.titel}</span><span className={`${s}__bx`}>{q.text}</span></span>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    )
}
addPropertyControls(Qualifikationen, {
    titel: { type: ControlType.String, title: "Titel", defaultValue: "Qualifikation statt Vertriebsversprechen" },
    items: {
        type: ControlType.Array, defaultValue: D_QUALIFIKATIONEN_ITEMS, title: "Nachweise",
        control: { type: ControlType.Object, controls: { titel: { type: ControlType.String, title: "Titel" }, text: { type: ControlType.String, title: "Text" } } },
    },
})

/* ------------------------------------------------ 2. Förderung kurz */

/**
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight auto
 */
export function FoerderungKurz(props: Base & { pill: string; service: { text: string }[]; hinweis: string; fussnote: string }) {
    const {
        pill = "Förderung",
        heading = "Bis zu 80 % Zuschuss – den Antrag übernehmen wir",
        intro = "Der Staat bezuschusst den Umstieg auf eine Wärmepumpe. Wie viel Sie bekommen, hängt vor allem davon ab, ob Sie selbst im Haus wohnen, welche Heizung Sie ersetzen und wie hoch Ihr Haushaltseinkommen ist. Zusammen sind bis zu 80 % möglich, höchstens 22.400 €. Welche Boni Ihnen zustehen, klären wir im Planungstermin.",
        service: serviceIn = D_FOERDERUNGKURZ_SERVICE,
        hinweis = "Wichtig: Der Antrag muss gestellt sein, bevor die Arbeiten beginnen.",
        fussnote = "KfW-Heizungsförderung, Stand 21.07.2026. Höchstens 80 %, gerechnet auf max. 28.000 € förderfähige Kosten.",
        ctaLabel = CTA_DEFAULT, ctaNote = NOTE_DEFAULT, showCta = true, style,
    } = props
    const service = Array.isArray(serviceIn) && serviceIn.length ? serviceIn : D_FOERDERUNGKURZ_SERVICE
    const { headingId, scope: s } = useScope("ed-foek")
    const css = baseCss(s, tokens.color.surfaceAlt) + `
.${s}__grid { display: grid; grid-template-columns: minmax(0,1fr); gap: ${tokens.space[6]}px; align-items: center; }
.${s}__grid .${s}__head { align-items: flex-start; text-align: left; margin: 0; }
.${s}__hint { margin: ${tokens.space[4]}px 0 0; display: flex; gap: 10px; align-items: flex-start; padding: 12px 14px; border-radius: ${tokens.radius.sm}px; background: #FEF3C7; color: #78350F; font-size: .9375rem; line-height: 1.45; }
.${s}__card { padding: ${tokens.space[5]}px; border-radius: ${tokens.radius.lg}px; background: ${tokens.color.navy}; color: ${tokens.color.textMutedOnDark}; }
.${s}__ct { margin: 0; font-family: ${fontFamily.heading}; font-size: ${tokens.font.h3}; font-weight: 700; color: #fff; }
.${s}__list { margin: ${tokens.space[5]}px 0 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 14px; }
.${s}__list li { display: flex; gap: 10px; align-items: flex-start; font-size: 1rem; line-height: 1.45; color: #fff; }
.${s}__list svg { flex: 0 0 auto; margin-top: 2px; color: #7FA8F0; }
.${s}__foot { margin: ${tokens.space[5]}px 0 0; font-size: .8125rem; line-height: 1.5; color: #A7B4C8; }
@media (min-width: ${breakpoints.desktop}px) { .${s}__grid { grid-template-columns: minmax(0,1.1fr) minmax(0,1fr); gap: ${tokens.space[8]}px; } }
`
    return (
        <section lang="de" aria-labelledby={headingId} className={s} style={style}>
            <style dangerouslySetInnerHTML={styleHtml(css)} />
            <div className={`${s}__inner`}>
                <div className={`${s}__grid`}>
                    <div>
                        <Head s={s} id={headingId} pill={pill} heading={heading} intro={intro} />
                        <p className={`${s}__hint`}><Info /> <span>{hinweis}</span></p>
                    </div>
                    <div className={`${s}__card`}>
                        <h3 className={`${s}__ct`}>Das übernehmen wir für Sie</h3>
                        <ul className={`${s}__list`}>
                            {service.map((x, i) => <li key={i}><Check /> <span>{x.text}</span></li>)}
                        </ul>
                        <p className={`${s}__foot`}>{fussnote}</p>
                    </div>
                </div>
                {showCta && <Cta s={s} label={ctaLabel} note={ctaNote} modul="foerderung" />}
            </div>
        </section>
    )
}
addPropertyControls(FoerderungKurz, {
    pill: { type: ControlType.String, title: "Label", defaultValue: "Förderung" },
    heading: { type: ControlType.String, title: "H2", displayTextArea: true, defaultValue: "Bis zu 80 % Zuschuss – den Antrag übernehmen wir" },
    intro: { type: ControlType.String, title: "Text", displayTextArea: true, defaultValue: "Der Staat bezuschusst den Umstieg auf eine Wärmepumpe. Wie viel Sie bekommen, hängt vor allem davon ab, ob Sie selbst im Haus wohnen, welche Heizung Sie ersetzen und wie hoch Ihr Haushaltseinkommen ist. Zusammen sind bis zu 80 % möglich, höchstens 22.400 €. Welche Boni Ihnen zustehen, klären wir im Planungstermin." },
    service: { type: ControlType.Array, defaultValue: D_FOERDERUNGKURZ_SERVICE, title: "Full-Service", control: { type: ControlType.Object, controls: { text: { type: ControlType.String, title: "Text" } } } },
    hinweis: { type: ControlType.String, title: "Hinweis", defaultValue: "Wichtig: Der Antrag muss gestellt sein, bevor die Arbeiten beginnen." },
    fussnote: { type: ControlType.String, title: "Fußnote", displayTextArea: true, defaultValue: "KfW-Heizungsförderung, Stand 21.07.2026. Höchstens 80 %, gerechnet auf max. 28.000 € förderfähige Kosten." },
    ...ctaControls,
})

/* ------------------------------------------------ 3. Schritte mit Bildern */

type Img = { src: string; srcSet?: string; alt?: string }
/**
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight auto
 */
export function SchritteBilder(props: Base & { pill: string; steps: { titel: string; text: string; bild: Img }[] }) {
    const {
        pill = "In 3 Schritten",
        heading = "In 3 Schritten zur neuen Heizung",
        intro = "",
        steps: stepsIn = D_SCHRITTEBILDER_STEPS,
        ctaLabel = CTA_DEFAULT, ctaNote = NOTE_DEFAULT, showCta = true, style,
    } = props
    const steps = Array.isArray(stepsIn) && stepsIn.length ? stepsIn : D_SCHRITTEBILDER_STEPS
    const { headingId, scope: s } = useScope("ed-sch")
    // Bilder aus Array-Eigenschaften gehen in Framer beim Speichern teils verloren –
    // dann greift das vorgesehene Standardbild des jeweiligen Schritts.
    const bildVon = (st: { bild?: Img }, i: number): Img | undefined =>
        st.bild?.src ? st.bild : D_SCHRITTEBILDER_STEPS[i]?.bild
    const css = baseCss(s, "#fff") + `
.${s}__list { position: relative; display: grid; grid-template-columns: minmax(0,1fr); gap: 0; margin: 0; padding: 0; list-style: none; }
.${s}__step { position: relative; display: grid; grid-template-columns: 40px minmax(0,1fr); gap: 0 ${tokens.space[4]}px; padding-bottom: ${tokens.space[6]}px; }
.${s}__step:last-child { padding-bottom: 0; }
/* Zeitleiste (Handy/Tablet): Linie zwischen den Nummern */
.${s}__step:not(:last-child)::before { content: ""; position: absolute; left: 19px; top: 44px; bottom: 4px; width: 2px; background: repeating-linear-gradient(${tokens.color.primary} 0 6px, transparent 6px 12px); opacity: .35; }
.${s}__num { grid-row: span 3; width: 40px; height: 40px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center;
  background: ${tokens.color.primary}; color: #fff; font-family: ${fontFamily.heading}; font-size: 1.0625rem; font-weight: 800; box-shadow: 0 0 0 5px #EAF0FC; }
.${s}__lab { display: block; margin-top: 9px; font-size: .8125rem; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; color: ${tokens.color.primary}; }
.${s}__t { margin: 4px 0 0; font-family: ${fontFamily.heading}; font-size: 1.1875rem; font-weight: 700; line-height: 1.3; color: ${tokens.color.text}; }
.${s}__x { margin: 6px 0 0; font-size: .9875rem; line-height: 1.55; }
.${s}__body { display: contents; }
.${s}__media { grid-column: 2; margin-top: ${tokens.space[4]}px; }
.${s}__img { display: block; width: 100%; aspect-ratio: 16 / 9; object-fit: cover; border-radius: ${tokens.radius.md}px; }

/* Desktop: drei gleich hohe Karten nebeneinander, Bild oben, Nummer auf der Bildkante */
@media (min-width: 900px) {
  .${s}__list { grid-template-columns: repeat(${Math.max(steps.length, 1)}, minmax(0,1fr)); gap: ${tokens.space[5]}px; }
  .${s}__step { display: flex; flex-direction: column; padding: 0; border: 1px solid ${tokens.color.line}; border-radius: ${tokens.radius.lg}px;
    background: #fff; overflow: hidden; box-shadow: 0 18px 40px -30px rgba(15,23,42,.5); }
  .${s}__step:not(:last-child)::before { display: none; }
  .${s}__media { order: -1; margin: 0; }
  .${s}__img { aspect-ratio: 4 / 3; border-radius: 0; }
  .${s}__body { display: block; position: relative; padding: 34px ${tokens.space[5]}px ${tokens.space[5]}px; }
  .${s}__num { position: absolute; top: -24px; left: ${tokens.space[5]}px; width: 48px; height: 48px; font-size: 1.25rem; box-shadow: 0 0 0 5px #fff; }
  .${s}__lab { margin-top: 0; }
  .${s}__t { font-size: 1.25rem; }
}
`
    return (
        <section lang="de" aria-labelledby={headingId} className={s} style={style}>
            <style dangerouslySetInnerHTML={styleHtml(css)} />
            <div className={`${s}__inner`}>
                <Head s={s} id={headingId} pill={pill} heading={heading} intro={intro} />
                <ol className={`${s}__list`}>
                    {steps.map((st, i) => {
                        const bild = bildVon(st, i)
                        return (
                            <li key={i} className={`${s}__step`}>
                                <div className={`${s}__body`}>
                                    <span className={`${s}__num`} aria-hidden="true">{i + 1}</span>
                                    <span className={`${s}__lab`}>Schritt {i + 1}</span>
                                    <h3 className={`${s}__t`}>{st.titel}</h3>
                                    <p className={`${s}__x`}>{st.text}</p>
                                </div>
                                {bild?.src && (
                                    <div className={`${s}__media`}>
                                        <img className={`${s}__img`} src={bild.src} srcSet={bild.srcSet} alt={bild.alt ?? ""} loading="lazy" />
                                    </div>
                                )}
                            </li>
                        )
                    })}
                </ol>
                {showCta && <Cta s={s} label={ctaLabel} note={ctaNote} modul="schritte" />}
            </div>
        </section>
    )
}
addPropertyControls(SchritteBilder, {
    pill: { type: ControlType.String, title: "Label", defaultValue: "In 3 Schritten" },
    heading: { type: ControlType.String, title: "H2", defaultValue: "In 3 Schritten zur neuen Heizung" },
    intro: { type: ControlType.String, title: "Einleitung", defaultValue: "" },
    steps: {
        type: ControlType.Array, defaultValue: D_SCHRITTEBILDER_STEPS, title: "Schritte", maxCount: 4,
        control: { type: ControlType.Object, controls: { titel: { type: ControlType.String, title: "Titel" }, text: { type: ControlType.String, title: "Text", displayTextArea: true }, bild: { type: ControlType.ResponsiveImage, title: "Bild" } } },
    },
    ...ctaControls,
})

/* ------------------------------------------------ 4. Vorteile */

/**
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight auto
 */
export function Vorteile(props: Base & { pill: string; items: { label: string; titel: string; text: string }[] }) {
    const {
        pill = "Vorteile",
        heading = "Darum setzen Hausbesitzer auf die Wärmepumpe",
        intro = "",
        items: itemsIn = D_VORTEILE_ITEMS,
        ctaLabel = CTA_DEFAULT, ctaNote = NOTE_DEFAULT, showCta = true, style,
    } = props
    const items = Array.isArray(itemsIn) && itemsIn.length ? itemsIn : D_VORTEILE_ITEMS
    const { headingId, scope: s } = useScope("ed-vort")
    const css = baseCss(s, tokens.color.surfaceAlt) + `
.${s}__grid { display: grid; grid-template-columns: minmax(0,1fr); gap: ${tokens.space[4]}px ${tokens.space[6]}px; margin: 0; padding: 0; list-style: none; }
.${s}__item { display: grid; grid-template-columns: 34px minmax(0,1fr); gap: 12px; padding: ${tokens.space[4]}px; border-radius: ${tokens.radius.md}px; background: #fff; border: 1px solid ${tokens.color.line}; }
.${s}__n { font-family: ${fontFamily.heading}; font-size: 1.5rem; font-weight: 800; line-height: 1.1; color: #9DBDF6; font-variant-numeric: tabular-nums; }
.${s}__l { display: block; font-size: .8125rem; font-weight: 700; letter-spacing: .05em; text-transform: uppercase; color: ${tokens.color.success}; }
.${s}__t { margin: 4px 0 0; font-family: ${fontFamily.heading}; font-size: 1.125rem; font-weight: 700; color: ${tokens.color.text}; }
.${s}__x { margin: 6px 0 0; font-size: .9375rem; line-height: 1.55; }
.${s}__grid { gap: 10px ${tokens.space[6]}px; }
@media (min-width: ${breakpoints.tablet}px) {
  .${s}__grid { grid-template-columns: repeat(2, minmax(0,1fr)); gap: ${tokens.space[4]}px ${tokens.space[6]}px; }
  .${s}__item { grid-template-columns: 64px minmax(0,1fr); gap: ${tokens.space[4]}px; padding: ${tokens.space[5]}px; }
  .${s}__n { font-size: 2.5rem; }
}
`
    return (
        <section lang="de" aria-labelledby={headingId} className={s} style={style}>
            <style dangerouslySetInnerHTML={styleHtml(css)} />
            <div className={`${s}__inner`}>
                <Head s={s} id={headingId} pill={pill} heading={heading} intro={intro} />
                <ul className={`${s}__grid`}>
                    {items.map((v, i) => (
                        <li key={i} className={`${s}__item`}>
                            <span className={`${s}__n`}>{String(i + 1).padStart(2, "0")}</span>
                            <div>
                                <span className={`${s}__l`}>{v.label}</span>
                                <h3 className={`${s}__t`}>{v.titel}</h3>
                                <p className={`${s}__x`}>{v.text}</p>
                            </div>
                        </li>
                    ))}
                </ul>
                {showCta && <Cta s={s} label={ctaLabel} note={ctaNote} modul="vorteile" />}
            </div>
        </section>
    )
}
addPropertyControls(Vorteile, {
    pill: { type: ControlType.String, title: "Label", defaultValue: "Vorteile" },
    heading: { type: ControlType.String, title: "H2", defaultValue: "Darum setzen Hausbesitzer auf die Wärmepumpe" },
    intro: { type: ControlType.String, title: "Einleitung", defaultValue: "" },
    items: {
        type: ControlType.Array, defaultValue: D_VORTEILE_ITEMS, title: "Gründe", maxCount: 8,
        control: { type: ControlType.Object, controls: { label: { type: ControlType.String, title: "Label" }, titel: { type: ControlType.String, title: "Titel" }, text: { type: ControlType.String, title: "Text", displayTextArea: true } } },
    },
    ...ctaControls,
})

/* ------------------------------------------------ 5. Heizungsvergleich */

type Kriterium = { titel: string; einheit: string; wp: number; gas: number; oel: number; besser: "niedrig" | "hoch" }
/**
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight auto
 */
export function HeizungsVergleich(props: Base & { pill: string; kriterien: Kriterium[]; fussnote: string }) {
    const {
        pill = "Vergleich",
        heading = "Wärmepumpe vs. Gas- und Ölheizung",
        intro = "Beispiel: Einfamilienhaus mit 20.000 kWh Wärmebedarf im Jahr.",
        kriterien: kriterienIn = D_HEIZUNGSVERGLEICH_KRITERIEN,
        fussnote = "Beispielwerte, gerundet. Annahmen: Jahresarbeitszahl 3,5, Wärmepumpenstrom 28 ct/kWh, Gas 12 ct/kWh, Heizöl 1,05 €/l, Kesselwirkungsgrad 90 %, CO₂: Strommix 0,38 kg/kWh, Erdgas 0,20 kg/kWh, Heizöl 0,27 kg/kWh. Die tatsächlichen Werte hängen von Haus, Tarif und Nutzung ab.",
        ctaLabel = CTA_DEFAULT, ctaNote = NOTE_DEFAULT, showCta = true, style,
    } = props
    const kriterien = Array.isArray(kriterienIn) && kriterienIn.length ? kriterienIn : D_HEIZUNGSVERGLEICH_KRITERIEN
    const { headingId, scope: s } = useScope("ed-vgl")
    const css = baseCss(s, "#fff") + `
.${s}__grid { display: grid; grid-template-columns: minmax(0,1fr); gap: 12px; }
.${s}__card { padding: ${tokens.space[4]}px ${tokens.space[4]}px ${tokens.space[5]}px; border-radius: ${tokens.radius.md}px; border: 1px solid ${tokens.color.line}; background: #fff; }
.${s}__ct { margin: 0 0 ${tokens.space[2]}px; font-family: ${fontFamily.heading}; font-size: 1.0625rem; font-weight: 700; color: ${tokens.color.text}; }
.${s}__row { margin-top: 12px; }
.${s}__lab { display: flex; justify-content: space-between; font-size: .9375rem; color: ${tokens.color.text}; font-variant-numeric: tabular-nums; }
.${s}__lab b { font-weight: 700; }
.${s}__bar { height: 10px; margin-top: 6px; border-radius: 999px; background: ${tokens.color.surfaceAlt}; overflow: hidden; }
.${s}__bar span { display: block; height: 100%; border-radius: 999px; background: #94A3B8; }
.${s}__row--wp .${s}__bar span { background: ${tokens.color.success}; }
.${s}__row--wp .${s}__lab { color: ${tokens.color.success}; font-weight: 700; }
.${s}__foot { margin: ${tokens.space[4]}px 0 0; max-width: 820px; text-align: left; font-size: .8125rem; line-height: 1.55; color: #64748B; }
@media (min-width: ${breakpoints.tablet}px) { .${s}__grid { grid-template-columns: repeat(3, minmax(0,1fr)); } }
`
    const fmt = (n: number, e: string) => e === "€" ? `${Math.round(n).toLocaleString("de-DE")} €` : e === "%" ? `${n} %` : `${n.toLocaleString("de-DE")} ${e}`
    return (
        <section lang="de" aria-labelledby={headingId} className={s} style={style}>
            <style dangerouslySetInnerHTML={styleHtml(css)} />
            <div className={`${s}__inner`}>
                <Head s={s} id={headingId} pill={pill} heading={heading} intro={intro} />
                <div className={`${s}__grid`}>
                    {kriterien.map((k, i) => {
                        const max = Math.max(k.wp, k.gas, k.oel) || 1
                        const rows = [["Wärmepumpe", k.wp, true], ["Gasheizung", k.gas, false], ["Ölheizung", k.oel, false]] as const
                        return (
                            <div key={i} className={`${s}__card`}>
                                <h3 className={`${s}__ct`}>{k.titel}</h3>
                                {rows.map(([name, v, wp]) => (
                                    <div key={name} className={`${s}__row` + (wp ? ` ${s}__row--wp` : "")}>
                                        <span className={`${s}__lab`}><span>{name}</span><b>{fmt(v, k.einheit)}</b></span>
                                        <div className={`${s}__bar`}><span style={{ width: `${Math.max(2, (v / max) * 100)}%` }} /></div>
                                    </div>
                                ))}
                            </div>
                        )
                    })}
                </div>
                <p className={`${s}__foot`}>{fussnote}</p>
                {showCta && <Cta s={s} label={ctaLabel} note={ctaNote} modul="vergleich" />}
            </div>
        </section>
    )
}
addPropertyControls(HeizungsVergleich, {
    pill: { type: ControlType.String, title: "Label", defaultValue: "Vergleich" },
    heading: { type: ControlType.String, title: "H2", defaultValue: "Wärmepumpe vs. Gas- und Ölheizung" },
    intro: { type: ControlType.String, title: "Einleitung", defaultValue: "Beispiel: Einfamilienhaus mit 20.000 kWh Wärmebedarf im Jahr." },
    kriterien: {
        type: ControlType.Array, defaultValue: D_HEIZUNGSVERGLEICH_KRITERIEN, title: "Kriterien", maxCount: 3,
        control: {
            type: ControlType.Object, controls: {
                titel: { type: ControlType.String, title: "Titel" },
                einheit: { type: ControlType.String, title: "Einheit" },
                wp: { type: ControlType.Number, title: "Wärmepumpe", step: 0.1, displayStepper: false },
                gas: { type: ControlType.Number, title: "Gas", step: 0.1, displayStepper: false },
                oel: { type: ControlType.Number, title: "Öl", step: 0.1, displayStepper: false },
                besser: { type: ControlType.Enum, title: "Besser ist", options: ["niedrig", "hoch"] },
            },
        },
    },
    fussnote: { type: ControlType.String, title: "Annahmen", displayTextArea: true, defaultValue: "Beispielwerte, gerundet. Annahmen: Jahresarbeitszahl 3,5, Wärmepumpenstrom 28 ct/kWh, Gas 12 ct/kWh, Heizöl 1,05 €/l, Kesselwirkungsgrad 90 %, CO₂: Strommix 0,38 kg/kWh, Erdgas 0,20 kg/kWh, Heizöl 0,27 kg/kWh. Die tatsächlichen Werte hängen von Haus, Tarif und Nutzung ab." },
    ...ctaControls,
})

/* ------------------------------------------------ 6. Produkt */

/**
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight auto
 */
export function ProduktMHG(props: Base & { pill: string; bild: Img; kennzahlen: { wert: string; label: string }[]; daten: { label: string; wert: string }[]; hinweis: string }) {
    const {
        pill = "Unsere Wärmepumpe",
        heading = "Luft-Wasser-Wärmepumpe von MHG",
        intro = "Unsere Hausmarke für Ein- und Zweifamilienhäuser – eingebaut und gewartet von unserem eigenen Team.",
        bild = { src: "https://framerusercontent.com/images/hkD6S8G6v8q61lK4oSUaokEG1s.jpg", alt: "Wärmepumpe mit Trinkwasserspeicher im Heizungsraum – Projekt von ED Elektro" },
        kennzahlen: kennzahlenIn = D_PRODUKTMHG_KENNZAHLEN,
        daten: datenIn = D_PRODUKTMHG_DATEN,
        hinweis = "Wir sind an keinen Hersteller gebunden – auf Wunsch planen wir auch mit anderen Marken.",
        ctaLabel = CTA_DEFAULT, ctaNote = NOTE_DEFAULT, showCta = true, style,
    } = props
    const daten = Array.isArray(datenIn) && datenIn.length ? datenIn : D_PRODUKTMHG_DATEN
    const kennzahlen = Array.isArray(kennzahlenIn) && kennzahlenIn.length ? kennzahlenIn : D_PRODUKTMHG_KENNZAHLEN
    const { headingId, scope: s } = useScope("ed-prod")
    const css = baseCss(s, tokens.color.surfaceAlt) + `
.${s}__box { display: grid; grid-template-columns: minmax(0,1fr); gap: ${tokens.space[5]}px; padding: ${tokens.space[4]}px; border-radius: ${tokens.radius.lg}px; background: #fff; border: 1px solid ${tokens.color.line}; }
.${s}__media { position: relative; }
.${s}__img { display: block; width: 100%; height: 100%; min-height: 220px; aspect-ratio: 4 / 3; object-fit: cover; border-radius: ${tokens.radius.md}px; }
.${s}__tag { position: absolute; top: 14px; left: 14px; padding: 5px 12px; border-radius: 999px; background: ${tokens.color.success}; color: #fff; font-size: .8125rem; font-weight: 700; }
.${s}__k { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: ${tokens.space[3]}px; }
.${s}__kz { padding: 12px 6px; border-radius: ${tokens.radius.sm + 2}px; background: ${tokens.color.surfaceAlt}; text-align: center; }
.${s}__kw { display: block; font-family: ${fontFamily.heading}; font-size: 1.0625rem; white-space: nowrap; font-weight: 800; color: ${tokens.color.success}; }
.${s}__kl { display: block; margin-top: 2px; font-size: .8125rem; line-height: 1.25; overflow-wrap: normal; hyphens: auto; -webkit-hyphens: auto; color: #64748B; }
.${s}__dl { margin: ${tokens.space[4]}px 0 0; }
.${s}__dr { display: flex; flex-direction: column; gap: 2px; padding: 10px 0; border-bottom: 1px solid ${tokens.color.line}; font-size: .9375rem; }
.${s}__dr dt { color: #64748B; font-size: .875rem; } .${s}__dr dd { margin: 0; font-weight: 600; color: ${tokens.color.text}; }
.${s}__hin { margin: ${tokens.space[4]}px 0 0; font-size: .875rem; color: #64748B; }
@media (min-width: ${breakpoints.tablet}px) {
  .${s}__box { grid-template-columns: minmax(0,1fr) minmax(0,1fr); padding: ${tokens.space[5]}px; gap: ${tokens.space[6]}px; }
  .${s}__kw { font-size: 1.375rem; }
  .${s}__dr { flex-direction: row; justify-content: space-between; gap: 16px; }
  .${s}__dr dt { font-size: .9375rem; } .${s}__dr dd { text-align: right; }
  .${s}__img { aspect-ratio: auto; }
}
`
    return (
        <section lang="de" aria-labelledby={headingId} className={s} style={style}>
            <style dangerouslySetInnerHTML={styleHtml(css)} />
            <div className={`${s}__inner`}>
                <Head s={s} id={headingId} pill={pill} heading={heading} intro={intro} />
                <div className={`${s}__box`}>
                    <div className={`${s}__media`}>
                        {bild?.src && <img className={`${s}__img`} src={bild.src} srcSet={bild.srcSet} alt={bild.alt ?? ""} loading="lazy" />}
                        <span className={`${s}__tag`}>Aus unseren Projekten</span>
                    </div>
                    <div>
                        <div className={`${s}__k`}>
                            {kennzahlen.map((k, i) => <div key={i} className={`${s}__kz`}><span className={`${s}__kw`}>{k.wert}</span><span className={`${s}__kl`}>{k.label}</span></div>)}
                        </div>
                        <dl className={`${s}__dl`}>
                            {daten.map((d, i) => <div key={i} className={`${s}__dr`}><dt>{d.label}</dt><dd>{d.wert}</dd></div>)}
                        </dl>
                        <p className={`${s}__hin`}>{hinweis}</p>
                    </div>
                </div>
                {showCta && <Cta s={s} label={ctaLabel} note={ctaNote} modul="produkt" />}
            </div>
        </section>
    )
}
addPropertyControls(ProduktMHG, {
    pill: { type: ControlType.String, title: "Label", defaultValue: "Unsere Wärmepumpe" },
    heading: { type: ControlType.String, title: "H2", defaultValue: "Luft-Wasser-Wärmepumpe von MHG" },
    intro: { type: ControlType.String, title: "Einleitung", displayTextArea: true, defaultValue: "Unsere Hausmarke für Ein- und Zweifamilienhäuser – eingebaut und gewartet von unserem eigenen Team." },
    bild: { type: ControlType.ResponsiveImage, title: "Bild" },
    kennzahlen: { type: ControlType.Array, defaultValue: D_PRODUKTMHG_KENNZAHLEN, title: "Kennzahlen", maxCount: 3, control: { type: ControlType.Object, controls: { wert: { type: ControlType.String, title: "Wert" }, label: { type: ControlType.String, title: "Label" } } } },
    daten: { type: ControlType.Array, defaultValue: D_PRODUKTMHG_DATEN, title: "Eckdaten", control: { type: ControlType.Object, controls: { label: { type: ControlType.String, title: "Bezeichnung" }, wert: { type: ControlType.String, title: "Wert" } } } },
    hinweis: { type: ControlType.String, title: "Hinweis", defaultValue: "Wir sind an keinen Hersteller gebunden – auf Wunsch planen wir auch mit anderen Marken." },
    ...ctaControls,
})

/* ------------------------------------------------ 7. Bewertungen */

/**
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight auto
 */
export function Bewertungen(props: Base & { pill: string; note: string; anzahl: string; googleLink: string; stimmen: { name: string; ort: string; text: string; sterne: number }[] }) {
    const {
        pill = "Kundenstimmen",
        heading = "Was unsere Kunden sagen",
        intro = "",
        note = "4,6",
        anzahl = "",
        googleLink = "https://www.google.com/search?q=ED+Elektro+%26+Klimatechnik+W%C3%B6rrstadt",
        stimmen = [],
        ctaLabel = CTA_DEFAULT, ctaNote = NOTE_DEFAULT, showCta = true, style,
    } = props
    const { headingId, scope: s } = useScope("ed-bew")
    const css = baseCss(s, "#fff") + `
.${s}__sum { display: flex; flex-wrap: wrap; align-items: center; justify-content: flex-start; gap: 12px 20px; margin: 0 0 ${tokens.space[6]}px; padding: ${tokens.space[4]}px ${tokens.space[5]}px;
  max-width: 560px; border-radius: ${tokens.radius.md}px; background: ${tokens.color.surfaceAlt}; }
.${s}__g { font-family: ${fontFamily.heading}; font-size: 2.25rem; font-weight: 800; color: ${tokens.color.text}; }
.${s}__stars { color: #F5B301; font-size: 1.25rem; letter-spacing: 2px; }
.${s}__a { color: ${tokens.color.primary}; font-weight: 600; text-decoration: none; font-size: .9375rem; }
.${s}__grid { display: grid; grid-template-columns: minmax(0,1fr); gap: ${tokens.space[4]}px; margin: 0; padding: 0; list-style: none; }
.${s}__card { padding: ${tokens.space[5]}px; border-radius: ${tokens.radius.md}px; border: 1px solid ${tokens.color.line}; }
.${s}__q { margin: 8px 0 0; font-size: .9375rem; line-height: 1.55; color: ${tokens.color.text}; }
.${s}__who { margin-top: 12px; font-size: .875rem; color: #64748B; }
@media (min-width: ${breakpoints.tablet}px) { .${s}__grid { grid-template-columns: repeat(3, minmax(0,1fr)); } }
`
    return (
        <section lang="de" aria-labelledby={headingId} className={s} style={style}>
            <style dangerouslySetInnerHTML={styleHtml(css)} />
            <div className={`${s}__inner`}>
                <Head s={s} id={headingId} pill={pill} heading={heading} intro={intro} />
                <div className={`${s}__sum`}>
                    <span className={`${s}__g`}>{note}</span>
                    <span><span className={`${s}__stars`} aria-hidden="true">★★★★★</span><br /><span style={{ fontSize: ".875rem" }}>auf Google{anzahl ? ` · ${anzahl} Bewertungen` : ""}</span></span>
                    {googleLink && <a className={`${s}__a`} href={googleLink} target="_blank" rel="noopener">Alle Bewertungen lesen →</a>}
                </div>
                {stimmen.length > 0 && (
                    <ul className={`${s}__grid`}>
                        {stimmen.map((b, i) => (
                            <li key={i} className={`${s}__card`}>
                                <span className={`${s}__stars`} aria-label={`${b.sterne} von 5 Sternen`}>{"★".repeat(Math.max(0, Math.min(5, b.sterne || 5)))}</span>
                                <p className={`${s}__q`}>„{b.text}“</p>
                                <div className={`${s}__who`}>{b.name}{b.ort ? ` · ${b.ort}` : ""}</div>
                            </li>
                        ))}
                    </ul>
                )}
                {showCta && <Cta s={s} label={ctaLabel} note={ctaNote} modul="bewertungen" />}
            </div>
        </section>
    )
}
addPropertyControls(Bewertungen, {
    pill: { type: ControlType.String, title: "Label", defaultValue: "Kundenstimmen" },
    heading: { type: ControlType.String, title: "H2", defaultValue: "Was unsere Kunden sagen" },
    note: { type: ControlType.String, title: "Google-Note", defaultValue: "4,6" },
    anzahl: { type: ControlType.String, title: "Anzahl Bewertungen", defaultValue: "" },
    googleLink: { type: ControlType.Link, title: "Google-Profil" },
    stimmen: {
        type: ControlType.Array, title: "Echte Bewertungen",
        control: { type: ControlType.Object, controls: { name: { type: ControlType.String, title: "Name" }, ort: { type: ControlType.String, title: "Ort" }, text: { type: ControlType.String, title: "Text", displayTextArea: true }, sterne: { type: ControlType.Number, title: "Sterne", min: 1, max: 5, step: 1, defaultValue: 5 } } },
    },
    ...ctaControls,
})

/* ------------------------------------------------ Icons */

const Arrow = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
const Check = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12" /></svg>
const Info = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flex: "0 0 auto", marginTop: 1 }}><circle cx="12" cy="12" r="9" /><path d="M12 7v6M12 16.5h.01" /></svg>
const Seal = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="9" r="6" /><path d="M9 14.5 8 22l4-2 4 2-1-7.5" /><polyline points="9.5 9 11.3 10.8 14.5 7.6" /></svg>
