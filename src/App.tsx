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
}

const PASSPHRASE_CANONICAL = "wowyourehot" // change this once. all variants will match.

function normalizePassphrase(input: string) {
  // lowercases, removes spaces, apostrophes, and most punctuation
  // "wow you're hot" -> "wowyourehot"
  return input
    .toLowerCase()
    .trim()
    .replace(/[\s'’"“”`´]/g, "") // spaces + apostrophes + quote variants
    .replace(/[^a-z0-9]/g, "") // remove any remaining punctuation/symbols
}

function useParticles(count: number, kind: "heart" | "star") {
  return useMemo(() => {
    const arr = Array.from({ length: count }).map((_, i) => {
      const left = Math.random() * 100
      const delay = Math.random() * 6
      const duration = 6 + Math.random() * 8
      const size = kind === "heart" ? 10 + Math.random() * 16 : 8 + Math.random() * 14
      const opacity = 0.08 + Math.random() * 0.18
      const drift = (Math.random() * 2 - 1) * 40 // px
      return { i, left, delay, duration, size, opacity, drift }
    })
    return arr
  }, [count, kind])
}

function AmbientFX() {
  const hearts = useParticles(14, "heart")
  const stars = useParticles(18, "star")

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

  const [activeId, setActiveId] = useState<string>("midnight-coffee")
  const scrollerRef = useRef<HTMLDivElement | null>(null)

  const letters: Letter[] = useMemo(
    () => [
      {
        id: "first-rain",
        date: "October 14, 2023",
        title: "The First Rain",
        preview: "I remember the way the sky looked just before it broke…",
        body: "I remember the way the sky looked just before it broke…\n\n(Replace with your full letter.)",
        theme: "Soft",
        occasion: "Random",
      },
      {
        id: "midnight-coffee",
        date: "December 02, 2023",
        title: "Midnight Coffee",
        preview: "The world was asleep, but we were just beginning…",
        body: "The world was asleep, but we were just beginning…\n\n(Replace with your full letter.)",
        theme: "Cozy",
        occasion: "Random",
      },
      {
        id: "promise-ink",
        date: "January 20, 2024",
        title: "A Promise in Ink",
        preview: "I found this scrap of paper in my pocket today…",
        body: "I found this scrap of paper in my pocket today…\n\n(Replace with your full letter.)",
        theme: "Romance",
        occasion: "Random",
      },
      {
        id: "last-train",
        date: "February 14, 2024",
        title: "The Last Train Home",
        preview: "The station was empty, just the echo of our footsteps…",
        body: "The station was empty, just the echo of our footsteps…\n\n(Replace with your full letter.)",
        theme: "Bittersweet",
        occasion: "Valentine",
      },
    ],
    []
  )

  const activeLetter = useMemo(
    () => letters.find(l => l.id === activeId) ?? letters[0],
    [letters, activeId]
  )

  function scrollToCard(letterId: string) {
    const container = scrollerRef.current
    if (!container) return
    const el = container.querySelector<HTMLElement>(`[data-letter-id="${letterId}"]`)
    if (!el) return
    const containerRect = container.getBoundingClientRect()
    const elRect = el.getBoundingClientRect()
    const delta = (elRect.left + elRect.width / 2) - (containerRect.left + containerRect.width / 2)
    container.scrollBy({ left: delta, behavior: "smooth" })
  }

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
              <button
                className="rounded-2xl px-7 py-3 font-semibold bg-red-500 hover:bg-red-400 transition"
                type="submit"
              >
                Unlock
              </button>
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
            <div className="flex items-start justify-between gap-6">
              <div>
                <h2 className="text-2xl sm:text-3xl font-semibold">Envelope Desk</h2>
                <p className="text-white/75">
                  Pick one. It will fly to the center like it owns the place.
                </p>
              </div>

              <button
                className="rounded-2xl px-4 py-2 border border-white/10 bg-white/5 hover:bg-white/10 transition"
                onClick={() => {
                  setPass("")
                  setError(null)
                  setView("gate")
                }}
              >
                Lock
              </button>
            </div>

            {/* Carousel */}
            <div className="mt-10">
              <div
                ref={scrollerRef}
                className="carousel"
              >
                {letters.map(l => {
                  const active = l.id === activeId
                  return (
                    <button
                      key={l.id}
                      data-letter-id={l.id}
                      className={`envelopeCard ${active ? "isActive" : ""}`}
                      onClick={() => {
                        setActiveId(l.id)
                        scrollToCard(l.id)
                      }}
                      type="button"
                    >
                      <div className="envelopeMeta">
                        <span className="envelopeDate">{l.date}</span>
                      </div>
                      <div className="envelopeTitle">{l.title}</div>
                      <div className="envelopePreview">{l.preview}</div>
                    </button>
                  )
                })}
              </div>

              <div className="mt-6 flex justify-center gap-3">
                <button
                  className="rounded-2xl px-4 py-2 border border-white/10 bg-white/5 hover:bg-white/10 transition"
                  onClick={() => {
                    const idx = Math.max(0, letters.findIndex(l => l.id === activeId) - 1)
                    const next = letters[idx]
                    setActiveId(next.id)
                    scrollToCard(next.id)
                  }}
                >
                  Prev
                </button>
                <button
                  className="rounded-2xl px-5 py-2 bg-red-500 hover:bg-red-400 font-semibold transition"
                  onClick={() => setView("letter")}
                >
                  Open
                </button>
                <button
                  className="rounded-2xl px-4 py-2 border border-white/10 bg-white/5 hover:bg-white/10 transition"
                  onClick={() => {
                    const idx = Math.min(letters.length - 1, letters.findIndex(l => l.id === activeId) + 1)
                    const next = letters[idx]
                    setActiveId(next.id)
                    scrollToCard(next.id)
                  }}
                >
                  Next
                </button>
              </div>

              <p className="mt-6 text-center text-sm text-white/60">
                Scroll sideways. Click an envelope to focus it. Then open.
              </p>
            </div>
          </div>
        </main>
      )}

      {view === "letter" && (
        <main className="min-h-screen flex items-center justify-center px-5 py-10">
          <section className="w-full max-w-3xl rounded-[32px] border border-white/10 bg-black/25 p-7 sm:p-10">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-semibold">To my dearest amore,</h1>
                <p className="text-white/60 text-sm mt-1">{activeLetter.date} . {activeLetter.title}</p>
              </div>
            </div>

            <article className="mt-6 whitespace-pre-wrap leading-relaxed text-white/90">
              {activeLetter.body}
            </article>

            <div className="mt-8 flex gap-3">
              <button
                className="rounded-2xl px-4 py-2 border border-white/10 bg-white/5 hover:bg-white/10 transition"
                onClick={() => setView("desk")}
              >
                Back
              </button>
              <button
                className="rounded-2xl px-4 py-2 bg-red-500 hover:bg-red-400 font-semibold transition"
                onClick={() => {
                  // hook typing replay here later if you want
                }}
              >
                Replay
              </button>
            </div>
          </section>
        </main>
      )}
    </div>
  )
}