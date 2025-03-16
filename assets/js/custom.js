/**
 * Main JavaScript for Will Patrick's portfolio site
 * Handles page-specific initialization and UI functionality
 */

document.addEventListener('DOMContentLoaded', function() {
  // Initialize different page types
  initializeIndexPage();
  initializeCvPage();
});

/**
 * Initialize the landing/index page with growth animation
 */
function initializeIndexPage() {
  // Only run on index page
  if (window.location.pathname !== '/' && window.location.pathname !== '/index') {
    return;
  }
  
  const svg = document.getElementById('growth-animation');
  const restartButton = document.getElementById('restartGrowth');
  
  if (!svg || !restartButton) {
    return; // Elements don't exist on this page
  }
  
  let pattern = null;
  let growthInterval = null;
  let enterTextTimer = null; // Timer for showing "Enter" text

  /**
   * Start a new growth animation using requestAnimationFrame for better performance
   */
  function startGrowth() {
    if (growthInterval) {
      cancelAnimationFrame(growthInterval);
      growthInterval = null;
    }
    
    // Clear any existing timer
    if (enterTextTimer) {
      clearTimeout(enterTextTimer);
    }
    
    // Reset the SVG and button
    svg.innerHTML = '';
    restartButton.style.opacity = '0';
    
    // Create new growth pattern
    pattern = new HyphaeGrowth(svg);
    
    // Set timer to show "Enter" text after 1 second regardless of animation state
    enterTextTimer = setTimeout(() => {
      if (pattern && pattern.enterText) {
        pattern.enterText.style.transition = 'opacity 1s';
        pattern.enterText.style.opacity = '1';
        restartButton.style.opacity = '1';
      }
    }, 1000);
    
    // Performance tracking variables
    let lastFrameTime = performance.now();
    let frameCount = 0;
    let growthsPerFrame = 3; // Start with 3 growth steps per frame (faster growth)
    const targetFrameTime = 16.667; // Target 60fps (1000ms / 60frames)
    
    /**
     * Animation loop for growth pattern
     */
    function animateGrowth(timestamp) {
      // Performance optimization: batch multiple growth steps per frame
      // This significantly reduces overhead of animation frame callbacks
      for (let i = 0; i < growthsPerFrame; i++) {
        pattern.grow();
        
        // Check if growth is complete - more lenient to avoid early termination
        if (pattern.points.length === 0 && 
            pattern.branches.length > HyphaeGrowth.CONFIG.MAX_BRANCHES / 2) {
          if (pattern && pattern.enterText && pattern.enterText.style.opacity !== '1') {
            // Show the enter text and restart button if not already shown by timer
            pattern.enterText.style.transition = 'opacity 1s';
            pattern.enterText.style.opacity = '1';
            restartButton.style.opacity = '1';
          }
          return; // Stop animation
        }
      }
      
      // Adaptive performance: adjust growth steps based on frame time
      frameCount++;
      if (frameCount % 10 === 0) { // Check every 10 frames
        const currentTime = performance.now();
        const frameTime = (currentTime - lastFrameTime) / 10;
        lastFrameTime = currentTime;
        
        // Adjust growths per frame based on performance - allow more growth
        if (frameTime > targetFrameTime * 1.2) {
          // Only slow down if performance is really suffering
          growthsPerFrame = Math.max(1, growthsPerFrame - 1);
        } else if (frameTime < targetFrameTime * 0.8 && growthsPerFrame < 6) {
          // More growth steps per frame, cap at 6 for higher speed
          growthsPerFrame++;
        }
      }
      
      // Request next frame
      growthInterval = requestAnimationFrame(animateGrowth);
    }
    
    // Start animation
    growthInterval = requestAnimationFrame(animateGrowth);
  }

  // Set up event handlers
  restartButton.addEventListener('click', startGrowth);
  
  // Start the initial growth animation
  startGrowth();
}

/**
 * Initialize CV page with special functionality
 */
function initializeCvPage() {
  // Only run on CV page
  if (!window.location.pathname.includes('/cv')) {
    return;
  }
  
  const cvNav = document.querySelector('.cv-nav');
  
  if (cvNav) {
    // Create the PDF download button
    const pdfButton = document.createElement('a');
    pdfButton.href = '#';
    pdfButton.className = 'nav-link pdf-button';
    pdfButton.textContent = 'Download PDF';
    pdfButton.addEventListener('click', function(e) {
      e.preventDefault();
      window.print();
    });
    
    // Add to CV navigation
    cvNav.appendChild(pdfButton);
  }
}