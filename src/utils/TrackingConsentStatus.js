/**
 * Tracking Consent Status Manager
 * Handles tracking consent using LocalStorageManager with 30-day expiration
 */

import { ExpiresAfter } from './LocalStorageManager.js';

// Storage configuration
const CONSENT_STORAGE_KEY = 'tracking-consent-status';
const CONSENT_EXPIRATION_DAYS = 30;
const storage = ExpiresAfter(CONSENT_EXPIRATION_DAYS);

// Consent values
export const CONSENT_VALUES = {
	ALLOWED: 'allowed',
	DENIED: 'denied',
	UNKNOWN: 'unknown'
};

/**
 * Get the current tracking consent status
 * @returns {string} Current consent status (allowed, denied, or unknown)
 */
export function getConsentStatus() {
	const storedConsent = storage.get(CONSENT_STORAGE_KEY);
	return storedConsent || CONSENT_VALUES.UNKNOWN;
}

/**
 * Set the tracking consent status
 * @param {string} status - The consent status to set (allowed or denied)
 * @returns {boolean} True if successfully stored
 */
export function setConsentStatus(status) {
	if (status !== CONSENT_VALUES.ALLOWED && status !== CONSENT_VALUES.DENIED) {
		console.warn('Invalid consent status:', status);
		return false;
	}

	const success = storage.set(CONSENT_STORAGE_KEY, status);
	
	if (success) {
		// Dispatch custom event for other parts of the application
		dispatchConsentEvent(status);
		console.log('Tracking consent set to:', status);
	}
	
	return success;
}

/**
 * Check if tracking consent has been given
 * @returns {boolean} True if user has explicitly allowed tracking
 */
export function hasTrackingConsent() {
	return getConsentStatus() === CONSENT_VALUES.ALLOWED;
}

/**
 * Check if tracking consent has been explicitly denied
 * @returns {boolean} True if user has explicitly denied tracking
 */
export function hasTrackingDenied() {
	return getConsentStatus() === CONSENT_VALUES.DENIED;
}

/**
 * Check if consent status is unknown (user hasn't decided yet)
 * @returns {boolean} True if consent status is unknown
 */
export function isConsentUnknown() {
	return getConsentStatus() === CONSENT_VALUES.UNKNOWN;
}

/**
 * Check if the consent popup should be shown
 * @returns {boolean} True if popup should be displayed
 */
export function shouldShowConsentPopup() {
	return isConsentUnknown();
}

/**
 * Clear the consent status (for testing or reset purposes)
 * @returns {boolean} True if successfully cleared
 */
export function clearConsentStatus() {
	const success = storage.remove(CONSENT_STORAGE_KEY);
	
	if (success) {
		dispatchConsentEvent(CONSENT_VALUES.UNKNOWN);
		console.log('Tracking consent cleared');
	}
	
	return success;
}

/**
 * Get consent status information for debugging
 * @returns {object} Object with consent details
 */
export function getConsentInfo() {
	const status = getConsentStatus();
	const hasConsent = hasTrackingConsent();
	const isDenied = hasTrackingDenied();
	const isUnknown = isConsentUnknown();
	const shouldShow = shouldShowConsentPopup();

	return {
		status,
		hasConsent,
		isDenied,
		isUnknown,
		shouldShowPopup: shouldShow,
		expirationDays: CONSENT_EXPIRATION_DAYS,
		storageKey: CONSENT_STORAGE_KEY
	};
}

/**
 * Dispatch a custom event when consent status changes
 * @param {string} status - The new consent status
 */
function dispatchConsentEvent(status) {
	try {
		const event = new CustomEvent('trackingConsentChanged', {
			detail: {
				status,
				hasConsent: status === CONSENT_VALUES.ALLOWED,
				isDenied: status === CONSENT_VALUES.DENIED,
				isUnknown: status === CONSENT_VALUES.UNKNOWN,
				timestamp: Date.now()
			}
		});
		
		document.dispatchEvent(event);
	} catch (error) {
		console.warn('Failed to dispatch consent event:', error);
	}
}

/**
 * Initialize tracking consent functionality
 * Sets up event listeners and initial state
 */
export function initTrackingConsent() {
	// Check if we should show the popup on page load
	if (shouldShowConsentPopup()) {
		console.log('Tracking consent status unknown - popup should be shown');
	} else {
		console.log('Tracking consent status:', getConsentStatus());
	}

	// Optional: Listen for storage changes from other tabs/windows
	window.addEventListener('storage', (event) => {
		if (event.key === CONSENT_STORAGE_KEY) {
			const newStatus = event.newValue ? JSON.parse(event.newValue).value : CONSENT_VALUES.UNKNOWN;
			console.log('Tracking consent updated from another tab:', newStatus);
			dispatchConsentEvent(newStatus);
		}
	});
}

/**
 * Handle consent popup actions
 * @param {string} action - The action taken (allow or deny)
 */
export function handleConsentAction(action) {
	let status;
	
	switch (action) {
		case 'allow':
			status = CONSENT_VALUES.ALLOWED;
			break;
		case 'deny':
			status = CONSENT_VALUES.DENIED;
			break;
		default:
			console.warn('Unknown consent action:', action);
			return false;
	}

	return setConsentStatus(status);
}