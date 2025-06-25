/**
 * Classe principale pour l'édition des sauvegardes MK8D
 */
class MK8DSaveEditor {
    constructor() {
        this.saveData = null;
        this.originalData = null;
        this.fileName = '';
        this.isModified = false;
    }

    /**
     * Charge un fichier de sauvegarde
     * @param {Uint8Array} data - Les données du fichier
     * @param {string} fileName - Le nom du fichier
     * @returns {Object} - Résultat du chargement
     */
    loadSaveFile(data, fileName) {
        try {
            // Validation simplifiée du fichier
            const validation = validateSaveFileSimple(data);
            if (!validation.valid) {
                return {
                    success: false,
                    error: 'Fichier invalide',
                    details: validation.errors
                };
            }

            // Sauvegarde des données
            this.saveData = new Uint8Array(data);
            this.originalData = new Uint8Array(data);
            this.fileName = fileName;
            this.isModified = false;

            return {
                success: true,
                validation: validation,
                stats: this.extractAllStats()
            };

        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Extrait toutes les statistiques du fichier de sauvegarde
     * @returns {Object} - Toutes les statistiques
     */
    extractAllStats() {
        if (!this.saveData) {
            throw new Error('Aucun fichier de sauvegarde chargé');
        }

        const stats = {};
        
        for (const [key, config] of Object.entries(STATS_OFFSETS)) {
            try {
                if (config.type === 'uint32') {
                    stats[key] = readUint32LE(this.saveData, config.offset);
                } else if (config.type === 'uint16') {
                    stats[key] = readUint16LE(this.saveData, config.offset);
                }
            } catch (error) {
                console.warn(`Erreur lors de la lecture de ${key}:`, error);
                stats[key] = 0;
            }
        }

        return stats;
    }

    /**
     * Modifie une statistique spécifique
     * @param {string} statName - Le nom de la statistique
     * @param {number} value - La nouvelle valeur
     * @returns {boolean} - Succès de la modification
     */
    modifyStat(statName, value) {
        if (!this.saveData) {
            throw new Error('Aucun fichier de sauvegarde chargé');
        }

        const config = STATS_OFFSETS[statName];
        if (!config) {
            throw new Error(`Statistique inconnue: ${statName}`);
        }

        // Validation de la valeur
        const maxValue = config.type === 'uint32' ? 0xFFFFFFFF : 0xFFFF;
        if (value < 0 || value > maxValue) {
            throw new Error(`Valeur hors limites pour ${config.name}: ${value} (max: ${maxValue})`);
        }

        try {
            // Écriture de la nouvelle valeur
            if (config.type === 'uint32') {
                writeUint32LE(this.saveData, config.offset, value);
            } else if (config.type === 'uint16') {
                writeUint16LE(this.saveData, config.offset, value);
            }

            this.isModified = true;
            return true;

        } catch (error) {
            throw new Error(`Erreur lors de la modification de ${config.name}: ${error.message}`);
        }
    }

    /**
     * Modifie plusieurs statistiques en une fois
     * @param {Object} stats - Objet contenant les statistiques à modifier
     * @returns {Object} - Résultat des modifications
     */
    modifyMultipleStats(stats) {
        const results = {
            success: [],
            errors: []
        };

        for (const [statName, value] of Object.entries(stats)) {
            try {
                if (this.modifyStat(statName, value)) {
                    results.success.push(`${STATS_OFFSETS[statName]?.name || statName}: ${value}`);
                }
            } catch (error) {
                results.errors.push(`${statName}: ${error.message}`);
            }
        }

        return results;
    }

    /**
     * Réinitialise les modifications
     */
    resetModifications() {
        if (this.originalData) {
            this.saveData = new Uint8Array(this.originalData);
            this.isModified = false;
        }
    }

    /**
     * Obtient les données finales du fichier de sauvegarde
     * @returns {Uint8Array} - Les données du fichier modifié
     */
    getSaveData() {
        if (!this.saveData) {
            throw new Error('Aucun fichier de sauvegarde chargé');
        }

        return new Uint8Array(this.saveData);
    }


}
