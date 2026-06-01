/**
 * Popup Script
 * Controls the popup UI
 */

// Load stats when popup opens
async function loadStats() {
  const stored = await chrome.storage.local.get('dailyStats');
  const stats = stored.dailyStats || {};

  document.getElementById('keyPresses').textContent = stats.keyboardPresses || 0;
  document.getElementById('tabsOpened').textContent = stats.tabsOpened || 0;

  // Update status
  const status = document.getElementById('status');
  if (stats.keyboardPresses > 0 || stats.tabsOpened > 0) {
    status.textContent = '✓ Tracking active';
    status.classList.add('active');
  } else {
    status.textContent = 'No activity today';
    status.classList.remove('active');
  }
}

// Dashboard button
document.getElementById('openDashboard').addEventListener('click', () => {
  chrome.tabs.create({
    url: 'http://localhost:3000/dashboard', // In production, use NEXT_PUBLIC_APP_URL
  });
});

// Reset button
document.getElementById('resetStats').addEventListener('click', async () => {
  if (confirm('Reset today\'s statistics?')) {
    await chrome.storage.local.set({
      dailyStats: {
        date: new Date().toISOString().split('T')[0],
        keyboardPresses: 0,
        tabsOpened: 0,
        currentTabId: null,
        tabDurations: {},
        sessionStart: Date.now(),
        lastActivityTime: Date.now(),
      },
    });
    loadStats();
  }
});

// Tracking toggle
document.getElementById('trackingToggle').addEventListener('change', async (e) => {
  const enabled = e.target.checked;
  await chrome.storage.local.set({ trackingEnabled: enabled });

  const status = document.getElementById('status');
  status.textContent = enabled ? '✓ Tracking enabled' : '⊘ Tracking disabled';
  status.classList.toggle('active', enabled);
});

// Load tracking status
async function loadTrackingStatus() {
  const stored = await chrome.storage.local.get('trackingEnabled');
  const enabled = stored.trackingEnabled !== false;
  document.getElementById('trackingToggle').checked = enabled;

  const status = document.getElementById('status');
  status.textContent = enabled ? '✓ Tracking enabled' : '⊘ Tracking disabled';
  status.classList.toggle('active', enabled);
}

// Initialize
loadStats();
loadTrackingStatus();

// Refresh stats every 5 seconds
setInterval(loadStats, 5000);
