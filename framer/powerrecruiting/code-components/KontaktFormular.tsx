import { addPropertyControls, ControlType } from "framer"
import { useState, startTransition, type CSSProperties } from "react"

/** Webhook für Formular-Anfragen (z. B. Make). Platzhalter ersetzen! */
const WEBHOOK_URL = "https://hook.eu1.make.com/PLATZHALTER-WEBHOOK-ID"

interface KontaktFormularProps {
    pfad: string
    buttonText: string
    datenschutzLink: string
    accent: string
    ink: string
    style?: CSSProperties
}

/**
 * Kontaktformular (sendet JSON an Webhook)
 *
 * @framerIntrinsicWidth 560
 * @framerIntrinsicHeight 520
 *
 * @framerSupportedLayoutWidth any-prefer-fixed
 * @framerSupportedLayoutHeight auto
 */
export default function KontaktFormular(props: KontaktFormularProps) {
    const { pfad = "recruiting", buttonText = "Gespräch anfragen", datenschutzLink = "/datenschutz", accent = "#12A150", ink = "#0E1726" } = props
    const [f, setF] = useState<Record<string, string>>({})
    const [ok, setOk] = useState(false)
    const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle")
    const line = "rgba(14,23,38,0.14)"
    const muted = "rgba(14,23,38,0.62)"
    const valid = ["name", "betrieb", "telefon", "email"].every((k) => (f[k] || "").trim()) && /.+@.+\..+/.test(f.email || "") && ok

    const input: CSSProperties = { width: "100%", boxSizing: "border-box", padding: "14px 16px", borderRadius: 12, border: `1.5px solid ${line}`, fontFamily: "inherit", fontSize: 16, color: ink, background: "#fff" }
    const label: CSSProperties = { fontSize: 13, fontWeight: 600, color: muted, display: "flex", flexDirection: "column", gap: 6 }
    const upd = (k: string) => (e: any) => { const v = e.target.value; setF((x) => ({ ...x, [k]: v })) }

    async function submit(e: any) {
        e.preventDefault()
        if (!valid) return
        startTransition(() => setStatus("sending"))
        const payload = { pfad, kontakt: { ...f, datenschutzAkzeptiert: "ja" }, quelle: typeof window !== "undefined" ? window.location.href : "", zeitpunkt: new Date().toISOString() }
        try {
            if (WEBHOOK_URL.indexOf("PLATZHALTER") === -1) {
                const r = await fetch(WEBHOOK_URL, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
                if (!r.ok) throw new Error(String(r.status))
            } else console.warn("Kontaktformular: Webhook-URL ist noch ein Platzhalter. Payload:", payload)
            startTransition(() => setStatus("done"))
        } catch (err) {
            startTransition(() => setStatus("error"))
        }
    }

    if (status === "done") {
        return (
            <div style={{ ...props.style, position: "relative", fontFamily: "Inter, system-ui, sans-serif", color: ink, background: "#fff", border: `1px solid ${line}`, borderRadius: 16, padding: 24, display: "flex", flexDirection: "column", gap: 8 }}>
                <strong style={{ fontSize: 20 }}>Danke – wir melden uns.</strong>
                <span style={{ fontSize: 15, color: muted, lineHeight: 1.5 }}>Wir rufen dich innerhalb von 24 Stunden (werktags) zurück.</span>
            </div>
        )
    }

    return (
        <form onSubmit={submit} style={{ ...props.style, position: "relative", fontFamily: "Inter, system-ui, sans-serif", color: ink, display: "flex", flexDirection: "column", gap: 14, boxSizing: "border-box", width: "100%" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
                {([["name", "Name", "text", "name"], ["betrieb", "Betrieb", "text", "organization"], ["telefon", "Telefon", "tel", "tel"], ["email", "E-Mail", "email", "email"]] as const).map(([k, l, t, ac]) => (
                    <label key={k} style={label}>{l} *
                        <input style={input} type={t} name={k} autoComplete={ac} required value={f[k] || ""} onChange={upd(k)} />
                    </label>
                ))}
            </div>
            <label style={label}>Welche Stellen willst du besetzen? (optional)
                <textarea style={{ ...input, minHeight: 100, resize: "vertical" }} name="nachricht" value={f.nachricht || ""} onChange={upd("nachricht")} />
            </label>
            <label style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: 14, lineHeight: 1.5, color: muted, cursor: "pointer" }}>
                <input type="checkbox" required checked={ok} onChange={(e) => setOk(e.target.checked)} style={{ width: 20, height: 20, accentColor: accent, marginTop: 1, flex: "0 0 20px" }} />
                <span>Ich habe die <a href={datenschutzLink} target="_blank" rel="noreferrer" style={{ color: accent }}>Datenschutzerklärung</a> gelesen und bin mit der Verarbeitung meiner Angaben zur Kontaktaufnahme einverstanden. *</span>
            </label>
            {status === "error" && <span style={{ color: "#C0362C", fontSize: 14 }}>Senden hat nicht geklappt. Bitte erneut versuchen.</span>}
            <button type="submit" disabled={!valid || status === "sending"} style={{ alignSelf: "flex-start", padding: "16px 26px", borderRadius: 12, border: "none", background: !valid ? "rgba(14,23,38,0.2)" : accent, color: "#fff", fontFamily: "inherit", fontSize: 16, fontWeight: 650, cursor: valid ? "pointer" : "not-allowed" }}>
                {status === "sending" ? "Wird gesendet …" : buttonText}
            </button>
        </form>
    )
}

addPropertyControls(KontaktFormular, {
    pfad: { type: ControlType.String, title: "Pfad (Webhook)", defaultValue: "recruiting" },
    buttonText: { type: ControlType.String, title: "Button", defaultValue: "Gespräch anfragen" },
    datenschutzLink: { type: ControlType.Link, title: "Datenschutz", defaultValue: "/datenschutz" },
    accent: { type: ControlType.Color, title: "Akzent", defaultValue: "#12A150" },
    ink: { type: ControlType.Color, title: "Text", defaultValue: "#0E1726" },
})
