/**
 * CV Annotations Wrapper
 * 
 * This script loads CV page annotation data into the central Annotations module.
 * It's a wrapper around the legacy cv-annotations.js to transition to the new system.
 */

// Wait for the Annotations module to be loaded
document.addEventListener('DOMContentLoaded', function() {
  if (typeof Annotations === 'undefined') {
    console.error('CV Annotations Wrapper: Annotations module not found!');
    return;
  }
  
  // If we're on a CV page, make sure we set up
  if (document.body.classList.contains('cv-page')) {
    console.log('CV Annotations Wrapper: Detected CV page, will load data when available');
    
    // Function to check if itemData is available and load it
    function checkAndLoadData() {
      if (typeof itemData !== 'undefined') {
        console.log('CV Annotations Wrapper: Found itemData, loading into module');
        
        // Load data into Annotations module
        Annotations.setData('cv', itemData);
        
        // Initialize citations
        if (typeof Annotations.updateCitationCounts === 'function') {
          Annotations.updateCitationCounts();
        }
        
        // Force reinitialization to ensure everything is properly set up
        console.log('CV Annotations Wrapper: Forcing reinitialization to ensure proper setup');
        if (typeof Annotations.setupHandlers === 'function') {
          setTimeout(() => {
            Annotations.setupHandlers();
          }, 100);
        }
      } else {
        console.log('CV Annotations Wrapper: itemData not yet available, will retry');
        setTimeout(checkAndLoadData, 100);
      }
    }
    
    // Start checking for data
    checkAndLoadData();
  }
});