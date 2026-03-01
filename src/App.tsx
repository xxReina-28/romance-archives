import React, { useEffect, useMemo, useRef, useState } from "react"
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

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n))
}

function mod(n: number, m: number) {
  return ((n % m) + m) % m
}

/** Flat-card color system */
function cardColors(theme?: string) {
  const t = (theme || "").toLowerCase()
  if (t.includes("comfort")) return { a: "#E7DFCF", b: "#D9CEB8" }
  if (t.includes("missing")) return { a: "#DCE8E3", b: "#CBDAD3" }
  if (t.includes("romance")) return { a: "#E9D2D7", b: "#E0C0C7" }
  if (t.includes("work")) return { a: "#DCE2EF", b: "#CCD5E6" }
  return { a: "#E3DAEC", b: "#D3C7E2" }
}

/* Falling hearts */
type HeartParticle = {
  i: number
  left: number
  delay: number
  duration: number
  size: number
  opacity: number
  drift: number
  blur: number
  color: string
  rotate: number
}

function makeHearts(count = 50): HeartParticle[] {
  const colors = ["#F8FFCC", "#A64646", "#993939"]
  const sizes = [10, 12, 14, 16, 18, 22, 26, 32, 40, 52]

  return Array.from({ length: count }).map((_, i) => {
    const left = Math.random() * 100
    const delay = Math.random() * 6
    const duration = 7 + Math.random() * 11
    const size = sizes[Math.floor(Math.random() * sizes.length)]
    const opacity = 0.10 + Math.random() * 0.35
    const drift = (Math.random() * 2 - 1) * 90
    const blur = Math.random() * 1.1
    const color = colors[Math.floor(Math.random() * colors.length)]
    const rotate = (Math.random() * 2 - 1) * 22

    return { i, left, delay, duration, size, opacity, drift, blur, color, rotate }
  })
}

/** Fullscreen hearts behind everything */
function FallingHearts({ density = 60, z = 0 }: { density?: number; z?: number }) {
  const hearts = useMemo(() => makeHearts(density), [density])

  return (
    <div className="heartsLayer" style={{ zIndex: z }} aria-hidden="true">
      {hearts.map((h) => (
        <span
          key={h.i}
          className="fallHeart"
          style={{
            left: `${h.left}%`,
            animationDelay: `${h.delay}s`,
            animationDuration: `${h.duration}s`,
            fontSize: `${h.size}px`,
            opacity: h.opacity,
            color: h.color,
            filter: `blur(${h.blur}px)`,
            ["--drift" as any]: `${h.drift}px`,
            ["--rot" as any]: `${h.rotate}deg`,
          }}
        >
          ♥
        </span>
      ))}
    </div>
  )
}

/** Hearts confined inside the letter paper */
function FallingHeartsLocal({ density = 50 }: { density?: number }) {
  const hearts = useMemo(() => makeHearts(density), [density])

  return (
    <div className="heartsLayerLocal" aria-hidden="true">
      {hearts.map((h) => (
        <span
          key={h.i}
          className="fallHeartLocal"
          style={{
            left: `${h.left}%`,
            animationDelay: `${h.delay}s`,
            animationDuration: `${h.duration}s`,
            fontSize: `${Math.max(10, Math.floor(h.size * 0.8))}px`,
            opacity: Math.min(0.28, h.opacity),
            color: h.color,
            filter: `blur(${Math.min(0.8, h.blur)}px)`,
            ["--drift" as any]: `${h.drift * 0.6}px`,
            ["--rot" as any]: `${h.rotate}deg`,
          }}
        >
          ♥
        </span>
      ))}
    </div>
  )
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

  const baseCount = filtered.length
  const DUP = 3
  const virtualCount = baseCount * DUP

  // Real selected letter index (0..baseCount-1)
  const [activeIndex, setActiveIndex] = useState(0)
  const safeActiveIndex = Math.min(activeIndex, Math.max(0, baseCount - 1))
  const activeLetter: Letter | undefined = filtered[safeActiveIndex]

  // Virtual carousel index (0..virtualCount-1)
  const [virtualIndex, setVirtualIndex] = useState(0)

  // Scroll carousel refs
  const trackRef = useRef<HTMLDivElement | null>(null)
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([])

  // Scroll-based pop/dim
  const rafRef = useRef<number | null>(null)
  const scrollEndTimer = useRef<number | null>(null)

  const virtualList = useMemo(() => {
    if (baseCount === 0) return []
    return Array.from({ length: virtualCount }).map((_, i) => {
      const realIdx = i % baseCount
      return { i, realIdx, letter: filtered[realIdx] }
    })
  }, [baseCount, virtualCount, filtered])

  function updateTransforms() {
    const track = trackRef.current
    if (!track) return

    const trackRect = track.getBoundingClientRect()
    const centerX = trackRect.left + trackRect.width / 2

    const items = itemRefs.current
    for (const el of items) {
      if (!el) continue

      const r = el.getBoundingClientRect()
      const itemCenter = r.left + r.width / 2
      const dx = Math.abs(itemCenter - centerX)

      const t = clamp(dx / (trackRect.width * 0.48), 0, 1)

      const scale = 1.06 - t * 0.18
      const opacity = 1 - t * 0.55
      const blur = t * 0.9
      const lift = (1 - t) * 6

      const tiltDir = itemCenter < centerX ? -1 : 1
      const tilt = tiltDir * (t * 2.0)

      el.style.setProperty("--popScale", String(scale))
      el.style.setProperty("--popOpacity", String(opacity))
      el.style.setProperty("--popBlur", `${blur}px`)
      el.style.setProperty("--popLift", `${lift}px`)
      el.style.setProperty("--popTilt", `${tilt}deg`)
    }
  }

  function normalizeToMiddleCopy(nextVirtual: number) {
    if (baseCount === 0) return nextVirtual

    const leftEdge = baseCount
    const rightEdge = baseCount * 2

    if (nextVirtual < leftEdge || nextVirtual >= rightEdge) {
      // Teleport to same real index in middle copy
      return mod(nextVirtual, baseCount) + baseCount
    }
    return nextVirtual
  }

  function jumpToVirtual(idx: number) {
    const el = itemRefs.current[idx]
    if (el) el.scrollIntoView({ behavior: "auto", inline: "center", block: "nearest" })
    setTimeout(() => updateTransforms(), 0)
  }

  function scrollToVirtual(idx: number) {
    const el = itemRefs.current[idx]
    if (el) el.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" })
    setTimeout(() => updateTransforms(), 120)
  }

  function onTrackScroll() {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(updateTransforms)

    // After scroll settles, teleport if we're leaving the middle copy
    if (scrollEndTimer.current) window.clearTimeout(scrollEndTimer.current)
    scrollEndTimer.current = window.setTimeout(() => {
      const normalized = normalizeToMiddleCopy(virtualIndex)
      if (normalized !== virtualIndex) {
        setVirtualIndex(normalized)
        jumpToVirtual(normalized)
      }
    }, 160)
  }

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    updateTransforms()

    const onResize = () => updateTransforms()
    window.addEventListener("resize", onResize)
    track.addEventListener("scroll", onTrackScroll, { passive: true })

    return () => {
      window.removeEventListener("resize", onResize)
      track.removeEventListener("scroll", onTrackScroll as any)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      if (scrollEndTimer.current) window.clearTimeout(scrollEndTimer.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view, virtualCount])

  // When we enter desk or filters change, start in the middle copy
  useEffect(() => {
    if (view !== "desk") return
    if (baseCount === 0) return

    const start = baseCount // first item in middle copy
    setActiveIndex(0)
    setVirtualIndex(start)

    setTimeout(() => {
      jumpToVirtual(start)
    }, 0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view, baseCount, themeFilter, occasionFilter])

  // When virtualIndex changes (via Prev/Next), smooth scroll
  useEffect(() => {
    if (view !== "desk") return
    if (baseCount === 0) return
    if (virtualIndex < 0 || virtualIndex >= virtualCount) return

    scrollToVirtual(virtualIndex)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [virtualIndex])

  function onUnlock(e: React.FormEvent) {
    e.preventDefault()
    const ok = normalizePassphrase(pass) === normalizePassphrase(PASSPHRASE_CANONICAL)
    if (!ok) {
      setError("Wrong passphrase.")
      return
    }
    setError(null)
    setView("desk")
  }

  function go(delta: number) {
    if (baseCount === 0) return

    setActiveIndex((a) => mod(a + delta, baseCount))

    setVirtualIndex((v) => {
      let next = v + delta
      // keep within [0..virtualCount-1] so refs exist
      next = mod(next, Math.max(1, virtualCount))
      return next
    })
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
    setVirtualIndex(0)
    setView("gate")
  }

  function clearFilters() {
    setThemeFilter("")
    setOccasionFilter("")
  }

  return (
    <div className="appRoot">
      {/* GATE */}
      {view === "gate" && (
        <main className="stageCenter">
          <FallingHearts density={36} z={0} />

          <section className="gateCard">
            <div className="gateTop">
              <h1 className="gateTitle">Restricted Romance Archive</h1>
              <p className="gateSub">Enter the passphrase.</p>
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

            {error && <p className="gateError">{error}</p>}

            <p className="gateFooter">If you’re not amore, this page will pretend it doesn’t know you.</p>
          </section>
        </main>
      )}

      {/* DESK */}
      {view === "desk" && (
        <main className="deskShell">
          <FallingHearts density={28} z={0} />

          <div className="deskTop">
            <h2 className="deskTitle">Letters to my amore</h2>

            <div className="deskControls">
              <select
                className="filterSelect"
                value={themeFilter}
                onChange={(e) => setThemeFilter(e.target.value)}
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
                onChange={(e) => setOccasionFilter(e.target.value)}
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

              <div className="coverflowTrack" ref={trackRef} role="list" aria-label="Letters carousel">
                {baseCount === 0 ? (
                  <div className="emptyState">No letters match those filters.</div>
                ) : (
                  virtualList.map(({ i, realIdx, letter: l }) => {
                    const isActive = realIdx === safeActiveIndex && mod(virtualIndex, baseCount) === realIdx
                    const c = cardColors(l.theme)

                    return (
                      <button
                        key={`${l.id}-${i}`}
                        ref={(el) => {
                          itemRefs.current[i] = el
                        }}
                        className={`coverItem snapItem ${isActive ? "isActive" : ""}`}
                        style={{
                          ["--cardA" as any]: c.a,
                          ["--cardB" as any]: c.b,
                        }}
                        onClick={() => {
                          // If clicked outside middle copy, normalize to middle equivalent for seamless loop
                          const normalized = normalizeToMiddleCopy(i)
                          setVirtualIndex(normalized)
                          setActiveIndex(realIdx)

                          // If we normalized, jump immediately to avoid weird long scroll
                          if (normalized !== i) {
                            setTimeout(() => jumpToVirtual(normalized), 0)
                          }
                        }}
                        type="button"
                        role="listitem"
                      >
                        <div className="flatCard">
                          <div className="flatCardTop">
                            {l.audio ? (
                              <span className="pill">VOICE</span>
                            ) : (
                              <span className="pill ghost">TEXT</span>
                            )}
                            <div className="flatDate">{String(l.date ?? "")}</div>
                          </div>

                          <div className="flatTitle">{l.title}</div>
                          <div className="flatPreview">{l.preview}</div>
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

      {/* LETTER VIEW */}
      {view === "letter" && activeLetter && (
        <main className="stageCenter">
          <FallingHearts density={26} z={0} />

          <section className="letterPaperFlat">
            <FallingHeartsLocal density={16} />

            <div className="letterTop">
              <div>
                <h1 className="letterTitle">{activeLetter.title}</h1>
                <p className="letterMeta">
                  {String(activeLetter.date ?? "")}
                  {activeLetter.theme ? ` . ${activeLetter.theme}` : ""}
                  {activeLetter.occasion ? ` . ${activeLetter.occasion}` : ""}
                </p>
              </div>

              <button className="btnGhost" onClick={() => setView("desk")} type="button">
                Back
              </button>
            </div>

            {activeLetter.audio && (
              <div className="letterAudio">
                <div className="letterSectionLabel">Voicemail</div>
                <audio controls className="audioFull">
                  <source src={activeLetter.audio} />
                </audio>
              </div>
            )}

            {activeLetter.coverImage && (
              <div className="letterCover">
                <img src={activeLetter.coverImage} alt="" className="coverImg" />
              </div>
            )}

            <article className="letterBody" dangerouslySetInnerHTML={{ __html: activeLetter.content }} />
          </section>
        </main>
      )}
    </div>
  )
}