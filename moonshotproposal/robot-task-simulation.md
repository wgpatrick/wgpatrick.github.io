# Robot-Task Learning Curve Simulation

## Project Overview

**Goal**: Build a live demo that shows how long it might take our mobile-robot program to drive the failure-rate of ~1,000 tasks down to GMP specification.

This browser-based histogram simulator (HTML + vanilla JS + Chart.js) demonstrates the learning curve for robotic task automation in biomanufacturing facilities, showing how failure rates decrease over time through real-world training and simulation.

## 1. Business Background

### Process Context
- **Unit Operations**: 10-15 distinct biomanufacturing unit operations
- **Total Tasks**: Approximately 1,000 individual robotic tasks across all operations
- **Target**: Achieve GMP (Good Manufacturing Practice) specification reliability

### Initial Task Difficulty
- **Starting failure rate**: Log-normally distributed with median = 10%
- **Rationale**: 
  - Industrial pick-and-place reliability literature reports 88-90% average uptime
  - BioPlan surveys show 2-3% batch loss due to human error and contamination
  - This gives us a realistic starting point for task complexity distribution

### Training Modalities

#### 1. Real-World Data Collection (Teleoperation)
- **Batch size**: 25 fixed tasks at a time
- **Lock duration**: 180 days due to fixturing and validation constraints
- **Rationale**: Physical setup changes require extensive revalidation in GMP environments

#### 2. Simulation Data Collection
- **Batch size**: 25 random tasks per epoch
- **Flexibility**: Can rotate task selection every epoch (1 day)
- **Efficiency**: 10% transfer efficiency compared to real-world training

### Learning Curve Model
Tasks improve according to a power law decay:

```
f(t) = f₀ · (t + 1)^(-β) + floor
```

Where:
- `f₀` = initial failure rate
- `t` = training time (hours)
- `β` = learning exponent (0.8)
- `floor` = minimum achievable failure rate (0.01%)

#### Training Coefficients
- **Real-world training**: 1.0× coefficient
- **Simulation training**: 0.1× coefficient (10% efficiency)
- **Transfer learning**: Any improvement on trained tasks gives 1% of that delta to all other tasks

### Budget Constraints
- **Total real-world hours**: 1,000,000
- **Per campaign consumption**: 25 tasks × 24 h/day × 180 days ≈ 108,000 hours
- **Total campaigns**: ~9 real-world campaigns possible
- **Simulation hours**: Equal to real-world hours per epoch for simplicity

## 2. Numerical Constants

```javascript
const SIMULATION_CONFIG = {
    N_TASKS: 1000,
    EPOCHS: 900,                    // 900 days ≈ 9 real campaigns
    REAL_BATCH_SIZE: 25,
    SIM_BATCH_SIZE: 25,
    REAL_CAMPAIGN_DAYS: 180,
    REAL_HOURS_PER_DAY: 24,
    SIM_HOURS_PER_TASK_PER_EPOCH: 24,
    BETA: 0.8,
    SIM_EFFICIENCY: 0.10,
    TRANSFER_COEFF: 0.01,
    FLOOR_FAILURE: 0.0001           // 0.01%
};
```

## 3. Web Deliverable Architecture

### File Structure
```
moonshotproposal/
├── index.html                     # Main presentation (add simulation section)
├── robot-task-sim.css             # Simulation-specific styles
├── robot-task-sim.js              # Simulation logic and Task class
└── robot-task-simulation.md       # This documentation
```

### Dependencies
- **Chart.js v4**: Include from CDN for histogram visualization
- **Vanilla JavaScript**: No additional frameworks required
- **Reveal.js**: Integrate into existing presentation framework

### Components
1. **Canvas element**: For Chart.js histogram
2. **Control buttons**: "Next Epoch" and "Run to End"
3. **Status display**: Current epoch, mean failure rate, tasks meeting spec
4. **Legend**: Color-coded buckets and explanations

## 4. Simulation Logic Details

### 4.1 Task Initialization
```javascript
// Log-normal distribution for initial failure rates
const mu = Math.log(0.10);        // median 10%
const sigma = 0.75;               // realistic long tail distribution

// Generate initial failure rate for each task
function generateInitialFailure() {
    const normal = boxMullerRandom(); // Standard normal random
    const logNormal = Math.exp(mu + sigma * normal);
    return Math.min(1.0, Math.max(0.0001, logNormal)); // Clamp to [0.01%, 100%]
}
```

### 4.2 Campaign Management
```javascript
class CampaignManager {
    constructor() {
        this.currentCampaign = 0;
        this.realTasks = [];        // Fixed for 180 days
        this.campaignStartEpoch = 0;
    }
    
    updateCampaign(epoch) {
        if ((epoch - this.campaignStartEpoch) >= REAL_CAMPAIGN_DAYS) {
            this.currentCampaign++;
            this.campaignStartEpoch = epoch;
            this.selectNewRealTasks();
        }
    }
    
    selectNewRealTasks() {
        // Select 25 random tasks for real-world training
        this.realTasks = selectRandomTasks(REAL_BATCH_SIZE);
    }
}
```

### 4.3 Learning Update Algorithm
```javascript
function updateTaskFailureRate(task, hours, isSimulation = false) {
    const coeff = isSimulation ? SIM_EFFICIENCY : 1.0;
    const delta = coeff * Math.pow(hours, -BETA);
    
    const improvement = delta * (task.failureRate - FLOOR_FAILURE);
    task.failureRate = Math.max(FLOOR_FAILURE, task.failureRate - improvement);
    
    return improvement;
}

function applyTransferLearning(tasks, totalImprovement) {
    const transferAmount = TRANSFER_COEFF * totalImprovement;
    tasks.forEach(task => {
        if (!task.isTraining) {
            const improvement = transferAmount * (task.failureRate - FLOOR_FAILURE);
            task.failureRate = Math.max(FLOOR_FAILURE, task.failureRate - improvement);
        }
    });
}
```

### 4.4 Epoch Execution
```javascript
function runEpoch(epoch, tasks, campaignManager) {
    // Update campaign if needed
    campaignManager.updateCampaign(epoch);
    
    // Select simulation tasks (random each epoch)
    const simTasks = selectRandomTasks(SIM_BATCH_SIZE, campaignManager.realTasks);
    
    let totalImprovement = 0;
    
    // Train real-world tasks
    campaignManager.realTasks.forEach(taskId => {
        const improvement = updateTaskFailureRate(
            tasks[taskId], 
            REAL_HOURS_PER_DAY, 
            false
        );
        totalImprovement += improvement;
        tasks[taskId].isTraining = true;
    });
    
    // Train simulation tasks
    simTasks.forEach(taskId => {
        const improvement = updateTaskFailureRate(
            tasks[taskId], 
            SIM_HOURS_PER_TASK_PER_EPOCH, 
            true
        );
        totalImprovement += improvement;
        tasks[taskId].isTraining = true;
    });
    
    // Apply transfer learning to all other tasks
    applyTransferLearning(tasks, totalImprovement);
    
    // Reset training flags
    tasks.forEach(task => task.isTraining = false);
}
```

## 5. Visualization Specifications

### 5.1 Histogram Buckets (Log Scale)
```javascript
const FAILURE_BUCKETS = [
    { threshold: 1e-1, label: "10-100%", color: "#FF4444" },
    { threshold: 1e-2, label: "1-10%", color: "#FF8844" },
    { threshold: 1e-3, label: "0.1-1%", color: "#FFAA44" },
    { threshold: 1e-4, label: "0.01-0.1%", color: "#44AA44" },
    { threshold: 1e-5, label: "<0.01%", color: "#44AA88" }
];
```

### 5.2 Chart.js Configuration
```javascript
const chartConfig = {
    type: 'bar',
    data: {
        labels: FAILURE_BUCKETS.map(b => b.label),
        datasets: [{
            label: 'Number of Tasks',
            data: [], // Updated each epoch
            backgroundColor: FAILURE_BUCKETS.map(b => b.color),
            borderColor: FAILURE_BUCKETS.map(b => b.color),
            borderWidth: 1
        }]
    },
    options: {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: 'Task Failure Rate Distribution Over Time'
            },
            legend: {
                display: false
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Number of Tasks'
                }
            },
            x: {
                title: {
                    display: true,
                    text: 'Failure Rate Range'
                }
            }
        }
    }
};
```

## 6. User Interface Controls

### 6.1 Control Buttons
- **Next Epoch**: Advances simulation by one day, updates display
- **Run to End**: Executes all remaining epochs with progress indication
- **Reset**: Reinitializes simulation with new random seed

### 6.2 Status Display
```javascript
function updateStatusDisplay(epoch, tasks) {
    const meanFailure = calculateMeanFailureRate(tasks);
    const tasksAtSpec = tasks.filter(t => t.failureRate <= FLOOR_FAILURE).length;
    const percentAtSpec = (tasksAtSpec / N_TASKS * 100).toFixed(1);
    
    document.getElementById('epoch-counter').textContent = `Day: ${epoch}`;
    document.getElementById('mean-failure').textContent = 
        `Mean Failure Rate: ${(meanFailure * 100).toFixed(3)}%`;
    document.getElementById('spec-compliance').textContent = 
        `Tasks at GMP Spec: ${tasksAtSpec} (${percentAtSpec}%)`;
}
```

## 7. Implementation Steps

### Step 1: HTML Structure
1. Add simulation section to existing Reveal.js presentation
2. Include Chart.js CDN link
3. Create canvas element and control panel
4. Add status display elements

### Step 2: CSS Styling
1. Create responsive layout for chart and controls
2. Style buttons and status display
3. Ensure compatibility with existing presentation theme

### Step 3: JavaScript Implementation
1. Implement Task class and initialization
2. Create CampaignManager class
3. Implement learning curve algorithms
4. Set up Chart.js integration
5. Add event handlers for controls

### Step 4: Integration
1. Test within Reveal.js presentation
2. Verify Chart.js animations work smoothly
3. Ensure "Run to End" completes within reasonable time
4. Validate all numerical constants match specifications

## 8. Expected Outcomes

### Performance Metrics
- **Simulation speed**: Complete 900 epochs in ≤1 second when using "Run to End"
- **Visual feedback**: Smooth histogram animation showing learning progress
- **Final state**: Significant number of tasks reaching GMP specification (≤0.01% failure)

### Business Insights
- **Training efficiency**: Demonstrates value of combining real-world and simulation training
- **Transfer learning impact**: Shows how training on subset benefits entire task portfolio
- **Timeline estimation**: Provides realistic timeline for achieving GMP compliance across all tasks

## 9. Technical Validation

### Verification Checklist
- [ ] All constants match Section 2 specifications
- [ ] Log-normal initialization produces realistic distribution
- [ ] Power law learning curve implemented correctly
- [ ] Transfer learning affects only non-training tasks
- [ ] Campaign management follows 180-day cycles
- [ ] Histogram buckets count tasks correctly
- [ ] Chart.js updates smoothly each epoch
- [ ] UI remains responsive during "Run to End"

### Test Cases
1. **Single epoch progression**: Verify failure rates decrease appropriately
2. **Campaign transitions**: Ensure new task selection every 180 days
3. **Transfer learning**: Confirm non-training tasks improve slowly
4. **Boundary conditions**: Test behavior at minimum failure rates
5. **Full simulation**: Validate end-state distribution and metrics 