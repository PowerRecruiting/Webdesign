import { addPropertyControls, ControlType } from "framer"
import { useId } from "react"
import type { CSSProperties } from "react"
import { balancedText, breakpoints, fontFamily, styleHtml, tokens } from "https://framer.com/m/tokens-x6g0t9.js@tWKhZJ2SyC5SsFax1CzI"
import { trackCta, withQuery } from "https://framer.com/m/tracking-JmBWDZ.js@lcHsNL6PUwr6EaepsGIe"

/**
 * Startseite: Weiche zu den beiden Themen-Seiten Klimaanlage und Wärmepumpe.
 * Je Karte ein Hauptlink zur Themen-Seite und ein Direktlink zum Preisrechner.
 * Google-Ads-Parameter (gclid, utm_*) werden an interne Links angehängt.
 *
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight auto
 */
export default function Schwerpunkte(props: Props) {
    const {
        pill = "Unsere Schwerpunkte",
        heading = "Klimaanlage oder Wärmepumpe?",
        intro = "Für beide Themen haben wir eigene Seiten mit Preisen, Ablauf und Online-Preisrechner – alles vom Meisterbetrieb aus Wörrstadt.",
        klima = D_KLIMA,
        wp = D_WP,
        bildKlima,
        bildWp,
        style,
    } = props
    const id = useId()
    const s = `ed-swp-${id.replace(/[^a-zA-Z0-9-]/g, "")}`

    const css = `
.${s} { container-type: inline-size; width: 100%; background: #fff; font-family: ${fontFamily.body}; color: ${tokens.color.textMuted}; }
.${s} *, .${s} *::before, .${s} *::after { box-sizing: border-box; }
.${s}__inner { width: 100%; max-width: ${tokens.maxWidth}px; margin: 0 auto; padding: ${tokens.space[7]}px ${tokens.space[4]}px; }
.${s}__head { max-width: 760px; margin: 0 0 ${tokens.space[6]}px; }
.${s}__pill { display: inline-flex; padding: 5px 12px; border-radius: 999px; background: #EAF0FC; color: ${tokens.color.primary}; font-size: .8125rem; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; }
.${s}__h2 { margin: ${tokens.space[3]}px 0 0; font-family: ${fontFamily.heading}; font-size: clamp(1.6rem, 4cqi, 2.4rem); font-weight: 700; line-height: 1.15; letter-spacing: -0.015em; color: ${tokens.color.text}; }
.${s}__intro { margin: ${tokens.space[3]}px 0 0; font-size: clamp(1rem, 1.2cqi, 1.125rem); line-height: 1.55; }
.${s}__grid { display: grid; grid-template-columns: minmax(0,1fr); gap: ${tokens.space[5]}px; margin: 0; padding: 0; list-style: none; }
.${s}__card { position: relative; display: flex; flex-direction: column; overflow: hidden; border-radius: ${tokens.radius.lg}px; background: ${tokens.color.surfaceAlt};
  border: 1px solid ${tokens.color.line}; transition: border-color .18s, box-shadow .18s, transform .18s; }
.${s}__card:hover { border-color: ${tokens.color.primary}; box-shadow: 0 14px 36px rgba(15,23,42,.10); transform: translateY(-2px); }
.${s}__img { aspect-ratio: 16 / 9; background: #DCE5F3; }
.${s}__img img { width: 100%; height: 100%; object-fit: cover; display: block; }
.${s}__body { display: flex; flex-direction: column; flex: 1 1 auto; padding: ${tokens.space[5]}px; }
.${s}__top { display: flex; align-items: center; gap: 14px; }
.${s}__ic { flex: 0 0 auto; width: 52px; height: 52px; border-radius: 14px; display: inline-flex; align-items: center; justify-content: center; background: ${tokens.color.primary}; color: #fff; }
.${s}__h3 { margin: 0; font-family: ${fontFamily.heading}; font-size: clamp(1.35rem, 2.6cqi, 1.7rem); font-weight: 700; line-height: 1.2; color: ${tokens.color.text}; }
.${s}__h3 a { color: inherit; text-decoration: none; }
.${s}__h3 a::after { content: ""; position: absolute; inset: 0; z-index: 0; }
.${s}__txt { margin: ${tokens.space[4]}px 0 0; font-size: 1.0625rem; line-height: 1.55; }
.${s}__list { margin: ${tokens.space[4]}px 0 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 10px; }
.${s}__list li { display: flex; gap: 10px; align-items: flex-start; font-size: 1rem; line-height: 1.45; color: ${tokens.color.text}; }
.${s}__list svg { flex: 0 0 auto; margin-top: 2px; color: ${tokens.color.success}; }
.${s}__preis { margin: ${tokens.space[4]}px 0 0; font-size: .9375rem; font-weight: 600; color: ${tokens.color.primary}; font-variant-numeric: tabular-nums; }
.${s}__actions { position: relative; z-index: 1; display: flex; flex-direction: column; gap: 10px; margin-top: auto; padding-top: ${tokens.space[5]}px; }
.${s}__btn, .${s}__sec { display: inline-flex; align-items: center; justify-content: center; gap: 8px; min-height: 50px; padding: 12px 20px; border-radius: ${tokens.radius.md}px;
  font-family: ${fontFamily.heading}; font-size: 1.0625rem; font-weight: 600; line-height: 1.2; text-decoration: none; text-align: center; }
.${s}__btn { background: ${tokens.color.primary}; color: #fff; }
.${s}__btn:hover { background: ${tokens.color.primaryDark}; }
.${s}__sec { background: #fff; color: ${tokens.color.primary}; border: 1.5px solid ${tokens.color.primary}; }
.${s} a:focus-visible { outline: 3px solid ${tokens.color.navy}; outline-offset: 2px; }
@container (min-width: ${breakpoints.tablet}px) {
  .${s}__inner { padding: ${tokens.space[9]}px ${tokens.space[6]}px; }
  .${s}__grid { grid-template-columns: repeat(2, minmax(0,1fr)); gap: ${tokens.space[6]}px; }
  .${s}__body { padding: ${tokens.space[6]}px; }
}
@container (min-width: ${breakpoints.desktop}px) {
  .${s}__actions { flex-direction: row; }
  .${s}__actions a { flex: 1 1 0; }
}
`
    const karten = [
        { key: "klima", k: { ...D_KLIMA, ...klima }, icon: <Snow />, bild: bildKlima },
        { key: "waermepumpe", k: { ...D_WP, ...wp }, icon: <Heat />, bild: bildWp },
    ]

    return (
        <section lang="de" aria-labelledby={`${s}-h`} className={s} style={style}>
            <style dangerouslySetInnerHTML={styleHtml(css)} />
            <div className={`${s}__inner`}>
                <div className={`${s}__head`}>
                    {pill && <span className={`${s}__pill`}>{pill}</span>}
                    <h2 id={`${s}-h`} className={`${s}__h2`} style={balancedText}>{heading}</h2>
                    {intro && <p className={`${s}__intro`} style={balancedText}>{intro}</p>}
                </div>
                <ul className={`${s}__grid`}>
                    {karten.map(({ key, k, icon, bild }) => (
                        <li key={key} className={`${s}__card`}>
                            {bild?.src && <div className={`${s}__img`}><img src={bild.src} srcSet={bild.srcSet} alt={bild.alt || k.titel} loading="lazy" /></div>}
                            <div className={`${s}__body`}>
                                <div className={`${s}__top`}>
                                    <span className={`${s}__ic`} aria-hidden="true">{icon}</span>
                                    <h3 className={`${s}__h3`}><a href={k.seite} onClick={klick("startseite_" + key, k.seite)}>{k.titel}</a></h3>
                                </div>
                                {k.text && <p className={`${s}__txt`}>{k.text}</p>}
                                <ul className={`${s}__list`}>{zeilen(k.punkte).map((z, i) => <li key={i}><Check /> <span>{z}</span></li>)}</ul>
                                {k.preis && <p className={`${s}__preis`}>{k.preis}</p>}
                                <div className={`${s}__actions`}>
                                    <a className={`${s}__btn`} href={k.seite} onClick={klick("startseite_" + key, k.seite)}>{k.button} <Arrow /></a>
                                    {k.rechner && <a className={`${s}__sec`} href={k.rechner} onClick={klick("startseite_" + key + "_rechner", k.rechner)}>{k.rechnerText}</a>}
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    )
}

/** Klick tracken und Kampagnen-Parameter an den internen Link hängen. */
function klick(modul: string, href: string) {
    return (e: { preventDefault(): void; metaKey?: boolean; ctrlKey?: boolean; shiftKey?: boolean; button?: number }) => {
        trackCta(modul as any)
        if (e.metaKey || e.ctrlKey || e.shiftKey || (e.button ?? 0) !== 0) return
        const url = withQuery(href)
        if (typeof window !== "undefined" && url !== href) { e.preventDefault(); window.location.href = url }
    }
}

const zeilen = (t: string) => (t || "").split("\n").map((z) => z.trim()).filter(Boolean)

type Karte = { titel: string; text: string; punkte: string; preis: string; button: string; seite: string; rechnerText: string; rechner: string }
type Img = { src: string; srcSet?: string; alt?: string }

const D_KLIMA: Karte = {
    titel: "Klimaanlage",
    text: "Kühlen im Sommer, effizient heizen in der Übergangszeit – für einzelne Räume oder das ganze Haus.",
    punkte: "Preis in rund 60 Sekunden online\nMontage durch eigene Monteure\nAuch große Anlagen für Büro und Gewerbe",
    preis: "ab 3.332 € inkl. MwSt. und Montage",
    button: "Zur Klimaanlage",
    seite: "/klimaanlage",
    rechnerText: "Preis berechnen",
    rechner: "/klimaanlage/preis",
}
const D_WP: Karte = {
    titel: "Wärmepumpe",
    text: "Die alte Öl- oder Gasheizung ersetzen – mit bis zu 80 % Förderung. Den Förderantrag stellen wir für Sie.",
    punkte: "Heizlast und Preis in 2 Minuten online\nFörderantrag übernehmen wir\nHeizung und Elektrik aus einer Hand",
    preis: "ab 20.883 € · bis zu 22.400 € Zuschuss",
    button: "Zur Wärmepumpe",
    seite: "/waermepumpe",
    rechnerText: "Preis berechnen",
    rechner: "/waermepumpe/preis",
}

interface Props {
    pill: string; heading: string; intro: string
    klima: Karte; wp: Karte
    bildKlima?: Img; bildWp?: Img
    style?: CSSProperties
}

const karteControls = (d: Karte, title: string) => ({
    type: ControlType.Object, title, defaultValue: d,
    controls: {
        titel: { type: ControlType.String, title: "Titel", defaultValue: d.titel },
        text: { type: ControlType.String, title: "Text", displayTextArea: true, defaultValue: d.text },
        punkte: { type: ControlType.String, title: "Punkte (je Zeile)", displayTextArea: true, defaultValue: d.punkte },
        preis: { type: ControlType.String, title: "Preis", defaultValue: d.preis },
        button: { type: ControlType.String, title: "Button", defaultValue: d.button },
        seite: { type: ControlType.Link, title: "Seite", defaultValue: d.seite },
        rechnerText: { type: ControlType.String, title: "Rechner-Text", defaultValue: d.rechnerText },
        rechner: { type: ControlType.Link, title: "Rechner", defaultValue: d.rechner },
    },
})

addPropertyControls(Schwerpunkte, {
    pill: { type: ControlType.String, title: "Label", defaultValue: "Unsere Schwerpunkte" },
    heading: { type: ControlType.String, title: "H2", defaultValue: "Klimaanlage oder Wärmepumpe?" },
    intro: { type: ControlType.String, title: "Einleitung", displayTextArea: true, defaultValue: "Für beide Themen haben wir eigene Seiten mit Preisen, Ablauf und Online-Preisrechner – alles vom Meisterbetrieb aus Wörrstadt." },
    klima: karteControls(D_KLIMA, "Klimaanlage") as any,
    bildKlima: { type: ControlType.ResponsiveImage, title: "Bild Klima (optional)" },
    wp: karteControls(D_WP, "Wärmepumpe") as any,
    bildWp: { type: ControlType.ResponsiveImage, title: "Bild WP (optional)" },
})

const Check = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12" /></svg>
const Arrow = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
const Snow = () => <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M4.2 7l15.6 10M19.8 7 4.2 17" /><path d="M12 6l-2-2M12 6l2-2M12 18l-2 2M12 18l2 2" /></svg>
const Heat = () => <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 10.5 12 4l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z" /><path d="M10 17c0-1.5 2-2 2-4 1 .8 2 2 2 3.2A2 2 0 0 1 10 17z" /></svg>
