---
layout: default
title: "Organic Growth Patterns"
permalink: /growth/
---

<div class="growth-container">
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
  
  // Update config with control values
  function updateConfig() {
    HyphaeGrowth.CONFIG.MIN_SEEDS = parseInt(seedCountSlider.value);
    HyphaeGrowth.CONFIG.MAX_SEEDS = parseInt(seedCountSlider.value) + 1;
    HyphaeGrowth.CONFIG.BRANCHING_PROBABILITY = parseFloat(branchProbSlider.value);
    HyphaeGrowth.CONFIG.PHOTOTROPISM = parseFloat(tropismSlider.value);
    
    // Toggle features
    HyphaeGrowth.CONFIG.USE_GOLDEN_ANGLE = toggleGoldenAngle.classList.contains('active');
    HyphaeGrowth.CONFIG.USE_GRAVITY = toggleGravity.classList.contains('active');
    
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
});
</script>