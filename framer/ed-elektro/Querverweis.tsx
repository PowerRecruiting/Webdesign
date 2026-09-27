import { addPropertyControls, ControlType } from "framer"
import type { CSSProperties } from "react"
import { fontFamily, tokens } from "https://framer.com/m/tokens-vFs3oF.js@LkJ7KpTJkNFoJ7Db3uCY"
import { trackCta } from "https://framer.com/m/tracking-6HWM39.js@5o3KZaWoIh1vMarQCwOl"

/**
 * Schmaler Querverweis zwischen den Themen-Oberseiten Klima ↔ Wärmepumpe.
 * Fängt Besucher ab, die auf der falschen Seite gelandet sind.
 *
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight auto
 */
export default function Querverweis(props: QuerProps) {
    const {
        frage = "Sie wollen Ihre Heizung komplett ersetzen?",
        text = "Dann ist eine Wärmepumpe meist die bessere Wahl – den Förderantrag übernehmen wir.",
        linkLabel = "Zur Wärmepumpe",
        link = "/waermepumpe",
        style,
    } = props

    const css = `
.ed-quer { width: 100%; font-family: ${fontFamily.body}; }
.ed-quer *, .ed-quer *::before, .ed-quer *::after { box-sizing: border-box; }
.ed-quer__inner { width: 100%; max-width: ${tokens.maxWidth}px; margin: 0 auto; padding: ${tokens.space[5]}px ${tokens.space[4]}px; }
.ed-quer__box { display: flex; flex-direction: column; gap: ${tokens.space[3]}px; padding: ${tokens.space[5]}px;
  border-radius: ${tokens.radius.md}px; background: #EAF0FC; border: 1px solid #C7D8F7; color: #1E3A8A; }
.ed-quer__f { margin: 0; font-family: ${fontFamily.heading}; font-size: 1.125rem; font-weight: 600; color: ${tokens.color.text}; }
.ed-quer__t { margin: 2px 0 0; font-size: .9875rem; line-height: 1.5; color: #334155; }
.ed-quer__a { align-self: flex-start; display: inline-flex; align-items: center; gap: 8px; padding: 12px 20px; border-radius: ${tokens.radius.md}px;
  background: ${tokens.color.primary}; color: #fff; font-family: ${fontFamily.heading}; font-size: 1rem; font-weight: 600; text-decoration: none; white-space: nowrap; }
@media (min-width: 768px) {
  .ed-quer__inner { padding: ${tokens.space[6]}px ${tokens.space[6]}px; }
  .ed-quer__box { flex-direction: row; align-items: center; justify-content: space-between; gap: ${tokens.space[6]}px; padding: ${tokens.space[5]}px ${tokens.space[6]}px; }
  .ed-quer__a { align-self: center; }
}
`
    return (
        <aside className="ed-quer" style={style}>
            <style dangerouslySetInnerHTML={{ __html: css }} />
            <div className="ed-quer__inner">
                <div className="ed-quer__box">
                    <div>
                        <p className="ed-quer__f">{frage}</p>
                        <p className="ed-quer__t">{text}</p>
                    </div>
                    <a className="ed-quer__a" href={link} onClick={() => trackCta("querverweis" as any, { ziel: link })}>
                        {linkLabel}
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                    </a>
                </div>
            </div>
        </aside>
    )
}

interface QuerProps {
    frage: string
    text: string
    linkLabel: string
    link: string
    style?: CSSProperties
}

addPropertyControls(Querverweis, {
    frage: { type: ControlType.String, title: "Frage", defaultValue: "Sie wollen Ihre Heizung komplett ersetzen?" },
    text: { type: ControlType.String, title: "Text", displayTextArea: true, defaultValue: "Dann ist eine Wärmepumpe meist die bessere Wahl – den Förderantrag übernehmen wir." },
    linkLabel: { type: ControlType.String, title: "Link-Text", defaultValue: "Zur Wärmepumpe" },
    link: { type: ControlType.Link, title: "Ziel", defaultValue: "/waermepumpe" },
})
