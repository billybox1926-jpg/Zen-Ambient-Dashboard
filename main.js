// --- 1. Date ---
function updateDate() {
  const now = new Date();
  document.getElementById('date').textContent = now.toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric'
  });
}
updateDate();
setInterval(updateDate, 60_000);

// --- 2. Breathing (4-7-8 pattern) ---
const circle   = document.getElementById('breath-circle');
const breathText = document.getElementById('breath-text');
const breathHint = document.getElementById('breath-hint');

function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

async function breathLoop() {
  breathHint.textContent = '';
  for (;;) {
    circle.classList.remove('exhale');
    circle.classList.add('inhale');
    breathText.textContent = 'Inhale';
    await delay(4000);

    breathText.textContent = 'Hold';
    await delay(7000);

    circle.classList.remove('inhale');
    circle.classList.add('exhale');
    breathText.textContent = 'Exhale';
    await delay(8000);
  }
}

let breathStarted = false;
circle.addEventListener('click', () => {
  if (!breathStarted) { breathStarted = true; breathLoop(); }
});

// --- 3. Ambient Rain (procedural — no external URLs) ---
const toggleBtn = document.getElementById('ambient-toggle');
let audioCtx = null;
let rainGain = null;
let rainActive = false;

function buildRain(ctx) {
  // Pink-ish noise via filtering white noise
  const bufSize = 2 * ctx.sampleRate;
  const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;

  const src = ctx.createBufferSource();
  src.buffer = buf;
  src.loop = true;

  const lo = ctx.createBiquadFilter();
  lo.type = 'lowpass';
  lo.frequency.value = 1400;
  lo.Q.value = 0.5;

  const hi = ctx.createBiquadFilter();
  hi.type = 'highpass';
  hi.frequency.value = 280;
  hi.Q.value = 0.4;

  src.connect(lo);
  lo.connect(hi);
  return { src, out: hi };
}

async function toggleRain() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (audioCtx.state === 'suspended') await audioCtx.resume();

  if (rainActive) {
    rainGain.gain.setTargetAtTime(0, audioCtx.currentTime, 0.4);
    setTimeout(() => {
      rainGain.disconnect();
      rainGain = null;
      rainActive = false;
    }, 1200);
    toggleBtn.textContent = '🌿 Play Rain';
    toggleBtn.classList.remove('active');
  } else {
    const { src, out } = buildRain(audioCtx);
    rainGain = audioCtx.createGain();
    rainGain.gain.setValueAtTime(0, audioCtx.currentTime);
    rainGain.gain.setTargetAtTime(0.35, audioCtx.currentTime, 0.8);
    out.connect(rainGain);
    rainGain.connect(audioCtx.destination);
    src.start(0);
    rainActive = true;
    toggleBtn.textContent = '🔇 Mute Rain';
    toggleBtn.classList.add('active');
  }
}

toggleBtn.addEventListener('click', toggleRain);