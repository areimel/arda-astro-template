/**
 * LocalStorage Manager - Handles localStorage operations with timestamped expiration
 */

/**
 * Set data in localStorage with expiration
 * @param {string} key - The storage key
 * @param {any} value - The value to store
 * @param {number} expirationDays - Number of days until expiration
 */
export function setWithExpiration(key, value, expirationDays) {
	try {
		const item = {
			value: value,
			timestamp: Date.now(),
			expirationDays: expirationDays
		};
		localStorage.setItem(key, JSON.stringify(item));
		return true;
	} catch (error) {
		console.warn('LocalStorage setWithExpiration failed:', error);
		return false;
	}
}

/**
 * Get data from localStorage, checking for expiration
 * @param {string} key - The storage key
 * @returns {any|null} The stored value or null if expired/not found
 */
export function getWithExpiration(key) {
	try {
		const itemStr = localStorage.getItem(key);
		if (!itemStr) {
			return null;
		}

		const item = JSON.parse(itemStr);
		const now = Date.now();
		const expirationTime = item.timestamp + (item.expirationDays * 24 * 60 * 60 * 1000);

		// Check if item has expired
		if (now > expirationTime) {
			localStorage.removeItem(key);
			return null;
		}

		return item.value;
	} catch (error) {
		console.warn('LocalStorage getWithExpiration failed:', error);
		// Clean up corrupted data
		localStorage.removeItem(key);
		return null;
	}
}

/**
 * Remove data from localStorage
 * @param {string} key - The storage key to remove
 */
export function removeItem(key) {
	try {
		localStorage.removeItem(key);
		return true;
	} catch (error) {
		console.warn('LocalStorage removeItem failed:', error);
		return false;
	}
}

/**
 * Check if a key exists and is not expired
 * @param {string} key - The storage key
 * @returns {boolean} True if key exists and is valid
 */
export function exists(key) {
	return getWithExpiration(key) !== null;
}

/**
 * Clear all expired items from localStorage
 * This function scans all localStorage items and removes expired ones
 */
export function clearExpired() {
	try {
		const keys = Object.keys(localStorage);
		let clearedCount = 0;

		keys.forEach(key => {
			try {
				const itemStr = localStorage.getItem(key);
				if (itemStr) {
					const item = JSON.parse(itemStr);
					// Check if it's one of our timestamped items
					if (item.timestamp && item.expirationDays) {
						const now = Date.now();
						const expirationTime = item.timestamp + (item.expirationDays * 24 * 60 * 60 * 1000);
						
						if (now > expirationTime) {
							localStorage.removeItem(key);
							clearedCount++;
						}
					}
				}
			} catch (error) {
				// If we can't parse it, it might be corrupted or not one of ours
				// Skip it for safety
			}
		});

		return clearedCount;
	} catch (error) {
		console.warn('LocalStorage clearExpired failed:', error);
		return 0;
	}
}

/**
 * Helper function to create expiration-based storage operations
 * @param {number} numberOfDays - Number of days until expiration
 * @returns {object} Object with set and get methods for the specified expiration
 */
export function ExpiresAfter(numberOfDays) {
	return {
		set: (key, value) => setWithExpiration(key, value, numberOfDays),
		get: (key) => getWithExpiration(key),
		remove: (key) => removeItem(key),
		exists: (key) => exists(key)
	};
}

/**
 * Get storage info for debugging
 * @returns {object} Object with storage statistics
 */
export function getStorageInfo() {
	try {
		const keys = Object.keys(localStorage);
		let totalSize = 0;
		let expiredCount = 0;
		let validCount = 0;

		keys.forEach(key => {
			const value = localStorage.getItem(key);
			totalSize += key.length + (value ? value.length : 0);
			
			try {
				const item = JSON.parse(value);
				if (item.timestamp && item.expirationDays) {
					const now = Date.now();
					const expirationTime = item.timestamp + (item.expirationDays * 24 * 60 * 60 * 1000);
					
					if (now > expirationTime) {
						expiredCount++;
					} else {
						validCount++;
					}
				}
			} catch (error) {
				// Not one of our items
			}
		});

		return {
			totalKeys: keys.length,
			totalSize: totalSize,
			expiredItems: expiredCount,
			validItems: validCount,
			estimatedSizeKB: Math.round(totalSize / 1024)
		};
	} catch (error) {
		console.warn('LocalStorage getStorageInfo failed:', error);
		return null;
	}
}