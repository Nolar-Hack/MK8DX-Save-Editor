/**
 * Main class for MK8D save editing
 */
class MK8DSaveEditor {
    constructor() {
        this.saveData = null;
        this.originalData = null;
        this.fileName = '';
        this.isModified = false;
    }

    /**
     * Load a save file
     * @param {Uint8Array} data - File data
     * @param {string} fileName - File name
     * @returns {Object} - Loading result
     */
    loadSaveFile(data, fileName) {
        try {
            // Simplified file validation
            const validation = validateSaveFileSimple(data);
            if (!validation.valid) {
                return {
                    success: false,
                    error: 'Invalid file',
                    details: validation.errors
                };
            }

            // Save data
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
     * Extract all statistics from save file
     * @returns {Object} - All statistics
     */
    extractAllStats() {
        if (!this.saveData) {
            throw new Error('No save file loaded');
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
                console.warn(`Error reading ${key}:`, error);
                stats[key] = 0;
            }
        }

        return stats;
    }

    /**
     * Modify a specific statistic
     * @param {string} statName - Statistic name
     * @param {number} value - New value
     * @returns {boolean} - Modification success
     */
    modifyStat(statName, value) {
        if (!this.saveData) {
            throw new Error('No save file loaded');
        }

        const config = STATS_OFFSETS[statName];
        if (!config) {
            throw new Error(`Unknown statistic: ${statName}`);
        }

        // Value validation
        const maxValue = config.type === 'uint32' ? 0xFFFFFFFF : 0xFFFF;
        if (value < 0 || value > maxValue) {
            throw new Error(`Value out of bounds for ${config.name}: ${value} (max: ${maxValue})`);
        }

        try {
            // Write new value
            if (config.type === 'uint32') {
                writeUint32LE(this.saveData, config.offset, value);
            } else if (config.type === 'uint16') {
                writeUint16LE(this.saveData, config.offset, value);
            }

            this.isModified = true;
            return true;

        } catch (error) {
            throw new Error(`Error modifying ${config.name}: ${error.message}`);
        }
    }

    /**
     * Modify multiple statistics at once
     * @param {Object} stats - Object containing statistics to modify
     * @returns {Object} - Modification results
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
     * Reset modifications
     */
    resetModifications() {
        if (this.originalData) {
            this.saveData = new Uint8Array(this.originalData);
            this.isModified = false;
        }
    }

    /**
     * Get final save file data
     * @returns {Uint8Array} - Modified file data
     */
    getSaveData() {
        if (!this.saveData) {
            throw new Error('No save file loaded');
        }

        return new Uint8Array(this.saveData);
    }


}
