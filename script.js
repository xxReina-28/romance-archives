// =====================================
// Letters to Amore . Desk + Flight + Blocks
// Plain static site. Guarded entry.
// =====================================

// Passphrase . accepts spacing / apostrophe variations
const PASS_ACCEPT = new Set([
  "wowyourehot",
  "wow you're hot",
  "wow youre hot",
]);

// Views
const gateView = document.getElementById("gateView");
const deskView = document.getElementById("deskView");
const letterView = document.getElementById("letterView");

// Gate controls
const gateForm = document.getElementById("gateForm");
const passInput = document.getElementById("passphrase");
const gateError = document.getElementById("gateError");
const gateCard = document.querySelector(".gateCard");
const sigil = document.querySelector(".sigil");
const cryWrap = document.getElementById("cryWrap");
const curtain = document.getElementById("curtain");

// Desk controls
const deskArea = document.getElementById("deskArea");
const themeFilter = document.getElementById("themeFilter");
const occasionFilter = document.getElementById("occasionFilter");
const clearFilters = document.getElementById("clearFilters");

// Letter controls
const closeBtn = document.getElementById("closeBtn");
const replayBtn = document.getElementById("replayBtn");

// Letter elements
const note = document.getElementById("note");
const noteTitle = document.getElementById("noteTitle");
const noteDate = document.getElementById("noteDate");
const letterText = document.getElementById("letterText");

// Flight overlay
const flightOverlay = document.getElementById("flightOverlay");

// Background music
const bgm = document.getElementById("bgm") || null;

// Dramatic fade overlay injected
let fadeOverlay = document.querySelector(".fadeOverlay");
if (!fadeOverlay){
  fadeOverlay = document.createElement("div");
  fadeOverlay.className = "fadeOverlay";
  document.body.appendChild(fadeOverlay);
}

// Defensive log
console.log("script.js loaded");

// Date on letter
function setDateLabel(dateStr){
  if (!noteDate) return;
  const d = dateStr ? new Date(dateStr) : new Date();
  noteDate.textContent = d.toLocaleDateString(undefined, { year:"numeric", month:"long", day:"numeric" });
}
setDateLabel();

// ================================
// Default letter (fallback)
// ================================
const DEFAULT_LETTER_TEXT = [
  "My Amore,",
  "",
  "I was going to write you something cool and composed. Something mysterious. Something that would quietly make you fall in love with me all over again.",
  "",
  "Unfortunately. I am writing to you instead.",
  "",
  "You know what’s funny. No matter how independent I am, no matter how strong or self-sufficient I try to be, when it comes to you my brain just calmly says, “Ah yes. We surrender.”",
  "",
  "If kingdoms were built on smiles, you would already own mine. No battle required. No siege. Just you existing.",
  "",
  "Sometimes I look at you and wonder how someone so calm can cause this much chaos in my heart. It’s unfair. I demand compensation. Preferably in hugs and kisses. I am willing to negotiate, but only slightly.",
  "",
  "And the most dangerous part. You don’t even try. You’re just you. Focused. Disciplined. Economical with your words. Yet somehow that is exactly what makes you so special to me.",
  "",
  "My emperor, if I tease you, or act dramatic, it’s because you make me feel safe enough to be soft. And that is not something I give easily.",
  "",
  "So tonight, just know that somewhere in this world there is a woman smiling at her phone because of you.",
  "",
  "Whether I call you amore, master, or my emperor, it all means the same thing.",
  "",
  "You matter to me.",
  "",
  "Now go back to being powerful and hardworking. I’ll be here. Slightly obsessed. Pretending I’m not.",
  "",
  "I can’t wait to be back by your side again.",
  "",
  "Yours,",
  "Your very loyal subject"
].join("\n");

// ================================
// Utilities
// ================================
function show(view){
  [gateView, deskView, letterView].forEach(v => v && v.classList.remove("is-active"));
  if (view) view.classList.add("is-active");
}

function normalizePass(s){
  const raw = (s || "").trim().toLowerCase();
  const tight = raw.replace(/[^a-z0-9]+/g, "");
  return { raw, tight };
}

// Gate wrong answer FX
function wrongAnswerFX(){
  if (gateError) gateError.textContent = "You forgot?!";
  if (cryWrap) cryWrap.classList.add("is-show");

  if (gateCard && sigil){
    gateCard.classList.remove("is-wrong");
    sigil.classList.remove("is-angry");
    void gateCard.offsetWidth;
    gateCard.classList.add("is-wrong");
    sigil.classList.add("is-angry");
    setTimeout(() => sigil.classList.remove("is-angry"), 900);
  }
}

// Curtain open
function openCurtain(){
  if (!curtain) return;
  curtain.classList.add("is-open");
  setTimeout(() => curtain.style.display = "none", 950);
}

// ================================
// Background music . hardened
// ================================
let bgmWanted = false;

function wireBgmDebug(){
  if (!bgm) return;

  bgm.addEventListener("error", () => {
    console.warn("BGM error", bgm.error, "src:", bgm.currentSrc || "(no currentSrc)");
  });

  bgm.addEventListener("stalled", () => console.warn("BGM stalled"));
  bgm.addEventListener("waiting", () => console.warn("BGM waiting"));
  bgm.addEventListener("canplaythrough", () => {
    if (bgmWanted) startBgm("canplaythrough");
  });
}

function startBgm(reason = "unknown"){
  if (!bgm) return;
  bgmWanted = true;

  try{
    bgm.volume = 0.42;
    const p = bgm.play();
    if (p && typeof p.catch === "function"){
      p.catch((err) => {
        console.warn("BGM play blocked or failed. Reason:", reason, err);
      });
    }
  } catch (e){
    console.warn("BGM exception. Reason:", reason, e);
  }
}

["click", "touchstart", "keydown"].forEach(evt => {
  window.addEventListener(evt, () => startBgm(evt), { once: true, passive: true });
});
wireBgmDebug();

// ================================
// Typewriter
// ================================
let typingTimer = null;

function typewriter(text, speed = 18, onDone){
  if (!letterText) return;

  clearInterval(typingTimer);
  letterText.textContent = "";
  let i = 0;

  typingTimer = setInterval(() => {
    letterText.textContent += text[i] || "";
    i++;
    if (i >= text.length){
      clearInterval(typingTimer);
      typingTimer = null;
      if (typeof onDone === "function") onDone();
    }
  }, speed);
}

// Tiny pop sound (WebAudio)
let audioCtx = null;
function popSound(){
  try{
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    const o = audioCtx.createOscillator();
    const g = audioCtx.createGain();

    o.type = "sine";
    o.frequency.setValueAtTime(260, audioCtx.currentTime);
    o.frequency.exponentialRampToValueAtTime(740, audioCtx.currentTime + 0.06);

    g.gain.setValueAtTime(0.0001, audioCtx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.34, audioCtx.currentTime + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.10);

    o.connect(g);
    g.connect(audioCtx.destination);
    o.start();
    o.stop(audioCtx.currentTime + 0.12);
  } catch {}
}

// Dramatic fade overlay
function fadeToLetter(){
  if (!fadeOverlay) return;
  fadeOverlay.classList.add("is-on");
  setTimeout(() => fadeOverlay.classList.remove("is-on"), 900);
}

// ================================
// Canvas FX (your original, unchanged logic)
// ================================
const canvas = document.getElementById("fx");
const ctx = canvas ? canvas.getContext("2d") : null;

function resize(){
  if (!canvas || !ctx) return;
  const dpr = Math.max(1, window.devicePixelRatio || 1);
  canvas.width = Math.floor(window.innerWidth * dpr);
  canvas.height = Math.floor(window.innerHeight * dpr);
  canvas.style.width = window.innerWidth + "px";
  canvas.style.height = window.innerHeight + "px";
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
window.addEventListener("resize", resize);
resize();

const rand = (a,b)=> a + Math.random()*(b-a);

const stars = [];
const hearts = [];
const confetti = [];

function spawnStar(){
  stars.push({
    x: rand(0, window.innerWidth),
    y: rand(-160, -10),
    r: rand(5, 12),
    vy: rand(0.9, 2.8),
    vx: rand(-0.25, 0.25),
    rot: rand(0, Math.PI*2),
    vr: rand(-0.012, 0.012),
    alpha: rand(0.35, 0.95)
  });
  if (stars.length > 120) stars.shift();
}

function spawnHeart(){
  hearts.push({
    x: rand(40, window.innerWidth - 40),
    y: rand(40, window.innerHeight - 40),
    r: rand(7, 14),
    vx: rand(-2.1, 2.1),
    vy: rand(-2.1, 2.1),
    rot: rand(0, Math.PI*2),
    vr: rand(-0.02, 0.02),
    alpha: rand(0.35, 0.85)
  });
  if (hearts.length > 30) hearts.shift();
}
for (let i=0;i<18;i++) spawnHeart();

function drawStar(x,y,r,rot,alpha){
  if (!ctx) return;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(x,y);
  ctx.rotate(rot);
  ctx.beginPath();

  const spikes = 5;
  const outer = r;
  const inner = r * 0.45;

  for (let i=0;i<spikes*2;i++){
    const ang = (i * Math.PI) / spikes;
    const rad = (i % 2 === 0) ? outer : inner;
    ctx.lineTo(Math.cos(ang)*rad, Math.sin(ang)*rad);
  }
  ctx.closePath();

  const grad = ctx.createLinearGradient(-r, -r, r, r);
  grad.addColorStop(0, `rgba(216,178,76,${alpha})`);
  grad.addColorStop(1, `rgba(255,255,255,${alpha})`);
  ctx.fillStyle = grad;
  ctx.fill();
  ctx.restore();
}

function drawHeart(x,y,r,rot,alpha){
  if (!ctx) return;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(x,y);
  ctx.rotate(rot);
  ctx.beginPath();

  const s = r / 16;
  ctx.moveTo(0, 6*s);
  ctx.bezierCurveTo(0, 0, -16*s, 0, -16*s, 10*s);
  ctx.bezierCurveTo(-16*s, 18*s, -8*s, 22*s, 0, 28*s);
  ctx.bezierCurveTo(8*s, 22*s, 16*s, 18*s, 16*s, 10*s);
  ctx.bezierCurveTo(16*s, 0, 0, 0, 0, 6*s);
  ctx.closePath();

  const grad = ctx.createRadialGradient(0, 10*s, r*0.1, 0, 10*s, r*1.25);
  grad.addColorStop(0, `rgba(255,255,255,${alpha})`);
  grad.addColorStop(1, `rgba(115,3,3,${alpha})`);
  ctx.fillStyle = grad;
  ctx.fill();
  ctx.restore();
}

function confettiScreen(){
  const count = 520;
  for (let i = 0; i < count; i++){
    confetti.push({
      x: rand(0, window.innerWidth),
      y: rand(0, window.innerHeight),
      vx: rand(-3.6, 3.6),
      vy: rand(-3.6, 3.6),
      r: rand(2, 4.6),
      rot: rand(0, Math.PI*2),
      vr: rand(-0.25, 0.25),
      life: rand(80, 140),
      alpha: 1
    });
  }
}

function stepHearts(){
  for (const h of hearts){
    h.x += h.vx;
    h.y += h.vy;
    h.rot += h.vr;

    const pad = 22;
    if (h.x < pad){ h.x = pad; h.vx *= -0.98; }
    if (h.x > window.innerWidth - pad){ h.x = window.innerWidth - pad; h.vx *= -0.98; }
    if (h.y < pad){ h.y = pad; h.vy *= -0.98; }
    if (h.y > window.innerHeight - pad){ h.y = window.innerHeight - pad; h.vy *= -0.98; }

    h.vx += rand(-0.03, 0.03);
    h.vy += rand(-0.03, 0.03);

    h.vx = Math.max(-2.4, Math.min(2.4, h.vx));
    h.vy = Math.max(-2.4, Math.min(2.4, h.vy));
  }
}

function stepStars(){
  for (const s of stars){
    s.x += s.vx;
    s.y += s.vy;
    s.rot += s.vr;

    if (s.y > window.innerHeight + 60){
      s.y = rand(-180, -10);
      s.x = rand(0, window.innerWidth);
      s.vy = rand(0.9, 2.8);
      s.alpha = rand(0.35, 0.95);
    }
  }
}

function stepConfetti(){
  for (let i = confetti.length - 1; i >= 0; i--){
    const c = confetti[i];
    c.x += c.vx;
    c.y += c.vy;
    c.rot += c.vr;

    if (c.x < -20) c.x = window.innerWidth + 20;
    if (c.x > window.innerWidth + 20) c.x = -20;
    if (c.y < -20) c.y = window.innerHeight + 20;
    if (c.y > window.innerHeight + 20) c.y = -20;

    c.life -= 1;
    c.alpha = Math.max(0, c.life / 140);

    if (c.life <= 0) confetti.splice(i, 1);
  }
}

function drawConfetti(){
  if (!ctx) return;
  for (const c of confetti){
    ctx.save();
    ctx.globalAlpha = c.alpha;
    ctx.translate(c.x, c.y);
    ctx.rotate(c.rot);

    const g = ctx.createLinearGradient(-6, -6, 6, 6);
    g.addColorStop(0, `rgba(216,178,76,${c.alpha})`);
    g.addColorStop(1, `rgba(115,3,3,${c.alpha})`);
    ctx.fillStyle = g;

    ctx.fillRect(-c.r*2.1, -c.r*0.9, c.r*3.6, c.r*1.8);
    ctx.restore();
  }
}

function tick(){
  if (ctx){
    ctx.clearRect(0,0,window.innerWidth, window.innerHeight);

    if (Math.random() < 0.85) spawnStar();
    if (Math.random() < 0.03) spawnHeart();

    stepStars();
    stepHearts();
    stepConfetti();

    for (const s of stars) drawStar(s.x, s.y, s.r, s.rot, s.alpha);
    for (const h of hearts) drawHeart(h.x, h.y, h.r, h.rot, h.alpha);
    drawConfetti();
  }
  requestAnimationFrame(tick);
}
tick();

// ================================
// Letters data load
// ================================
let LETTER_INDEX = [];
let currentLetterId = null;

async function fetchJson(path){
  const res = await fetch(path, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed fetch ${path}. ${res.status}`);
  return res.json();
}

function getUnique(list, key){
  return Array.from(new Set(list.map(x => x[key]).filter(Boolean))).sort((a,b)=>a.localeCompare(b));
}

function fillSelect(selectEl, values, label){
  if (!selectEl) return;
  const keepFirst = selectEl.querySelector("option[value='']") ? 1 : 0;
  while (selectEl.options.length > keepFirst) selectEl.remove(keepFirst);

  for (const v of values){
    const opt = document.createElement("option");
    opt.value = v;
    opt.textContent = v;
    selectEl.appendChild(opt);
  }
}

function applyFilters(list){
  const t = themeFilter ? themeFilter.value : "";
  const o = occasionFilter ? occasionFilter.value : "";
  return list.filter(item => {
    const okT = !t || item.theme === t;
    const okO = !o || item.occasion === o;
    return okT && okO;
  });
}

function buildEnvelopeCard(item){
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "envCard";
  btn.setAttribute("aria-label", `Open letter ${item.title || item.id}`);

  const scatter = item.scatter || {};
  const xPct = typeof scatter.x === "number" ? scatter.x : rand(8, 72);
  const yPct = typeof scatter.y === "number" ? scatter.y : rand(8, 62);
  const rDeg = typeof scatter.r === "number" ? scatter.r : rand(-9, 9);
  const z = typeof scatter.z === "number" ? scatter.z : Math.floor(rand(1, 8));

  btn.style.setProperty("--x", `${xPct}%`);
  btn.style.setProperty("--y", `${yPct}%`);
  btn.style.setProperty("--r", `${rDeg}deg`);
  btn.style.setProperty("--z", `${z}`);

  btn.innerHTML = `
    <div class="env-body"></div>
    <div class="env-shadow"></div>
    <div class="env-flap"></div>

    <div class="wax" aria-hidden="true">
      <div class="waxInner">🐍</div>
    </div>

    <div class="envMeta">${(item.theme || "theme")}${item.occasion ? " · " + item.occasion : ""}</div>
    <div class="env-label">${item.preview || item.title || "Open Me"}</div>
  `;

  btn.addEventListener("click", () => onEnvelopePick(btn, item));
  return btn;
}

function renderDesk(){
  if (!deskArea) return;
  deskArea.innerHTML = "";

  const filtered = applyFilters(LETTER_INDEX);

  for (const item of filtered){
    const card = buildEnvelopeCard(item);

    // Convert % positions to actual px transforms via CSS translate. We keep it simple by using % of container.
    // Set translate via CSS variables as px by reading container size.
    // But we used % strings. So we convert now.
    const rect = deskArea.getBoundingClientRect();
    const xPct = parseFloat((item.scatter && item.scatter.x) ?? NaN);
    const yPct = parseFloat((item.scatter && item.scatter.y) ?? NaN);

    // If user provided scatter as numbers, treat as percent. If absent, our random was already percent numbers.
    const x = isFinite(xPct) ? xPct : parseFloat(card.style.getPropertyValue("--x"));
    const y = isFinite(yPct) ? yPct : parseFloat(card.style.getPropertyValue("--y"));

    card.style.setProperty("--x", `${(rect.width * (x/100))}px`);
    card.style.setProperty("--y", `${(rect.height * (y/100))}px`);

    deskArea.appendChild(card);
  }
}

async function loadIndex(){
  try{
    LETTER_INDEX = await fetchJson("./letters/index.json");
  } catch (e){
    console.warn("No letters/index.json found. Using fallback single letter.", e);
    LETTER_INDEX = [
      {
        id: "default",
        title: "Default",
        theme: "teasing",
        occasion: "random",
        preview: "Click me. I’m harmless. Mostly.",
        date: null,
        scatter: { x: 40, y: 28, r: -5, z: 4 }
      }
    ];
  }

  fillSelect(themeFilter, getUnique(LETTER_INDEX, "theme"));
  fillSelect(occasionFilter, getUnique(LETTER_INDEX, "occasion"));
  renderDesk();
}

if (themeFilter) themeFilter.addEventListener("change", renderDesk);
if (occasionFilter) occasionFilter.addEventListener("change", renderDesk);
if (clearFilters) clearFilters.addEventListener("click", () => {
  if (themeFilter) themeFilter.value = "";
  if (occasionFilter) occasionFilter.value = "";
  renderDesk();
});

window.addEventListener("resize", () => {
  // Recompute scatter px positions
  if (deskView && deskView.classList.contains("is-active")) renderDesk();
});

// ================================
// FLIP flight to center
// ================================
function wait(ms){ return new Promise(r => setTimeout(r, ms)); }

async function flyToCenter(envEl){
  if (!flightOverlay) return;

  const first = envEl.getBoundingClientRect();

  // Clone for flight so the desk stays stable
  const clone = envEl.cloneNode(true);
  clone.classList.remove("is-opening");
  clone.style.position = "absolute";
  clone.style.left = `${first.left}px`;
  clone.style.top = `${first.top}px`;
  clone.style.width = `${first.width}px`;
  clone.style.height = `${first.height}px`;
  clone.style.transform = "none";

  flightOverlay.appendChild(clone);

  // Compute destination center
  const destW = Math.min(420, window.innerWidth * 0.86);
  const destH = destW * 0.75;
  const lastLeft = (window.innerWidth - destW) / 2;
  const lastTop = (window.innerHeight - destH) / 2;

  // Animate
  clone.animate([
    { transform: "translate(0,0) scale(1) rotate(0deg)" },
    { transform: `translate(${(lastLeft - first.left)}px, ${(lastTop - first.top)}px) scale(${destW/first.width}, ${destH/first.height}) rotate(0deg)` }
  ], {
    duration: 520,
    easing: "cubic-bezier(.2,.9,.2,1)",
    fill: "forwards"
  });

  await wait(520);

  // Snap to final box for the opening animation
  clone.style.left = `${lastLeft}px`;
  clone.style.top = `${lastTop}px`;
  clone.style.width = `${destW}px`;
  clone.style.height = `${destH}px`;

  return clone;
}

function clearFlight(){
  if (!flightOverlay) return;
  flightOverlay.innerHTML = "";
}

// ================================
// Letter rendering (blocks)
// ================================
function clearLetter(){
  if (!letterText) return;
  letterText.textContent = "";
  const blocks = letterText.querySelectorAll(".block");
  blocks.forEach(b => b.remove());
}

function formatTime(s){
  if (!isFinite(s)) return "0:00";
  const m = Math.floor(s / 60);
  const r = Math.floor(s % 60);
  return `${m}:${String(r).padStart(2,"0")}`;
}

function mountAudioPlayer(container, src, label){
  const wrap = document.createElement("div");
  wrap.className = "block audioCard";

  const audio = document.createElement("audio");
  audio.preload = "metadata";
  audio.src = src;

  const row = document.createElement("div");
  row.className = "audioRow";

  const btn = document.createElement("button");
  btn.className = "playBtn";
  btn.type = "button";
  btn.textContent = "▶";

  const range = document.createElement("input");
  range.className = "progress";
  range.type = "range";
  range.min = "0";
  range.max = "1000";
  range.value = "0";

  const time = document.createElement("div");
  time.className = "time";
  time.textContent = "0:00 · 0:00";

  row.appendChild(btn);
  row.appendChild(range);
  row.appendChild(time);

  if (label){
    const cap = document.createElement("div");
    cap.style.margin = "0 0 10px";
    cap.style.opacity = ".92";
    cap.style.fontWeight = "900";
    cap.style.textAlign = "left";
    cap.textContent = label;
    wrap.appendChild(cap);
  }

  wrap.appendChild(row);
  wrap.appendChild(audio);
  container.appendChild(wrap);

  const sync = () => {
    const dur = audio.duration || 0;
    const cur = audio.currentTime || 0;
    const p = dur ? (cur / dur) : 0;
    range.value = String(Math.floor(p * 1000));
    time.textContent = `${formatTime(cur)} · ${formatTime(dur)}`;
    btn.textContent = audio.paused ? "▶" : "⏸";
  };

  btn.addEventListener("click", async () => {
    try{
      if (audio.paused){
        await audio.play();
      } else {
        audio.pause();
      }
    } catch (e){
      console.warn("Audio play failed", e);
    }
    sync();
  });

  range.addEventListener("input", () => {
    const dur = audio.duration || 0;
    if (!dur) return;
    const p = Number(range.value) / 1000;
    audio.currentTime = dur * p;
  });

  audio.addEventListener("timeupdate", sync);
  audio.addEventListener("loadedmetadata", sync);
  audio.addEventListener("ended", sync);
}

function mountImage(container, src, caption){
  const wrap = document.createElement("div");
  wrap.className = "block photoCard";

  const img = document.createElement("img");
  img.loading = "lazy";
  img.alt = caption || "photo";
  img.src = src;

  wrap.appendChild(img);

  if (caption){
    const cap = document.createElement("div");
    cap.className = "photoCaption";
    cap.textContent = caption;
    wrap.appendChild(cap);
  }

  container.appendChild(wrap);
}

async function loadLetterById(id){
  if (id === "default"){
    return {
      id: "default",
      title: "To my dearest amore,",
      date: null,
      blocks: [{ type: "text", value: DEFAULT_LETTER_TEXT }]
    };
  }

  const path = `./letters/${id}.json`;
  const data = await fetchJson(path);

  // Normalize
  const blocks = Array.isArray(data.blocks) ? data.blocks : [{ type:"text", value: String(data.content || "") }];
  return {
    id,
    title: data.title || "To my dearest amore,",
    date: data.date || null,
    blocks
  };
}

function blocksToTypedText(blocks){
  const texts = blocks
    .filter(b => b && b.type === "text" && typeof b.value === "string")
    .map(b => b.value.trimEnd());
  return texts.join("\n\n");
}

function mountMediaBlocks(blocks){
  if (!letterText) return;
  const media = blocks.filter(b => b && (b.type === "image" || b.type === "audio"));

  for (const b of media){
    if (b.type === "image" && b.src){
      mountImage(letterText, b.src, b.caption || "");
    }
    if (b.type === "audio" && b.src){
      mountAudioPlayer(letterText, b.src, b.label || "Voice note");
    }
  }
}

// ================================
// Open sequence (fly, open, then render)
// ================================
async function openSequence(letterItem, clickedEl){
  console.log("openSequence fired", letterItem?.id);

  try{ popSound(); } catch {}
  try{ startBgm("openSequence"); } catch {}
  try{ confettiScreen(); } catch {}
  try{ fadeToLetter(); } catch {}

  // Fly to center
  const flyer = await flyToCenter(clickedEl);
  if (flyer){
    flyer.classList.add("is-opening");
  }

  await wait(650);

  // Enter reading mode
  document.body.classList.add("is-reading");
  show(letterView);

  try{
    if (note){
      note.classList.remove("note-folded");
      note.classList.remove("note-unfold");
      void note.offsetWidth;
      note.classList.add("note-unfold");
    }
  } catch {}

  // Load letter content
  clearLetter();

  let letterData = null;
  try{
    letterData = await loadLetterById(letterItem.id);
  } catch (e){
    console.warn("Letter load failed, falling back to default text", e);
    letterData = {
      id: "fallback",
      title: "To my dearest amore,",
      date: null,
      blocks: [{ type:"text", value: DEFAULT_LETTER_TEXT }]
    };
  }

  if (noteTitle) noteTitle.textContent = letterData.title || "To my dearest amore,";
  setDateLabel(letterData.date);

  const typed = blocksToTypedText(letterData.blocks) || DEFAULT_LETTER_TEXT;

  // Type, then mount media blocks
  typewriter(typed, 18, () => {
    mountMediaBlocks(letterData.blocks);
  });

  currentLetterId = letterItem.id;

  // Remove flight clone
  clearFlight();
}

function onEnvelopePick(envEl, item){
  openSequence(item, envEl);
}

// ================================
// Wire events
// ================================
if (gateForm){
  gateForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (gateError) gateError.textContent = "";

    const { raw, tight } = normalizePass(passInput ? passInput.value : "");
    const ok = PASS_ACCEPT.has(raw) || PASS_ACCEPT.has(tight) || tight === "wowyourehot";

    if (ok){
      if (cryWrap) cryWrap.classList.remove("is-show");
      openCurtain();
      startBgm("gateUnlock");

      // load desk data while curtain opens
      await loadIndex();

      // swap view after a short beat
      setTimeout(() => {
        show(deskView);
        if (passInput) passInput.value = "";
      }, 520);

    } else {
      wrongAnswerFX();
      passInput && passInput.select();
    }
  });
}

closeBtn && closeBtn.addEventListener("click", () => {
  document.body.classList.remove("is-reading");
  show(deskView);
  clearFlight();
});

replayBtn && replayBtn.addEventListener("click", async () => {
  document.body.classList.remove("is-reading");
  show(deskView);
  clearFlight();

  // Find the same card and re-open it
  const item = LETTER_INDEX.find(x => x.id === currentLetterId) || LETTER_INDEX[0];
  if (!item) return;

  // pick the first matching rendered envelope
  const card = deskArea ? deskArea.querySelector(".envCard") : null;
  if (!card) return;

  await wait(250);
  openSequence(item, card);
});
