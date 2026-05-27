# ⚡ HAVOC CoD4 Promod Live Screenshot (SS) Dashboard ⚡

This is a real-time web-based Screenshot Dashboard designed for Call of Duty 4 Promod Scrim Servers. It monitors the server's screenshots folder, dynamically extracts player information (GUIDs, date, time) from filename metadata, and serves them on a modern, ultra-responsive, glassmorphic dark-mode web panel. It features instant WebSocket live stream updates, an advanced lightbox viewer with cursor-following precision zoom to inspect screenshots for hacks (such as ESP or overlays), and instant search/filtering.

---

## ⚙️ Features
*   **Live Stream (WebSockets):** Automatically pushes new screenshots to the web gallery in real-time as soon as they are captured in-game—no page reload required!
*   **Precision Zoom Inspector:** Mouse hover over any screenshot inside the viewer dynamically scales and moves the transform-origin to follow your cursor, enabling deep pixel-by-pixel inspection for cheat detection.
*   **Realtime Activity Ticker:** A live sidebar displaying real-time events and logging incoming screenshot metadata.
*   **Instant Search & Filters:** Filter the entire screenshots gallery by Player GUID or filename on-the-fly.
*   **Auto-Fallback & Directories:** Automatically creates the screenshots directory upon startup if it does not already exist, ensuring seamless zero-configuration execution.

---

## 🚀 Setup & Execution Guide

### 1. Install Dependencies
Ensure you have [Node.js](https://nodejs.org/) installed, open your terminal (e.g. PowerShell or Bash) in this `ss_site` directory, and execute:
```bash
npm install
```

### 2. Configure Your Screenshots Directory
By default, the server is configured to monitor a folder named `screenshots` located in the parent directory (`../screenshots`). 
*   If your CoD4 server is hosted on the same server, this will work out-of-the-box.
*   If your screenshot folder is in a different location, open `server.js` and edit the `SCREENSHOTS_DIR` path (Line 20):
    ```javascript
    const SCREENSHOTS_DIR = 'C:/Path/To/Your/CoD4/main/screenshots';
    ```

### 3. Start the Web Server
Launch the server by running:
```bash
npm start
```

### 4. Access the Dashboard
Once started, open your web browser and navigate to:
```url
http://localhost:3000
```

---

## 🎮 How to Trigger Screenshot Capture In-Game
1. Log in to your server's Remote Console (RCON):
   ```gsc
   /rcon login your_rcon_password
   ```
2. Check player slot IDs:
   ```gsc
   /rcon status
   ```
3. Take a screenshot of the suspect player (e.g. slot ID `3`):
   ```gsc
   /rcon getss 3
   ```
4. Within 3-5 seconds, the screenshot will appear live on the dashboard with a **`NEW`** indicator badge and log to the live activity feed!

---

## 💻 Tech Stack
*   **Backend:** Node.js, Express, Socket.io, Chokidar (directory polling)
*   **Frontend:** HTML5, Vanilla CSS3 (Glassmorphism, Grid Layout, interactive Scale transitions), Vanilla Javascript, Socket.io-client
