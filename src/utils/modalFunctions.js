/**
 * Modal Functions - Centralized Modal System for ARDA Astro Template
 * Adapted from reference project with theme system integration
 */

// Store currently open modal for focus management
let currentModal = null;
let previousActiveElement = null;

/**
 * Open a modal by ID
 * @param {string} modalId - The ID of the modal to open
 */
export function openModal(modalId) {
	const modal = document.querySelector(`[data-modal-id="${modalId}"]`);
	if (!modal) {
		console.warn(`Modal with ID "${modalId}" not found`);
		return;
	}

	// Store the currently focused element
	previousActiveElement = document.activeElement;

	// Show the modal
	modal.classList.remove('hidden');
	modal.classList.add('flex');

	// Focus management
	setTimeout(() => {
		const focusableElements = modal.querySelectorAll(
			'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
		);
		const firstFocusable = focusableElements[0];
		if (firstFocusable) {
			firstFocusable.focus();
		}
	}, 100);

	// Prevent body scroll with theme-aware padding compensation
	document.body.style.overflow = 'hidden';
	document.body.style.paddingRight = getScrollbarWidth() + 'px';

	currentModal = modal;

	// Add event listeners
	setupModalEventListeners(modal);
	
	// Dispatch custom event for theme system integration
	modal.dispatchEvent(new CustomEvent('modalOpened', {
		detail: { modalId: modalId }
	}));
}

/**
 * Close a modal by ID
 * @param {string} modalId - The ID of the modal to close
 */
export function closeModal(modalId) {
	const modal = document.querySelector(`[data-modal-id="${modalId}"]`);
	if (!modal) {
		console.warn(`Modal with ID "${modalId}" not found`);
		return;
	}

	// Hide the modal
	modal.classList.add('hidden');
	modal.classList.remove('flex');

	// Restore body scroll
	document.body.style.overflow = '';
	document.body.style.paddingRight = '';

	// Restore focus
	if (previousActiveElement) {
		previousActiveElement.focus();
		previousActiveElement = null;
	}

	currentModal = null;

	// Remove event listeners
	removeModalEventListeners(modal);
	
	// Dispatch custom event
	modal.dispatchEvent(new CustomEvent('modalClosed', {
		detail: { modalId: modalId }
	}));
}

/**
 * Close the currently open modal
 */
export function closeCurrentModal() {
	if (currentModal) {
		const modalId = currentModal.getAttribute('data-modal-id');
		closeModal(modalId);
	}
}

/**
 * Setup event listeners for a modal
 * @param {HTMLElement} modal - The modal element
 */
function setupModalEventListeners(modal) {
	// Close on backdrop click
	const backdrop = modal.querySelector('[data-element="backdrop"]');
	if (backdrop) {
		backdrop.addEventListener('click', handleBackdropClick);
	}

	// Close on escape key
	document.addEventListener('keydown', handleEscapeKey);

	// Trap focus within modal
	modal.addEventListener('keydown', handleTabKey);
}

/**
 * Remove event listeners from a modal
 * @param {HTMLElement} modal - The modal element
 */
function removeModalEventListeners(modal) {
	const backdrop = modal.querySelector('[data-element="backdrop"]');
	if (backdrop) {
		backdrop.removeEventListener('click', handleBackdropClick);
	}

	document.removeEventListener('keydown', handleEscapeKey);
	modal.removeEventListener('keydown', handleTabKey);
}

/**
 * Handle backdrop click
 * @param {Event} event - The click event
 */
function handleBackdropClick(event) {
	if (event.target === event.currentTarget) {
		closeCurrentModal();
	}
}

/**
 * Handle escape key press
 * @param {KeyboardEvent} event - The keydown event
 */
function handleEscapeKey(event) {
	if (event.key === 'Escape') {
		closeCurrentModal();
	}
}

/**
 * Handle tab key for focus trapping
 * @param {KeyboardEvent} event - The keydown event
 */
function handleTabKey(event) {
	if (event.key === 'Tab') {
		const focusableElements = event.currentTarget.querySelectorAll(
			'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
		);
		const firstElement = focusableElements[0];
		const lastElement = focusableElements[focusableElements.length - 1];

		if (event.shiftKey) {
			if (document.activeElement === firstElement) {
				event.preventDefault();
				lastElement.focus();
			}
		} else {
			if (document.activeElement === lastElement) {
				event.preventDefault();
				firstElement.focus();
			}
		}
	}
}

/**
 * Get the width of the scrollbar to prevent layout shift
 * @returns {number} The scrollbar width
 */
function getScrollbarWidth() {
	const outer = document.createElement('div');
	outer.style.visibility = 'hidden';
	outer.style.overflow = 'scroll';
	document.body.appendChild(outer);

	const inner = document.createElement('div');
	outer.appendChild(inner);

	const scrollbarWidth = outer.offsetWidth - inner.offsetWidth;
	outer.parentNode.removeChild(outer);

	return scrollbarWidth;
}

/**
 * Initialize modal functionality
 * Sets up click handlers for modal open/close buttons
 */
export function initModals() {
	// Handle modal open buttons
	document.addEventListener('click', (event) => {
		const openButton = event.target.closest('[data-modal-open]');
		if (openButton) {
			event.preventDefault();
			const modalId = openButton.getAttribute('data-modal-open');
			openModal(modalId);
		}
	});

	// Handle modal close buttons
	document.addEventListener('click', (event) => {
		const closeButton = event.target.closest('[data-modal-close]');
		if (closeButton) {
			event.preventDefault();
			const modalId = closeButton.getAttribute('data-modal-close');
			if (modalId) {
				closeModal(modalId);
			} else {
				// If no specific modal ID, close current modal
				closeCurrentModal();
			}
		}
	});
}

// Make modal functions globally available for theme system compatibility
if (typeof window !== 'undefined') {
	window.openModal = openModal;
	window.closeModal = closeModal;
	window.closeCurrentModal = closeCurrentModal;
}

// Auto-initialize when DOM is ready
if (typeof document !== 'undefined') {
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', initModals);
	} else {
		initModals();
	}
}