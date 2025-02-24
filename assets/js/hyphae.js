// Move the entire HyphaeGrowth class here from index.md
class HyphaeGrowth {
  // Growth Pattern Configuration
  static BRANCH_LENGTH = 2.4;
  static MAX_THICKNESS = 2.0;
  static MIN_THICKNESS = 0.1;
  static MIN_DISTANCE = 1.2;
  static THICKNESS_SCALE_FACTOR = 250;
  
  // Growth Behavior
  static MIN_SEEDS = 2;
  static MAX_SEEDS = 4;
  static BRANCHING_PROBABILITY = 0.15;
  static BRANCH_ANGLE = Math.PI / 3;
  static MAX_ATTEMPTS = 8;
  static DIRECTION_RANDOMNESS = 0.1;
  static BLOCKED_DIRECTION_CHANGE = Math.PI / 4;
  static BLOCKED_DIRECTION_RANDOMNESS = 0.2;
  
  // Visual Elements
  static CIRCLE_RADIUS = 15;
  static EDGE_PADDING = 10;
  static FONT_SIZE = 1.6;
  static MAX_BRANCHES = 5000;
  
  // Color Palette
  static COLORS = [
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
  ];

  // Add more static constants that we want to control
  static CIRCLE_SIZE = 15;
  static GROWTH_SPEED = 10;
  static MAX_BRANCH_COUNT = 5000;
  static DIRECTION_CHANGE = 0.1;

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
    
    // Initialize properties
    this.points = [];
    this.branches = [];
    this.branchLength = HyphaeGrowth.BRANCH_LENGTH;
    this.maxThickness = HyphaeGrowth.MAX_THICKNESS;
    this.minThickness = HyphaeGrowth.MIN_THICKNESS;
    this.childCounts = new Map();
    this.colors = HyphaeGrowth.COLORS;
    this.pathElements = new Map();
    
    // Create random number of seeds
    const numSeeds = Math.floor(Math.random() * 
      (HyphaeGrowth.MAX_SEEDS - HyphaeGrowth.MIN_SEEDS + 1)) + 
      HyphaeGrowth.MIN_SEEDS;
    
    // Create the random seed points
    for (let seed = 0; seed < numSeeds; seed++) {
      const x = HyphaeGrowth.EDGE_PADDING + 
        Math.random() * (100 - 2 * HyphaeGrowth.EDGE_PADDING);
      const y = HyphaeGrowth.EDGE_PADDING + 
        Math.random() * (100 - 2 * HyphaeGrowth.EDGE_PADDING);
      
      const randomDirection = Math.random() * Math.PI * 2;
      this.addStartingPoint(x, y, randomDirection, seed);
      this.addStartingPoint(x, y, randomDirection + (Math.PI * 2/3), seed);
      this.addStartingPoint(x, y, randomDirection + (Math.PI * 4/3), seed);
    }

    svg.addEventListener('click', () => {
      window.location.href = '/home';
    });

    this.createHiMask();
    
    // Create text element
    this.enterText = document.createElementNS("http://www.w3.org/2000/svg", "text");
    this.enterText.setAttribute("x", this.viewBoxWidth / 2);
    this.enterText.setAttribute("y", this.viewBoxHeight / 2);
    this.enterText.setAttribute("text-anchor", "middle");
    this.enterText.setAttribute("dominant-baseline", "middle");
    this.enterText.setAttribute("font-size", HyphaeGrowth.FONT_SIZE);
    this.enterText.setAttribute("fill", "#333");
    this.enterText.setAttribute("opacity", "0");
    this.enterText.textContent = "ENTER";
    this.svg.appendChild(this.enterText);
  }

  createHiMask() {
    const circleMask = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circleMask.setAttribute("cx", this.viewBoxWidth / 2);
    circleMask.setAttribute("cy", this.viewBoxHeight / 2);
    circleMask.setAttribute("r", HyphaeGrowth.CIRCLE_RADIUS);
    circleMask.setAttribute("stroke", "none");
    circleMask.setAttribute("fill", "none");
    circleMask.id = "growth-mask";
    this.svg.appendChild(circleMask);
  }

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

  calculateThickness(branchId) {
    const childCount = this.childCounts.get(branchId) || 0;
    const scaleFactor = HyphaeGrowth.THICKNESS_SCALE_FACTOR;
    
    return this.minThickness + 
      ((this.maxThickness - this.minThickness) * (1 - Math.exp(-childCount / scaleFactor)));
  }

  drawBranch(branch, branchId, seedIndex) {
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", `M${branch.x1},${branch.y1} L${branch.x2},${branch.y2}`);
    path.classList.add("growth-path");
    path.setAttribute("data-branch-id", branchId);
    path.style.stroke = this.colors[seedIndex];
    path.style.strokeWidth = this.minThickness;
    this.svg.appendChild(path);
    this.pathElements.set(branchId, path);
  }

  updateBranchThickness(branchId) {
    const path = this.pathElements.get(branchId);
    if (path) {
      path.style.strokeWidth = this.calculateThickness(branchId);
    }
  }

  isOccupied(x, y) {
    const dx = x - (this.viewBoxWidth / 2);
    const dy = y - (this.viewBoxHeight / 2);
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < HyphaeGrowth.CIRCLE_RADIUS) {
      return true;
    }
    
    const minDistance = HyphaeGrowth.MIN_DISTANCE;
    return this.branches.some(branch => {
      const d1 = Math.hypot(x - branch.x1, y - branch.y1);
      const d2 = Math.hypot(x - branch.x2, y - branch.y2);
      if (d1 < minDistance || d2 < minDistance) return true;
      
      const A = x - branch.x1;
      const B = y - branch.y1;
      const C = branch.x2 - branch.x1;
      const D = branch.y2 - branch.y1;
      
      const dot = A * C + B * D;
      const len_sq = C * C + D * D;
      let param = -1;
      
      if (len_sq != 0) param = dot / len_sq;
      
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

  isInBounds(x, y) {
    return x >= 0 && x <= this.viewBoxWidth && 
           y >= 0 && y <= this.viewBoxHeight;
  }

  grow() {
    const newPoints = [];
    const updatedBranches = new Set();
    
    this.points.forEach(point => {
      let foundPath = false;
      let attempts = 0;
      let currentDirection = point.direction;
      
      while (!foundPath && attempts < HyphaeGrowth.MAX_ATTEMPTS) {
        const testDirection = currentDirection + 
          (Math.random() - 0.5) * HyphaeGrowth.DIRECTION_RANDOMNESS;
        const newX = point.x + Math.cos(testDirection) * this.branchLength;
        const newY = point.y + Math.sin(testDirection) * this.branchLength;
        
        if (!this.isOccupied(newX, newY) && this.isInBounds(newX, newY)) {
          const branchId = this.branches.length;
          const branch = {
            x1: point.x,
            y1: point.y,
            x2: newX,
            y2: newY,
            parent: point.branchId,
            seedIndex: point.seedIndex
          };
          
          this.branches.push(branch);
          this.drawBranch(branch, branchId, point.seedIndex);
          this.incrementChildCount(point.branchId);
          
          if (point.branchId !== null) {
            let currentId = point.branchId;
            while (currentId !== null) {
              updatedBranches.add(currentId);
              currentId = this.branches[currentId].parent;
            }
          }
          
          newPoints.push({
            x: newX,
            y: newY,
            direction: testDirection,
            branchId: branchId,
            seedIndex: point.seedIndex
          });
          
          if (Math.random() < HyphaeGrowth.BRANCHING_PROBABILITY) {
            const branchAngle = (Math.random() > 0.5 ? 1 : -1) * HyphaeGrowth.BRANCH_ANGLE;
            newPoints.push({
              x: newX,
              y: newY,
              direction: testDirection + branchAngle,
              branchId: branchId,
              seedIndex: point.seedIndex
            });
          }
          
          foundPath = true;
        } else {
          currentDirection += HyphaeGrowth.BLOCKED_DIRECTION_CHANGE + 
            (Math.random() - 0.5) * HyphaeGrowth.BLOCKED_DIRECTION_RANDOMNESS;
          attempts++;
        }
      }
    });
    
    if (updatedBranches.size > 0) {
      updatedBranches.forEach(branchId => {
        this.updateBranchThickness(branchId);
      });
    }
    
    this.points = newPoints;
  }
}

class FooterGrowth extends HyphaeGrowth {
  // Growth Configuration
  static BRANCH_LENGTH = 5.0;
  static MAX_BRANCHES = 3000;
  static MAX_THICKNESS = 3.0;
  static MIN_THICKNESS = 0.4;
  static MIN_DISTANCE = 4.0;
  static DIRECTION_VARIANCE = 0.1;
  static BRANCHING_PROBABILITY = 0.1;
  static BRANCH_ANGLE = Math.PI / 6;
  static BOTTOM_MARGIN = 0;
  static NUM_SEEDS = 100;
  static FOOTER_HEIGHT = 90;  // Added footer height constant

  constructor(svg) {
    super(svg);
    
    // Set CSS variable for footer height
    document.documentElement.style.setProperty('--footer-height', `${FooterGrowth.FOOTER_HEIGHT}px`);
    
    // Get actual container dimensions
    const container = svg.parentElement;
    const containerWidth = container.getBoundingClientRect().width;
    const containerHeight = container.getBoundingClientRect().height;
    
    // Set viewBox to match container exactly
    svg.setAttribute('viewBox', `0 0 ${containerWidth} ${containerHeight}`);
    this.viewBoxWidth = containerWidth;
    this.viewBoxHeight = containerHeight;
    
    // Use static configuration
    this.branchLength = FooterGrowth.BRANCH_LENGTH;
    this.maxBranches = FooterGrowth.MAX_BRANCHES;
    this.maxThickness = FooterGrowth.MAX_THICKNESS;
    this.minThickness = FooterGrowth.MIN_THICKNESS;
    this.minDistance = FooterGrowth.MIN_DISTANCE;
    
    this.points = [];
    
    // Shuffle color indices
    const colorIndices = Array.from({length: this.colors.length}, (_, i) => i);
    for (let i = colorIndices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [colorIndices[i], colorIndices[j]] = [colorIndices[j], colorIndices[i]];
    }
    
    // Create multiple seeds with shuffled colors
    const sectionWidth = this.viewBoxWidth / FooterGrowth.NUM_SEEDS;
    
    for (let i = 0; i < FooterGrowth.NUM_SEEDS; i++) {
      const baseX = i * sectionWidth;
      const x = baseX + sectionWidth * 0.5 + (Math.random() - 0.5) * sectionWidth * 0.3;
      const y = this.viewBoxHeight - FooterGrowth.BOTTOM_MARGIN;
      
      const direction = -Math.PI/2 + (Math.random() - 0.5) * FooterGrowth.DIRECTION_VARIANCE;
      // Use shuffled color index
      const colorIndex = colorIndices[i % colorIndices.length];
      this.addStartingPoint(x, y, direction, colorIndex);
    }
  }

  // Override addStartingPoint to log actual coordinates
  addStartingPoint(x, y, direction, seedIndex) {
    console.log(`Adding seed ${seedIndex} at actual coordinates:`, { x, y });
    this.points.push({
      x: x,  // Don't scale coordinates since we're using actual width
      y: y,
      direction: direction,
      branchId: null,
      seedIndex: seedIndex
    });
  }

  isOccupied(x, y) {
    return this.branches.some(branch => {
      const d1 = Math.hypot(x - branch.x1, y - branch.y1);
      const d2 = Math.hypot(x - branch.x2, y - branch.y2);
      return d1 < this.minDistance || d2 < this.minDistance;
    });
  }

  isInBounds(x, y) {
    return x >= 2 && x <= (this.viewBoxWidth - 2) && y >= 0 && y <= (this.viewBoxHeight - 2);
  }

  // Override grow to enforce branch limit
  grow() {
    if (this.branches.length >= FooterGrowth.MAX_BRANCHES) {
      this.points = [];  // Clear points to stop growth
      return;
    }
    super.grow();
  }
}

// Initialize footer growth only on the home page
function initializeFooterGrowth() {
  // Check if we're on the home page
  if (!window.location.pathname.includes('/home')) {
    console.log('Not on home page, skipping footer growth');
    return;
  }

  console.log('=== Debug: Footer Growth Initialization ===');
  console.log('1. Looking for footer SVG...');
  const footerSvg = document.getElementById('footer-animation');
  
  if (!footerSvg) {
    console.error('Error: Footer SVG not found!');
    console.log('Current elements with IDs:', 
      Array.from(document.querySelectorAll('[id]')).map(el => el.id)
    );
    console.log('Retrying in 500ms...');
    setTimeout(initializeFooterGrowth, 500);
    return;
  }

  try {
    console.log('2. Found SVG:', {
      id: footerSvg.id,
      viewBox: footerSvg.getAttribute('viewBox'),
      width: footerSvg.clientWidth,
      height: footerSvg.clientHeight,
      parent: footerSvg.parentElement.className
    });

    console.log('3. Creating FooterGrowth instance...');
    const footerPattern = new FooterGrowth(footerSvg);
    console.log('4. Initial pattern state:', {
      points: footerPattern.points.length,
      branches: footerPattern.branches.length,
      viewBoxWidth: footerPattern.viewBoxWidth,
      viewBoxHeight: footerPattern.viewBoxHeight
    });
    
    console.log('5. Starting growth interval...');
    const footerInterval = setInterval(() => {
      try {
        footerPattern.grow();
        const state = {
          points: footerPattern.points.length,
          branches: footerPattern.branches.length,
          paths: footerSvg.querySelectorAll('path').length
        };
        console.log('Growth state:', state);
        
        if (state.points === 0 && state.branches >= FooterGrowth.MAX_BRANCHES) {
          console.log('Growth complete!', state);
          clearInterval(footerInterval);
        }
      } catch (e) {
        console.error('Growth error:', e);
        console.error('Stack:', e.stack);
        clearInterval(footerInterval);
      }
    }, 50);
  } catch (e) {
    console.error('Initialization error:', e);
    console.error('Stack:', e.stack);
  }
}

// Try to initialize as soon as possible
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeFooterGrowth);
} else {
  initializeFooterGrowth();
} 