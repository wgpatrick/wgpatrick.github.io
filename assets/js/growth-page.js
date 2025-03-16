/**
 * Custom JavaScript for the growth experiment page
 * Extends HyphaeGrowth to override specific behaviors
 */

// Wait for the HyphaeGrowth class to be available
document.addEventListener('DOMContentLoaded', () => {
  // Only proceed if we're on the growth page and HyphaeGrowth exists
  if (!window.location.pathname.includes('/growth') || typeof HyphaeGrowth !== 'function') {
    return;
  }
  
  // Override the createEntrance method to remove the circle and navigation
  const originalCreateEntrance = HyphaeGrowth.prototype.createEntrance;
  HyphaeGrowth.prototype.createEntrance = function() {
    // Skip adding click navigation and circle mask
    // But still create the text element (though we won't show it)
    this.enterText = document.createElementNS("http://www.w3.org/2000/svg", "text");
    this.enterText.setAttribute("opacity", "0");
    this.svg.appendChild(this.enterText);
    
    // Explicitly remove any click event from the SVG
    this.svg.onclick = null;
    this.svg.style.cursor = 'default';
    
    // Remove event listeners
    const newSvg = this.svg.cloneNode(true);
    this.svg.parentNode.replaceChild(newSvg, this.svg);
    this.svg = newSvg;
  };
  
  // Override the createHiMask method to do nothing
  HyphaeGrowth.prototype.createHiMask = function() {
    // Completely skip creating the mask circle
    // If a circle was already created, find and remove it
    setTimeout(() => {
      const existingMask = document.getElementById('growth-mask');
      if (existingMask) {
        existingMask.remove();
      }
      
      // Also remove any circles in the SVG that might be the center circle
      const circles = document.querySelectorAll('#growth-animation circle');
      circles.forEach(circle => {
        const cx = parseFloat(circle.getAttribute('cx') || '0');
        const cy = parseFloat(circle.getAttribute('cy') || '0');
        const r = parseFloat(circle.getAttribute('r') || '0');
        
        // If this is a circle in the center with approximately the right radius, remove it
        const svg = document.getElementById('growth-animation');
        const svgRect = svg.getBoundingClientRect();
        const centerX = svgRect.width / 2;
        const centerY = svgRect.height / 2;
        
        if (Math.abs(cx - centerX) < 10 && Math.abs(cy - centerY) < 10 && r >= 10) {
          circle.remove();
        }
      });
    }, 100); // Slight delay to ensure the DOM is updated
  };
  
  // Override the isOccupied method to disable the center circle check
  const originalIsOccupied = HyphaeGrowth.prototype.isOccupied;
  HyphaeGrowth.prototype.isOccupied = function(x, y) {
    const config = HyphaeGrowth.CONFIG;
    
    // Skip the center circle check - this is the key change!
    // The original method has this check:
    // const dx = x - (this.viewBoxWidth / 2);
    // const dy = y - (this.viewBoxHeight / 2);
    // const distance = Math.sqrt(dx * dx + dy * dy);
    // if (distance < config.CIRCLE_RADIUS) {
    //   return true;
    // }
    
    // Check if point is too close to existing branches only
    const minDistance = config.MIN_DISTANCE;
    return this.branches.some(branch => {
      // Check endpoints first (quick rejection)
      const d1 = Math.hypot(x - branch.x1, y - branch.y1);
      const d2 = Math.hypot(x - branch.x2, y - branch.y2);
      
      if (d1 < minDistance || d2 < minDistance) {
        return true;
      }
      
      // Do more precise line segment distance check for close branches
      if (d1 < minDistance * 2 || d2 < minDistance * 2) {
        return this.pointToLineDistance(x, y, branch.x1, branch.y1, branch.x2, branch.y2) < minDistance;
      }
      
      return false;
    });
  };
  
  // Need to include the pointToLineDistance function since we're using it
  HyphaeGrowth.prototype.pointToLineDistance = function(px, py, x1, y1, x2, y2) {
    // Calculate squared length of line segment
    const lengthSq = (x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1);
    if (lengthSq === 0) return Math.hypot(px - x1, py - y1); // Line segment is a point
    
    // Calculate projection proportion along line segment
    const t = Math.max(0, Math.min(1, ((px - x1) * (x2 - x1) + (py - y1) * (y2 - y1)) / lengthSq));
    
    // Calculate closest point on line segment
    const closestX = x1 + t * (x2 - x1);
    const closestY = y1 + t * (y2 - y1);
    
    // Return distance to closest point
    return Math.hypot(px - closestX, py - closestY);
  };
  
  console.log('Growth page overrides applied');
  
  // Additional cleanup after page loads
  window.addEventListener('load', () => {
    // Remove any existing circles that match our criteria
    const circles = document.querySelectorAll('#growth-animation circle');
    circles.forEach(circle => {
      if (circle.id === 'growth-mask' || !circle.getAttribute('fill') || circle.getAttribute('fill') === 'none') {
        circle.remove();
      }
    });
  });
}); 