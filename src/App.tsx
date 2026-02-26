import React, { useMemo, useState } from "react"
import { loadLetters, Letter } from "./lib/loadLetters"

type View = "gate" | "desk" | "letter"

const PASSPHRASE_CANONICAL = "wowyourehot"

function normalizePassphrase(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[\s'’"“”`´]/g, "")
    .replace(/[^a-z0-9]/g, "")
}

function uniqSorted(values: Array<string | undefined>) {
  const set = new Set(values.filter(Boolean) as string[])
  return Array.from(set).sort((a, b) => a.localeCompare(b))
}

function cardColors(theme?: string) {
  const t = (theme || "").toLowerCase()
  if (t.includes("comfort")) return { a: "#E7DFCF", b: "#D9CEB8" }
  if (t.includes("missing")) return { a: "#DCE8E3", b: "#CBDAD3" }
  if (t.includes("romance")) return { a: "#E9D2D7", b: "#E0C0C7" }
  if (t.includes("work")) return { a: "#DCE2EF", b: "#CCD5E6" }
  return { a: "#E3DAEC", b: "#D3C7E2" }
}

function getVisibleWindow(total: number, active: number, range = 2) {
  if (total <= 0) return []
  if (total <= range * 2 + 1) {
    return Array.from({ length: total }).map((_, i) => ({ idx: i, offset: i - active }))
  }
  const out: Array<{ idx: number; offset: number }> = []
  for (let off = -range; off <= range; off++) {
    const idx = (active + off + total) % total
    out.push({ idx, offset: off })
  }
  return out
}

export default function App() {
  const letters = useMemo(() => loadLetters(), [])

  const [view, setView] = useState<View>("gate")
  const [pass, setPass] = useState("")
  const [error, setError] = useState<string | null>(null)

  const themes = useMemo(() => uniqSorted(letters.map((l) => l.theme)), [letters])
  const occasions = useMemo(() => uniqSorted(letters.map((l) => l.occasion)), [letters])

  const [themeFilter, setThemeFilter] = useState("")
  const [occasionFilter, setOccasionFilter] = useState("")

  const filtered = useMemo(() => {
    return letters.filter((l) => {
      if (themeFilter && l.theme !== themeFilter) return false
      if (occasionFilter && l.occasion !== occasionFilter) return false
      return true
    })
  }, [letters, themeFilter, occasionFilter])

  const [activeIndex, setActiveIndex] = useState(0)

  const safeActiveIndex = Math.min(activeIndex, Math.max(0, filtered.length - 1))
  const activeLetter: Letter | undefined = filtered[safeActiveIndex]

  function onUnlock(e: React.FormEvent) {
    e.preventDefault()
    const ok =
      normalizePassphrase(pass) === normalizePassphrase(PASSPHRASE_CANONICAL)

    if (!ok) {
      setError("Wrong passphrase.")
      return
    }

    setError(null)
    setView("desk")
  }

  function go(delta: number) {
    if (filtered.length === 0) return
    const next = (safeActiveIndex + delta + filtered.length) % filtered.length
    setActiveIndex(next)
  }

  function openLetter() {
    if (!activeLetter) return
    setView("letter")
  }

  function lock() {
    setPass("")
    setError(null)
    setThemeFilter("")
    setOccasionFilter("")
    setActiveIndex(0)
    setView("gate")
  }

  const visible = useMemo(
    () => getVisibleWindow(filtered.length, safeActiveIndex, 2),
    [filtered.length, safeActiveIndex]
  )

  return (
    <div className="appRoot">
      {/* GATE */}
      {view === "gate" && (
        <main className="stageCenter">
          <section className="gateCard">
            <div className="gateTop">
              <h1 className="gateTitle">Restricted Romance Archive</h1>
              <p className="gateSub">Enter the passphrase.</p>
            </div>

            <form onSubmit={onUnlock} className="gateForm">
              <input
                className="gateInput"
                type="password"
                placeholder="Passphrase"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                required
              />
              <button className="btnPrimary" type="submit">
                Unlock
              </button>
            </form>

            {error && <p className="gateError">{error}</p>}
          </section>
        </main>
      )}

      {/* DESK */}
      {view === "desk" && (
        <main className="deskShell">
          <div className="deskTop">
            <h2 className="deskTitle">Letters to my amore</h2>

            <div className="deskControls">
              <select
                className="filterSelect"
                value={themeFilter}
                onChange={(e) => {
                  setThemeFilter(e.target.value)
                  setActiveIndex(0)
                }}
              >
                <option value="">All themes</option>
                {themes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>

              <select
                className="filterSelect"
                value={occasionFilter}
                onChange={(e) => {
                  setOccasionFilter(e.target.value)
                  setActiveIndex(0)
                }}
              >
                <option value="">All occasions</option>
                {occasions.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>

              <button className="btnGhost" onClick={lock}>
                Lock
              </button>
            </div>
          </div>

          <section className="deskMain">
            <div className="coverflowWrap">
              <button className="navBtn" onClick={() => go(-1)}>
                ‹
              </button>

              <div className="coverflowTrack">
                {visible.map(({ idx, offset }) => {
                  const l = filtered[idx]
                  const isActive = idx === safeActiveIndex
                  const c = cardColors(l.theme)

                  return (
                    <button
                      key={l.id}
                      className={`coverItem ${isActive ? "isActive" : ""}`}
                      style={{
                        ["--offset" as any]: offset,
                        ["--cardA" as any]: c.a,
                        ["--cardB" as any]: c.b,
                      }}
                      onClick={() => setActiveIndex(idx)}
                    >
                      <div className="flatCard">
                        <div className="flatCardTop">
                          {l.audio ? (
                            <span className="pill">VOICE</span>
                          ) : (
                            <span className="pill ghost">TEXT</span>
                          )}
                          <div className="flatDate">{l.date}</div>
                        </div>

                        <div className="flatTitle">{l.title}</div>
                        <div className="flatPreview">
                          {l.preview}
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>

              <button className="navBtn" onClick={() => go(1)}>
                ›
              </button>
            </div>

            <div className="deskActions">
              <button className="btnPrimary" onClick={openLetter}>
                Open
              </button>
            </div>
          </section>
        </main>
      )}

      {/* LETTER VIEW */}
      {view === "letter" && activeLetter && (
        <main className="stageCenter">
          <section className="letterPaperFlat">
            <div className="letterTop">
              <div>
                <h1 className="letterTitle">{activeLetter.title}</h1>
                <p className="letterMeta">
                  {activeLetter.date}
                  {activeLetter.theme ? ` . ${activeLetter.theme}` : ""}
                  {activeLetter.occasion ? ` . ${activeLetter.occasion}` : ""}
                </p>
              </div>

              <button
                className="btnGhost"
                onClick={() => setView("desk")}
              >
                Back
              </button>
            </div>

            {activeLetter.audio && (
              <div className="letterAudio">
                <audio controls className="audioFull">
                  <source src={activeLetter.audio} />
                </audio>
              </div>
            )}

            {activeLetter.coverImage && (
              <div style={{ marginTop: 16 }}>
                <img
                  src={activeLetter.coverImage}
                  alt=""
                  style={{
                    width: "100%",
                    borderRadius: 18,
                    boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
                  }}
                />
              </div>
            )}

            <article
              className="letterBody"
              dangerouslySetInnerHTML={{
                __html: activeLetter.content,
              }}
            />
          </section>
        </main>
      )}
    </div>
  )
}