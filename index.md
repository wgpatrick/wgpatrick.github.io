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
</style>

<script>
class HyphaeGrowth {
  constructor(svg) {
    this.svg = svg;
    
    // Get actual SVG dimensions in pixels
    const svgRect = svg.getBoundingClientRect();
    this.width = svgRect.width;
    this.height = svgRect.height;
    
    // Adjust viewBox to match aspect ratio
    const aspectRatio = this.width / this.height;
    if (aspectRatio > 1) {
      // Wider than tall - adjust width
      svg.setAttribute('viewBox', `0 0 ${100 * aspectRatio} 100`);
      this.viewBoxWidth = 100 * aspectRatio;
      this.viewBoxHeight = 100;
    } else {
      // Taller than wide - adjust height
      svg.setAttribute('viewBox', `0 0 100 ${100 / aspectRatio}`);
      this.viewBoxWidth = 100;
      this.viewBoxHeight = 100 / aspectRatio;
    }
    
    // Initialize other properties
    this.points = [];
    this.branches = [];
    this.branchLength = 2;
    this.maxThickness = 2.0;
    this.minThickness = 0.1;
    this.childCounts = new Map();
    
    // Define colors for 10 seeds
    this.colors = [
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
    
    // Create random number of seeds (between 4 and 10)
    const numSeeds = Math.floor(Math.random() * 7) + 4; // Random integer from 4 to 10
    
    // Create the random seed points
    for (let seed = 0; seed < numSeeds; seed++) {
      const x = 10 + Math.random() * 80;
      const y = 10 + Math.random() * 80;
      
      const randomDirection = Math.random() * Math.PI * 2;
      // Add three directions, 120 degrees apart
      this.addStartingPoint(x, y, randomDirection, seed);
      this.addStartingPoint(x, y, randomDirection + (Math.PI * 2/3), seed);
      this.addStartingPoint(x, y, randomDirection + (Math.PI * 4/3), seed);
    }

    svg.addEventListener('click', () => {
      window.location.href = '/home';
    });

    // Create the "HI" mask
    this.createHiMask();

    // Create a text element but keep it hidden initially
    this.enterText = document.createElementNS("http://www.w3.org/2000/svg", "text");
    this.enterText.setAttribute("x", this.viewBoxWidth / 2);
    this.enterText.setAttribute("y", this.viewBoxHeight / 2);
    this.enterText.setAttribute("text-anchor", "middle");
    this.enterText.setAttribute("dominant-baseline", "middle");
    this.enterText.setAttribute("font-size", "1.6");
    this.enterText.setAttribute("fill", "#333");
    this.enterText.setAttribute("opacity", "0");
    this.enterText.textContent = "ENTER";
    this.svg.appendChild(this.enterText);

    // Add a Map to cache DOM elements
    this.pathElements = new Map();
  }

  createHiMask() {
    const circleMask = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    // Center based on viewBox dimensions
    circleMask.setAttribute("cx", this.viewBoxWidth / 2);  // Center x
    circleMask.setAttribute("cy", this.viewBoxHeight / 2);  // Center y
    circleMask.setAttribute("r", "15");
    circleMask.setAttribute("stroke", "none");
    circleMask.setAttribute("fill", "none");
    circleMask.id = "growth-mask";
    this.svg.appendChild(circleMask);
  }

  addStartingPoint(initialX, initialY, direction, seedIndex) {
    // Use the passed coordinates but scale them to viewBox
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
      
      // Recursively increment counts up the branch chain
      const parentBranch = this.branches[parentId];
      if (parentBranch && parentBranch.parent !== null) {
        this.incrementChildCount(parentBranch.parent);
      }
    }
  }

  calculateThickness(branchId) {
    const childCount = this.childCounts.get(branchId) || 0;
    // Scale factor increased to target ~250 descendants for max thickness
    const scaleFactor = 250; // Changed from 50 to 250
    
    // More gradual thickness increase
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
    
    // Cache the path element
    this.pathElements.set(branchId, path);
  }

  updateBranchThickness(branchId) {
    const path = this.pathElements.get(branchId);
    if (path) {
      path.style.strokeWidth = this.calculateThickness(branchId);
    }
  }

  isOccupied(x, y) {
    // First check if point is in the circle mask
    const circleMask = document.getElementById("growth-mask");
    const point = this.svg.createSVGPoint();
    point.x = x;
    point.y = y;
    
    // Calculate distance from center (adjusted for viewBox)
    const dx = x - (this.viewBoxWidth / 2);
    const dy = y - (this.viewBoxHeight / 2);
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < 15) {
      return true;
    }
    
    const minDistance = 1.0;
    return this.branches.some(branch => {
      // Check endpoints as before
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

  updateAllThicknesses() {
    const updates = new Map();
    
    // Calculate all thicknesses first
    this.branches.forEach((branch, branchId) => {
      updates.set(branchId, this.calculateThickness(branchId));
    });
    
    // Apply all updates at once
    updates.forEach((thickness, branchId) => {
      const path = this.pathElements.get(branchId);
      if (path) {
        path.style.strokeWidth = thickness;
      }
    });
  }

  grow() {
    const newPoints = [];
    const updatedBranches = new Set();
    
    this.points.forEach(point => {
      let foundPath = false;
      let attempts = 0;
      let currentDirection = point.direction;
      
      while (!foundPath && attempts < 8) {
        const testDirection = currentDirection + (Math.random() - 0.5) * 0.5;
        const newX = point.x + Math.cos(testDirection) * this.branchLength;
        const newY = point.y + Math.sin(testDirection) * this.branchLength;
        
        if (!this.isOccupied(newX, newY) && 
            this.isInBounds(newX, newY)) {
          
          const branchId = this.branches.length;
          const branch = {
            x1: point.x,
            y1: point.y,
            x2: newX,
            y2: newY,
            parent: point.branchId,
            seedIndex: point.seedIndex  // Preserve the seed index
          };
          
          this.branches.push(branch);
          this.drawBranch(branch, branchId, point.seedIndex);
          
          // Increment child counts and update thicknesses
          this.incrementChildCount(point.branchId);
          if (point.branchId !== null) {
            // Update thickness of all ancestors
            let currentId = point.branchId;
            while (currentId !== null) {
              updatedBranches.add(currentId);
              currentId = this.branches[currentId].parent;
            }
          }
          
          // Continue growth
          newPoints.push({
            x: newX,
            y: newY,
            direction: testDirection,
            branchId: branchId,
            seedIndex: point.seedIndex  // Pass along the seed index
          });
          
          // Random branching
          if (Math.random() < 0.15) {
            const branchAngle = (Math.random() > 0.5 ? 1 : -1) * Math.PI / 3;
            newPoints.push({
              x: newX,
              y: newY,
              direction: testDirection + branchAngle,
              branchId: branchId,
              seedIndex: point.seedIndex  // Pass along the seed index to the new branch
            });
          }
          
          foundPath = true;
        } else {
          currentDirection += Math.PI / 4 + (Math.random() - 0.5) * 0.2;
          attempts++;
        }
      }
    });
    
    // Batch update thicknesses at the end
    if (updatedBranches.size > 0) {
      this.updateAllThicknesses();
    }
    
    this.points = newPoints;
  }
}

// Start the animation when the page loads
document.addEventListener('DOMContentLoaded', () => {
  const svg = document.getElementById('growth-animation');
  const pattern = new HyphaeGrowth(svg);
  
  const growthInterval = setInterval(() => {
    pattern.grow();
    if (pattern.points.length === 0 || pattern.branches.length > 5000) {
      clearInterval(growthInterval);
      // Fade in the "Enter" text
      const enterText = pattern.enterText;
      enterText.style.transition = 'opacity 1s';
      enterText.style.opacity = '1';
    }
  }, 60);
});
</script>

<div class="intro-container">
  <div class="intro-text">
    I'm Will Patrick, a founder, engineer, and researcher interested in biology, robotics, fabrication, music, and more. I co-founded Culture Biosciences, where I served as CEO for 8 years, building cloud-based bioprocessing technology. 
    
    <p style="margin-top: 20px;">
      <a href="https://www.linkedin.com/in/wgpatrick">LinkedIn</a> •
      <a href="https://scholar.google.com/citations?user=pE91wmIAAAAJ&hl=en">Google Scholar</a> •
      <a href="mailto:wgpatrick@gmail.com">Email</a>
    </p>
  </div>
  <div class="intro-image">
    <img src="/assets/images/profile.jpg" alt="Will Patrick" class="profile-pic">
  </div>
</div>

**What I'm Up To Now**

- **Culture Biosciences** – I'm continuing to support the growth of Culture Biosciences, the company I founded, as a Board Member.
- **Building a Cabin** - I'm building a 1,200 sq-ft communal cabin in the Santa Cruz Mountains with 8 friends. 
- **Exploring LLMs** – I'm exploring how LLMs and AI models can transform biotech, healthcare, and robotics.
- **Music** – I'm making music using Ableton Live and Push 3. 
- **Dadding** - I live in Bernal Heights with my wife, two kids, and dog. 


