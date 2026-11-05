import { addPropertyControls, ControlType } from "framer"
import type { CSSProperties, ReactNode } from "react"

interface ProductMockupProps {
    ansicht: "kalender" | "projekt" | "dashboard" | "anzeige"
    betrieb: string
    accent: string
    ink: string
    surface: string
    style?: CSSProperties
}

/**
 * Produkt-Mockups (HTML)
 *
 * @framerIntrinsicWidth 560
 * @framerIntrinsicHeight 420
 *
 * @framerSupportedLayoutWidth any-prefer-fixed
 * @framerSupportedLayoutHeight any-prefer-fixed
 */
export default function ProductMockup(props: ProductMockupProps) {
    const { ansicht = "kalender", betrieb = "[Dein Betrieb]", accent = "#12A150", ink = "#0E1726", surface = "#F4F5F2" } = props
    const muted = "rgba(14,23,38,0.55)"
    const line = "rgba(14,23,38,0.1)"
    const soft = hexA(accent, 0.1)

    const frame = (title: string, children: ReactNode, badge = "Beispielansicht") => (
        <div style={{ background: "#fff", borderRadius: 18, border: `1px solid ${line}`, boxShadow: "0 24px 60px -24px rgba(14,23,38,0.25), 0 2px 6px rgba(14,23,38,0.05)", overflow: "hidden", width: "100%", height: "100%", display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 16px", borderBottom: `1px solid ${line}`, background: surface }}>
                <span style={{ display: "flex", gap: 5 }}>{[0, 1, 2].map((i) => <span key={i} style={{ width: 9, height: 9, borderRadius: 5, background: "rgba(14,23,38,0.15)" }} />)}</span>
                <span style={{ fontSize: 12, fontWeight: 650, color: ink, marginLeft: 6, flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{title}</span>
                <span style={{ fontSize: 10, fontWeight: 700, color: muted, border: `1px solid ${line}`, borderRadius: 20, padding: "3px 8px", background: "#fff", whiteSpace: "nowrap" }}>{badge}</span>
            </div>
            <div style={{ flex: 1, padding: 16, display: "flex", flexDirection: "column", gap: 12, minHeight: 0 }}>{children}</div>
        </div>
    )

    let content: ReactNode = null

    if (ansicht === "kalender") {
        const tage = ["Mo", "Di", "Mi", "Do", "Fr"]
        const termine: Record<number, [string, string, number][]> = {
            0: [["09:00", "PV · Region Nord", 0], ["14:30", "Wärmepumpe · Region Süd", 1]],
            1: [["10:00", "PV + Speicher · Region Nord", 0]],
            2: [["08:30", "Wärmepumpe · Region Süd", 1], ["13:00", "PV · Region West", 2], ["16:00", "PV · Region Nord", 0]],
            3: [["11:00", "PV · Region West", 2]],
            4: [["09:30", "Wärmepumpe · Region Süd", 1], ["15:00", "PV · Region Nord", 0]],
        }
        const regionen: [string, number][] = [["Region Nord", 70], ["Region Süd", 45], ["Region West", 25]]
        content = frame("Vor-Ort-Termine · KW [__]", (<>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 6, flex: 1, minHeight: 0 }}>
                {tage.map((t, i) => (
                    <div key={t} style={{ display: "flex", flexDirection: "column", gap: 6, minWidth: 0 }}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: muted, textAlign: "center" }}>{t}</div>
                        {termine[i].map(([zeit, txt, r]) => (
                            <div key={zeit} style={{ background: r === 0 ? accent : r === 1 ? hexA(accent, 0.18) : surface, color: r === 0 ? "#fff" : ink, borderRadius: 8, padding: "6px 6px", fontSize: 9.5, lineHeight: 1.3, fontWeight: 600, borderLeft: r === 2 ? `3px solid ${accent}` : "none" }}>
                                <div style={{ fontVariantNumeric: "tabular-nums", opacity: 0.8 }}>{zeit}</div>
                                <div style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{txt}</div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
            <div style={{ borderTop: `1px solid ${line}`, paddingTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: muted }}>Volumen pro Region steuern</div>
                {regionen.map(([r, v]) => (
                    <div key={r} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 11, color: ink, fontWeight: 600 }}>
                        <span style={{ width: 78 }}>{r}</span>
                        <span style={{ flex: 1, height: 6, borderRadius: 3, background: line, position: "relative" }}>
                            <span style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${v}%`, background: accent, borderRadius: 3 }} />
                            <span style={{ position: "absolute", left: `calc(${v}% - 7px)`, top: -4, width: 14, height: 14, borderRadius: 7, background: "#fff", border: `2px solid ${accent}` }} />
                        </span>
                    </div>
                ))}
            </div>
        </>))
    }

    if (ansicht === "projekt") {
        const rows: [string, string][] = [["Interesse", "PV-Anlage + Speicher"], ["Jahresverbrauch", "ca. [____] kWh"], ["Eigentümer", "Ja, Einfamilienhaus"], ["Umsetzung", "in 0–3 Monaten"], ["Budget", "geklärt"]]
        content = frame("Projektanfrage · vorqualifiziert", (<>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 20, background: soft, color: accent, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 14 }}>FM</div>
                <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 15, fontWeight: 750, color: ink }}>Familie M. · PLZ [_____]</div>
                    <div style={{ fontSize: 11, color: muted }}>Telefonisch vorqualifiziert · Termin bestätigt</div>
                </div>
                <span style={{ fontSize: 10.5, fontWeight: 750, color: "#fff", background: accent, padding: "5px 9px", borderRadius: 20 }}>✓ Qualifiziert</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {rows.map(([k, v]) => (
                    <div key={k} style={{ background: surface, borderRadius: 10, padding: "8px 10px" }}>
                        <div style={{ fontSize: 10, color: muted, fontWeight: 600 }}>{k}</div>
                        <div style={{ fontSize: 12.5, color: ink, fontWeight: 700 }}>{v}</div>
                    </div>
                ))}
                <div style={{ background: soft, borderRadius: 10, padding: "8px 10px" }}>
                    <div style={{ fontSize: 10, color: muted, fontWeight: 600 }}>Vor-Ort-Termin</div>
                    <div style={{ fontSize: 12.5, color: ink, fontWeight: 700 }}>Do, 10:00 Uhr</div>
                </div>
            </div>
            <div style={{ fontSize: 11, fontWeight: 700, color: muted }}>Fotos vom Kunden</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, flex: 1, minHeight: 70 }}>
                <PhotoTile label="Zählerschrank" ink={ink}>
                    <rect x="20" y="10" width="60" height="60" rx="4" fill="#d9dde3" />
                    {[0, 1, 2].map((r) => [0, 1, 2, 3].map((c) => <rect key={r + "-" + c} x={26 + c * 13} y={18 + r * 16} width="9" height="11" rx="1.5" fill="#fff" />))}
                </PhotoTile>
                <PhotoTile label="Dachfläche" ink={ink}>
                    <path d="M5 60 L50 20 L95 60 Z" fill="#b9411f" opacity="0.85" />
                    {[0, 1, 2].map((i) => <rect key={i} x={30 + i * 14} y={38} width="12" height="16" fill="#1d2a44" transform="skewX(-8)" />)}
                    <rect x="0" y="60" width="100" height="20" fill="#cfd6c6" />
                </PhotoTile>
            </div>
        </>))
    }

    if (ansicht === "dashboard") {
        const kpis: [string, string][] = [["Anfragen", "[___]"], ["Vor-Ort-Termine", "[___]"], ["Terminquote", "[__] %"], ["Abschlussquote", "[__] %"]]
        const bars = [38, 52, 44, 61, 58, 72, 66, 80]
        content = frame("Anfragen-Dashboard · letzte 8 Wochen", (<>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
                {kpis.map(([k, v]) => (
                    <div key={k} style={{ border: `1px solid ${line}`, borderRadius: 10, padding: "8px 9px" }}>
                        <div style={{ fontSize: 9.5, color: muted, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{k}</div>
                        <div style={{ fontSize: 18, color: ink, fontWeight: 800, letterSpacing: "-0.02em", fontVariantNumeric: "tabular-nums" }}>{v}</div>
                    </div>
                ))}
            </div>
            <div style={{ background: ink, color: "#fff", borderRadius: 12, padding: "12px 14px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                    <div style={{ fontSize: 10.5, opacity: 0.65, fontWeight: 600 }}>Auftragsumsatz aus Anfragen</div>
                    <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.02em", fontVariantNumeric: "tabular-nums" }}>€ [___.___]</div>
                </div>
                <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 10.5, opacity: 0.65, fontWeight: 600 }}>Kosten pro Auftrag</div>
                    <div style={{ fontSize: 16, fontWeight: 750, color: "#7CE0A3" }}>€ [___]</div>
                </div>
            </div>
            <div style={{ flex: 1, minHeight: 80, display: "flex", alignItems: "flex-end", gap: 8, padding: "8px 4px 0", borderBottom: `1px solid ${line}` }}>
                {bars.map((b, i) => (
                    <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "flex-end", height: "100%", gap: 2 }}>
                        <div style={{ height: `${b}%`, background: i === bars.length - 1 ? accent : hexA(accent, 0.3), borderRadius: "5px 5px 0 0" }} />
                    </div>
                ))}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: muted }}><span>KW 1</span><span>Anfragen → Termine → Aufträge</span><span>KW 8</span></div>
        </>))
    }

    if (ansicht === "anzeige") {
        content = (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", height: "100%" }}>
                <div style={{ width: "min(100%, 270px)", background: "#fff", borderRadius: 18, border: `1px solid ${line}`, boxShadow: "0 24px 60px -24px rgba(14,23,38,0.3)", overflow: "hidden" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 9, padding: "10px 12px" }}>
                        <div style={{ width: 30, height: 30, borderRadius: 15, background: ink, color: "#fff", fontSize: 10, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>LOGO</div>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 12.5, fontWeight: 750, color: ink }}>{betrieb}</div>
                            <div style={{ fontSize: 10.5, color: muted }}>Gesponsert</div>
                        </div>
                        <span style={{ fontSize: 16, color: muted }}>···</span>
                    </div>
                    <div style={{ fontSize: 12, color: ink, padding: "0 12px 10px", lineHeight: 1.4 }}>Strom selbst erzeugen statt teuer einkaufen? Wir planen deine PV-Anlage – vom Team aus deiner Region.</div>
                    <div style={{ position: "relative", aspectRatio: "4 / 3", background: `linear-gradient(180deg, #CFE6F7 0%, #EAF4FB 60%, ${surface} 60%)` }}>
                        <svg viewBox="0 0 300 300" width="100%" height="100%" style={{ position: "absolute", inset: 0 }} aria-hidden="true">
                            <circle cx="240" cy="60" r="26" fill="#FFD25A" />
                            <path d="M50 190 L150 110 L250 190 Z" fill="#9C3D24" />
                            <rect x="70" y="190" width="160" height="80" fill="#fff" />
                            <rect x="135" y="220" width="30" height="50" fill={ink} opacity="0.8" />
                            {[0, 1, 2, 3].map((i) => <rect key={i} x={98 + i * 22} y={148 - (i % 2) * 0} width="20" height="26" fill="#1D2A44" stroke="#5B7BA6" strokeWidth="1" transform={`skewX(-22) translate(${60} 0)`} />)}
                        </svg>
                        <span style={{ position: "absolute", left: 10, top: 10, fontSize: 10, fontWeight: 800, color: "#fff", background: accent, padding: "4px 8px", borderRadius: 20 }}>Exklusiv · keine Mehrfachvergabe</span>
                        <span style={{ position: "absolute", right: 10, bottom: 10, fontSize: 10, fontWeight: 700, color: ink, background: "rgba(255,255,255,0.9)", padding: "4px 8px", borderRadius: 20 }}>[Eigenes Foto / Video]</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", background: surface }}>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 10, color: muted }}>{betrieb.toLowerCase().replace(/[^a-z0-9]+/g, "") || "betrieb"}.de</div>
                            <div style={{ fontSize: 12.5, fontWeight: 750, color: ink }}>Kostenlosen PV-Check starten</div>
                        </div>
                        <span style={{ fontSize: 11.5, fontWeight: 750, background: hexA(ink, 0.08), color: ink, padding: "7px 11px", borderRadius: 8 }}>Mehr dazu</span>
                    </div>
                </div>
            </div>
        )
    }

    return <div style={{ ...props.style, position: "relative", width: "100%", height: "100%", fontFamily: "Inter, system-ui, sans-serif", boxSizing: "border-box" }}>{content}</div>
}

function PhotoTile({ label, ink, children }: { label: string; ink: string; children: ReactNode }) {
    return (
        <div style={{ position: "relative", borderRadius: 10, overflow: "hidden", background: "#eef0f2" }}>
            <svg viewBox="0 0 100 80" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" aria-hidden="true">{children}</svg>
            <span style={{ position: "absolute", left: 6, bottom: 6, fontSize: 9.5, fontWeight: 700, color: ink, background: "rgba(255,255,255,0.92)", padding: "3px 7px", borderRadius: 12 }}>📷 {label}</span>
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

addPropertyControls(ProductMockup, {
    ansicht: {
        type: ControlType.Enum,
        title: "Ansicht",
        defaultValue: "kalender",
        options: ["kalender", "projekt", "dashboard", "anzeige"],
        optionTitles: ["Terminkalender", "Projekt-Detail", "Dashboard", "Anzeige"],
    },
    betrieb: { type: ControlType.String, title: "Betrieb", defaultValue: "[Dein Betrieb]" },
    accent: { type: ControlType.Color, title: "Akzent", defaultValue: "#12A150" },
    ink: { type: ControlType.Color, title: "Text", defaultValue: "#0E1726" },
    surface: { type: ControlType.Color, title: "Fläche", defaultValue: "#F4F5F2" },
})
