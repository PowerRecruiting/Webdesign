import { addPropertyControls, ControlType, useIsStaticRenderer } from "framer"
import { useEffect, useMemo, useState, startTransition, type CSSProperties, type ReactNode } from "react"

/* ============================================================
   ZENTRALE EINSTELLUNGEN – hier anpassen
   ============================================================ */

/** Ab-Preis pro Vor-Ort-Termin je Gewerk in EUR. 0 = noch nicht hinterlegt (Platzhalter). */
const PREIS_PRO_TERMIN: Record<Gewerk, number> = {
    pv: 0, // [___] € – Vor-Ort-Termin Photovoltaik
    waermepumpe: 0, // [___] € – Vor-Ort-Termin Wärmepumpe
    elektro: 0, // [___] € – Vor-Ort-Termin Elektro
    shk: 0, // [___] € – Vor-Ort-Termin SHK
}

/** Empfohlenes Werbebudget ab … €/Monat. 0 = Platzhalter. */
const WERBEBUDGET_AB = 0 // [___] €/Monat

/** Standard-Auftragswerte je Gewerk (Startwert des Sliders). */
const AUFTRAGSWERT_STANDARD: Record<Gewerk, number> = {
    pv: 25000,
    waermepumpe: 30000,
    elektro: 8000,
    shk: 15000,
}

/** Standard-Abschlussquote bei Vor-Ort-Terminen in Prozent. */
const ABSCHLUSSQUOTE_STANDARD = 30

/** Webhook für Funnel-Antworten (z. B. Make). Platzhalter ersetzen! */
const WEBHOOK_URL = "https://hook.eu1.make.com/PLATZHALTER-WEBHOOK-ID"

/** Calendly-Link für die Terminbuchung. Leer lassen = Platzhalter-Box. */
const CALENDLY_URL = ""

/* ============================================================ */

type Gewerk = "pv" | "waermepumpe" | "elektro" | "shk"
type Pfad = "handwerk" | "projektentwickler"

const GEWERK_LABEL: Record<Gewerk, string> = {
    pv: "Photovoltaik",
    waermepumpe: "Wärmepumpe",
    elektro: "Elektro",
    shk: "SHK",
}

interface ProjektCheckProps {
    accent: string
    ink: string
    surface: string
    datenschutzLink: string
    style?: CSSProperties
}

type Answers = Record<string, any>

const eur = (n: number) =>
    new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(Math.round(n))
const num = (n: number, d = 1) => new Intl.NumberFormat("de-DE", { maximumFractionDigits: d }).format(n)

/* ---------- Icons (inline SVG) ---------- */
function Icon({ name, color }: { name: string; color: string }) {
    const p = { fill: "none", stroke: color, strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const }
    const paths: Record<string, ReactNode> = {
        handwerk: (<><path {...p} d="M14.5 6.5l3 3-8.5 8.5H6v-3z" /><path {...p} d="M13 8l3 3" /><path {...p} d="M4 20h16" /></>),
        entwickler: (<><path {...p} d="M3 20h18" /><path {...p} d="M5 20V9l7-4 7 4v11" /><path {...p} d="M9 20v-5h6v5" /></>),
        pv: (<><path {...p} d="M4 18l2-10h12l2 10z" /><path {...p} d="M5 13h14M10 8l-1 10M14 8l1 10" /></>),
        waermepumpe: (<><rect {...p} x="3" y="6" width="18" height="12" rx="2" /><circle {...p} cx="10" cy="12" r="3.5" /><path {...p} d="M16 9h2M16 12h2M16 15h2" /></>),
        elektro: (<path {...p} d="M13 3L5 13h6l-1 8 8-10h-6z" />),
        shk: (<><path {...p} d="M12 3c3 4 5 6.5 5 9.5a5 5 0 01-10 0C7 9.5 9 7 12 3z" /></>),
        empfehlung: (<><circle {...p} cx="9" cy="8" r="3" /><path {...p} d="M3 19c0-3 3-5 6-5s6 2 6 5" /><path {...p} d="M16 8h5M18.5 5.5v5" /></>),
        portal: (<><rect {...p} x="3" y="4" width="18" height="14" rx="2" /><path {...p} d="M3 9h18M8 20h8" /></>),
        agentur: (<><path {...p} d="M4 20V8l8-4 8 4v12" /><path {...p} d="M9 12h6M9 16h6" /></>),
        google: (<><circle {...p} cx="11" cy="11" r="6" /><path {...p} d="M20 20l-4.5-4.5" /></>),
        team: (<><circle {...p} cx="8" cy="9" r="2.5" /><circle {...p} cx="16" cy="9" r="2.5" /><path {...p} d="M3 18c0-2.5 2.2-4 5-4s5 1.5 5 4M11 18c0-2.5 2.2-4 5-4s5 1.5 5 4" /></>),
        kalender: (<><rect {...p} x="3" y="5" width="18" height="16" rx="2" /><path {...p} d="M3 10h18M8 3v4M16 3v4" /></>),
        freiflaeche: (<><path {...p} d="M2 19h20" /><path {...p} d="M4 15l3-6h6l-3 6zM12 15l3-6h6l-3 6z" /></>),
        agri: (<><path {...p} d="M3 20h18" /><path {...p} d="M6 20v-5M6 15c-2 0-3-2-3-3 2 0 3 1 3 3zM6 15c2 0 3-2 3-3-2 0-3 1-3 3z" /><path {...p} d="M11 11l2-5h7l-2 5z" /></>),
        dach: (<><path {...p} d="M3 11l9-6 9 6" /><path {...p} d="M5 10v10h14V10" /><path {...p} d="M8 14h8" /></>),
        bess: (<><rect {...p} x="6" y="4" width="12" height="17" rx="2" /><path {...p} d="M10 2h4M12 9l-2 4h4l-2 4" /></>),
        sonstiges: (<><circle {...p} cx="6" cy="12" r="1.2" /><circle {...p} cx="12" cy="12" r="1.2" /><circle {...p} cx="18" cy="12" r="1.2" /></>),
        flaeche: (<><path {...p} d="M3 7l6-3 6 3 6-3v13l-6 3-6-3-6 3z" /><path {...p} d="M9 4v13M15 7v13" /></>),
        investor: (<><path {...p} d="M4 19l5-6 4 3 7-9" /><path {...p} d="M15 7h5v5" /></>),
        vermarktung: (<><path {...p} d="M4 10v4h3l6 4V6L7 10z" /><path {...p} d="M17 9a4 4 0 010 6" /></>),
        uhr: (<><circle {...p} cx="12" cy="12" r="8" /><path {...p} d="M12 8v4l3 2" /></>),
        geld: (<><rect {...p} x="3" y="6" width="18" height="12" rx="2" /><circle {...p} cx="12" cy="12" r="2.5" /></>),
        zurueck: (<path {...p} d="M15 6l-6 6 6 6" />),
        check: (<path {...p} d="M5 12l5 5 9-10" />),
        pfeil: (<path {...p} d="M5 12h14M13 6l6 6-6 6" />),
    }
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
            {paths[name] || paths.sonstiges}
        </svg>
    )
}

/* ---------- Schritt-Definitionen ---------- */
interface Option { value: string; label: string; icon?: string; sub?: string }
interface Step {
    id: string
    kind: "single" | "multi" | "slider" | "region" | "result" | "contact" | "start"
    title: string
    hint?: string
    options?: Option[]
}

const STEPS_A: Step[] = [
    { id: "gewerk", kind: "multi", title: "Welche Gewerke bietest du an?", hint: "Mehrfachauswahl möglich", options: [
        { value: "pv", label: "Photovoltaik", icon: "pv" },
        { value: "waermepumpe", label: "Wärmepumpe", icon: "waermepumpe" },
        { value: "elektro", label: "Elektro", icon: "elektro" },
        { value: "shk", label: "SHK", icon: "shk" },
    ]},
    { id: "mitarbeiter", kind: "single", title: "Wie viele Mitarbeiter hat dein Betrieb?", options: [
        { value: "unter-15", label: "unter 15", icon: "team" },
        { value: "15-50", label: "15–50", icon: "team" },
        { value: "51-100", label: "51–100", icon: "team" },
        { value: "ueber-100", label: "über 100", icon: "team" },
    ]},
    { id: "aktuell", kind: "multi", title: "Wie gewinnst du aktuell deine Projekte?", hint: "Mehrfachauswahl möglich", options: [
        { value: "empfehlungen", label: "Empfehlungen", icon: "empfehlung" },
        { value: "lead-portale", label: "Lead-Portale", icon: "portal" },
        { value: "agentur", label: "Agentur", icon: "agentur" },
        { value: "website-google", label: "Website / Google", icon: "google" },
    ]},
    { id: "termine", kind: "single", title: "Wie viele zusätzliche Vor-Ort-Termine pro Monat kannst du abarbeiten?", options: [
        { value: "5", label: "5", sub: "Termine / Monat", icon: "kalender" },
        { value: "10", label: "10", sub: "Termine / Monat", icon: "kalender" },
        { value: "20", label: "20", sub: "Termine / Monat", icon: "kalender" },
        { value: "30", label: "30+", sub: "Termine / Monat", icon: "kalender" },
    ]},
    { id: "auftragswert", kind: "slider", title: "Wie hoch ist dein durchschnittlicher Auftragswert?", hint: "Startwert passend zu deinem Gewerk – verschiebe ihn auf deinen echten Wert." },
    { id: "quote", kind: "slider", title: "Wie viele deiner Vor-Ort-Termine werden zum Auftrag?", hint: "Abschlussquote – grobe Einschätzung reicht." },
    { id: "region", kind: "region", title: "In welcher Region arbeitest du?", hint: "Land und PLZ-Bereich – damit wir dein Einzugsgebiet prüfen können." },
    { id: "ergebnis", kind: "result", title: "Deine Wirtschaftlichkeit" },
    { id: "kontakt", kind: "contact", title: "Wohin dürfen wir deine Auswertung schicken?" },
]

const STEPS_B: Step[] = [
    { id: "projektart", kind: "single", title: "Um welche Projektart geht es?", options: [
        { value: "freiflaeche-pv", label: "Freiflächen-PV", icon: "freiflaeche" },
        { value: "agri-pv", label: "Agri-PV", icon: "agri" },
        { value: "dach-pv-gewerbe", label: "Dach-PV Gewerbe", icon: "dach" },
        { value: "bess", label: "Batteriespeicher (BESS)", icon: "bess" },
        { value: "sonstiges", label: "Sonstiges", icon: "sonstiges" },
    ]},
    { id: "ziel", kind: "multi", title: "Welche Ziele verfolgen Sie?", hint: "Mehrfachauswahl möglich", options: [
        { value: "flaechen-eigentuemer", label: "Flächen / Eigentümer gewinnen", icon: "flaeche" },
        { value: "investoren", label: "Investoren gewinnen", icon: "investor" },
        { value: "vermarktung", label: "Projekte vermarkten", icon: "vermarktung" },
        { value: "sonstiges", label: "Sonstiges", icon: "sonstiges" },
    ]},
    { id: "volumen", kind: "single", title: "Wie groß ist das Projektvolumen bzw. der Kapitalbedarf?", options: [
        { value: "unter-1-mio", label: "unter 1 Mio. €", icon: "geld" },
        { value: "1-5-mio", label: "1–5 Mio. €", icon: "geld" },
        { value: "5-20-mio", label: "5–20 Mio. €", icon: "geld" },
        { value: "ueber-20-mio", label: "über 20 Mio. €", icon: "geld" },
    ]},
    { id: "zeitrahmen", kind: "single", title: "In welchem Zeitrahmen möchten Sie starten?", options: [
        { value: "sofort", label: "sofort", icon: "uhr" },
        { value: "3-monate", label: "in ca. 3 Monaten", icon: "uhr" },
        { value: "6-monate-plus", label: "in 6+ Monaten", icon: "uhr" },
    ]},
    { id: "kontakt", kind: "contact", title: "Wie erreichen wir Sie?" },
]

const START: Step = { id: "start", kind: "start", title: "Wer bist du?", options: [
    { value: "handwerk", label: "Handwerksbetrieb", sub: "PV, Wärmepumpe, Elektro, SHK", icon: "handwerk" },
    { value: "projektentwickler", label: "Projektentwickler", sub: "PV, Agri-PV, BESS, Energie", icon: "entwickler" },
]}

/* ---------- Komponente ---------- */

/**
 * Projekt-Check Funnel
 *
 * @framerIntrinsicWidth 720
 * @framerIntrinsicHeight 640
 *
 * @framerSupportedLayoutWidth any-prefer-fixed
 * @framerSupportedLayoutHeight auto
 */
export default function ProjektCheck(props: ProjektCheckProps) {
    const { accent = "#12A150", ink = "#0E1726", surface = "#F4F5F2", datenschutzLink = "/datenschutz" } = props
    const isStatic = useIsStaticRenderer()

    const [pfad, setPfad] = useState<Pfad | null>(null)
    const [index, setIndex] = useState(0) // 0 = Start
    const [answers, setAnswers] = useState<Answers>({})
    const [skipStart, setSkipStart] = useState(false)
    const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle")

    // Vorauswahl per URL-Parameter ?pfad=handwerk|projektentwickler oder Anker #handwerk / #projektentwickler
    useEffect(() => {
        if (typeof window === "undefined") return
        const hash = window.location.hash.replace("#", "")
        const p = new URLSearchParams(window.location.search).get("pfad") || (hash === "handwerk" || hash === "projektentwickler" ? hash : null)
        if (p === "handwerk" || p === "projektentwickler") {
            startTransition(() => {
                setPfad(p)
                setSkipStart(true)
                setIndex(1)
            })
        }
    }, [])

    const steps: Step[] = pfad === "projektentwickler" ? [START, ...STEPS_B] : [START, ...STEPS_A]
    const step = steps[index]
    const du = pfad !== "projektentwickler"

    // Standard-Auftragswert aus gewählten Gewerken
    const gewerke: Gewerk[] = (answers.gewerk && answers.gewerk.length ? answers.gewerk : ["pv"]) as Gewerk[]
    const defaultAuftragswert = Math.round(gewerke.reduce((s, g) => s + AUFTRAGSWERT_STANDARD[g], 0) / gewerke.length / 500) * 500
    const auftragswert: number = answers.auftragswert ?? defaultAuftragswert
    const quote: number = answers.quote ?? ABSCHLUSSQUOTE_STANDARD

    const calc = useMemo(() => {
        const termine = Number(answers.termine || 10)
        const preis = gewerke.reduce((s, g) => s + PREIS_PRO_TERMIN[g], 0) / gewerke.length
        const auftraege = termine * (quote / 100)
        const umsatz = auftraege * auftragswert
        const investition = termine * preis
        const kostenProAuftrag = auftraege > 0 ? investition / auftraege : 0
        return { termine, preis, auftraege, umsatz, investition, kostenProAuftrag, preisHinterlegt: preis > 0 }
    }, [answers.termine, gewerke.join(","), quote, auftragswert])

    function set(id: string, value: any) {
        setAnswers((a) => ({ ...a, [id]: value }))
    }
    function next() {
        startTransition(() => setIndex((i) => Math.min(i + 1, steps.length - 1)))
        if (typeof window !== "undefined") {
            try { window.scrollTo({ top: 0, behavior: "smooth" }) } catch (e) {}
        }
    }
    function back() {
        startTransition(() => {
            if (index === 1 && skipStart) { setSkipStart(false) }
            setIndex((i) => Math.max(i - 1, 0))
        })
    }
    function choose(value: string) {
        if (step.kind === "start") {
            startTransition(() => { setPfad(value as Pfad); setAnswers({}); setIndex(1) })
            return
        }
        set(step.id, value)
        setTimeout(next, 180)
    }
    function toggle(value: string) {
        const cur: string[] = answers[step.id] || []
        set(step.id, cur.includes(value) ? cur.filter((v) => v !== value) : [...cur, value])
    }

    async function submit(kontakt: Record<string, string>) {
        startTransition(() => setStatus("sending"))
        const payload = {
            pfad,
            antworten: { ...answers, ...(pfad === "handwerk" ? { auftragswert, quote } : {}) },
            ergebnis: pfad === "handwerk" ? {
                termineProMonat: calc.termine,
                erwarteteAuftraegeProMonat: Number(calc.auftraege.toFixed(1)),
                zusaetzlicherUmsatzProMonat: Math.round(calc.umsatz),
                investitionProMonat: calc.preisHinterlegt ? Math.round(calc.investition) : null,
                kostenProAuftrag: calc.preisHinterlegt ? Math.round(calc.kostenProAuftrag) : null,
            } : null,
            kontakt,
            quelle: typeof window !== "undefined" ? window.location.href : "",
            zeitpunkt: new Date().toISOString(),
        }
        try {
            if (WEBHOOK_URL.indexOf("PLATZHALTER") === -1) {
                const res = await fetch(WEBHOOK_URL, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
                if (!res.ok) throw new Error(String(res.status))
            } else {
                console.warn("Projekt-Check: Webhook-URL ist noch ein Platzhalter. Payload:", payload)
            }
            startTransition(() => setStatus("done"))
        } catch (e) {
            startTransition(() => setStatus("error"))
        }
    }

    const total = steps.length - 1
    const progress = index === 0 ? 4 : Math.round((index / total) * 100)

    /* ---------- Styles ---------- */
    const muted = "rgba(14,23,38,0.62)"
    const line = "rgba(14,23,38,0.12)"
    const root: CSSProperties = {
        ...props.style, position: "relative", width: "100%", boxSizing: "border-box",
        fontFamily: "Inter, system-ui, sans-serif", color: ink, display: "flex", flexDirection: "column", gap: 28,
    }
    const tile = (active: boolean): CSSProperties => ({
        display: "flex", alignItems: "center", gap: 14, padding: "18px 18px", borderRadius: 14, cursor: "pointer",
        textAlign: "left", width: "100%", boxSizing: "border-box", minHeight: 76,
        background: active ? hexA(accent, 0.08) : "#fff",
        border: `1.5px solid ${active ? accent : line}`,
        boxShadow: active ? `0 0 0 3px ${hexA(accent, 0.15)}` : "0 1px 2px rgba(14,23,38,0.04)",
        color: ink, fontFamily: "inherit", fontSize: 16, fontWeight: 600, transition: "all .15s ease",
    })
    const iconBox = (active: boolean): CSSProperties => ({
        width: 44, height: 44, borderRadius: 10, flex: "0 0 44px", display: "flex", alignItems: "center", justifyContent: "center",
        background: active ? accent : surface,
    })
    const primaryBtn = (disabled = false): CSSProperties => ({
        display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 10, padding: "16px 26px", borderRadius: 12,
        background: disabled ? "rgba(14,23,38,0.2)" : accent, color: "#fff", border: "none", fontFamily: "inherit",
        fontSize: 16, fontWeight: 650, cursor: disabled ? "not-allowed" : "pointer", width: "100%", maxWidth: 360,
    })
    const input: CSSProperties = {
        width: "100%", boxSizing: "border-box", padding: "14px 16px", borderRadius: 12, border: `1.5px solid ${line}`,
        fontFamily: "inherit", fontSize: 16, color: ink, background: "#fff", outline: "none",
    }
    const label: CSSProperties = { fontSize: 13, fontWeight: 600, color: muted, display: "flex", flexDirection: "column", gap: 6 }

    /* ---------- Render-Teile ---------- */
    const header = (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, minHeight: 36 }}>
                {index > 0 && status !== "done" ? (
                    <button onClick={back} aria-label="Zurück" style={{ display: "inline-flex", alignItems: "center", gap: 4, background: "none", border: "none", cursor: "pointer", color: muted, fontFamily: "inherit", fontSize: 14, fontWeight: 600, padding: "6px 0" }}>
                        <Icon name="zurueck" color={muted} /> Zurück
                    </button>
                ) : <span />}
                <span style={{ fontSize: 13, color: muted, fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>
                    {index === 0 ? "Projekt-Check · 2 Minuten" : `Schritt ${index} von ${total}`}
                </span>
            </div>
            <div role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100} style={{ height: 6, borderRadius: 6, background: line, overflow: "hidden" }}>
                <div style={{ width: `${status === "done" ? 100 : progress}%`, height: "100%", background: accent, borderRadius: 6, transition: "width .35s ease" }} />
            </div>
        </div>
    )

    const title = (t: string, hint?: string) => (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <h2 style={{ margin: 0, fontSize: "clamp(24px, 4vw, 32px)", lineHeight: 1.15, letterSpacing: "-0.02em", fontWeight: 700 }}>{t}</h2>
            {hint && <p style={{ margin: 0, fontSize: 15, color: muted, lineHeight: 1.5 }}>{hint}</p>}
        </div>
    )

    const grid = (children: ReactNode) => (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 12 }}>{children}</div>
    )

    let body: ReactNode = null

    if (status === "done") {
        body = (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <div style={{ width: 56, height: 56, borderRadius: 28, background: accent, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon name="check" color="#fff" />
                </div>
                {title(du ? "Danke – deine Angaben sind da." : "Vielen Dank – Ihre Angaben sind eingegangen.",
                    du ? "Wir prüfen dein Gebiet und melden uns innerhalb von 24 Stunden (werktags) telefonisch. Wenn du direkt einen Termin willst, buche ihn hier:" : "Wir melden uns innerhalb eines Werktags für ein erstes Projektgespräch. Alternativ können Sie direkt einen Termin wählen:")}
                <Booking accent={accent} ink={ink} surface={surface} />
            </div>
        )
    } else if (step.kind === "start" || step.kind === "single") {
        body = (<>
            {title(step.title, step.hint)}
            {grid(step.options!.map((o) => {
                const active = step.kind === "start" ? pfad === o.value : answers[step.id] === o.value
                return (
                    <button key={o.value} onClick={() => choose(o.value)} style={tile(active)} aria-pressed={active}>
                        <span style={iconBox(active)}><Icon name={o.icon || "sonstiges"} color={active ? "#fff" : ink} /></span>
                        <span style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                            <span>{o.label}</span>
                            {o.sub && <span style={{ fontSize: 13, fontWeight: 500, color: muted }}>{o.sub}</span>}
                        </span>
                    </button>
                )
            }))}
        </>)
    } else if (step.kind === "multi") {
        const cur: string[] = answers[step.id] || []
        body = (<>
            {title(step.title, step.hint)}
            {grid(step.options!.map((o) => {
                const active = cur.includes(o.value)
                return (
                    <button key={o.value} onClick={() => toggle(o.value)} style={tile(active)} aria-pressed={active}>
                        <span style={iconBox(active)}><Icon name={o.icon || "sonstiges"} color={active ? "#fff" : ink} /></span>
                        <span style={{ flex: 1 }}>{o.label}</span>
                        <span style={{ width: 22, height: 22, borderRadius: 6, border: `1.5px solid ${active ? accent : line}`, background: active ? accent : "#fff", display: "flex", alignItems: "center", justifyContent: "center", flex: "0 0 22px" }}>
                            {active && <svg width="14" height="14" viewBox="0 0 24 24"><path d="M5 12l5 5 9-10" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" /></svg>}
                        </span>
                    </button>
                )
            }))}
            <button onClick={next} disabled={!cur.length} style={primaryBtn(!cur.length)}>Weiter <Icon name="pfeil" color="#fff" /></button>
        </>)
    } else if (step.kind === "slider") {
        const isWert = step.id === "auftragswert"
        const value = isWert ? auftragswert : quote
        const min = isWert ? 2000 : 5
        const max = isWert ? 80000 : 80
        const stepSize = isWert ? 500 : 1
        body = (<>
            {title(step.title, step.hint)}
            <div style={{ background: "#fff", border: `1.5px solid ${line}`, borderRadius: 16, padding: "28px 22px", display: "flex", flexDirection: "column", gap: 20 }}>
                <div style={{ fontSize: "clamp(36px, 7vw, 52px)", fontWeight: 750, letterSpacing: "-0.03em", fontVariantNumeric: "tabular-nums", color: ink }}>
                    {isWert ? eur(value) : `${value} %`}
                </div>
                <input type="range" min={min} max={max} step={stepSize} value={value}
                    onChange={(e) => set(step.id, Number(e.target.value))}
                    aria-label={step.title}
                    style={{ width: "100%", accentColor: accent, height: 28, cursor: "pointer" }} />
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: muted, fontVariantNumeric: "tabular-nums" }}>
                    <span>{isWert ? eur(min) : `${min} %`}</span><span>{isWert ? eur(max) : `${max} %`}</span>
                </div>
                {isWert && <div style={{ fontSize: 13, color: muted }}>Startwert: {gewerke.map((g) => `${GEWERK_LABEL[g]} ${eur(AUFTRAGSWERT_STANDARD[g])}`).join(" · ")}</div>}
            </div>
            <button onClick={() => { set(step.id, value); next() }} style={primaryBtn()}>Weiter <Icon name="pfeil" color="#fff" /></button>
        </>)
    } else if (step.kind === "region") {
        const land = answers.land || "DE"
        const plz = answers.plz || ""
        body = (<>
            {title(step.title, step.hint)}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {[["DE", "Deutschland"], ["AT", "Österreich"], ["CH", "Schweiz"]].map(([v, l]) => (
                    <button key={v} onClick={() => set("land", v)} aria-pressed={land === v} style={{ ...tile(land === v), width: "auto", minHeight: 0, padding: "12px 18px", fontSize: 15 }}>{l}</button>
                ))}
            </div>
            <label style={label}>PLZ-Bereich oder Region
                <input style={input} value={plz} inputMode="text" placeholder="z. B. 80–85 oder Oberösterreich" onChange={(e) => set("plz", e.target.value)} />
            </label>
            <button onClick={() => { set("land", land); next() }} disabled={!plz.trim()} style={primaryBtn(!plz.trim())}>Auswertung ansehen <Icon name="pfeil" color="#fff" /></button>
        </>)
    } else if (step.kind === "result") {
        body = (<>
            {title("Dein Umsatzpotenzial mit zusätzlichen Vor-Ort-Terminen")}
            <div style={{ background: ink, color: "#fff", borderRadius: 18, padding: "28px 24px", display: "flex", flexDirection: "column", gap: 6 }}>
                <span style={{ fontSize: 14, opacity: 0.7, fontWeight: 600 }}>Zusätzlicher Umsatz pro Monat</span>
                <span style={{ fontSize: "clamp(40px, 9vw, 64px)", fontWeight: 800, letterSpacing: "-0.035em", fontVariantNumeric: "tabular-nums", color: "#fff" }}>{eur(calc.umsatz)}</span>
                <span style={{ fontSize: 14, opacity: 0.75 }}>{calc.termine} Termine × {quote} % Abschlussquote = ca. {num(calc.auftraege)} Aufträge à {eur(auftragswert)}</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 }}>
                <Kpi label="Erwartete Aufträge / Monat" value={num(calc.auftraege)} ink={ink} line={line} muted={muted} />
                <Kpi label="Investition / Monat" value={calc.preisHinterlegt ? `ab ${eur(calc.investition)}` : "[___] €"} ink={ink} line={line} muted={muted} />
                <Kpi label="Kosten pro Auftrag" value={calc.preisHinterlegt ? `ca. ${eur(calc.kostenProAuftrag)}` : "[___] €"} ink={ink} line={line} muted={muted} />
            </div>
            <p style={{ margin: 0, fontSize: 17, lineHeight: 1.5, fontWeight: 600 }}>
                {calc.preisHinterlegt
                    ? <>Ein Auftrag kostet dich ca. <span style={{ color: accent }}>{eur(calc.kostenProAuftrag)}</span> – bei <span style={{ color: accent }}>{eur(auftragswert)}</span> Auftragswert.</>
                    : <>Ein Auftrag kostet dich ca. <span style={{ color: accent }}>[___] €</span> – bei <span style={{ color: accent }}>{eur(auftragswert)}</span> Auftragswert.</>}
            </p>
            <p style={{ margin: 0, fontSize: 13, color: muted, lineHeight: 1.5 }}>
                Grobe Schätzung auf Basis deiner Angaben. Ab-Preise pro Vor-Ort-Termin{WERBEBUDGET_AB > 0 ? `, empfohlenes Werbebudget ab ${eur(WERBEBUDGET_AB)}/Monat` : ", empfohlenes Werbebudget ab [___] €/Monat"}. Keine Garantie für Umsatz oder Abschlüsse.
            </p>
            <button onClick={next} style={primaryBtn()}>Auswertung & Gebietsprüfung anfordern <Icon name="pfeil" color="#fff" /></button>
        </>)
    } else if (step.kind === "contact") {
        body = <ContactStep du={du} title={title(step.title, du ? "Wir prüfen, ob dein Gebiet noch frei ist, und melden uns persönlich." : "Wir melden uns persönlich für ein vertrauliches Projektgespräch.")}
            input={input} label={label} primaryBtn={primaryBtn} accent={accent} muted={muted} datenschutzLink={datenschutzLink}
            status={status} onSubmit={submit} />
    }

    return (
        <section style={root} aria-label="Projekt-Check">
            {header}
            <div key={`${pfad}-${index}-${status}`} style={{ display: "flex", flexDirection: "column", gap: 22, animation: isStatic ? undefined : "pcFade .25s ease" }}>
                {body}
            </div>
            <style>{`@keyframes pcFade{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}} section[aria-label="Projekt-Check"] button:focus-visible, section[aria-label="Projekt-Check"] input:focus-visible{outline:3px solid ${hexA(accent, 0.45)};outline-offset:2px}`}</style>
        </section>
    )
}

function Kpi({ label, value, ink, line, muted }: { label: string; value: string; ink: string; line: string; muted: string }) {
    return (
        <div style={{ background: "#fff", border: `1.5px solid ${line}`, borderRadius: 14, padding: "16px 18px", display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={{ fontSize: 13, color: muted, fontWeight: 600 }}>{label}</span>
            <span style={{ fontSize: 24, fontWeight: 750, color: ink, letterSpacing: "-0.02em", fontVariantNumeric: "tabular-nums" }}>{value}</span>
        </div>
    )
}

function ContactStep(props: any) {
    const { du, title, input, label, primaryBtn, accent, muted, datenschutzLink, status, onSubmit } = props
    const [f, setF] = useState<Record<string, string>>({})
    const [ok, setOk] = useState(false)
    const upd = (k: string) => (e: any) => { const v = e.target.value; setF((x) => ({ ...x, [k]: v })) }
    const fields: [string, string, string, boolean][] = du
        ? [["name", "Name", "text", true], ["betrieb", "Betrieb", "text", true], ["telefon", "Telefon", "tel", true], ["email", "E-Mail", "email", true]]
        : [["firma", "Firma", "text", true], ["ansprechpartner", "Ansprechpartner", "text", true], ["position", "Position", "text", false], ["telefon", "Telefon", "tel", true], ["email", "E-Mail", "email", true]]
    const valid = fields.every(([k, , , req]) => !req || (f[k] || "").trim()) && /.+@.+\..+/.test(f.email || "") && ok
    return (
        <form onSubmit={(e) => { e.preventDefault(); if (valid) onSubmit({ ...f, datenschutzAkzeptiert: "ja" }) }} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {title}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 12 }}>
                {fields.map(([k, l, t, req]) => (
                    <label key={k} style={label}>{l}{req ? " *" : ""}
                        <input style={input} type={t} name={k} required={req} autoComplete={k === "email" ? "email" : k === "telefon" ? "tel" : k === "name" || k === "ansprechpartner" ? "name" : "organization"} value={f[k] || ""} onChange={upd(k)} />
                    </label>
                ))}
            </div>
            {!du && (
                <label style={label}>Ihr Anliegen (optional)
                    <textarea style={{ ...input, minHeight: 110, resize: "vertical" }} name="nachricht" value={f.nachricht || ""} onChange={upd("nachricht")} />
                </label>
            )}
            <label style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: 14, lineHeight: 1.5, color: muted, cursor: "pointer" }}>
                <input type="checkbox" checked={ok} onChange={(e) => setOk(e.target.checked)} style={{ width: 20, height: 20, accentColor: accent, marginTop: 1, flex: "0 0 20px" }} required />
                <span>Ich habe die <a href={datenschutzLink} target="_blank" rel="noreferrer" style={{ color: accent }}>Datenschutzerklärung</a> gelesen und bin einverstanden, dass meine Angaben zur Kontaktaufnahme verarbeitet werden. *</span>
            </label>
            {status === "error" && <p style={{ margin: 0, color: "#C0362C", fontSize: 14 }}>Senden hat nicht geklappt. Bitte erneut versuchen oder direkt anrufen.</p>}
            <button type="submit" disabled={!valid || status === "sending"} style={primaryBtn(!valid || status === "sending")}>
                {status === "sending" ? "Wird gesendet …" : du ? "Gebiet prüfen lassen" : "Projektgespräch anfragen"}
            </button>
        </form>
    )
}

function Booking({ accent, ink, surface }: { accent: string; ink: string; surface: string }) {
    if (CALENDLY_URL) {
        return <iframe title="Termin buchen" src={CALENDLY_URL} style={{ width: "100%", height: 680, border: "none", borderRadius: 14, background: "#fff" }} />
    }
    return (
        <div style={{ border: `2px dashed ${hexA(ink, 0.2)}`, borderRadius: 14, background: surface, padding: "32px 22px", textAlign: "center", color: hexA(ink, 0.6), fontSize: 14, lineHeight: 1.5 }}>
            <strong style={{ color: ink, display: "block", fontSize: 16, marginBottom: 6 }}>[Calendly-Terminbuchung]</strong>
            Platzhalter – Calendly-Link im Code unter CALENDLY_URL eintragen.
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

addPropertyControls(ProjektCheck, {
    accent: { type: ControlType.Color, title: "Akzent", defaultValue: "#12A150" },
    ink: { type: ControlType.Color, title: "Text", defaultValue: "#0E1726" },
    surface: { type: ControlType.Color, title: "Fläche", defaultValue: "#F4F5F2" },
    datenschutzLink: { type: ControlType.Link, title: "Datenschutz", defaultValue: "/datenschutz" },
})
