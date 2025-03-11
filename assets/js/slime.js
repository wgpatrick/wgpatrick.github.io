/**
 * Slime Mold Growth Simulation
 * Inspired by Physarum polycephalum behavior
 * 
 * Simulates how slime molds explore their environment and optimize paths
 * between food sources to create efficient transportation networks.
 */

class SlimeMoldSimulation {
  /**
   * Create a new slime mold simulation
   * @param {HTMLCanvasElement} canvas - The canvas to render the simulation on
   * @param {Object} options - Configuration options
   */
  constructor(canvas, options = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    
    // Default configuration
    this.config = {
      agentCount: options.agentCount || 5000,
      sensorAngle: 45 * (Math.PI / 180), // 45 degrees in radians
      sensorDistance: 12,               // Increased sensing distance
      rotationAngle: 45 * (Math.PI / 180),
      moveSpeed: 1.5,                   // Increased movement speed
      depositAmount: 5,
      evaporationRate: options.evaporationRate || 0.004, // Much lower evaporation
      diffusionRate: 0.05,              // Reduced diffusion
      foodSources: options.foodSources || 5,
      foodStrength: 350,                // Stronger food attraction
      foodRadius: 15,
      initialExplorationFactor: 0.7,    // High initial randomness for exploration
      foodBoostFactor: 5,               // Boost when food is found
      trailRetentionThreshold: 0.1      // Minimum trail strength that won't evaporate
    };
    
    // Simulation state
    this.width = canvas.width;
    this.height = canvas.height;
    this.agents = [];
    this.foodSources = [];
    this.trailMap = [];  // 2D grid to track pheromone concentrations
    this.displayMap = []; // For rendering
    this.running = false;
    this.paused = false;
    
    // Color palette - black on white scheme
    this.colors = {
      background: [255, 255, 255],  // White
      agent: [0, 0, 0],             // Black
      trail: [20, 20, 20],          // Dark gray/black
      food: [120, 0, 0]             // Dark red
    };
    
    // Initialize the trail maps
    this.initializeTrailMap();
    this.createAgents();
    this.createFoodSources(this.config.foodSources);
  }
  
  /**
   * Initialize the pheromone trail map
   */
  initializeTrailMap() {
    this.trailMap = new Array(this.width);
    this.displayMap = new Array(this.width);
    
    for (let x = 0; x < this.width; x++) {
      this.trailMap[x] = new Array(this.height).fill(0);
      this.displayMap[x] = new Array(this.height).fill(0);
    }
    
    // Add a small amount of noise to the initial map
    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        this.trailMap[x][y] = Math.random() * 0.1;
      }
    }
  }
  
  /**
   * Create the agent particles with improved exploration
   */
  createAgents() {
    this.agents = [];
    
    // Create agents starting from the center with wide distribution
    const centerX = this.width / 2;
    const centerY = this.height / 2;
    const radius = Math.min(this.width, this.height) / 2.5; // Larger initial radius
    
    // Track simulation age for exploration phase
    this.simulationAge = 0;
    
    for (let i = 0; i < this.config.agentCount; i++) {
      // Random position in a circle around center
      const angle = Math.random() * Math.PI * 2;
      
      // Use different distribution to encourage exploration
      // More agents at the periphery to find food
      const distance = Math.pow(Math.random(), 0.5) * radius; // More agents pushed outward
      const x = centerX + Math.cos(angle) * distance;
      const y = centerY + Math.sin(angle) * distance;
      
      this.agents.push({
        x: x,
        y: y,
        angle: Math.random() * Math.PI * 2,
        lastDeposit: 0,
        fedRecently: false,    // Track if agent found food recently
        explorationBias: Math.random() * 0.5 + 0.5  // Individual exploration tendency
      });
    }
  }
  
  /**
   * Create food sources at random positions
   * @param {number} count - Number of food sources to create
   */
  createFoodSources(count) {
    this.foodSources = [];
    
    const padding = Math.min(this.width, this.height) * 0.15;
    
    // Ensure food sources are not too close to the edges
    const minX = padding;
    const maxX = this.width - padding;
    const minY = padding;
    const maxY = this.height - padding;
    
    // Place food sources away from center to encourage exploration
    for (let i = 0; i < count; i++) {
      let x, y, tooClose;
      
      // Try to place food sources away from each other
      do {
        tooClose = false;
        x = minX + Math.random() * (maxX - minX);
        y = minY + Math.random() * (maxY - minY);
        
        // Check distance from center
        const distFromCenter = Math.hypot(x - this.width/2, y - this.height/2);
        if (distFromCenter < padding) {
          tooClose = true;
          continue;
        }
        
        // Check distance from other food sources
        for (let j = 0; j < this.foodSources.length; j++) {
          const otherFood = this.foodSources[j];
          const distance = Math.hypot(x - otherFood.x, y - otherFood.y);
          if (distance < padding) {
            tooClose = true;
            break;
          }
        }
      } while (tooClose);
      
      this.foodSources.push({ x, y });
      
      // Add initial trail concentration at food source
      this.addTrailAtFood(x, y);
    }
  }
  
  /**
   * Add initial trail concentration around a food source
   * @param {number} x - X coordinate of food
   * @param {number} y - Y coordinate of food 
   */
  addTrailAtFood(x, y) {
    const radius = this.config.foodRadius;
    const strength = this.config.foodStrength;
    
    // Add a gradient of trail around the food source
    for (let dx = -radius; dx <= radius; dx++) {
      for (let dy = -radius; dy <= radius; dy++) {
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance <= radius) {
          const nx = Math.floor(x + dx);
          const ny = Math.floor(y + dy);
          
          if (nx >= 0 && nx < this.width && ny >= 0 && ny < this.height) {
            // Falloff based on distance
            const falloff = 1 - (distance / radius);
            this.trailMap[nx][ny] += strength * falloff * falloff;
          }
        }
      }
    }
  }
  
  /**
   * Update agent positions and trail map
   */
  update() {
    // Skip updates when paused
    if (this.paused) return;
    
    // Increment simulation age
    this.simulationAge++;
    
    // Calculate exploration phase factor (gradually decreases over time)
    const explorationPhase = Math.max(0, this.config.initialExplorationFactor * 
      Math.exp(-this.simulationAge / (5000 * this.config.initialExplorationFactor)));
    
    this.updateAgents(explorationPhase);
    this.diffuseTrails();
    this.evaporateTrails();
    
    // Check if agents have found food
    this.checkFoodDiscovery();
  }
  
  /**
   * Update all agent positions using sensor-based movement
   * @param {number} explorationFactor - How much to favor exploration vs following trails
   */
  updateAgents(explorationFactor = 0) {
    const { sensorAngle, sensorDistance, rotationAngle, moveSpeed } = this.config;
    
    this.agents.forEach(agent => {
      // Individual agents have different exploration biases
      const agentExplorationFactor = explorationFactor * agent.explorationBias;
      
      // Adjust speed if agent has fed recently
      const agentSpeed = agent.fedRecently ? moveSpeed * 1.3 : moveSpeed;
      
      // Determine if this agent should explore or follow trails
      if (Math.random() < agentExplorationFactor) {
        // Exploration phase: more random movement
        agent.angle += (Math.random() - 0.5) * rotationAngle * 3;
      } else {
        // Normal movement: follow trails with sensing
        // Perform sensing at three points ahead of the agent
        const ahead = this.senseTrail(agent.x, agent.y, agent.angle, sensorDistance);
        const left = this.senseTrail(agent.x, agent.y, agent.angle + sensorAngle, sensorDistance);
        const right = this.senseTrail(agent.x, agent.y, agent.angle - sensorAngle, sensorDistance);
        
        // Determine rotation based on sensor readings
        if (ahead > left && ahead > right) {
          // Continue straight
        } else if (left > right) {
          // Turn left
          agent.angle += rotationAngle;
        } else if (right > left) {
          // Turn right
          agent.angle -= rotationAngle;
        } else {
          // Random turn if no clear direction
          agent.angle += (Math.random() - 0.5) * rotationAngle * 2;
        }
      }
      
      // Move the agent forward
      agent.x += Math.cos(agent.angle) * agentSpeed;
      agent.y += Math.sin(agent.angle) * agentSpeed;
      
      // Deposit pheromone trail (stronger if recently fed)
      const depositMultiplier = agent.fedRecently ? this.config.foodBoostFactor : 1;
      this.depositTrail(agent.x, agent.y, depositMultiplier);
      
      // Random chance to reset fed status
      if (agent.fedRecently && Math.random() < 0.01) {
        agent.fedRecently = false;
      }
      
      // Wrap around the edges
      if (agent.x < 0) agent.x = this.width - 1;
      if (agent.x >= this.width) agent.x = 0;
      if (agent.y < 0) agent.y = this.height - 1;
      if (agent.y >= this.height) agent.y = 0;
    });
  }
  }
  
  /**
   * Sense the trail concentration at a specific position
   * @param {number} x - Agent X position
   * @param {number} y - Agent Y position
   * @param {number} angle - Direction to sense
   * @param {number} distance - How far to sense
   * @returns {number} Trail concentration
   */
  senseTrail(x, y, angle, distance) {
    const senseX = Math.floor(x + Math.cos(angle) * distance);
    const senseY = Math.floor(y + Math.sin(angle) * distance);
    
    // Check boundary
    if (senseX < 0 || senseX >= this.width || senseY < 0 || senseY >= this.height) {
      return 0;
    }
    
    return this.trailMap[senseX][senseY];
  }
  
  /**
   * Deposit pheromone trail at agent position
   * @param {number} x - X position
   * @param {number} y - Y position
   * @param {number} multiplier - Optional multiplier for deposit amount
   */
  depositTrail(x, y, multiplier = 1) {
    const ix = Math.floor(x);
    const iy = Math.floor(y);
    
    if (ix < 0 || ix >= this.width || iy < 0 || iy >= this.height) {
      return;
    }
    
    // Deposit in a small radius around the agent
    const radius = multiplier > 1 ? 2 : 1; // Larger radius for fed agents
    const amount = this.config.depositAmount * multiplier;
    
    for (let dx = -radius; dx <= radius; dx++) {
      for (let dy = -radius; dy <= radius; dy++) {
        const nx = ix + dx;
        const ny = iy + dy;
        if (nx >= 0 && nx < this.width && ny >= 0 && ny < this.height) {
          this.trailMap[nx][ny] += amount;
        }
      }
    }
  }
  
  /**
   * Check if agents have discovered food sources
   */
  checkFoodDiscovery() {
    // Check each agent for proximity to food
    this.agents.forEach(agent => {
      // Check each food source
      this.foodSources.forEach(food => {
        const dx = agent.x - food.x;
        const dy = agent.y - food.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // If agent is close to food, mark it as fed
        if (distance < this.config.foodRadius) {
          agent.fedRecently = true;
          
          // Deposit extra trail at food location to reinforce it
          this.depositTrail(agent.x, agent.y, this.config.foodBoostFactor * 2);
        }
      });
    });
  }
  
  /**
   * Diffuse trails from each cell to neighbors
   */
  diffuseTrails() {
    // Copy current trail map for diffusion calculation
    const newTrailMap = Array(this.width);
    for (let x = 0; x < this.width; x++) {
      newTrailMap[x] = Array(this.height);
      for (let y = 0; y < this.height; y++) {
        newTrailMap[x][y] = this.trailMap[x][y];
      }
    }
    
    // Diffuse trail to neighboring cells
    const diffuseRate = this.config.diffusionRate;
    
    for (let x = 1; x < this.width - 1; x++) {
      for (let y = 1; y < this.height - 1; y++) {
        // For each cell, diffuse a portion of its trail to neighbors
        const currentCell = this.trailMap[x][y];
        const amountToDiffuse = currentCell * diffuseRate;
        
        // Diffuse to 4 neighbors (von Neumann neighborhood)
        const amountPerNeighbor = amountToDiffuse / 4;
        
        // Diffuse to neighbors
        newTrailMap[x+1][y] += amountPerNeighbor;
        newTrailMap[x-1][y] += amountPerNeighbor;
        newTrailMap[x][y+1] += amountPerNeighbor;
        newTrailMap[x][y-1] += amountPerNeighbor;
        
        // Remove the diffused amount from current cell
        newTrailMap[x][y] -= amountToDiffuse;
      }
    }
    
    // Update the trail map with diffused values
    this.trailMap = newTrailMap;
  }
  
  /**
   * Evaporate trails over time with protection for established paths
   */
  evaporateTrails() {
    const evaporationRate = this.config.evaporationRate;
    const threshold = this.config.trailRetentionThreshold;
    
    // Evaporate trails, but protect established paths
    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        // Get current trail value
        const currentValue = this.trailMap[x][y];
        
        if (currentValue > threshold) {
          // Strong trails evaporate less (stable network formation)
          const adjustedRate = evaporationRate * (threshold / currentValue);
          this.trailMap[x][y] *= (1 - adjustedRate);
        } else {
          // Weak trails evaporate normally
          this.trailMap[x][y] *= (1 - evaporationRate);
        }
      }
    }
    
    // Replenish food source trails
    this.foodSources.forEach(food => {
      this.addTrailAtFood(food.x, food.y);
    });
  }
  
  /**
   * Set a new evaporation rate
   * @param {number} rate - New evaporation rate
   */
  setEvaporationRate(rate) {
    this.config.evaporationRate = rate;
  }
  
  /**
   * Render the simulation to the canvas
   */
  render() {
    const bgColor = this.colors.background;
    
    // Clear canvas with background color
    this.ctx.fillStyle = `rgb(${bgColor[0]}, ${bgColor[1]}, ${bgColor[2]})`;
    this.ctx.fillRect(0, 0, this.width, this.height);
    
    // Render trail map using image data for better performance
    const imageData = this.ctx.createImageData(this.width, this.height);
    const data = imageData.data;
    
    // Set all pixels to background color initially
    for (let i = 0; i < data.length; i += 4) {
      data[i] = bgColor[0];     // R
      data[i + 1] = bgColor[1]; // G
      data[i + 2] = bgColor[2]; // B
      data[i + 3] = 255;        // A (fully opaque)
    }
    
    // Update display map with trail values
    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        // Smooth the display (temporal averaging)
        this.displayMap[x][y] = this.displayMap[x][y] * 0.8 + this.trailMap[x][y] * 0.2;
        
        // Only draw pixels with significant trail value
        if (this.displayMap[x][y] > 0.05) {
          // Calculate intensity (inverted for black on white)
          // Higher trail values = darker lines
          const intensity = Math.min(1, this.displayMap[x][y] * 0.3);
          
          // Calculate pixel index
          const index = (y * this.width + x) * 4;
          
          // Black trail on white background:
          // Subtract from background color based on trail intensity
          const trailColor = this.colors.trail;
          const factor = intensity;
          
          data[index] = Math.max(0, bgColor[0] - (bgColor[0] - trailColor[0]) * factor);     // R
          data[index + 1] = Math.max(0, bgColor[1] - (bgColor[1] - trailColor[1]) * factor); // G
          data[index + 2] = Math.max(0, bgColor[2] - (bgColor[2] - trailColor[2]) * factor); // B
          data[index + 3] = 255; // A (fully opaque)
        }
      }
    }
    
    // Draw the image data to canvas
    this.ctx.putImageData(imageData, 0, 0);
    
    // Draw food sources
    this.foodSources.forEach(food => {
      // Draw food source circle
      this.ctx.beginPath();
      this.ctx.arc(food.x, food.y, this.config.foodRadius, 0, Math.PI * 2);
      const foodColor = this.colors.food;
      this.ctx.fillStyle = `rgb(${foodColor[0]}, ${foodColor[1]}, ${foodColor[2]})`;
      this.ctx.fill();
      
      // Add outline
      this.ctx.strokeStyle = 'black';
      this.ctx.lineWidth = 1;
      this.ctx.stroke();
    });
    
    // Optionally render agents (uncomment to see agents)
    /*
    this.ctx.fillStyle = `rgba(${this.colors.agent[0]}, ${this.colors.agent[1]}, ${this.colors.agent[2]}, 0.5)`;
    this.agents.forEach(agent => {
      this.ctx.beginPath();
      this.ctx.arc(agent.x, agent.y, 1, 0, Math.PI * 2);
      this.ctx.fill();
    });
    */
  }
  
  /**
   * Animation loop
   */
  animate() {
    if (!this.running) return;
    
    this.update();
    this.render();
    
    requestAnimationFrame(() => this.animate());
  }
  
  /**
   * Start the simulation
   */
  start() {
    if (this.running) return;
    
    this.running = true;
    this.animate();
  }
  
  /**
   * Stop the simulation
   */
  stop() {
    this.running = false;
  }
  
  /**
   * Pause the simulation
   */
  pause() {
    this.paused = true;
  }
  
  /**
   * Resume the simulation after pausing
   */
  resume() {
    this.paused = false;
  }
  
  /**
   * Check if the simulation is paused
   * @returns {boolean} True if paused
   */
  isPaused() {
    return this.paused;
  }
  
  /**
   * Restart the simulation with new settings
   * @param {Object} options - New simulation options
   */
  restart(options = {}) {
    // Update config with new options
    if (options.agentCount) this.config.agentCount = options.agentCount;
    if (options.evaporationRate) this.config.evaporationRate = options.evaporationRate;
    if (options.foodSources) this.config.foodSources = options.foodSources;
    
    // Reset the simulation
    this.initializeTrailMap();
    this.createAgents();
    this.createFoodSources(this.config.foodSources);
  }
  
  /**
   * Handle window resize
   */
  resize() {
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    
    // Reinitialize with new dimensions
    this.restart();
  }
}