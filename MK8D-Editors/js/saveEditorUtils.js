/**
 * Save editor utilities
 */

/**
 * Extension of MK8DSaveEditor class with utility methods
 */
Object.assign(MK8DSaveEditor.prototype, {
    /**
     * Increment save counter (1 byte at offset 0x2124)
     */
    incrementCounter() {
        if (!this.saveData) {
            throw new Error('No save file loaded');
        }

        const currentCounter = this.saveData[SYSTEM_OFFSETS.counter];
        const newCounter = (currentCounter + 1) & 0xFF; // Keep on 1 byte
        
        this.saveData[SYSTEM_OFFSETS.counter] = newCounter;
        this.isModified = true;

        return newCounter;
    },

/**
     * Set save counter value
     * @param {number} newCounter - New counter value (0-255)
     */
    setCounter(newCounter) {
        if (!this.saveData) {
            throw new Error('No save file loaded');
        }
        if (newCounter < 0 || newCounter > 255) {
            throw new Error('Counter value must be between 0 and 255');
        }

        this.saveData[SYSTEM_OFFSETS.counter] = newCounter;
        this.isModified = true;
    },
    /**
     * Recalculate and update Nintendo checksum.
     * This method ensures the checksum is always calculated
     * on the most recent version of save data.
     * @returns {number} - The new calculated checksum.
     */
    updateChecksum() {
        if (!this.saveData) {
            throw new Error('No save file loaded to calculate checksum.');
        }

        // To ensure integrity, we work on a complete copy.
        const dataForChecksum = new Uint8Array(this.saveData);

        // Zero out the 4 checksum bytes in the copy.
        dataForChecksum.fill(0, SYSTEM_OFFSETS.checksum, SYSTEM_OFFSETS.checksum + 4);

        // Calculate new checksum from modified copy.
        const newChecksum = calculateNintendoChecksum(dataForChecksum);
        writeUint32LE(this.saveData, SYSTEM_OFFSETS.checksum, newChecksum);

        return newChecksum;
    },

    /**
     * Finalize modifications and prepare file for saving
     * @returns {Object} - Finalization information
     */
    finalizeSave() {
        if (!this.saveData || !this.isModified) {
            throw new Error('No modifications to finalize');
        }

        // Counter increment
        const newCounter = this.incrementCounter();
        
        // Checksum update
        const newChecksum = this.updateChecksum();

        return {
            counter: newCounter,
            checksum: newChecksum,
            size: this.saveData.length
        };
    },

    /**
     * Get system information from file
     * @returns {Object} - System information
     */
    getSystemInfo() {
        if (!this.saveData) {
            return null;
        }

        return {
            checksum: readUint32LE(this.saveData, SYSTEM_OFFSETS.checksum),
            counter: this.saveData[SYSTEM_OFFSETS.counter], // 1 byte only
            size: this.saveData.length,
            fileName: this.fileName,
            isModified: this.isModified
        };
    },

    /**
     * Validate current file integrity
     * @returns {Object} - Validation result
     */
    validateCurrentFile() {
        if (!this.saveData) {
            throw new Error('No save file loaded');
        }

        return validateSaveFileSimple(this.saveData);
    },

    /**
     * Generate filename for modified save
     * @returns {string} - Suggested filename
     */
    generateModifiedFileName() {
        if (!this.fileName) {
            return 'userdata_modified.dat';
        }

        const baseName = this.fileName.replace(/\.dat$/, '');
        const counter = this.getSystemInfo()?.counter || 'unknown';
        
        return `${baseName}_counter_${counter}_modified.dat`;
    }
});

/**
 * Global save editor instance
 */
const saveEditor = new MK8DSaveEditor();