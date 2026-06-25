// 1. Clock
function updateClock() {
  const now = new Date();
  document.getElementById('clock').textContent = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  document.getElementById('date').textContent = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
}
updateClock();
setInterval(updateClock, 1000);

// 2. Breathing Circle (4-7-8 method)
const circle = document.getElementById('breath-circle');
const breathText = document.getElementById('breath-text');

async function startBreathing() {
  while (true) {
    // Inhale (4s)
    circle.classList.remove('exhale');
    circle.classList.add('inhale');
    breathText.textContent = 'Inhale';
    await sleep(4000);
    
    // Hold (7s) - optional visual hold
    breathText.textContent = 'Hold';
    await sleep(7000);
    
    // Exhale (8s)
    circle.classList.remove('inhale');
    circle.classList.add('exhale');
    breathText.textContent = 'Exhale';
    await sleep(8000);
  }
}
function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

// Start the breathing loop (uncomment to enable auto-cycle)
// startBreathing();

// Toggle breathing manually on click (to keep it user-initiated)
let isBreathing = false;
circle.addEventListener('click', () => {
  if (!isBreathing) {
    isBreathing = true;
    startBreathing();
  }
});

// 3. Ambient Toggle (Placeholder)
const ambientBtn = document.getElementById('ambient-toggle');
let isPlaying = false;
ambientBtn.addEventListener('click', () => {
  isPlaying = !isPlaying;
  ambientBtn.textContent = isPlaying ? '🔇 Mute Rain' : '🌧️ Play Rain';
  // TODO: Connect to Web Audio API or Howler.js later
});

// 4. Quote Rotator
const quotes = [
  '"Peace comes from within."',
  '"The present moment is all you have."',
  '"Let go or be dragged."',
  '"Wherever you are, be there."'
];
setInterval(() => {
  const random = quotes[Math.floor(Math.random() * quotes.length)];
  document.getElementById('quote').textContent = random;
}, 8000);
