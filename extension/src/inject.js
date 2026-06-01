/**
 * Inject Script
 * This script runs in the context of the web page to capture keyboard events
 * Communicates via window.postMessage to content script
 */

let keyPressCount = 0;
let lastNotificationTime = 0;
const NOTIFICATION_THROTTLE = 100; // Only notify every 100ms

document.addEventListener(
  'keydown',
  () => {
    const now = Date.now();

    // Throttle notifications to content script
    if (now - lastNotificationTime > NOTIFICATION_THROTTLE) {
      window.postMessage(
        {
          type: 'KEY_PRESS_EVENT',
          timestamp: now,
        },
        '*'
      );
      lastNotificationTime = now;
    }

    keyPressCount += 1;
  },
  true
);

// Report stats periodically
setInterval(() => {
  if (keyPressCount > 0) {
    chrome.runtime.sendMessage({
      type: 'PAGE_STATS',
      keyPressCount,
    });
    keyPressCount = 0;
  }
}, 30000); // Every 30 seconds
