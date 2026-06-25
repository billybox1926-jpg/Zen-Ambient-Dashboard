# 🍃 Zen Ambient Dashboard

> *A serene, browser-based sanctuary designed to bring a moment of calm to your day. Pull it up, breathe, and reset.*

![Zen Ambient Dashboard](./screenshot.png)
*A minimal breathing sanctuary — date, breathing circle, and ambient rain toggle.*

## 🧘 The Vibe

This isn't just another new tab page. It's a digital pause button. Built with a minimalist aesthetic, the Zen Ambient Dashboard combines soft visuals, subtle ambient soundscapes, and essential mindfulness tools to help you refocus, meditate, or simply exist without digital noise.

Whether you need a 5-minute breathing break between meetings or a beautiful background while you work, this dashboard is your quiet corner of the internet.

## ✨ Core Features

- 🌌 **Dynamic Gradient Background** – A slow-shifting cosmic gradient that breathes with the breathing cycle.
- 🌬️ **4-7-8 Breathing Guide** – Click the circle to begin a guided breathing session (inhale→hold→exhale).
- 🔊 **Ambient Rain Toggle** – Procedural rain sound synthesized with the Web Audio API, plays on click with smooth fade in/out.
- 🕰️ **Minimalist Date Display** – A clean, typographic display of the current date.

## 🛠️ Tech Stack

- **Frontend:** Vanilla HTML5, CSS3, & JavaScript (ES6+)
- **Build:** Vite (fast HMR, optimized production builds)
- **Audio:** Web Audio API (procedural brown-noise rain generator)
- **Deployment:** Netlify (drag-and-drop or continuous deployment)

## 🚀 Getting Started

Follow these steps to get your own instance of the Zen Dashboard running locally.

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- Node.js (v16 or later) and npm installed (for Vite)

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/billybox1926-jpg/Zen-Ambient-Dashboard.git
    cd Zen-Ambient-Dashboard
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Run the development server**
    ```bash
    npm run dev
    ```

4.  Open `http://localhost:5173` and enjoy the tranquility.

## ⚙️ Configuration

To customize the dashboard to your liking:

| Setting | How to change |
| :--- | :--- |
| **Gradient Colors** | Edit the `linear-gradient` values in `style.css` (under `body`). |
| **Breathing Durations** | Adjust `delay(4000)`, `delay(7000)`, `delay(8000)` in `main.js`. |
| **Rain Volume** | Change `setTargetAtTime(0.35, ...)` to your preferred level (0-1). |

## 💡 Customization Ideas

Feel free to fork this and make it your own! Here are a few ways to expand it:

- **Add Forest/Ocean Sounds** – Swap the procedural rain for different nature samples.
- **Chakra / Color Breathing** – Sync the background color shift with the breathing state.
- **Offline Mode** – Cache the styles and script so it works without internet.
- **Custom Gradient Presets** – Offer multiple ambient color schemes.

## 🤝 Contributing

This is a personal passion project, but I'm open to suggestions and collaborations that align with the "zen" philosophy!

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingIdea`)
3.  Commit your Changes (`git commit -m 'Add some AmazingIdea'`)
4.  Push to the Branch (`git push origin feature/AmazingIdea`)
5.  Open a Pull Request

*Please keep all contributions simple, elegant, and clutter-free.*

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

**Made with ☕ and quiet intention.**

*If this dashboard helps you find a moment of peace, I'd love to hear about it. ⭐ Star the repo if you like the direction!*
