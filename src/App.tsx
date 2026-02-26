import React, { useMemo, useRef, useState } from "react"

type View = "gate" | "desk" | "letter"

type Letter = {
  id: string
  date: string
  title: string
  preview: string
  body: string
  theme?: string
  occasion?: string
  images?: { src: string; alt?: string }[]
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

function useParticles(kind: "heart" | "star") {
  return useMemo(() => {
    const count = kind === "heart" ? 20 : 18
    const sizes =
      kind === "heart"
        ? [10, 12, 14, 16, 18, 22, 28, 34] // mixed sizes
        : [8, 10, 12, 14, 18]

    return Array.from({ length: count }).map((_, i) => {
      const left = Math.random() * 100
      const delay = Math.random() * 6
      const duration = (kind === "heart" ? 7 : 6) + Math.random() * 10
      const size = sizes[Math.floor(Math.random() * sizes.length)]
      const opacity = (kind === "heart" ? 0.08 : 0.10) + Math.random() * 0.18
      const drift = (Math.random() * 2 - 1) * 55
      return { i, left, delay, duration, size, opacity, drift }
    })
  }, [kind])
}

function AmbientFX() {
  const hearts = useParticles("heart")
  const stars = useParticles("star")

  return (
    <div className="fxLayer" aria-hidden="true">
      {hearts.map(p => (
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
      {stars.map(p => (
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

  const letters: Letter[] = useMemo(
    () => [
      {
        id: "first-rain",
        date: "October 14, 2023",
        title: "The First Rain",
        preview: "I remember the way the sky looked just before it broke…",
        body: "I remember the way the sky looked just before it broke…",
        theme: "Soft",
        occasion: "Random",
        images: [{ src: "/assets/sample1.jpg", alt: "Memory" }],
      },
      {
        id: "midnight-coffee",
        date: "December 02, 2023",
        title: "Midnight Coffee",
        preview: "The world was asleep, but we were just beginning…",
        body: "The world was asleep, but we were just beginning…",
        theme: "Cozy",
        occasion: "Random",
        voicemailUrl: "/assets/voice-midnight.mp3",
      },
      {
        id: "promise-ink",
        date: "January 20, 2024",
        title: "A Promise in Ink",
        preview: "I found this scrap of paper in my pocket today…",
        body: "I found this scrap of paper in my pocket today…",
        theme: "Romance",
        occasion: "Random",
      },
      {
        id: "last-train",
        date: "February 14, 2024",
        title: "The Last Train Home",
        preview: "The station was empty, just the echo of our footsteps…",
        body: "The station was empty, just the echo of our footsteps…",
        theme: "Bittersweet",
        occasion: "Valentine",
      },
    ],
    []
  )

  const themes = useMemo(() => {
    const set = new Set<string>()
    letters.forEach(l => l.theme && set.add(l.theme))
    return Array.from(set).sort()
  }, [letters])

  const occasions = useMemo(() => {
    const set = new Set<string>()
    letters.forEach(l => l.occasion && set.add(l.occasion))
    return Array.from(set).sort()
  }, [letters])

  const [themeFilter, setThemeFilter] = useState<string>("")
  const [occasionFilter, setOccasionFilter] = useState<string>("")

  const filtered = useMemo(() => {
    return letters.filter(l => {
      if (themeFilter && l.theme !== themeFilter) return false
      if (occasionFilter && l.occasion !== occasionFilter) return false
      return true
    })
  }, [letters, themeFilter, occasionFilter])

  const [activeIndex, setActiveIndex] = useState(0)

  // keep activeIndex valid when filters change
  const activeLetter = useMemo(() => {
    const safeIndex = Math.min(activeIndex, Math.max(0, filtered.length - 1))
    return filtered[safeIndex] ?? filtered[0]
  }, [filtered, activeIndex])

  const safeActiveIndex = useMemo(() => {
    return Math.min(activeIndex, Math.max(0, filtered.length - 1))
  }, [activeIndex, filtered.length])

  const trackRef = useRef<HTMLDivElement | null>(null)

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

  return (
    <div className="min-h-screen relative text-white">
      <AmbientFX />

      {view === "gate" && (
        <main className="min-h-screen flex items-center justify-center px-5 py-10">
          <section className="gateCardFx w-full max-w-2xl rounded-[32px] border border-white/10 bg-black/25 shadow-2xl p-7 sm:p-10">
            <div className="flex flex-col items-center text-center gap-3">
              <div className="h-12 w-12 rounded-2xl border border-white/10 bg-white/5 flex items-center justify-center">
                ✦
              </div>
              <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
                Restricted Romance Archive
              </h1>
              <p className="text-white/80">
                Enter the passphrase. The curtains will judge you.
              </p>
            </div>

            <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="font-semibold mb-1">Hint</p>
              <p className="text-white/75">
                Please put the first thing I said when I first met you.
              </p>
            </div>

            <form onSubmit={onUnlock} className="mt-6 flex flex-col sm:flex-row gap-3">
              <input
                className="flex-1 rounded-2xl bg-white/5 border border-white/10 px-4 py-3 outline-none text-white placeholder:text-white/40"
                type="password"
                placeholder="Passphrase"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                required
              />
              <button className="btnPrimary" type="submit">Unlock</button>
            </form>

            {error && (
              <>
                <p className="mt-3 text-sm text-red-200">{error}</p>
                <div className="mt-6 flex justify-center">
                  <img
                    className="w-72 max-w-full rounded-2xl shadow-lg"
                    src="https://media.giphy.com/media/OPU6wzx8JrHna/giphy.gif"
                    alt=""
                    loading="lazy"
                  />
                </div>
              </>
            )}

            <p className="mt-7 text-center text-sm text-white/60">
              If you’re not amore, this page will pretend it doesn’t know you.
            </p>
          </section>
        </main>
      )}

      {view === "desk" && (
        <main className="min-h-screen px-5 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-start justify-between gap-6 flex-wrap">
              <div>
                <h2 className="text-3xl sm:text-4xl font-semibold">Letters to my amore</h2>
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                <select
                  className="filterSelect"
                  value={themeFilter}
                  onChange={(e) => {
                    setThemeFilter(e.target.value)
                    setActiveIndex(0)
                  }}
                >
                  <option value="">All themes</option>
                  {themes.map(t => <option key={t} value={t}>{t}</option>)}
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
                  {occasions.map(o => <option key={o} value={o}>{o}</option>)}
                </select>

                <button
                  className="btnGhost"
                  onClick={() => {
                    setThemeFilter("")
                    setOccasionFilter("")
                    setActiveIndex(0)
                  }}
                  type="button"
                >
                  Clear
                </button>

                <button
                  className="btnGhost"
                  onClick={() => {
                    setPass("")
                    setError(null)
                    setView("gate")
                  }}
                  type="button"
                >
                  Lock
                </button>
              </div>
            </div>

            {/* Coverflow carousel */}
            <div className="coverflowWrap mt-10">
              <button className="navBtn left" onClick={() => go(-1)} aria-label="Previous">
                ‹
              </button>

              <div className="coverflowTrack" ref={trackRef}>
                {filtered.length === 0 ? (
                  <div className="emptyState">
                    No letters match those filters.
                  </div>
                ) : (
                  filtered.map((l, idx) => {
                    const offset = idx - safeActiveIndex
                    return (
                      <button
                        key={l.id}
                        className="coverItem"
                        style={{ ["--offset" as any]: offset }}
                        data-active={idx === safeActiveIndex ? "true" : "false"}
                        onClick={() => setActiveIndex(idx)}
                        type="button"
                      >
                        <div className="coverCard">
                          <div className="coverDate">{l.date}</div>
                          <div className="coverTitle">{l.title}</div>
                          <div className="coverPreview">{l.preview}</div>
                        </div>
                      </button>
                    )
                  })
                )}
              </div>

              <button className="navBtn right" onClick={() => go(1)} aria-label="Next">
                ›
              </button>
            </div>

            <div className="mt-7 flex justify-center gap-3">
              <button className="btnGhost" onClick={() => go(-1)} type="button">Prev</button>
              <button className="btnPrimary" onClick={openLetter} type="button">Open</button>
              <button className="btnGhost" onClick={() => go(1)} type="button">Next</button>
            </div>
          </div>
        </main>
      )}

      {view === "letter" && (
        <main className="min-h-screen flex items-center justify-center px-5 py-10">
          <section className="w-full max-w-3xl rounded-[32px] border border-white/10 bg-black/25 p-7 sm:p-10">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-semibold">
                  {activeLetter?.title ?? "Letter"}
                </h1>
                <p className="text-white/60 text-sm mt-1">
                  {activeLetter?.date}
                  {activeLetter?.theme ? ` . ${activeLetter.theme}` : ""}
                  {activeLetter?.occasion ? ` . ${activeLetter.occasion}` : ""}
                </p>
              </div>
            </div>

            {/* Optional images */}
            {activeLetter?.images?.length ? (
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {activeLetter.images.map((img, i) => (
                  <img
                    key={`${activeLetter.id}-img-${i}`}
                    className="rounded-2xl border border-white/10 w-full object-cover"
                    src={img.src}
                    alt={img.alt ?? ""}
                    loading="lazy"
                  />
                ))}
              </div>
            ) : null}

            {/* Optional voicemail */}
            {activeLetter?.voicemailUrl ? (
              <div className="mt-6">
                <p className="text-sm text-white/70 mb-2">Voicemail</p>
                <audio controls preload="metadata" className="w-full">
                  <source src={activeLetter.voicemailUrl} />
                </audio>
              </div>
            ) : null}

            <article className="mt-6 whitespace-pre-wrap leading-relaxed text-white/90">
              {activeLetter?.body}
            </article>

            <div className="mt-8 flex gap-3">
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