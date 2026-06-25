// --- 1. Clock & Date ---
function updateClock() {
  const now = new Date();
  document.getElementById('clock').textContent = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  document.getElementById('date').textContent = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
}
updateClock();
setInterval(updateClock, 1000);

// --- 1.5 Weather Glance (Added) ---
function getWeather() {
  const weatherEl = document.getElementById('weather');
  
  // Try to get the user's location for hyper-local weather
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async (pos) => {
      try {
        const { latitude, longitude } = pos.coords;
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
        );
        const data = await res.json();
        const temp = Math.round(data.current_weather.temperature);
        const code = data.current_weather.weathercode;
        
        // Map WMO codes to simple emojis
        const emojiMap = {
          0: '☀️', 1: '🌤️', 2: '⛅', 3: '☁️', 
          45: '🌫️', 48: '🌫️',
          51: '🌧️', 53: '🌧️', 55: '🌧️',
          61: '🌧️', 63: '🌧️', 65: '🌧️',
          71: '❄️', 73: '❄️', 75: '❄️',
          80: '🌦️', 81: '🌦️', 82: '⛈️'
        };
        const emoji = emojiMap[code] || '🌤️';
        weatherEl.textContent = `${emoji} ${temp}°C`;
      } catch (e) {
        weatherEl.textContent = '🌤️ --°C';
      }
    }, 
    // Fallback if user denies location (defaults to approximate based on timezone/IP won't work, so just show generic)
    () => {
      // Fallback to a generic "calm" state
      weatherEl.textContent = '🌤️ --°C';
    });
  } else {
    weatherEl.textContent = '🌤️ --°C';
  }
}
// Call it once on load
getWeather();
// Refresh weather every 10 minutes (600,000 ms) to keep it accurate
setInterval(getWeather, 600000);

// --- 2. POMODORO TIMER ---
const timerDisplay = document.getElementById('timer-display');
const timerRing = document.getElementById('timer-ring');
const startBtn = document.getElementById('timer-start');
const resetBtn = document.getElementById('timer-reset');

const CIRCUMFERENCE = 339.292; // 2 * PI * 54
let timerState = {
  totalSeconds: 25 * 60,    // 25 minutes
  remainingSeconds: 25 * 60,
  isRunning: false,
  intervalId: null,
  startTime: null,
  elapsedBeforePause: 0
};

function updateTimerUI() {
  const mins = Math.floor(timerState.remainingSeconds / 60);
  const secs = timerState.remainingSeconds % 60;
  timerDisplay.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  
  const progress = timerState.remainingSeconds / timerState.totalSeconds;
  const offset = CIRCUMFERENCE * (1 - progress);
  timerRing.style.strokeDashoffset = offset;
  
  // Color shifts as time runs out (warm -> orange -> red)
  if (progress > 0.5) {
    timerRing.style.stroke = '#ff8906'; // warm orange
  } else if (progress > 0.2) {
    timerRing.style.stroke = '#e53170'; // pink
  } else {
    timerRing.style.stroke = '#ff6b6b'; // soft red
  }
}

function tick() {
  if (!timerState.isRunning) return;
  
  const now = Date.now();
  const elapsed = (now - timerState.startTime) / 1000 + timerState.elapsedBeforePause;
  const newRemaining = Math.max(0, timerState.totalSeconds - elapsed);
  timerState.remainingSeconds = newRemaining;
  updateTimerUI();
  
  if (newRemaining <= 0) {
    // Timer finished
    timerState.isRunning = false;
    clearInterval(timerState.intervalId);
    startBtn.textContent = '▶ Start';
    startBtn.classList.remove('active');
    timerRing.style.stroke = '#ff8906';
    // Gentle visual pulse (optional)
    timerDisplay.style.transform = 'scale(1.1)';
    setTimeout(() => timerDisplay.style.transform = 'scale(1)', 300);
  }
}

function startTimer() {
  if (timerState.isRunning) {
    // Pause
    timerState.isRunning = false;
    clearInterval(timerState.intervalId);
    timerState.elapsedBeforePause = timerState.totalSeconds - timerState.remainingSeconds;
    startBtn.textContent = '▶ Resume';
    startBtn.classList.remove('active');
    return;
  }
  
  // Resume or fresh start
  if (timerState.remainingSeconds <= 0) {
    // Reset to full if finished
    timerState.remainingSeconds = timerState.totalSeconds;
    timerState.elapsedBeforePause = 0;
    updateTimerUI();
  }
  
  timerState.isRunning = true;
  timerState.startTime = Date.now();
  timerState.intervalId = setInterval(tick, 100);
  startBtn.textContent = '⏸ Pause';
  startBtn.classList.add('active');
}

function resetTimer() {
  timerState.isRunning = false;
  clearInterval(timerState.intervalId);
  timerState.remainingSeconds = timerState.totalSeconds;
  timerState.elapsedBeforePause = 0;
  startBtn.textContent = '▶ Start';
  startBtn.classList.remove('active');
  timerRing.style.stroke = '#ff8906';
  updateTimerUI();
}

startBtn.addEventListener('click', startTimer);
resetBtn.addEventListener('click', resetTimer);

// Initialize the ring on load
updateTimerUI();
// --- END POMODORO ---

// --- 3. REAL AMBIENT AUDIO (Web Audio API - Pink/Brown Noise Rain) ---
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
