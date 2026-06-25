// --- 1. Date ---
function updateDate() {
  const now = new Date();
  document.getElementById('date').textContent = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
}
updateDate();

// --- 1.5 Weather Glance ---
function getWeather() {
  const weatherEl = document.getElementById('weather');
  
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
    }, () => {
      weatherEl.textContent = '🌤️ --°C';
    });
  } else {
    weatherEl.textContent = '🌤️ --°C';
  }
}
getWeather();
setInterval(getWeather, 600000);

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

// --- 3. Meditation Timer ---
const timerDisplay = document.getElementById('timer-display');
const timerRing = document.getElementById('timer-ring');
const startBtn = document.getElementById('timer-start');
const resetBtn = document.getElementById('timer-reset');

const CIRCUMFERENCE = 339.292;
let timerState = {
  totalSeconds: 25 * 60,
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
}

function tick() {
  if (!timerState.isRunning) return;
  
  const now = Date.now();
  const elapsed = (now - timerState.startTime) / 1000 + timerState.elapsedBeforePause;
  const newRemaining = Math.max(0, timerState.totalSeconds - elapsed);
  timerState.remainingSeconds = newRemaining;
  updateTimerUI();
  
  if (newRemaining <= 0) {
    timerState.isRunning = false;
    clearInterval(timerState.intervalId);
    startBtn.textContent = '▶ Start';
    startBtn.classList.remove('active');
    timerRing.style.strokeDashoffset = CIRCUMFERENCE;
  }
}

function startTimer() {
  if (timerState.isRunning) {
    timerState.isRunning = false;
    clearInterval(timerState.intervalId);
    timerState.elapsedBeforePause = timerState.totalSeconds - timerState.remainingSeconds;
    startBtn.textContent = '▶ Resume';
    startBtn.classList.remove('active');
    return;
  }
  
  if (timerState.remainingSeconds <= 0) {
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
  timerRing.style.strokeDashoffset = 0;
  updateTimerUI();
}

startBtn.addEventListener('click', startTimer);
resetBtn.addEventListener('click', resetTimer);
updateTimerUI();
