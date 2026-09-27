import { useState, useEffect, useRef } from "react"
import { addPropertyControls, ControlType } from "framer"

/**
 * ED Elektro & Klimatechnik – Wärmepumpen-Funnel mit Heizlast-Schätzung
 *
 * Aufbau wie der KlimaFunnel: Fragen → Heizlast → Preisorientierung (ohne
 * Kontaktdaten sichtbar) → Kontaktdaten → Danke.
 *
 * Heizlast (Meeting 16.09.2026):
 *   a) über den Jahresverbrauch: kWh × Nutzungsgrad ÷ Vollbenutzungsstunden
 *      (Liter Heizöl und m³ Erdgas werden mit ~10 kWh umgerechnet)
 *   b) ohne Verbrauch: Wohnfläche × spezifische Heizlast nach Baujahr
 *      + Warmwasser-Anteil je Person
 *   Heizkörper statt Fußbodenheizung → Auslegungszuschlag.
 *   Danach Einordnung in 6 / 8 / 12 / 18 kW. Über 18 kW = gewerbliche Anlage.
 *
 * Preise: Paketpreise ohne/mit Warmwasserbereitung (Preistabelle ED Elektro,
 * netto). Angezeigt werden – wie besprochen – beide Varianten parallel als
 * Bruttopreis. Alle Werte sind über die Eigenschaften editierbar.
 *
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight auto
 * @framerIntrinsicWidth 1080
 * @framerIntrinsicHeight 760
 */
export default function WaermepumpenFunnel(props) {
    const {
        accent = "#1D5BCF",
        k6o = 17549, k6m = 21814,
        k8o = 17549, k8m = 21814,
        k12o = 18134, k12m = 22074,
        k18o = 18654, k18m = 23244,
        demontageLo = 600, demontageHi = 700,
        mwst = 19,
        vollbenutzung = 2000,
        nutzungsgrad = 85,
        hkZuschlag = 10,
        wwJePerson = 0.25,
        leadWert = 1500,
        foerderMax = 22400,
        startTermin = false,
        webhookUrl = "",
        telefon = "06732 600 7358",
        style,
    } = props

    const P = {
        klassen: [
            { kw: 6, ohne: k6o, mit: k6m },
            { kw: 8, ohne: k8o, mit: k8m },
            { kw: 12, ohne: k12o, mit: k12m },
            { kw: 18, ohne: k18o, mit: k18m },
        ],
        demontageLo, demontageHi, mwst, vollbenutzung,
        foerderMax,
        nutzungsgrad: nutzungsgrad / 100, hkZuschlag: hkZuschlag / 100, wwJePerson,
    }

    const [index, setIndex] = useState(0)
    const [a, setA] = useState({})
    const [contact, setContact] = useState(LEER_KONTAKT)
    const [fehler, setFehler] = useState({})
    const [sendet, setSendet] = useState(false)
    const [sendFehler, setSendFehler] = useState(false)
    const [fertig, setFertig] = useState(false)
    const [phase, setPhase] = useState("fragen") // fragen | rechnet | ergebnis | kontakt
    const [direkt, setDirekt] = useState(false) // Einstieg über „Direkt Planungstermin vereinbaren“
    const gestartet = useRef(false)

    // Seite /waermepumpe-termin (Eigenschaft „Start mit Terminanfrage“) oder ?termin=1
    // überspringt die Fragen und öffnet direkt die Terminanfrage
    useEffect(() => {
        if (typeof window === "undefined") return
        if (startTermin || new URLSearchParams(window.location.search).get("termin") === "1") {
            setDirekt(true)
            setPhase("kontakt")
            track("termin_direkt_start")
        }
    }, [])

    const aktiv = aktiveFragen(a)
    const total = aktiv.length
    const kalk = berechne(a, P)

    useEffect(() => {
        if (phase !== "rechnet") return
        const t = setTimeout(() => {
            setPhase("ergebnis")
            const k = berechne(a, P)
            track("calculator_result", k.individuell
                ? { calc_individuell: true, calc_grund: k.grund }
                : { calc_heizlast_kw: k.heizlast, calc_klasse_kw: k.klasse.kw, calc_warmwasser: a.warmwasser?.id })
        }, 1900)
        return () => clearTimeout(t)
    }, [phase])

    function antworte(id, wert) {
        if (!gestartet.current) {
            gestartet.current = true
            track("calculator_start", { calc_erste_frage: id })
        }
        // Antworten auf Fragen, die durch die neue Antwort wegfallen, verwerfen
        const roh = { ...a, [id]: wert }
        const sichtbar = aktiveFragen(roh)
        const next = {}
        for (const f of sichtbar) if (roh[f.id] !== undefined) next[f.id] = roh[f.id]
        setA(next)
        const pos = sichtbar.findIndex((f) => f.id === id)
        if (pos + 1 >= sichtbar.length) setPhase("rechnet")
        else setIndex(pos + 1)
    }

    function zurueck() {
        if (phase === "kontakt" && direkt) { setDirekt(false); setPhase("fragen"); setIndex(0); return }
        if (phase === "kontakt") { setPhase("ergebnis"); return }
        if (phase === "ergebnis") { setPhase("fragen"); setIndex(total - 1); return }
        setIndex((i) => Math.max(0, i - 1))
    }

    function neuStarten() {
        setA({}); setIndex(0); setPhase("fragen"); setDirekt(false); setFertig(false); setFehler({}); setSendFehler(false)
        gestartet.current = false
        setContact(LEER_KONTAKT)
    }

    async function absenden() {
        const f = {}
        if (!contact.name.trim()) f.name = "Bitte geben Sie Ihren Namen an."
        if (!contact.strasse.trim()) f.strasse = "Bitte geben Sie Straße und Hausnummer an."
        if (!/^\d{5}$/.test(contact.plz.trim())) f.plz = "Bitte eine gültige Postleitzahl."
        if (!contact.ort.trim()) f.ort = "Bitte geben Sie den Ort an."
        if (contact.tel.replace(/[^\d]/g, "").length < 6) f.tel = "Bitte eine gültige Telefonnummer."
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(contact.mail.trim())) f.mail = "Bitte eine gültige E-Mail-Adresse."
        setFehler(f)
        if (Object.keys(f).length) return

        // Flache Feldnamen, damit die Anfrage in Mails und später im CRM lesbar ankommt
        const payload = {
            Anfrage: "Wärmepumpe",
            Einstieg: direkt ? "Direkt Planungstermin (ohne Rechner)" : "Rechner",
            ...Object.fromEntries(aktiv.map((fr) => [fr.kurz, antwortText(fr, a[fr.id])])),
            "Heizlast geschätzt": direkt ? "–" : kalk.heizlast ? `${kw(kalk.heizlast)} (${kalk.methode})` : "–",
            "Empfohlene Leistungsklasse": kalk.individuell ? "individuell" : `${kalk.klasse.kw} kW`,
            "Richtwert ohne Warmwasser (brutto)": kalk.individuell ? "–" : "ab " + euro(kalk.ohne.brutto),
            "Richtwert mit Warmwasser (brutto)": kalk.individuell ? "–" : "ab " + euro(kalk.mit.brutto),
            "Demontage alte Heizung": kalk.demontage ? `${euro(demontageLo)} – ${euro(demontageHi)} netto` : "nein",
            Hinweis: kalk.individuell ? kalk.grund : "–",
            Name: contact.name,
            Straße: contact.strasse,
            PLZ: contact.plz,
            Ort: contact.ort,
            Telefon: contact.tel,
            "E-Mail": contact.mail,
            Erreichbarkeit: contact.zeit || "–",
            Zeitpunkt: new Date().toISOString(),
        }

        if (!webhookUrl) {
            // Testmodus: kein Versand und bewusst kein Conversion-Event
            console.log("Wärmepumpen-Funnel-Anfrage (kein Ziel hinterlegt):", payload)
            setFertig(true)
            return
        }

        setSendet(true)
        setSendFehler(false)
        try {
            const res = await fetch(webhookUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json", Accept: "application/json" },
                body: JSON.stringify(payload),
            })
            if (!res.ok) throw new Error("HTTP " + res.status)
            track("lead_submit", { value: leadWert, currency: "EUR", calc_klasse_kw: kalk.klasse?.kw })
            setFertig(true)
        } catch (e) {
            // Kein Danke-Screen bei Fehler – sonst gehen Anfragen unbemerkt verloren
            console.error("Wärmepumpen-Funnel: Versand fehlgeschlagen", e)
            setSendFehler(true)
        } finally {
            setSendet(false)
        }
    }

    const schritt = aktiv[Math.min(index, total - 1)]
    const zeigeKopf = !fertig && phase !== "rechnet"
    const fortschritt = fertig || phase === "ergebnis" || phase === "kontakt" ? 100 : Math.round((index / total) * 100)

    return (
        <div className="edw" style={{ ...style, ...S.root, ["--edw-accent" as any]: accent }}>
            <style>{CSS}</style>

            {zeigeKopf && (index > 0 || phase !== "fragen") && (
                <div style={S.bar}>
                    <button className="edw-ghost" onClick={zurueck} type="button">
                        <Chev dir="left" /> Zurück
                    </button>
                    <span style={S.zaehler}>
                        {phase === "fragen" ? `Schritt ${index + 1} von ${total}` : phase === "ergebnis" ? "Ihre Preisorientierung" : direkt ? "Planungstermin" : "Kontaktdaten"}
                    </span>
                    <button className="edw-ghost" onClick={neuStarten} type="button">Neu starten</button>
                </div>
            )}
            {zeigeKopf && <div style={S.track}><div style={{ ...S.fill, width: fortschritt + "%" }} /></div>}

            <div style={S.buehne}>
                {fertig ? (
                    <Danke onNeu={neuStarten} />
                ) : phase === "rechnet" ? (
                    <Rechnet />
                ) : phase === "ergebnis" ? (
                    <Ergebnis kalk={kalk} a={a} P={P} onWeiter={() => setPhase("kontakt")} />
                ) : phase === "kontakt" ? (
                    <Kontakt c={contact} fehler={fehler} sendet={sendet} sendFehler={sendFehler} telefon={telefon} direkt={direkt}
                        onChange={(p) => setContact((c) => ({ ...c, ...p }))} onSubmit={absenden} kalk={kalk} />
                ) : schritt.typ === "verbrauch" ? (
                    <Verbrauch key={schritt.id} f={schritt} a={a} wert={a[schritt.id]} onWahl={(w) => antworte(schritt.id, w)} />
                ) : (
                    <Frage key={schritt.id} f={schritt} gewaehlt={a[schritt.id]} onWahl={(o) => antworte(schritt.id, o)} />
                )}
            </div>
        </div>
    )
}

const LEER_KONTAKT = { name: "", strasse: "", plz: "", ort: "", tel: "", mail: "", zeit: "" }

/* ------------------------------------------------------------------ Fragen */

const ohneVerbrauch = (a) => a.heizung?.id === "neubau" || a.verbrauch?.unbekannt === true

const FRAGEN = [
    {
        id: "gebaeude",
        kurz: "Gebäude",
        titel: "Für welches Gebäude planen Sie die Wärmepumpe?",
        unter: "Damit ordnen wir die Anlage richtig ein.",
        optionen: [
            { id: "efh", label: "Einfamilienhaus", icon: "house" },
            { id: "dhh", label: "Doppelhaushälfte oder Reihenhaus", icon: "rooms" },
            { id: "zfh", label: "Zweifamilienhaus", icon: "building" },
            { id: "mfh", label: "Mehrfamilienhaus oder Gewerbe", hinweis: "planen wir individuell", icon: "store" },
        ],
    },
    {
        id: "heizung",
        kurz: "Heizung heute",
        titel: "Womit heizen Sie heute?",
        unter: "Die alte Heizung verrät uns am meisten über Ihren Wärmebedarf.",
        wenn: (a) => a.gebaeude?.id !== "mfh",
        optionen: [
            { id: "gas", label: "Erdgas", icon: "flame" },
            { id: "oel", label: "Heizöl", icon: "drop" },
            { id: "strom", label: "Strom oder Nachtspeicher", icon: "bolt" },
            { id: "andere", label: "Flüssiggas, Pellets oder Sonstiges", icon: "question" },
            { id: "neubau", label: "Neubau – noch keine Heizung", icon: "crane" },
        ],
    },
    {
        id: "verbrauch",
        typ: "verbrauch",
        kurz: "Jahresverbrauch",
        titel: "Wie hoch ist Ihr Jahresverbrauch ungefähr?",
        unter: "Steht auf Ihrer letzten Gas- oder Heizölrechnung. Eine grobe Zahl genügt.",
        wenn: (a) => a.gebaeude?.id !== "mfh" && a.heizung?.id !== "neubau",
    },
    {
        id: "flaeche",
        kurz: "Wohnfläche",
        titel: "Wie groß ist die beheizte Wohnfläche?",
        unter: "Ohne Verbrauchswert schätzen wir die Heizlast über Fläche und Baujahr.",
        wenn: (a) => a.gebaeude?.id !== "mfh" && ohneVerbrauch(a),
        optionen: [
            { id: "100", label: "Bis 100 m²", wert: 90, icon: "ruler" },
            { id: "150", label: "100 – 150 m²", wert: 125, icon: "ruler" },
            { id: "200", label: "150 – 200 m²", wert: 175, icon: "ruler" },
            { id: "250", label: "200 – 250 m²", wert: 225, icon: "ruler" },
            { id: "mehr", label: "Über 250 m²", wert: 275, icon: "ruler" },
        ],
    },
    {
        id: "baujahr",
        kurz: "Baujahr / Dämmung",
        titel: "Wann wurde das Haus gebaut – oder zuletzt energetisch saniert?",
        unter: "Neue Fenster und eine gedämmte Fassade senken die Heizlast deutlich.",
        wenn: (a) => a.gebaeude?.id !== "mfh" && ohneVerbrauch(a),
        optionen: [
            { id: "alt", label: "Vor 1978, kaum saniert", wert: 120, icon: "brick" },
            { id: "mittel", label: "1978 – 1994 oder teilsaniert", wert: 90, icon: "house" },
            { id: "gut", label: "1995 – 2015 oder gut saniert", wert: 60, icon: "house" },
            { id: "neu", label: "Ab 2016 oder Neubau", wert: 40, icon: "star" },
        ],
    },
    {
        id: "heizflaeche",
        kurz: "Heizflächen",
        titel: "Wie wird die Wärme im Haus verteilt?",
        unter: "Fußbodenheizung arbeitet mit niedriger Vorlauftemperatur – ideal für die Wärmepumpe. Heizkörper gehen auch.",
        wenn: (a) => a.gebaeude?.id !== "mfh",
        optionen: [
            { id: "fbh", label: "Fußbodenheizung", icon: "floor" },
            { id: "hk", label: "Heizkörper", icon: "radiator" },
            { id: "beides", label: "Beides", icon: "rooms" },
            { id: "keine", label: "Keine (z. B. Nachtspeicher, Öfen)", hinweis: "Wärmeverteilung planen wir mit", icon: "question" },
        ],
    },
    {
        id: "warmwasser",
        kurz: "Warmwasser",
        titel: "Soll die Wärmepumpe auch Ihr Warmwasser bereiten?",
        unter: "Das macht beim Preis einen spürbaren Unterschied. Wir zeigen Ihnen am Ende beide Varianten.",
        wenn: (a) => a.gebaeude?.id !== "mfh",
        optionen: [
            { id: "ja", label: "Ja, mit Warmwasserspeicher", icon: "tap" },
            { id: "nein", label: "Nein, das läuft separat", hinweis: "z. B. über Durchlauferhitzer", icon: "bolt" },
            { id: "unbekannt", label: "Weiß ich noch nicht", icon: "question" },
        ],
    },
    {
        id: "personen",
        kurz: "Personen im Haushalt",
        titel: "Wie viele Personen leben im Haushalt?",
        unter: "Daraus ergibt sich der Warmwasserbedarf.",
        wenn: (a) => a.gebaeude?.id !== "mfh" && ohneVerbrauch(a) && a.warmwasser?.id !== "nein",
        optionen: [
            { id: "2", label: "1 – 2 Personen", wert: 2, icon: "person" },
            { id: "4", label: "3 – 4 Personen", wert: 4, icon: "people" },
            { id: "6", label: "5 oder mehr", wert: 6, icon: "people" },
        ],
    },
    {
        id: "demontage",
        kurz: "Demontage alte Heizung",
        titel: "Sollen wir die alte Heizung ausbauen und entsorgen?",
        unter: "Kessel, Tank oder Therme – wir kümmern uns um Demontage und Entsorgung.",
        wenn: (a) => a.gebaeude?.id !== "mfh" && a.heizung?.id !== "neubau",
        optionen: [
            { id: "ja", label: "Ja, bitte mit ausbauen", icon: "tool" },
            { id: "nein", label: "Nein, ist schon erledigt oder bleibt", icon: "check" },
        ],
    },
    {
        id: "zeitraum",
        kurz: "Zeitraum",
        titel: "Wann soll die Wärmepumpe laufen?",
        unter: "So planen wir Förderantrag und Termin realistisch.",
        optionen: [
            { id: "sofort", label: "So schnell wie möglich", hinweis: "z. B. weil die alte Heizung defekt ist", icon: "bolt" },
            { id: "6monate", label: "In den nächsten 6 Monaten", icon: "cal" },
            { id: "jahr", label: "Im Lauf des Jahres", icon: "cal" },
            { id: "info", label: "Erst mal nur informieren", icon: "question" },
        ],
    },
]

function aktiveFragen(a) {
    return FRAGEN.filter((f) => !f.wenn || f.wenn(a))
}

function antwortText(f, w) {
    if (!w) return "–"
    if (f.typ === "verbrauch") return w.unbekannt ? "unbekannt – über Wohnfläche geschätzt" : `${zahl(w.menge)} ${EINHEITEN[w.einheit].kurz} (≈ ${zahl(w.kwh)} kWh)`
    return w.label
}

/* ------------------------------------------------------------- Kalkulation */

const EINHEITEN = {
    kwh: { label: "kWh", kurz: "kWh", faktor: 1, ph: "z. B. 20.000" },
    oel: { label: "Liter Heizöl", kurz: "l Heizöl", faktor: 10, ph: "z. B. 2.000" },
    gas: { label: "m³ Erdgas", kurz: "m³ Erdgas", faktor: 10, ph: "z. B. 2.000" },
}

function berechne(a, P) {
    if (a.gebaeude?.id === "mfh") {
        return { individuell: true, grund: "Mehrfamilienhaus oder Gewerbe", text: "Für Mehrfamilienhäuser und Gewerbe planen wir die Anlage individuell – oft mit mehreren Geräten oder in Kaskade." }
    }

    let heizlast = 0
    let methode = ""
    if (a.verbrauch && !a.verbrauch.unbekannt) {
        // Nachtspeicher/Strom setzt den Verbrauch 1:1 in Wärme um, Kessel nicht
        const eta = a.heizung?.id === "strom" ? 1 : P.nutzungsgrad
        heizlast = (a.verbrauch.kwh * eta) / P.vollbenutzung
        methode = "über Jahresverbrauch"
    } else if (a.flaeche && a.baujahr) {
        heizlast = (a.flaeche.wert * a.baujahr.wert) / 1000
        if (a.warmwasser?.id !== "nein" && a.personen) heizlast += a.personen.wert * P.wwJePerson
        methode = "über Wohnfläche und Baujahr"
    } else {
        return { leer: true }
    }
    const hk = ["hk", "beides"].includes(a.heizflaeche?.id)
    if (hk) heizlast *= 1 + P.hkZuschlag
    heizlast = Math.round(heizlast * 10) / 10

    const max = P.klassen[P.klassen.length - 1].kw
    if (heizlast > max) {
        return { individuell: true, heizlast, methode, grund: `Heizlast über ${max} kW`, text: `Ihre geschätzte Heizlast liegt bei rund ${kw(heizlast)}. Anlagen über ${max} kW planen wir als gewerbliche Anlage individuell – oft mit zwei Geräten in Kaskade.` }
    }
    if (a.heizflaeche?.id === "keine") {
        return { individuell: true, heizlast, methode, grund: "keine wasserführenden Heizflächen", text: "Ohne Heizkörper oder Fußbodenheizung braucht es zusätzlich eine Wärmeverteilung im Haus. Das rechnen wir Ihnen gern individuell durch – die Wärmepumpe selbst läge bei Ihrer Heizlast in der Klasse um " + P.klassen.find((k) => heizlast <= k.kw).kw + " kW." }
    }

    const klasse = P.klassen.find((k) => heizlast <= k.kw)
    const demontage = a.demontage?.id === "ja"
    const extra = demontage ? P.demontageLo : 0
    const variante = (netto) => ({ netto: netto + extra, brutto: Math.floor((netto + extra) * (1 + P.mwst / 100)) })
    const ohne = variante(klasse.ohne)
    const mit = variante(klasse.mit)
    const empfohlen = a.warmwasser?.id === "ja" ? "mit" : a.warmwasser?.id === "nein" ? "ohne" : null

    const enthalten: { text: string; grund?: string }[] = [
        { text: `Luft-Wasser-Wärmepumpe von MHG, Leistungsklasse ${klasse.kw} kW`, grund: `geschätzte Heizlast ${kw(heizlast)}` },
        { text: "Außeneinheit inkl. Aufstellung und Anschluss" },
        { text: "Hydraulische Einbindung in Ihr Heizsystem" },
        { text: "Elektroanschluss durch unseren eigenen Meisterbetrieb" },
        { text: "Inbetriebnahme, Einstellung und Einweisung" },
    ]
    if (demontage) enthalten.push({ text: "Demontage und Entsorgung der alten Heizung", grund: `ca. ${euro(P.demontageLo)} – ${euro(P.demontageHi)} netto` })
    enthalten.push({ text: "Förderantrag stellen wir für Sie", grund: "Sie geben danach nur noch Ihre Daten ein" })

    const vorOrt: string[] = ["Aufstellort der Außeneinheit und Schallschutz zum Nachbarn"]
    if (hk) vorOrt.push("Ob einzelne Heizkörper für niedrige Vorlauftemperaturen getauscht werden sollten")
    if (methode === "über Wohnfläche und Baujahr") vorOrt.push("Die genaue Heizlast – ohne Verbrauchswert rechnen wir mit Erfahrungswerten")
    if (heizlast > klasse.kw * 0.92) vorOrt.push(`Ihre Heizlast liegt nah an der Grenze von ${klasse.kw} kW – wir prüfen, ob die Klasse reicht`)
    vorOrt.push("Stromzähler und Platz für den Warmwasserspeicher")

    return { heizlast, methode, klasse, ohne, mit, empfohlen, demontage, verzeichnis: { enthalten, vorOrt } }
}

function track(event, params = {}) {
    if (typeof window === "undefined") return
    const w = window
    w["dataLayer"] = w["dataLayer"] || []
    w["dataLayer"].push({ event, funnel: "waermepumpe", ...params })
}

const zahl = (n) => Math.round(n).toLocaleString("de-DE")
const euro = (n) => zahl(n) + " €"
const kw = (n) => n.toLocaleString("de-DE", { maximumFractionDigits: 1 }) + " kW"

/* ------------------------------------------------------------------ Views */

function Frage({ f, gewaehlt, onWahl }) {
    const n = f.optionen.length
    const spalten = n <= 3 ? n : n === 5 ? 3 : 4
    return (
        <div style={S.inner}>
            <h2 style={S.titel}>{f.titel}</h2>
            {f.unter && <p style={S.unter}>{f.unter}</p>}
            <div className="edw-grid" style={{ ...S.grid, gridTemplateColumns: `repeat(${spalten}, minmax(0, 1fr))`, maxWidth: spalten * 250 }}>
                {f.optionen.map((o) => (
                    <button key={o.id} type="button"
                        className={"edw-card" + (gewaehlt?.id === o.id ? " edw-card-on" : "")}
                        onClick={() => onWahl(o)}>
                        <span className="edw-ic"><Ic n={o.icon} /></span>
                        <span className="edw-lab">{o.label}</span>
                        {o.hinweis && <span className="edw-hint">{o.hinweis}</span>}
                    </button>
                ))}
            </div>
        </div>
    )
}

function Verbrauch({ f, a, wert, onWahl }) {
    const vorschlag = a.heizung?.id === "oel" ? "oel" : a.heizung?.id === "gas" ? "gas" : "kwh"
    const [einheit, setEinheit] = useState(wert?.einheit ?? vorschlag)
    const [menge, setMenge] = useState(wert && !wert.unbekannt ? String(wert.menge) : "")
    const [fehler, setFehler] = useState("")

    function weiter() {
        const m = Number(menge.replace(/\./g, "").replace(",", "."))
        const kwh = m * EINHEITEN[einheit].faktor
        if (!m || kwh < 2000 || kwh > 150000) {
            setFehler("Bitte prüfen Sie den Wert – üblich sind etwa 8.000 bis 40.000 kWh im Jahr.")
            return
        }
        onWahl({ id: "wert", einheit, menge: m, kwh })
    }

    return (
        <div style={{ ...S.inner, maxWidth: 560 }}>
            <h2 style={S.titel}>{f.titel}</h2>
            <p style={S.unter}>{f.unter}</p>

            <div className="edw-toggle">
                {Object.entries(EINHEITEN).map(([id, e]) => (
                    <button key={id} type="button" className={"edw-tg" + (einheit === id ? " edw-tg-on" : "")}
                        onClick={() => setEinheit(id)}>{e.label}</button>
                ))}
            </div>

            <label className="edw-label" htmlFor="w-menge" style={{ marginTop: 18 }}>Verbrauch pro Jahr in {EINHEITEN[einheit].label}</label>
            <input id="w-menge" className={"edw-input" + (fehler ? " edw-input-err" : "")} inputMode="numeric"
                placeholder={EINHEITEN[einheit].ph} value={menge}
                onChange={(e) => { setMenge(e.target.value.replace(/[^\d.,]/g, "")); setFehler("") }}
                onKeyDown={(e) => { if (e.key === "Enter") weiter() }} />
            {fehler && <span className="edw-err">{fehler}</span>}
            {einheit !== "kwh" && <span className="edw-mini">Wir rechnen mit rund 10 kWh je {einheit === "oel" ? "Liter Heizöl" : "m³ Erdgas"}.</span>}

            <button className="edw-prim" type="button" onClick={weiter} style={{ marginTop: 22 }}>
                Weiter <Chev dir="right" />
            </button>
            <button className="edw-link" type="button" onClick={() => onWahl({ id: "unbekannt", unbekannt: true })}>
                Weiß ich nicht – über die Wohnfläche schätzen
            </button>
        </div>
    )
}

function Rechnet() {
    return (
        <div style={{ ...S.inner, maxWidth: 560, alignItems: "center", textAlign: "center" }}>
            <span className="edw-spin" />
            <h2 style={{ ...S.titel, marginTop: 26 }}>Wir berechnen Ihre Heizlast …</h2>
            <p style={S.unter}>Einen Moment – wir ordnen Ihre Angaben der passenden Wärmepumpe zu.</p>
        </div>
    )
}

function Ergebnis({ kalk, a, P, onWeiter }) {
    if (kalk.individuell) {
        return (
            <div style={{ ...S.inner, maxWidth: 640 }}>
                <h2 style={{ ...S.titel, textAlign: "left" }}>Ihre Anlage planen wir individuell</h2>
                <p style={{ ...S.unter, textAlign: "left", margin: "12px 0 0" }}>
                    {kalk.text} Wir rechnen Ihnen das sauber durch – unverbindlich.
                </p>
                <button className="edw-prim" type="button" onClick={onWeiter} style={{ marginTop: 26 }}>
                    Individuelles Angebot anfordern <Chev dir="right" />
                </button>
            </div>
        )
    }

    const v = kalk.verzeichnis
    const karte = (key, titel, sub) => {
        const p = kalk[key]
        const on = kalk.empfohlen === key
        return (
            <div className={"edw-preis" + (on ? " edw-preis-on" : "")}>
                {on && <span className="edw-badge">Passt zu Ihren Angaben</span>}
                <span className="edw-preis-lab">{titel}</span>
                <span className="edw-preis-zahl">ab {euro(p.brutto)}</span>
                <span className="edw-preis-sub">inkl. {P.mwst} % MwSt · netto ab {euro(p.netto)}</span>
                <span className="edw-preis-note">{sub}</span>
            </div>
        )
    }

    return (
        <div style={{ ...S.inner, maxWidth: 940 }}>
            <h2 style={S.titel}>Ihre Preisorientierung</h2>

            <div className="edw-heizlast">
                <div>
                    <span className="edw-hl-lab">Geschätzte Heizlast</span>
                    <span className="edw-hl-zahl">{kw(kalk.heizlast)}</span>
                    <span className="edw-hl-sub">{kalk.methode}</span>
                </div>
                <Chev dir="right" />
                <div>
                    <span className="edw-hl-lab">Passende Wärmepumpe</span>
                    <span className="edw-hl-zahl">{kalk.klasse.kw} kW</span>
                    <span className="edw-hl-sub">Luft-Wasser, MHG</span>
                </div>
            </div>

            <div className="edw-two edw-preise">
                {karte("ohne", "Ohne Warmwasserbereitung", "Heizung über die Wärmepumpe, Warmwasser bleibt separat")}
                {karte("mit", "Mit Warmwasserbereitung", "inkl. Trinkwasserspeicher – Heizung und Warmwasser aus einer Hand")}
            </div>
            {kalk.demontage && <p className="edw-mini" style={{ textAlign: "center", marginTop: 10 }}>Beide Preise enthalten bereits die Demontage der alten Heizung.</p>}

            <div className="edw-note">
                <strong>Förderung – wir kümmern uns um den Antrag.</strong> Für eine Wärmepumpe gibt es bis zu 80 % Zuschuss,
                höchstens {euro(P.foerderMax)}. Die Preise oben verstehen sich <em>vor</em> Abzug der Förderung. Welche Boni
                Ihnen zustehen, klären wir im Planungstermin – danach steht Ihr Förderbetrag in Euro im Festpreis-Angebot.
                Den Antrag stellen wir vor Baubeginn für Sie, Sie geben nur noch Ihre Daten ein.
            </div>

            <span className="edw-lv-titel">Das haben wir für Sie eingerechnet</span>
            <div className="edw-two">
                <div className="edw-box">
                    <span className="edw-box-t">Darin enthalten</span>
                    {v.enthalten.map((p, i) => (
                        <span key={i} className="edw-li">
                            <Ic n="check" />
                            <span>{p.text}{p.grund && <em className="edw-why">{p.grund}</em>}</span>
                        </span>
                    ))}
                </div>
                <div className="edw-box edw-box-alt">
                    <span className="edw-box-t">Klären wir vor Ort</span>
                    {v.vorOrt.map((t, i) => (
                        <span key={i} className="edw-li edw-li-off"><Ic n="question" /> <span>{t}</span></span>
                    ))}
                </div>
            </div>

            <p className="edw-disclaimer">
                Diese Preisorientierung ist kein verbindliches Angebot. Mit Ihren Angaben steht der Preis erfahrungsgemäß
                zu 80 bis 100 Prozent fest. Den Festpreis nennen wir nach dem
                Planungstermin vor Ort – ohne Nachträge.
            </p>

            <button className="edw-prim" type="button" onClick={onWeiter} style={{ marginTop: 22, maxWidth: 400 }}>
                Planungstermin vor Ort vereinbaren <Chev dir="right" />
            </button>
        </div>
    )
}

function Kontakt({ c, fehler, sendet, sendFehler, telefon, onChange, onSubmit, kalk, direkt = false }) {
    return (
        <div style={{ ...S.inner, maxWidth: 560 }}>
            <h2 style={S.titel}>{direkt ? "Planungstermin vor Ort vereinbaren" : "Wohin dürfen wir kommen?"}</h2>
            <p style={S.unter}>
                {direkt
                    ? "Der Meister prüft bei Ihnen Heizlast, Heizkörper, Aufstellort und Stromanschluss. Danach erhalten Sie ein Festpreis-Angebot mit Ihrem Förderbetrag in Euro."
                    : kalk.individuell
                    ? "Wir melden uns für die individuelle Planung bei Ihnen."
                    : "Wir prüfen Ihre Angaben und melden uns für den Planungstermin vor Ort – ein Meister, kein Verkäufer."}
            </p>

            <Feld l="Ihr Name" id="w-name" v={c.name} e={fehler.name} ac="name" ph="Vor- und Nachname" on={(v) => onChange({ name: v })} />
            <Feld l="Straße und Hausnummer" id="w-str" v={c.strasse} e={fehler.strasse} ac="street-address" ph="Musterstraße 1" on={(v) => onChange({ strasse: v })} />
            <div className="edw-row">
                <Feld l="PLZ" id="w-plz" v={c.plz} e={fehler.plz} ac="postal-code" ph="55286" flex="0 0 130px"
                    on={(v) => onChange({ plz: v.replace(/[^\d]/g, "").slice(0, 5) })} />
                <Feld l="Ort" id="w-ort" v={c.ort} e={fehler.ort} ac="address-level2" ph="Wörrstadt" flex="1 1 auto" on={(v) => onChange({ ort: v })} />
            </div>
            <Feld l="Telefonnummer" id="w-tel" t="tel" v={c.tel} e={fehler.tel} ac="tel" ph="Für kurze Rückfragen" on={(v) => onChange({ tel: v })} />
            <Feld l="E-Mail-Adresse" id="w-mail" t="email" v={c.mail} e={fehler.mail} ac="email" ph="name@beispiel.de" on={(v) => onChange({ mail: v })} />
            <Feld l="Wann erreichen wir Sie am besten? (optional)" id="w-zeit" v={c.zeit} ph="z. B. werktags ab 16 Uhr" on={(v) => onChange({ zeit: v })} />

            <button className="edw-prim" type="button" onClick={onSubmit} disabled={sendet} style={{ marginTop: 22 }}>
                {sendet ? "Wird gesendet …" : "Planungstermin anfragen"}{!sendet && <Chev dir="right" />}
            </button>

            {sendFehler && (
                <div className="edw-note edw-note-warn" style={{ marginTop: 16 }}>
                    Ihre Anfrage konnte gerade nicht gesendet werden. Bitte versuchen Sie es noch einmal
                    oder rufen Sie uns direkt an: {telefon}.
                </div>
            )}
            <ul className="edw-trust">
                <li><Ic n="check" /> Unverbindlich</li>
                <li><Ic n="check" /> Förderantrag übernehmen wir</li>
                <li><Ic n="check" /> Eigene Monteure aus Wörrstadt</li>
            </ul>
            <p className="edw-legal">
                Mit dem Absenden stimmen Sie unserer Datenschutzerklärung zu. Ihre Daten werden vertraulich
                behandelt, ausschließlich zur Bearbeitung Ihrer Anfrage verwendet und nicht an Dritte weitergegeben.
            </p>
        </div>
    )
}

function Feld({ l, id, v, e = undefined, on, t = "text", ph, ac = undefined, flex = undefined }) {
    return (
        <div style={{ display: "flex", flexDirection: "column", marginTop: 16, flex: flex || "1 1 auto", minWidth: 0 }}>
            <label className="edw-label" htmlFor={id}>{l}</label>
            <input id={id} type={t} className={"edw-input" + (e ? " edw-input-err" : "")} value={v}
                placeholder={ph} autoComplete={ac} onChange={(ev) => on(ev.target.value)} />
            {e && <span className="edw-err">{e}</span>}
        </div>
    )
}

function Danke({ onNeu }) {
    return (
        <div style={{ ...S.inner, maxWidth: 560, alignItems: "center", textAlign: "center" }}>
            <span className="edw-ok"><Ic n="check" /></span>
            <h2 style={{ ...S.titel, marginTop: 22 }}>Vielen Dank für Ihre Anfrage!</h2>
            <p style={S.unter}>
                Wir haben Ihre Angaben erhalten und melden uns zeitnah, um den Planungstermin vor Ort abzustimmen.
            </p>
            <p className="edw-tipp">
                Sie beschleunigen die Planung, wenn Sie uns vorab ein Foto vom Heizungsraum, vom Typenschild der
                alten Heizung und Ihre letzte Verbrauchsabrechnung schicken. Einfach an <strong>projekt@ed-elektro.de</strong>.
            </p>
            <button className="edw-sec" type="button" onClick={onNeu} style={{ marginTop: 22 }}>Neue Anfrage starten</button>
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
        case "house": return <svg {...p}><path d="M3 9.5 12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z" /><polyline points="9 21 9 13 15 13 15 21" /></svg>
        case "rooms": return <svg {...p}><rect x="3" y="4" width="8" height="16" rx="1" /><rect x="13" y="4" width="8" height="16" rx="1" /></svg>
        case "building": return <svg {...p}><rect x="4" y="3" width="16" height="18" rx="1" /><path d="M9 8h.01M15 8h.01M9 12h.01M15 12h.01M9 16h.01M15 16h.01" /></svg>
        case "store": return <svg {...p}><path d="M3 9 4.5 4h15L21 9" /><path d="M4 9v11a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V9" /><path d="M3 9a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0" /></svg>
        case "flame": return <svg {...p}><path d="M12 22c4 0 7-2.7 7-6.5 0-4.5-4-6-4-10.5-3 2-5 4.5-5 7 0-1.5-1-2.5-2-3.5-1 2-3 4-3 7C5 19.3 8 22 12 22z" /></svg>
        case "drop": return <svg {...p}><path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z" /></svg>
        case "bolt": return <svg {...p}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
        case "crane": return <svg {...p}><path d="M6 21V4h2v17M4 21h8M8 5h12l-3 3M8 5l4 3" /><path d="M17 8v5" /><rect x="15.5" y="13" width="3" height="3" /></svg>
        case "ruler": return <svg {...p}><path d="M3 15 15 3l6 6L9 21z" /><path d="M7 11l2 2M11 7l2 2M10 14l1.5 1.5" /></svg>
        case "brick": return <svg {...p}><rect x="3" y="5" width="18" height="14" rx="1" /><path d="M3 12h18M9 5v7M15 12v7" /></svg>
        case "star": return <svg {...p}><polygon points="12 2.5 15 9.2 22.2 10 16.8 14.8 18.4 22 12 18.3 5.6 22 7.2 14.8 1.8 10 9 9.2" /></svg>
        case "floor": return <svg {...p}><path d="M3 20h18" /><path d="M4 16c2-2 4 2 6 0s4 2 6 0 3 1 4 0" /><path d="M4 12c2-2 4 2 6 0s4 2 6 0 3 1 4 0" /></svg>
        case "radiator": return <svg {...p}><rect x="3" y="5" width="18" height="13" rx="2" /><path d="M7 5v13M11 5v13M15 5v13M19 5v13M6 18v2M18 18v2" /></svg>
        case "tap": return <svg {...p}><path d="M4 8h9a3 3 0 0 1 3 3v2" /><path d="M8 5v3M5 5h6" /><path d="M16 17s-1.5 1.8-1.5 2.8a1.5 1.5 0 0 0 3 0C17.5 18.8 16 17 16 17z" /></svg>
        case "person": return <svg {...p}><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></svg>
        case "people": return <svg {...p}><circle cx="9" cy="8" r="3.5" /><path d="M2 20a7 7 0 0 1 14 0" /><path d="M16 4.5a3.5 3.5 0 0 1 0 7M18 13.5a7 7 0 0 1 4 6.5" /></svg>
        case "tool": return <svg {...p}><path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.4-.6-.6-2.4z" /></svg>
        case "cal": return <svg {...p}><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 11h18" /></svg>
        case "check": return <svg {...p} width="18" height="18"><polyline points="20 6 9 17 4 12" /></svg>
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
    fill: { height: "100%", borderRadius: 999, background: "var(--edw-accent)", transition: "width .35s ease" },
    buehne: { maxWidth: 1080, width: "100%", margin: "0 auto", paddingTop: 40, display: "flex", justifyContent: "center" },
    inner: { display: "flex", flexDirection: "column", width: "100%", alignItems: "stretch" },
    titel: { margin: 0, fontSize: "clamp(23px, 2.7vw, 34px)", lineHeight: 1.2, fontWeight: 700, color: "#000", textAlign: "center", letterSpacing: "-0.01em" },
    unter: { margin: "12px auto 0", maxWidth: 620, fontSize: 16, lineHeight: 1.6, color: "#444", textAlign: "center" },
    grid: { display: "grid", gap: 16, marginTop: 34, width: "100%", marginLeft: "auto", marginRight: "auto" },
}

const CSS = `
.edw *, .edw *::before, .edw *::after { box-sizing: border-box; }
.edw button { font-family: inherit; }

.edw-ghost { white-space:nowrap; display:inline-flex; align-items:center; gap:6px; background:transparent; border:0; cursor:pointer;
  font-size:14px; font-weight:600; color:#64748B; padding:6px 8px; border-radius:8px; transition:color .15s, background .15s; }
.edw-ghost:hover { color:var(--edw-accent); background:rgba(29,91,207,.07); }
.edw-link { margin-top:14px; align-self:center; background:transparent; border:0; cursor:pointer; font-size:15px; font-weight:600;
  color:var(--edw-accent); text-decoration:underline; text-underline-offset:3px; padding:6px; }

.edw-card { display:flex; flex-direction:column; align-items:center; justify-content:center; gap:10px; text-align:center;
  min-height:172px; padding:24px 18px; cursor:pointer; background:#fff; border:1px solid #E3E8F0; border-radius:14px;
  box-shadow:0 1px 2px rgba(15,23,42,.04); transition:transform .18s, box-shadow .18s, border-color .18s; }
.edw-card:hover { transform:translateY(-3px); border-color:var(--edw-accent); box-shadow:0 12px 24px -12px rgba(29,91,207,.35); }
.edw-card:focus-visible { outline:2px solid var(--edw-accent); outline-offset:2px; }
.edw-card-on { border-color:var(--edw-accent); box-shadow:0 0 0 2px rgba(29,91,207,.18); }
.edw-ic { color:var(--edw-accent); display:flex; }
.edw-lab { font-size:16px; font-weight:600; color:#0F172A; line-height:1.35; }
.edw-hint { font-size:13px; color:#64748B; line-height:1.45; }
.edw-mini { margin-top:8px; font-size:13px; color:#64748B; line-height:1.5; }

.edw-heizlast { margin:26px auto 0; display:flex; align-items:center; justify-content:center; gap:28px; padding:18px 26px;
  background:#fff; border:1px solid #E3E8F0; border-radius:14px; color:#94A3B8; }
.edw-heizlast > div { display:flex; flex-direction:column; align-items:center; gap:2px; text-align:center; }
.edw-hl-lab { font-size:12px; font-weight:700; letter-spacing:.06em; text-transform:uppercase; color:#64748B; }
.edw-hl-zahl { font-size:26px; font-weight:800; color:#0F172A; font-variant-numeric:tabular-nums; }
.edw-hl-sub { font-size:13px; color:#64748B; }

.edw-preis { position:relative; display:flex; flex-direction:column; align-items:center; gap:8px; padding:32px 22px 26px;
  background:#fff; border:1px solid #E3E8F0; border-radius:16px; text-align:center; }
.edw-preis-on { border-color:var(--edw-accent); box-shadow:0 0 0 2px rgba(29,91,207,.18), 0 16px 32px -18px rgba(29,91,207,.45); }
.edw-badge { position:absolute; top:-12px; left:50%; transform:translateX(-50%); white-space:nowrap; padding:4px 12px;
  border-radius:999px; background:var(--edw-accent); color:#fff; font-size:12px; font-weight:700; }
.edw-preis-lab { font-size:13px; font-weight:700; letter-spacing:.06em; text-transform:uppercase; color:#64748B; }
.edw-preis-zahl { font-size:clamp(28px,3.6vw,40px); font-weight:800; color:var(--edw-accent); font-variant-numeric:tabular-nums; line-height:1.15; white-space:nowrap; }
.edw-preis-sub { font-size:14px; color:#475569; font-variant-numeric:tabular-nums; }
.edw-preis-note { margin-top:4px; font-size:14px; line-height:1.5; color:#475569; max-width:320px; }

.edw-lv-titel { margin:30px auto 0; font-size:17px; font-weight:700; color:#0F172A; text-align:center; }
.edw-why { display:block; margin-top:2px; font-size:12.5px; font-style:normal; color:#94A3B8; }
.edw-note { margin:20px auto 0; max-width:900px; width:100%; padding:14px 18px; border-radius:10px; font-size:14px;
  line-height:1.55; background:#EAF0FC; color:#1E3A8A; border:1px solid #C7D8F7; }
.edw-note-warn { background:#FEF3C7; color:#78350F; border-color:#FCD34D; }

.edw-two { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:18px; width:100%; max-width:900px; margin:26px auto 0; }
.edw-preise { margin-top:34px; }
.edw-box { display:flex; flex-direction:column; gap:11px; padding:24px 22px; background:#fff; border:1px solid #E3E8F0; border-radius:14px; }
.edw-box-alt { background:#F8FAFC; }
.edw-box-t { font-size:16px; font-weight:700; color:#0F172A; margin-bottom:2px; }
.edw-li { display:flex; align-items:flex-start; gap:9px; font-size:14px; line-height:1.5; color:#334155; }
.edw-li svg { flex:0 0 auto; margin-top:1px; color:var(--edw-accent); }
.edw-li-off { color:#64748B; }
.edw-li-off svg { color:#94A3B8; }

.edw-disclaimer { margin:22px auto 0; max-width:700px; font-size:13px; line-height:1.65; color:#64748B; text-align:center; }

.edw-label { font-size:14px; font-weight:600; color:#0F172A; margin-bottom:8px; }
.edw-input { width:100%; height:52px; padding:0 16px; font-size:16px; color:#0F172A; background:#fff;
  border:1px solid #E3E8F0; border-radius:10px; outline:none; font-family:inherit; transition:border-color .15s, box-shadow .15s; }
.edw-input::placeholder { color:#94A3B8; }
.edw-input:focus { border-color:var(--edw-accent); box-shadow:0 0 0 3px rgba(29,91,207,.14); }
.edw-input-err { border-color:#DC2626; }
.edw-err { margin-top:6px; font-size:13px; color:#DC2626; }
.edw-row { display:flex; gap:12px; align-items:flex-start; }

.edw-prim { display:inline-flex; align-items:center; justify-content:center; gap:8px; height:54px; padding:0 26px;
  cursor:pointer; width:100%; background:var(--edw-accent); color:#fff; border:0; border-radius:10px; font-size:16px;
  font-weight:600; align-self:center; transition:filter .15s, transform .15s; }
.edw-prim:hover:not(:disabled) { filter:brightness(1.08); }
.edw-prim:active:not(:disabled) { transform:translateY(1px); }
.edw-prim:disabled { opacity:.6; cursor:default; }
.edw-sec { display:inline-flex; align-items:center; justify-content:center; gap:8px; height:48px; padding:0 22px;
  cursor:pointer; background:#fff; color:var(--edw-accent); border:1px solid var(--edw-accent); border-radius:10px;
  font-size:15px; font-weight:600; align-self:center; }
.edw-sec:hover { background:rgba(29,91,207,.06); }

.edw-toggle { display:inline-flex; flex-wrap:wrap; justify-content:center; align-self:center; gap:4px; padding:4px; margin:28px 0 4px;
  background:#fff; border:1px solid #E3E8F0; border-radius:999px; }
.edw-tg { border:0; background:transparent; cursor:pointer; padding:9px 18px; border-radius:999px; font-size:14px;
  font-weight:600; color:#64748B; transition:background .15s, color .15s; }
.edw-tg-on { background:var(--edw-accent); color:#fff; }

.edw-trust { list-style:none; padding:0; margin:18px 0 0; display:flex; flex-wrap:wrap; gap:8px 20px; justify-content:center; }
.edw-trust li { display:inline-flex; align-items:center; gap:6px; font-size:14px; color:#475569; }
.edw-trust svg { width:16px; height:16px; color:var(--edw-accent); }
.edw-legal { margin:18px 0 0; font-size:12px; line-height:1.6; color:#94A3B8; text-align:center; }
.edw-tipp { margin:16px auto 0; max-width:480px; font-size:14px; line-height:1.6; color:#475569;
  background:#fff; border:1px solid #E3E8F0; border-radius:12px; padding:16px 18px; }

.edw-spin { width:44px; height:44px; border-radius:50%; border:3px solid #DDE5F1; border-top-color:var(--edw-accent);
  animation:edw-spin .8s linear infinite; align-self:center; }
@keyframes edw-spin { to { transform:rotate(360deg); } }
.edw-ok { width:64px; height:64px; border-radius:50%; display:inline-flex; align-items:center; justify-content:center;
  align-self:center; background:rgba(29,91,207,.1); color:var(--edw-accent); }
.edw-ok svg { width:32px; height:32px; }

@media (max-width: 900px) {
  .edw-grid { grid-template-columns:repeat(3,minmax(0,1fr)) !important; max-width:100% !important; }
  .edw-two { grid-template-columns:1fr; }
  .edw-preise { gap:26px; }
}
@media (max-width: 640px) {
  .edw-grid { grid-template-columns:repeat(2,minmax(0,1fr)) !important; max-width:100% !important; gap:12px; }
  .edw-card { min-height:146px; padding:18px 12px; }
  .edw-hint { display:none; }
  .edw-row { flex-direction:column; gap:0; }
  .edw-row > div { flex:1 1 auto !important; }
  .edw-preis-zahl { font-size:28px; }
  .edw-heizlast { gap:14px; padding:16px; }
  .edw-hl-zahl { font-size:22px; }
  .edw-ghost { font-size:13px; padding:6px 4px; }
}
`

const num = (title, defaultValue, max = 100000, step = 1) =>
    ({ type: ControlType.Number, title, defaultValue, min: 0, max, step, displayStepper: false })

addPropertyControls(WaermepumpenFunnel, {
    accent: { type: ControlType.Color, title: "Akzentfarbe", defaultValue: "#1D5BCF" },
    k6o: num("6 kW ohne WW", 17549),
    k6m: num("6 kW mit WW", 21814),
    k8o: num("8 kW ohne WW", 17549),
    k8m: num("8 kW mit WW", 21814),
    k12o: num("12 kW ohne WW", 18134),
    k12m: num("12 kW mit WW", 22074),
    k18o: num("18 kW ohne WW", 18654),
    k18m: num("18 kW mit WW", 23244),
    demontageLo: num("Demontage von", 600, 10000, 10),
    demontageHi: num("Demontage bis", 700, 10000, 10),
    mwst: num("MwSt %", 19, 30),
    vollbenutzung: num("Vollbenutzungsstd.", 2000, 4000, 50),
    nutzungsgrad: num("Nutzungsgrad Kessel %", 85, 100),
    hkZuschlag: num("Zuschlag Heizkörper %", 10, 50),
    wwJePerson: num("WW kW je Person", 0.25, 2, 0.05),
    leadWert: num("Conversion-Wert €", 1500),
    foerderMax: num("Förderung max. €", 22400),
    startTermin: { type: ControlType.Boolean, title: "Start mit Terminanfrage", defaultValue: false },
    telefon: { type: ControlType.String, title: "Telefon", defaultValue: "06732 600 7358" },
    webhookUrl: { type: ControlType.String, title: "Ziel-URL", placeholder: "Leer = kein Versand", defaultValue: "" },
})
