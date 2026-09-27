import { addPropertyControls, ControlType } from "framer"
import type { CSSProperties } from "react"
import { fontFamily, tokens } from "https://framer.com/m/tokens-vFs3oF.js@LkJ7KpTJkNFoJ7Db3uCY"
import { trackCta } from "https://framer.com/m/tracking-6HWM39.js@5o3KZaWoIh1vMarQCwOl"

/**
 * Themenweiche für den Hero der Startseite: zwei Kacheln, die Interessenten
 * direkt zur Klima- bzw. Wärmepumpen-Oberseite führen. Jede Kachel hat zwei
 * Wege – „Mehr erfahren“ (Oberseite) und „Preis berechnen“ (Rechner) –, damit
 * Entschlossene nicht über die Oberseite müssen.
 *
 * Gestaltet für den dunklen Bild-Hero (Glas-Optik, weiße Schrift).
 *
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight auto
 * @framerIntrinsicWidth 480
 * @framerIntrinsicHeight 420
 */
export default function ThemenWeiche(props: WeicheProps) {
    const {
        titel = "Wofür interessieren Sie sich?",
        k1Titel = "Klimaanlage",
        k1Text = "Kühlen im Sommer, heizen in der Übergangszeit.",
        k1Preis = "ab 3.332 € inkl. MwSt. und Montage",
        k1Link = "/klimaanlage",
        k1Rechner = "/klimaanlage/preis",
        k2Titel = "Wärmepumpe",
        k2Text = "Heizung tauschen – den Förderantrag übernehmen wir.",
        k2Preis = "ab 20.883 € · bis zu 22.400 € Zuschuss",
        k2Link = "/waermepumpe",
        k2Rechner = "/waermepumpe/preis",
        style,
    } = props

    const kacheln = [
        { id: "klima", icon: <SnowIcon />, titel: k1Titel, text: k1Text, preis: k1Preis, link: k1Link, rechner: k1Rechner },
        { id: "waermepumpe", icon: <HeatIcon />, titel: k2Titel, text: k2Text, preis: k2Preis, link: k2Link, rechner: k2Rechner },
    ]

    const css = `
.ed-weiche { width: 100%; font-family: ${fontFamily.body}; color: #fff; }
.ed-weiche *, .ed-weiche *::before, .ed-weiche *::after { box-sizing: border-box; }
.ed-weiche__t { margin: 0 0 12px; font-size: .9375rem; font-weight: 600; letter-spacing: .01em; color: rgba(255,255,255,.8); }
.ed-weiche__list { display: grid; grid-template-columns: minmax(0,1fr); gap: 12px; margin: 0; padding: 0; list-style: none; }
.ed-weiche__card { position: relative; display: grid; grid-template-columns: 44px minmax(0,1fr); gap: 4px 16px; padding: 20px;
  border-radius: ${tokens.radius.md}px; background: rgba(15,23,42,.62); border: 1px solid rgba(255,255,255,.16);
  -webkit-backdrop-filter: blur(14px); backdrop-filter: blur(14px); transition: border-color .18s, background .18s; }
.ed-weiche__card:hover { border-color: rgba(255,255,255,.42); background: rgba(15,23,42,.74); }
.ed-weiche__ic { grid-row: span 3; width: 44px; height: 44px; border-radius: ${tokens.radius.sm}px; display: inline-flex; align-items: center;
  justify-content: center; background: ${tokens.color.primary}; color: #fff; }
.ed-weiche__h { margin: 0; font-family: ${fontFamily.heading}; font-size: 1.3125rem; font-weight: 700; line-height: 1.2; }
.ed-weiche__h a { color: inherit; text-decoration: none; }
.ed-weiche__h a::after { content: ""; position: absolute; inset: 0; border-radius: inherit; }
.ed-weiche__x { margin: 0; font-size: .9375rem; line-height: 1.45; color: rgba(255,255,255,.82); }
.ed-weiche__p { margin: 2px 0 0; font-size: .875rem; font-weight: 600; color: #9DBDF6; font-variant-numeric: tabular-nums; }
.ed-weiche__actions { grid-column: 2; display: flex; flex-wrap: wrap; gap: 8px 16px; margin-top: 10px; }
.ed-weiche__more, .ed-weiche__calc { position: relative; z-index: 1; display: inline-flex; align-items: center; gap: 6px; font-family: ${fontFamily.heading};
  font-size: .9375rem; font-weight: 600; text-decoration: none; }
.ed-weiche__more { color: #fff; }
.ed-weiche__calc { padding: 7px 14px; border-radius: 999px; background: #fff; color: ${tokens.color.primary}; }
.ed-weiche__more:focus-visible, .ed-weiche__calc:focus-visible, .ed-weiche__h a:focus-visible { outline: 2px solid #fff; outline-offset: 3px; }
@media (min-width: 640px) and (max-width: 1199px) {
  .ed-weiche__list { grid-template-columns: repeat(2, minmax(0,1fr)); }
}
`

    return (
        <nav className="ed-weiche" style={style} aria-label="Themen">
            <style dangerouslySetInnerHTML={{ __html: css }} />
            {titel && <p className="ed-weiche__t">{titel}</p>}
            <ul className="ed-weiche__list">
                {kacheln.map((k) => (
                    <li key={k.id} className="ed-weiche__card">
                        <span className="ed-weiche__ic">{k.icon}</span>
                        <h2 className="ed-weiche__h">
                            <a href={k.link} onClick={() => trackCta(("weiche_" + k.id) as any)}>{k.titel}</a>
                        </h2>
                        <p className="ed-weiche__x">{k.text}</p>
                        <p className="ed-weiche__p">{k.preis}</p>
                        <div className="ed-weiche__actions">
                            <a className="ed-weiche__more" href={k.link} onClick={() => trackCta(("weiche_" + k.id) as any)}>
                                Mehr erfahren <Arrow />
                            </a>
                            <a className="ed-weiche__calc" href={k.rechner} onClick={() => trackCta(("weiche_" + k.id + "_rechner") as any)}>
                                Preis berechnen
                            </a>
                        </div>
                    </li>
                ))}
            </ul>
        </nav>
    )
}

const svg = { width: 22, height: 22, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true }
function SnowIcon() {
    return <svg {...svg}><path d="M12 2v20M4.2 7l15.6 10M19.8 7 4.2 17" /><path d="M12 6l-2-2M12 6l2-2M12 18l-2 2M12 18l2 2" /></svg>
}
function HeatIcon() {
    return <svg {...svg}><path d="M3 10.5 12 4l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z" /><path d="M10 17c0-1.5 2-2 2-4 1 .8 2 2 2 3.2A2 2 0 0 1 10 17z" /></svg>
}
function Arrow() {
    return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
}

interface WeicheProps {
    titel: string
    k1Titel: string; k1Text: string; k1Preis: string; k1Link: string; k1Rechner: string
    k2Titel: string; k2Text: string; k2Preis: string; k2Link: string; k2Rechner: string
    style?: CSSProperties
}

const str = (title: string, defaultValue: string) => ({ type: ControlType.String, title, defaultValue })
const link = (title: string, defaultValue: string) => ({ type: ControlType.Link, title, defaultValue })

addPropertyControls(ThemenWeiche, {
    titel: str("Überschrift", "Wofür interessieren Sie sich?"),
    k1Titel: str("Klima: Titel", "Klimaanlage"),
    k1Text: str("Klima: Text", "Kühlen im Sommer, heizen in der Übergangszeit."),
    k1Preis: str("Klima: Preis", "ab 3.332 € inkl. MwSt. und Montage"),
    k1Link: link("Klima: Seite", "/klimaanlage"),
    k1Rechner: link("Klima: Rechner", "/klimaanlage/preis"),
    k2Titel: str("WP: Titel", "Wärmepumpe"),
    k2Text: str("WP: Text", "Heizung tauschen – den Förderantrag übernehmen wir."),
    k2Preis: str("WP: Preis", "ab 20.883 € · bis zu 22.400 € Zuschuss"),
    k2Link: link("WP: Seite", "/waermepumpe"),
    k2Rechner: link("WP: Rechner", "/waermepumpe/preis"),
})
