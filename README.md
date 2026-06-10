# ⏱ Time Tracker — Chrome Extension + MERN Dashboard

A Chrome Extension that silently tracks time spent on every website and displays beautiful analytics on a React dashboard powered by a MERN backend.

---

## 🧠 How It Works

```
Chrome Extension          MongoDB           React Dashboard
(the spy 🕵️)    →→→→→   (the diary 📔)  →→→→→  (the report card 📊)

Silently watching        Stores everything    Shows charts, stats,
every tab you open       on your server       time per site, daily
                                              & weekly summaries
```

---

## 🏗️ Project Structure

```
time-tracker/
│
├── extension/                  # Chrome Extension (Manifest V3)
│   ├── manifest.json           # Extension config & permissions
│   ├── background.js           # Silent tab watcher & timer logic
│   ├── popup.html              # Popup UI when clicking extension icon
│   ├── popup.js                # Popup logic — reads from chrome.storage
│   └── icons/
│       └── icon48.png          # Extension icon
│
└── server/                     # MERN Backend (coming soon)
    ├── index.js                # Express app entry point
    ├── models/
    │   └── TimeLog.js          # Mongoose schema
    ├── routes/
    │   └── time.js             # API routes
    └── client/                 # React Dashboard (coming soon)
        └── src/
            ├── App.jsx
            └── components/
                └── Dashboard.jsx
```

---

## ✨ Features

### Chrome Extension (Built ✅)
- Tracks time spent on every website automatically
- Detects tab switches, URL changes, and Chrome focus/blur
- Stores data locally in `chrome.storage` (persists across browser restarts)
- Shows today's top sites with time in the popup
- Filters out internal Chrome pages (`chrome://`)
- Auto-syncs data to backend server every 5 minutes
- Manual sync button in the popup

### MERN Backend (Coming Soon 🔧)
- Express.js REST API to receive and store time logs
- MongoDB for persistent storage
- Daily and weekly aggregation endpoints

### React Dashboard (Coming Soon 🎨)
- Bar charts — top sites by time
- Calendar heatmap — most active days
- Daily / weekly / monthly breakdowns
- Built with Recharts

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Extension Logic | Vanilla JS (Manifest V3) |
| Extension UI | HTML + CSS |
| Backend | Node.js + Express.js |
| Database | MongoDB + Mongoose |
| Dashboard | React.js + Recharts |

---

## 🚀 Getting Started

### 1. Load the Extension into Chrome

```bash
# Clone the repo
git clone https://github.com/your-username/time-tracker.git
cd time-tracker
```

Then in Chrome:
1. Go to `chrome://extensions`
2. Toggle **Developer Mode** ON (top right)
3. Click **Load unpacked**
4. Select the `extension/` folder
5. Pin the extension from the puzzle icon in the toolbar

### 2. Start the Backend Server (Coming Soon)

```bash
cd server
npm install
npm run dev
```

Server runs on `http://localhost:5000`

### 3. Start the React Dashboard (Coming Soon)

```bash
cd server/client
npm install
npm run dev
```

Dashboard runs on `http://localhost:3000`

---

## 📦 Chrome Extension Permissions

| Permission | Reason |
|-----------|--------|
| `tabs` | Read active tab URL to detect which site you're on |
| `storage` | Save time data locally in the browser |
| `activeTab` | Access the currently active tab |
| `alarms` | Run background sync every 5 minutes |
| `windows` | Detect when Chrome loses/gains focus |
| `host_permissions` | Allow API calls to localhost backend |

---

## 🗃️ Data Structure

Time data is stored in `chrome.storage.local` in this format:

```json
{
  "timeData": {
    "6/10/2026": {
      "amazon.in": 142000,
      "youtube.com": 3600000,
      "github.com": 890000
    },
    "6/9/2026": {
      "netflix.com": 7200000,
      "flipkart.com": 540000
    }
  }
}
```

- Key → date string
- Value → object of `site: milliseconds`

---

## 🔌 API Endpoints (Coming Soon)

| Method | Route | Description |
|--------|-------|-------------|
| `POST` | `/api/log` | Save time log from extension |
| `GET` | `/api/summary` | Get all logs for dashboard |
| `GET` | `/api/summary/:date` | Get logs for a specific date |

---

## 🐛 Debugging the Extension

**Background script logs:**
1. Go to `chrome://extensions`
2. Find Time Tracker → click **Service Worker**
3. Check the Console tab for live tracking logs

**Popup logs:**
1. Click the extension icon to open popup
2. Right click inside popup → **Inspect**
3. Check Console tab

**Check stored data manually:**
Paste this in the Service Worker console:
```js
chrome.storage.local.get(["timeData"], (result) => {
  console.log(JSON.stringify(result, null, 2));
});
```

---

## 🗺️ Roadmap

- [x] Chrome Extension with tab tracking
- [x] Local storage with `chrome.storage`
- [x] Popup UI showing today's sites
- [x] Auto-sync alarm every 5 minutes
- [ ] Search engine blocklist
- [ ] Express + MongoDB backend
- [ ] REST API for data sync
- [ ] React dashboard with charts
- [ ] Daily/weekly email reports
- [ ] Multi-device support

---

## 👨‍💻 Author

**Umesh** — Final Year Engineering Student | Full Stack Developer  
[GitHub](https://github.com/u74-design) • [LinkedIn]([(https://www.linkedin.com/in/umeshjhurke/)])

---

## 📄 License

MIT License — feel free to use, modify, and distribute.
