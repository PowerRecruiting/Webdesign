// Baut aus src/ zwei Ausgaben:
//   public/index.html              statische Seite (Vorschau oder eigenständiges Hosting)
//   framer/KlimaLandingpage.tsx    Code-Komponente für Framer (gleicher Inhalt, gleiche Styles)
// Aufruf: node build.mjs
import { readFileSync, writeFileSync, mkdirSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const here = dirname(fileURLToPath(import.meta.url))
const read = (p) => readFileSync(join(here, p), "utf8")
const cfg = JSON.parse(read("site.config.json"))
const body = read("src/body.html")
const css = read("src/styles.css")
const js = read("src/main.js")

const isSet = (v) => v && !String(v).startsWith("TODO")
const url = cfg.domain.replace(/\/$/, "") + cfg.pfad

const title = "Klimaanlage kaufen & montieren in Mainz, Nieder-Olm, Alzey | ED Elektro"
const description =
  "Split- und Multi-Split-Klimaanlagen vom Elektro-Fachbetrieb: Beratung, Montage, Elektroanschluss und Wartung in Mainz, Nieder-Olm, Alzey und Rheinhessen. Jetzt kostenlose Besichtigung anfragen."

// FAQ-Schema direkt aus dem sichtbaren Inhalt, damit Markup und Seite nie auseinanderlaufen
const strip = (s) => s.replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim()
const faq = [...body.matchAll(/<details><summary>(.*?)<\/summary><p>(.*?)<\/p><\/details>/gs)].map((m) => ({
  "@type": "Question",
  name: strip(m[1]),
  acceptedAnswer: { "@type": "Answer", text: strip(m[2]) },
}))

const business = {
  "@type": ["HVACBusiness", "Electrician"],
  "@id": cfg.domain + "/#betrieb",
  name: cfg.firma,
  url: cfg.domain,
  areaServed: ["Mainz", "Nieder-Olm", "Alzey", "Ingelheim am Rhein", "Wörrstadt", "Bodenheim", "Nierstein", "Saulheim"].map((n) => ({ "@type": "City", name: n })),
}
if (isSet(cfg.telefon)) business.telephone = cfg.telefonLink
if (isSet(cfg.email)) business.email = cfg.email
if (isSet(cfg.strasse) && isSet(cfg.plz)) {
  business.address = { "@type": "PostalAddress", streetAddress: cfg.strasse, postalCode: cfg.plz, addressLocality: cfg.ort, addressCountry: "DE" }
}

const jsonld = {
  "@context": "https://schema.org",
  "@graph": [
    business,
    {
      "@type": "Service",
      name: "Klimaanlage Beratung, Montage und Wartung",
      serviceType: "Installation von Klimaanlagen",
      provider: { "@id": business["@id"] },
      areaServed: business.areaServed,
      url,
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Start", item: cfg.domain + "/" },
        { "@type": "ListItem", position: 2, name: "Klimaanlagen", item: url },
      ],
    },
    { "@type": "FAQPage", mainEntity: faq },
  ],
}

const fill = (html, c) =>
  html
    .replaceAll("{{TELEFON}}", c.telefon)
    .replaceAll("{{TELEFON_LINK}}", c.telefonLink)
    .replaceAll("{{EMAIL}}", c.email)
    .replaceAll("{{FIRMA}}", cfg.firma)
    .replaceAll("{{STRASSE}}", cfg.strasse)
    .replaceAll("{{PLZ}}", cfg.plz)
    .replaceAll("{{ORT}}", cfg.ort)
    .replaceAll("{{FORM_ENDPOINT}}", c.formEndpoint)
    .replaceAll("{{JSONLD}}", JSON.stringify(jsonld).replace(/</g, "\\u003c"))

// ---------- statische Seite ----------
const page = `<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<meta name="description" content="${description}">
<link rel="canonical" href="${url}">
<meta name="robots" content="index, follow, max-image-preview:large">
<meta property="og:type" content="website">
<meta property="og:locale" content="de_DE">
<meta property="og:site_name" content="${cfg.firma}">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${description}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${cfg.ogImage}">
<meta name="twitter:card" content="summary_large_image">
<meta name="geo.region" content="DE-RP">
<meta name="geo.placename" content="${cfg.ort}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<style>
html, body { margin: 0; overflow-x: clip; }
${css}
</style>
</head>
<body>
${fill(body, cfg)}
<script>
${js}
initKlimaLP(document.querySelector("[data-edk]"), { email: ${JSON.stringify(cfg.email)} })
</script>
</body>
</html>
`
mkdirSync(join(here, "public"), { recursive: true })
writeFileSync(join(here, "public/index.html"), page)

// ---------- Framer-Code-Komponente ----------
const token = (name) => "\u0000" + name + "\u0000"
const framerBody = fill(body, {
  telefon: token("telefon"),
  telefonLink: token("telefonLink"),
  email: token("email"),
  formEndpoint: token("formEndpoint"),
})

const tsx = `// @ts-nocheck
// AUTOMATISCH ERZEUGT von build.mjs, bitte nicht direkt bearbeiten.
// Quelle: projects/ed-elektro-klimaanlagen/src/*
import { useEffect, useRef } from "react"
import { addPropertyControls, ControlType } from "framer"

const CSS = ${JSON.stringify(css)}

const HTML = ${JSON.stringify(framerBody)}

${js}

const esc = (s: string) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;")

/**
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight auto
 */
export default function KlimaLandingpage(props) {
    const ref = useRef<HTMLDivElement>(null)
    const html = HTML.replace(/\\u0000(\\w+)\\u0000/g, (_, k) => esc(props[k] ?? ""))
    useEffect(() => {
        const root = ref.current?.querySelector("[data-edk]") as HTMLElement | null
        return initKlimaLP(root, { formEndpoint: props.formEndpoint, email: props.email })
    }, [props.formEndpoint, props.email])
    return (
        <div ref={ref} style={{ width: "100%", ...props.style }} data-edk-hide-chrome={props.kopfUndFuss === false ? "" : undefined}>
            <style>{CSS}</style>
            <div dangerouslySetInnerHTML={{ __html: html }} />
        </div>
    )
}

KlimaLandingpage.defaultProps = {
    telefon: ${JSON.stringify(cfg.telefon)},
    telefonLink: ${JSON.stringify(cfg.telefonLink)},
    email: ${JSON.stringify(cfg.email)},
    formEndpoint: ${JSON.stringify(cfg.formEndpoint)},
    kopfUndFuss: true,
}

addPropertyControls(KlimaLandingpage, {
    telefon: { type: ControlType.String, title: "Telefon (Anzeige)" },
    telefonLink: { type: ControlType.String, title: "Telefon (Link, +49…)" },
    email: { type: ControlType.String, title: "E-Mail" },
    formEndpoint: { type: ControlType.String, title: "Formular-Endpunkt", placeholder: "https://hook.eu1.make.com/…" },
    kopfUndFuss: { type: ControlType.Boolean, title: "Eigene Kopf-/Fußzeile", description: "Aus, wenn die Framer-Seite schon Navigation und Footer hat." },
})
`
mkdirSync(join(here, "framer"), { recursive: true })
writeFileSync(join(here, "framer/KlimaLandingpage.tsx"), tsx)

writeFileSync(join(here, "framer/seo.json"), JSON.stringify({ path: cfg.pfad, title, description, canonical: url, ogImage: cfg.ogImage }, null, 2) + "\n")

console.log("public/index.html, framer/KlimaLandingpage.tsx und framer/seo.json erzeugt")
