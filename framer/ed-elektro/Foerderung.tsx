import { addPropertyControls, ControlType } from "framer"
import { useId } from "react"
import type { CSSProperties } from "react"
import { balancedText, breakpoints, fontFamily, styleHtml, tokens } from "https://framer.com/m/tokens-vFs3oF.js@LkJ7KpTJkNFoJ7Db3uCY"
import { trackCta } from "https://framer.com/m/tracking-6HWM39.js@5o3KZaWoIh1vMarQCwOl"

/**
 * Modul A – Förderung (Briefing Landingpage Wärmepumpe, 27.09.2026)
 *
 * Erklärt die Heizungsförderung in Euro und stellt den Full-Service in den
 * Vordergrund: ED Elektro stellt den Antrag. Bewusst KEIN Förderrechner –
 * die Beispielrechnung ist statisch und rechnet nur mit den Sätzen aus den
 * Eigenschaften, damit sie 2027 ohne Code-Änderung angepasst werden kann.
 *
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight auto
 */
export default function Foerderung(props: FoerderungProps) {
    const {
        eyebrow = "Förderung 2026",
        heading = "Bis zu 22.400 € Zuschuss für Ihre neue Heizung",
        subline = "30 % Grundförderung gibt es nur noch 2026. Danach sinkt sie deutlich.",
        grund = 30,
        klima = 16,
        einkommenVon = 10,
        einkommenBis = 40,
        maxProzent = 80,
        maxKosten = 28000,
        beispielKosten = 30000,
        stichtag = "Ab 2027 sinkt die Grundförderung auf 15 %, der Klimabonus halbjährlich. Wer 2026 plant, sichert sich die höheren Sätze.",
        fussnote = "KfW-Heizungsförderung, Stand 21.07.2026. Höchstens 80 %, gerechnet auf max. 28.000 € förderfähige Kosten. Ob Sie die Boni erhalten, prüfen wir im Planungstermin.",
        ctaLabel = "Preis berechnen",
        ctaLink = "/waermepumpe/preis",
        terminLabel = "Direkt Planungstermin vereinbaren",
        terminLink = "/waermepumpe/termin",
        style,
    } = props

    const headingId = useId()
    const scope = `ed-foe-${headingId.replace(/[^a-zA-Z0-9-]/g, "")}`

    // Beispiel: Ölheizung, selbst bewohnt – einmal ohne, einmal mit vollem Einkommensbonus
    const basis = Math.min(beispielKosten, maxKosten)
    const satzA = Math.min(grund + klima, maxProzent)
    const satzB = Math.min(grund + klima + einkommenBis, maxProzent)
    const zuschussA = Math.round((basis * satzA) / 100)
    const zuschussB = Math.round((basis * satzB) / 100)
    const beispiele = [
        { label: `Grundförderung + Klimabonus (${satzA} %)`, zuschuss: zuschussA, eigen: beispielKosten - zuschussA },
        { label: `Mit vollem Einkommensbonus (${satzB} %)`, zuschuss: zuschussB, eigen: beispielKosten - zuschussB },
    ]

    const kacheln = [
        { satz: `${grund} %`, titel: "Grundförderung", text: "Für jeden, der eine Wärmepumpe einbaut." },
        { satz: `+${klima} %`, titel: "Klimabonus", text: "Sie wohnen selbst im Haus und ersetzen eine alte Öl-, Gas- oder Nachtspeicherheizung." },
        { satz: `+${einkommenVon} bis ${einkommenBis} %`, titel: "Einkommensbonus", text: "Selbst bewohnt, Haushaltseinkommen bis 50.000 € im Jahr." },
    ]

    const service = [
        { titel: "Wir stellen den Antrag", text: "Den Hauptantrag bei der KfW reichen wir für Sie ein – rechtzeitig vor Baubeginn." },
        { titel: "Sie bestätigen mit Ihren Daten", text: "Sie geben nur noch Ihre persönlichen Angaben ein und erhalten Ihre Fördernummer." },
        { titel: "Wir liefern die Nachweise", text: "Nach der Montage bekommen Sie von uns alle Unterlagen, die für die Auszahlung nötig sind." },
    ]

    const css = `
.${scope} { width: 100%; background: ${tokens.color.surface}; font-family: ${fontFamily.body}; color: ${tokens.color.textMuted}; }
.${scope} *, .${scope} *::before, .${scope} *::after { box-sizing: border-box; }
.${scope}__inner { width: 100%; max-width: ${tokens.maxWidth}px; margin: 0 auto; padding: ${tokens.space[8]}px ${tokens.space[4]}px; }
.${scope}__eyebrow { margin: 0 0 ${tokens.space[3]}px; font-size: .9375rem; font-weight: 600; color: ${tokens.color.primary}; }
.${scope}__h2 { margin: 0; max-width: 20ch; font-family: ${fontFamily.heading}; font-size: ${tokens.font.h2}; font-weight: 600; line-height: 1.15; letter-spacing: -0.015em; color: ${tokens.color.text}; }
.${scope}__sub { margin: ${tokens.space[4]}px 0 0; font-size: ${tokens.font.body}; line-height: 1.55; }
.${scope}__sub strong { color: ${tokens.color.text}; }

.${scope}__tiles { display: grid; grid-template-columns: minmax(0,1fr); gap: ${tokens.space[4]}px; margin: ${tokens.space[7]}px 0 0; padding: 0; list-style: none; }
.${scope}__tile { display: flex; flex-direction: column; gap: ${tokens.space[2]}px; padding: ${tokens.space[5]}px; border: 1px solid ${tokens.color.line}; border-radius: ${tokens.radius.md}px; background: ${tokens.color.surfaceAlt}; }
.${scope}__satz { font-family: ${fontFamily.heading}; font-size: clamp(1.9rem, 3.4vw, 2.5rem); font-weight: 700; line-height: 1.1; color: ${tokens.color.primary}; font-variant-numeric: tabular-nums; }
.${scope}__tt { font-family: ${fontFamily.heading}; font-size: 1.125rem; font-weight: 600; color: ${tokens.color.text}; }
.${scope}__tx { font-size: .9375rem; line-height: 1.55; }

.${scope}__split { display: grid; grid-template-columns: minmax(0,1fr); gap: ${tokens.space[5]}px; margin-top: ${tokens.space[5]}px; }
.${scope}__card { padding: ${tokens.space[6]}px ${tokens.space[5]}px; border: 1px solid ${tokens.color.line}; border-radius: ${tokens.radius.md}px; background: ${tokens.color.surface}; }
.${scope}__ct { margin: 0; font-family: ${fontFamily.heading}; font-size: 1.125rem; font-weight: 600; color: ${tokens.color.text}; }
.${scope}__cs { margin: ${tokens.space[1]}px 0 0; font-size: .9375rem; }
.${scope}__row { margin-top: ${tokens.space[5]}px; }
.${scope}__rl { font-size: .9375rem; font-weight: 600; color: ${tokens.color.text}; }
.${scope}__bar { display: flex; height: 12px; margin: ${tokens.space[2]}px 0; border-radius: 999px; overflow: hidden; background: ${tokens.color.line}; }
.${scope}__bar span { display: block; height: 100%; background: ${tokens.color.primary}; }
.${scope}__nums { display: flex; flex-wrap: wrap; justify-content: space-between; gap: ${tokens.space[1]}px ${tokens.space[4]}px; font-size: .9375rem; font-variant-numeric: tabular-nums; }
.${scope}__nums b { color: ${tokens.color.primary}; }

.${scope}__service { padding: ${tokens.space[6]}px ${tokens.space[5]}px; border-radius: ${tokens.radius.md}px; background: ${tokens.color.navy}; color: ${tokens.color.textMutedOnDark}; }
.${scope}__badge { display: inline-flex; padding: ${tokens.space[1]}px ${tokens.space[3]}px; border-radius: 999px; background: rgba(255,255,255,.1); color: ${tokens.color.textOnDark}; font-size: .8125rem; font-weight: 600; letter-spacing: .02em; }
.${scope}__service h3 { margin: ${tokens.space[3]}px 0 0; font-family: ${fontFamily.heading}; font-size: ${tokens.font.h3}; font-weight: 600; line-height: 1.25; color: ${tokens.color.textOnDark}; }
.${scope}__steps { margin: ${tokens.space[5]}px 0 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: ${tokens.space[4]}px; }
.${scope}__step { display: grid; grid-template-columns: 32px minmax(0,1fr); gap: ${tokens.space[3]}px; }
.${scope}__num { width: 32px; height: 32px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; background: ${tokens.color.primary}; color: #fff; font-weight: 700; font-size: .9375rem; }
.${scope}__st { display: block; font-size: 1.0625rem; font-weight: 600; line-height: 1.35; color: ${tokens.color.textOnDark}; }
.${scope}__sx { display: block; margin-top: 2px; font-size: .9375rem; line-height: 1.5; }

.${scope}__notes { display: grid; grid-template-columns: minmax(0,1fr); gap: ${tokens.space[3]}px; margin-top: ${tokens.space[5]}px; }
.${scope}__note { display: flex; gap: ${tokens.space[3]}px; align-items: flex-start; padding: ${tokens.space[4]}px; border-radius: ${tokens.radius.sm}px; font-size: .9375rem; line-height: 1.5; }
.${scope}__note svg { flex: 0 0 auto; margin-top: 1px; }
.${scope}__note--time { background: #EAF0FC; color: #1E3A8A; }
.${scope}__note--warn { background: #FEF3C7; color: #78350F; }

.${scope}__actions { display: flex; flex-direction: column; gap: ${tokens.space[3]}px; margin-top: ${tokens.space[6]}px; }
.${scope}__cta, .${scope}__sec { display: inline-flex; align-items: center; justify-content: center; gap: ${tokens.space[2]}px; padding: ${tokens.space[4]}px ${tokens.space[6]}px; border-radius: ${tokens.radius.md}px; font-family: ${fontFamily.heading}; font-size: 1.0625rem; font-weight: 600; line-height: 1.2; text-decoration: none; }
.${scope}__cta { background: ${tokens.color.primary}; color: #fff; }
.${scope}__sec { background: transparent; color: ${tokens.color.primary}; border: 1px solid ${tokens.color.primary}; }
.${scope}__foot { margin: ${tokens.space[5]}px 0 0; font-size: .8125rem; line-height: 1.6; color: #64748B; }

@media (min-width: ${breakpoints.tablet}px) {
  .${scope}__inner { padding: ${tokens.space[9]}px ${tokens.space[6]}px; }
  .${scope}__tiles { grid-template-columns: repeat(3, minmax(0,1fr)); }
  .${scope}__split { grid-template-columns: repeat(2, minmax(0,1fr)); }
  .${scope}__notes { grid-template-columns: repeat(2, minmax(0,1fr)); }
  .${scope}__actions { flex-direction: row; }
}
`

    return (
        <section aria-labelledby={headingId} className={scope} style={style}>
            <style dangerouslySetInnerHTML={styleHtml(css)} />
            <div className={`${scope}__inner`}>
                <p className={`${scope}__eyebrow`}>{eyebrow}</p>
                <h2 id={headingId} className={`${scope}__h2`} style={balancedText}>{heading}</h2>
                <p className={`${scope}__sub`} style={balancedText}>
                    <strong>{subline}</strong> Und den Antrag müssen Sie nicht selbst stellen – das übernehmen wir.
                </p>

                <ul className={`${scope}__tiles`}>
                    {kacheln.map((k) => (
                        <li key={k.titel} className={`${scope}__tile`}>
                            <span className={`${scope}__satz`}>{k.satz}</span>
                            <span className={`${scope}__tt`}>{k.titel}</span>
                            <span className={`${scope}__tx`}>{k.text}</span>
                        </li>
                    ))}
                </ul>

                <div className={`${scope}__split`}>
                    <div className={`${scope}__card`}>
                        <h3 className={`${scope}__ct`}>Beispielrechnung</h3>
                        <p className={`${scope}__cs`}>Kosten {euro(beispielKosten)}, alte Ölheizung, Haus selbst bewohnt</p>
                        {beispiele.map((b) => (
                            <div key={b.label} className={`${scope}__row`}>
                                <span className={`${scope}__rl`}>{b.label}</span>
                                <div className={`${scope}__bar`} aria-hidden="true">
                                    <span style={{ width: `${(b.zuschuss / beispielKosten) * 100}%` }} />
                                </div>
                                <div className={`${scope}__nums`}>
                                    <span><b>{euro(b.zuschuss)}</b> Zuschuss</span>
                                    <span>Eigenanteil {euro(b.eigen)}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className={`${scope}__service`}>
                        <span className={`${scope}__badge`}>Full-Service</span>
                        <h3>Wir kümmern uns um den Antrag.</h3>
                        <ol className={`${scope}__steps`}>
                            {service.map((s, i) => (
                                <li key={s.titel} className={`${scope}__step`}>
                                    <span className={`${scope}__num`}>{i + 1}</span>
                                    <span>
                                        <span className={`${scope}__st`}>{s.titel}</span>
                                        <span className={`${scope}__sx`}>{s.text}</span>
                                    </span>
                                </li>
                            ))}
                        </ol>
                    </div>
                </div>

                <div className={`${scope}__notes`}>
                    <p className={`${scope}__note ${scope}__note--time`}><CalIcon /> <span>{stichtag}</span></p>
                    <p className={`${scope}__note ${scope}__note--warn`}><AlertIcon /> <span>Der Antrag muss gestellt sein, bevor die Arbeiten beginnen. Im Planungstermin sagen wir Ihnen, wann und wie – und reichen ihn für Sie ein.</span></p>
                </div>

                <div className={`${scope}__actions`}>
                    <a className={`${scope}__cta`} href={ctaLink} onClick={() => trackCta("foerderung" as any)}>{ctaLabel}</a>
                    <a className={`${scope}__sec`} href={terminLink} onClick={() => trackCta("foerderung_termin" as any)}>{terminLabel}</a>
                </div>

                <p className={`${scope}__foot`}>{fussnote}</p>
            </div>
        </section>
    )
}

const euro = (n: number) => Math.round(n).toLocaleString("de-DE") + " €"

function CalIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 11h18" />
        </svg>
    )
}

function AlertIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="9" /><path d="M12 7v6M12 16.5h.01" />
        </svg>
    )
}

interface FoerderungProps {
    eyebrow: string
    heading: string
    subline: string
    grund: number
    klima: number
    einkommenVon: number
    einkommenBis: number
    maxProzent: number
    maxKosten: number
    beispielKosten: number
    stichtag: string
    fussnote: string
    ctaLabel: string
    ctaLink: string
    terminLabel: string
    terminLink: string
    style?: CSSProperties
}

const num = (title: string, defaultValue: number, max = 100) =>
    ({ type: ControlType.Number, title, defaultValue, min: 0, max, step: 1, displayStepper: false }) as const

addPropertyControls(Foerderung, {
    eyebrow: { type: ControlType.String, title: "Dachzeile", defaultValue: "Förderung 2026" },
    heading: { type: ControlType.String, title: "H2", displayTextArea: true, defaultValue: "Bis zu 22.400 € Zuschuss für Ihre neue Heizung" },
    subline: { type: ControlType.String, title: "Subline", displayTextArea: true, defaultValue: "30 % Grundförderung gibt es nur noch 2026. Danach sinkt sie deutlich." },
    grund: num("Grundförderung %", 30),
    klima: num("Klimabonus %", 16),
    einkommenVon: num("Einkommensbonus von %", 10),
    einkommenBis: num("Einkommensbonus bis %", 40),
    maxProzent: num("Höchstsatz %", 80),
    maxKosten: num("Max. förderf. Kosten €", 28000, 200000),
    beispielKosten: num("Beispiel Kosten €", 30000, 200000),
    stichtag: { type: ControlType.String, title: "Stichtag-Zeile", displayTextArea: true, defaultValue: "Ab 2027 sinkt die Grundförderung auf 15 %, der Klimabonus halbjährlich. Wer 2026 plant, sichert sich die höheren Sätze." },
    fussnote: { type: ControlType.String, title: "Fußnote", displayTextArea: true, defaultValue: "KfW-Heizungsförderung, Stand 21.07.2026. Höchstens 80 %, gerechnet auf max. 28.000 € förderfähige Kosten. Ob Sie die Boni erhalten, prüfen wir im Planungstermin." },
    ctaLabel: { type: ControlType.String, title: "CTA-Text", defaultValue: "Preis berechnen" },
    ctaLink: { type: ControlType.Link, title: "CTA-Ziel", defaultValue: "/waermepumpe/preis" },
    terminLabel: { type: ControlType.String, title: "Termin-Text", defaultValue: "Direkt Planungstermin vereinbaren" },
    terminLink: { type: ControlType.Link, title: "Termin-Ziel", defaultValue: "/waermepumpe/termin" },
})
