import { addPropertyControls, ControlType } from "framer"
import { useRef, type CSSProperties } from "react"

interface Anzeige {
    betrieb: string
    gewerk: string
    format: string
    hook: string
    video?: string
    bild?: { src: string; alt?: string }
}

interface AnzeigenGalerieProps {
    anzeigen: Anzeige[]
    accent: string
    ink: string
    style?: CSSProperties
}

const VERLAEUFE = [
    "linear-gradient(160deg, #1B2B45 0%, #2E4A6E 55%, #E9B949 140%)",
    "linear-gradient(160deg, #13322A 0%, #1F5C48 60%, #9BD3A7 140%)",
    "linear-gradient(160deg, #2B2333 0%, #57406A 60%, #F0A37A 140%)",
    "linear-gradient(160deg, #1E2A2F 0%, #3A545E 60%, #A9D4E0 140%)",
]

/**
 * Anzeigen-Galerie (Smartphone-Mockups)
 *
 * @framerIntrinsicWidth 1100
 * @framerIntrinsicHeight 560
 *
 * @framerSupportedLayoutWidth any-prefer-fixed
 * @framerSupportedLayoutHeight auto
 */
export default function AnzeigenGalerie(props: AnzeigenGalerieProps) {
    const { anzeigen = [], accent = "#12A150", ink = "#0E1726" } = props
    const ref = useRef<HTMLDivElement>(null)
    const scroll = (dir: number) => {
        const el = ref.current
        if (el) el.scrollBy({ left: dir * 260, behavior: "smooth" })
    }
    const btn: CSSProperties = { width: 44, height: 44, borderRadius: 22, border: "1px solid rgba(14,23,38,0.15)", background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }

    return (
        <div style={{ ...props.style, position: "relative", width: "100%", fontFamily: "Inter, system-ui, sans-serif", display: "flex", flexDirection: "column", gap: 20 }}>
            <div ref={ref} role="list" aria-label="Beispiel-Anzeigen" style={{ display: "flex", gap: 20, overflowX: "auto", scrollSnapType: "x mandatory", padding: "8px 4px 24px", scrollbarWidth: "none" as any }}>
                {anzeigen.map((a, i) => (
                    <div key={i} role="listitem" style={{ flex: "0 0 240px", scrollSnapAlign: "start" }}>
                        <div style={{ width: 240, height: 480, borderRadius: 36, background: "#0A0F18", padding: 9, boxSizing: "border-box", boxShadow: "0 30px 60px -30px rgba(14,23,38,0.5)" }}>
                            <div style={{ position: "relative", width: "100%", height: "100%", borderRadius: 28, overflow: "hidden", background: a.bild?.src ? `url(${a.bild.src}) center/cover` : VERLAEUFE[i % VERLAEUFE.length] }}>
                                {a.video && <video src={a.video} autoPlay muted loop playsInline style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />}
                                <div style={{ position: "absolute", top: 10, left: "50%", transform: "translateX(-50%)", width: 70, height: 20, borderRadius: 10, background: "#0A0F18" }} />
                                <div style={{ position: "absolute", top: 40, left: 12, right: 12, display: "flex", gap: 4 }}>
                                    {[0, 1, 2].map((s) => <span key={s} style={{ flex: 1, height: 2.5, borderRadius: 2, background: s === 0 ? "#fff" : "rgba(255,255,255,0.4)" }} />)}
                                </div>
                                <div style={{ position: "absolute", top: 54, left: 12, right: 12, display: "flex", alignItems: "center", gap: 8 }}>
                                    <span style={{ width: 28, height: 28, borderRadius: 14, background: "#fff", color: ink, fontSize: 8, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>LOGO</span>
                                    <span style={{ display: "flex", flexDirection: "column" }}>
                                        <span style={{ color: "#fff", fontSize: 12, fontWeight: 700 }}>{a.betrieb}</span>
                                        <span style={{ color: "rgba(255,255,255,0.75)", fontSize: 10 }}>Gesponsert · {a.format}</span>
                                    </span>
                                </div>
                                {!a.video && !a.bild?.src && (
                                    <div style={{ position: "absolute", top: "40%", left: "50%", transform: "translate(-50%,-50%)", width: 56, height: 56, borderRadius: 28, background: "rgba(255,255,255,0.18)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z" fill="#fff" /></svg>
                                    </div>
                                )}
                                <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "60px 14px 16px", background: "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.75) 100%)", display: "flex", flexDirection: "column", gap: 10 }}>
                                    <span style={{ alignSelf: "flex-start", fontSize: 10, fontWeight: 800, color: "#fff", background: accent, borderRadius: 20, padding: "3px 8px" }}>{a.gewerk}</span>
                                    <span style={{ color: "#fff", fontSize: 15, fontWeight: 750, lineHeight: 1.3 }}>{a.hook}</span>
                                    <span style={{ background: "#fff", color: ink, borderRadius: 10, padding: "9px 10px", fontSize: 12, fontWeight: 750, textAlign: "center" }}>Jetzt Check starten</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                <button aria-label="Zurück" style={btn} onClick={() => scroll(-1)}><svg width="18" height="18" viewBox="0 0 24 24"><path d="M15 6l-6 6 6 6" fill="none" stroke={ink} strokeWidth="2" strokeLinecap="round" /></svg></button>
                <button aria-label="Weiter" style={{ ...btn, background: ink, border: "none" }} onClick={() => scroll(1)}><svg width="18" height="18" viewBox="0 0 24 24"><path d="M9 6l6 6-6 6" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" /></svg></button>
            </div>
        </div>
    )
}

addPropertyControls(AnzeigenGalerie, {
    anzeigen: {
        type: ControlType.Array,
        title: "Anzeigen",
        control: {
            type: ControlType.Object,
            controls: {
                betrieb: { type: ControlType.String, title: "Betrieb", defaultValue: "[Kundenbetrieb]" },
                gewerk: { type: ControlType.String, title: "Gewerk", defaultValue: "Photovoltaik" },
                format: { type: ControlType.Enum, title: "Format", options: ["Reel", "Story"], defaultValue: "Reel" },
                hook: { type: ControlType.String, title: "Hook", defaultValue: "[Hook-Text der Anzeige]", displayTextArea: true },
                video: { type: ControlType.File, title: "Video", allowedFileTypes: ["mp4", "webm", "mov"] },
                bild: { type: ControlType.ResponsiveImage, title: "Bild" },
            },
        },
        defaultValue: [
            { betrieb: "[Kundenbetrieb A]", gewerk: "Photovoltaik", format: "Reel", hook: "[Hook: z. B. Meister erklärt das Dach eines Kunden]" },
            { betrieb: "[Kundenbetrieb B]", gewerk: "Wärmepumpe", format: "Story", hook: "[Hook: z. B. Was eine Wärmepumpe im Altbau wirklich braucht]" },
            { betrieb: "[Kundenbetrieb C]", gewerk: "Elektro", format: "Reel", hook: "[Hook: z. B. Zählerschrank-Check in 60 Sekunden]" },
            { betrieb: "[Kundenbetrieb D]", gewerk: "SHK", format: "Story", hook: "[Hook: z. B. Heizungstausch – so läuft es bei uns ab]" },
            { betrieb: "[Kundenbetrieb E]", gewerk: "PV + Speicher", format: "Reel", hook: "[Hook: z. B. Kundenstimme nach Inbetriebnahme]" },
        ],
        maxCount: 12,
    },
    accent: { type: ControlType.Color, title: "Akzent", defaultValue: "#12A150" },
    ink: { type: ControlType.Color, title: "Text", defaultValue: "#0E1726" },
})
