import { useState, useEffect, useRef } from "react"
import * as FramerLib from "framer"
import { addPropertyControls, ControlType } from "framer"

// Framers eigener Formular-Container (derselbe wie beim Kontaktformular). Er steht nicht in den
// öffentlichen Typen, deshalb defensiv: fehlt er, zeigt der Funnel den Fehlerhinweis statt eines Danke.
const FormContainer: any = (FramerLib as any).FormContainer

/** Framer-Formular von /kontakt – Anfragen landen am selben Ziel (Framer › Formular › „Send To“). */
const FORM_KONTAKT = "https://api.framer.com/forms/v1/forms/e58beef6-2917-4245-8c1d-f10c3a49a28e/submit"

/**
 * ED Elektro & Klimatechnik – Klimaanlagen-Angebotsfunnel
 *
 * Führt durch 8 Fragen, zeigt danach eine Preisspanne auf Basis der
 * Preisübersicht (Stand: Meeting 23.09.2026) und nimmt anschließend die Kontaktdaten auf.
 *
 * Die Preise sind über die Eigenschaften editierbar, damit sie ohne
 * Code-Änderung aktualisiert werden können.
 *
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight auto
 * @framerIntrinsicWidth 1080
 * @framerIntrinsicHeight 720
 */
export default function KlimaFunnel(props) {
    const {
        accent = "#1D5BCF",
        kopfbereichZeigen = true,
        auszeichnung = "Klimaanlagen-Angebot",
        h1 = "Ihre Preisorientierung in zwei Minuten",
        unterzeile = "Sieben kurze Fragen zu Ihren Räumen – danach sehen Sie sofort, in welcher Preisspanne Ihre Anlage liegt und was darin enthalten ist.",
        claims = DEFAULT_CLAIMS,
        p1Lo = 2800, p1Hi = 3200,
        p2Lo = 4000, p2Hi = 4400,
        p3Lo = 6000, p3Hi = 6400,
        p4Lo = 7700, p4Hi = 8100,
        premiumAufschlag = 25,
        mwst = 19,
        zGrossRaum = 400, zGeruest = 290, zDach = 720, zKanal = 30, meterProGeraet = 3,
        leadWert = 712,
        formAction = FORM_KONTAKT,
        webhookUrl = "",
        // Geräteauswahl. Standardmäßig AUS: Die Serienübersicht steht als
        // eigenes Modul auf der Landingpage. Dieser Schritt lässt sich über
        // die Eigenschaft wieder zuschalten, falls die Abfrage doch in den
        // Funnel soll.
        serienAktiv = false,
        serienTitel = "Welche Geräteserie soll es werden?",
        serienUnter = "Wir sind an keinen Hersteller gebunden. Auf Wunsch liefern wir auch andere Marken – der Preis kann dann abweichen.",
        s1Label = "Buderus Logacool ER", s1Hinweis = "Einstiegsserie · unsere Hausmarke", s1Bild,
        s2Label = "Buderus Logacool AC 186", s2Hinweis = "Premiumserie · unsere Hausmarke", s2Bild,
        s3Label = "Mitsubishi MSZ-HR", s3Hinweis = "Einstiegsserie", s3Bild,
        s4Label = "Mitsubishi MSZ-AY", s4Hinweis = "Gehobene Standardserie", s4Bild,
        s5Label = "Noch unentschieden", s5Hinweis = "Wir empfehlen im Gespräch", s5Bild,
        style,
    } = props

    const BASIS = {
        "1": { lo: p1Lo, hi: p1Hi, label: "1 Innengerät + 1 Außengerät" },
        "2": { lo: p2Lo, hi: p2Hi, label: "2 Innengeräte + 1 Außengerät" },
        "3": { lo: p3Lo, hi: p3Hi, label: "3 Innengeräte + 1 Außengerät" },
        "4": { lo: p4Lo, hi: p4Hi, label: "4 Innengeräte + 1 Außengerät" },
    }
    const ZUSCHLAG = { grossRaum: zGrossRaum, geruest: zGeruest, dach: zDach, kanalProMeter: zKanal, meterProGeraet, premium: premiumAufschlag }

    const [index, setIndex] = useState(0)
    const [a, setA] = useState({})
    const [contact, setContact] = useState({
        art: "privat", name: "", firma: "", plz: "", ort: "", tel: "", mail: "",
    })
    const [fehler, setFehler] = useState({})
    const [sendet, setSendet] = useState(false)
    const [sendFehler, setSendFehler] = useState(false)
    const gestartet = useRef(false)
    // Versand über das Framer-Formular (gleiches Ziel wie /kontakt)
    const formRef = useRef<HTMLFormElement>(null)
    const [formDaten, setFormDaten] = useState<Record<string, string> | null>(null)
    const sendeTimer = useRef<any>(null)
    const [fertig, setFertig] = useState(false)
    const [phase, setPhase] = useState("fragen") // fragen | rechnet | ergebnis | kontakt

    // Die Geräteserie kommt aus den Eigenschaften, damit Bilder und
    // Bezeichnungen ohne Code-Änderung gepflegt werden können.
    const serienFrage = {
        id: "serie",
        kurz: "Geräteserie",
        titel: serienTitel,
        unter: serienUnter,
        optionen: [
            { id: "logacool-er", label: s1Label, hinweis: s1Hinweis, bild: s1Bild, icon: "room" },
            { id: "logacool-ac186", label: s2Label, hinweis: s2Hinweis, bild: s2Bild, icon: "room" },
            { id: "msz-hr", label: s3Label, hinweis: s3Hinweis, bild: s3Bild, icon: "room" },
            { id: "msz-ay", label: s4Label, hinweis: s4Hinweis, bild: s4Bild, icon: "room" },
            { id: "egal", label: s5Label, hinweis: s5Hinweis, bild: s5Bild, icon: "question" },
        ].filter((o) => o.label),
    }
    const fragen = serienAktiv ? [...FRAGEN, serienFrage] : FRAGEN

    const total = fragen.length

    useEffect(() => {
        if (phase !== "rechnet") return
        const t = setTimeout(() => {
            setPhase("ergebnis")
            const k = berechne(a, BASIS, premiumAufschlag, mwst, ZUSCHLAG)
            track("calculator_result", k.individuell
                ? { calc_individuell: true }
                : { calc_netto_von: k.lo, calc_netto_bis: k.hi, calc_raeume: a.raeume?.id, calc_nutzung: a.nutzung?.id })
        }, 1900)
        return () => clearTimeout(t)
    }, [phase])

    function waehle(id, option) {
        if (!gestartet.current) {
            gestartet.current = true
            track("calculator_start", { calc_erste_frage: id })
        }
        const next = { ...a, [id]: option }
        setA(next)
        if (index + 1 >= total) setPhase("rechnet")
        else setIndex(index + 1)
    }

    function zurueck() {
        if (phase === "kontakt") { setPhase("ergebnis"); return }
        if (phase === "ergebnis") { setPhase("fragen"); setIndex(total - 1); return }
        setIndex((i) => Math.max(0, i - 1))
    }

    function neuStarten() {
        setA({}); setIndex(0); setPhase("fragen"); setFertig(false); setFehler({}); setSendFehler(false)
        gestartet.current = false
        setContact({ art: "privat", name: "", firma: "", plz: "", ort: "", tel: "", mail: "" })
    }

    const kalk = berechne(a, BASIS, premiumAufschlag, mwst, ZUSCHLAG)

    async function absenden() {
        const f = {}
        if (!contact.name.trim()) f.name = "Bitte geben Sie Ihren Namen an."
        if (contact.art === "gewerbe" && !contact.firma.trim()) f.firma = "Bitte geben Sie Ihre Firma an."
        if (!/^\d{5}$/.test(contact.plz.trim())) f.plz = "Bitte eine gültige Postleitzahl."
        if (!contact.ort.trim()) f.ort = "Bitte geben Sie den Ort an."
        if (contact.tel.replace(/[^\d]/g, "").length < 6) f.tel = "Bitte eine gültige Telefonnummer."
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(contact.mail.trim())) f.mail = "Bitte eine gültige E-Mail-Adresse."
        setFehler(f)
        if (Object.keys(f).length) return

        // Flache Feldnamen, damit die Anfrage in FormSpark-Mails und später in Monday.com lesbar ankommt
        const payload = {
            Anfrage: "Klimaanlage",
            ...Object.fromEntries(fragen.map((fr) => [fr.kurz, a[fr.id]?.label ?? "–"])),
            "Richtwert netto": kalk.individuell ? "individuelles Angebot (mehr als 4 Innengeräte)" : `${euro(kalk.lo)} – ${euro(kalk.hi)}`,
            "Richtwert brutto": kalk.individuell ? "–" : `${euro(kalk.loB)} – ${euro(kalk.hiB)}`,
            "Enthaltene Zuschläge": kalk.zuschlaege?.length ? kalk.zuschlaege.map((z) => `${z.label} ${euro(z.betrag)}`).join(", ") : "keine",
            Leistungsverzeichnis: kalk.verzeichnis ? kalk.verzeichnis.enthalten.map((p) => p.text).join(" · ") : "–",
            Kundenart: contact.art === "gewerbe" ? "Gewerbe" : "Privat",
            Name: contact.name,
            Firma: contact.firma || "–",
            PLZ: contact.plz,
            Ort: contact.ort,
            Telefon: contact.tel,
            "E-Mail": contact.mail,
            Zeitpunkt: new Date().toISOString(),
        }

        if (!formAction && !webhookUrl) {
            // Testmodus: kein Versand und bewusst kein Conversion-Event
            console.log("Klima-Funnel-Anfrage (kein Ziel hinterlegt):", payload)
            setFertig(true)
            return
        }

        setSendet(true)
        setSendFehler(false)

        if (webhookUrl) {
            // Optional zusätzlich an einen Webhook (z. B. CRM); blockiert den Versand nicht
            fetch(webhookUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json", Accept: "application/json" },
                body: JSON.stringify(payload),
            }).catch((e) => console.error("Klima-Funnel: Webhook fehlgeschlagen", e))
            if (!formAction) { versandOk(); return }
        }

        if (!FormContainer) { versandFehler(new Error("FormContainer nicht verfügbar")); return }

        // Hidden-Felder rendern, danach sendet der Effekt unten das Framer-Formular ab
        setFormDaten(Object.fromEntries(Object.entries(payload).map(([k, v]) => [k, String(v ?? "")])))
        clearTimeout(sendeTimer.current)
        // Framer ruft weder onSuccess noch onError, wenn das Formular nicht senden kann (z. B. in der Vorschau)
        sendeTimer.current = setTimeout(() => versandFehler(new Error("Zeitüberschreitung")), 30000)
    }

    useEffect(() => {
        if (formDaten && formRef.current) formRef.current.requestSubmit()
    }, [formDaten])

    useEffect(() => () => clearTimeout(sendeTimer.current), [])

    function versandOk() {
        clearTimeout(sendeTimer.current)
        track("lead_submit", { value: leadWert, currency: "EUR", calc_raeume: a.raeume?.id })
        setSendet(false)
        setFormDaten(null)
        setFertig(true)
    }

    function versandFehler(e) {
        // Kein Danke-Screen bei Fehler – sonst gehen Anfragen unbemerkt verloren
        clearTimeout(sendeTimer.current)
        console.error("Klima-Funnel: Versand fehlgeschlagen", e)
        setSendet(false)
        setFormDaten(null)
        setSendFehler(true)
    }

    const schritt = fragen[index]
    const zeigeKopf = !fertig && (phase !== "rechnet")
    const fortschritt = fertig ? 100
        : phase === "ergebnis" || phase === "kontakt" ? 100
        : Math.round((index / total) * 100)

    return (
        <div className="edk2" style={{ ...style, ...S.root, ["--edk-accent" as any]: accent }}>
            <style>{CSS}</style>

            {kopfbereichZeigen && (
                <header className="edk2-intro" aria-label="Einführung Preisrechner">
                    {auszeichnung ? <p className="edk2-eyebrow">{auszeichnung}</p> : null}
                    {h1 ? <h1 className="edk2-h1">{h1}</h1> : null}
                    {unterzeile ? <p className="edk2-subline">{unterzeile}</p> : null}
                    {claims?.length ? (
                        <ul className="edk2-claims">
                            {claims.filter((c) => c?.text).map((c, i) => (
                                <li key={i}>
                                    <span className="edk2-claim-ic" aria-hidden="true">
                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                            <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.4" />
                                            <path d="M4.6 8.2 7 10.5l4.5-4.8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </span>
                                    <span>{c.text}</span>
                                </li>
                            ))}
                        </ul>
                    ) : null}
                </header>
            )}

            {zeigeKopf && (index > 0 || phase !== "fragen") && (
                <div style={S.bar}>
                    <button className="edk2-ghost" onClick={zurueck} type="button">
                        <Chev dir="left" /> Zurück
                    </button>
                    <span style={S.zaehler}>
                        {phase === "fragen" ? `Schritt ${index + 1} von ${total}` : phase === "ergebnis" ? "Ihre Preisorientierung" : "Kontaktdaten"}
                    </span>
                    <button className="edk2-ghost" onClick={neuStarten} type="button">Neu starten</button>
                </div>
            )}
            {zeigeKopf && (
                <div style={S.track}><div style={{ ...S.fill, width: fortschritt + "%" }} /></div>
            )}

            <div style={S.buehne}>
                {fertig ? (
                    <Danke onNeu={neuStarten} />
                ) : phase === "rechnet" ? (
                    <Rechnet />
                ) : phase === "ergebnis" ? (
                    <Ergebnis kalk={kalk} a={a} mwst={mwst} onWeiter={() => setPhase("kontakt")} />
                ) : phase === "kontakt" ? (
                    <Kontakt c={contact} fehler={fehler} sendet={sendet} sendFehler={sendFehler}
                        onChange={(p) => setContact((c) => ({ ...c, ...p }))} onSubmit={absenden} kalk={kalk} />
                ) : (
                    <Frage f={schritt} gewaehlt={a[schritt.id]} onWahl={(o) => waehle(schritt.id, o)} />
                )}
            {formAction && FormContainer && (
                <FormContainer ref={formRef} action={formAction} onSuccess={versandOk} onError={() => versandFehler(new Error("Framer-Formular"))}
                    style={{ display: "none" }} aria-hidden="true">
                    {() => (
                        <>
                            {formDaten && Object.entries(formDaten).map(([k, v]) => <input key={k} type="hidden" name={k} value={v} readOnly />)}
                        </>
                    )}
                </FormContainer>
            )}
            </div>
        </div>
    )
}

/* ------------------------------------------------------------------ Fragen */

const FRAGEN = [
    {
        id: "raeume",
        kurz: "Innengeräte",
        titel: "Wie viele Räume sollen klimatisiert werden?",
        unter: "Jeder Raum bekommt ein Innengerät. Im Beratungsgespräch lässt sich das noch anpassen.",
        optionen: [
            { id: "1", label: "1 Raum", hinweis: "1 Innengerät", icon: "room" },
            { id: "2", label: "2 Räume", hinweis: "2 Innengeräte", icon: "rooms" },
            { id: "3", label: "3 Räume", hinweis: "3 Innengeräte", icon: "rooms3" },
            { id: "4", label: "4 Räume", hinweis: "4 Innengeräte", icon: "building" },
            { id: "5plus", label: "5 oder mehr", hinweis: "planen wir individuell", icon: "building" },
        ],
    },
    {
        id: "grossraum",
        kurz: "Raum über 40 m²",
        titel: "Ist einer der Räume größer als 40 Quadratmeter?",
        unter: "Große Räume brauchen ein stärkeres Innengerät mit 5,3 kW.",
        optionen: [
            { id: "ja", label: "Ja", icon: "ruler" },
            { id: "nein", label: "Nein", icon: "room" },
            { id: "unbekannt", label: "Weiß ich nicht", icon: "question" },
        ],
    },
    {
        id: "etage",
        kurz: "Geschoss",
        titel: "In welchem Geschoss sollen die Innengeräte hängen?",
        unter: "Ab dem ersten Obergeschoss arbeiten wir mit unserem eigenen Gerüst.",
        optionen: [
            { id: "eg", label: "Erdgeschoss", icon: "house" },
            { id: "og1", label: "1. Obergeschoss", icon: "building" },
            { id: "og2", label: "2. OG oder höher", icon: "building" },
            { id: "verteilt", label: "Auf mehrere Etagen verteilt", icon: "rooms" },
        ],
    },
    {
        id: "aussengeraet",
        kurz: "Außengerät",
        titel: "Wo soll das Außengerät stehen?",
        unter: "An der Hauswand ist die Montage am einfachsten, auf dem Dach deutlich aufwendiger.",
        optionen: [
            { id: "wand", label: "An der Hauswand", icon: "brick" },
            { id: "boden", label: "Auf dem Boden oder Fundament", icon: "house" },
            { id: "dach", label: "Auf dem Dach", icon: "roof" },
            { id: "unbekannt", label: "Weiß ich noch nicht", icon: "question" },
        ],
    },
    {
        id: "entfernung",
        kurz: "Leitungsweg",
        titel: "Wie weit ist das Außengerät ungefähr von den Innengeräten entfernt?",
        unter: "Eine grobe Schätzung genügt. Ohne Angabe rechnen wir mit drei Metern je Gerät.",
        optionen: [
            { id: "m3", label: "Bis 3 Meter", icon: "ruler" },
            { id: "m5", label: "Etwa 5 Meter", icon: "ruler" },
            { id: "m10", label: "Etwa 10 Meter", icon: "ruler" },
            { id: "mehr", label: "Mehr als 10 Meter", icon: "ruler" },
            { id: "unbekannt", label: "Weiß ich nicht", icon: "question" },
        ],
    },
    {
        id: "nutzung",
        kurz: "Nutzung",
        titel: "Wofür soll die Anlage sorgen?",
        unter: "Danach richtet sich, welches Gerät wir einplanen.",
        optionen: [
            { id: "kuehlen", label: "Nur kühlen", hinweis: "Standardgerät reicht aus", icon: "snow" },
            { id: "uebergang", label: "Kühlen und zeitweise heizen", hinweis: "dieselbe Anlage, heizt an kühlen Herbsttagen mit", icon: "thermo" },
            { id: "heizersatz", label: "Heizungsersatz im Winter", hinweis: "leistungsstärkere Geräteserie nötig", icon: "flame" },
        ],
    },
    {
        id: "zeitraum",
        kurz: "Zeitraum",
        titel: "Wann soll die Anlage eingebaut werden?",
        unter: "So können wir Ihnen einen realistischen Termin nennen.",
        optionen: [
            { id: "sofort", label: "So schnell wie möglich", icon: "bolt" },
            { id: "3monate", label: "In den nächsten 3 Monaten", icon: "cal" },
            { id: "jahr", label: "Im Lauf des Jahres", icon: "cal" },
            { id: "info", label: "Erst mal nur informieren", icon: "question" },
        ],
    },
]

/* ------------------------------------------------------------- Kalkulation */

function berechne(a, BASIS, aufschlagProzent, mwstProzent, Z = {}) {
    const raeume = a.raeume?.id
    if (!raeume) return { leer: true, zuschlaege: [] }
    if (raeume === "5plus") return { individuell: true, zuschlaege: [] }

    const basis = BASIS[raeume]
    if (!basis) return { individuell: true, zuschlaege: [] }

    const geraete = Number(raeume)
    const gross = a.grossraum?.id === "ja"
    const geruest = ["og1", "og2", "verteilt"].includes(a.etage?.id)
    const dach = a.aussengeraet?.id === "dach"
    const heizersatz = a.nutzung?.id === "heizersatz"

    // Heizungsersatz braucht die leistungsstärkere Serie (Logacool AC186i.3)
    const faktor = heizersatz ? 1 + (Z.premium ?? aufschlagProzent) / 100 : 1

    // Kabelkanal: Angabe des Kunden, sonst Pauschale je Innengerät
    const pauschale = Z.meterProGeraet ?? 3
    const meterTabelle = { m3: 3, m5: 5, m10: 10, mehr: 12, unbekannt: pauschale }
    const meterJeGeraet = meterTabelle[a.entfernung?.id] ?? pauschale
    const meterGesamt = meterJeGeraet * geraete
    // Bis 10 m Leitungsweg je Innengerät steckt die Pauschale bereits im
    // Grundpreis (Meeting 23.09.2026). Berechnet wird nur, was darüber liegt.
    const FREI_JE_GERAET = 10
    const meterBerechnet = Math.max(0, meterJeGeraet - FREI_JE_GERAET) * geraete

    const zuschlaege = []
    if (gross && Z.grossRaum > 0) zuschlaege.push({ label: "stärkeres Innengerät 5,3 kW", betrag: Z.grossRaum })
    if (geruest && Z.geruest > 0) zuschlaege.push({ label: "Gerüst", betrag: Z.geruest })
    if (dach && Z.dach > 0) zuschlaege.push({ label: "Dachmontage Außengerät", betrag: Z.dach })
    if (Z.kanalProMeter > 0 && meterBerechnet > 0)
        zuschlaege.push({ label: `Leitungsweg über ${FREI_JE_GERAET} m je Gerät: ${meterBerechnet} m`, betrag: meterBerechnet * Z.kanalProMeter })
    const summe = zuschlaege.reduce((acc, z) => acc + z.betrag, 0)

    const lo = Math.round((basis.lo * faktor) / 10) * 10 + summe
    const hi = Math.round((basis.hi * faktor) / 10) * 10 + summe

    // Leistungsverzeichnis bewusst ohne Einzelpreise: Es soll zeigen,
    // dass die Angaben des Kunden berücksichtigt wurden.
    const enthalten: { text: string; grund?: string }[] = [
        { text: `Klimaanlage mit ${geraete} Innengerät${geraete > 1 ? "en" : ""} und passender Außeneinheit` },
    ]
    if (a.serie && a.serie.id !== "egal")
        enthalten.push({ text: `Geräteserie ${a.serie.label}`, grund: "Ihre Auswahl" })
    if (gross) enthalten.push({ text: "Stärkeres Innengerät mit 5,3 kW", grund: "Raum über 40 m²" })
    if (heizersatz) enthalten.push({ text: "Leistungsstärkere Geräteserie", grund: "Heizungsersatz im Winter" })
    enthalten.push({ text: "Montage, Druckprüfung, Vakuumierung und Inbetriebnahme" })
    enthalten.push({ text: `Leitungsweg rund ${meterJeGeraet} m je Innengerät – bis ${FREI_JE_GERAET} m ist die Pauschale enthalten`, grund: a.entfernung?.label })
    enthalten.push({ text: "Kernbohrung in Ziegel oder Mauerwerk" })
    enthalten.push(geraete >= 3
        ? { text: "Eigene Zuleitung mit Sicherung ab Verteilerkasten", grund: "ab 3 Innengeräten reicht eine Steckdose nicht mehr" }
        : { text: "Anschluss an vorhandene Steckdose oder Stromquelle" })
    if (geruest) enthalten.push({ text: "Gerüst", grund: a.etage?.label })
    if (dach) enthalten.push({ text: "Dachmontage des Außengeräts", grund: "Außengerät auf dem Dach" })
    enthalten.push({ text: "Einweisung und Übergabe" })

    const vorOrt: string[] = ["Der genaue Leitungsweg, oft lassen sich Kanäle zusammenlegen"]
    if (!geruest) vorOrt.push("Ob für die Montagehöhe ein Gerüst nötig wird")
    if (dach || a.aussengeraet?.id === "unbekannt") vorOrt.push("Montagehöhe des Außengeräts über vier Metern, dann wird das Gerüst zweimal gestellt")
    if (a.entfernung?.id === "mehr") vorOrt.push("Die tatsächliche Länge, vorläufig rechnen wir mit zwölf Metern je Gerät")

    return {
        lo, hi,
        loB: Math.round(lo * (1 + mwstProzent / 100)),
        hiB: Math.round(hi * (1 + mwstProzent / 100)),
        basisLabel: basis.label,
        geraete, meterGesamt, heizersatz,
        zuschlaege,
        verzeichnis: { enthalten, vorOrt },
    }
}

function track(event, params = {}) {
    if (typeof window === "undefined") return
    const w = window
    w["dataLayer"] = w["dataLayer"] || []
    w["dataLayer"].push({ event, funnel: "klima", ...params })
}

const euro = (n) => n.toLocaleString("de-DE") + "\u00A0€"

/* ------------------------------------------------------------------ Views */

function Frage({ f, gewaehlt, onWahl }) {
    const spalten = f.optionen.length <= 3 ? f.optionen.length : f.optionen.length === 5 ? 3 : 4
    return (
        <div style={S.inner}>
            <h2 style={S.titel}>{f.titel}</h2>
            {f.unter && <p style={S.unter}>{f.unter}</p>}
            <div className="edk2-grid" style={{
                ...S.grid,
                gridTemplateColumns: `repeat(${spalten}, minmax(0, 1fr))`,
                maxWidth: spalten * 250,
            }}>
                {f.optionen.map((o) => (
                    <button key={o.id} type="button"
                        className={"edk2-card" + (gewaehlt?.id === o.id ? " edk2-card-on" : "")}
                        onClick={() => onWahl(o)}>
                        {o.bild?.src ? (
                            <span className="edk2-bild">
                                <img src={o.bild.src} srcSet={o.bild.srcSet} alt={o.bild.alt || o.label} loading="lazy" decoding="async" />
                            </span>
                        ) : (
                            <span className="edk2-ic"><Ic n={o.icon} /></span>
                        )}
                        <span className="edk2-lab">{o.label}</span>
                        {o.hinweis && <span className="edk2-hint">{o.hinweis}</span>}
                    </button>
                ))}
            </div>
        </div>
    )
}

function Rechnet() {
    return (
        <div style={{ ...S.inner, maxWidth: 560, alignItems: "center", textAlign: "center" }}>
            <span className="edk2-spin" />
            <h2 style={{ ...S.titel, marginTop: 26 }}>Wir stellen Ihre Preisorientierung zusammen …</h2>
            <p style={S.unter}>Einen Moment – wir gleichen Ihre Angaben mit unserer Preisübersicht ab.</p>
        </div>
    )
}

function Ergebnis({ kalk, a, mwst, onWeiter }) {
    if (kalk.individuell) {
        return (
            <div style={{ ...S.inner, maxWidth: 640 }}>
                <h2 style={{ ...S.titel, textAlign: "left" }}>Ihre Anlage planen wir individuell</h2>
                <p style={{ ...S.unter, textAlign: "left", margin: "12px 0 0" }}>
                    Ab fünf Innengeräten ist es keine Standardanlage mehr. Der Preis hängt dann so stark
                    von der Aufteilung ab, dass eine pauschale Spanne Ihnen nicht weiterhelfen würde.
                    Wir rechnen Ihnen das sauber durch – kostenlos und unverbindlich.
                </p>
                <button className="edk2-prim" type="button" onClick={onWeiter} style={{ marginTop: 26 }}>
                    Angebot anfordern <Chev dir="right" />
                </button>
            </div>
        )
    }

    const v = kalk.verzeichnis
    return (
        <div style={{ ...S.inner, maxWidth: 940 }}>
            <h2 style={S.titel}>Ihre Preisorientierung</h2>
            <p style={S.unter}>
                {kalk.basisLabel}
                {kalk.heizersatz ? " · leistungsstärkere Serie für den Heizbetrieb" : ""}
            </p>

            <div className="edk2-preis">
                <span className="edk2-preis-lab">Richtwert netto</span>
                <span className="edk2-preis-zahl">{euro(kalk.lo)} – {euro(kalk.hi)}</span>
                <span className="edk2-preis-sub">
                    entspricht {euro(kalk.loB)} – {euro(kalk.hiB)} brutto inkl. {mwst} % MwSt · Anfahrt und Rüstzeit enthalten
                </span>
                <span className="edk2-tendenz">
                    Die Spanne ergibt sich aus den baulichen Gegebenheiten. Verbindlich wird der Preis
                    nach der kostenlosen Besichtigung vor Ort.
                </span>
            </div>

            <span className="edk2-lv-titel">Das haben wir für Sie eingerechnet</span>
            <div className="edk2-two">
                <div className="edk2-box">
                    <span className="edk2-box-t">Darin enthalten</span>
                    {v.enthalten.map((p, i) => (
                        <span key={i} className="edk2-li">
                            <Ic n="check" />
                            <span>
                                {p.text}
                                {p.grund && <em className="edk2-why">{p.grund}</em>}
                            </span>
                        </span>
                    ))}
                </div>
                <div className="edk2-box edk2-box-alt">
                    <span className="edk2-box-t">Klären wir vor Ort</span>
                    {v.vorOrt.map((t, i) => (
                        <span key={i} className="edk2-li edk2-li-off"><Ic n="question" /> <span>{t}</span></span>
                    ))}
                </div>
            </div>

            <p className="edk2-disclaimer">
                Diese Preisorientierung ist kein verbindliches Angebot. Ein verbindliches Festpreisangebot
                erhalten Sie nach einer kostenlosen Besichtigung vor Ort.
            </p>

            <button className="edk2-prim" type="button" onClick={onWeiter} style={{ marginTop: 22, maxWidth: 380 }}>
                Kostenloses Festpreisangebot anfordern <Chev dir="right" />
            </button>
        </div>
    )
}

function Kontakt({ c, fehler, sendet, sendFehler, onChange, onSubmit, kalk }) {
    return (
        <div style={{ ...S.inner, maxWidth: 560 }}>
            <h2 style={S.titel}>Fast geschafft – wohin dürfen wir das Angebot senden?</h2>
            <p style={S.unter}>
                {kalk.individuell
                    ? "Wir melden uns für die individuelle Planung bei Ihnen."
                    : "Wir prüfen Ihre Angaben und melden uns für den kostenlosen Vor-Ort-Termin."}
            </p>

            <div className="edk2-toggle">
                {[{ id: "privat", l: "Privat" }, { id: "gewerbe", l: "Gewerbe" }].map((t) => (
                    <button key={t.id} type="button"
                        className={"edk2-tg" + (c.art === t.id ? " edk2-tg-on" : "")}
                        onClick={() => onChange({ art: t.id })}>{t.l}</button>
                ))}
            </div>

            <Feld l="Ihr Name" id="k-name" v={c.name} e={fehler.name} ac="name" ph="Vor- und Nachname" on={(v) => onChange({ name: v })} />
            {c.art === "gewerbe" && (
                <Feld l="Firma" id="k-firma" v={c.firma} e={fehler.firma} ac="organization" ph="Firmenname" on={(v) => onChange({ firma: v })} />
            )}
            <div className="edk2-row">
                <Feld l="PLZ" id="k-plz" v={c.plz} e={fehler.plz} ac="postal-code" ph="55286" flex="0 0 130px"
                    on={(v) => onChange({ plz: v.replace(/[^\d]/g, "").slice(0, 5) })} />
                <Feld l="Ort" id="k-ort" v={c.ort} e={fehler.ort} ac="address-level2" ph="Wörrstadt" flex="1 1 auto"
                    on={(v) => onChange({ ort: v })} />
            </div>
            <Feld l="Telefonnummer" id="k-tel" t="tel" v={c.tel} e={fehler.tel} ac="tel" ph="Für kurze Rückfragen" on={(v) => onChange({ tel: v })} />
            <Feld l="E-Mail-Adresse" id="k-mail" t="email" v={c.mail} e={fehler.mail} ac="email" ph="name@beispiel.de" on={(v) => onChange({ mail: v })} />

            <button className="edk2-prim" type="button" onClick={onSubmit} disabled={sendet} style={{ marginTop: 22 }}>
                {sendet ? "Wird gesendet …" : "Angebot anfordern"}{!sendet && <Chev dir="right" />}
            </button>

            {sendFehler && (
                <div className="edk2-note edk2-note-warn" style={{ marginTop: 16 }}>
                    Ihre Anfrage konnte gerade nicht gesendet werden. Bitte versuchen Sie es noch einmal
                    oder rufen Sie uns direkt an: 06732 600 7358.
                </div>
            )}
            <ul className="edk2-trust">
                <li><Ic n="check" /> Kostenlos und unverbindlich</li>
                <li><Ic n="check" /> Eigene Monteure, keine Subunternehmer</li>
            </ul>
            <p className="edk2-legal">
                Mit dem Absenden stimmen Sie unserer Datenschutzerklärung zu. Ihre Daten werden vertraulich
                behandelt, ausschließlich zur Bearbeitung Ihrer Anfrage verwendet und nicht an Dritte
                weitergegeben.
            </p>
        </div>
    )
}

function Feld({ l, id, v, e, on, t = "text", ph, ac, flex }) {
    return (
        <div style={{ display: "flex", flexDirection: "column", marginTop: 16, flex: flex || "1 1 auto", minWidth: 0 }}>
            <label className="edk2-label" htmlFor={id}>{l}</label>
            <input id={id} type={t} className={"edk2-input" + (e ? " edk2-input-err" : "")} value={v}
                placeholder={ph} autoComplete={ac} onChange={(ev) => on(ev.target.value)} />
            {e && <span className="edk2-err">{e}</span>}
        </div>
    )
}

function Danke({ onNeu }) {
    return (
        <div style={{ ...S.inner, maxWidth: 560, alignItems: "center", textAlign: "center" }}>
            <span className="edk2-ok"><Ic n="check" /></span>
            <h2 style={{ ...S.titel, marginTop: 22 }}>Vielen Dank für Ihre Anfrage!</h2>
            <p style={S.unter}>
                Wir haben Ihre Angaben erhalten und melden uns zeitnah bei Ihnen, um den kostenlosen
                Vor-Ort-Termin abzustimmen.
            </p>
            <p className="edk2-tipp">
                Sie beschleunigen die Kalkulation, wenn Sie uns vorab zwei bis drei Fotos schicken – vom
                geplanten Innenraum und von der Außenwand. Einfach an <strong>projekt@ed-elektro.de</strong>.
            </p>
            <button className="edk2-sec" type="button" onClick={onNeu} style={{ marginTop: 22 }}>
                Neue Anfrage starten
            </button>
        </div>
    )
}

/* ------------------------------------------------------------------ Icons */

function Chev({ dir = "right" }) {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            {dir === "left" ? <polyline points="15 18 9 12 15 6" /> : <polyline points="9 18 15 12 9 6" />}
        </svg>
    )
}

function Ic({ n }) {
    const p = { width: 26, height: 26, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true }
    switch (n) {
        case "room": return <svg {...p}><rect x="3" y="4" width="18" height="16" rx="1" /><path d="M15 12h.01" /></svg>
        case "rooms": return <svg {...p}><rect x="3" y="4" width="8" height="16" rx="1" /><rect x="13" y="4" width="8" height="16" rx="1" /></svg>
        case "rooms3": return <svg {...p}><rect x="2" y="5" width="6" height="14" rx="1" /><rect x="9" y="5" width="6" height="14" rx="1" /><rect x="16" y="5" width="6" height="14" rx="1" /></svg>
        case "house": return <svg {...p}><path d="M3 9.5 12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z" /><polyline points="9 21 9 13 15 13 15 21" /></svg>
        case "roof": return <svg {...p}><path d="M2 12 12 4l10 8" /><path d="M5 12v8h14v-8" /><path d="M10 20v-5h4v5" /></svg>
        case "building": return <svg {...p}><rect x="4" y="3" width="16" height="18" rx="1" /><path d="M9 8h.01M15 8h.01M9 12h.01M15 12h.01M9 16h.01M15 16h.01" /></svg>
        case "store": return <svg {...p}><path d="M3 9 4.5 4h15L21 9" /><path d="M4 9v11a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V9" /><path d="M3 9a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0" /></svg>
        case "ruler": return <svg {...p}><path d="M3 15 15 3l6 6L9 21z" /><path d="M7 11l2 2M11 7l2 2M10 14l1.5 1.5" /></svg>
        case "brick": return <svg {...p}><rect x="3" y="5" width="18" height="14" rx="1" /><path d="M3 12h18M9 5v7M15 12v7" /></svg>
        case "snow": return <svg {...p}><path d="M12 2v20M4.2 7l15.6 10M19.8 7 4.2 17" /><path d="M12 6l-2-2M12 6l2-2M12 18l-2 2M12 18l2 2" /></svg>
        case "thermo": return <svg {...p}><path d="M10 13V5a2 2 0 1 1 4 0v8a4 4 0 1 1-4 0z" /></svg>
        case "flame": return <svg {...p}><path d="M12 22c4 0 7-2.7 7-6.5 0-4.5-4-6-4-10.5-3 2-5 4.5-5 7 0-1.5-1-2.5-2-3.5-1 2-3 4-3 7C5 19.3 8 22 12 22z" /></svg>
        case "star": return <svg {...p}><polygon points="12 2.5 15 9.2 22.2 10 16.8 14.8 18.4 22 12 18.3 5.6 22 7.2 14.8 1.8 10 9 9.2" /></svg>
        case "bolt": return <svg {...p}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
        case "cal": return <svg {...p}><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 11h18" /></svg>
        case "check": return <svg {...p} width="18" height="18"><polyline points="20 6 9 17 4 12" /></svg>
        case "minus": return <svg {...p} width="18" height="18"><path d="M5 12h14" /></svg>
        case "question":
        default: return <svg {...p}><circle cx="12" cy="12" r="9" /><path d="M9.5 9.5a2.5 2.5 0 1 1 3.4 2.3c-.6.3-.9.8-.9 1.4v.4" /><path d="M12 17h.01" /></svg>
    }
}

/* ----------------------------------------------------------------- Styles */

const S = {
    root: {
        width: "100%",
        fontFamily: "Figtree, Inter, -apple-system, BlinkMacSystemFont, sans-serif",
        color: "#444444", background: "#F0F4FA", borderRadius: 16,
        padding: "28px 24px 44px", boxSizing: "border-box",
        display: "flex", flexDirection: "column",
    },
    bar: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, maxWidth: 1080, width: "100%", margin: "0 auto" },
    zaehler: { fontSize: 14, fontWeight: 600, color: "#64748B", whiteSpace: "nowrap" },
    track: { maxWidth: 1080, width: "100%", margin: "16px auto 0", height: 4, borderRadius: 999, background: "#DDE5F1", overflow: "hidden" },
    fill: { height: "100%", borderRadius: 999, background: "var(--edk-accent)", transition: "width .35s ease" },
    buehne: { maxWidth: 1080, width: "100%", margin: "0 auto", paddingTop: 40, display: "flex", justifyContent: "center" },
    inner: { display: "flex", flexDirection: "column", width: "100%", alignItems: "stretch" },
    titel: { margin: 0, fontSize: "clamp(23px, 2.7vw, 34px)", lineHeight: 1.2, fontWeight: 700, color: "#000", textAlign: "center", letterSpacing: "-0.01em" },
    unter: { margin: "12px auto 0", maxWidth: 620, fontSize: 16, lineHeight: 1.6, color: "#444", textAlign: "center" },
    grid: { display: "grid", gap: 16, marginTop: 34, width: "100%", marginLeft: "auto", marginRight: "auto" },
}

const CSS = `
.edk2 { container-type: inline-size; }
.edk2 *, .edk2 *::before, .edk2 *::after { box-sizing: border-box; }
.edk2 button { font-family: inherit; }
.edk2-intro { max-width:1080px; width:100%; margin:0 auto; display:flex; flex-direction:column; align-items:center; text-align:center; }

.edk2-eyebrow { margin:0; color:var(--edk-accent); font-size:15px; line-height:1.3; font-weight:600; }
.edk2-h1 { margin:10px 0 0; max-width:24ch; color:#0F172A; font-size:clamp(31px,4vw,36px); line-height:1.1; letter-spacing:-0.02em; font-weight:700; text-wrap:balance; }
.edk2-subline { margin:14px auto 0; max-width:62ch; font-size:16px; line-height:1.6; color:#64748B; text-wrap:pretty; }
.edk2-claims { list-style:none; margin:18px 0 0; padding:0; display:flex; align-items:center; justify-content:center; flex-wrap:wrap; gap:10px 22px; max-width:920px; }
.edk2-claims li { display:inline-flex; align-items:center; gap:8px; color:#64748B; font-size:14px; line-height:1.45; }
.edk2-claim-ic { display:inline-flex; align-items:center; justify-content:center; width:18px; height:18px; color:var(--edk-accent); flex:0 0 auto; }

.edk2-ghost { white-space:nowrap; display:inline-flex; align-items:center; gap:6px; background:transparent; border:0; cursor:pointer;
  font-size:14px; font-weight:600; color:#64748B; padding:6px 8px; border-radius:8px; transition:color .15s, background .15s; }
.edk2-ghost:hover { color:var(--edk-accent); background:rgba(29,91,207,.07); }

.edk2-card { display:flex; flex-direction:column; align-items:center; justify-content:center; gap:10px; text-align:center;
  min-height:172px; padding:24px 18px; cursor:pointer; background:#fff; border:1px solid #E3E8F0; border-radius:14px;
  box-shadow:0 1px 2px rgba(15,23,42,.04); transition:transform .18s, box-shadow .18s, border-color .18s; }
.edk2-bild { display:flex; align-items:center; justify-content:center; width:100%; height:96px; margin-bottom:2px; }
.edk2-bild img { max-width:100%; max-height:100%; width:auto; height:auto; object-fit:contain; }
.edk2-card:hover { transform:translateY(-3px); border-color:var(--edk-accent); box-shadow:0 12px 24px -12px rgba(29,91,207,.35); }
.edk2-card:focus-visible { outline:2px solid var(--edk-accent); outline-offset:2px; }
.edk2-card-on { border-color:var(--edk-accent); box-shadow:0 0 0 2px rgba(29,91,207,.18); }
.edk2-ic { color:var(--edk-accent); display:flex; }
.edk2-lab { font-size:16px; font-weight:600; color:#0F172A; line-height:1.35; }
.edk2-hint { font-size:13px; color:#64748B; line-height:1.45; }

.edk2-preis { margin:30px auto 0; width:100%; max-width:640px; display:flex; flex-direction:column; align-items:center;
  gap:8px; padding:32px 26px; background:#fff; border:1px solid #E3E8F0; border-radius:16px; text-align:center; }
.edk2-preis-lab { font-size:13px; font-weight:700; letter-spacing:.06em; text-transform:uppercase; color:#64748B; }
.edk2-preis-zahl { font-size:clamp(28px,4vw,42px); font-weight:800; color:var(--edk-accent); font-variant-numeric:tabular-nums; line-height:1.15; white-space:nowrap; }
.edk2-preis-sub { font-size:15px; color:#475569; font-variant-numeric:tabular-nums; }
.edk2-tendenz { margin-top:10px; font-size:14px; line-height:1.55; color:#475569; max-width:460px; }

.edk2-lv-titel { margin:30px auto 0; font-size:17px; font-weight:700; color:#0F172A; text-align:center; }
.edk2-three { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:16px; width:100%; max-width:940px; margin:16px auto 0; }
.edk2-why { display:block; margin-top:2px; font-size:12.5px; font-style:normal; color:#94A3B8; }
.edk2-zuschlaege { font-size:13px; color:#475569; font-variant-numeric:tabular-nums; }
.edk2-note { margin:16px auto 0; max-width:640px; width:100%; padding:14px 18px; border-radius:10px; font-size:14px;
  line-height:1.55; background:#EAF0FC; color:#1E3A8A; border:1px solid #C7D8F7; }
.edk2-note-warn { background:#FEF3C7; color:#78350F; border-color:#FCD34D; }

.edk2-two { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:18px; width:100%; max-width:900px; margin:26px auto 0; }
.edk2-box { display:flex; flex-direction:column; gap:11px; padding:24px 22px; background:#fff; border:1px solid #E3E8F0; border-radius:14px; }
.edk2-box-alt { background:#F8FAFC; }
.edk2-box-t { font-size:16px; font-weight:700; color:#0F172A; margin-bottom:2px; }
.edk2-li { display:flex; align-items:flex-start; gap:9px; font-size:14px; line-height:1.5; color:#334155; }
.edk2-li svg { flex:0 0 auto; margin-top:1px; color:var(--edk-accent); }
.edk2-li-off { color:#64748B; }
.edk2-li-off svg { color:#94A3B8; }

.edk2-disclaimer { margin:22px auto 0; max-width:700px; font-size:13px; line-height:1.65; color:#64748B; text-align:center; }

.edk2-label { font-size:14px; font-weight:600; color:#0F172A; margin-bottom:8px; }
.edk2-input { width:100%; height:52px; padding:0 16px; font-size:16px; color:#0F172A; background:#fff;
  border:1px solid #E3E8F0; border-radius:10px; outline:none; font-family:inherit; transition:border-color .15s, box-shadow .15s; }
.edk2-input::placeholder { color:#94A3B8; }
.edk2-input:focus { border-color:var(--edk-accent); box-shadow:0 0 0 3px rgba(29,91,207,.14); }
.edk2-input-err { border-color:#DC2626; }
.edk2-err { margin-top:6px; font-size:13px; color:#DC2626; }
.edk2-row { display:flex; gap:12px; align-items:flex-start; }

.edk2-prim { display:inline-flex; align-items:center; justify-content:center; gap:8px; height:54px; padding:0 26px;
  cursor:pointer; width:100%; background:var(--edk-accent); color:#fff; border:0; border-radius:10px; font-size:16px;
  font-weight:600; align-self:center; transition:filter .15s, transform .15s; }
.edk2-prim:hover:not(:disabled) { filter:brightness(1.08); }
.edk2-prim:active:not(:disabled) { transform:translateY(1px); }
.edk2-prim:disabled { opacity:.6; cursor:default; }

.edk2-sec { display:inline-flex; align-items:center; justify-content:center; gap:8px; height:48px; padding:0 22px;
  cursor:pointer; background:#fff; color:var(--edk-accent); border:1px solid var(--edk-accent); border-radius:10px;
  font-size:15px; font-weight:600; align-self:center; }
.edk2-sec:hover { background:rgba(29,91,207,.06); }

.edk2-toggle { display:inline-flex; align-self:center; gap:4px; padding:4px; margin:28px 0 4px; background:#fff;
  border:1px solid #E3E8F0; border-radius:999px; }
.edk2-tg { border:0; background:transparent; cursor:pointer; padding:9px 22px; border-radius:999px; font-size:14px;
  font-weight:600; color:#64748B; transition:background .15s, color .15s; }
.edk2-tg-on { background:var(--edk-accent); color:#fff; }

.edk2-trust { list-style:none; padding:0; margin:18px 0 0; display:flex; flex-wrap:wrap; gap:8px 20px; justify-content:center; }
.edk2-trust li { display:inline-flex; align-items:center; gap:6px; font-size:14px; color:#475569; }
.edk2-trust svg { width:16px; height:16px; color:var(--edk-accent); }
.edk2-legal { margin:18px 0 0; font-size:12px; line-height:1.6; color:#94A3B8; text-align:center; }
.edk2-tipp { margin:16px auto 0; max-width:480px; font-size:14px; line-height:1.6; color:#475569;
  background:#fff; border:1px solid #E3E8F0; border-radius:12px; padding:16px 18px; }

.edk2-spin { width:44px; height:44px; border-radius:50%; border:3px solid #DDE5F1; border-top-color:var(--edk-accent);
  animation:edk2-spin .8s linear infinite; align-self:center; }
@keyframes edk2-spin { to { transform:rotate(360deg); } }
.edk2-ok { width:64px; height:64px; border-radius:50%; display:inline-flex; align-items:center; justify-content:center;
  align-self:center; background:rgba(29,91,207,.1); color:var(--edk-accent); }
.edk2-ok svg { width:32px; height:32px; }

@container (max-width: 900px) {
  .edk2-grid { grid-template-columns:repeat(3,minmax(0,1fr)) !important; max-width:100% !important; }
  .edk2-two, .edk2-three { grid-template-columns:1fr; }
}
@container (max-width: 640px) {
  .edk2-eyebrow { font-size:14px; }
  .edk2-h1 { margin-top:8px; font-size:clamp(27px,8vw,32px); }
  .edk2-subline { margin-top:10px; font-size:15px; line-height:1.55; }
  .edk2-claims { margin-top:14px; gap:8px 14px; }
  .edk2-claims li { font-size:13px; }
  .edk2-grid { grid-template-columns:repeat(2,minmax(0,1fr)) !important; max-width:100% !important; gap:12px; }
  .edk2-card { min-height:146px; padding:18px 12px; }
  .edk2-hint { display:none; }
  .edk2-row { flex-direction:column; gap:0; }
  .edk2-row > div { flex:1 1 auto !important; }
  .edk2-preis-zahl { font-size:26px; }
  .edk2-preis { padding:24px 16px; }
  .edk2-ghost { font-size:13px; padding:6px 4px; }
}
`

const DEFAULT_CLAIMS = [
    { text: "Kostenlos und unverbindlich" },
    { text: "Preise aus unserer Preisübersicht 2026" },
    { text: "Eigene Monteure, keine Subunternehmer" },
]

addPropertyControls(KlimaFunnel, {
    accent: { type: ControlType.Color, title: "Akzentfarbe", defaultValue: "#1D5BCF" },
    kopfbereichZeigen: { type: ControlType.Boolean, title: "Kopfbereich zeigen", defaultValue: true },
    auszeichnung: { type: ControlType.String, title: "Auszeichnung", defaultValue: "Klimaanlagen-Angebot" },
    h1: { type: ControlType.String, title: "H1", defaultValue: "Ihre Preisorientierung in zwei Minuten" },
    unterzeile: {
        type: ControlType.String,
        title: "Unterzeile",
        displayTextArea: true,
        defaultValue: "Sieben kurze Fragen zu Ihren Räumen – danach sehen Sie sofort, in welcher Preisspanne Ihre Anlage liegt und was darin enthalten ist.",
    },
    claims: {
        type: ControlType.Array,
        title: "Claims",
        control: {
            type: ControlType.Object,
            controls: {
                text: { type: ControlType.String, title: "Text", defaultValue: "Kostenlos und unverbindlich" },
            },
        },
        defaultValue: DEFAULT_CLAIMS,
    },
    p1Lo: { type: ControlType.Number, title: "1 Gerät von", defaultValue: 2800, min: 0, max: 50000, step: 50, displayStepper: false },
    p1Hi: { type: ControlType.Number, title: "1 Gerät bis", defaultValue: 3200, min: 0, max: 50000, step: 50, displayStepper: false },
    p2Lo: { type: ControlType.Number, title: "2 Geräte von", defaultValue: 4000, min: 0, max: 50000, step: 50, displayStepper: false },
    p2Hi: { type: ControlType.Number, title: "2 Geräte bis", defaultValue: 4400, min: 0, max: 50000, step: 50, displayStepper: false },
    p3Lo: { type: ControlType.Number, title: "3 Geräte von", defaultValue: 6000, min: 0, max: 50000, step: 50, displayStepper: false },
    p3Hi: { type: ControlType.Number, title: "3 Geräte bis", defaultValue: 6400, min: 0, max: 50000, step: 50, displayStepper: false },
    p4Lo: { type: ControlType.Number, title: "4 Geräte von", defaultValue: 7700, min: 0, max: 50000, step: 50, displayStepper: false },
    p4Hi: { type: ControlType.Number, title: "4 Geräte bis", defaultValue: 8100, min: 0, max: 50000, step: 50, displayStepper: false },
    serienAktiv: { type: ControlType.Boolean, title: "Schritt Geräteserie", description: "Aus: Die Serien stehen als eigenes Modul auf der Landingpage.", defaultValue: false },
    serienTitel: { type: ControlType.String, title: "Frage", defaultValue: "Welche Geräteserie soll es werden?", hidden: (p) => !p.serienAktiv },
    serienUnter: { type: ControlType.String, title: "Unterzeile", displayTextArea: true, defaultValue: "Wir sind an keinen Hersteller gebunden. Auf Wunsch liefern wir auch andere Marken – der Preis kann dann abweichen.", hidden: (p) => !p.serienAktiv },
    s1Label: { type: ControlType.String, title: "Buderus 1 Name", defaultValue: "Buderus Logacool ER", hidden: (p) => !p.serienAktiv },
    s1Hinweis: { type: ControlType.String, title: "  Zusatz", defaultValue: "Einstiegsserie · unsere Hausmarke", hidden: (p) => !p.serienAktiv },
    s1Bild: { type: ControlType.ResponsiveImage, title: "  Bild", description: "Produktfoto der Serie", hidden: (p) => !p.serienAktiv },
    s2Label: { type: ControlType.String, title: "Buderus 2 Name", defaultValue: "Buderus Logacool AC 186", hidden: (p) => !p.serienAktiv },
    s2Hinweis: { type: ControlType.String, title: "  Zusatz", defaultValue: "Premiumserie · unsere Hausmarke", hidden: (p) => !p.serienAktiv },
    s2Bild: { type: ControlType.ResponsiveImage, title: "  Bild", description: "Produktfoto der Serie", hidden: (p) => !p.serienAktiv },
    s3Label: { type: ControlType.String, title: "Mitsubishi 3 Name", defaultValue: "Mitsubishi MSZ-HR", hidden: (p) => !p.serienAktiv },
    s3Hinweis: { type: ControlType.String, title: "  Zusatz", defaultValue: "Einstiegsserie", hidden: (p) => !p.serienAktiv },
    s3Bild: { type: ControlType.ResponsiveImage, title: "  Bild", description: "Produktfoto der Serie", hidden: (p) => !p.serienAktiv },
    s4Label: { type: ControlType.String, title: "Mitsubishi 4 Name", defaultValue: "Mitsubishi MSZ-AY", hidden: (p) => !p.serienAktiv },
    s4Hinweis: { type: ControlType.String, title: "  Zusatz", defaultValue: "Gehobene Standardserie", hidden: (p) => !p.serienAktiv },
    s4Bild: { type: ControlType.ResponsiveImage, title: "  Bild", description: "Produktfoto der Serie", hidden: (p) => !p.serienAktiv },
    s5Label: { type: ControlType.String, title: "Noch 5 Name", defaultValue: "Noch unentschieden", hidden: (p) => !p.serienAktiv },
    s5Hinweis: { type: ControlType.String, title: "  Zusatz", defaultValue: "Wir empfehlen im Gespräch", hidden: (p) => !p.serienAktiv },
    s5Bild: { type: ControlType.ResponsiveImage, title: "  Bild", description: "Produktfoto der Serie", hidden: (p) => !p.serienAktiv },
    premiumAufschlag: { type: ControlType.Number, title: "Aufpreis Heizbetrieb %", defaultValue: 25, min: 0, max: 100, step: 1, displayStepper: false },
    mwst: { type: ControlType.Number, title: "MwSt %", defaultValue: 19, min: 0, max: 30, step: 1, displayStepper: false },
    zGrossRaum: { type: ControlType.Number, title: "Aufpreis >40 m²", defaultValue: 400, min: 0, max: 5000, step: 10, displayStepper: false },
    zGeruest: { type: ControlType.Number, title: "Gerüst ab 1. OG", defaultValue: 290, min: 0, max: 5000, step: 10, displayStepper: false },
    zDach: { type: ControlType.Number, title: "Dachmontage", defaultValue: 720, min: 0, max: 5000, step: 10, displayStepper: false },
    zKanal: { type: ControlType.Number, title: "Kabelkanal €/m", defaultValue: 30, min: 0, max: 500, step: 1, displayStepper: false },
    meterProGeraet: { type: ControlType.Number, title: "Kanal m je Gerät", defaultValue: 3, min: 0, max: 50, step: 1, displayStepper: false },
    leadWert: { type: ControlType.Number, title: "Conversion-Wert €", defaultValue: 712, min: 0, max: 100000, step: 1, displayStepper: false },
    formAction: { type: ControlType.String, title: "Framer-Formular", placeholder: "Leer = kein Framer-Formular", defaultValue: FORM_KONTAKT,
        description: "Submit-URL eines Framer-Formulars. Standard: Kontaktformular." },
    webhookUrl: { type: ControlType.String, title: "Webhook (optional)", placeholder: "Zusätzlich an CRM o. ä.", defaultValue: "" },
})
