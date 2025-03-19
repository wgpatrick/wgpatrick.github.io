/***
 * CV Annotations Fix
 * This script fixes the annotation system on the CV page
 * It runs after all other scripts have loaded
 */

console.log('CV Annotations Fix: Script loaded');

// Fix for missing entries and ensure annotations work properly
document.addEventListener('DOMContentLoaded', function() {
  // Wait for other scripts to load - use a longer timeout to ensure everything is ready
  setTimeout(function() {
    console.log('CV Annotations Fix: Checking annotation system');
    
    // Check if we're on the CV page
    if (!document.body.classList.contains('cv-page')) {
      console.log('CV Annotations Fix: Not on CV page, exiting');
      return;
    }
    
    // CRITICAL: The issue might be that itemData is defined as a local variable in other scripts
    // Make sure it's properly set on the window object for global access
    console.log('CV Annotations Fix: Current itemData:', typeof itemData !== 'undefined' ? Object.keys(itemData).length + ' entries' : 'undefined');
    
    // Force copy all data to a global variable that both scripts can access
    if (typeof itemData !== 'undefined') {
      console.log('CV Annotations Fix: Creating global reference to itemData');
      window.annotationData = itemData;
      
      // Add custom hook to override the item lookup
      const originalSetupAnnotations = window.setupAnnotations;
      if (typeof originalSetupAnnotations === 'function') {
        console.log('CV Annotations Fix: Overriding setupAnnotations');
        
        // Override to use the merged data
        window.setupAnnotations = function() {
          console.log('CV Annotations Fix: Running enhanced setupAnnotations');
          
          // Run the original function
          const result = originalSetupAnnotations.apply(this, arguments);
          
          // After setup, override the click handlers to use our merged data
          document.querySelectorAll('.annotated-term').forEach(function(item) {
            // Remove existing click handlers
            const clone = item.cloneNode(true);
            item.parentNode.replaceChild(clone, item);
            
            // Add our enhanced click handler
            clone.addEventListener('click', function(e) {
              e.preventDefault();
              e.stopPropagation();
              
              const id = this.dataset.id;
              console.log('CV Annotations Fix: Term clicked:', id);
              
              // Use our merged data source
              if (window.annotationData && window.annotationData[id]) {
                const data = window.annotationData[id];
                
                // Get the annotation panel
                const panel = document.querySelector('.annotation-panel');
                const title = document.querySelector('.annotation-title');
                const body = document.querySelector('.annotation-body');
                
                if (panel && title && body) {
                  // Update content
                  title.textContent = data.title || id;
                  body.innerHTML = data.summary || (data.body || '');
                  
                  // Show the panel
                  panel.style.display = 'block';
                  panel.classList.add('visible');
                  
                  // Position it in the right margin like blog posts
                  const rect = this.getBoundingClientRect();
                  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                  const viewportWidth = window.innerWidth;
                  const panelWidth = panel.offsetWidth || 300; // Fallback width
                  const panelHeight = panel.offsetHeight || 200; // Fallback height
                  
                  // Get the content container width
                  const contentContainer = document.querySelector('.wrapper') || document.querySelector('.page-content');
                  const contentWidth = contentContainer ? contentContainer.getBoundingClientRect().width : 800;
                  const contentRight = contentContainer ? contentContainer.getBoundingClientRect().right : 800;
                  
                  // Position in right margin (aligned with right edge of content container)
                  let top = rect.top + scrollTop - 20; // Slightly above the element
                  let left = contentRight + 20; // 20px to the right of content area
                  
                  // Ensure the annotation doesn't go off the right side of the screen
                  if (left + panelWidth > viewportWidth - 20) {
                    left = Math.max(viewportWidth - panelWidth - 20, contentRight - panelWidth);
                  }
                  
                  // Make sure panel is within viewport vertically
                  if (top + panelHeight > scrollTop + window.innerHeight - 20) {
                    // If it would go off the bottom of the screen, align bottom of panel with bottom of viewport
                    top = scrollTop + window.innerHeight - panelHeight - 20;
                  }
                  
                  // Make sure it's not above the top of the viewport
                  if (top < scrollTop + 20) {
                    top = scrollTop + 20;
                  }
                  
                  // For mobile (narrow screens), position below the element
                  if (viewportWidth < 960) {
                    top = rect.bottom + scrollTop + 10;
                    left = Math.max(20, Math.min(rect.left, viewportWidth - panelWidth - 20));
                  }
                  
                  // Apply the position
                  panel.style.top = top + 'px';
                  panel.style.left = left + 'px';
                  
                  console.log('CV Annotations Fix: Positioning panel at', left, top);
                }
              } else {
                console.error('CV Annotations Fix: No data for', id);
              }
            });
          });
          
          return result;
        };
        
        // Run the enhanced setup
        window.setupAnnotations();
      } else {
        console.error('CV Annotations Fix: setupAnnotations function not found');
      }
    } else {
      console.error('CV Annotations Fix: itemData not found!');
    }
  }, 1000); // Longer timeout to ensure everything is loaded
});