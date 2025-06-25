/**
 * Définition des offsets pour Mario Kart 8 Deluxe
 */

/**
 * Carte des offsets des statistiques dans le fichier de sauvegarde
 * Basée sur le reverse engineering du format de fichier Nintendo
 */
const STATS_OFFSETS = {
    // Monnaie et objets
    coins: { offset: 0x195c, size: 4, type: 'uint32', name: 'Pièces' },
    
    // Techniques de course
    drifts: { offset: 0x1968, size: 4, type: 'uint32', name: 'Dérapages' },
    miniTurbos: { offset: 0x1970, size: 4, type: 'uint32', name: 'Mini-Turbos' },
    superMiniTurbo: { offset: 0x1974, size: 4, type: 'uint32', name: 'Super Mini-Turbo' },
    ultraMiniTurbo: { offset: 0x1978, size: 4, type: 'uint32', name: 'Ultra Mini-Turbo' },
    jumpSync: { offset: 0x1964, size: 4, type: 'uint32', name: 'Saut Synchro' },
    lakituRescue: { offset: 0x1578, size: 4, type: 'uint32', name: 'Sauvetage Lakitu' },
     
    // Points et classements
    racePoints: { offset: 0x1e94, size: 4, type: 'uint32', name: 'Points Course' },
    battlePoints: { offset: 0x1e98, size: 4, type: 'uint32', name: 'Points Bataille' },
    goldCrowns: { offset: 0x19f0, size: 4, type: 'uint32', name: 'Couronnes Or' },
    silverCrowns: { offset: 0x01a6, size: 2, type: 'uint16', name: 'Couronnes Argent' },
    bronzeCrowns: { offset: 0x012a, size: 2, type: 'uint16', name: 'Couronnes Bronze' },
    
    // Parties jouées
    worldRegionalGames: { offset: 0x02e8, size: 4, type: 'uint32', name: 'Parties Mondiales/Régionales' },
    friendGames: { offset: 0x03ac, size: 4, type: 'uint32', name: 'Parties entre Amis' },
    tournaments: { offset: 0x0004, size: 4, type: 'uint32', name: 'Tournois' },
    totalGames: { offset: 0x0350, size: 4, type: 'uint32', name: 'Total Parties' }
};

/**
 * Offsets système pour le fichier de sauvegarde Mario Kart 8 Deluxe
 * Découverts par reverse engineering - valeurs vérifiées
 * Taille du fichier: 80,736 bytes
 */
const SYSTEM_OFFSETS = {
    counter: 0x2124,    // Progress counter (8484) - 1 byte
    checksum: 0x38      // Nintendo checksum (56) - 4 bytes
};

/**
 * Obtient la configuration d'une statistique
 * @param {string} statName - Le nom de la statistique
 * @returns {Object|null} - La configuration ou null
 */
function getStatConfig(statName) {
    return STATS_OFFSETS[statName] || null;
}
