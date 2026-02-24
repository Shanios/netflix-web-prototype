
# 🎬 Netflix Prototype – Advanced Streaming Platform

A feature-rich Netflix-inspired streaming web application built using **React, Tailwind CSS, and modern video APIs**.

This project demonstrates advanced UI/UX patterns, custom video playback controls, state management using Context API, and simulated OTT streaming behavior.

---



---

## 🛠️ Technology Stack

### Frontend

* **React 18** (Vite)
* **Tailwind CSS**
* **JavaScript (ES6+)**

### State Management

* React **Context API**
### Video & Media

* HTML5 Video API
* Local MP4 streaming simulation

### Storage

* `localStorage` for persistent watch history

---

## 📁 Project Structure

```
netflix-prototype/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── HeroBanner.jsx
│   │   ├── MovieGrid.jsx
│   │   ├── MovieCard.jsx
│   │   ├── VideoPlayer.jsx
│   │   ├── ContinueWatchingSection.jsx
│   │   └── MyList.jsx
│   │
│   ├── context/
│   │   ├── PlayerContext.jsx
│   │   ├── SearchContext.jsx
│   │   └── WatchHistoryContext.jsx
│   │
│   ├── assets/
│   │   └── movies.js
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── public/
│   ├── posters/
│   └── trailers/
```

---

## ✨ Core Features

### 🎥 Hero Banner (Auto-Rotating)

* Auto-rotates featured movies every 5 seconds
* Hover-triggered trailer playback
* Rotation pauses on interaction
* Netflix-themed gradient background

---

### 🎬 Interactive Movie Cards

* 1.5x zoom lens effect following cursor
* Certificate, genre, and year display
* Auto-playing hover trailer
* Red glow border and elevation effects
* Click-to-play fullscreen experience

---

### 🖼️ Advanced PIP Preview (Hover Mode)

* Centered floating preview window
* Auto-play trailer on hover
* Movie info overlay (certificate, genre, year)
* Download button
* Expandable description
* Custom video controls
* Controls auto-hide after 2 seconds
* Reappear on mouse movement

---

### 🖥️ Full-Screen Video Player

#### Custom Controls

* Play / Pause
* Volume control (3-state icon)
* Progress bar with scrubbing
* Playback speed (0.5x – 2x)
* Time display (current / total)
* Fullscreen toggle
* Picture-in-Picture support

#### Smart Behavior

* Auto-play on load
* ESC to exit
* Spacebar play/pause
* Double-click toggle
* Auto-return to home when video ends
* Back arrow navigation

#### Control Visibility Logic

* Show on mouse movement
* controls will be auto hidden after 2 seconds inactivity
* Smooth fade animations

---

### 🔎 Smart Search & Filtering

* Real-time movie search
* Category dropdown filtering
* Combined search + category logic
* Dynamic result counter
* No-results feedback message

---

### 📺 Continue Watching System

* Automatically tracks watch progress (5%–95%)
* Saves progress in `localStorage`
* Displays progress bar on cards
* Sorted by most recently watched
* Resume playback from last position

---

### 📊 Movie Data System

Includes 9 pre-configured movies with:

* Title & year
* Genre & certificate
* Detailed synopsis
* Cast & director
* Ratings
* Poster (WebP)
* Local MP4 trailer

---

## 🎨 UI & UX Enhancements

* Netflix-inspired dark red gradient theme
* GPU-accelerated animations
* Hover scaling & glow effects
* Smooth opacity transitions (300–500ms)
* Responsive grid layout (2–5 columns)
* Mobile & desktop optimized
* Touch-friendly interactions

---

## 🧠 State Management Architecture

Uses Context API for:

* Active movie playback state
* Search query management
* Watch history tracking
* Global interaction state

Prevents prop drilling and keeps architecture modular.

---

## 🚀 Getting Started

### 1️⃣ Clone Repository

```bash
git clone https://github.com/yourusername/netflix-prototype.git
cd netflix-prototype
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Run Development Server

```bash
npm run dev
```

Open:

```
http://localhost:5173
```

### 4️⃣ Build for Production

```bash
npm run build
npm run preview
```

---

## 📌 Implementation Highlights

* Custom HTML5 video player
* Auto-hide control system (2-second rule)
* PIP preview engine
* Context-driven state updates
* Persistent watch tracking
* Local video stream simulation
* Modular component-based architecture

---

## 📱 Responsive Breakpoints

* `sm` – 640px
* `md` – 768px
* `lg` – 1024px
* `xl` – 1280px

Optimized for both desktop and mobile devices.

---

## 🔮 Future Enhancements

* Backend API integration
* Authentication & user profiles
* Personalized recommendations
* Subtitle support
* Multi-language support
* Watchlist persistence

---

## 👨‍💻 Author

Shan
GitHub: [https://github.com/Shanios](https://github.com/Shanios)

---

## 📚 Resources

* React Documentation
* Tailwind CSS Documentation
* MDN HTML5 Video API

---

## ⚡ Final Notes

This project demonstrates:

* Advanced frontend architecture
* Video streaming simulation
* Interactive UI/UX patterns
* State management at scale
* Real-world OTT platform behavior replication

Built to simulate production-level streaming experience using modern React patterns.

```

