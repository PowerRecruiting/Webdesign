import { addPropertyControls, ControlType } from "framer"
import { useState, startTransition, type CSSProperties } from "react"

interface SelbstTestProps {
    accent: string
    ink: string
    surface: string
    funnelLink: string
    style?: CSSProperties
}

interface Kanal {
    id: string
    label: string
    kurz: string
    fazit: string
    pro: string[]
    contra: string[]
    cta: string
}

const KANAELE: Kanal[] = [
    {
        id: "empfehlungen",
        label: "Empfehlungen",
        kurz: "Zufriedene Kunden erzählen weiter.",
        fazit: "Die beste Anfrage, die es gibt – aber du kannst sie nicht bestellen.",
        pro: ["Hohes Vertrauen, kurze Entscheidungswege", "Kaum Preisdiskussion", "Kostet dich nichts außer guter Arbeit"],
        contra: ["Nicht planbar – kommt, wann sie kommt", "Kaum skalierbar, wenn du wachsen willst", "Bleibt meist im bestehenden Umfeld hängen"],
        cta: "Empfehlungen behalten – und planbare Projekte dazunehmen",
    },
    {
        id: "portale",
        label: "Lead-Portale",
        kurz: "Gekaufte Kontakte von Vergleichsportalen.",
        fazit: "Schnell verfügbar, aber du kaufst einen Kontakt, den vier andere auch haben.",
        pro: ["Sofort verfügbar, kein eigener Aufwand", "Kosten pro Kontakt klar kalkulierbar"],
        contra: ["Derselbe Kontakt geht an mehrere Betriebe", "Wettlauf ums schnellste Telefonat und den niedrigsten Preis", "Kein Aufbau deiner eigenen Marke"],
        cta: "Schluss mit geteilten Kontakten – exklusive Projektanfragen prüfen",
    },
    {
        id: "agentur",
        label: "Klassische Marketing-Agentur",
        kurz: "Website, Social Media, Kampagnen nach Stunden.",
        fazit: "Oft gute Optik – aber Klicks und Reichweite sind noch keine Aufträge.",
        pro: ["Professioneller Auftritt", "Du musst dich nicht selbst kümmern"],
        contra: ["Abrechnung nach Leistung, nicht nach Ergebnis", "Kontakte kommen unsortiert – Vorqualifizierung machst du selbst", "Wenig Branchenwissen zu PV, Wärmepumpe, SHK"],
        cta: "Vom Reporting zu echten Vor-Ort-Terminen – Projekt-Check starten",
    },
    {
        id: "website",
        label: "Eigene Website / Google",
        kurz: "Gefunden werden, wenn jemand aktiv sucht.",
        fazit: "Ein solides Fundament – aber Sichtbarkeit aufzubauen dauert und schwankt.",
        pro: ["Anfragen kommen mit echtem Bedarf", "Langfristiger Wert für deine Marke"],
        contra: ["Monate bis zu stabiler Sichtbarkeit", "Abhängig von Rankings und Anzeigenpreisen", "Erreicht nur, wer schon sucht – nicht, wer kurz davor ist"],
        cta: "Deine Website ergänzen – mit Projekten, die du steuern kannst",
    },
]

/**
 * Selbsttest „Wie gewinnst du gerade deine Projekte?"
 *
 * @framerIntrinsicWidth 1000
 * @framerIntrinsicHeight 520
 *
 * @framerSupportedLayoutWidth any-prefer-fixed
 * @framerSupportedLayoutHeight auto
 */
export default function SelbstTest(props: SelbstTestProps) {
    const { accent = "#12A150", ink = "#0E1726", surface = "#F4F5F2", funnelLink = "/projekt-check" } = props
    const [aktiv, setAktiv] = useState<string | null>(null)
    const k = KANAELE.find((x) => x.id === aktiv) || null
    const muted = "rgba(14,23,38,0.6)"
    const line = "rgba(14,23,38,0.12)"
    const warn = "#C0362C"

    const href = `${funnelLink}${funnelLink.includes("?") ? "&" : "?"}pfad=handwerk${k ? `&kanal=${k.id}` : ""}`

    return (
        <div style={{ ...props.style, position: "relative", width: "100%", fontFamily: "Inter, system-ui, sans-serif", color: ink, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20, boxSizing: "border-box" }}>
            <div role="radiogroup" aria-label="Aktueller Kanal" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {KANAELE.map((x, i) => {
                    const on = x.id === aktiv
                    return (
                        <button key={x.id} role="radio" aria-checked={on} onClick={() => startTransition(() => setAktiv(x.id))}
                            style={{ display: "flex", alignItems: "center", gap: 14, textAlign: "left", padding: "18px 18px", borderRadius: 14, cursor: "pointer", fontFamily: "inherit", color: ink,
                                background: on ? "#fff" : "rgba(255,255,255,0.6)", border: `1.5px solid ${on ? accent : line}`, boxShadow: on ? `0 0 0 3px ${hexA(accent, 0.15)}, 0 10px 30px -15px rgba(14,23,38,0.25)` : "none", transition: "all .15s ease" }}>
                            <span style={{ width: 32, height: 32, borderRadius: 16, flex: "0 0 32px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800, background: on ? accent : surface, color: on ? "#fff" : ink, fontVariantNumeric: "tabular-nums" }}>{i + 1}</span>
                            <span style={{ display: "flex", flexDirection: "column", gap: 2, flex: 1 }}>
                                <span style={{ fontSize: 16, fontWeight: 700 }}>{x.label}</span>
                                <span style={{ fontSize: 13.5, color: muted }}>{x.kurz}</span>
                            </span>
                            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6-6 6" fill="none" stroke={on ? accent : muted} strokeWidth="2" strokeLinecap="round" /></svg>
                        </button>
                    )
                })}
            </div>

            <div aria-live="polite" style={{ background: "#fff", border: `1px solid ${line}`, borderRadius: 18, padding: "26px 24px", display: "flex", flexDirection: "column", gap: 18, minHeight: 360 }}>
                {!k ? (
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "flex-start", justifyContent: "center", gap: 10 }}>
                        <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: accent }}>Ehrliche Einordnung</span>
                        <span style={{ fontSize: 22, fontWeight: 750, letterSpacing: "-0.02em", lineHeight: 1.25 }}>Wähle links, woher deine Projekte heute kommen.</span>
                        <span style={{ fontSize: 15, color: muted, lineHeight: 1.55 }}>Du bekommst eine faire Pro-/Contra-Einschätzung – ohne Formular, ohne Daten.</span>
                    </div>
                ) : (
                    <>
                        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: accent }}>{k.label}</span>
                            <span style={{ fontSize: 21, fontWeight: 750, letterSpacing: "-0.02em", lineHeight: 1.3 }}>{k.fazit}</span>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14 }}>
                            <Liste titel="Was gut ist" items={k.pro} farbe={accent} ink={ink} zeichen="+" />
                            <Liste titel="Wo es hakt" items={k.contra} farbe={warn} ink={ink} zeichen="–" />
                        </div>
                        <a href={href} style={{ marginTop: "auto", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, background: ink, color: "#fff", textDecoration: "none", borderRadius: 12, padding: "16px 18px", fontSize: 15, fontWeight: 650, lineHeight: 1.35 }}>
                            <span>{k.cta}</span>
                            <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" style={{ flex: "0 0 20px" }}><path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" /></svg>
                        </a>
                    </>
                )}
            </div>
        </div>
    )
}

function Liste({ titel, items, farbe, ink, zeichen }: { titel: string; items: string[]; farbe: string; ink: string; zeichen: string }) {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: farbe }}>{titel}</span>
            {items.map((t) => (
                <div key={t} style={{ display: "flex", gap: 10, fontSize: 14.5, lineHeight: 1.45, color: ink }}>
                    <span style={{ width: 20, height: 20, borderRadius: 10, flex: "0 0 20px", background: hexA(farbe, 0.12), color: farbe, fontWeight: 800, fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", marginTop: 1 }}>{zeichen}</span>
                    <span>{t}</span>
                </div>
            ))}
        </div>
    )
}

function hexA(color: string, a: number) {
    if (!color) return color
    const m = color.match(/rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)/i)
    if (m) return `rgba(${m[1]}, ${m[2]}, ${m[3]}, ${a})`
    if (color[0] !== "#") return color
    let h = color.slice(1)
    if (h.length === 3) h = h.split("").map((c) => c + c).join("")
    const n = parseInt(h.slice(0, 6), 16)
    return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`
}

addPropertyControls(SelbstTest, {
    accent: { type: ControlType.Color, title: "Akzent", defaultValue: "#12A150" },
    ink: { type: ControlType.Color, title: "Text", defaultValue: "#0E1726" },
    surface: { type: ControlType.Color, title: "Fläche", defaultValue: "#F4F5F2" },
    funnelLink: { type: ControlType.Link, title: "Funnel", defaultValue: "/projekt-check" },
})
