// --- 1. Clock & Date ---
function updateClock() {
  const now = new Date();
  document.getElementById('clock').textContent = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  document.getElementById('date').textContent = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
}
updateClock();
setInterval(updateClock, 1000);

// --- 2. Breathing Circle (4-7-8 method) ---
const circle = document.getElementById('breath-circle');
const breathText = document.getElementById('breath-text');

function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

async function startBreathing() {
  while (true) {
    circle.classList.remove('exhale');
    circle.classList.add('inhale');
    breathText.textContent = 'Inhale';
    await sleep(4000);
    
    breathText.textContent = 'Hold';
    await sleep(7000);
    
    circle.classList.remove('inhale');
    circle.classList.add('exhale');
    breathText.textContent = 'Exhale';
    await sleep(8000);
  }
}

let isBreathing = false;
circle.addEventListener('click', () => {
  if (!isBreathing) {
    isBreathing = true;
    startBreathing();
  }
});

// --- 3. REAL AMBIENT AUDIO (Web Audio API - Pink/Brown Noise Rain) ---
const ambientBtn = document.getElementById('ambient-toggle');
let audioCtx = null;
let noiseNode = null;
let gainNode = null;
let isPlaying = false;

function createRainSound() {
  // Create Audio Context (must be resumed on user gesture)
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  
  // Buffer size for the noise
  const bufferSize = 2 * audioCtx.sampleRate;
  const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);
  
  // Generate Pink-ish noise (1/f spectrum) - smoother than white noise
  let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
  for (let i = 0; i < bufferSize; i++) {
    const white = Math.random() * 2 - 1;
    b0 = 0.99886 * b0 + white * 0.0555179;
    b1 = 0.99332 * b1 + white * 0.0750759;
    b2 = 0.96900 * b2 + white * 0.1538520;
    b3 = 0.86650 * b3 + white * 0.3104856;
    b4 = 0.55000 * b4 + white * 0.5329522;
    b5 = -0.7616 * b5 - white * 0.0168980;
    data[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
    data[i] *= 0.11; // Reduce gain to avoid clipping
    b6 = white * 0.115926;
  }

  noiseNode = audioCtx.createBufferSource();
  noiseNode.buffer = buffer;
  noiseNode.loop = true;

  // Gain node to control volume (and fade in/out)
  gainNode = audioCtx.createGain();
  gainNode.gain.value = 0.4; // Comfortable rain volume

  // Add a low-pass filter to make it sound more like rain (muffled)
  const filter = audioCtx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 2000; // Cuts harsh high frequencies

  // Connect: noise -> filter -> gain -> destination
  noiseNode.connect(filter);
  filter.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  return { source: noiseNode, gain: gainNode };
}

function toggleAmbient() {
  if (!audioCtx) {
    // Initialize on first click
    createRainSound();
    audioCtx.resume();
    noiseNode.start(0);
    isPlaying = true;
    ambientBtn.textContent = '🔇 Mute Rain';
    ambientBtn.classList.add('active');
    return;
  }

  if (isPlaying) {
    // Fade out smoothly
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);
    setTimeout(() => {
      if (noiseNode) noiseNode.stop();
      isPlaying = false;
      ambientBtn.textContent = '🌧️ Play Rain';
      ambientBtn.classList.remove('active');
    }, 500);
  } else {
    // Recreate and fade in
    if (audioCtx.state === 'suspended') audioCtx.resume();
    createRainSound();
    gainNode.gain.value = 0;
    noiseNode.start(0);
    gainNode.gain.exponentialRampToValueAtTime(0.4, audioCtx.currentTime + 1);
    isPlaying = true;
    ambientBtn.textContent = '🔇 Mute Rain';
    ambientBtn.classList.add('active');
  }
}

ambientBtn.addEventListener('click', toggleAmbient);

// --- 4. Quote Rotator (Fade effect) ---
const quoteEl = document.getElementById('quote');
const quotes = [
  '"Peace comes from within."',
  '"The present moment is all you have."',
  '"Let go or be dragged."',
  '"Wherever you are, be there."',
  '"In the middle of movement, find stillness."'
];

setInterval(() => {
  quoteEl.style.opacity = '0';
  setTimeout(() => {
    const random = quotes[Math.floor(Math.random() * quotes.length)];
    quoteEl.textContent = random;
    quoteEl.style.opacity = '0.8';
  }, 300);
}, 10000);
