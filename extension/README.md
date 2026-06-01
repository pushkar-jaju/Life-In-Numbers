# Life in Numbers - Chrome Extension

This directory contains the Chrome Extension Manifest V3 for Life in Numbers.

## Structure

- `manifest.json` - Extension configuration
- `popup.html` - Extension popup UI
- `popup.js` - Popup controls and stats display
- `src/background.js` - Background service worker (tracks tabs, aggregates stats)
- `src/content.js` - Content script (injects tracking on web pages)
- `src/inject.js` - Web page script context (captures keyboard events)

## How It Works

### Keyboard Tracking Flow
1. `inject.js` runs in the web page context and captures keydown events
2. It throttles events and sends to `content.js` via postMessage
3. `content.js` forwards to `background.js` via runtime.sendMessage
4. `background.js` increments `dailyStats.keyboardPresses`

### Tab Tracking Flow
1. `background.js` listens to `chrome.tabs` events:
   - `onCreated` - increment `tabsOpened`
   - `onActivated` - track current tab
2. Stats are stored in `chrome.storage.local`

### Data Persistence
- Stats stored in `chrome.storage.local.dailyStats`
- Resets daily at midnight via `scheduleReset()`
- Structure:
```json
{
  "date": "2026-05-26",
  "keyboardPresses": 1234,
  "tabsOpened": 42,
  "currentTabId": 123,
  "tabDurations": {},
  "sessionStart": 1715123400000,
  "lastActivityTime": 1715123456000
}
```

## Loading the Extension

### Development
1. Build the extension (currently uses vanilla JS)
2. Open `chrome://extensions`
3. Enable "Developer mode" (top right)
4. Click "Load unpacked"
5. Select the `extension/` directory

### Production
1. Compress the `extension/` folder to `.zip`
2. Submit to Chrome Web Store

## Permissions

- `storage` - Access to browser storage for stats
- `tabs` - Monitor tab creation and activation
- `activeTab` - Know current active tab
- `scripting` - Inject tracking code

## Privacy & Security

- All data is stored locally on user's device
- No data sent to server until user manually syncs
- Users can disable tracking via popup toggle
- Background script runs only when extension is active

## Next Steps (MVP Extensions)

- [ ] Sync stats to backend API
- [ ] Add exclusion rules for sensitive sites
- [ ] Privacy mode (pause tracking)
- [ ] More accurate session duration tracking
- [ ] Tab duration tracking
- [ ] Screen time estimation

## Testing

1. Install extension
2. Open popup - should show 0 stats
3. Open and use web pages
4. Check popup - should show collected stats
5. Reload extension - stats should persist
6. Refresh at midnight - stats should reset
