/**
 * Script principal simplifié pour la version modulaire
 */

// Variables globales
let currentStats = {};
let isFileLoaded = false;

/**
 * Initialisation de l'application
 */
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    initializeInputValidation();
    showWelcomeMessage();
    addDynamicStyles();
    initializeKeyboardShortcuts();
    addTooltips();
});

/**
 * Initialise tous les écouteurs d'événements
 */
function initializeEventListeners() {
    // Chargement de fichier
    const fileInput = document.getElementById('fileInput');
    fileInput.addEventListener('change', handleFileLoad);

    // Boutons d'action
    document.getElementById('saveBtn').addEventListener('click', handleSaveModifications);
    document.getElementById('resetBtn').addEventListener('click', handleResetValues);
    document.getElementById('downloadBtn').addEventListener('click', handleDownloadFile);

    // Boutons de gestion du compteur
    document.getElementById('clearCounterBtn').addEventListener('click', handleClearCounter);
    document.getElementById('loadCurrentCounterBtn').addEventListener('click', handleLoadCurrentCounter);
    document.getElementById('modifyCounterBtn').addEventListener('click', handleModifyCounter);


    // Validation en temps réel des inputs
    const statInputs = document.querySelectorAll('.stat-item input[type="number"]');
    statInputs.forEach(input => {
        input.addEventListener('input', debounce(handleStatInputChange, 300));
        input.addEventListener('blur', handleStatInputBlur);
    });
}

/**
 * Initialise la validation des inputs
 */
function initializeInputValidation() {
    const statInputs = document.querySelectorAll('.stat-item input[type="number"]');
    
    statInputs.forEach(input => {
        const statName = input.id;
        const config = getStatConfig(statName);
        
        if (config) {
            const maxValue = config.type === 'uint32' ? 4294967295 : 65535;
            input.setAttribute('max', maxValue);
            input.setAttribute('title', `${config.name} (max: ${formatNumber(maxValue)})`);
        }
    });
}

/**
 * Affiche un message de bienvenue
 */
function showWelcomeMessage() {
    showStatusMessage(
        'Bienvenue dans l\'éditeur de sauvegarde Mario Kart 8 Deluxe ! Chargez votre fichier userdata.dat pour commencer.',
        'info',
        8000
    );
}

/**
 * Gère le chargement d'un fichier de sauvegarde
 */
async function handleFileLoad(event) {
    const file = event.target.files[0];
    if (!file) return;

    try {
        showStatusMessage('Chargement du fichier en cours...', 'info', 0);
        
        console.log(`Chargement du fichier: ${file.name}, taille: ${file.size} bytes`);
        
        const data = await readFileAsUint8Array(file);
        console.log(`Données lues: ${data.length} bytes`);
        
        const result = saveEditor.loadSaveFile(data, file.name);
        console.log('Résultat du chargement:', result);
        
        if (result.success) {
            // Obtenir les vraies informations système du fichier
            const systemInfo = saveEditor.getSystemInfo();
            updateFileInfo(file, systemInfo);
            updateStatsDisplay(result.stats);
            showSections();
            
            currentStats = { ...result.stats };
            isFileLoaded = true;
            
            showStatusMessage(
                `Fichier "${file.name}" chargé avec succès ! ${Object.keys(result.stats).length} statistiques détectées.`,
                'success'
            );
        } else {
            console.error('Erreur de chargement:', result.error);
            if (result.details && result.details.length > 0) {
                console.error('Détails des erreurs:', result.details);
                showStatusMessage(`Erreur: ${result.error} - ${result.details.join(', ')}`, 'error');
            } else {
                showStatusMessage(`Erreur lors du chargement: ${result.error}`, 'error');
            }
        }
        
    } catch (error) {
        console.error('Erreur inattendue lors du chargement:', error);
        showStatusMessage(`Erreur inattendue: ${error.message}`, 'error');
    }
}

/**
 * Gère les changements dans les inputs de statistiques
 */
function handleStatInputChange(event) {
    const input = event.target;
    const statName = input.id;
    const value = parseInt(input.value) || 0;
    
    const validation = validateStatValue(statName, value);
    
    if (validation.valid) {
        input.classList.remove('error');
        input.classList.add('modified');
        input.title = `${getStatConfig(statName)?.name} - Valeur modifiée`;
    } else {
        input.classList.add('error');
        input.title = validation.error;
    }
    
    updateSaveButtonState();
}

/**
 * Gère la perte de focus des inputs
 */
function handleStatInputBlur(event) {
    const input = event.target;
    const statName = input.id;
    const value = parseInt(input.value) || 0;
    
    const validation = validateStatValue(statName, value);
    if (validation.valid) {
        input.value = validation.value;
    }
}

/**
 * Gère la sauvegarde des modifications
 */
function handleSaveModifications() {
    if (!isFileLoaded) {
        showStatusMessage('Aucun fichier chargé', 'error');
        return;
    }

    try {
        showStatusMessage('Application des modifications...', 'info', 0);
        
        const modifiedStats = {};
        const modifiedInputs = document.querySelectorAll('.stat-item input.modified');
        
        modifiedInputs.forEach(input => {
            const statName = input.id;
            const value = parseInt(input.value) || 0;
            modifiedStats[statName] = value;
        });

        if (Object.keys(modifiedStats).length === 0) {
            showStatusMessage('Aucune modification à sauvegarder', 'warning');
            return;
        }

        const result = saveEditor.modifyMultipleStats(modifiedStats);
        
        if (result.errors.length > 0) {
            showStatusMessage(`Erreurs: ${result.errors.join(', ')}`, 'error');
            return;
        }

        const finalizeResult = saveEditor.finalizeSave();
        
        updateFileInfoAfterSave(finalizeResult);
        markInputsAsSaved();
        showDownloadButton();
        
        showStatusMessage(
            `✅ ${result.success.length} modification(s) appliquée(s) ! Nouveau compteur: ${finalizeResult.counter}`,
            'success'
        );

    } catch (error) {
        showStatusMessage(`Erreur lors de la sauvegarde: ${error.message}`, 'error');
        console.error('Erreur de sauvegarde:', error);
    }
}

/**
 * Met à jour les informations du fichier après sauvegarde
 */
function updateFileInfoAfterSave(finalizeResult) {
    document.getElementById('fileChecksum').textContent = formatHex(finalizeResult.checksum);
    document.getElementById('fileCounter').textContent = finalizeResult.counter;
}

/**
 * Marque les inputs comme sauvegardés
 */
function markInputsAsSaved() {
    const modifiedInputs = document.querySelectorAll('.stat-item input.modified');
    modifiedInputs.forEach(input => {
        input.classList.remove('modified');
        input.classList.add('saved');
        setTimeout(() => input.classList.remove('saved'), 2000);
    });
    
    updateSaveButtonState();
}

/**
 * Affiche le bouton de téléchargement
 */
function showDownloadButton() {
    const downloadBtn = document.getElementById('downloadBtn');
    downloadBtn.style.display = 'block';
    downloadBtn.classList.add('fade-in');
}

/**
 * Gère la réinitialisation des valeurs
 */
function handleResetValues() {
    if (!isFileLoaded) {
        showStatusMessage('Aucun fichier chargé', 'error');
        return;
    }

    if (confirm('Êtes-vous sûr de vouloir réinitialiser toutes les modifications ?')) {
        try {
            saveEditor.resetModifications();
            const originalStats = saveEditor.extractAllStats();
            updateStatsDisplay(originalStats);
            
            document.getElementById('downloadBtn').style.display = 'none';
            updateSaveButtonState();
            
            showStatusMessage('Toutes les modifications ont été réinitialisées', 'success');
            
        } catch (error) {
            showStatusMessage(`Erreur lors de la réinitialisation: ${error.message}`, 'error');
        }
    }
}

/**
 * Gère le téléchargement du fichier modifié
 */
function handleDownloadFile() {
    if (!isFileLoaded) {
        showStatusMessage('Aucun fichier chargé', 'error');
        return;
    }

    try {
        const modifiedData = saveEditor.getSaveData();
        const fileName = saveEditor.generateModifiedFileName();
        
        downloadFile(modifiedData, fileName);
        
        showStatusMessage(`Fichier "${fileName}" téléchargé avec succès !`, 'success');
        
    } catch (error) {
        showStatusMessage(`Erreur lors du téléchargement: ${error.message}`, 'error');
    }
}

/**
 * Ajoute des styles CSS dynamiques
 */
function addDynamicStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .stat-item input.modified {
            border-color: var(--warning-color) !important;
            box-shadow: 0 0 0 2px rgba(247, 127, 0, 0.2) !important;
        }
        
        .stat-item input.error {
            border-color: var(--danger-color) !important;
            box-shadow: 0 0 0 2px rgba(239, 71, 111, 0.2) !important;
        }
        
        .stat-item input.saved {
            border-color: var(--success-color) !important;
            box-shadow: 0 0 0 2px rgba(6, 214, 160, 0.2) !important;
        }
    `;
    document.head.appendChild(style);
}

/**
 * Initialise les raccourcis clavier
 */
function initializeKeyboardShortcuts() {
    document.addEventListener('keydown', function(event) {
        if (event.ctrlKey && event.key === 's') {
            event.preventDefault();
            if (!document.getElementById('saveBtn').disabled) {
                handleSaveModifications();
            }
        }
        
        if (event.ctrlKey && event.key === 'r') {
            event.preventDefault();
            handleResetValues();
        }
        
        if (event.ctrlKey && event.key === 'd') {
            event.preventDefault();
            const downloadBtn = document.getElementById('downloadBtn');
            if (downloadBtn.style.display !== 'none') {
                handleDownloadFile();
            }
        }
    });
}

/**
 * Ajoute des tooltips informatifs
 */
function addTooltips() {
    const statInputs = document.querySelectorAll('.stat-item input[type="number"]');
    
    statInputs.forEach(input => {
        const statName = input.id;
        const config = getStatConfig(statName);
        
        if (config) {
            const maxValue = config.type === 'uint32' ? 4294967295 : 65535;
            input.setAttribute('title', 
                `${config.name}\nOffset: ${formatHex(config.offset, 4)}\nType: ${config.type}\nMax: ${formatNumber(maxValue)}`
            );
        }
    });
}

/**
 * Handle counter field clearing
 */
function handleClearCounter() {
    const counterInput = document.getElementById('counterInput');
    const counterStatus = document.getElementById('counterStatus');
    
    counterInput.value = '';
    counterInput.focus();
    
    updateCounterStatus('🗑️ Field cleared. Enter a new value (0-255).', 'info');
}

/**
 * Handle current counter loading
 */
function handleLoadCurrentCounter() {
    if (!isFileLoaded) {
        updateCounterStatus('❌ No file loaded', 'error');
        return;
    }

    try {
        const systemInfo = saveEditor.getSystemInfo();
        const currentCounter = systemInfo.counter;
        
        document.getElementById('counterInput').value = currentCounter;
        updateCounterStatus(`📊 Current counter: ${currentCounter} (0x${currentCounter.toString(16).padStart(2, '0').toUpperCase()})`, 'info');
        
    } catch (error) {
        updateCounterStatus(`❌ Loading error: ${error.message}`, 'error');
    }
}

/**
 * Handle counter modification
 */
function handleModifyCounter() {
    if (!isFileLoaded) {
        updateCounterStatus('❌ No file loaded', 'error');
        return;
    }

    const counterInput = document.getElementById('counterInput');
    const newCounter = parseInt(counterInput.value);
    
    if (isNaN(newCounter) || newCounter < 0 || newCounter > 255) {
        updateCounterStatus('❌ Counter must be between 0 and 255', 'error');
        return;
    }

    try {
        const oldCounter = saveEditor.getSystemInfo().counter;

        // Use new method to set counter
        saveEditor.setCounter(newCounter);
        
        // Recalculate and update checksum via centralized method
        const newChecksum = saveEditor.updateChecksum();
        
        // Update display
        updateFileInfoAfterCounterModification(newCounter, newChecksum);
        showDownloadButton();
        
        updateCounterStatus(
            `✅ Counter modified: ${oldCounter} → ${newCounter}<br>🔧 New checksum: 0x${newChecksum.toString(16).padStart(8, '0').toUpperCase()}`,
            'success'
        );
        
        showStatusMessage(`Counter modified successfully: ${oldCounter} → ${newCounter}`, 'success');
        
    } catch (error) {
        updateCounterStatus(`❌ Error: ${error.message}`, 'error');
    }
}

/**
 * Update counter status
 */
function updateCounterStatus(message, type) {
    const counterStatus = document.getElementById('counterStatus');
    counterStatus.innerHTML = message;
    counterStatus.className = `counter-status ${type}`;
}

/**
 * Update file information after counter modification
 */
function updateFileInfoAfterCounterModification(newCounter, newChecksum) {
    document.getElementById('fileChecksum').textContent = formatHex(newChecksum);
    document.getElementById('fileCounter').textContent = newCounter;
}

// Global error handling
window.addEventListener('error', function(event) {
    console.error('JavaScript error:', event.error);
    showStatusMessage('An unexpected error occurred. Check the console for more details.', 'error');
});

// Prevent accidental closing
window.addEventListener('beforeunload', function(event) {
    const modifiedInputs = document.querySelectorAll('.stat-item input.modified');
    if (modifiedInputs.length > 0) {
        event.preventDefault();
        event.returnValue = 'You have unsaved modifications. Are you sure you want to leave?';
    }
});
