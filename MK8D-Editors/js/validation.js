/**
 * Validation functions for save files
 */

/**
 * Simplified validation for Nintendo Switch files
 * @param {Uint8Array} data - File data
 * @returns {Object} - Validation result
 */
function validateSaveFileSimple(data) {
    console.log('Simplified file validation, size:', data.length);
    
    const result = {
        valid: false,
        size: data.length,
        expectedSize: 80736,
        checksum: 0,
        counter: 0,
        errors: []
    };
    
    // Size verification only
    if (data.length !== 80736) {
        console.log(`Incorrect size: ${data.length} bytes (expected: 80736 bytes)`);
        result.errors.push(`Incorrect size: ${data.length} bytes (expected: 80736 bytes)`);
        return result;
    }
    
    // Read real checksum and counter values
    try {
        const checksumOffset = SYSTEM_OFFSETS.checksum;
        const counterOffset = SYSTEM_OFFSETS.counter;
        
        console.log(`Reading checksum at offset: 0x${checksumOffset.toString(16)} (${checksumOffset})`);
        console.log(`Reading counter at offset: 0x${counterOffset.toString(16)} (${counterOffset})`);
        
        // Check that offsets are within file bounds
        if (checksumOffset + 4 <= data.length && counterOffset + 1 <= data.length) {
            // Read actual values
            result.checksum = readUint32LE(data, checksumOffset);
            result.counter = data[counterOffset]; // 1 byte only
            
            console.log(`Checksum read: 0x${result.checksum.toString(16).padStart(8, '0')}`);
            console.log(`Counter read: ${result.counter}`);
        } else {
            console.log('⚠️ Offsets out of bounds');
            result.errors.push('System offsets out of file bounds');
        }
    } catch (error) {
        console.error('Error reading system values:', error);
        result.errors.push(`Reading error: ${error.message}`);
    }
    
    // Check Nintendo Switch signature (optional)
    const signature = new TextDecoder().decode(data.subarray(0, 4));
    console.log(`File signature: "${signature}"`);
    
    if (signature === 'SUTC') {
        console.log('✅ Nintendo Switch file detected');
    } else {
        console.log('⚠️ Nintendo Switch signature not found, but file accepted');
    }
    
    // Accept file
    result.valid = true;
    console.log('✅ File accepted for editing');
    
    return result;
}

/**
 * Validates a value for a given statistic
 * @param {string} statName - The statistic name
 * @param {number} value - The value to validate
 * @returns {Object} - Validation result
 */
function validateStatValue(statName, value) {
    const config = STATS_OFFSETS[statName];
    if (!config) {
        return {
            valid: false,
            error: `Unknown statistic: ${statName}`
        };
    }

    const maxValue = config.type === 'uint32' ? 0xFFFFFFFF : 0xFFFF;
    
    if (typeof value !== 'number' || isNaN(value)) {
        return {
            valid: false,
            error: 'Value must be a number'
        };
    }

    if (value < 0) {
        return {
            valid: false,
            error: 'Value cannot be negative'
        };
    }

    if (value > maxValue) {
        return {
            valid: false,
            error: `Value cannot exceed ${maxValue.toLocaleString()}`
        };
    }

    return {
        valid: true,
        value: Math.floor(value)
    };
}