---
layout: default
title: "Organic Growth Patterns"
permalink: /growth/
---

<link rel="stylesheet" href="/assets/css/growth-header-fix.css">

<div class="growth-container" style="cursor: default;">
  <svg id="growth-animation" preserveAspectRatio="xMidYMid meet">
    <!-- The generative pattern will be drawn here -->
  </svg>
</div>

<button id="restartGrowth" class="restart-button">Restart Growth</button>

<div class="controls-panel">
  <h3>Growth Controls</h3>
  <div class="control-group">
    <label for="seedCount">Seed Points:</label>
    <input type="range" id="seedCount" min="1" max="8" value="3" step="1">
    <span id="seedCountValue">3</span>
  </div>
  <div class="control-group">
    <label for="branchProb">Branching:</label>
    <input type="range" id="branchProb" min="0.05" max="0.3" value="0.28" step="0.01">
    <span id="branchProbValue">0.28</span>
  </div>
  <div class="control-group">
    <label for="tropismStrength">Tropism:</label>
    <input type="range" id="tropismStrength" min="0" max="0.4" value="0.15" step="0.01">
    <span id="tropismValue">0.15</span>
  </div>
  <div class="control-group">
    <button id="toggleGoldenAngle" class="toggle-button active">Golden Angle</button>
    <button id="toggleGravity" class="toggle-button active">Gravity</button>
  </div>
</div>

<link rel="stylesheet" href="/assets/css/growth.css">
<link rel="stylesheet" href="/assets/css/growth-lab.css">
<script src="/assets/js/growth-page.js"></script>

<script>
document.addEventListener('DOMContentLoaded', () => {
  const svg = document.getElementById('growth-animation');
  const restartButton = document.getElementById('restartGrowth');
  let pattern = null;
  let growthInterval = null;
  
  // Control elements
  const seedCountSlider = document.getElementById('seedCount');
  const seedCountValue = document.getElementById('seedCountValue');
  const branchProbSlider = document.getElementById('branchProb');
  const branchProbValue = document.getElementById('branchProbValue');
  const tropismSlider = document.getElementById('tropismStrength');
  const tropismValue = document.getElementById('tropismValue');
  const toggleGoldenAngle = document.getElementById('toggleGoldenAngle');
  const toggleGravity = document.getElementById('toggleGravity');
  
  // Disable the center circle immediately by setting its radius to 0
  // This needs to happen before any HyphaeGrowth instances are created
  HyphaeGrowth.CONFIG.CIRCLE_RADIUS = 0;
  
  // Update config with control values
  function updateConfig() {
    HyphaeGrowth.CONFIG.MIN_SEEDS = parseInt(seedCountSlider.value);
    HyphaeGrowth.CONFIG.MAX_SEEDS = parseInt(seedCountSlider.value) + 1;
    HyphaeGrowth.CONFIG.BRANCHING_PROBABILITY = parseFloat(branchProbSlider.value);
    HyphaeGrowth.CONFIG.PHOTOTROPISM = parseFloat(tropismSlider.value);
    
    // Toggle features
    HyphaeGrowth.CONFIG.USE_GOLDEN_ANGLE = toggleGoldenAngle.classList.contains('active');
    HyphaeGrowth.CONFIG.USE_GRAVITY = toggleGravity.classList.contains('active');
    
    // Ensure the center circle radius stays at 0
    HyphaeGrowth.CONFIG.CIRCLE_RADIUS = 0;
    
    // Update display values
    seedCountValue.textContent = seedCountSlider.value;
    branchProbValue.textContent = branchProbSlider.value;
    tropismValue.textContent = tropismSlider.value;
  }
  
  // Initialize growth pattern
  function startGrowth() {
    if (growthInterval) clearInterval(growthInterval);
    svg.innerHTML = '';
    restartButton.style.opacity = '0';
    
    updateConfig();
    pattern = new HyphaeGrowth(svg);
    
    growthInterval = setInterval(() => {
      pattern.grow();
      if (pattern.points.length === 0 || pattern.branches.length > HyphaeGrowth.CONFIG.MAX_BRANCHES) {
        clearInterval(growthInterval);
        restartButton.style.opacity = '1';
      }
    }, 10);
    
    // Remove center circle after a short delay
    setTimeout(() => {
      removeGrowthMask();
    }, 100);
  }
  
  // Function to remove the center circle
  function removeGrowthMask() {
    // Target by ID
    const mask = document.getElementById('growth-mask');
    if (mask) mask.remove();
    
    // Target all circles and check their attributes
    const circles = svg.querySelectorAll('circle');
    circles.forEach(circle => {
      const cx = circle.getAttribute('cx');
      const cy = circle.getAttribute('cy');
      const r = circle.getAttribute('r');
      
      // If it's a center circle with radius around 15
      if (r && parseFloat(r) >= 10 && parseFloat(r) <= 20) {
        circle.remove();
      }
    });
  }
  
  // Add event listeners
  restartButton.addEventListener('click', startGrowth);
  seedCountSlider.addEventListener('input', () => {
    seedCountValue.textContent = seedCountSlider.value;
  });
  branchProbSlider.addEventListener('input', () => {
    branchProbValue.textContent = branchProbSlider.value;
  });
  tropismSlider.addEventListener('input', () => {
    tropismValue.textContent = tropismSlider.value;
  });
  
  // Toggle buttons
  toggleGoldenAngle.addEventListener('click', () => {
    toggleGoldenAngle.classList.toggle('active');
  });
  toggleGravity.addEventListener('click', () => {
    toggleGravity.classList.toggle('active');
  });
  
  // Start initial growth
  startGrowth();
  
  // Extra safety - remove any center circle after everything is loaded
  window.addEventListener('load', removeGrowthMask);
});
</script>

<!-- Final Circle Removal Script - runs after everything else -->
<script>
(function() {
  // Run immediately and also after a delay to catch any late-rendered circles
  function removeCircle() {
    const svg = document.getElementById('growth-animation');
    if (!svg) return;
    
    // Remove specific circle
    const mask = document.getElementById('growth-mask');
    if (mask) mask.remove();
    
    // Find all circles in the SVG
    const circles = svg.querySelectorAll('circle');
    circles.forEach(circle => {
      // Target larger circles that might be in the center
      const r = circle.getAttribute('r');
      if (r && parseFloat(r) >= 10) {
        circle.remove();
      }
    });
  }
  
  // Run immediately
  removeCircle();
  
  // Run again after short delay
  setTimeout(removeCircle, 500);
  
  // Run again after longer delay
  setTimeout(removeCircle, 1500);
})();
</script>