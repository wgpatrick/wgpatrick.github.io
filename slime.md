---
layout: default
title: "Slime Mold Growth Simulation"
permalink: /slime/
---

<div class="slime-container">
  <canvas id="slime-simulation"></canvas>
</div>

<div class="controls-panel">
  <h3>Slime Mold Controls</h3>
  <div class="control-group">
    <label for="agentCount">Agents:</label>
    <input type="range" id="agentCount" min="1000" max="10000" value="5000" step="500">
    <span id="agentCountValue">5000</span>
  </div>
  <div class="control-group">
    <label for="foodCount">Food Sources:</label>
    <input type="range" id="foodCount" min="3" max="20" value="8" step="1">
    <span id="foodCountValue">8</span>
  </div>
  <div class="control-group">
    <label for="evaporationRate">Evaporation:</label>
    <input type="range" id="evaporationRate" min="0.001" max="0.02" value="0.004" step="0.001">
    <span id="evaporationRateValue">0.004</span>
  </div>
  <div class="control-group">
    <button id="restart" class="control-button">Restart</button>
    <button id="togglePause" class="control-button">Pause</button>
  </div>
</div>

<link rel="stylesheet" href="/assets/css/slime.css">

<script src="/assets/js/slime.js"></script>
<script>
document.addEventListener('DOMContentLoaded', () => {
  // Get UI elements
  const agentCountSlider = document.getElementById('agentCount');
  const agentCountValue = document.getElementById('agentCountValue');
  const foodCountSlider = document.getElementById('foodCount');
  const foodCountValue = document.getElementById('foodCountValue');
  const evaporationRateSlider = document.getElementById('evaporationRate');
  const evaporationRateValue = document.getElementById('evaporationRateValue');
  const restartButton = document.getElementById('restart');
  const pauseButton = document.getElementById('togglePause');
  
  // Initialize canvas
  const canvas = document.getElementById('slime-simulation');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
  // Create the simulation
  const simulation = new SlimeMoldSimulation(canvas, {
    agentCount: parseInt(agentCountSlider.value),
    foodSources: parseInt(foodCountSlider.value),
    evaporationRate: parseFloat(evaporationRateSlider.value)
  });
  
  // Start the simulation
  simulation.start();
  
  // UI event handlers
  agentCountSlider.addEventListener('input', () => {
    agentCountValue.textContent = agentCountSlider.value;
  });
  
  foodCountSlider.addEventListener('input', () => {
    foodCountValue.textContent = foodCountSlider.value;
  });
  
  evaporationRateSlider.addEventListener('input', () => {
    evaporationRateValue.textContent = evaporationRateSlider.value;
    simulation.setEvaporationRate(parseFloat(evaporationRateSlider.value));
  });
  
  restartButton.addEventListener('click', () => {
    simulation.restart({
      agentCount: parseInt(agentCountSlider.value),
      foodSources: parseInt(foodCountSlider.value),
      evaporationRate: parseFloat(evaporationRateSlider.value)
    });
  });
  
  pauseButton.addEventListener('click', () => {
    if (simulation.isPaused()) {
      simulation.resume();
      pauseButton.textContent = 'Pause';
    } else {
      simulation.pause();
      pauseButton.textContent = 'Resume';
    }
  });
  
  // Handle window resize
  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    simulation.resize();
  });
});
</script>