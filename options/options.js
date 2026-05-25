// DOM Elements
const pomodoroTimeInput = document.getElementById('pomodoroTime');
const valueDisplay = document.getElementById('valueDisplay');
const saveBtn = document.getElementById('saveBtn');
const resetBtn = document.getElementById('resetBtn');
const presetBtns = document.querySelectorAll('.preset-btn');
const statusMessage = document.getElementById('status');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadSettings();
    updatePresetButtons();
});

// Load saved settings
function loadSettings() {
    chrome.storage.local.get(['pomodoroTime'], (result) => {
        const savedTime = result.pomodoroTime || 25;
        pomodoroTimeInput.value = savedTime;
        updateDisplay();
        updatePresetButtons();
    });
}

// Update the display value
function updateDisplay() {
    const value = parseInt(pomodoroTimeInput.value);
    valueDisplay.textContent = `${value} min`;
}

// Update preset buttons active state
function updatePresetButtons() {
    const currentValue = parseInt(pomodoroTimeInput.value);
    presetBtns.forEach(btn => {
        const btnValue = parseInt(btn.getAttribute('data-value'));
        if (btnValue === currentValue) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

// Range input event listener
pomodoroTimeInput.addEventListener('input', () => {
    updateDisplay();
    updatePresetButtons();
});

// Preset buttons
presetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const value = btn.getAttribute('data-value');
        pomodoroTimeInput.value = value;
        updateDisplay();
        updatePresetButtons();
    });
});

// Save settings
saveBtn.addEventListener('click', () => {
    const pomodoroTime = parseInt(pomodoroTimeInput.value);

    // Validation
    if (pomodoroTime < 1 || pomodoroTime > 60) {
        showStatus('Please enter a value between 1 and 60 minutes', 'error');
        return;
    }

    chrome.storage.local.set({ pomodoroTime }, () => {
        // Inform background to update timer defaults and reset active timers
        chrome.runtime.sendMessage({ action: 'updateSettings', pomodoroTime }, () => {
            showStatus('✅ Settings saved successfully!', 'success');

            // Auto-hide message after 2 seconds
            setTimeout(() => {
                statusMessage.style.display = 'none';
            }, 2000);
        });
    });
});

// Reset to default
resetBtn.addEventListener('click', () => {
    pomodoroTimeInput.value = 25;
    updateDisplay();
    updatePresetButtons();
    chrome.storage.local.set({ pomodoroTime: 25 }, () => {
        chrome.runtime.sendMessage({ action: 'updateSettings', pomodoroTime: 25 }, () => {
            showStatus('✅ Reset to default (25 minutes)', 'success');
            setTimeout(() => {
                statusMessage.style.display = 'none';
            }, 2000);
        });
    });
});

// Show status message
function showStatus(message, type) {
    statusMessage.textContent = message;
    statusMessage.className = `status-message ${type}`;
    statusMessage.style.display = 'block';
}
