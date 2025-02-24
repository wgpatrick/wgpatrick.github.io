---
layout: default
title: ""
---

<div class="growth-container">
  <svg id="growth-animation" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
    <!-- The generative pattern will be drawn here -->
  </svg>
</div>

<style>
.growth-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: #f8f8f8;
  cursor: pointer;
}

#growth-animation {
  width: 100%;
  height: 100%;
}

.growth-path {
  fill: none;
  stroke: #333;
  stroke-width: 0.2;
  opacity: 0;
  animation: fadeIn 0.5s forwards;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.wp-letter {
  fill: none;
  stroke: #333;
  stroke-width: 3;
  opacity: 0;
  transition: opacity 0.5s;
}

.clickable {
  cursor: pointer;
}

.restart-button {
  position: fixed;
  bottom: 20px;
  right: 20px;
  padding: 10px 20px;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
  opacity: 0;
  transition: opacity 1s;
}
</style>

<button id="restartGrowth" class="restart-button">Restart Growth</button>

<script>
document.addEventListener('DOMContentLoaded', () => {
  const svg = document.getElementById('growth-animation');
  const restartButton = document.getElementById('restartGrowth');
  let pattern = null;
  let growthInterval = null;

  function startGrowth() {
    if (growthInterval) clearInterval(growthInterval);
    svg.innerHTML = '';
    restartButton.style.opacity = '0';
    pattern = new HyphaeGrowth(svg);
    
    growthInterval = setInterval(() => {
      pattern.grow();
      if (pattern.points.length === 0 || pattern.branches.length > HyphaeGrowth.MAX_BRANCHES) {
        clearInterval(growthInterval);
        pattern.enterText.style.transition = 'opacity 1s';
        pattern.enterText.style.opacity = '1';
        restartButton.style.opacity = '1';
      }
    }, 10);
  }

  restartButton.addEventListener('click', startGrowth);
  startGrowth();
});
</script>




