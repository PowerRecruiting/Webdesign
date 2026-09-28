// Überträgt die Landingpage in das Framer-Projekt von ED Elektro.
//
//   1. Code-Datei "KlimaLandingpage.tsx" anlegen bzw. aktualisieren
//   2. Vorlagenseite (Node aus site.config.json) nach /klimaanlagen klonen (nur beim ersten Lauf)
//   3. Komponente in die neue Seite einsetzen
//   4. optional veröffentlichen (--publish)
//
// Aufruf (Node 22+):  FRAMER_API_KEY=… node framer/sync.mjs [--publish]
import { connect, isWebPageNode, isCodeFileComponentExport } from "framer-api"
import { readFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const here = dirname(fileURLToPath(import.meta.url))
const cfg = JSON.parse(readFileSync(join(here, "../site.config.json"), "utf8"))
const code = readFileSync(join(here, "KlimaLandingpage.tsx"), "utf8")
const seo = JSON.parse(readFileSync(join(here, "seo.json"), "utf8"))
const FILE = "KlimaLandingpage.tsx"
const publish = process.argv.includes("--publish")

if (!process.env.FRAMER_API_KEY) {
  console.error("FRAMER_API_KEY fehlt. Key in Framer unter Einstellungen → API Keys erzeugen.")
  process.exit(1)
}

const framer = await connect(cfg.framerProjectUrl, process.env.FRAMER_API_KEY)
try {
  // 1. Code-Datei
  const files = await framer.getCodeFiles()
  let file = files.find((f) => f.name === FILE || f.path.endsWith(FILE))
  file = file ? await file.setFileContent(code) : await framer.createCodeFile(FILE, code)
  const component = file.exports.find(isCodeFileComponentExport)
  if (!component) throw new Error("Code-Datei hat keinen Komponenten-Export – Fehler in Framer prüfen.")
  console.log("✓ Code-Komponente:", file.path)

  // 2. Zielseite finden oder aus der Vorlage klonen
  const pages = await framer.getNodesWithType("WebPageNode")
  let page = pages.find((p) => p.path === seo.path)
  if (!page) {
    let template = await framer.getNode(cfg.framerTemplateNodeId)
    while (template && !isWebPageNode(template)) template = await template.getParent()
    page = template ? await template.clone({ path: seo.path }) : await framer.createWebPage(seo.path)
    console.log(template ? "✓ Vorlage geklont nach" : "✓ Neue Seite angelegt:", page.path, "(Entwurf)")
  } else {
    console.log("✓ Seite existiert bereits:", page.path)
  }

  // 3. Komponente einsetzen (nur, wenn noch keine Instanz auf der Seite ist)
  const instances = await page.getNodesWithType("ComponentInstanceNode")
  const existing = instances.find((n) => n.componentIdentifier === component.componentId || n.name === "KlimaLandingpage")
  if (existing) {
    console.log("✓ Komponente ist schon auf der Seite, Inhalt wurde über die Code-Datei aktualisiert")
  } else {
    const [breakpoint] = await page.getChildren()
    const node = await framer.addComponentInstance({
      url: component.insertURL,
      parentId: breakpoint?.id ?? page.id,
      attributes: {
        name: "KlimaLandingpage",
        width: "1fr",
        height: "fit-content",
        position: "relative",
        controls: {
          telefon: cfg.telefon,
          telefonLink: cfg.telefonLink,
          email: cfg.email,
          formEndpoint: cfg.formEndpoint,
          kopfUndFuss: false,
        },
      },
    })
    console.log("✓ Komponente eingesetzt:", node.id)
  }

  console.log("\nIn Framer noch von Hand (Seiten-Einstellungen von", seo.path + "):")
  console.log("  Titel:        ", seo.title)
  console.log("  Beschreibung: ", seo.description)
  console.log("  Social-Bild:  ", seo.ogImage)
  console.log("  Entwurf-Status entfernen, Vorlagen-Inhalte zwischen Navigation und Footer löschen.")

  if (publish) {
    const result = await framer.publish()
    console.log("✓ Veröffentlicht:", JSON.stringify(result.hostnames ?? result))
  }
} finally {
  await framer.disconnect()
}
