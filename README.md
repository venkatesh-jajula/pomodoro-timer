Pomodoro Timer — Chrome Extension

Overview

A lightweight Pomodoro timer extension with task management, configurable session duration, and desktop notifications.

What's included

- `manifest.json` — extension manifest (MV3)
- `background.js` — service worker using `chrome.alarms` and persisted timer state
- `popup/` — UI for timer and tasks (`popup.html`, `popup.css`, `popup.js`)
- `options/` — settings page (`options.html`, `options.css`, `options.js`)

Quick install (local testing)

1. Open `chrome://extensions/` in Chrome.
2. Enable "Developer mode".
3. Click "Load unpacked" and select this project folder (the folder that contains `manifest.json`).

Recommended pre-publish checks

- Test start / stop / reset with the popup open and closed.
- Test notification delivery and click behavior.
- Test settings persistence and that changes reset running timers as expected.
- Check that tasks are saved and loaded correctly across Chrome restarts.

Publishing checklist (Chrome Web Store)

- Remove any unnecessary permissions (manifest already minimizes host access).
- Provide store assets: feature image, screenshots showing the popup and options page.
- Prepare a privacy policy URL (a simple `PRIVACY.md` is included for local reference — host it on your website or GitHub Pages for the store listing).
- Fill in support contact info and accurate extension description in the developer dashboard.

GitHub

- Commit the project files and push to a repository.
- Add the `README.md` and `PRIVACY.md` to the repo root.
- Optionally add a small `CHANGELOG.md` and `LICENSE`.

Notes & Known improvements

- Icons: currently using `icon.png`. Consider adding separate sized icons (16/48/128) for better store presentation.
- Badge/shortcuts and break cycles are not implemented — listed in TODO.

If you want, I can:
- Add a published-ready `privacy_policy.html` and instructions to host it (GitHub Pages).
- Implement badges and keyboard shortcuts.
- Generate placeholder screenshots and a small release pipeline.
