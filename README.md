# ⏱️ Pomodoro Timer — Chrome Extension

> A lightweight, focus-boosting Pomodoro timer with task management and smart notifications.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Chrome Web Store](https://img.shields.io/badge/Chrome-Web%20Store-green.svg)](https://chrome.google.com/webstore)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-black.svg)](https://github.com/venkatesh-jajula/pomodoro-timer)

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| ⏰ **Customizable Timer** | Set duration from 1–60 minutes with quick presets (5, 15, 25, 45, 60 min) |
| 📝 **Task Management** | Add, view, and delete tasks directly in the popup |
| 🔔 **Smart Notifications** | Get desktop notifications when your session ends |
| ⚙️ **Persistent Settings** | Your preferences and task list sync across Chrome restarts |
| 🎯 **Focused Design** | Clean, minimal UI optimized for productivity |
| 🔒 **Privacy First** | All data stored locally—zero external tracking |

---

## 📦 What's Included

```
pomodoro-timer/
├── manifest.json          # Chrome extension manifest (MV3)
├── background.js          # Service worker with timer logic & alarms
├── popup/
│   ├── popup.html        # Timer controls & task UI
│   ├── popup.css         # Popup styling
│   └── popup.js          # Popup logic & storage sync
├── options/
│   ├── options.html      # Settings page
│   ├── options.css       # Options styling
│   └── options.js        # Settings logic
├── LICENSE               # MIT License
├── README.md             # This file
└── PRIVACY.md            # Privacy policy
```

---

## 🚀 Quick Install (Local Testing)

1. **Clone or download** this repository
2. Open `chrome://extensions/` in Chrome
3. Enable **"Developer mode"** (toggle in top right)
4. Click **"Load unpacked"**
5. Select the project folder (containing `manifest.json`)
6. Done! Click the extension icon in your toolbar to start

---

## 🎮 How to Use

1. **Open the popup** — Click the extension icon
2. **Set duration** — Click ⚙️ to customize (1–60 minutes)
3. **Manage tasks** — Add tasks to your session list
4. **Start timer** — Click **Start** button
5. **Close & continue** — Timer runs even when popup is closed
6. **Get notified** — Desktop notification when time's up

---

## ✅ Pre-Publish Checklist

- [ ] Test start/stop/reset with popup open and closed
- [ ] Verify notification delivery and click behavior
- [ ] Confirm settings persist after Chrome restart
- [ ] Check that tasks save/load correctly
- [ ] Review privacy policy and update contact info
- [ ] Prepare store screenshots and feature image

---

## 🌐 Chrome Web Store Publishing

**Coming soon!** To publish:

1. Create a [Chrome Developer Account](https://chrome.google.com/webstore/developer/dashboard)
2. Pay $5 one-time fee
3. Host privacy policy (use `PRIVACY.md` or `privacy_policy.html`)
4. Upload screenshots (1280x720 recommended)
5. Submit for review (~2–7 days)

---

## 📄 License & Privacy

- **License:** MIT — See [LICENSE](LICENSE)
- **Privacy:** See [PRIVACY.md](PRIVACY.md) — We store data locally only

---

## 🤝 Contributing

Found a bug or have a feature request? Open an issue or submit a pull request!

**Repository:** [venkatesh-jajula/pomodoro-timer](https://github.com/venkatesh-jajula/pomodoro-timer)

---

<div align="center">

**Made with ❤️ for productivity**

</div>
