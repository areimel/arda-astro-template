/**
 * Modal Management System for ARDA Astro Template
 * Provides comprehensive modal functionality with accessibility and theme integration
 * 
 * Features:
 * - Multiple modal support with z-index stacking
 * - Data attribute-driven modal controls
 * - Keyboard navigation (ESC to close)
 * - Click-outside-to-close functionality
 * - Focus management and accessibility
 * - Body scroll locking
 * - Animation support via CSS transitions
 * - Integration with existing theme system
 */

class ModalManager {
  /** @type {Set<string>} */
  openModals;
  /** @type {number} */
  baseZIndex;
  /** @type {HTMLElement | null} */
  lastFocusedElement;
  /** @type {boolean} */
  isInitialized;

  constructor() {
    this.openModals = new Set();
    this.baseZIndex = 1000;
    this.lastFocusedElement = null;
    this.isInitialized = false;
    
    // Auto-initialize when DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.initializeModalSystem());
    } else {
      this.initializeModalSystem();
    }
  }

  /**
   * Initialize the modal system with all event listeners
   */
  initializeModalSystem() {
    if (this.isInitialized) {
      console.warn('Modal system already initialized');
      return;
    }

    this.setupGlobalEventListeners();
    this.setupDataAttributeHandlers();
    this.isInitialized = true;
    
    console.log('Modal system initialized');
  }

  /**
   * Set up global event listeners for keyboard and click handling
   */
  setupGlobalEventListeners() {
    // Handle escape key to close topmost modal
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.openModals.size > 0) {
        e.preventDefault();
        this.closeTopModal();
      }
    });

    // Handle backdrop clicks (delegate to document for performance)
    document.addEventListener('click', (e) => {
      const target = e.target;
      if (!target || !target.classList) return;

      // Check if clicked element is a modal backdrop
      if (target.classList.contains('modal-backdrop')) {
        // Find the parent modal element to get the modal ID
        const modal = target.closest('[data-modal-id]');
        if (modal) {
          const modalId = modal.dataset.modalId;
          if (modalId) {
            this.closeModal(modalId);
          }
        }
      }
    });
  }

  /**
   * Set up automatic event handlers for data attributes
   */
  setupDataAttributeHandlers() {
    // Handle modal open triggers
    document.addEventListener('click', (e) => {
      const target = e.target.closest('[data-modal-open]');
      if (target) {
        e.preventDefault();
        const modalId = target.dataset.modalOpen;
        if (modalId) {
          this.openModal(modalId);
        }
      }
    });

    // Handle modal close triggers
    document.addEventListener('click', (e) => {
      const target = e.target.closest('[data-modal-close]');
      if (target) {
        e.preventDefault();
        const modalId = target.dataset.modalClose;
        if (modalId) {
          this.closeModal(modalId);
        } else {
          // If no specific modal ID, close the topmost modal
          this.closeTopModal();
        }
      }
    });
  }

  /**
   * Open a specific modal by ID
   * @param {string} modalId - The ID of the modal to open
   * @returns {boolean} - Success status
   */
  openModal(modalId) {
    if (!modalId) {
      console.error('Modal ID is required');
      return false;
    }

    const modal = document.querySelector(`[data-modal-id="${modalId}"]`);
    if (!modal) {
      console.error(`Modal with ID "${modalId}" not found`);
      return false;
    }

    // Store last focused element for restoration
    if (!this.lastFocusedElement && document.activeElement) {
      this.lastFocusedElement = document.activeElement;
    }

    // Add to open modals set
    this.openModals.add(modalId);

    // Calculate z-index for stacking
    const zIndex = this.baseZIndex + this.openModals.size;
    modal.style.zIndex = zIndex.toString();

    // Add modal-open class for CSS animations (consistent with ModalWrapper)
    modal.classList.add('modal-open');
    modal.style.visibility = 'visible';
    
    // Update accessibility attributes
    modal.setAttribute('aria-hidden', 'false');
    modal.setAttribute('aria-modal', 'true');

    // Lock body scroll if this is the first modal
    if (this.openModals.size === 1) {
      this.lockBodyScroll();
    }

    // Focus management - focus first focusable element in modal
    this.setModalFocus(modal);

    // Dispatch custom event for external listeners
    this.dispatchModalEvent('modalOpened', modalId, modal);

    console.log(`Modal "${modalId}" opened`);
    return true;
  }

  /**
   * Close a specific modal by ID
   * @param {string} modalId - The ID of the modal to close
   * @returns {boolean} - Success status
   */
  closeModal(modalId) {
    if (!modalId) {
      console.error('Modal ID is required');
      return false;
    }

    const modal = document.querySelector(`[data-modal-id="${modalId}"]`);
    if (!modal || !this.openModals.has(modalId)) {
      console.warn(`Modal "${modalId}" is not open or doesn't exist`);
      return false;
    }

    // Remove from open modals set
    this.openModals.delete(modalId);

    // Remove modal-open class for CSS animations
    modal.classList.remove('modal-open');
    
    // Update accessibility attributes
    modal.setAttribute('aria-hidden', 'true');
    modal.removeAttribute('aria-modal');

    // Hide modal after animation completes
    setTimeout(() => {
      modal.style.visibility = 'hidden';
      modal.style.zIndex = '';
    }, 300);

    // Unlock body scroll if no modals are open
    if (this.openModals.size === 0) {
      this.unlockBodyScroll();
      this.restoreFocus();
    } else {
      // Focus the next topmost modal
      const remainingModals = Array.from(this.openModals);
      const topModalId = remainingModals[remainingModals.length - 1];
      const topModal = document.querySelector(`[data-modal-id="${topModalId}"]`);
      if (topModal) {
        this.setModalFocus(topModal);
      }
    }

    // Dispatch custom event for external listeners
    this.dispatchModalEvent('modalClosed', modalId, modal);

    console.log(`Modal "${modalId}" closed`);
    return true;
  }

  /**
   * Close all open modals
   * @returns {number} - Number of modals closed
   */
  closeAllModals() {
    const modalIds = Array.from(this.openModals);
    let closedCount = 0;

    modalIds.forEach(modalId => {
      if (this.closeModal(modalId)) {
        closedCount++;
      }
    });

    console.log(`Closed ${closedCount} modal(s)`);
    return closedCount;
  }

  /**
   * Close the topmost (most recently opened) modal
   * @returns {boolean} - Success status
   */
  closeTopModal() {
    if (this.openModals.size === 0) {
      return false;
    }

    const modalIds = Array.from(this.openModals);
    const topModalId = modalIds[modalIds.length - 1];
    return this.closeModal(topModalId);
  }

  /**
   * Check if a specific modal is open
   * @param {string} modalId - The ID of the modal to check
   * @returns {boolean} - Whether the modal is open
   */
  isModalOpen(modalId) {
    return this.openModals.has(modalId);
  }

  /**
   * Get list of currently open modal IDs
   * @returns {string[]} - Array of open modal IDs
   */
  getOpenModals() {
    return Array.from(this.openModals);
  }

  /**
   * Set focus to the first focusable element in a modal
   * @param {HTMLElement} modal - The modal element
   */
  setModalFocus(modal) {
    const focusableElements = this.getFocusableElements(modal);
    if (focusableElements.length > 0) {
      focusableElements[0].focus();
    } else {
      // If no focusable elements, focus the modal itself
      modal.setAttribute('tabindex', '-1');
      modal.focus();
    }
  }

  /**
   * Get all focusable elements within a container
   * @param {HTMLElement} container - The container to search within
   * @returns {HTMLElement[]} - Array of focusable elements
   */
  getFocusableElements(container) {
    const focusableSelectors = [
      'button:not([disabled]):not([aria-hidden="true"])',
      'input:not([disabled]):not([type="hidden"]):not([aria-hidden="true"])',
      'select:not([disabled]):not([aria-hidden="true"])',
      'textarea:not([disabled]):not([aria-hidden="true"])',
      'a[href]:not([aria-hidden="true"])',
      '[tabindex]:not([tabindex="-1"]):not([aria-hidden="true"])',
      '[contenteditable="true"]:not([aria-hidden="true"])'
    ];

    return Array.from(container.querySelectorAll(focusableSelectors.join(', ')))
      .filter(el => this.isElementVisible(el));
  }

  /**
   * Check if an element is visible
   * @param {HTMLElement} element - The element to check
   * @returns {boolean} - Whether the element is visible
   */
  isElementVisible(element) {
    const style = window.getComputedStyle(element);
    return (
      style.display !== 'none' &&
      style.visibility !== 'hidden' &&
      style.opacity !== '0' &&
      element.offsetWidth > 0 &&
      element.offsetHeight > 0
    );
  }

  /**
   * Lock body scroll to prevent background scrolling
   */
  lockBodyScroll() {
    // Store current scroll position
    const scrollY = window.scrollY;
    document.body.dataset.scrollY = scrollY.toString();

    // Apply scroll lock styles
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';
    document.body.classList.add('modal-open');
  }

  /**
   * Unlock body scroll and restore scroll position
   */
  unlockBodyScroll() {
    // Get stored scroll position
    const scrollY = document.body.dataset.scrollY || '0';
    
    // Remove scroll lock styles
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    document.body.classList.remove('modal-open');
    
    // Restore scroll position
    window.scrollTo(0, parseInt(scrollY, 10));
    
    // Clean up
    delete document.body.dataset.scrollY;
  }

  /**
   * Restore focus to the previously focused element
   */
  restoreFocus() {
    if (this.lastFocusedElement && typeof this.lastFocusedElement.focus === 'function') {
      try {
        this.lastFocusedElement.focus();
      } catch (e) {
        console.warn('Could not restore focus to previous element:', e);
      }
    }
    this.lastFocusedElement = null;
  }

  /**
   * Dispatch custom modal events
   * @param {string} eventType - The type of event to dispatch
   * @param {string} modalId - The modal ID
   * @param {HTMLElement} modal - The modal element
   */
  dispatchModalEvent(eventType, modalId, modal) {
    const event = new CustomEvent(eventType, {
      detail: {
        modalId: modalId,
        modal: modal,
        openModals: this.getOpenModals()
      }
    });
    document.dispatchEvent(event);
  }

  /**
   * Destroy the modal system and clean up event listeners
   */
  destroy() {
    this.closeAllModals();
    this.isInitialized = false;
    // Note: Event listeners are attached to document and will be cleaned up automatically
    console.log('Modal system destroyed');
  }
}

// Create global instance
const modalManager = new ModalManager();

// Export functions for external use
export const openModal = (modalId) => modalManager.openModal(modalId);
export const closeModal = (modalId) => modalManager.closeModal(modalId);
export const closeAllModals = () => modalManager.closeAllModals();
export const closeTopModal = () => modalManager.closeTopModal();
export const isModalOpen = (modalId) => modalManager.isModalOpen(modalId);
export const getOpenModals = () => modalManager.getOpenModals();
export const initializeModalSystem = () => modalManager.initializeModalSystem();

// Also attach to window for non-module usage
if (typeof window !== 'undefined') {
  window.modalManager = modalManager;
  window.openModal = openModal;
  window.closeModal = closeModal;
  window.closeAllModals = closeAllModals;
  window.closeTopModal = closeTopModal;
  window.isModalOpen = isModalOpen;
  window.getOpenModals = getOpenModals;
  window.initializeModalSystem = initializeModalSystem;
}

// Export the main class for advanced usage
export default ModalManager;