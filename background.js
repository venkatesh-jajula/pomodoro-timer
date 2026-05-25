// Background Service Worker for Pomodoro Timer

const DEFAULT_MINUTES = 25;
const TIMER_KEY = 'timerState';

function defaultState() {
    return {
        isRunning: false,
        pomodoroTime: DEFAULT_MINUTES,
        totalTime: DEFAULT_MINUTES * 60,
        timeLeft: DEFAULT_MINUTES * 60,
        endTimestamp: null
    };
}

function getState(callback) {
    chrome.storage.local.get([TIMER_KEY], (result) => {
        callback(result[TIMER_KEY] || defaultState());
    });
}

function setState(state, callback) {
    const obj = {};
    obj[TIMER_KEY] = state;
    chrome.storage.local.set(obj, () => {
        if (callback) callback();
    });
}

function rescheduleAlarmIfNeeded(stateArg) {
    getState((state) => {
        const s = stateArg || state;
        if (s.isRunning && s.endTimestamp && s.endTimestamp > Date.now()) {
            chrome.alarms.clear('pomodoroEnd', () => {
                chrome.alarms.create('pomodoroEnd', { when: s.endTimestamp });
            });
        } else {
            chrome.alarms.clear('pomodoroEnd');
        }
    });
}

chrome.runtime.onInstalled.addListener(() => {
    getState((state) => {
        state.pomodoroTime = state.pomodoroTime || DEFAULT_MINUTES;
        state.totalTime = state.totalTime || state.pomodoroTime * 60;
        state.timeLeft = typeof state.timeLeft === 'number' ? state.timeLeft : state.totalTime;
        setState(state, () => {
            rescheduleAlarmIfNeeded(state);
        });
    });
});

chrome.runtime.onStartup.addListener(() => {
    rescheduleAlarmIfNeeded();
});

chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'pomodoroEnd') {
        getState((state) => {
            state.isRunning = false;
            state.timeLeft = 0;
            state.endTimestamp = null;
            setState(state, () => {
                sendNotification();
                chrome.runtime.sendMessage({ action: 'timerComplete', state }, () => {
                    if (chrome.runtime.lastError) {
                        // No receiver available (popup closed). Ignore.
                    }
                });
            });
        });
    }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getTimerState') {
        getState((state) => {
            const timeLeft = state.isRunning && state.endTimestamp
                ? Math.max(0, Math.ceil((state.endTimestamp - Date.now()) / 1000))
                : state.timeLeft;
            sendResponse({
                isRunning: state.isRunning,
                timeLeft,
                totalTime: state.totalTime,
                pomodoroTime: state.pomodoroTime,
                endTimestamp: state.endTimestamp
            });
        });
        return true;
    }

    if (request.action === 'startTimer') {
        getState((state) => {
            if (!state.isRunning) {
                let duration = request.duration ? Number(request.duration) : (state.timeLeft || state.pomodoroTime * 60);
                if (!duration || duration <= 0) duration = state.pomodoroTime * 60;
                const endTimestamp = Date.now() + duration * 1000;

                state.isRunning = true;
                state.endTimestamp = endTimestamp;
                state.timeLeft = duration;
                state.totalTime = state.pomodoroTime * 60;

                setState(state, () => {
                    chrome.alarms.clear('pomodoroEnd', () => {
                        chrome.alarms.create('pomodoroEnd', { when: endTimestamp });
                        chrome.runtime.sendMessage({ action: 'timerUpdated', state }, () => {
                            if (chrome.runtime.lastError) {
                                // No receiver available; popup likely closed.
                            }
                        });
                        sendResponse({ success: true });
                    });
                });
            } else {
                sendResponse({ success: false, message: 'already running' });
            }
        });
        return true;
    }

    if (request.action === 'stopTimer') {
        getState((state) => {
            if (state.isRunning && state.endTimestamp) {
                const remaining = Math.max(0, Math.ceil((state.endTimestamp - Date.now()) / 1000));
                state.isRunning = false;
                state.timeLeft = remaining;
                state.endTimestamp = null;

                setState(state, () => {
                    chrome.alarms.clear('pomodoroEnd');
                    chrome.runtime.sendMessage({ action: 'timerUpdated', state }, () => {
                        if (chrome.runtime.lastError) {
                            // ignore
                        }
                    });
                    sendResponse({ success: true });
                });
            } else {
                sendResponse({ success: true });
            }
        });
        return true;
    }

    if (request.action === 'resetTimer') {
        getState((state) => {
            state.isRunning = false;
            state.endTimestamp = null;
            state.timeLeft = state.pomodoroTime * 60;

            setState(state, () => {
                chrome.alarms.clear('pomodoroEnd');
                chrome.runtime.sendMessage({ action: 'timerUpdated', state }, () => {
                    if (chrome.runtime.lastError) {
                        // ignore
                    }
                });
                sendResponse({ success: true });
            });
        });
        return true;
    }

    if (request.action === 'updateSettings') {
        const newTime = parseInt(request.pomodoroTime) || DEFAULT_MINUTES;
        getState((state) => {
            state.pomodoroTime = newTime;
            state.totalTime = newTime * 60;
            state.timeLeft = newTime * 60;
            state.isRunning = false;
            state.endTimestamp = null;

            setState(state, () => {
                chrome.alarms.clear('pomodoroEnd');
                chrome.runtime.sendMessage({ action: 'timerUpdated', state }, () => {
                    if (chrome.runtime.lastError) {
                        // ignore
                    }
                });
                sendResponse({ success: true });
            });
        });
        return true;
    }
});

function sendNotification() {
    const notificationOptions = {
        type: 'basic',
        iconUrl: chrome.runtime.getURL('icon.png'),
        title: '⏱️ Pomodoro Timer Complete!',
        message: 'Great work! Time to take a break or start the next session.',
        priority: 2,
        requireInteraction: true
    };

    chrome.notifications.create('pomodoroComplete', notificationOptions, (notificationId) => {
        if (chrome.runtime.lastError) {
            console.error('Notification error:', chrome.runtime.lastError);
        } else {
            console.log('Notification created:', notificationId);
        }
    });
}

chrome.notifications.onClicked.addListener((notificationId) => {
    if (notificationId === 'pomodoroComplete') {
        chrome.runtime.openOptionsPage();
        chrome.notifications.clear(notificationId);
    }
});

