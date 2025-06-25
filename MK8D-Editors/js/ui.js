/**
 * Fonctions d'interface utilisateur
 */

/**
 * Affiche un message de statut à l'utilisateur
 * @param {string} message - Le message à afficher
 * @param {string} type - Le type de message (success, error, warning)
 * @param {number} duration - Durée d'affichage en ms (0 = permanent)
 */
function showStatusMessage(message, type = 'info', duration = 5000) {
    // Supprime les anciens messages
    const existingMessages = document.querySelectorAll('.status-message');
    existingMessages.forEach(msg => msg.remove());
    
    // Crée le nouveau message
    const messageDiv = document.createElement('div');
    messageDiv.className = `status-message ${type}`;
    
    const icon = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️'
    }[type] || 'ℹ️';
    
    messageDiv.innerHTML = `<span>${icon}</span><span>${message}</span>`;
    
    // Trouve le conteneur approprié
    const container = document.querySelector('.file-section .card') || document.body;
    container.appendChild(messageDiv);
    
    // Animation d'entrée
    messageDiv.classList.add('fade-in');
    
    // Suppression automatique
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
 * Met à jour les informations du fichier dans l'interface
 * @param {File} file - Le fichier chargé
 * @param {Object} validation - Les résultats de validation
 */
function updateFileInfo(file, validation) {
    document.getElementById('fileName').textContent = file.name;
    document.getElementById('fileSize').textContent = formatFileSize(file.size);
    document.getElementById('fileChecksum').textContent = formatHex(validation.checksum);
    document.getElementById('fileCounter').textContent = validation.counter;
    
    document.getElementById('fileInfo').style.display = 'block';
}

/**
 * Met à jour l'affichage des statistiques
 * @param {Object} stats - Les statistiques à afficher
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
 * Affiche les sections cachées après chargement du fichier
 */
function showSections() {
    document.getElementById('statsSection').style.display = 'block';
    document.getElementById('counterSection').style.display = 'block';
    document.getElementById('actionsSection').style.display = 'block';
    
    // Animation d'apparition
    setTimeout(() => {
        document.getElementById('statsSection').classList.add('fade-in');
        document.getElementById('counterSection').classList.add('fade-in');
        document.getElementById('actionsSection').classList.add('fade-in');
    }, 100);
}

/**
 * Met à jour l'état du bouton de sauvegarde
 */
function updateSaveButtonState() {
    const saveBtn = document.getElementById('saveBtn');
    const modifiedInputs = document.querySelectorAll('.stat-item input.modified');
    const errorInputs = document.querySelectorAll('.stat-item input.error');
    
    if (modifiedInputs.length > 0 && errorInputs.length === 0 && isFileLoaded) {
        saveBtn.disabled = false;
        saveBtn.textContent = `💾 Sauvegarder ${modifiedInputs.length} modification(s)`;
    } else {
        saveBtn.disabled = true;
        saveBtn.innerHTML = '<span class="btn-icon">💾</span>Sauvegarder les modifications';
    }
}