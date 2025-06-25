/**
 * Fonctions de formatage et utilitaires
 */

/**
 * Formate un nombre en hexadécimal avec préfixe 0x
 * @param {number} value - La valeur à formater
 * @param {number} padding - Le nombre de caractères minimum
 * @returns {string} - La valeur formatée
 */
function formatHex(value, padding = 8) {
    return '0x' + value.toString(16).toUpperCase().padStart(padding, '0');
}

/**
 * Formate une taille de fichier en format lisible
 * @param {number} bytes - La taille en bytes
 * @returns {string} - La taille formatée
 */
function formatFileSize(bytes) {
    if (bytes === 0) return '0 B';
    
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Convertit un nombre en format avec séparateurs de milliers
 * @param {number} num - Le nombre à formater
 * @returns {string} - Le nombre formaté
 */
function formatNumber(num) {
    return num.toLocaleString('fr-FR');
}

/**
 * Débounce une fonction pour éviter les appels trop fréquents
 * @param {Function} func - La fonction à débouncer
 * @param {number} wait - Le délai d'attente en ms
 * @returns {Function} - La fonction débouncée
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
