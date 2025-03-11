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

  /**
   * Start a new growth animation using requestAnimationFrame for better performance
   */
  function startGrowth() {
    if (growthInterval) {
      cancelAnimationFrame(growthInterval);
      growthInterval = null;
    }
    
    // Reset the SVG and button
    svg.innerHTML = '';
    restartButton.style.opacity = '0';
    
    // Create new growth pattern
    pattern = new HyphaeGrowth(svg);
    
    // Performance tracking variables
    let lastFrameTime = performance.now();
    let frameCount = 0;
    let growthsPerFrame = 1; // Start with 1 growth step per frame (more conservative)
    const targetFrameTime = 16.67; // Target ~60fps (16.67ms per frame)
    
    // Animation loop using requestAnimationFrame
    function animateGrowth(timestamp) {
      // Performance optimization: batch multiple growth steps per frame
      // This significantly reduces overhead of animation frame callbacks
      for (let i = 0; i < growthsPerFrame; i++) {
        pattern.grow();
        
        // Check if growth is complete - more lenient to avoid early termination
        if (pattern.points.length === 0 && 
            pattern.branches.length > HyphaeGrowth.CONFIG.MAX_BRANCHES / 2) {
          // Show the enter text and restart button
          pattern.enterText.style.transition = 'opacity 1s';
          pattern.enterText.style.opacity = '1';
          restartButton.style.opacity = '1';
          return; // Stop animation
        }
      }
      
      // Adaptive performance: adjust growth steps based on frame time
      frameCount++;
      if (frameCount % 10 === 0) { // Check every 10 frames
        const currentTime = performance.now();
        const frameTime = (currentTime - lastFrameTime) / 10;
        lastFrameTime = currentTime;
        
        // Adjust growths per frame based on performance - more conservative
        if (frameTime > targetFrameTime * 1.1) {
          // Too slow, reduce work per frame more aggressively
          growthsPerFrame = Math.max(1, growthsPerFrame - 1);
        } else if (frameTime < targetFrameTime * 0.7 && growthsPerFrame < 4) {
          // Only increase if we have significant headroom and cap at 4 branches per frame
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