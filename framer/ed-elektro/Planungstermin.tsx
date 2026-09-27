import { addPropertyControls, ControlType } from "framer"
import { useId } from "react"
import type { CSSProperties } from "react"
import { balancedText, breakpoints, fontFamily, styleHtml, tokens } from "https://framer.com/m/tokens-vFs3oF.js@LkJ7KpTJkNFoJ7Db3uCY"
import { trackCall, trackCta } from "https://framer.com/m/tracking-6HWM39.js@5o3KZaWoIh1vMarQCwOl"

/**
 * Modul C – Planungstermin (Briefing Landingpage Wärmepumpe, 27.09.2026)
 *
 * Der Termin soll wie der logische nächste Schritt nach dem Online-Preis
 * wirken, nicht wie ein Verkaufsgespräch. Platzierung nach dem Rechner.
 *
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight auto
 */
export default function Planungstermin(props: PlanungsterminProps) {
    const {
        heading = "Online sehen Sie den Preis. Vor Ort planen wir Ihre Anlage.",
        nutzen = "Danach erhalten Sie ein Festpreis-Angebot mit Ihrem Förderbetrag in Euro – und wir stellen den Förderantrag für Sie.",
        ctaLabel = "Planungstermin vereinbaren",
        ctaLink = "/waermepumpe-termin",
        phoneDisplay = "06732 600 7358",
        phoneNumber = "+4967326007358",
        style,
    } = props

    const headingId = useId()
    const scope = `ed-plan-${headingId.replace(/[^a-zA-Z0-9-]/g, "")}`

    const punkte = [
        { icon: "gauge", titel: "Heizlast", text: "Damit die Wärmepumpe nicht zu groß und nicht zu klein ist." },
        { icon: "radiator", titel: "Heizkörper und Vorlauftemperatur", text: "Entscheidet über Ihre Stromkosten im Betrieb." },
        { icon: "pin", titel: "Aufstellort und Schall", text: "Passend zu Grundstück und Nachbarn." },
        { icon: "bolt", titel: "Stromanschluss und Zählerschrank", text: "Unser Kernhandwerk als Elektro-Meisterbetrieb." },
    ]

    const css = `
.${scope} { width: 100%; background: ${tokens.color.surfaceAlt}; font-family: ${fontFamily.body}; color: ${tokens.color.textMuted}; }
.${scope} *, .${scope} *::before, .${scope} *::after { box-sizing: border-box; }
.${scope}__inner { width: 100%; max-width: ${tokens.maxWidth}px; margin: 0 auto; padding: ${tokens.space[8]}px ${tokens.space[4]}px; }
.${scope}__eyebrow { margin: 0 0 ${tokens.space[3]}px; font-size: .9375rem; font-weight: 600; color: ${tokens.color.primary}; }
.${scope}__h2 { margin: 0; max-width: 24ch; font-family: ${fontFamily.heading}; font-size: ${tokens.font.h2}; font-weight: 600; line-height: 1.15; letter-spacing: -0.015em; color: ${tokens.color.text}; }
.${scope}__lead { margin: ${tokens.space[4]}px 0 0; max-width: 60ch; font-size: ${tokens.font.body}; line-height: 1.55; }
.${scope}__grid { display: grid; grid-template-columns: minmax(0,1fr); gap: ${tokens.space[4]}px; margin: ${tokens.space[7]}px 0 0; padding: 0; list-style: none; }
.${scope}__card { display: flex; flex-direction: column; gap: ${tokens.space[2]}px; padding: ${tokens.space[5]}px; border: 1px solid ${tokens.color.line}; border-radius: ${tokens.radius.md}px; background: ${tokens.color.surface}; }
.${scope}__top { display: flex; align-items: center; justify-content: space-between; margin-bottom: ${tokens.space[2]}px; }
.${scope}__ic { width: 40px; height: 40px; border-radius: ${tokens.radius.sm}px; display: inline-flex; align-items: center; justify-content: center; background: #EAF0FC; color: ${tokens.color.primary}; }
.${scope}__n { font-family: ${fontFamily.heading}; font-size: .9375rem; font-weight: 700; color: #94A3B8; font-variant-numeric: tabular-nums; }
.${scope}__t { font-family: ${fontFamily.heading}; font-size: 1.125rem; font-weight: 600; line-height: 1.3; color: ${tokens.color.text}; }
.${scope}__x { font-size: .9375rem; line-height: 1.55; }
.${scope}__bottom { display: flex; flex-direction: column; gap: ${tokens.space[5]}px; margin-top: ${tokens.space[6]}px; padding: ${tokens.space[5]}px; border-radius: ${tokens.radius.md}px; background: ${tokens.color.navy}; }
.${scope}__nutzen { margin: 0; display: flex; gap: ${tokens.space[3]}px; align-items: flex-start; font-size: 1.0625rem; line-height: 1.5; font-weight: 500; color: ${tokens.color.textOnDark}; }
.${scope}__nutzen svg { flex: 0 0 auto; margin-top: 3px; color: #7FA8F0; }
.${scope}__actions { display: flex; flex-direction: column; gap: ${tokens.space[3]}px; }
.${scope}__cta, .${scope}__phone { display: inline-flex; align-items: center; justify-content: center; gap: ${tokens.space[2]}px; padding: ${tokens.space[4]}px ${tokens.space[6]}px; border-radius: ${tokens.radius.md}px; font-family: ${fontFamily.heading}; font-size: 1.0625rem; font-weight: 600; line-height: 1.2; text-decoration: none; white-space: nowrap; }
.${scope}__cta { background: ${tokens.color.primary}; color: #fff; }
.${scope}__phone { color: #fff; border: 1px solid rgba(255,255,255,.38); font-variant-numeric: tabular-nums; }
@media (min-width: ${breakpoints.tablet}px) {
  .${scope}__inner { padding: ${tokens.space[9]}px ${tokens.space[6]}px; }
  .${scope}__grid { grid-template-columns: repeat(2, minmax(0,1fr)); }
  .${scope}__actions { flex-direction: row; }
}
@media (min-width: ${breakpoints.desktop}px) {
  .${scope}__grid { grid-template-columns: repeat(4, minmax(0,1fr)); }
  .${scope}__bottom { flex-direction: row; align-items: center; justify-content: space-between; padding: ${tokens.space[5]}px ${tokens.space[6]}px; }
}
`

    return (
        <section aria-labelledby={headingId} className={scope} style={style}>
            <style dangerouslySetInnerHTML={styleHtml(css)} />
            <div className={`${scope}__inner`}>
                <p className={`${scope}__eyebrow`}>Planungstermin vor Ort</p>
                <h2 id={headingId} className={`${scope}__h2`} style={balancedText}>{heading}</h2>
                <p className={`${scope}__lead`} style={balancedText}>
                    Der Online-Preis ist Ihre Orientierung. Den Festpreis machen wir erst, wenn der Meister Ihr Haus
                    gesehen hat. Dabei prüfen wir vier Dinge:
                </p>

                <ol className={`${scope}__grid`}>
                    {punkte.map((p, i) => (
                        <li key={p.titel} className={`${scope}__card`}>
                            <span className={`${scope}__top`}>
                                <span className={`${scope}__ic`}><Ic n={p.icon} /></span>
                                <span className={`${scope}__n`}>0{i + 1}</span>
                            </span>
                            <span className={`${scope}__t`}>{p.titel}</span>
                            <span className={`${scope}__x`}>{p.text}</span>
                        </li>
                    ))}
                </ol>

                <div className={`${scope}__bottom`}>
                    <p className={`${scope}__nutzen`}><Ic n="check" /> <span>{nutzen}</span></p>
                    <div className={`${scope}__actions`}>
                        <a className={`${scope}__cta`} href={ctaLink} onClick={() => trackCta("planungstermin" as any)}>{ctaLabel}</a>
                        <a className={`${scope}__phone`} href={`tel:${phoneNumber}`} onClick={() => trackCall("planungstermin")}>
                            <Ic n="phone" /> {phoneDisplay}
                        </a>
                    </div>
                </div>
            </div>
        </section>
    )
}

function Ic({ n }: { n: string }) {
    const p = { width: 20, height: 20, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true }
    switch (n) {
        case "gauge": return <svg {...p}><path d="M4 16a8 8 0 1 1 16 0" /><path d="M12 16l4-5" /><path d="M4 20h16" /></svg>
        case "radiator": return <svg {...p}><rect x="3" y="5" width="18" height="13" rx="2" /><path d="M7 5v13M11 5v13M15 5v13M19 5v13M6 18v2M18 18v2" /></svg>
        case "pin": return <svg {...p}><path d="M12 21s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12z" /><circle cx="12" cy="9" r="2.5" /></svg>
        case "bolt": return <svg {...p}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
        case "phone": return <svg {...p} width={18} height={18}><path d="M6.6 3.6l2.6.5 1.3 3.3-1.9 1.5a11 11 0 0 0 6 6l1.5-1.9 3.3 1.3.5 2.6a1.8 1.8 0 0 1-1.9 2.1C10.9 18.4 5.6 13.1 5 6.5a1.8 1.8 0 0 1 1.6-2.9z" /></svg>
        case "check":
        default: return <svg {...p}><polyline points="20 6 9 17 4 12" /></svg>
    }
}

interface PlanungsterminProps {
    heading: string
    nutzen: string
    ctaLabel: string
    ctaLink: string
    phoneDisplay: string
    phoneNumber: string
    style?: CSSProperties
}

addPropertyControls(Planungstermin, {
    heading: { type: ControlType.String, title: "H2", displayTextArea: true, defaultValue: "Online sehen Sie den Preis. Vor Ort planen wir Ihre Anlage." },
    nutzen: { type: ControlType.String, title: "Nutzen-Zeile", displayTextArea: true, defaultValue: "Danach erhalten Sie ein Festpreis-Angebot mit Ihrem Förderbetrag in Euro – und wir stellen den Förderantrag für Sie." },
    ctaLabel: { type: ControlType.String, title: "CTA-Text", defaultValue: "Planungstermin vereinbaren" },
    ctaLink: { type: ControlType.Link, title: "CTA-Ziel", defaultValue: "/waermepumpe-termin" },
    phoneDisplay: { type: ControlType.String, title: "Nummer sichtbar", defaultValue: "06732 600 7358" },
    phoneNumber: { type: ControlType.String, title: "Nummer für tel:", defaultValue: "+4967326007358" },
})
