import { addPropertyControls, ControlType } from "framer"
import type { CSSProperties } from "react"

interface PainVisualProps {
    motiv: "auslastung" | "preiskampf" | "portale" | "aussendienst"
    accent: string
    warn: string
    ink: string
    surface: string
    style?: CSSProperties
}

/**
 * Pain-Visualisierung (SVG)
 *
 * @framerIntrinsicWidth 520
 * @framerIntrinsicHeight 360
 *
 * @framerSupportedLayoutWidth any-prefer-fixed
 * @framerSupportedLayoutHeight any-prefer-fixed
 */
export default function PainVisual(props: PainVisualProps) {
    const { motiv = "auslastung", accent = "#12A150", warn = "#E5484D", ink = "#0E1726", surface = "#F4F5F2" } = props
    const muted = "rgba(14,23,38,0.45)"
    const line = "rgba(14,23,38,0.12)"
    const font = "Inter, system-ui, sans-serif"
    const T = (p: any) => <text fontFamily={font} {...p} />

    let svg: any = null

    if (motiv === "auslastung") {
        // Auftragskurve mit Peaks/Tälern und Fragezeichen in der Zukunft
        const pts = [[40, 230], [85, 120], [130, 200], [175, 90], [220, 250], [265, 170], [310, 270], [355, 140]]
        const d = pts.map((p, i) => (i ? "L" : "M") + p[0] + " " + p[1]).join(" ")
        const months = ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt"]
        svg = (
            <svg viewBox="0 0 520 360" width="100%" height="100%" role="img" aria-label="Schwankende Auftragskurve mit offener Zukunft">
                <rect x="16" y="16" width="488" height="328" rx="18" fill="#fff" stroke={line} />
                {T({ x: 40, y: 50, fontSize: 13, fontWeight: 600, fill: muted, children: "Aufträge pro Monat" })}
                {[90, 150, 210, 270].map((y) => <line key={y} x1="40" x2="480" y1={y} y2={y} stroke={line} strokeDasharray="3 5" />)}
                <path d={`${d} L355 300 L40 300 Z`} fill={ink} opacity="0.05" />
                <path d={d} fill="none" stroke={ink} strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
                {pts.map((p, i) => <circle key={i} cx={p[0]} cy={p[1]} r="4.5" fill="#fff" stroke={ink} strokeWidth="2.5" />)}
                <path d="M355 140 C 380 120, 395 200, 420 170 S 455 120, 480 180" fill="none" stroke={warn} strokeWidth="3" strokeDasharray="2 8" strokeLinecap="round" />
                {[[400, 120], [445, 210], [480, 125]].map(([x, y], i) => (
                    <g key={i}>
                        <circle cx={x} cy={y} r="17" fill={warn} opacity="0.12" />
                        {T({ x, y: y + 6, fontSize: 18, fontWeight: 800, fill: warn, textAnchor: "middle", children: "?" })}
                    </g>
                ))}
                {months.map((m, i) => <g key={m}>{T({ x: 40 + i * 48.9, y: 326, fontSize: 11, fill: muted, textAnchor: "middle", children: m })}</g>)}
                <rect x="372" y="290" width="108" height="22" rx="11" fill={warn} opacity="0.1" />
                {T({ x: 426, y: 305, fontSize: 11, fontWeight: 700, fill: warn, textAnchor: "middle", children: "nicht planbar" })}
            </svg>
        )
    }

    if (motiv === "preiskampf") {
        svg = (
            <svg viewBox="0 0 520 360" width="100%" height="100%" role="img" aria-label="Pauschales Billigangebot gegen transparentes Qualitätsangebot">
                <g transform="translate(24 40) rotate(-3 110 140)">
                    <rect width="220" height="270" rx="16" fill="#fff" stroke={line} />
                    <rect x="18" y="20" width="96" height="22" rx="11" fill={warn} opacity="0.12" />
                    {T({ x: 66, y: 35, fontSize: 11, fontWeight: 700, fill: warn, textAnchor: "middle", children: "PAUSCHAL" })}
                    {T({ x: 18, y: 76, fontSize: 15, fontWeight: 700, fill: ink, children: "Komplettpaket" })}
                    {[100, 118, 136].map((y) => <rect key={y} x="18" y={y} width={y === 136 ? 110 : 170} height="8" rx="4" fill={line} />)}
                    {T({ x: 18, y: 178, fontSize: 11, fill: muted, children: "Komponenten: k. A." })}
                    {T({ x: 18, y: 196, fontSize: 11, fill: muted, children: "Beratung: keine" })}
                    <line x1="18" x2="202" y1="214" y2="214" stroke={line} />
                    {T({ x: 18, y: 248, fontSize: 30, fontWeight: 800, fill: warn, children: "€ ↓↓" })}
                </g>
                {T({ x: 260, y: 186, fontSize: 18, fontWeight: 800, fill: muted, textAnchor: "middle", children: "vs." })}
                <g transform="translate(278 28)">
                    <rect width="222" height="300" rx="16" fill="#fff" stroke={accent} strokeWidth="2" />
                    <rect x="18" y="20" width="132" height="22" rx="11" fill={accent} opacity="0.12" />
                    {T({ x: 84, y: 35, fontSize: 11, fontWeight: 700, fill: accent, textAnchor: "middle", children: "TRANSPARENT" })}
                    {T({ x: 18, y: 76, fontSize: 15, fontWeight: 700, fill: ink, children: "Qualitätsangebot" })}
                    {["Module & Wechselrichter", "Speicher & Montage", "Inbetriebnahme", "Service & Garantie"].map((t, i) => (
                        <g key={t} transform={`translate(18 ${98 + i * 28})`}>
                            <circle cx="8" cy="0" r="8" fill={accent} />
                            <path d="M4 0l3 3 5-6" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
                            {T({ x: 24, y: 4, fontSize: 12, fill: ink, children: t })}
                        </g>
                    ))}
                    <line x1="18" x2="204" y1="222" y2="222" stroke={line} />
                    {T({ x: 18, y: 250, fontSize: 11, fill: muted, children: "Jede Position erklärt" })}
                    {T({ x: 18, y: 278, fontSize: 15, fontWeight: 700, fill: accent, children: "Wert statt Rabatt" })}
                </g>
            </svg>
        )
    }

    if (motiv === "portale") {
        const anbieter = [[400, 64], [440, 132], [452, 206], [430, 280], [370, 320]]
        svg = (
            <svg viewBox="0 0 520 360" width="100%" height="100%" role="img" aria-label="Eine Anfrage wird an fünf Anbieter verkauft">
                <rect x="16" y="16" width="488" height="328" rx="18" fill="#fff" stroke={line} />
                <g transform="translate(48 140)">
                    <rect width="150" height="80" rx="14" fill={ink} />
                    {T({ x: 18, y: 32, fontSize: 12, fill: "rgba(255,255,255,0.65)", children: "1 Anfrage" })}
                    {T({ x: 18, y: 56, fontSize: 16, fontWeight: 700, fill: "#fff", children: "PV-Anlage, EFH" })}
                </g>
                {anbieter.map(([x, y], i) => (
                    <path key={i} d={`M198 180 C 290 180, 300 ${y}, ${x - 46} ${y}`} fill="none" stroke={i === 2 ? warn : "rgba(14,23,38,0.25)"} strokeWidth={i === 2 ? 2.5 : 1.5} strokeDasharray={i === 2 ? "" : "4 5"} />
                ))}
                {anbieter.map(([x, y], i) => (
                    <g key={"a" + i} transform={`translate(${x - 46} ${y - 18})`}>
                        <rect width="92" height="36" rx="10" fill={i === 2 ? warn : surface} stroke={i === 2 ? warn : line} />
                        {T({ x: 46, y: 23, fontSize: 12, fontWeight: 700, fill: i === 2 ? "#fff" : ink, textAnchor: "middle", children: `Anbieter ${i + 1}` })}
                    </g>
                ))}
                <g transform="translate(250 300)">
                    <rect x="-70" y="-14" width="160" height="26" rx="13" fill={warn} opacity="0.1" />
                    {T({ x: 10, y: 4, fontSize: 11, fontWeight: 700, fill: warn, textAnchor: "middle", children: "Der Günstigste gewinnt" })}
                </g>
                {T({ x: 48, y: 56, fontSize: 13, fontWeight: 600, fill: muted, children: "Lead-Portal" })}
                {T({ x: 48, y: 76, fontSize: 11, fill: muted, children: "eine Anfrage · mehrfach verkauft" })}
            </svg>
        )
    }

    if (motiv === "aussendienst") {
        const stops = [[70, 280], [150, 110], [250, 230], [330, 90], [440, 200]]
        const route = "M70 280 C 90 180, 120 120, 150 110 S 230 260, 250 230 S 300 70, 330 90 S 420 230, 440 200"
        svg = (
            <svg viewBox="0 0 520 360" width="100%" height="100%" role="img" aria-label="Tagesroute mit vielen Kilometern und keinem Auftrag">
                <rect x="16" y="16" width="488" height="328" rx="18" fill={surface} stroke={line} />
                {[80, 140, 200, 260, 320].map((y) => <line key={"h" + y} x1="16" x2="504" y1={y} y2={y} stroke="rgba(14,23,38,0.05)" />)}
                {[100, 200, 300, 400].map((x) => <line key={"v" + x} x1={x} x2={x} y1="16" y2="344" stroke="rgba(14,23,38,0.05)" />)}
                <path d={route} fill="none" stroke={ink} strokeWidth="4" strokeLinecap="round" opacity="0.85" />
                <path d={route} fill="none" stroke="#fff" strokeWidth="1.5" strokeDasharray="6 8" strokeLinecap="round" />
                {stops.map(([x, y], i) => (
                    <g key={i}>
                        <circle cx={x} cy={y} r="15" fill={i === 0 ? ink : "#fff"} stroke={i === 0 ? ink : warn} strokeWidth="2.5" />
                        {i === 0
                            ? T({ x, y: y + 4, fontSize: 10, fontWeight: 800, fill: "#fff", textAnchor: "middle", children: "B" })
                            : <path d={`M${x - 5} ${y - 5} L${x + 5} ${y + 5} M${x + 5} ${y - 5} L${x - 5} ${y + 5}`} stroke={warn} strokeWidth="2.5" strokeLinecap="round" />}
                    </g>
                ))}
                <g transform="translate(330 262)">
                    <rect width="160" height="66" rx="12" fill="#fff" stroke={line} />
                    {T({ x: 14, y: 24, fontSize: 11, fontWeight: 600, fill: muted, children: "Tagesbilanz (Beispiel)" })}
                    {T({ x: 14, y: 50, fontSize: 16, fontWeight: 800, fill: ink, children: "4 Termine" })}
                    {T({ x: 100, y: 50, fontSize: 16, fontWeight: 800, fill: warn, children: "0 ✕" })}
                </g>
                <g transform="translate(36 36)">
                    <rect width="150" height="28" rx="14" fill="#fff" stroke={line} />
                    {T({ x: 75, y: 18, fontSize: 11, fontWeight: 700, fill: ink, textAnchor: "middle", children: "viele km · kein Auftrag" })}
                </g>
            </svg>
        )
    }

    return (
        <div style={{ ...props.style, position: "relative", width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {svg}
        </div>
    )
}

addPropertyControls(PainVisual, {
    motiv: {
        type: ControlType.Enum,
        title: "Motiv",
        defaultValue: "auslastung",
        options: ["auslastung", "preiskampf", "portale", "aussendienst"],
        optionTitles: ["01 Auslastung", "02 Preiskampf", "03 Lead-Portale", "04 Außendienst"],
    },
    accent: { type: ControlType.Color, title: "Akzent", defaultValue: "#12A150" },
    warn: { type: ControlType.Color, title: "Warnung", defaultValue: "#E5484D" },
    ink: { type: ControlType.Color, title: "Text", defaultValue: "#0E1726" },
    surface: { type: ControlType.Color, title: "Fläche", defaultValue: "#F4F5F2" },
})
