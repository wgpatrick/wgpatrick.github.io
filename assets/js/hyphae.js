/**
 * HyphaeGrowth - Core class for generative organic growth pattern visualization
 * Creates branching structures that simulate organic growth using SVG paths
 */
class HyphaeGrowth {
  // Growth Pattern Configuration
  static CONFIG = {
    // Structure
    BRANCH_LENGTH: 2.4,
    MAX_THICKNESS: 2.0,
    MIN_THICKNESS: 0.1,
    MIN_DISTANCE: 1.2,
    THICKNESS_SCALE_FACTOR: 250,
    
    // Behavior
    MIN_SEEDS: 3,
    MAX_SEEDS: 4,
    BRANCHING_PROBABILITY: 0.28,
    MAX_ATTEMPTS: 8,
    DIRECTION_RANDOMNESS: 0.1,
    BLOCKED_DIRECTION_CHANGE: Math.PI / 4,
    BLOCKED_DIRECTION_RANDOMNESS: 0.2,
    
    // Natural branching patterns
    GOLDEN_ANGLE: Math.PI * (3 - Math.sqrt(5)), // ~137.5 degrees, the golden angle
    FIBONACCI_SEQUENCE: [1, 1, 2, 3, 5, 8, 13, 21],
    BRANCHING_ANGLES: [
      Math.PI / 6,  // 30°
      Math.PI / 4,  // 45°
      Math.PI / 3,  // 60°
      Math.PI * 2/5 // 72° - approximates golden angle divisions
    ],
    
    // Feature toggles for UI controls
    USE_GOLDEN_ANGLE: true,
    USE_GRAVITY: true,
    
    // Tropism effects (directional growth biases)
    PHOTOTROPISM: 0.15,  // Growth towards light (upwards)
    GRAVITROPISM: 0.08,  // Growth response to gravity
    THIGMOTROPISM: 0.2,  // Avoidance of obstacles
    
    // Visual
    CIRCLE_RADIUS: 15,
    EDGE_PADDING: 10,
    FONT_SIZE: 1.6,
    MAX_BRANCHES: 5000,
    
    // Colors - Carefully selected palette
    COLORS: [
      '#264653', // Dark blue
      '#2a9d8f', // Teal
      '#e76f51', // Coral
      '#219ebc', // Light blue
      '#f4a261', // Orange
      '#023047', // Navy
      '#8ecae6', // Sky blue
      '#fb8500', // Bright orange
      '#06d6a0', // Mint
      '#118ab2'  // Azure
    ]
  };

  /**
   * Create a new hyphae growth visualization
   * @param {SVGElement} svg - The SVG element to render the growth pattern in
   */
  constructor(svg) {
    this.svg = svg;
    
    // Get actual SVG dimensions in pixels
    const svgRect = svg.getBoundingClientRect();
    this.width = svgRect.width;
    this.height = svgRect.height;
    
    // Adjust viewBox to match aspect ratio
    const aspectRatio = this.width / this.height;
    if (aspectRatio > 1) {
      svg.setAttribute('viewBox', `0 0 ${100 * aspectRatio} 100`);
      this.viewBoxWidth = 100 * aspectRatio;
      this.viewBoxHeight = 100;
    } else {
      svg.setAttribute('viewBox', `0 0 100 ${100 / aspectRatio}`);
      this.viewBoxWidth = 100;
      this.viewBoxHeight = 100 / aspectRatio;
    }
    
    // Initialize state properties
    this.initializeProperties();
    this.createSeeds();
    this.createEntrance();
  }

  /**
   * Initialize all internal state properties
   */
  initializeProperties() {
    const config = HyphaeGrowth.CONFIG;
    
    this.points = [];
    this.branches = [];
    this.branchLength = config.BRANCH_LENGTH;
    this.maxThickness = config.MAX_THICKNESS;
    this.minThickness = config.MIN_THICKNESS;
    this.childCounts = new Map();
    this.colors = config.COLORS;
    this.pathElements = new Map();
    this.gradientBuffer = []; // Initialize the gradient buffer
  }

  /**
   * Create random seed points to start growth
   */
  createSeeds() {
    const config = HyphaeGrowth.CONFIG;
    
    // Create random number of seeds
    const numSeeds = Math.floor(Math.random() * 
      (config.MAX_SEEDS - config.MIN_SEEDS + 1)) + 
      config.MIN_SEEDS;
    
    // Create the random seed points
    for (let seed = 0; seed < numSeeds; seed++) {
      const x = config.EDGE_PADDING + 
        Math.random() * (100 - 2 * config.EDGE_PADDING);
      const y = config.EDGE_PADDING + 
        Math.random() * (100 - 2 * config.EDGE_PADDING);
      
      const randomDirection = Math.random() * Math.PI * 2;
      
      // Create three branches from each seed point, spaced 120° apart
      this.addStartingPoint(x, y, randomDirection, seed);
      this.addStartingPoint(x, y, randomDirection + (Math.PI * 2/3), seed);
      this.addStartingPoint(x, y, randomDirection + (Math.PI * 4/3), seed);
    }
  }

  /**
   * Create the entrance UI elements (mask and text)
   */
  createEntrance() {
    const config = HyphaeGrowth.CONFIG;
    
    // Add click navigation
    this.svg.addEventListener('click', () => {
      window.location.href = '/home';
    });

    // Create circular mask
    this.createHiMask();
    
    // Create text element
    this.enterText = document.createElementNS("http://www.w3.org/2000/svg", "text");
    this.enterText.setAttribute("x", this.viewBoxWidth / 2);
    this.enterText.setAttribute("y", this.viewBoxHeight / 2);
    this.enterText.setAttribute("text-anchor", "middle");
    this.enterText.setAttribute("dominant-baseline", "middle");
    
    // Adjust font size based on screen width
    const fontSize = window.innerWidth <= 768 ? 4 : config.FONT_SIZE;
    this.enterText.setAttribute("font-size", fontSize);
    this.enterText.setAttribute("fill", "#333");
    this.enterText.setAttribute("opacity", "0");
    this.enterText.textContent = "ENTER";
    this.svg.appendChild(this.enterText);
  }

  /**
   * Create the central circular mask
   */
  createHiMask() {
    const config = HyphaeGrowth.CONFIG;
    
    const circleMask = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circleMask.setAttribute("cx", this.viewBoxWidth / 2);
    circleMask.setAttribute("cy", this.viewBoxHeight / 2);
    circleMask.setAttribute("r", config.CIRCLE_RADIUS);
    circleMask.setAttribute("stroke", "none");
    circleMask.setAttribute("fill", "none");
    circleMask.id = "growth-mask";
    this.svg.appendChild(circleMask);
  }

  /**
   * Add a starting growth point
   * @param {number} initialX - X coordinate (0-100 scale)
   * @param {number} initialY - Y coordinate (0-100 scale)
   * @param {number} direction - Growth direction in radians
   * @param {number} seedIndex - Index of the seed point this branch belongs to
   */
  addStartingPoint(initialX, initialY, direction, seedIndex) {
    const scaledX = (initialX / 100) * this.viewBoxWidth;
    const scaledY = (initialY / 100) * this.viewBoxHeight;
    
    this.points.push({
      x: scaledX,
      y: scaledY,
      direction: direction,
      branchId: null,
      seedIndex: seedIndex
    });
  }

  /**
   * Increment child count for a branch and all its ancestors
   * @param {number|null} parentId - ID of the parent branch
   */
  incrementChildCount(parentId) {
    if (parentId !== null) {
      const currentCount = this.childCounts.get(parentId) || 0;
      this.childCounts.set(parentId, currentCount + 1);
      
      const parentBranch = this.branches[parentId];
      if (parentBranch && parentBranch.parent !== null) {
        this.incrementChildCount(parentBranch.parent);
      }
    }
  }

  /**
   * Calculate branch thickness based on child count
   * @param {number} branchId - ID of the branch
   * @returns {number} Calculated thickness
   */
  calculateThickness(branchId) {
    const childCount = this.childCounts.get(branchId) || 0;
    const scaleFactor = HyphaeGrowth.CONFIG.THICKNESS_SCALE_FACTOR;
    
    return this.minThickness + 
      ((this.maxThickness - this.minThickness) * (1 - Math.exp(-childCount / scaleFactor)));
  }

  /**
   * Initialize SVG elements for batch rendering
   * @private
   */
  initSvgBatching() {
    // Create gradient defs element if it doesn't exist
    this.defs = this.svg.querySelector('defs');
    if (!this.defs) {
      this.defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
      this.svg.appendChild(this.defs);
    }
  }
  
  /**
   * Legacy method for flushing the path buffer
   * @private
   * @deprecated No longer needed as we're using direct DOM manipulation
   */
  flushPathBuffer() {
    // This is intentionally empty as we now add elements directly to the DOM
  }
  
  /**
   * Draw a branch path to the SVG with smooth curves and gradient color
   * Using batched rendering for improved performance
   * @param {Object} branch - Branch object with coordinates
   * @param {number} branchId - ID of the branch
   * @param {number} seedIndex - Index of the seed point this branch belongs to
   */
  drawBranch(branch, branchId, seedIndex) {
    // Initialize defs if not done already
    if (!this.defs) {
      this.initSvgBatching();
    }
    
    // Create a unique ID for the gradient
    const gradientId = `branch-gradient-${branchId}`;
    
    // Calculate the vectors for this branch
    const dx = branch.x2 - branch.x1;
    const dy = branch.y2 - branch.y1;
    const len = Math.sqrt(dx * dx + dy * dy);
    
    // Check if this branch has a parent to ensure continuous slope
    let continuousCurve = false;
    let parentControlPoint = null;
    
    if (branch.parent !== null) {
      const parentBranch = this.branches[branch.parent];
      if (parentBranch) {
        // Check if this branch starts where the parent ends
        if (parentBranch.x2 === branch.x1 && parentBranch.y2 === branch.y1) {
          continuousCurve = true;
          
          // Get parent's control point directly from branch object
          if (parentBranch.controlPoint) {
            parentControlPoint = parentBranch.controlPoint;
          }
        }
      }
    }
    
    // Determine control point for the curve
    let cpX, cpY;
    
    if (continuousCurve && parentControlPoint) {
      // Use the reflection of parent's control point for continuous tangent
      // This is a common technique in Bezier curves to ensure C1 continuity
      const reflectionX = 2 * branch.x1 - parentControlPoint.x;
      const reflectionY = 2 * branch.y1 - parentControlPoint.y;
      
      // Use reflection but also move towards the target point
      const reflectionWeight = 0.4; // How much to weight the reflection
      const targetWeight = 1 - reflectionWeight;
      
      // Blend between reflection and midpoint
      cpX = (reflectionWeight * reflectionX) + (targetWeight * (branch.x1 + dx * 0.5));
      cpY = (reflectionWeight * reflectionY) + (targetWeight * (branch.y1 + dy * 0.5));
    } else {
      // For branches without parents or non-continuous junctions
      // Get perpendicular vector for slight curve
      const perpX = -dy / len * (len * 0.2);
      const perpY = dx / len * (len * 0.2);
      
      // Random curve direction
      const curveFactor = Math.random() > 0.5 ? 1 : -1;
      
      // Calculate control point (for a quadratic curve)
      cpX = branch.x1 + dx * 0.5 + perpX * curveFactor;
      cpY = branch.y1 + dy * 0.5 + perpY * curveFactor;
    }
    
    // Store curve data in the branch for reference by children
    branch.controlPoint = { x: cpX, y: cpY };
    
    // Create gradient for the path
    const baseColor = this.colors[seedIndex];
    const lightColor = this.lightenColor(baseColor, 20);
    const gradient = this.createBranchGradient(gradientId, baseColor, lightColor);
    
    // Add gradient directly to SVG defs
    this.defs.appendChild(gradient);
    
    // Create the path with a quadratic bezier curve
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", `M${branch.x1},${branch.y1} Q${cpX},${cpY} ${branch.x2},${branch.y2}`);
    path.classList.add("growth-path");
    
    // Add length class for animation timing
    if (len < this.branchLength * 0.7) {
      path.classList.add("short");
    } else if (len > this.branchLength * 1.3) {
      path.classList.add("long");
    } else {
      path.classList.add("medium");
    }
    
    path.setAttribute("data-branch-id", branchId);
    
    // Apply gradient and other styles
    path.style.stroke = `url(#${gradientId})`;
    path.style.strokeWidth = this.minThickness;
    
    // Add path to SVG and track it for thickness updates
    this.svg.appendChild(path);
    this.pathElements.set(branchId, path);
  }
  
  /**
   * Create a gradient for a branch
   * @param {string} id - Unique ID for the gradient
   * @param {string} startColor - Starting color (hex)
   * @param {string} endColor - Ending color (hex)
   * @returns {SVGLinearGradientElement} The created gradient element
   */
  createBranchGradient(id, startColor, endColor) {
    const gradient = document.createElementNS("http://www.w3.org/2000/svg", "linearGradient");
    gradient.setAttribute("id", id);
    gradient.setAttribute("gradientUnits", "userSpaceOnUse");
    
    // Random direction for gradient
    if (Math.random() > 0.5) {
      gradient.setAttribute("x1", "0%");
      gradient.setAttribute("y1", "0%");
      gradient.setAttribute("x2", "100%");
      gradient.setAttribute("y2", "100%");
    } else {
      gradient.setAttribute("x1", "100%");
      gradient.setAttribute("y1", "0%");
      gradient.setAttribute("x2", "0%");
      gradient.setAttribute("y2", "100%");
    }
    
    // Create gradient stops
    const stop1 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
    stop1.setAttribute("offset", "0%");
    stop1.setAttribute("stop-color", startColor);
    
    const stop2 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
    stop2.setAttribute("offset", "100%");
    stop2.setAttribute("stop-color", endColor);
    
    gradient.appendChild(stop1);
    gradient.appendChild(stop2);
    
    return gradient;
  }
  
  /**
   * Lighten a color by a percentage
   * @param {string} hex - Hex color code
   * @param {number} percent - Percentage to lighten (0-100)
   * @returns {string} Lightened hex color
   */
  lightenColor(hex, percent) {
    // Remove the # if present
    hex = hex.replace('#', '');
    
    // Convert to RGB
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    
    // Lighten each component
    const factor = 1 + (percent / 100);
    const rNew = Math.min(255, Math.round(r * factor));
    const gNew = Math.min(255, Math.round(g * factor));
    const bNew = Math.min(255, Math.round(b * factor));
    
    // Convert back to hex
    return `#${(rNew).toString(16).padStart(2, '0')}${
      (gNew).toString(16).padStart(2, '0')}${
      (bNew).toString(16).padStart(2, '0')}`;
  }

  /**
   * Update branch thickness based on recalculated value
   * @param {number} branchId - ID of the branch
   */
  updateBranchThickness(branchId) {
    const path = this.pathElements.get(branchId);
    if (path) {
      path.style.strokeWidth = this.calculateThickness(branchId);
    }
  }

  /**
   * Check if a point is occupied by existing branches or central circle
   * @param {number} x - X coordinate
   * @param {number} y - Y coordinate
   * @returns {boolean} True if occupied
   */
  /**
   * Get the repulsion vector from nearby branches
   * @param {number} x - X coordinate to check
   * @param {number} y - Y coordinate to check  
   * @param {number} radius - Search radius
   * @returns {Object} Vector with x,y components and magnitude
   */
  getRepulsionVector(x, y, radius) {
    let repulsionX = 0;
    let repulsionY = 0;
    let count = 0;
    
    // Check branches in vicinity
    this.branches.forEach(branch => {
      // Check both endpoints and the closest point on the segment
      const checks = [
        { x: branch.x1, y: branch.y1 },
        { x: branch.x2, y: branch.y2 }
      ];
      
      // Add closest point on line segment
      const A = x - branch.x1;
      const B = y - branch.y1;
      const C = branch.x2 - branch.x1;
      const D = branch.y2 - branch.y1;
      
      const dot = A * C + B * D;
      const len_sq = C * C + D * D;
      let param = -1;
      
      if (len_sq !== 0) param = dot / len_sq;
      
      if (param >= 0 && param <= 1) {
        checks.push({
          x: branch.x1 + param * C,
          y: branch.y1 + param * D
        });
      }
      
      // Check each point
      checks.forEach(point => {
        const dx = x - point.x;
        const dy = y - point.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < radius && distance > 0) {
          // Repulsion strength is inversely proportional to distance
          const strength = 1 - (distance / radius);
          repulsionX += dx / distance * strength;
          repulsionY += dy / distance * strength;
          count++;
        }
      });
    });
    
    // Normalize if we have any repulsion
    if (count > 0) {
      const magnitude = Math.sqrt(repulsionX * repulsionX + repulsionY * repulsionY);
      if (magnitude > 0) {
        repulsionX /= magnitude;
        repulsionY /= magnitude;
      }
    }
    
    return { 
      x: repulsionX, 
      y: repulsionY, 
      magnitude: Math.sqrt(repulsionX * repulsionX + repulsionY * repulsionY)
    };
  }

  /**
   * Check if a point is occupied by existing branches or central circle
   * @param {number} x - X coordinate
   * @param {number} y - Y coordinate
   * @returns {boolean} True if occupied
   */
  isOccupied(x, y) {
    const config = HyphaeGrowth.CONFIG;
    
    // Check if point is within the central circle
    const dx = x - (this.viewBoxWidth / 2);
    const dy = y - (this.viewBoxHeight / 2);
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < config.CIRCLE_RADIUS) {
      return true;
    }
    
    // Check if point is too close to existing branches - simpler implementation
    const minDistance = config.MIN_DISTANCE;
    return this.branches.some(branch => {
      // Check endpoints first (quick rejection)
      const d1 = Math.hypot(x - branch.x1, y - branch.y1);
      const d2 = Math.hypot(x - branch.x2, y - branch.y2);
      if (d1 < minDistance || d2 < minDistance) return true;
      
      // Check distance to line segment
      const A = x - branch.x1;
      const B = y - branch.y1;
      const C = branch.x2 - branch.x1;
      const D = branch.y2 - branch.y1;
      
      const dot = A * C + B * D;
      const len_sq = C * C + D * D;
      let param = -1;
      
      if (len_sq !== 0) param = dot / len_sq;
      
      let xx, yy;
      
      if (param < 0) {
        xx = branch.x1;
        yy = branch.y1;
      } else if (param > 1) {
        xx = branch.x2;
        yy = branch.y2;
      } else {
        xx = branch.x1 + param * C;
        yy = branch.y1 + param * D;
      }
      
      const d = Math.hypot(x - xx, y - yy);
      return d < minDistance;
    });
  }

  /**
   * Normalize an angle difference to the range -PI to PI
   * @param {number} angle - The angle in radians
   * @returns {number} Normalized angle in radians
   */
  normalizeAngle(angle) {
    // Ensure angle is between -PI and PI
    while (angle > Math.PI) angle -= 2 * Math.PI;
    while (angle < -Math.PI) angle += 2 * Math.PI;
    return angle;
  }
  
  /**
   * Check if a point is within the viewBox boundaries
   * @param {number} x - X coordinate
   * @param {number} y - Y coordinate
   * @returns {boolean} True if in bounds
   */
  isInBounds(x, y) {
    return x >= 0 && x <= this.viewBoxWidth && 
          y >= 0 && y <= this.viewBoxHeight;
  }

  /**
   * Calculate branch depth from root
   * @param {number|null} branchId - ID of the branch
   * @returns {number} Depth of the branch
   */
  calculateBranchDepth(branchId) {
    if (branchId === null) return 0;
    
    let depth = 0;
    let currentId = branchId;
    
    while (currentId !== null) {
      depth++;
      const parentBranch = this.branches[currentId];
      if (!parentBranch) break;
      currentId = parentBranch.parent;
    }
    
    return depth;
  }

  /**
   * Grow the pattern by one step with improved animation flow and performance optimizations
   * Creates new branches from active points and updates thicknesses
   */
  grow() {
    const config = HyphaeGrowth.CONFIG;
    const newPoints = [];
    const updatedBranches = new Set();
    
    // Process points in order of creation (makes animation more natural)
    this.points.forEach(point => {
      let foundPath = false;
      let attempts = 0;
      let currentDirection = point.direction;
      
      // Calculate branch depth for variable parameters
      const branchDepth = this.calculateBranchDepth(point.branchId);
      
      // Adjust randomness and length based on depth
      const depthFactor = Math.min(1, branchDepth / 10);
      const directionRandomness = config.DIRECTION_RANDOMNESS * (1 - depthFactor * 0.3);
      const branchLength = this.branchLength * (1 - depthFactor * 0.2);
      
      while (!foundPath && attempts < config.MAX_ATTEMPTS) {
        // Start with base direction with randomness
        let testDirection = currentDirection + 
          (Math.random() - 0.5) * directionRandomness;
        
        // Apply tropism effects (directional biases) to simulate natural growth factors
        
        // 1. Phototropism: tendency to grow towards light (upward)
        // Affects horizontal branches more than vertical ones
        const verticalFactor = Math.abs(Math.cos(testDirection));
        const phototropicEffect = -config.PHOTOTROPISM * verticalFactor; // Negative Y is up
        
        // 2. Gravitropism: response to gravity, stronger at deeper levels
        // Only apply if enabled in config
        const gravitropicEffect = config.USE_GRAVITY ? 
          config.GRAVITROPISM * depthFactor : 0;
        
        // 3. Space colonization: calculate repulsion from nearby branches
        // This creates more natural avoidance patterns
        const searchRadius = this.branchLength * 3; // Look ahead for obstacles
        const repulsion = this.getRepulsionVector(point.x, point.y, searchRadius);
        
        // Apply repulsion if significant
        let thigmotropicEffect = 0;
        if (repulsion.magnitude > 0.01) {
          // Calculate angle of repulsion vector
          const repulsionAngle = Math.atan2(repulsion.y, repulsion.x);
          
          // Factor in proximity and attempt count for stronger avoidance
          const avoidanceStrength = config.THIGMOTROPISM * 
            (0.5 + 0.5 * (attempts / config.MAX_ATTEMPTS));
            
          // Calculate angle difference
          const angleDiff = this.normalizeAngle(repulsionAngle - testDirection);
          
          // Apply thigmotropic effect (obstacle avoidance)
          thigmotropicEffect = angleDiff * avoidanceStrength;
        } else if (attempts > 0) {
          // If we've had failed attempts but no clear repulsion vector,
          // add some randomness to try new directions
          thigmotropicEffect = (Math.random() - 0.5) * 
            config.THIGMOTROPISM * (attempts / config.MAX_ATTEMPTS) * Math.PI;
        }
        
        // Apply all tropism adjustments
        // Stronger phototropism for branches that are more horizontal
        testDirection += phototropicEffect * Math.PI/2; 
        
        // Gravity pulls branches downward based on depth
        testDirection += gravitropicEffect * Math.PI/2;
        
        // Apply thigmotropism/obstacle avoidance
        testDirection += thigmotropicEffect;
        
        // Calculate new position with all effects applied
        const newX = point.x + Math.cos(testDirection) * branchLength;
        const newY = point.y + Math.sin(testDirection) * branchLength;
        
        if (!this.isOccupied(newX, newY) && this.isInBounds(newX, newY)) {
          const branchId = this.branches.length;
          const branch = {
            x1: point.x,
            y1: point.y,
            x2: newX,
            y2: newY,
            parent: point.branchId,
            seedIndex: point.seedIndex,
            depth: branchDepth + 1
          };
          
          this.branches.push(branch);
          this.drawBranch(branch, branchId, point.seedIndex);
          this.incrementChildCount(point.branchId);
          
          // Track branches that need thickness updates
          if (point.branchId !== null) {
            let currentId = point.branchId;
            while (currentId !== null) {
              updatedBranches.add(currentId);
              currentId = this.branches[currentId].parent;
            }
          }
          
          // Create new growth point
          newPoints.push({
            x: newX,
            y: newY,
            direction: testDirection,
            branchId: branchId,
            seedIndex: point.seedIndex
          });
          
          // Branch probability decreases with depth to prevent overcrowding
          const depthAdjustedProbability = config.BRANCHING_PROBABILITY * 
            Math.max(0.2, 1 - (depthFactor * 0.5));
            
          // Randomly create branch point with probability
          if (Math.random() < depthAdjustedProbability) {
            // Use natural branching patterns based on Fibonacci sequence and golden angle
            let branchAngle;
            
            // Select branching angle based on depth in Fibonacci sequence
            const fibIndex = Math.min(branchDepth % config.FIBONACCI_SEQUENCE.length, 
                                    config.FIBONACCI_SEQUENCE.length - 1);
            const fibValue = config.FIBONACCI_SEQUENCE[fibIndex];
            
            if (config.USE_GOLDEN_ANGLE && branchDepth % 3 === 0) {
              // If enabled, use golden angle for more natural spread on every third level
              branchAngle = config.GOLDEN_ANGLE;
            } else {
              // Otherwise use phyllotaxis-inspired angles from pre-defined set
              const angleIndex = branchDepth % config.BRANCHING_ANGLES.length;
              branchAngle = config.BRANCHING_ANGLES[angleIndex];
            }
            
            // Alternate angle direction (left/right branching) based on Fibonacci values
            const direction = fibValue % 2 === 0 ? 1 : -1;
            
            // Create the new branch point
            newPoints.push({
              x: newX,
              y: newY,
              direction: testDirection + (branchAngle * direction),
              branchId: branchId,
              seedIndex: point.seedIndex
            });
          }
          
          foundPath = true;
        } else {
          // Adjust direction if blocked
          currentDirection += config.BLOCKED_DIRECTION_CHANGE + 
            (Math.random() - 0.5) * config.BLOCKED_DIRECTION_RANDOMNESS;
          attempts++;
        }
      }
    });
    
    // Update thickness of modified branches
    if (updatedBranches.size > 0) {
      updatedBranches.forEach(branchId => {
        this.updateBranchThickness(branchId);
      });
    }
    
    // Set new growth points
    this.points = newPoints;
    
    // No need to flush buffer as we're using direct DOM manipulation
  }
}

/**
 * FooterGrowth - Specialized growth pattern for website footer
 * Extends the base HyphaeGrowth with footer-specific behaviors
 */
class FooterGrowth extends HyphaeGrowth {
  // Footer-specific configuration that overrides parent defaults
  static FOOTER_CONFIG = {
    // Structural parameters
    BRANCH_LENGTH: 5.0,
    MAX_BRANCHES: 3000,
    MAX_THICKNESS: 3.0,
    MIN_THICKNESS: 0.4,
    MIN_DISTANCE: 4.0,
    
    // Growth behavior
    DIRECTION_VARIANCE: 0.1,
    BRANCHING_PROBABILITY: 0.1,
    BRANCH_ANGLE: Math.PI / 6,
    
    // Layout
    BOTTOM_MARGIN: 0,
    NUM_SEEDS: 100,
    FOOTER_HEIGHT: 60,
    
    // Mobile-specific configuration
    MOBILE: {
      BRANCH_LENGTH: 3.0,
      MIN_DISTANCE: 2.0,
      MAX_BRANCHES: 1500,
      NUM_SEEDS: 50,
      MAX_THICKNESS: 2.0,
      MIN_THICKNESS: 0.2,
      DIRECTION_VARIANCE: 0.15
    }
  };

  /**
   * Create a new footer growth pattern
   * @param {SVGElement} svg - The SVG element to render in
   */
  constructor(svg) {
    super(svg);
    
    const config = FooterGrowth.FOOTER_CONFIG;
    const isMobile = window.innerWidth <= 768;
    
    // Apply appropriate configuration based on device
    if (isMobile) {
      this.branchLength = config.MOBILE.BRANCH_LENGTH;
      this.minDistance = config.MOBILE.MIN_DISTANCE;
      this.maxBranches = config.MOBILE.MAX_BRANCHES;
      this.maxThickness = config.MOBILE.MAX_THICKNESS;
      this.minThickness = config.MOBILE.MIN_THICKNESS;
      this.directionVariance = config.MOBILE.DIRECTION_VARIANCE;
      this.numSeeds = config.MOBILE.NUM_SEEDS;
    } else {
      this.branchLength = config.BRANCH_LENGTH;
      this.minDistance = config.MIN_DISTANCE;
      this.maxBranches = config.MAX_BRANCHES;
      this.maxThickness = config.MAX_THICKNESS;
      this.minThickness = config.MIN_THICKNESS;
      this.directionVariance = config.DIRECTION_VARIANCE;
      this.numSeeds = config.NUM_SEEDS;
    }
    
    // Set CSS variable for footer height
    document.documentElement.style.setProperty('--footer-height', `${config.FOOTER_HEIGHT}px`);
    
    // Initialize footer-specific properties
    this.initializeFooterProperties(svg);
  }

  /**
   * Initialize footer-specific properties and viewport
   * @param {SVGElement} svg - The SVG element
   */
  initializeFooterProperties(svg) {
    // Get actual container dimensions
    const container = svg.parentElement;
    const containerWidth = container.getBoundingClientRect().width;
    const containerHeight = container.getBoundingClientRect().height;
    
    // Set viewBox to match container exactly
    svg.setAttribute('viewBox', `0 0 ${containerWidth} ${containerHeight}`);
    this.viewBoxWidth = containerWidth;
    this.viewBoxHeight = containerHeight;
    
    // Reset points for footer-specific seed creation
    this.points = [];
    
    // Create color distribution
    this.createFooterSeeds();
  }

  /**
   * Create footer-specific seed points with distributed colors
   */
  createFooterSeeds() {
    const config = FooterGrowth.FOOTER_CONFIG;
    
    // Shuffle color indices for visual variety
    const colorIndices = Array.from({length: this.colors.length}, (_, i) => i);
    for (let i = colorIndices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [colorIndices[i], colorIndices[j]] = [colorIndices[j], colorIndices[i]];
    }
    
    // Create seeds across the bottom of the container
    const sectionWidth = this.viewBoxWidth / this.numSeeds;
    
    for (let i = 0; i < this.numSeeds; i++) {
      const baseX = i * sectionWidth;
      const x = baseX + sectionWidth * 0.5 + (Math.random() - 0.5) * sectionWidth * 0.3;
      const y = this.viewBoxHeight - config.BOTTOM_MARGIN;
      
      const direction = -Math.PI/2 + (Math.random() - 0.5) * this.directionVariance;
      // Use shuffled color index
      const colorIndex = colorIndices[i % colorIndices.length];
      this.addStartingPoint(x, y, direction, colorIndex);
    }
  }

  /**
   * Override addStartingPoint to use actual coordinates instead of scaled
   * @param {number} x - X coordinate (actual viewport coordinates)
   * @param {number} y - Y coordinate (actual viewport coordinates)
   * @param {number} direction - Growth direction in radians
   * @param {number} seedIndex - Index of the seed point
   */
  addStartingPoint(x, y, direction, seedIndex) {
    this.points.push({
      x: x,  // Don't scale coordinates since we're using actual width
      y: y,
      direction: direction,
      branchId: null,
      seedIndex: seedIndex
    });
  }
  
  /**
   * Override drawBranch to use footer-specific styles with continuous curves
   * @param {Object} branch - Branch object with coordinates
   * @param {number} branchId - ID of the branch
   * @param {number} seedIndex - Index of the seed point this branch belongs to
   */
  drawBranch(branch, branchId, seedIndex) {
    // Create a unique ID for the gradient
    const gradientId = `footer-gradient-${branchId}`;
    
    // Calculate the vectors for this branch
    const dx = branch.x2 - branch.x1;
    const dy = branch.y2 - branch.y1;
    const len = Math.sqrt(dx * dx + dy * dy);
    
    // Check if this branch has a parent to ensure continuous slope
    let continuousCurve = false;
    let parentControlPoint = null;
    
    if (branch.parent !== null) {
      const parentBranch = this.branches[branch.parent];
      if (parentBranch) {
        // Check if this branch starts where the parent ends
        if (parentBranch.x2 === branch.x1 && parentBranch.y2 === branch.y1) {
          continuousCurve = true;
          
          // Get parent's curve details if stored
          if (this.pathElements.has(branch.parent)) {
            const parentPathData = this.pathElements.get(branch.parent).dataset;
            if (parentPathData.cpX && parentPathData.cpY) {
              // Retrieve parent's control point
              const pcpX = parseFloat(parentPathData.cpX);
              const pcpY = parseFloat(parentPathData.cpY);
              
              // Store for later use
              parentControlPoint = { x: pcpX, y: pcpY };
            }
          }
        }
      }
    }
    
    // Determine control point for the curve
    let cpX, cpY;
    
    if (continuousCurve && parentControlPoint) {
      // Use the reflection of parent's control point for continuous tangent
      const reflectionX = 2 * branch.x1 - parentControlPoint.x;
      const reflectionY = 2 * branch.y1 - parentControlPoint.y;
      
      // For footer, we want to bias more toward upward growth
      const reflectionWeight = 0.3; // Less reflection weight for footer
      const targetWeight = 0.7;     // More target weight for footer
      
      // Add a slight upward bias (footer grows from bottom up)
      const upwardBias = dy < 0 ? -3 : 0; // Only apply upward bias when growing up
      
      // Blend between reflection and midpoint, with upward bias
      cpX = (reflectionWeight * reflectionX) + (targetWeight * (branch.x1 + dx * 0.5));
      cpY = (reflectionWeight * reflectionY) + (targetWeight * (branch.y1 + dy * 0.5)) + upwardBias;
    } else {
      // For branches without parents or non-continuous junctions
      // Create a gentler curve for footer growth
      const perpX = -dy / len * (len * 0.15);
      const perpY = dx / len * (len * 0.15);
      
      // Footer has predominantly upward growth
      const curveFactor = dy < 0 ? 1 : -1;
      
      // Calculate control point (for a quadratic curve)
      cpX = branch.x1 + dx * 0.5 + perpX * curveFactor;
      cpY = branch.y1 + dy * 0.5 + perpY * curveFactor;
    }
    
    // Create the path with a quadratic bezier curve
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", `M${branch.x1},${branch.y1} Q${cpX},${cpY} ${branch.x2},${branch.y2}`);
    path.classList.add("growth-path");
    
    // Add length class for animation timing - footer has more specific classes
    if (len < this.branchLength * 0.6) {
      path.classList.add("short");
    } else if (len > this.branchLength * 1.4) {
      path.classList.add("long");
    } else {
      path.classList.add("medium");
    }
    
    path.setAttribute("data-branch-id", branchId);
    
    // Store control point info for children to maintain continuity
    path.dataset.cpX = cpX.toString();
    path.dataset.cpY = cpY.toString();
    
    // Create gradient for the path - footer has more subtle gradients
    const baseColor = this.colors[seedIndex];
    const lightColor = this.lightenColor(baseColor, 15);
    const gradient = this.createBranchGradient(gradientId, baseColor, lightColor);
    this.svg.appendChild(gradient);
    
    // Apply gradient and other styles
    path.style.stroke = `url(#${gradientId})`;
    path.style.strokeWidth = this.minThickness;
    
    // Add the path to the SVG
    this.svg.appendChild(path);
    this.pathElements.set(branchId, path);
    
    // Store curve data in the branch for reference by children
    branch.controlPoint = { x: cpX, y: cpY };
  }

  /**
   * Override isOccupied with footer-specific collision detection
   * @param {number} x - X coordinate
   * @param {number} y - Y coordinate
   * @returns {boolean} True if occupied
   */
  isOccupied(x, y) {
    return this.branches.some(branch => {
      const d1 = Math.hypot(x - branch.x1, y - branch.y1);
      const d2 = Math.hypot(x - branch.x2, y - branch.y2);
      return d1 < this.minDistance || d2 < this.minDistance;
    });
  }

  /**
   * Override isInBounds with slight padding to prevent edge growth
   * @param {number} x - X coordinate
   * @param {number} y - Y coordinate
   * @returns {boolean} True if in bounds
   */
  isInBounds(x, y) {
    return x >= 2 && x <= (this.viewBoxWidth - 2) && y >= 0 && y <= (this.viewBoxHeight - 2);
  }

  /**
   * Override grow to enforce branch limit for performance
   */
  grow() {
    if (this.branches.length >= this.maxBranches) {
      this.points = [];  // Clear points to stop growth
      return;
    }
    super.grow();
  }
}

/**
 * Initialize footer growth animation on non-index pages
 */
function initializeFooterGrowth() {
  // Skip on index page
  if (window.location.pathname === '/' || window.location.pathname === '/index') {
    return;
  }

  const footerSvg = document.getElementById('footer-animation');
  
  if (!footerSvg) {
    // Retry once if SVG not found (may not be in DOM yet)
    setTimeout(initializeFooterGrowth, 500);
    return;
  }

  try {
    const footerPattern = new FooterGrowth(footerSvg);
    
    const footerInterval = setInterval(() => {
      try {
        footerPattern.grow();
        
        // Check if growth is complete
        if (footerPattern.points.length === 0 && 
            footerPattern.branches.length >= footerPattern.maxBranches) {
          clearInterval(footerInterval);
        }
      } catch (e) {
        // Stop on error
        clearInterval(footerInterval);
      }
    }, 50);
  } catch (e) {
    // Failed to initialize
  }
}

// Initialize as soon as DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeFooterGrowth);
} else {
  initializeFooterGrowth();
}