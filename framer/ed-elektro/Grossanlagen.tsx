import { addPropertyControls, ControlType } from "framer"
import { useId } from "react"
import type { CSSProperties } from "react"
import { balancedText, breakpoints, fontFamily, styleHtml, tokens } from "https://framer.com/m/tokens-vFs3oF.js@LkJ7KpTJkNFoJ7Db3uCY"
import { trackCall, trackCta } from "https://framer.com/m/tracking-6HWM39.js@5o3KZaWoIh1vMarQCwOl"

/**
 * Hinweis-Modul „Großanlagen“ für die Klima-Seite (Meeting 23.09.2026):
 * Viele Kunden wissen nicht, dass ED Elektro auch große Anlagen für
 * Gewerbe baut. Bewusst ohne Fachbegriff „VRF“ – Kunden suchen nach
 * „große Klimaanlage“ oder „Klimaanlage für Gewerberäume“.
 *
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight auto
 */
export default function Grossanlagen(props: GrossProps) {
    const {
        heading = "Große Klimaanlagen für Büro, Praxis, Hotel und Gewerbe",
        text = "Nicht nur fürs Zuhause: Wir planen und bauen auch Anlagen für ganze Gebäude – mit zehn, zwanzig oder dreißig Innengeräten an einem System. Das wissen viele nicht.",
        richtwert = "≈ 3.000 €",
        richtwertText = "je Innengerät netto, Richtwert ab ca. 8 Innengeräten",
        ctaLabel = "Großanlage anfragen",
        ctaLink = "/kontakt",
        phoneDisplay = "06732 600 7358",
        phoneNumber = "+4967326007358",
        style,
    } = props

    const headingId = useId()
    const scope = `ed-gross-${headingId.replace(/[^a-zA-Z0-9-]/g, "")}`

    const punkte = [
        "Ein zentrales System statt vieler Einzelanlagen – heizen und kühlen, hocheffizient",
        "Ausgelegt für Hotels, Büros, Praxen und Gewerbeflächen",
        "Planung, Montage – auch mit Kran – und Wartung aus einer Hand",
        "Kälte- und Elektrotechnik im eigenen Haus, mit Klima- und Elektrokonzession",
    ]

    const css = `
.${scope} { width: 100%; background: ${tokens.color.navy}; font-family: ${fontFamily.body}; color: ${tokens.color.textMutedOnDark}; }
.${scope} *, .${scope} *::before, .${scope} *::after { box-sizing: border-box; }
.${scope}__inner { width: 100%; max-width: ${tokens.maxWidth}px; margin: 0 auto; padding: ${tokens.space[8]}px ${tokens.space[4]}px;
  display: grid; grid-template-columns: minmax(0,1fr); gap: ${tokens.space[6]}px; align-items: center; }
.${scope}__eyebrow { margin: 0 0 ${tokens.space[3]}px; font-size: .9375rem; font-weight: 600; color: #9DBDF6; }
.${scope}__h2 { margin: 0; font-family: ${fontFamily.heading}; font-size: ${tokens.font.h2}; font-weight: 600; line-height: 1.15; letter-spacing: -0.015em; color: #fff; }
.${scope}__text { margin: ${tokens.space[4]}px 0 0; font-size: ${tokens.font.body}; line-height: 1.55; }
.${scope}__list { margin: ${tokens.space[5]}px 0 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: ${tokens.space[3]}px; }
.${scope}__list li { display: flex; gap: ${tokens.space[3]}px; align-items: flex-start; font-size: .9875rem; line-height: 1.5; }
.${scope}__list svg { flex: 0 0 auto; margin-top: 2px; color: #9DBDF6; }
.${scope}__actions { display: flex; flex-direction: column; gap: ${tokens.space[3]}px; margin-top: ${tokens.space[6]}px; }
.${scope}__cta, .${scope}__phone { display: inline-flex; align-items: center; justify-content: center; gap: ${tokens.space[2]}px; padding: ${tokens.space[4]}px ${tokens.space[6]}px;
  border-radius: ${tokens.radius.md}px; font-family: ${fontFamily.heading}; font-size: 1.0625rem; font-weight: 600; line-height: 1.2; text-decoration: none; white-space: nowrap; }
.${scope}__cta { background: ${tokens.color.primary}; color: #fff; }
.${scope}__phone { color: #fff; border: 1px solid rgba(255,255,255,.38); font-variant-numeric: tabular-nums; }
.${scope}__stats { display: grid; grid-template-columns: minmax(0,1fr); gap: ${tokens.space[3]}px; }
.${scope}__stat { padding: ${tokens.space[5]}px; border-radius: ${tokens.radius.md}px; background: rgba(255,255,255,.06); border: 1px solid rgba(255,255,255,.12); }
.${scope}__num { display: block; font-family: ${fontFamily.heading}; font-size: clamp(1.9rem, 3.4vw, 2.5rem); font-weight: 700; line-height: 1.1; color: #fff; font-variant-numeric: tabular-nums; }
.${scope}__lab { display: block; margin-top: ${tokens.space[2]}px; font-size: .9375rem; line-height: 1.45; }
@media (min-width: ${breakpoints.tablet}px) {
  .${scope}__inner { padding: ${tokens.space[9]}px ${tokens.space[6]}px; }
  .${scope}__actions { flex-direction: row; }
  .${scope}__stats { grid-template-columns: repeat(3, minmax(0,1fr)); }
}
@media (min-width: ${breakpoints.desktop}px) {
  .${scope}__inner { grid-template-columns: minmax(0,1.35fr) minmax(0,1fr); gap: ${tokens.space[8]}px; }
  .${scope}__stats { grid-template-columns: minmax(0,1fr); }
}
`

    const stats = [
        { num: "10 – 30", lab: "Innengeräte an einem System" },
        { num: richtwert, lab: richtwertText },
        { num: "1 Ansprechpartner", lab: "von der Planung bis zur Wartung" },
    ]

    return (
        <section aria-labelledby={headingId} className={scope} style={style}>
            <style dangerouslySetInnerHTML={styleHtml(css)} />
            <div className={`${scope}__inner`}>
                <div>
                    <p className={`${scope}__eyebrow`}>Gewerbe & Großprojekte</p>
                    <h2 id={headingId} className={`${scope}__h2`} style={balancedText}>{heading}</h2>
                    <p className={`${scope}__text`} style={balancedText}>{text}</p>
                    <ul className={`${scope}__list`}>
                        {punkte.map((p) => (
                            <li key={p}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12" /></svg>
                                <span>{p}</span>
                            </li>
                        ))}
                    </ul>
                    <div className={`${scope}__actions`}>
                        <a className={`${scope}__cta`} href={ctaLink} onClick={() => trackCta("grossanlagen" as any)}>{ctaLabel}</a>
                        <a className={`${scope}__phone`} href={`tel:${phoneNumber}`} onClick={() => trackCall("grossanlagen")}>{phoneDisplay}</a>
                    </div>
                </div>
                <div className={`${scope}__stats`}>
                    {stats.map((s) => (
                        <div key={s.lab} className={`${scope}__stat`}>
                            <span className={`${scope}__num`}>{s.num}</span>
                            <span className={`${scope}__lab`}>{s.lab}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

interface GrossProps {
    heading: string
    text: string
    richtwert: string
    richtwertText: string
    ctaLabel: string
    ctaLink: string
    phoneDisplay: string
    phoneNumber: string
    style?: CSSProperties
}

addPropertyControls(Grossanlagen, {
    heading: { type: ControlType.String, title: "H2", displayTextArea: true, defaultValue: "Große Klimaanlagen für Büro, Praxis, Hotel und Gewerbe" },
    text: { type: ControlType.String, title: "Text", displayTextArea: true, defaultValue: "Nicht nur fürs Zuhause: Wir planen und bauen auch Anlagen für ganze Gebäude – mit zehn, zwanzig oder dreißig Innengeräten an einem System. Das wissen viele nicht." },
    richtwert: { type: ControlType.String, title: "Richtwert", defaultValue: "≈ 3.000 €" },
    richtwertText: { type: ControlType.String, title: "Richtwert-Text", defaultValue: "je Innengerät netto, Richtwert ab ca. 8 Innengeräten" },
    ctaLabel: { type: ControlType.String, title: "CTA-Text", defaultValue: "Großanlage anfragen" },
    ctaLink: { type: ControlType.Link, title: "CTA-Ziel", defaultValue: "/kontakt" },
    phoneDisplay: { type: ControlType.String, title: "Nummer sichtbar", defaultValue: "06732 600 7358" },
    phoneNumber: { type: ControlType.String, title: "Nummer für tel:", defaultValue: "+4967326007358" },
})
