import { addPropertyControls, ControlType } from "framer"
import { useId } from "react"
import type { CSSProperties } from "react"
import { balancedText, breakpoints, fontFamily, styleHtml, tokens } from "https://framer.com/m/tokens-x6g0t9.js@tWKhZJ2SyC5SsFax1CzI"
import { trackCall, trackCta, withQuery } from "https://framer.com/m/tracking-JmBWDZ.js@lcHsNL6PUwr6EaepsGIe"

/* Standardinhalte der Listen (auch als defaultValue der Eigenschaften) */
const D_WPHERO_BULLETS = [
            { text: "Förderantrag übernehmen wir" },
            { text: "Preis sofort – ohne Kontaktdaten" },
            { text: "Eigene Monteure, keine Subunternehmer" },
            { text: "Planung durch den Meister vor Ort" },
        ]

/**
 * Hero der Wärmepumpen-Seite. Die erste Funnel-Frage („Bestand oder
 * Neubau?“) steht direkt im Hero – ein Klick startet den Rechner auf
 * /waermepumpe/preis mit bereits beantworteter Frage 1 (?bauart=…).
 *
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight auto
 */
export default function WpHero(props: WpHeroProps) {
    const {
        badge = "Förderung bis 80 % · Antrag übernehmen wir",
        heading = "Wärmepumpe vom Meisterbetrieb aus Wörrstadt – bis zu 80 % gefördert",
        subheading = "Preis und Heizlast in zwei Minuten online, Planung persönlich vor Ort. Den Förderantrag stellen wir für Sie.",
        frage = "Bitte wählen: Ihre Wärmepumpe ist für …",
        funnelLink = "/waermepumpe/preis",
        bullets: bulletsIn = D_WPHERO_BULLETS,
        image = DEFAULT_IMAGE,
        phoneLabel = "06732 600 7358",
        phoneNumber = "+4967326007358",
        style,
    } = props
    const bullets = Array.isArray(bulletsIn) && bulletsIn.length ? bulletsIn : D_WPHERO_BULLETS

    const headingId = useId()
    const scope = `ed-wph-${headingId.replace(/[^a-zA-Z0-9-]/g, "")}`
    const ziel = (bauart: string) => `${funnelLink}${funnelLink.includes("?") ? "&" : "?"}bauart=${bauart}`
    const klick = (bauart: string) => (e: { preventDefault(): void }) => {
        trackCta("hero", { bauart })
        const url = withQuery(ziel(bauart))
        if (typeof window !== "undefined" && url !== ziel(bauart)) {
            e.preventDefault()
            window.location.href = url
        }
    }

    const css = `
.${scope} { width: 100%; background: linear-gradient(180deg, ${tokens.color.surfaceAlt} 0%, #fff 100%); font-family: ${fontFamily.body}; color: ${tokens.color.textMuted}; }
.${scope} *, .${scope} *::before, .${scope} *::after { box-sizing: border-box; }
.${scope}__inner { width: 100%; max-width: ${tokens.maxWidth}px; margin: 0 auto; padding: ${tokens.space[7]}px ${tokens.space[4]}px ${tokens.space[8]}px;
  display: grid; grid-template-columns: minmax(0,1fr); gap: ${tokens.space[7]}px; align-items: center; }
.${scope}__badge { display: inline-flex; padding: 6px 12px; border-radius: 999px; background: ${tokens.color.primary}; color: #fff; font-size: .875rem; line-height: 1.3; font-weight: 700; letter-spacing: .02em; }
.${scope}__h1 { margin: ${tokens.space[4]}px 0 0; font-family: ${fontFamily.heading}; font-size: clamp(1.875rem, 7.6vw, 2.25rem); font-weight: 700; line-height: 1.12; overflow-wrap: break-word; letter-spacing: -0.02em; color: ${tokens.color.text}; }
.${scope}__sub { margin: ${tokens.space[4]}px 0 0; max-width: 54ch; font-size: ${tokens.font.body}; line-height: 1.55; }
.${scope}__frage { margin-top: ${tokens.space[6]}px; padding: ${tokens.space[5]}px; border-radius: ${tokens.radius.md}px; background: #fff; border: 1px solid ${tokens.color.line}; box-shadow: 0 18px 40px -24px rgba(15,23,42,.35); }
.${scope}__fl { margin: 0 0 ${tokens.space[3]}px; font-size: 1rem; font-weight: 600; color: ${tokens.color.text}; }
.${scope}__btns { display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: ${tokens.space[3]}px; }
.${scope}__btn { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; min-height: 96px; padding: 12px 10px; line-height: 1.25;
  border-radius: ${tokens.radius.sm + 2}px; border: 2px solid ${tokens.color.line}; background: ${tokens.color.surfaceAlt}; color: ${tokens.color.text};
  font-family: ${fontFamily.heading}; font-size: 1.0625rem; font-weight: 700; text-decoration: none; text-align: center; transition: border-color .15s, transform .15s, background .15s; }
.${scope}__btn:hover { border-color: ${tokens.color.primary}; background: #fff; transform: translateY(-2px); }
.${scope}__btn svg { color: ${tokens.color.primary}; }
.${scope}__list { display: grid; grid-template-columns: minmax(0,1fr); gap: 8px 20px; margin: ${tokens.space[5]}px 0 0; padding: 0; list-style: none; }
.${scope}__list li { display: flex; gap: 8px; align-items: flex-start; font-size: 1rem; line-height: 1.4; font-weight: 500; color: ${tokens.color.text}; }
.${scope}__list svg { flex: 0 0 auto; margin-top: 2px; color: ${tokens.color.success}; }
.${scope}__tel { display: inline-flex; margin-top: ${tokens.space[4]}px; font-size: .9375rem; color: ${tokens.color.textMuted}; }
.${scope}__tel a { margin-left: 6px; color: ${tokens.color.primary}; font-weight: 600; text-decoration: none; font-variant-numeric: tabular-nums; }
.${scope}__media { position: relative; }
.${scope}__img { display: block; width: 100%; aspect-ratio: 16 / 10; object-fit: cover; border-radius: ${tokens.radius.lg}px; }
.${scope}__float { position: absolute; display: flex; align-items: center; gap: 10px; padding: 10px 14px; border-radius: 12px; background: #fff;
  box-shadow: 0 14px 30px -12px rgba(15,23,42,.35); font-size: .8125rem; line-height: 1.3; color: ${tokens.color.textMuted}; }
.${scope}__float b { display: block; font-family: ${fontFamily.heading}; font-size: .9375rem; color: ${tokens.color.text}; }
.${scope}__float i { width: 34px; height: 34px; flex: 0 0 34px; border-radius: 9px; display: inline-flex; align-items: center; justify-content: center; background: #EAF0FC; color: ${tokens.color.primary}; font-style: normal; font-weight: 800; }
.${scope}__f1 { top: 12px; left: 12px; }
.${scope}__f2 { top: 42%; right: 12px; }
.${scope}__f3 { bottom: 16px; left: 16px; }
@media (min-width: ${breakpoints.tablet}px) {
  .${scope}__inner { padding: ${tokens.space[8]}px ${tokens.space[6]}px ${tokens.space[9]}px; }
  .${scope}__h1 { font-size: ${tokens.font.h1}; line-height: 1.08; }
  .${scope}__list { grid-template-columns: repeat(2, minmax(0,1fr)); }
}
@media (min-width: ${breakpoints.desktop}px) {
  .${scope}__inner { grid-template-columns: minmax(0,1.08fr) minmax(0,1fr); gap: ${tokens.space[8]}px; }
  .${scope}__img { aspect-ratio: 4 / 3.4; }
  .${scope}__f1 { top: 16px; left: -28px; } .${scope}__f2 { right: -28px; }
}
@media (max-width: 480px) { .${scope}__float { display: none; } .${scope}__f1 { display: flex; } }
`

    return (
        <section lang="de" aria-labelledby={headingId} className={scope} style={style}>
            <style dangerouslySetInnerHTML={styleHtml(css)} />
            <div className={`${scope}__inner`}>
                <div>
                    <span className={`${scope}__badge`}>{badge}</span>
                    <h1 id={headingId} className={`${scope}__h1`} style={balancedText}>{heading}</h1>
                    <p className={`${scope}__sub`} style={balancedText}>{subheading}</p>

                    <div className={`${scope}__frage`}>
                        <p className={`${scope}__fl`}>{frage}</p>
                        <div className={`${scope}__btns`}>
                            <a className={`${scope}__btn`} href={ziel("bestand")} onClick={klick("bestand")}>
                                <HouseIcon /> ein Bestandsgebäude
                            </a>
                            <a className={`${scope}__btn`} href={ziel("neubau")} onClick={klick("neubau")}>
                                <CraneIcon /> einen Neubau
                            </a>
                        </div>
                    </div>

                    <ul className={`${scope}__list`}>
                        {bullets.map((b, i) => (
                            <li key={i}><Check /> {b.text}</li>
                        ))}
                    </ul>
                    <span className={`${scope}__tel`}>
                        Lieber direkt sprechen?
                        <a href={`tel:${phoneNumber}`} onClick={() => trackCall("hero")}>{phoneLabel}</a>
                    </span>
                </div>

                <div className={`${scope}__media`}>
                    <img className={`${scope}__img`} src={image?.src} srcSet={image?.srcSet} alt={image?.alt ?? ""} {...({ fetchpriority: "high" } as Record<string, string>)} />
                    <div className={`${scope}__float ${scope}__f1`}><i>%</i><span><b>Bis zu 80 % Zuschuss</b>Antrag übernehmen wir</span></div>
                    <div className={`${scope}__float ${scope}__f2`}><i>M</i><span><b>Meisterbetrieb</b>aus Wörrstadt</span></div>
                    <div className={`${scope}__float ${scope}__f3`}><i>★</i><span><b>4,6 auf Google</b>zufriedene Kunden</span></div>
                </div>
            </div>
        </section>
    )
}

const DEFAULT_IMAGE = {
    src: "https://framerusercontent.com/images/mOu31CdRZWiA3c0AL5WnXW8tWU.jpg",
    alt: "Monteure von ED Elektro tragen ein Außengerät zum Aufstellort",
}

const Check = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12" /></svg>
)
const HouseIcon = () => (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 9.5 12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z" /><polyline points="9 21 9 13 15 13 15 21" /></svg>
)
const CraneIcon = () => (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 21V4h2v17M4 21h8M8 5h12l-3 3M8 5l4 3" /><path d="M17 8v5" /><rect x="15.5" y="13" width="3" height="3" /></svg>
)

interface WpHeroProps {
    badge: string
    heading: string
    subheading: string
    frage: string
    funnelLink: string
    bullets: { text: string }[]
    image: { src: string; srcSet?: string; alt?: string }
    phoneLabel: string
    phoneNumber: string
    style?: CSSProperties
}

addPropertyControls(WpHero, {
    badge: { type: ControlType.String, title: "Badge", defaultValue: "Förderung bis 80 % · Antrag übernehmen wir" },
    heading: { type: ControlType.String, title: "H1", displayTextArea: true, defaultValue: "Wärmepumpe vom Meisterbetrieb aus Wörrstadt – bis zu 80 % gefördert" },
    subheading: { type: ControlType.String, title: "Unterzeile", displayTextArea: true, defaultValue: "Preis und Heizlast in zwei Minuten online, Planung persönlich vor Ort. Den Förderantrag stellen wir für Sie." },
    frage: { type: ControlType.String, title: "Frage", defaultValue: "Bitte wählen: Ihre Wärmepumpe ist für …" },
    funnelLink: { type: ControlType.Link, title: "Funnel", defaultValue: "/waermepumpe/preis" },
    bullets: {
        type: ControlType.Array, defaultValue: D_WPHERO_BULLETS, title: "Häkchen", maxCount: 4,
        control: { type: ControlType.Object, controls: { text: { type: ControlType.String, title: "Text" } } },
    },
    image: { type: ControlType.ResponsiveImage, title: "Bild" },
    phoneLabel: { type: ControlType.String, title: "Telefon sichtbar", defaultValue: "06732 600 7358" },
    phoneNumber: { type: ControlType.String, title: "Telefon tel:", defaultValue: "+4967326007358" },
})
