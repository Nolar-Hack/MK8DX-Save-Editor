/**
 * Fonctions cryptographiques pour Mario Kart 8 Deluxe
 */

/**
 * Calcule le CRC32 d'un buffer de données
 * @param {Uint8Array} data - Les données à traiter
 * @returns {number} - Le CRC32 calculé
 */
const crc32Table = (function() {
    const table = new Uint32Array(256);
    for (let i = 0; i < 256; i++) {
        let c = i;
        for (let j = 0; j < 8; j++) {
            c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
        }
        table[i] = c;
    }
    return table;
})();

function calculateCRC32(data) {
    let crc = 0xFFFFFFFF;
    for (let i = 0; i < data.length; i++) {
        crc = crc32Table[(crc ^ data[i]) & 0xFF] ^ (crc >>> 8);
    }
    
    return (crc ^ 0xFFFFFFFF) >>> 0;
}

/**
 * Calcule le checksum Nintendo pour Mario Kart 8 Deluxe
 * @param {Uint8Array} data - Les données sans le checksum
 * @returns {number} - Le checksum Nintendo
 */
function calculateNintendoChecksum(data) {
    const crc32 = calculateCRC32(data);
    return (crc32 ^ 0xb33778cd) >>> 0;
}