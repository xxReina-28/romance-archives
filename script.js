// ================================
// Romantic Villain Letter . script.js
// Hardened so NOTHING blocks the open transition
// ================================

// Semi-private gate
const PASS = "wowyourehot";

// Views
const gateView = document.getElementById("gateView");
const envelopeView = document.getElementById("envelopeView");
const letterView = document.getElementById("letterView");

// Gate controls
const gateForm = document.getElementById("gateForm");
const passInput = document.getElementById("passphrase");
const gateError = document.getElementById("gateError");

const gateCard = document.querySelector(".gateCard");
const sigil = document.querySelector(".sigil");
const cryWrap = document.getElementById("cryWrap");

// Envelope + letter controls
const openBtn = document.getElementById("openBtn");
const closeBtn = document.getElementById("closeBtn");
const replayBtn = document.getElementById("replayBtn");

// Letter elements
const note = document.getElementById("note");
const noteDate = document.getElementById("noteDate");
const letterText = document.getElementById("letterText");

// Background music (optional)
const bgm = document.getElementById("bgm") || null;
// Make sure music starts after ANY user gesture (browser autoplay rules)
["click", "touchstart", "keydown"].forEach(evt => {
  window.addEventListener(evt, () => startBgm(), { once: true });
});

// Defensive log so you can verify everything exists
console.log("script.js loaded");
["gateView","envelopeView","letterView","openBtn","note","letterText"].forEach(id => {
  console.log(id, document.getElementById(id) ? "OK" : "MISSING");
});

// Fade overlay injected (dramatic)
let fadeOverlay = document.querySelector(".fadeOverlay");
if (!fadeOverlay){
  fadeOverlay = document.createElement("div");
  fadeOverlay.className = "fadeOverlay";
  document.body.appendChild(fadeOverlay);
}

// Date on letter
if (noteDate){
  const now = new Date();
  noteDate.textContent = now.toLocaleDateString(undefined, { year:"numeric", month:"long", day:"numeric" });
}

// Letter content . Edit freely
const LETTER = [
  "To my dearest amore,",
  "",
  "You clicked the envelope,",
  "so legally you are now in my jurisdiction.",
  "",
  "I built this like a romantic villain builds a lair.",
  "With style. With intent. With an unnecessary amount of effort.",
  "",
  "I like you.",
  "In a way that makes me want to prove things.",
  "Not with words. With systems.",
  "",
  "If you’re smiling, good.",
  "The trap is functioning as designed.",
  "",
  "Yours,",
  "Reina."
].join("\n");

// --------------------
// Utilities
// --------------------
function show(view){
  [gateView, envelopeView, letterView].forEach(v => v && v.classList.remove("is-active"));
  if (view) view.classList.add("is-active");
}

function normalizePass(s){
  return (s || "").trim().toLowerCase().replace(/\s+/g, " ");
}

// --------------------
// Gate . wrong answer FX
// --------------------
function wrongAnswerFX(){
  if (gateError) gateError.textContent = "You forgot?!";
  if (cryWrap) cryWrap.classList.add("is-show");

  if (gateCard && sigil){
    gateCard.classList.remove("is-wrong");
    sigil.classList.remove("is-angry");
    void gateCard.offsetWidth; // restart animations
    gateCard.classList.add("is-wrong");
    sigil.classList.add("is-angry");
    setTimeout(() => sigil.classList.remove("is-angry"), 900);
  }
}

// --------------------
// Background music . never blocks UI
// --------------------
function startBgm(){
  if (!bgm) return;
  try{
    bgm.volume = 0.42;
    const p = bgm.play();
    if (p && typeof p.catch === "function") p.catch(() => {});
  } catch {
    // ignore
  }
}

// --------------------
// Typewriter
// --------------------
let typingTimer = null;

function typewriter(text, speed = 18){
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
    }
  }, speed);
}

// --------------------
// Tiny pop sound (WebAudio) . optional
// --------------------
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
  } catch {
    // ignore
  }
}

// --------------------
// Dramatic fade overlay
// --------------------
function fadeToLetter(){
  if (!fadeOverlay) return;
  fadeOverlay.classList.add("is-on");
  setTimeout(() => fadeOverlay.classList.remove("is-on"), 900);
}

// ================================
// Canvas FX
// Stars fall down
// Hearts bounce around
// Confetti covers the screen then fades
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

const stars = [];     // falling down
const hearts = [];    // bouncing
const confetti = [];  // full-screen burst

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

// seed hearts
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
// Open sequence . hardened
// ================================
function openSequence(){
  console.log("openSequence fired");

  try { openBtn && openBtn.classList.add("is-opening"); } catch (e) { console.error("openBtn issue", e); }
  try { popSound(); } catch (e) { console.error("popSound issue", e); }
  try { startBgm(); } catch (e) { console.error("startBgm issue", e); }

  try { confettiScreen(); } catch (e) { console.error("confettiScreen issue", e); }
  try { fadeToLetter(); } catch (e) { console.error("fadeToLetter issue", e); }

  window.setTimeout(() => {
    console.log("transition timeout fired");

    try {
      show(letterView);
      console.log("active view:", document.querySelector(".view.is-active")?.id);
    } catch (e) {
      console.error("show(letterView) failed", e);
      return;
    }

    try {
      if (note){
        note.classList.remove("note-folded");
        note.classList.remove("note-unfold");
        void note.offsetWidth;
        note.classList.add("note-unfold");
      } else {
        console.warn("note is missing");
      }
    } catch (e) {
      console.error("note unfold failed", e);
    }

    try { typewriter(LETTER, 18); } catch (e) { console.error("typewriter failed", e); }
  }, 650);
}

// ================================
// Wire events
// ================================
if (gateForm){
  gateForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (gateError) gateError.textContent = "";

    const attempt = normalizePass(passInput ? passInput.value : "");
    if (attempt === PASS){
      if (cryWrap) cryWrap.classList.remove("is-show");
      show(envelopeView);
      if (passInput) passInput.value = "";
      startBgm();
      setTimeout(() => openBtn && openBtn.focus(), 100);
    } else {
      wrongAnswerFX();
      passInput && passInput.select();
    }
  });
}

openBtn && openBtn.addEventListener("click", openSequence);

closeBtn && closeBtn.addEventListener("click", () => {
  show(envelopeView);
  openBtn && openBtn.classList.remove("is-opening");
});

replayBtn && replayBtn.addEventListener("click", () => {
  show(envelopeView);
  openBtn && openBtn.classList.remove("is-opening");
  setTimeout(openSequence, 250);
});
