/**
 * User interface functions
 */

/**
 * Displays a status message to the user
 * @param {string} message - The message to display
 * @param {string} type - The message type (success, error, warning)
 * @param {number} duration - Display duration in ms (0 = permanent)
 */
function showStatusMessage(message, type = 'info', duration = 5000) {
    // Remove old messages
    const existingMessages = document.querySelectorAll('.status-message');
    existingMessages.forEach(msg => msg.remove());
    
    // Create new message
    const messageDiv = document.createElement('div');
    messageDiv.className = `status-message ${type}`;
    
    const icon = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️'
    }[type] || 'ℹ️';
    
    messageDiv.innerHTML = `<span>${icon}</span><span>${message}</span>`;
    
    // Find appropriate container
    const container = document.querySelector('.file-section .card') || document.body;
    container.appendChild(messageDiv);
    
    // Entry animation
    messageDiv.classList.add('fade-in');
    
    // Automatic removal
    if (duration > 0) {
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.style.opacity = '0';
                messageDiv.style.transform = 'translateY(-10px)';
                setTimeout(() => messageDiv.remove(), 300);
            }
        }, duration);
    }
}

/**
 * Updates file information in the interface
 * @param {File} file - The loaded file
 * @param {Object} validation - Validation results
 */
function updateFileInfo(file, validation) {
    document.getElementById('fileName').textContent = file.name;
    document.getElementById('fileSize').textContent = formatFileSize(file.size);
    document.getElementById('fileChecksum').textContent = formatHex(validation.checksum);
    document.getElementById('fileCounter').textContent = validation.counter;
    
    document.getElementById('fileInfo').style.display = 'block';
}

/**
 * Updates statistics display
 * @param {Object} stats - Statistics to display
 */
function updateStatsDisplay(stats) {
    for (const [statName, value] of Object.entries(stats)) {
        const input = document.getElementById(statName);
        if (input) {
            input.value = value;
            input.classList.remove('modified');
        }
    }
}

/**
 * Shows hidden sections after file loading
 */
function showSections() {
    document.getElementById('statsSection').style.display = 'block';
    document.getElementById('counterSection').style.display = 'block';
    document.getElementById('actionsSection').style.display = 'block';
    
    // Appearance animation
    setTimeout(() => {
        document.getElementById('statsSection').classList.add('fade-in');
        document.getElementById('counterSection').classList.add('fade-in');
        document.getElementById('actionsSection').classList.add('fade-in');
    }, 100);
}

/**
 * Updates save button state
 */
function updateSaveButtonState() {
    const saveBtn = document.getElementById('saveBtn');
    const modifiedInputs = document.querySelectorAll('.stat-item input.modified');
    const errorInputs = document.querySelectorAll('.stat-item input.error');
    
    if (modifiedInputs.length > 0 && errorInputs.length === 0 && isFileLoaded) {
        saveBtn.disabled = false;
        saveBtn.textContent = `💾 Save ${modifiedInputs.length} modification(s)`;
    } else {
        saveBtn.disabled = true;
        saveBtn.innerHTML = '<span class="btn-icon">💾</span>Save modifications';
    }
}