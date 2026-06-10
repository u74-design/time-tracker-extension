// popup.js

// ─────────────────────────────────────────
// HELPER: Convert milliseconds to readable time
// 3661000ms → "1h 1m"
// ─────────────────────────────────────────
function formatTime(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes}m ${seconds}s`;
  return `${seconds}s`;
}

// ─────────────────────────────────────────
// MAIN: Load today's data and render it
// ─────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  // Show today's date in header
  const today = new Date().toLocaleDateString();
  document.getElementById("today-date").textContent = today;

  // Read from chrome.storage
  chrome.storage.local.get(["timeData"], (result) => {
    const data = result.timeData || {};
    const todayData = data[today] || {};

    const siteList = document.getElementById("site-list");

    // If no data yet, show empty message
    if (Object.keys(todayData).length === 0) {
      siteList.innerHTML = `<div class="empty">No data yet today.<br/>Browse something!</div>`;
      return;
    }

    // Sort sites by time spent (highest first)
    const sorted = Object.entries(todayData).sort((a, b) => b[1] - a[1]);

    // Find the max time (for the progress bar percentage)
    const maxTime = sorted[0][1];

    // Build HTML for each site row
    siteList.innerHTML = sorted.map(([site, ms]) => {
      const percent = Math.round((ms / maxTime) * 100);
      return `
        <div class="site-row">
          <span class="site-name">${site}</span>
          <div class="site-bar-wrap">
            <div class="site-bar" style="width: ${percent}%"></div>
          </div>
          <span class="site-time">${formatTime(ms)}</span>
        </div>
      `;
    }).join("");
  });

  // ─────────────────────────────────────────
  // Sync button — manually push data to server
  // ─────────────────────────────────────────
  document.getElementById("sync-btn").addEventListener("click", async () => {
    const statusEl = document.getElementById("sync-status");
    statusEl.textContent = "Syncing...";

    chrome.storage.local.get(["timeData"], async (result) => {
      const data = result.timeData || {};

      try {
        for (const [date, sites] of Object.entries(data)) {
          for (const [site, ms] of Object.entries(sites)) {
            await fetch("http://localhost:5000/api/log", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ date, site, ms })
            });
          }
        }
        statusEl.textContent = "✓ Synced successfully!";
      } catch (e) {
        statusEl.textContent = "✗ Server not reachable. Start your backend.";
      }
    });
  });
});