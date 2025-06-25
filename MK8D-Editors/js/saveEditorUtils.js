/**
 * Utilitaires pour l'éditeur de sauvegarde
 */

/**
 * Extension de la classe MK8DSaveEditor avec des méthodes utilitaires
 */
Object.assign(MK8DSaveEditor.prototype, {
    /**
     * Incrémente le compteur de sauvegarde (1 byte à l'offset 0x2124)
     */
    incrementCounter() {
        if (!this.saveData) {
            throw new Error('Aucun fichier de sauvegarde chargé');
        }

        const currentCounter = this.saveData[SYSTEM_OFFSETS.counter];
        const newCounter = (currentCounter + 1) & 0xFF; // Garde sur 1 byte
        
        this.saveData[SYSTEM_OFFSETS.counter] = newCounter;
        this.isModified = true;

        return newCounter;
    },

/**
     * Définit la valeur du compteur de sauvegarde
     * @param {number} newCounter - La nouvelle valeur du compteur (0-255)
     */
    setCounter(newCounter) {
        if (!this.saveData) {
            throw new Error('Aucun fichier de sauvegarde chargé');
        }
        if (newCounter < 0 || newCounter > 255) {
            throw new Error('La valeur du compteur doit être entre 0 et 255');
        }

        this.saveData[SYSTEM_OFFSETS.counter] = newCounter;
        this.isModified = true;
    },
    /**
     * Recalcule et met à jour le checksum Nintendo.
     * Cette méthode garantit que le checksum est toujours calculé
     * sur la version la plus récente des données de sauvegarde.
     * @returns {number} - Le nouveau checksum calculé.
     */
    updateChecksum() {
        if (!this.saveData) {
            throw new Error('Aucun fichier de sauvegarde chargé pour calculer le checksum.');
        }

        // Pour garantir l'intégrité, nous travaillons sur une copie complète.
        const dataForChecksum = new Uint8Array(this.saveData);

        // Met à zéro les 4 octets du checksum dans la copie.
        dataForChecksum.fill(0, SYSTEM_OFFSETS.checksum, SYSTEM_OFFSETS.checksum + 4);

        // Calcule le nouveau checksum à partir de la copie modifiée.
        const newChecksum = calculateNintendoChecksum(dataForChecksum);
        writeUint32LE(this.saveData, SYSTEM_OFFSETS.checksum, newChecksum);

        return newChecksum;
    },

    /**
     * Finalise les modifications et prépare le fichier pour la sauvegarde
     * @returns {Object} - Informations sur la finalisation
     */
    finalizeSave() {
        if (!this.saveData || !this.isModified) {
            throw new Error('Aucune modification à finaliser');
        }

        // Incrémentation du compteur
        const newCounter = this.incrementCounter();
        
        // Mise à jour du checksum
        const newChecksum = this.updateChecksum();

        return {
            counter: newCounter,
            checksum: newChecksum,
            size: this.saveData.length
        };
    },

    /**
     * Obtient les informations système du fichier
     * @returns {Object} - Informations système
     */
    getSystemInfo() {
        if (!this.saveData) {
            return null;
        }

        return {
            checksum: readUint32LE(this.saveData, SYSTEM_OFFSETS.checksum),
            counter: this.saveData[SYSTEM_OFFSETS.counter], // 1 byte seulement
            size: this.saveData.length,
            fileName: this.fileName,
            isModified: this.isModified
        };
    },

    /**
     * Valide l'intégrité du fichier actuel
     * @returns {Object} - Résultat de la validation
     */
    validateCurrentFile() {
        if (!this.saveData) {
            throw new Error('Aucun fichier de sauvegarde chargé');
        }

        return validateSaveFileSimple(this.saveData);
    },

    /**
     * Génère un nom de fichier pour la sauvegarde modifiée
     * @returns {string} - Le nom de fichier suggéré
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
 * Instance globale de l'éditeur de sauvegarde
 */
const saveEditor = new MK8DSaveEditor();