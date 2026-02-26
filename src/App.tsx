import { useEffect } from "react"

export default function App() {
  useEffect(() => {
    // If you still use old script.js logic,
    // temporarily load it until we refactor it.
    const script = document.createElement("script")
    script.src = "/script.js"
    script.async = true
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  return (
    <>
      <canvas id="fx" aria-hidden="true"></canvas>

      <div id="flightOverlay" className="flightOverlay" aria-hidden="true"></div>

      <main className="stage">

        <section id="gateView" className="view is-active" aria-label="Passphrase gate">
          <div id="curtain" className="curtain" aria-hidden="true">
            <div className="curtainPanel left"></div>
            <div className="curtainPanel right"></div>
          </div>

          <div className="gateCard">
            <div className="gateTop">
              <div className="sigil">✦</div>
              <h1 className="gateTitle">Restricted Romance Archive</h1>
              <p className="gateSub">Enter the passphrase. The curtains will judge you.</p>
            </div>

            <div className="gateHint">
              <p className="hintTitle">Hint</p>
              <p className="hintText">
                Please put the first thing I said when I first met you.
              </p>
            </div>

            <form id="gateForm" className="gateForm" autoComplete="off">
              <input
                id="passphrase"
                className="gateInput"
                type="password"
                placeholder="Passphrase"
                required
              />
              <button className="btn" type="submit">Unlock</button>
            </form>

            <p id="gateError" className="gateError" role="alert"></p>

            <div id="cryWrap" className="cryWrap" aria-hidden="true">
              <img
                className="cryGif"
                src="https://media.giphy.com/media/OPU6wzx8JrHna/giphy.gif"
                alt=""
                loading="lazy"
              />
            </div>

            <p className="gateFooter">
              If you’re not amore, this page will pretend it doesn’t know you.
            </p>
          </div>
        </section>

        <section id="deskView" className="view" aria-label="Envelope desk">
          <div className="deskTop">
            <div className="deskTitleWrap">
              <h2 className="deskTitle">Envelope Desk</h2>
              <p className="deskSub">
                Pick one. It will fly to the center like it owns the place.
              </p>
            </div>

            <div className="deskFilters">
              <select id="themeFilter" className="select">
                <option value="">All themes</option>
              </select>
              <select id="occasionFilter" className="select">
                <option value="">All occasions</option>
              </select>
              <button id="clearFilters" className="btn secondary" type="button">
                Clear
              </button>
            </div>
          </div>

          <div id="deskArea" className="deskArea"></div>

          <p className="hint">
            Hover for sparkle. Click to open. Emotional safety not guaranteed.
          </p>
        </section>

        <section id="letterView" className="view" aria-label="Letter">
          <div className="note note-folded" id="note">
            <div className="note-top">
              <h1 className="note-title" id="noteTitle">
                To my dearest amore,
              </h1>
              <span className="note-date" id="noteDate"></span>
            </div>

            <article className="note-body" id="letterText"></article>

            <div className="note-actions">
              <button id="closeBtn" className="btn secondary" type="button">
                Back
              </button>
              <button id="replayBtn" className="btn" type="button">
                Replay
              </button>
            </div>
          </div>
        </section>

      </main>

      <audio id="bgm" loop preload="auto">
        <source src="/assets/piano.mp3" type="audio/mpeg" />
      </audio>
    </>
  )
}