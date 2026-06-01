/**
 * Background Service Worker
 * Tracks tab activity and keyboard events
 */

interface DailyStats {
  date: string;
  keyboardPresses: number;
  tabsOpened: number;
  currentTabId: number | null;
  tabDurations: Record<number, number>;
  sessionStart: number;
  lastActivityTime: number;
}

// Initialize tracking data
async function initializeDailyStats(): Promise<DailyStats> {
  const today = new Date().toISOString().split('T')[0];
  const stored = await chrome.storage.local.get('dailyStats');
  
  if (stored.dailyStats && stored.dailyStats.date === today) {
    return stored.dailyStats;
  }

  const newStats: DailyStats = {
    date: today,
    keyboardPresses: 0,
    tabsOpened: 0,
    currentTabId: null,
    tabDurations: {},
    sessionStart: Date.now(),
    lastActivityTime: Date.now(),
  };

  await chrome.storage.local.set({ dailyStats: newStats });
  return newStats;
}

// Get or initialize stats
async function getDailyStats(): Promise<DailyStats> {
  const stored = await chrome.storage.local.get('dailyStats');
  if (!stored.dailyStats) {
    return initializeDailyStats();
  }
  return stored.dailyStats;
}

// Save stats
async function saveDailyStats(stats: DailyStats): Promise<void> {
  await chrome.storage.local.set({ dailyStats: stats });
}

// Listen for messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'KEY_PRESS') {
    getDailyStats().then((stats) => {
      stats.keyboardPresses += 1;
      stats.lastActivityTime = Date.now();
      saveDailyStats(stats);
      sendResponse({ success: true });
    });
    return true; // async response
  }
});

// Track tab switches
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  const stats = await getDailyStats();
  stats.currentTabId = activeInfo.tabId;
  stats.lastActivityTime = Date.now();
  await saveDailyStats(stats);
});

// Track tab creation
chrome.tabs.onCreated.addListener(async (tab) => {
  const stats = await getDailyStats();
  stats.tabsOpened += 1;
  stats.lastActivityTime = Date.now();
  await saveDailyStats(stats);
});

// Initialize on install
chrome.runtime.onInstalled.addListener(() => {
  console.log('Life in Numbers extension installed');
  initializeDailyStats();
});

// Sync stats to backend
async function syncStatsToBackend(stats: DailyStats): Promise<boolean> {
  try {
    const response = await fetch('http://localhost:3000/api/extension/sync', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        date: stats.date,
        keyboardPresses: stats.keyboardPresses,
        tabsOpened: stats.tabsOpened,
        browsingTimeMinutes: Math.round(
          (stats.lastActivityTime - stats.sessionStart) / 60000
        ),
        sessionDurationMinutes: Math.round(
          (stats.lastActivityTime - stats.sessionStart) / 60000
        ),
      }),
    });

    if (response.ok) {
      const result = await response.json();
      console.log('[Extension] Stats synced:', result);
      await chrome.storage.local.set({ lastSync: Date.now() });
      return true;
    }
  } catch (error) {
    console.log('[Extension] Offline - queue sync retry:', error);
  }
  return false;
}

// Reset stats at midnight and sync to backend
function scheduleReset(): void {
  const now = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  const timeUntilMidnight = tomorrow.getTime() - now.getTime();

  setTimeout(async () => {
    // Sync current day's stats before reset
    const stats = await getDailyStats();
    await syncStatsToBackend(stats);

    // Reset for new day
    await initializeDailyStats();
    scheduleReset();
  }, timeUntilMidnight);
}

scheduleReset();
