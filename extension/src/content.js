/**
 * Content Script
 * Injects keyboard tracking into web pages
 */

// Inject tracking script
const script = document.createElement('script');
script.src = chrome.runtime.getURL('src/inject.js');
script.onload = function() {
  this.remove();
};
(document.head || document.documentElement).appendChild(script);

// Listen for keyboard events from injected script
window.addEventListener('message', (event) => {
  if (event.source !== window) return;

  if (event.data.type && event.data.type === 'KEY_PRESS_EVENT') {
    // Send to background script
    chrome.runtime.sendMessage(
      {
        type: 'KEY_PRESS',
      },
      (response) => {
        // Handle response
        if (response?.success) {
          // Optionally, notify visual feedback
        }
      }
    );
  }
});
