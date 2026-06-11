// background.js

// ─────────────────────────────────────────
// HELPER: Get today's date as string
// ─────────────────────────────────────────
function getToday() {
  return new Date().toLocaleDateString();
}

// ─────────────────────────────────────────
// HELPER: Extract clean hostname from URL
// ─────────────────────────────────────────
function getHostname(url) {
  try {
    if (!url || url.startsWith("chrome://") || url.startsWith("chrome-extension://")) {
      return null;
    }
    const hostname = new URL(url).hostname;
    return hostname.replace("www.", "");
  } catch (e) {
    return null;
  }
}

// ─────────────────────────────────────────
// CORE: Save time for a site
// ─────────────────────────────────────────
function saveTime(site, ms) {
  if (!site || ms <= 0) return;

  chrome.storage.local.get(["timeData"], (result) => {
    const data = result.timeData || {};
    const today = getToday();

    if (!data[today]) data[today] = {};
    if (!data[today][site]) data[today][site] = 0;

    data[today][site] += ms;

    chrome.storage.local.set({ timeData: data }, () => {
      console.log(`✅ Saved ${Math.round(ms/1000)}s for ${site}`);
    });
  });
}

// ─────────────────────────────────────────
// CORE: Start tracking a new site
// Store session start in chrome.storage
// (not in memory — memory resets on SW restart)
// ─────────────────────────────────────────
function startTracking(url) {
  const site = getHostname(url);

  if (!site) {
    // Not a real website, clear session
    chrome.storage.local.remove("currentSession");
    return;
  }

  const session = {
    site: site,
    startTime: Date.now()
  };

  chrome.storage.local.set({ currentSession: session }, () => {
    console.log(`▶ Started tracking: ${site}`);
  });
}

// ─────────────────────────────────────────
// CORE: Stop tracking current site
// Calculate time and save it
// ─────────────────────────────────────────
function stopTracking() {
  chrome.storage.local.get(["currentSession"], (result) => {
    const session = result.currentSession;

    if (!session) return;

    const ms = Date.now() - session.startTime;
    console.log(`⏹ Stopping: ${session.site} — ${Math.round(ms/1000)}s`);

    saveTime(session.site, ms);
    chrome.storage.local.remove("currentSession");
  });
}

// ─────────────────────────────────────────
// LISTENER 1: User switches tab
// ─────────────────────────────────────────
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  console.log("🔁 Tab switched");

  // First stop tracking whatever was open before
  stopTracking();

  // Small delay to let stopTracking finish writing
  setTimeout(async () => {
    try {
      const tab = await chrome.tabs.get(activeInfo.tabId);
      startTracking(tab.url);
    } catch (e) {
      console.log("Could not get tab info", e);
    }
  }, 100);
});

// ─────────────────────────────────────────
// LISTENER 2: URL changes in same tab
// ─────────────────────────────────────────
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.active) {
    console.log("🔄 Tab updated:", tab.url);
    stopTracking();

    setTimeout(() => {
      startTracking(tab.url);
    }, 100);
  }
});

// ─────────────────────────────────────────
// LISTENER 3: Tab closed
// ─────────────────────────────────────────
chrome.tabs.onRemoved.addListener(() => {
  console.log("❌ Tab closed");
  stopTracking();
});

// ─────────────────────────────────────────
// LISTENER 4: Window focus changed
// (user switches between Chrome windows
//  or minimizes Chrome)
// ─────────────────────────────────────────
chrome.windows.onFocusChanged.addListener(async (windowId) => {
  if (windowId === chrome.windows.WINDOW_ID_NONE) {
    // Chrome lost focus (user switched to VS Code etc.)
    console.log("😴 Chrome lost focus");
    stopTracking();
  } else {
    // Chrome gained focus — find active tab
    console.log("👀 Chrome gained focus");
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tab) startTracking(tab.url);
    } catch (e) {
      console.log("Could not get active tab", e);
    }
  }
});

// ─────────────────────────────────────────
// ALARM: Sync to server every 5 mins
// ─────────────────────────────────────────
chrome.alarms.create("syncToServer", { periodInMinutes: 5 });

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "syncToServer") {
    syncToServer();
  }
});

async function syncToServer() {
  chrome.storage.local.get(["timeData"], async (result) => {
    const data = result.timeData || {};

    for (const [date, sites] of Object.entries(data)) {
      for (const [site, ms] of Object.entries(sites)) {
        try {
          await fetch("http://localhost:5000/api/log", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ date, site, ms })
          });
        } catch (e) {
          console.log("Server not reachable, will retry");
        }
      }
    }
  });
}