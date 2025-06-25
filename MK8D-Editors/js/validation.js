/**
 * Fonctions de validation pour les fichiers de sauvegarde
 */

/**
 * Validation simplifiée pour les fichiers Nintendo Switch
 * @param {Uint8Array} data - Les données du fichier
 * @returns {Object} - Résultat de la validation
 */
function validateSaveFileSimple(data) {
    console.log('Validation simplifiée du fichier, taille:', data.length);
    
    const result = {
        valid: false,
        size: data.length,
        expectedSize: 80736,
        checksum: 0,
        counter: 0,
        errors: []
    };
    
    // Vérification de la taille uniquement
    if (data.length !== 80736) {
        console.log(`Taille incorrecte: ${data.length} bytes (attendu: 80736 bytes)`);
        result.errors.push(`Taille incorrecte: ${data.length} bytes (attendu: 80736 bytes)`);
        return result;
    }
    
    // Lire les vraies valeurs du checksum et du compteur
    try {
        const checksumOffset = SYSTEM_OFFSETS.checksum;
        const counterOffset = SYSTEM_OFFSETS.counter;
        
        console.log(`Lecture checksum à l'offset: 0x${checksumOffset.toString(16)} (${checksumOffset})`);
        console.log(`Lecture counter à l'offset: 0x${counterOffset.toString(16)} (${counterOffset})`);
        
        // Vérifier que les offsets sont dans les limites du fichier
        if (checksumOffset + 4 <= data.length && counterOffset + 1 <= data.length) {
            // Lire les valeurs réelles
            result.checksum = readUint32LE(data, checksumOffset);
            result.counter = data[counterOffset]; // 1 byte seulement
            
            console.log(`Checksum lu: 0x${result.checksum.toString(16).padStart(8, '0')}`);
            console.log(`Compteur lu: ${result.counter}`);
        } else {
            console.log('⚠️ Offsets hors limites');
            result.errors.push('Offsets système hors limites du fichier');
        }
    } catch (error) {
        console.error('Erreur lors de la lecture des valeurs système:', error);
        result.errors.push(`Erreur lors de la lecture: ${error.message}`);
    }
    
    // Vérifier la signature Nintendo Switch (optionnel)
    const signature = new TextDecoder().decode(data.subarray(0, 4));
    console.log(`Signature du fichier: "${signature}"`);
    
    if (signature === 'SUTC') {
        console.log('✅ Fichier Nintendo Switch détecté');
    } else {
        console.log('⚠️ Signature Nintendo Switch non trouvée, mais fichier accepté');
    }
    
    // Accepter le fichier
    result.valid = true;
    console.log('✅ Fichier accepté pour édition');
    
    return result;
}

/**
 * Valide une valeur pour une statistique donnée
 * @param {string} statName - Le nom de la statistique
 * @param {number} value - La valeur à valider
 * @returns {Object} - Résultat de la validation
 */
function validateStatValue(statName, value) {
    const config = STATS_OFFSETS[statName];
    if (!config) {
        return {
            valid: false,
            error: `Statistique inconnue: ${statName}`
        };
    }

    const maxValue = config.type === 'uint32' ? 0xFFFFFFFF : 0xFFFF;
    
    if (typeof value !== 'number' || isNaN(value)) {
        return {
            valid: false,
            error: 'La valeur doit être un nombre'
        };
    }

    if (value < 0) {
        return {
            valid: false,
            error: 'La valeur ne peut pas être négative'
        };
    }

    if (value > maxValue) {
        return {
            valid: false,
            error: `La valeur ne peut pas dépasser ${maxValue.toLocaleString()}`
        };
    }

    return {
        valid: true,
        value: Math.floor(value)
    };
}