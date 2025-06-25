/**
 * Utilitaires pour la gestion des fichiers
 */

/**
 * Lit un fichier depuis un input file
 * @param {File} file - Le fichier à lire
 * @returns {Promise<Uint8Array>} - Les données du fichier
 */
function readFileAsUint8Array(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = function(event) {
            const arrayBuffer = event.target.result;
            const uint8Array = new Uint8Array(arrayBuffer);
            resolve(uint8Array);
        };
        
        reader.onerror = function() {
            reject(new Error('Erreur lors de la lecture du fichier'));
        };
        
        reader.readAsArrayBuffer(file);
    });
}

/**
 * Télécharge un fichier depuis le navigateur
 * @param {Uint8Array} data - Les données du fichier
 * @param {string} filename - Le nom du fichier
 * @param {string} mimeType - Le type MIME
 */
function downloadFile(data, filename, mimeType = 'application/octet-stream') {
    const blob = new Blob([data], { type: mimeType });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Libère l'URL après un délai
    setTimeout(() => URL.revokeObjectURL(url), 1000);
}