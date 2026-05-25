// DOM Elements
const timerDisplay = document.getElementById('timerDisplay');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const resetBtn = document.getElementById('resetBtn');
const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');
const emptyState = document.getElementById('emptyState');
const settingsLink = document.getElementById('settingsLink');

// Timer State
let timerState = {
    isRunning: false,
    timeLeft: 25 * 60,
    totalTime: 25 * 60,
    endTimestamp: null
};

let updateInterval = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
    syncWithBackground();

    // Update display frequently using local endTimestamp
    updateInterval = setInterval(() => {
        if (timerState.isRunning && timerState.endTimestamp) {
            timerState.timeLeft = Math.max(0, Math.ceil((timerState.endTimestamp - Date.now()) / 1000));
            updateDisplay();
            if (timerState.timeLeft <= 0) updateButtonStates();
        }
    }, 250);
});

// Get current timer state from background
function syncWithBackground() {
    chrome.runtime.sendMessage({ action: 'getTimerState' }, (response) => {
        if (response) {
            timerState.isRunning = response.isRunning;
            timerState.timeLeft = response.timeLeft;
            timerState.totalTime = response.totalTime;
            timerState.endTimestamp = response.endTimestamp || null;
            updateDisplay();
            updateButtonStates();
        }
    });
}

// Listen for timer updates from background
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'timerUpdated' || request.action === 'timerComplete') {
        syncWithBackground();
    }
});

// Update timer display
function updateDisplay() {
    const minutes = Math.floor(timerState.timeLeft / 60) || 0;
    const seconds = timerState.timeLeft % 60 || 0;
    timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

// Update button states
function updateButtonStates() {
    if (timerState.isRunning) {
        startBtn.disabled = true;
        stopBtn.disabled = false;
    } else {
        startBtn.disabled = false;
        stopBtn.disabled = true;
    }
}

// Start Timer
startBtn.addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: 'startTimer' }, (response) => {
        if (response && response.success) {
            syncWithBackground();
        }
    });
});

// Stop Timer
stopBtn.addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: 'stopTimer' }, (response) => {
        if (response && response.success) {
            syncWithBackground();
        }
    });
});

// Reset Timer
resetBtn.addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: 'resetTimer' }, (response) => {
        if (response && response.success) {
            syncWithBackground();
        }
    });
});

// Load tasks from storage
function loadTasks() {
    chrome.storage.local.get(['tasks'], (result) => {
        const tasks = result.tasks || [];
        taskList.innerHTML = '';

        if (tasks.length === 0) {
            emptyState.style.display = 'block';
        } else {
            emptyState.style.display = 'none';
            tasks.forEach((task, index) => {
                addTaskToDOM(task, index);
            });
        }
    });
}

// Add task to DOM (safe DOM APIs)
function addTaskToDOM(taskText, index) {
    const li = document.createElement('li');
    li.className = 'task-item';

    const span = document.createElement('span');
    span.className = 'task-text';
    span.textContent = taskText;

    const btn = document.createElement('button');
    btn.className = 'task-delete';
    btn.type = 'button';
    btn.textContent = 'Delete';
    btn.dataset.index = index;
    btn.addEventListener('click', () => {
        deleteTask(index);
    });

    li.appendChild(span);
    li.appendChild(btn);
    taskList.appendChild(li);
}

// Add new task
addTaskBtn.addEventListener('click', () => {
    const taskText = taskInput.value.trim();

    if (taskText === '') {
        alert('Please enter a task!');
        return;
    }

    chrome.storage.local.get(['tasks'], (result) => {
        const tasks = result.tasks || [];
        tasks.push(taskText);

        chrome.storage.local.set({ tasks }, () => {
            taskInput.value = '';
            loadTasks();
        });
    });
});

// Delete task
function deleteTask(index) {
    chrome.storage.local.get(['tasks'], (result) => {
        const tasks = result.tasks || [];
        tasks.splice(index, 1);

        chrome.storage.local.set({ tasks }, () => {
            loadTasks();
        });
    });
}

// Allow Enter key to add task
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTaskBtn.click();
    }
});

// Settings link
settingsLink.addEventListener('click', (e) => {
    e.preventDefault();
    chrome.runtime.openOptionsPage();
});

// Cleanup when popup closes
window.addEventListener('beforeunload', () => {
    clearInterval(updateInterval);
});
