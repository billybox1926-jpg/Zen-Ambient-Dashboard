updateDate();

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

// --- 3. REAL NATURE SOUND (Web Audio + audio file) ---
const ambientBtn = document.getElementById('ambient-toggle');
let audioCtx = null;
let source = null;
let gainNode = null;
let isPlaying = false;

// Replace this URL with your own nature sound MP3/OGG
const NATURE_SOUND_URL = 'https://www.soundjay.com/nature_c2026/sounds/rain-01.mp3';

async function loadNatureSound(url) {
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
  return await audioCtx.decodeAudioData(arrayBuffer);
}

async function toggleNature() {
  if (isPlaying) {
    // Fade out and stop
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);
    setTimeout(() => {
      if (source) {
        source.stop();
        source = null;
      }
      isPlaying = false;
      ambientBtn.textContent = '🌿 Play Rain';
      ambientBtn.classList.remove('active');
    }, 500);
    return;
  }

  // Start / resume
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }

  try {
    const buffer = await loadNatureSound(NATURE_SOUND_URL);
    source = audioCtx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;

    gainNode = audioCtx.createGain();
    gainNode.gain.value = 0.4;

    source.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    source.start(0);
    // Fade in
    gainNode.gain.exponentialRampToValueAtTime(0.4, audioCtx.currentTime + 1);

    isPlaying = true;
    ambientBtn.textContent = '🔇 Mute Rain';
    ambientBtn.classList.add('active');
  } catch (e) {
    ambientBtn.textContent = '⚠️ Audio unavailable';
    setTimeout(() => {
      ambientBtn.textContent = '🌿 Play Rain';
    }, 2000);
  }
}

ambientBtn.addEventListener('click', toggleNature);
