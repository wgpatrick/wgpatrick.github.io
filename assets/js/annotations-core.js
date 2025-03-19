/**
 * Annotations Core Module
 * 
 * This module provides a centralized system for managing annotations
 * across the website. It handles both CV page and blog post annotations.
 */

// Define the Annotations module
const Annotations = {
  // Configuration
  config: {
    selectors: {
      term: '.annotated-term',
      panel: '.annotation-panel',
      title: '.annotation-title', 
      body: '.annotation-body',
      close: '.close-button'
    },
    debug: true  // Set to true for detailed console logs
  },
  
  // Data storage
  data: {
    cv: {},      // CV page annotations
    blog: {},    // Blog post annotations
    current: {}  // Points to the active data source
  },
  
  // Logging system
  log: function(message) {
    if (this.config.debug) {
      console.log('Annotations:', message);
    }
  },
  
  error: function(message) {
    console.error('Annotations Error:', message);
  },
  
  // Core initialization
  init: function() {
    this.log('Module initializing');
    
    // For step 1, we'll just call the existing setupAnnotations
    // In later steps, we'll replace this with our own implementation
    if (typeof setupAnnotations === 'function') {
      this.log('Found existing setupAnnotations function, calling it');
      setupAnnotations();
    } else {
      this.error('setupAnnotations function not found');
    }
    
    this.log('Module initialization complete');
  }
};

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', function() {
  Annotations.log('DOM ready, initializing Annotations module');
  Annotations.init();
});