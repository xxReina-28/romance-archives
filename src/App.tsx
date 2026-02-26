import { useMemo, useState } from "react"

type View = "gate" | "desk" | "letter"

const PASSPHRASE = "wow you're hot"

export default function App() {
  const [view, setView] = useState<View>("gate")
  const [error, setError] = useState("")
  const [pass, setPass] = useState("")

  const isPassOk = useMemo(() => {
    return pass.trim().toLowerCase() === PASSPHRASE.trim().toLowerCase()
  }, [pass])

  function onUnlock(e: React.FormEvent) {
    e.preventDefault()
    if (!isPassOk) {
      setError("Nope. The curtains remain unimpressed.")
      return
    }
    setError("")
    setView("desk")
  }

  return (
    <div className="min-h-screen">
      {view === "gate" && (
        <main className="min-h-screen flex items-center justify-center px-6">
          <section className="w-full max-w-xl rounded-3xl border border-white/10 bg-black/20 p-8 shadow-2xl">
            <div className="flex flex-col items-center text-center gap-3">
              <div className="h-12 w-12 rounded-2xl border border-white/10 bg-white/5 flex items-center justify-center">
                ✦
              </div>
              <h1 className="text-3xl font-semibold">
                Restricted Romance Archive
              </h1>
              <p className="opacity-80">
                Enter the passphrase. The curtains will judge you.
              </p>
            </div>

            <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="font-semibold mb-1">Hint</p>
              <p className="opacity-80">
                Please put the first thing I said when I first met you.
              </p>
            </div>

            <form onSubmit={onUnlock} className="mt-6 flex gap-3">
              <input
                className="flex-1 rounded-2xl bg-white/5 border border-white/10 px-4 py-3 outline-none"
                type="password"
                placeholder="Passphrase"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                required
              />
              <button
                className="rounded-2xl px-6 py-3 font-semibold bg-red-500/90 hover:bg-red-500 transition"
                type="submit"
              >
                Unlock
              </button>
            </form>

            {error && (
              <p className="mt-3 text-sm text-red-200">
                {error}
              </p>
            )}

            <div className="mt-6 flex justify-center">
              <img
                className="w-64 rounded-2xl opacity-95"
                src="https://media.giphy.com/media/OPU6wzx8JrHna/giphy.gif"
                alt=""
                loading="lazy"
              />
            </div>

            <p className="mt-6 text-center text-sm opacity-70">
              If you’re not amore, this page will pretend it doesn’t know you.
            </p>
          </section>
        </main>
      )}

      {view === "desk" && (
        <main className="min-h-screen px-6 py-10">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-start justify-between gap-6 flex-wrap">
              <div>
                <h2 className="text-2xl font-semibold">Envelope Desk</h2>
                <p className="opacity-80">
                  Pick one. It will fly to the center like it owns the place.
                </p>
              </div>

              <button
                className="rounded-2xl px-4 py-2 border border-white/10 bg-white/5 hover:bg-white/10 transition"
                onClick={() => setView("gate")}
              >
                Lock
              </button>
            </div>

            {/* TODO: Render your envelope cards here */}
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <button
                className="rounded-2xl border border-white/10 bg-white/5 p-5 text-left hover:bg-white/10 transition"
                onClick={() => setView("letter")}
              >
                <div className="text-sm opacity-70">December 02, 2023</div>
                <div className="mt-2 text-lg font-semibold">Midnight Coffee</div>
                <div className="mt-1 opacity-80">
                  The world was asleep, but we were just beginning…
                </div>
              </button>
            </div>
          </div>
        </main>
      )}

      {view === "letter" && (
        <main className="min-h-screen flex items-center justify-center px-6 py-10">
          <section className="w-full max-w-2xl rounded-3xl border border-white/10 bg-white/5 p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl font-semibold">To my dearest amore,</h1>
                <p className="opacity-70 text-sm mt-1">December 02, 2023</p>
              </div>
            </div>

            <div className="mt-6 leading-relaxed opacity-90">
              The world was asleep, but we were just beginning…
            </div>

            <div className="mt-8 flex gap-3">
              <button
                className="rounded-2xl px-4 py-2 border border-white/10 bg-white/5 hover:bg-white/10 transition"
                onClick={() => setView("desk")}
              >
                Back
              </button>
              <button
                className="rounded-2xl px-4 py-2 bg-red-500/90 hover:bg-red-500 transition font-semibold"
                onClick={() => {/* replay typing later */}}
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