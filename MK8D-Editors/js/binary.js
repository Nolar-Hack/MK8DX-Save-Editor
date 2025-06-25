/**
 * Fonctions de manipulation binaire
 */

/**
 * Lit un entier 32 bits little-endian depuis un buffer
 * @param {Uint8Array} buffer - Le buffer de données
 * @param {number} offset - L'offset de lecture
 * @returns {number} - La valeur lue
 */
function readUint32LE(buffer, offset) {
    return (buffer[offset] |
            (buffer[offset + 1] << 8) |
            (buffer[offset + 2] << 16) |
            (buffer[offset + 3] << 24)) >>> 0;
}

/**
 * Écrit un entier 32 bits little-endian dans un buffer
 * @param {Uint8Array} buffer - Le buffer de données
 * @param {number} offset - L'offset d'écriture
 * @param {number} value - La valeur à écrire
 */
function writeUint32LE(buffer, offset, value) {
    buffer[offset] = value & 0xFF;
    buffer[offset + 1] = (value >>> 8) & 0xFF;
    buffer[offset + 2] = (value >>> 16) & 0xFF;
    buffer[offset + 3] = (value >>> 24) & 0xFF;
}

/**
 * Lit un entier 16 bits little-endian depuis un buffer
 * @param {Uint8Array} buffer - Le buffer de données
 * @param {number} offset - L'offset de lecture
 * @returns {number} - La valeur lue
 */
function readUint16LE(buffer, offset) {
    return buffer[offset] | (buffer[offset + 1] << 8);
}

/**
 * Écrit un entier 16 bits little-endian dans un buffer
 * @param {Uint8Array} buffer - Le buffer de données
 * @param {number} offset - L'offset d'écriture
 * @param {number} value - La valeur à écrire
 */
function writeUint16LE(buffer, offset, value) {
    buffer[offset] = value & 0xFF;
    buffer[offset + 1] = (value >>> 8) & 0xFF;
}