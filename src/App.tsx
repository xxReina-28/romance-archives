import React, { useMemo, useState } from "react"

type View = "gate" | "desk" | "letter"

type MediaImage = { src: string; alt?: string }

type Letter = {
  id: string
  date: string
  title: string
  preview: string
  body: string
  theme?: string
  occasion?: string

  // Optional visuals
  envelopeImage?: string // e.g. "/assets/envelopes/envelope-01.png"
  letterPaperImage?: string // e.g. "/assets/papers/paper-01.png"

  // Optional content blocks
  images?: MediaImage[]
  voicemailUrl?: string
}

const PASSPHRASE_CANONICAL = "wowyourehot" // change once

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
  blur: number
}

function makeParticles(kind: "heart" | "star") {
  const count = kind === "heart" ? 30 : 22

  // mixed sizes: small + medium + big
  const heartSizes = [10, 12, 14, 16, 18, 22, 28, 34, 42, 56]
  const starSizes = [6, 8, 10, 12, 14, 18]

  const sizes = kind === "heart" ? heartSizes : starSizes

  return Array.from({ length: count }).map((_, i) => {
    const left = Math.random() * 100
    const delay = Math.random() * 6
    const duration = (kind === "heart" ? 7 : 6) + Math.random() * 10
    const size = sizes[Math.floor(Math.random() * sizes.length)]
    const opacity = (kind === "heart" ? 0.06 : 0.10) + Math.random() * 0.22
    const drift = (Math.random() * 2 - 1) * 70
    const blur = (kind === "heart" ? 0.2 : 0.8) + Math.random() * 1.2
    return { i, left, delay, duration, size, opacity, drift, blur }
  })
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
            filter: `blur(${p.blur}px)`,
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
            filter: `blur(${p.blur}px)`,
            ["--drift" as any]: `${p.drift}px`,
          }}
        />
      ))}
    </div>
  )
}

function uniqSorted(values: Array<string | undefined>) {
  const set = new Set(values.filter(Boolean) as string[])
  return Array.from(set).sort((a, b) => a.localeCompare(b))
}

function pickDefaultEnvelope(theme?: string) {
  // Not too feminine: darker, clean, elegant
  // Put files in: public/assets/envelopes/
  switch ((theme || "").toLowerCase()) {
    case "comfort":
      return "/assets/envelopes/envelope-01.png"
    case "missing-you":
      return "/assets/envelopes/envelope-02.png"
    case "romance":
      return "/assets/envelopes/envelope-03.png"
    default:
      return "/assets/envelopes/envelope-01.png"
  }
}

function pickDefaultPaper(theme?: string) {
  // Put files in: public/assets/papers/
  switch ((theme || "").toLowerCase()) {
    case "comfort":
      return "/assets/papers/paper-01.png"
    case "missing-you":
      return "/assets/papers/paper-02.png"
    case "romance":
      return "/assets/papers/paper-02.png"
    default:
      return "/assets/papers/paper-01.png"
  }
}

export default function App() {
  const [view, setView] = useState<View>("gate")
  const [pass, setPass] = useState("")
  const [error, setError] = useState<string | null>(null)

  // Your letters imported from the files you uploaded (plus "My amore.txt").
  // IMPORTANT: move these asset paths into /public so GitHub Pages serves them:
  // - /public/media/images/missyou.gif
  // - /public/media/audio/voicenote-01.ogg
  const letters: Letter[] = useMemo(
    () => [
      {
        id: "2026-02-late-night",
        title: "Late Night",
        theme: "comfort",
        occasion: "work",
        preview: "If you’re tired, read this slowly.",
        date: "2026-02-24",
        body:
          "My Amore,\n\n" +
          "I wrote this for the version of you that keeps working even when you’re tired.\n\n" +
          "You don’t need to be dramatic. Just breathe. I’m proud of you.",
        images: [{ src: "/media/images/missyou.gif", alt: "A tiny proof I miss you." }],
        // Optional overrides:
        envelopeImage: "/assets/envelopes/envelope-01.png",
        letterPaperImage: "/assets/papers/paper-01.png",
      },
      {
        id: "2026-03-voicenote",
        title: "Play Me",
        theme: "missing-you",
        occasion: "distance",
        preview: "No reading. Just listen.",
        date: "2026-03-01",
        body: "My Amore,\n\nJust feel like saying this again. Press play.",
        voicemailUrl: "/media/audio/voicenote-01.ogg",
        envelopeImage: "/assets/envelopes/envelope-02.png",
        letterPaperImage: "/assets/papers/paper-02.png",
      },
      {
        id: "my-amore",
        title: "My Amore",
        theme: "romance",
        occasion: "random",
        preview: "Unfortunately. I am writing to you instead.",
        date: "Undated",
        body:
          "My Amore,\n\n" +
          "I was going to write you something cool and composed. Something mysterious. Something that would quietly make you fall in love with me all over again.\n\n" +
          "Unfortunately. I am writing to you instead.\n\n" +
          "You know what’s funny. No matter how independent I am, no matter how strong or self-sufficient I try to be, when it comes to you my brain just calmly says, “Ah yes. We surrender.”\n\n" +
          "If kingdoms were built on smiles, you would already own mine. No battlefield needed.\n\n" +
          "I don’t say this lightly. But you’ve become the part of my day I look forward to. The place my mind goes when the world gets too loud.\n\n" +
          "And the most annoying part. You didn’t even try that hard.\n\n" +
          "You just exist. You talk. You work. You do your thing. And somehow. I end up softer.\n\n" +
          "So tonight, just know that somewhere in this world there is a woman smiling at her phone because of you.\n\n" +
          "Whether I call you amore, master, or my emperor, it all means the same thing.\n\n" +
          "You matter to me.\n\n" +
          "Now go back to being powerful and hardworking. I’ll be here. Slightly obsessed. Pretending I’m not.\n\n" +
          "I can’t wait to be back by your side again.\n\n" +
          "Yours,\n" +
          "Your very loyal subject",
        envelopeImage: "/assets/envelopes/envelope-03.png",
        letterPaperImage: "/assets/papers/paper-02.png",
      },
    ],
    []
  )

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

  const safeActiveIndex = useMemo(() => {
    return Math.min(activeIndex, Math.max(0, filtered.length - 1))
  }, [activeIndex, filtered.length])

  const activeLetter = useMemo(() => filtered[safeActiveIndex] ?? filtered[0], [filtered, safeActiveIndex])

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
    setThemeFilter("")
    setOccasionFilter("")
    setActiveIndex(0)
    setView("gate")
  }

  function clearFilters() {
    setThemeFilter("")
    setOccasionFilter("")
    setActiveIndex(0)
  }

  const envelopeBg = activeLetter?.envelopeImage || pickDefaultEnvelope(activeLetter?.theme)
  const paperBg = activeLetter?.letterPaperImage || pickDefaultPaper(activeLetter?.theme)

  return (
    <div className="appRoot">
      <AmbientFX />

      {view === "gate" && (
        <main className="stageCenter">
          <section className="gateCard">
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

                    const bg = l.envelopeImage || pickDefaultEnvelope(l.theme)

                    return (
                      <button
                        key={l.id}
                        className={`coverItem ${isActive ? "isActive" : ""}`}
                        style={{ ["--offset" as any]: offset }}
                        onClick={() => setActiveIndex(idx)}
                        type="button"
                      >
                        <div className="envelopeCardFx" style={{ backgroundImage: `url(${bg})` }}>
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
          <section className="letterPaper" style={{ backgroundImage: `url(${paperBg})` }}>
            <div className="letterTop">
              <div>
                <h1 className="letterTitle">{activeLetter?.title ?? "Letter"}</h1>
                <p className="letterMeta">
                  {activeLetter?.date}
                  {activeLetter?.theme ? ` . ${activeLetter.theme}` : ""}
                  {activeLetter?.occasion ? ` . ${activeLetter.occasion}` : ""}
                </p>
              </div>

              <button className="btnGhost" onClick={() => setView("desk")} type="button">
                Back
              </button>
            </div>

            {activeLetter?.voicemailUrl ? (
              <div className="letterAudio">
                <div className="letterSectionLabel">Voicemail</div>
                <audio controls preload="metadata" className="audioFull">
                  <source src={activeLetter.voicemailUrl} />
                </audio>
              </div>
            ) : null}

            {activeLetter?.images?.length ? (
              <div className="letterMediaGrid">
                {activeLetter.images.map((img, i) => (
                  <img key={`${activeLetter.id}-img-${i}`} className="letterImg" src={img.src} alt={img.alt ?? ""} />
                ))}
              </div>
            ) : null}

            <article className="letterBody">{activeLetter?.body}</article>
          </section>
        </main>
      )}

      {/* Preload current envelope/paper a bit */}
      <div style={{ display: "none" }}>
        <img src={envelopeBg} alt="" />
        <img src={paperBg} alt="" />
      </div>
    </div>
  )
}