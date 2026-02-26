import React, { useMemo, useState } from "react"

type View = "gate" | "desk" | "letter"

type Letter = {
  id: string
  date: string
  title: string
  preview: string
  body: string
  theme?: string
  occasion?: string

  // Visuals
  envelopeImage?: string // e.g. "/assets/envelopes/midnight-coffee.png"
  letterPaperImage?: string // e.g. "/assets/papers/paper-01.png"

  // Optional content
  images?: { src: string; alt?: string }[]
  voicemailUrl?: string
}

// Change this once and forget it.
const PASSPHRASE_CANONICAL = "wowyourehot"

function normalizePassphrase(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[\s'’"“”`´]/g, "")
    .replace(/[^a-z0-9]/g, "")
}

type Particle = {
  i: number
  left: number
  delay: number
  duration: number
  size: number
  opacity: number
  drift: number
}

function makeParticles(kind: "heart" | "star") {
  const count = kind === "heart" ? 28 : 20
  const sizes =
    kind === "heart"
      ? [10, 12, 14, 16, 18, 22, 28, 34, 42, 56] // small + medium + big
      : [6, 8, 10, 12, 14, 18]

  const arr: Particle[] = Array.from({ length: count }).map((_, i) => {
    const left = Math.random() * 100
    const delay = Math.random() * 6
    const duration = (kind === "heart" ? 7 : 6) + Math.random() * 10
    const size = sizes[Math.floor(Math.random() * sizes.length)]
    const opacity = (kind === "heart" ? 0.06 : 0.10) + Math.random() * 0.20
    const drift = (Math.random() * 2 - 1) * 65
    return { i, left, delay, duration, size, opacity, drift }
  })

  return arr
}

function AmbientFX() {
  const hearts = useMemo(() => makeParticles("heart"), [])
  const stars = useMemo(() => makeParticles("star"), [])

  return (
    <div className="fxLayer" aria-hidden="true">
      {hearts.map((p) => (
        <span
          key={`h-${p.i}`}
          className="fxHeart"
          style={{
            left: `${p.left}%`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            fontSize: `${p.size}px`,
            opacity: p.opacity,
            ["--drift" as any]: `${p.drift}px`,
          }}
        >
          ♥
        </span>
      ))}

      {stars.map((p) => (
        <span
          key={`s-${p.i}`}
          className="fxStar"
          style={{
            left: `${p.left}%`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            opacity: p.opacity,
            ["--drift" as any]: `${p.drift}px`,
          }}
        />
      ))}
    </div>
  )
}

export default function App() {
  const [view, setView] = useState<View>("gate")
  const [pass, setPass] = useState("")
  const [error, setError] = useState<string | null>(null)

  // Replace these with your real letters.
  // Put assets in /public/assets/... so the URLs work on GitHub Pages.
  const letters: Letter[] = useMemo(
    () => [
      {
        id: "first-rain",
        date: "October 14, 2023",
        title: "The First Rain",
        preview: "I remember the way the sky looked just before it broke…",
        body: "I remember the way the sky looked just before it broke…\n\nAnd somehow, you still felt like shelter.",
        theme: "Soft",
        occasion: "Random",
        envelopeImage: "/assets/envelopes/envelope-01.png",
        letterPaperImage: "/assets/papers/paper-01.png",
        images: [{ src: "/assets/sample1.jpg", alt: "Memory" }],
      },
      {
        id: "midnight-coffee",
        date: "December 02, 2023",
        title: "Midnight Coffee",
        preview: "The world was asleep, but we were just beginning…",
        body: "The world was asleep, but we were just beginning…\n\nIf I could bottle that night, I’d keep it beside my heartbeat.",
        theme: "Cozy",
        occasion: "Random",
        envelopeImage: "/assets/envelopes/envelope-02.png",
        letterPaperImage: "/assets/papers/paper-01.png",
        voicemailUrl: "/assets/voice-midnight.mp3",
      },
      {
        id: "promise-ink",
        date: "January 20, 2024",
        title: "A Promise in Ink",
        preview: "I found this scrap of paper in my pocket today…",
        body: "I found this scrap of paper in my pocket today…\n\nIt said: don’t forget how he makes you smile.",
        theme: "Romance",
        occasion: "Random",
        envelopeImage: "/assets/envelopes/envelope-03.png",
        letterPaperImage: "/assets/papers/paper-02.png",
      },
      {
        id: "last-train",
        date: "February 14, 2024",
        title: "The Last Train Home",
        preview: "The station was empty, just the echo of our footsteps…",
        body: "The station was empty, just the echo of our footsteps…\n\nStill, I’d wait. Still, I’d choose you.",
        theme: "Bittersweet",
        occasion: "Valentine",
        envelopeImage: "/assets/envelopes/envelope-04.png",
        letterPaperImage: "/assets/papers/paper-02.png",
      },
    ],
    []
  )

  const themes = useMemo(() => {
    const set = new Set<string>()
    letters.forEach((l) => l.theme && set.add(l.theme))
    return Array.from(set).sort()
  }, [letters])

  const occasions = useMemo(() => {
    const set = new Set<string>()
    letters.forEach((l) => l.occasion && set.add(l.occasion))
    return Array.from(set).sort()
  }, [letters])

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

  const safeActiveIndex = useMemo(() => {
    return Math.min(activeIndex, Math.max(0, filtered.length - 1))
  }, [activeIndex, filtered.length])

  const activeLetter = useMemo(() => {
    const l = filtered[safeActiveIndex] ?? filtered[0]
    return l
  }, [filtered, safeActiveIndex])

  function onUnlock(e: React.FormEvent) {
    e.preventDefault()
    const ok = normalizePassphrase(pass) === normalizePassphrase(PASSPHRASE_CANONICAL)
    if (!ok) {
      setError("Wrong passphrase. The curtains remain unimpressed.")
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
    setView("gate")
  }

  function clearFilters() {
    setThemeFilter("")
    setOccasionFilter("")
    setActiveIndex(0)
  }

  return (
    <div className="appRoot">
      <AmbientFX />

      {view === "gate" && (
        <main className="stageCenter">
          <section className="gateCardFx gateCard">
            <div className="gateTop">
              <div className="sigil" aria-hidden="true">
                ✦
              </div>
              <h1 className="gateTitle">Restricted Romance Archive</h1>
              <p className="gateSub">Enter the passphrase. The curtains will judge you.</p>
            </div>

            <div className="gateHint">
              <p className="hintTitle">Hint</p>
              <p className="hintText">Please put the first thing I said when I first met you.</p>
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

            {error && (
              <>
                <p className="gateError" role="alert" aria-live="polite">
                  {error}
                </p>
                <div className="cryWrap">
                  <img
                    className="cryGif"
                    src="https://media.giphy.com/media/OPU6wzx8JrHna/giphy.gif"
                    alt=""
                    loading="lazy"
                  />
                </div>
              </>
            )}

            <p className="gateFooter">If you’re not amore, this page will pretend it doesn’t know you.</p>
          </section>
        </main>
      )}

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

              <button className="btnGhost" onClick={clearFilters} type="button">
                Clear
              </button>

              <button className="btnGhost" onClick={lock} type="button">
                Lock
              </button>
            </div>
          </div>

          <section className="deskMain">
            <div className="coverflowWrap">
              <button className="navBtn" onClick={() => go(-1)} aria-label="Previous" type="button">
                ‹
              </button>

              <div className="coverflowTrack">
                {filtered.length === 0 ? (
                  <div className="emptyState">No letters match those filters.</div>
                ) : (
                  filtered.map((l, idx) => {
                    const offset = idx - safeActiveIndex
                    const isActive = idx === safeActiveIndex
                    return (
                      <button
                        key={l.id}
                        className={`coverItem ${isActive ? "isActive" : ""}`}
                        style={{ ["--offset" as any]: offset }}
                        onClick={() => setActiveIndex(idx)}
                        type="button"
                      >
                        <div
                          className="envelopeCardFx"
                          style={{
                            backgroundImage: `url(${l.envelopeImage ?? "/assets/envelopes/envelope-01.png"})`,
                          }}
                        >
                          <div className="envelopeShade" />
                          <div className="envelopeText">
                            <div className="envelopeDate">{l.date}</div>
                            <div className="envelopeTitle">{l.title}</div>
                            <div className="envelopePreview">{l.preview}</div>
                          </div>
                        </div>
                      </button>
                    )
                  })
                )}
              </div>

              <button className="navBtn" onClick={() => go(1)} aria-label="Next" type="button">
                ›
              </button>
            </div>

            <div className="deskActions">
              <button className="btnGhost" onClick={() => go(-1)} type="button">
                Prev
              </button>
              <button className="btnPrimary" onClick={openLetter} type="button" disabled={!activeLetter}>
                Open
              </button>
              <button className="btnGhost" onClick={() => go(1)} type="button">
                Next
              </button>
            </div>
          </section>
        </main>
      )}

      {view === "letter" && (
        <main className="stageCenter">
          <section
            className="letterPaper"
            style={{
              backgroundImage: `url(${activeLetter?.letterPaperImage ?? "/assets/papers/paper-01.png"})`,
            }}
          >
            <div className="letterTop">
              <div>
                <h1 className="letterTitle">{activeLetter?.title ?? "Letter"}</h1>
                <p className="letterMeta">
                  {activeLetter?.date}
                  {activeLetter?.theme ? ` . ${activeLetter.theme}` : ""}
                  {activeLetter?.occasion ? ` . ${activeLetter.occasion}` : ""}
                </p>
              </div>
            </div>

            {activeLetter?.images?.length ? (
              <div className="letterMediaGrid">
                {activeLetter.images.map((img, i) => (
                  <img
                    key={`${activeLetter.id}-img-${i}`}
                    className="letterImg"
                    src={img.src}
                    alt={img.alt ?? ""}
                    loading="lazy"
                  />
                ))}
              </div>
            ) : null}

            {activeLetter?.voicemailUrl ? (
              <div className="letterAudio">
                <div className="letterSectionLabel">Voicemail</div>
                <audio controls preload="metadata" className="audioFull">
                  <source src={activeLetter.voicemailUrl} />
                </audio>
              </div>
            ) : null}

            <article className="letterBody">{activeLetter?.body}</article>

            <div className="letterActions">
              <button className="btnGhost" onClick={() => setView("desk")} type="button">
                Back
              </button>
            </div>
          </section>
        </main>
      )}
    </div>
  )
}