// Interaktion für die Klimaanlagen-Landingpage.
// Läuft identisch in der statischen Seite und in der Framer-Code-Komponente (dort per useEffect).
function initKlimaLP(root, opts) {
  if (!root || root.__edkReady) return function () {}
  root.__edkReady = true
  opts = opts || {}
  var win = root.ownerDocument.defaultView
  var params = new URLSearchParams(win.location.search)
  var store = safeStorage(win)

  // SEA: Klick-IDs und UTM-Parameter merken, damit sie beim Absenden noch da sind
  var keys = ["gclid", "gbraid", "wbraid", "utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"]
  keys.forEach(function (k) {
    var v = params.get(k)
    if (v) store.set("edk_" + k, v.slice(0, 200))
  })

  // Anzeigen-Modus: Navigation ausblenden, damit Besucher aus Google Ads beim Angebot bleiben
  var fromAds = params.get("lp") === "ads" || params.has("gclid") || params.has("gbraid") || params.has("wbraid") || /cpc|ppc|paid/i.test(params.get("utm_medium") || "")
  if (fromAds) root.setAttribute("data-edk-mode", "ads")

  // Message Match: Überschrift passend zur Anzeigengruppe (nur freigegebene Varianten, nie freier Text aus der URL)
  var headlines = {
    split: "Split-Klimaanlage mit Montage: Beratung, Einbau und Wartung aus einer Hand",
    multisplit: "Multi-Split-Klimaanlage für mehrere Räume, geplant und montiert vom Fachbetrieb",
    mainz: "Klimaanlage in Mainz: Beratung, Montage und Wartung vom Fachbetrieb",
    alzey: "Klimaanlage in Alzey: Beratung, Montage und Wartung vom Fachbetrieb",
    niederolm: "Klimaanlage in Nieder-Olm: Beratung, Montage und Wartung vom Fachbetrieb",
    heizen: "Klimaanlage mit Heizfunktion: im Sommer kühlen, in der Übergangszeit heizen",
    gewerbe: "Klimaanlage für Büro und Gewerbe: geplant nach Raumlast und Nutzung",
    wartung: "Klimaanlage warten lassen: Reinigung, Dichtheitsprüfung und Reparatur"
  }
  var kw = (params.get("kw") || "").toLowerCase().replace(/[^a-z]/g, "")
  var h1 = root.querySelector("[data-edk-headline]")
  if (h1 && headlines[kw]) h1.textContent = headlines[kw]

  function track(event, data) {
    var dl = (win.dataLayer = win.dataLayer || [])
    dl.push(Object.assign({ event: event, lp: "klimaanlagen" }, data || {}))
  }

  function onClick(e) {
    var el = e.target.closest && e.target.closest("[data-edk-track]")
    if (!el) return
    var area = el.closest("form, header, section, .edk-callbar")
    track(el.getAttribute("data-edk-track"), { location: area ? area.className.split(" ")[0] : "" })
  }
  root.addEventListener("click", onClick)

  var form = root.querySelector("[data-edk-form]")
  var status = root.querySelector("[data-edk-status]")
  var started = false

  function setStatus(state, text) {
    if (!status) return
    status.setAttribute("data-state", state)
    status.textContent = text
  }

  function onInput() {
    if (started) return
    started = true
    track("form_start")
  }

  function onSubmit(e) {
    e.preventDefault()
    if (!form.checkValidity()) {
      form.reportValidity()
      setStatus("error", "Bitte füllen Sie die markierten Felder aus.")
      return
    }
    var data = new FormData(form)
    if (data.get("firma_website")) return // Spam-Falle
    keys.forEach(function (k) { if (!data.get(k)) data.set(k, store.get("edk_" + k) || "") })
    data.set("seite", win.location.href.split("#")[0])

    var endpoint = (opts.formEndpoint || form.getAttribute("action") || "").trim()
    var btn = form.querySelector("button[type=submit]")
    btn.disabled = true
    btn.setAttribute("aria-busy", "true")
    setStatus("loading", "Wird gesendet …")

    if (!endpoint) {
      // Kein Endpunkt hinterlegt: Anfrage als E-Mail vorbereiten, damit nichts verloren geht
      var lines = []
      data.forEach(function (v, k) { if (v && k !== "firma_website") lines.push(k + ": " + v) })
      win.location.href = "mailto:" + (opts.email || "") + "?subject=" + encodeURIComponent("Anfrage Klimaanlage") + "&body=" + encodeURIComponent(lines.join("\n"))
      done(true)
      return
    }

    fetch(endpoint, { method: "POST", body: data, headers: { Accept: "application/json" } })
      .then(function (r) { done(r.ok) })
      .catch(function () { done(false) })

    function done(ok) {
      btn.disabled = false
      btn.removeAttribute("aria-busy")
      if (ok) {
        track("generate_lead", { raeume: data.get("raeume"), gebaeude: data.get("gebaeude") })
        form.reset()
        setStatus("success", "Danke! Ihre Anfrage ist bei uns angekommen. Wir melden uns mit einem Terminvorschlag.")
      } else {
        setStatus("error", "Das hat nicht geklappt. Bitte rufen Sie uns an oder versuchen Sie es erneut.")
      }
    }
  }

  if (form) {
    form.addEventListener("input", onInput)
    form.addEventListener("submit", onSubmit)
  }

  return function cleanup() {
    root.removeEventListener("click", onClick)
    if (form) {
      form.removeEventListener("input", onInput)
      form.removeEventListener("submit", onSubmit)
    }
    root.__edkReady = false
  }
}

function safeStorage(win) {
  return {
    get: function (k) { try { return win.sessionStorage.getItem(k) } catch (e) { return null } },
    set: function (k, v) { try { win.sessionStorage.setItem(k, v) } catch (e) {} }
  }
}
