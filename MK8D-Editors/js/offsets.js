/**
 * Offset definitions for Mario Kart 8 Deluxe
 */

/**
 * Statistics offset map in save file
 * Based on reverse engineering of Nintendo file format
 */
const STATS_OFFSETS = {
    // Currency and items
    coins: { offset: 0x195c, size: 4, type: 'uint32', name: 'Coins' },
    
    // Racing techniques
    drifts: { offset: 0x1968, size: 4, type: 'uint32', name: 'Drifts' },
    miniTurbos: { offset: 0x1970, size: 4, type: 'uint32', name: 'Mini-Turbos' },
    superMiniTurbo: { offset: 0x1974, size: 4, type: 'uint32', name: 'Super Mini-Turbo' },
    ultraMiniTurbo: { offset: 0x1978, size: 4, type: 'uint32', name: 'Ultra Mini-Turbo' },
    jumpSync: { offset: 0x1964, size: 4, type: 'uint32', name: 'Jump Sync' },
    lakituRescue: { offset: 0x1578, size: 4, type: 'uint32', name: 'Lakitu Rescue' },
     
    // Points and rankings
    racePoints: { offset: 0x1e94, size: 4, type: 'uint32', name: 'Race Points' },
    battlePoints: { offset: 0x1e98, size: 4, type: 'uint32', name: 'Battle Points' },
    goldCrowns: { offset: 0x19f0, size: 4, type: 'uint32', name: 'Gold Crowns' },
    silverCrowns: { offset: 0x01a6, size: 2, type: 'uint16', name: 'Silver Crowns' },
    bronzeCrowns: { offset: 0x012a, size: 2, type: 'uint16', name: 'Bronze Crowns' },
    
    // Games played
    worldRegionalGames: { offset: 0x02e8, size: 4, type: 'uint32', name: 'Worldwide/Regional Games' },
    friendGames: { offset: 0x03ac, size: 4, type: 'uint32', name: 'Friend Games' },
    tournaments: { offset: 0x0004, size: 4, type: 'uint32', name: 'Tournaments' },
    totalGames: { offset: 0x0350, size: 4, type: 'uint32', name: 'Total Games' }
};

/**
 * System offsets for Mario Kart 8 Deluxe save file
 * Discovered by reverse engineering - verified values
 * File size: 80,736 bytes
 */
const SYSTEM_OFFSETS = {
    counter: 0x2124,    // Progress counter (8484) - 1 byte
    checksum: 0x38      // Nintendo checksum (56) - 4 bytes
};

/**
 * Get configuration for a statistic
 * @param {string} statName - The statistic name
 * @returns {Object|null} - Configuration or null
 */
function getStatConfig(statName) {
    return STATS_OFFSETS[statName] || null;
}
