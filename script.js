// Semi-private gate
const PASS = "wow you're hot"; // semi-private, not truly secure

const gateView = document.getElementById("gateView");
const envelopeView = document.getElementById("envelopeView");
const letterView = document.getElementById("letterView");

const gateForm = document.getElementById("gateForm");
const passInput = document.getElementById("passphrase");
const gateError = document.getElementById("gateError");

const openBtn = document.getElementById("openBtn");
const closeBtn = document.getElementById("closeBtn");
const replayBtn = document.getElementById("replayBtn");

const note = document.getElementById("note");
const noteDate = document.getElementById("noteDate");
const letterText = document.getElementById("letterText");

// Date
const now = new Date();
noteDate.textContent = now.toLocaleDateString(undefined, { year:"numeric", month:"long", day:"numeric" });

// Letter content (edit this to your exact message)
const LETTER = [
  "A.",
  "",
  "This is your official warning.",
  "You have been selected by a highly motivated romantic villain with internet access.",
  "",
  "I made you a restricted romance archive hosted on GitHub Pages,",
  "because texting you like a normal person would be far too merciful.",
  "",
  "I like you.",
  "Not in a casual, polite, socially acceptable way.",
  "In a 'I will build a tiny interactive web experience to prove a point' way.",
  "",
  "If you’re smiling right now, good.",
  "That means the trap is working.",
  "",
  "Open me again whenever you need a reminder that you matter to someone",
  "who is equal parts soft heart and sharp mind.",
  "",
  "Yours,",
  "Reina."
].join("\n");

// Typewriter
let typingTimer = null;

function typewriter(text, speed = 22){
  clearInterval(typingTimer);
  letterText.textContent = "";
  let i = 0;

  typingTimer = setInterval(() => {
    letterText.textContent += text[i] || "";
    i++;

    // stop
    if (i >= text.length){
      clearInterval(typingTimer);
      typingTimer = null;
    }
  }, speed);
}

function show(view){
  [gateView, envelopeView, letterView].forEach(v => v.classList.remove("is-active"));
  view.classList.add("is-active");
}

gateForm.addEventListener("submit", (e) => {
  e.preventDefault();
  gateError.textContent = "";

  const attempt = (passInput.value || "").trim().toLowerCase();

  // forgiving normalization
  const normalized = attempt.replace(/\s+/g, " ");
  if (normalized === PASS){
    show(envelopeView);
    passInput.value = "";
    setTimeout(() => openBtn.focus(), 100);
  } else {
    gateError.textContent = "Access denied. The archive rejects impostors.";
    passInput.select();
  }
});

// Audio: tiny pop using Web Audio API (no external files)
let audioCtx = null;
function popSound(){
  try{
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    const o = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    o.type = "sine";
    o.frequency.setValueAtTime(280, audioCtx.currentTime);
    o.frequency.exponentialRampToValueAtTime(720, audioCtx.currentTime + 0.06);

    g.gain.setValueAtTime(0.0001, audioCtx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.32, audioCtx.currentTime + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.10);

    o.connect(g);
    g.connect(audioCtx.destination);
    o.start();
    o.stop(audioCtx.currentTime + 0.12);
  } catch {
    // ignore
  }
}

// Confetti burst (canvas overlay)
function confettiBurst(x, y){
  const count = 120;
  for (let i = 0; i < count; i++){
    confetti.push({
      x, y,
      vx: (Math.random() - 0.5) * 9,
      vy: (Math.random() - 1.2) * 10,
      r: 2 + Math.random() * 3,
      rot: Math.random() * Math.PI * 2,
      vr: (Math.random() - 0.5) * 0.25,
      life: 120 + Math.random() * 40,
      alpha: 1
    });
  }
}

function openSequence(){
  openBtn.classList.add("is-opening");
  popSound();

  // burst from envelope center
  const rect = openBtn.getBoundingClientRect();
  confettiBurst(rect.left + rect.width/2, rect.top + rect.height/2);

  setTimeout(() => {
    show(letterView);

    // unfold
    note.classList.remove("note-folded");
    note.classList.remove("note-unfold");
    void note.offsetWidth; // reflow to restart animation
    note.classList.add("note-unfold");

    // typewriter
    typewriter(LETTER, 18);
  }, 750);
}

openBtn.addEventListener("click", openSequence);

closeBtn.addEventListener("click", () => {
  show(envelopeView);
  openBtn.classList.remove("is-opening");
});

replayBtn.addEventListener("click", () => {
  show(envelopeView);
  openBtn.classList.remove("is-opening");
  setTimeout(openSequence, 250);
});

// Background floating hearts + stars + confetti on one canvas
const canvas = document.getElementById("fx");
const ctx = canvas.getContext("2d");

function resize(){
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
const particles = [];
const confetti = [];
const STAR = "star";
const HEART = "heart";

function spawnParticle(){
  const type = Math.random() < 0.58 ? HEART : STAR;
  particles.push({
    type,
    x: rand(0, window.innerWidth),
    y: window.innerHeight + rand(10, 140),
    r: rand(6, 16),
    vy: rand(0.4, 1.3),
    vx: rand(-0.25, 0.25),
    rot: rand(0, Math.PI*2),
    vr: rand(-0.01, 0.01),
    alpha: rand(0.32, 0.85),
    wobble: rand(0, Math.PI*2),
    wobbleSpeed: rand(0.01, 0.03),
  });

  if (particles.length > 160) particles.shift();
}

function drawStar(x,y,r,rot,alpha){
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
  grad.addColorStop(0, `rgba(124,240,255,${alpha})`);
  grad.addColorStop(1, `rgba(255,59,122,${alpha})`);
  ctx.fillStyle = grad;
  ctx.fill();
  ctx.restore();
}

function drawHeart(x,y,r,rot,alpha){
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

  const grad = ctx.createRadialGradient(0, 10*s, r*0.1, 0, 10*s, r*1.2);
  grad.addColorStop(0, `rgba(255,255,255,${alpha})`);
  grad.addColorStop(1, `rgba(255,59,122,${alpha})`);
  ctx.fillStyle = grad;
  ctx.fill();
  ctx.restore();
}

let mouse = { x: window.innerWidth/2, y: window.innerHeight/2, active:false };
window.addEventListener("mousemove", (e)=>{
  mouse.x = e.clientX;
  mouse.y = e.clientY;
  mouse.active = true;
});
window.addEventListener("mouseleave", ()=> mouse.active = false);

function drawConfetti(){
  for (let i = confetti.length - 1; i >= 0; i--){
    const c = confetti[i];
    c.x += c.vx;
    c.y += c.vy;
    c.vy += 0.18;
    c.rot += c.vr;
    c.life -= 1;
    c.alpha = Math.max(0, c.life / 140);

    ctx.save();
    ctx.globalAlpha = c.alpha;
    ctx.translate(c.x, c.y);
    ctx.rotate(c.rot);

    // dynamic gradient, visible without hardcoding a single flat color
    const g = ctx.createLinearGradient(-6, -6, 6, 6);
    g.addColorStop(0, `rgba(124,240,255,${c.alpha})`);
    g.addColorStop(1, `rgba(255,59,122,${c.alpha})`);
    ctx.fillStyle = g;

    ctx.fillRect(-c.r*1.8, -c.r*0.8, c.r*3.2, c.r*1.6);
    ctx.restore();

    if (c.life <= 0 || c.y > window.innerHeight + 80) confetti.splice(i, 1);
  }
}

function tick(){
  ctx.clearRect(0,0,window.innerWidth, window.innerHeight);

  if (Math.random() < 0.60) spawnParticle();

  for (const p of particles){
    p.wobble += p.wobbleSpeed;
    const wob = Math.sin(p.wobble) * 0.6;

    // Slight mouse pull only when letter view is active
    if (mouse.active && letterView.classList.contains("is-active")){
      const dx = mouse.x - p.x;
      const dy = mouse.y - p.y;
      const dist = Math.max(40, Math.sqrt(dx*dx + dy*dy));
      const pull = 12 / dist;
      p.vx += (dx / dist) * pull * 0.02;
      p.vy += (dy / dist) * pull * 0.005;
    }

    p.x += p.vx + wob;
    p.y -= p.vy;
    p.rot += p.vr;

    if (p.x < -40) p.x = window.innerWidth + 40;
    if (p.x > window.innerWidth + 40) p.x = -40;

    if (p.y < -80) p.alpha *= 0.985;

    if (p.type === STAR) drawStar(p.x, p.y, p.r, p.rot, p.alpha);
    else drawHeart(p.x, p.y, p.r, p.rot, p.alpha);
  }

  drawConfetti();

  requestAnimationFrame(tick);
}
tick();
