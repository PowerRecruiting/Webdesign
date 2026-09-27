import { addPropertyControls, ControlType } from "framer"
import type { CSSProperties } from "react"
import { fontFamily, tokens } from "https://framer.com/m/tokens-vFs3oF.js@LkJ7KpTJkNFoJ7Db3uCY"
import { trackCall, trackCta } from "https://framer.com/m/tracking-6HWM39.js@5o3KZaWoIh1vMarQCwOl"

/**
 * Mobiler Sticky-Button (Briefing Landingpage Wärmepumpe): „Preis berechnen“
 * plus Telefon-Icon, fest am unteren Bildschirmrand. Ab Tablet-Breite
 * ausgeblendet – per CSS, damit kein Layout-Shift nach der Hydration entsteht.
 *
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight auto
 * @framerIntrinsicWidth 390
 * @framerIntrinsicHeight 76
 */
export default function StickyMobileCta(props: StickyProps) {
    const { label = "Preis berechnen", link = "/waermepumpe/preis", phoneNumber = "+4967326007358", style } = props

    const css = `
.ed-sticky { position: fixed; left: 0; right: 0; bottom: 0; z-index: 50; display: flex; gap: 10px;
  padding: 10px 16px calc(10px + env(safe-area-inset-bottom)); background: rgba(255,255,255,.96);
  border-top: 1px solid ${tokens.color.line}; box-shadow: 0 -8px 24px rgba(15,23,42,.08); font-family: ${fontFamily.heading}; }
.ed-sticky__cta { flex: 1 1 auto; display: inline-flex; align-items: center; justify-content: center; height: 52px;
  border-radius: ${tokens.radius.md}px; background: ${tokens.color.primary}; color: #fff; font-size: 1.0625rem; font-weight: 600; text-decoration: none; }
.ed-sticky__tel { flex: 0 0 52px; height: 52px; display: inline-flex; align-items: center; justify-content: center;
  border-radius: ${tokens.radius.md}px; border: 1px solid ${tokens.color.line}; color: ${tokens.color.primary}; background: #fff; }
.ed-sticky-spacer { height: 76px; }
@media (min-width: 768px) { .ed-sticky, .ed-sticky-spacer { display: none; } }
`
    return (
        <div style={style}>
            <style dangerouslySetInnerHTML={{ __html: css }} />
            <div className="ed-sticky-spacer" aria-hidden="true" />
            <div className="ed-sticky">
                <a className="ed-sticky__cta" href={link} onClick={() => trackCta("sticky_mobile" as any)}>{label}</a>
                <a className="ed-sticky__tel" href={`tel:${phoneNumber}`} aria-label="Anrufen" onClick={() => trackCall("sticky_mobile")}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M6.6 3.6l2.6.5 1.3 3.3-1.9 1.5a11 11 0 0 0 6 6l1.5-1.9 3.3 1.3.5 2.6a1.8 1.8 0 0 1-1.9 2.1C10.9 18.4 5.6 13.1 5 6.5a1.8 1.8 0 0 1 1.6-2.9z" />
                    </svg>
                </a>
            </div>
        </div>
    )
}

interface StickyProps {
    label: string
    link: string
    phoneNumber: string
    style?: CSSProperties
}

addPropertyControls(StickyMobileCta, {
    label: { type: ControlType.String, title: "Text", defaultValue: "Preis berechnen" },
    link: { type: ControlType.Link, title: "Ziel", defaultValue: "/waermepumpe/preis" },
    phoneNumber: { type: ControlType.String, title: "Nummer für tel:", defaultValue: "+4967326007358" },
})
