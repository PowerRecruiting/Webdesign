import { addPropertyControls, ControlType, RenderTarget } from "framer"
import { useEffect, useState, startTransition, type CSSProperties } from "react"

interface CookieHinweisProps {
    text: string
    datenschutzLink: string
    accent: string
    ink: string
    style?: CSSProperties
}

const KEY = "pr-cookie-consent"

/**
 * Cookie-Hinweis (DSGVO)
 *
 * @framerIntrinsicWidth 560
 * @framerIntrinsicHeight 150
 *
 * @framerSupportedLayoutWidth any-prefer-fixed
 * @framerSupportedLayoutHeight auto
 */
export default function CookieHinweis(props: CookieHinweisProps) {
    const { text = "", datenschutzLink = "/datenschutz", accent = "#12A150", ink = "#0E1726" } = props
    const onCanvas = RenderTarget.current() === RenderTarget.canvas
    const [show, setShow] = useState(false)

    useEffect(() => {
        if (typeof window === "undefined" || onCanvas) return // im Editor ausgeblendet, damit er nichts verdeckt
        let stored: string | null = null
        try { stored = window.localStorage.getItem(KEY) } catch (e) {}
        if (!stored) startTransition(() => setShow(true))
    }, [])

    function decide(value: "alle" | "notwendig") {
        try {
            window.localStorage.setItem(KEY, value)
            window.dispatchEvent(new CustomEvent("cookie-consent", { detail: value }))
        } catch (e) {}
        startTransition(() => setShow(false))
    }

    if (!show || RenderTarget.current() === RenderTarget.thumbnail) return null

    const base: CSSProperties = { flex: 1, minWidth: 140, padding: "12px 16px", borderRadius: 10, fontFamily: "inherit", fontSize: 14, fontWeight: 650, cursor: "pointer" }

    return (
        <div role="dialog" aria-live="polite" aria-label="Cookie-Hinweis" style={{ ...props.style, position: "relative", boxSizing: "border-box", width: "100%", background: "#fff", color: ink, borderRadius: 16, padding: 20, boxShadow: "0 20px 50px -20px rgba(14,23,38,0.35), 0 0 0 1px rgba(14,23,38,0.08)", display: "flex", flexDirection: "column", gap: 14, fontFamily: "Inter, system-ui, sans-serif" }}>
            <span style={{ fontSize: 14, lineHeight: 1.55 }}>
                {text} <a href={datenschutzLink} style={{ color: ink, fontWeight: 600 }}>Datenschutz</a>
            </span>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <button onClick={() => decide("notwendig")} style={{ ...base, background: "#fff", color: ink, border: "1.5px solid rgba(14,23,38,0.2)" }}>Nur notwendige</button>
                <button onClick={() => decide("alle")} style={{ ...base, background: accent, color: "#fff", border: `1.5px solid ${accent}` }}>Alle akzeptieren</button>
            </div>
        </div>
    )
}

addPropertyControls(CookieHinweis, {
    text: {
        type: ControlType.String,
        title: "Text",
        displayTextArea: true,
        defaultValue: "Wir nutzen technisch notwendige Cookies. Statistik- und Marketing-Cookies (z. B. Meta-Pixel) setzen wir nur mit deiner Zustimmung.",
    },
    datenschutzLink: { type: ControlType.Link, title: "Datenschutz", defaultValue: "/datenschutz" },
    accent: { type: ControlType.Color, title: "Akzent", defaultValue: "#12A150" },
    ink: { type: ControlType.Color, title: "Text", defaultValue: "#0E1726" },
})
