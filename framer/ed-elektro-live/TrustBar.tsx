import { addPropertyControls, ControlType } from "framer"
import { useId } from "react"
import type { ReactNode } from "react"
import type { CSSProperties } from "react"
import { breakpoints, fontFamily, styleHtml, tokens } from "https://framer.com/m/tokens-x6g0t9.js@tWKhZJ2SyC5SsFax1CzI"

type IconName = "meister" | "zeit" | "auftraege" | "team" | "keins"

interface Claim {
    text: string
    icon: IconName
}

interface TrustBarProps {
    variant: "dunkel" | "hell"
    claims: Claim[]
    style?: CSSProperties
}

const visuallyHidden: CSSProperties = {
    position: "absolute",
    width: 1,
    height: 1,
    margin: -1,
    padding: 0,
    overflow: "hidden",
    clip: "rect(0 0 0 0)",
    whiteSpace: "nowrap",
    border: 0,
}

/**
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight auto
 */
export default function TrustBar(props: TrustBarProps) {
    const { variant = "dunkel", claims = DEFAULT_CLAIMS, style } = props

    const labelId = useId()
    const scope = `ed-trust-${labelId.replace(/[^a-zA-Z0-9-]/g, "")}`
    const dunkel = variant !== "hell"

    // Framer überträgt für verschachtelte Array-Felder keine Defaults.
    const merged = claims.map((c, i) => ({
        ...c,
        icon: c && c.icon ? c.icon : (DEFAULT_CLAIMS[i] ? DEFAULT_CLAIMS[i].icon : "keins"),
    }))
    const visible = merged.filter((c) => c && c.text)

    const css = `
.${scope} {
    container-type: inline-size;
    width: 100%;
    background-color: ${dunkel ? tokens.color.navy : tokens.color.surfaceAlt};
    font-family: ${fontFamily.body};
}
.${scope}__inner {
    width: 100%;
    max-width: ${tokens.maxWidth}px;
    margin: 0 auto;
    padding: ${tokens.space[5]}px ${tokens.space[4]}px;
}
.${scope}__list {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: ${tokens.space[3]}px ${tokens.space[6]}px;
    margin: 0;
    padding: 0;
    list-style: none;
}
.${scope}__item {
    display: flex;
    align-items: center;
    gap: ${tokens.space[3]}px;
    font-size: 0.9375rem;
    font-weight: 500;
    line-height: 1.4;
    color: ${dunkel ? tokens.color.textOnDark : tokens.color.navy};
}
.${scope}__item svg { flex: 0 0 auto; opacity: ${dunkel ? 0.85 : 1}; }
@container (min-width: ${breakpoints.tablet}px) {
    .${scope}__inner { padding: ${tokens.space[5]}px ${tokens.space[6]}px; }
    .${scope}__list { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
@container (min-width: ${breakpoints.desktop}px) {
    /* Eine Zeile: kurze Einträge bleiben einzeilig, nur lange Einträge brechen innerhalb ihres Feldes um */
    .${scope}__list { display: flex; flex-wrap: nowrap; justify-content: space-between; gap: ${tokens.space[5]}px; }
    .${scope}__item { flex: 0 0 auto; white-space: nowrap; }
    .${scope}__item--lang { flex: 0 1 auto; min-width: 0; white-space: normal; }
}
`

    return (
        <section aria-labelledby={labelId} className={scope} style={style}>
            <style dangerouslySetInnerHTML={styleHtml(css)} />
            <h2 id={labelId} style={visuallyHidden}>
                Warum ED Elektro
            </h2>
            <div className={`${scope}__inner`}>
                <ul className={`${scope}__list`}>
                    {visible.map((c, i) => (
                        <li key={i} className={`${scope}__item` + ((c.text || "").length > 40 ? ` ${scope}__item--lang` : "")}>
                            <TrustIcon name={c.icon} color={dunkel ? "#9FC0F5" : tokens.color.primary} />
                            {c.text}
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    )
}

function Glyph({ color, children }: { color: string; children: ReactNode }) {
    return (
        <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke={color}
            strokeWidth={1.6}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            focusable="false"
        >
            {children}
        </svg>
    )
}

function TrustIcon({ name, color }: { name: IconName; color: string }) {
    if (name === "keins") return null
    if (name === "zeit")
        return (
            <Glyph color={color}>
                <circle cx="12" cy="12" r="8.5" />
                <path d="M12 7.5V12l3 1.8" />
            </Glyph>
        )
    if (name === "auftraege")
        return (
            <Glyph color={color}>
                <path d="M3.5 16l4-4.5 3.5 3 4-6 5.5 7.5" />
            </Glyph>
        )
    if (name === "team")
        return (
            <Glyph color={color}>
                <circle cx="9" cy="9" r="3" />
                <path d="M3.5 18.5c.6-2.8 2.8-4.5 5.5-4.5s4.9 1.7 5.5 4.5" />
                <path d="M16 6.2a3 3 0 010 5.6M17.5 14.4c1.7.7 2.8 2.1 3.2 4.1" />
            </Glyph>
        )
    // meister
    return (
        <Glyph color={color}>
            <rect x="4.5" y="3.5" width="15" height="12" rx="1.6" />
            <path d="M8 7.5h8M8 11h5" />
            <path d="M8.5 15.5v5l3.5-2 3.5 2v-5" />
        </Glyph>
    )
}

const DEFAULT_CLAIMS: Claim[] = [
    { text: "Meisterbetrieb aus Wörrstadt", icon: "meister" },
    { text: "Über 12 Jahre Erfahrung", icon: "zeit" },
    { text: "3.000+ abgeschlossene Aufträge", icon: "auftraege" },
    { text: "Eigene Monteure, keine Fremdfirmen", icon: "team" },
]

addPropertyControls(TrustBar, {
    variant: {
        type: ControlType.Enum,
        title: "Variante",
        options: ["dunkel", "hell"],
        optionTitles: ["Dunkel", "Hell"],
        defaultValue: "dunkel",
    },
    claims: {
        type: ControlType.Array,
        title: "Claims",
        description: "Leere Einträge werden nicht gerendert.",
        control: {
            type: ControlType.Object,
            controls: {
                text: { type: ControlType.String, title: "Text", defaultValue: "" },
                icon: {
                    type: ControlType.Enum,
                    title: "Icon",
                    options: ["meister", "zeit", "auftraege", "team", "keins"],
                    optionTitles: ["Meisterbrief", "Uhr", "Aufträge", "Team", "ohne"],
                    defaultValue: "meister",
                },
            },
        },
        defaultValue: DEFAULT_CLAIMS,
    },
})
