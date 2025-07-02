// Robot Task Learning Curve Simulation
// Implementation based on robot-task-simulation.md specification

// Configuration constants
const SIMULATION_CONFIG = {
    N_TASKS: 1000,
    EPOCHS: 900,                    // 900 days ≈ 30 real campaigns
    REAL_BATCH_SIZE: 25,
    SIM_BATCH_SIZE: 25,
    REAL_CAMPAIGN_DAYS: 30,
    REAL_HOURS_PER_DAY: 24,
    SIM_HOURS_PER_TASK_PER_EPOCH: 24,
    BETA: 0.8,
    SIM_EFFICIENCY: 0.10,
    TRANSFER_COEFF: 0.01,
    AUTONOMOUS_THRESHOLD: 0.005,     // 0.5% target for autonomous operation
    FLOOR_FAILURE: 0.000001          // 0.0001% learning floor
};

// Generate 25 logarithmically-distributed histogram buckets
function generateLogBuckets() {
    const buckets = [];
    const minExp = -5; // 0.001% (1e-5)
    const maxExp = 0;  // 100% (1e0)
    const numBuckets = 25;
    
    // Generate color gradient from red (bad) to green (good)
    function getColor(index, total) {
        const ratio = index / (total - 1);
        // Reverse the ratio so high failure rates (low index) are red
        const reversedRatio = 1 - ratio;
        const red = Math.round(255 * reversedRatio);
        const green = Math.round(255 * (1 - reversedRatio));
        const blue = Math.round(50 + 100 * (1 - reversedRatio));
        return `rgb(${red}, ${green}, ${blue})`;
    }
    
    for (let i = 0; i < numBuckets; i++) {
        const exp = minExp + (maxExp - minExp) * i / (numBuckets - 1);
        const threshold = Math.pow(10, exp);
        
        let label;
        if (threshold >= 0.1) {
            label = `${(threshold * 100).toFixed(0)}%`;
        } else if (threshold >= 0.01) {
            label = `${(threshold * 100).toFixed(1)}%`;
        } else if (threshold >= 0.001) {
            label = `${(threshold * 100).toFixed(2)}%`;
        } else {
            label = `${(threshold * 100).toFixed(3)}%`;
        }
        
        buckets.push({
            threshold: threshold,
            label: label,
            color: getColor(i, numBuckets)
        });
    }
    
    return buckets.reverse(); // Reverse so highest failure rates come first
}

const FAILURE_BUCKETS = generateLogBuckets();

// Task class
class Task {
    static difficultySigma = 3.0; // Default value, can be changed via sliders
    
    constructor(id) {
        this.id = id;
        this.failureRate = this.generateInitialFailure();
        this.isTraining = false;
        this.totalTrainingHours = 0;
    }
    
    generateInitialFailure() {
        const mu = Math.log(0.10);        // median 10%
        const sigma = Task.difficultySigma * 0.375;  // Scale factor to convert slider range to appropriate sigma
        
        const normal = this.boxMullerRandom();
        const logNormal = Math.exp(mu + sigma * normal);
                                return Math.min(1.0, Math.max(SIMULATION_CONFIG.FLOOR_FAILURE, logNormal));
    }
    
    // Box-Muller transform for normal random numbers
    boxMullerRandom() {
        let u = 0, v = 0;
        while(u === 0) u = Math.random(); // Converting [0,1) to (0,1)
        while(v === 0) v = Math.random();
        return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    }
}

// Campaign Manager class
class CampaignManager {
    constructor() {
        this.currentCampaign = 0;
        this.realTasks = [];        // Fixed for 30 days
        this.campaignStartEpoch = 0;
        this.selectNewRealTasks();
    }
    
    updateCampaign(epoch) {
        if ((epoch - this.campaignStartEpoch) >= SIMULATION_CONFIG.REAL_CAMPAIGN_DAYS) {
            this.currentCampaign++;
            this.campaignStartEpoch = epoch;
            this.selectNewRealTasks();
        }
    }
    
    selectNewRealTasks() {
        // Select 25 random tasks for real-world training
        this.realTasks = this.selectRandomTasks(SIMULATION_CONFIG.REAL_BATCH_SIZE);
    }
    
    selectRandomTasks(count, exclude = []) {
        const available = [];
        for (let i = 0; i < SIMULATION_CONFIG.N_TASKS; i++) {
            if (!exclude.includes(i)) {
                available.push(i);
            }
        }
        
        // Shuffle and take first 'count' items
        for (let i = available.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [available[i], available[j]] = [available[j], available[i]];
        }
        
        return available.slice(0, count);
    }
}

// Main Simulation class
class RobotTaskSimulation {
    constructor() {
        this.tasks = [];
        this.campaignManager = new CampaignManager();
        this.currentEpoch = 0;
        this.chart = null;
        this.isRunning = false;
        
        this.initializeTasks();
        this.initializeChart();
        this.createDynamicLegend();
        this.updateDisplay();
        this.setupParameterSliders();
        this.setupModal();
    }
    
    updateSimulationParameters(params) {
        // Update SIMULATION_CONFIG with new parameters
        if (params.beta !== undefined) SIMULATION_CONFIG.BETA = params.beta;
        if (params.simEfficiency !== undefined) SIMULATION_CONFIG.SIM_EFFICIENCY = params.simEfficiency;
        if (params.transferCoeff !== undefined) SIMULATION_CONFIG.TRANSFER_COEFF = params.transferCoeff;
        
        // If difficulty sigma changed, regenerate tasks
        if (params.difficultySigma !== undefined) {
            Task.difficultySigma = params.difficultySigma;
            this.reset(); // Regenerate everything with new parameters
        }
    }
    
    setupParameterSliders() {
        // Learning Rate (Beta) slider
        const learningRateSlider = document.getElementById('learning-rate-slider');
        const learningRateValue = document.getElementById('learning-rate-value');
        if (learningRateSlider && learningRateValue) {
            // Set initial value from slider
            const initialValue = parseFloat(learningRateSlider.value);
            learningRateValue.textContent = initialValue.toFixed(1);
            console.log('Learning rate slider initialized:', initialValue, 'Range:', learningRateSlider.min, 'to', learningRateSlider.max);
            
            learningRateSlider.addEventListener('input', (e) => {
                const value = parseFloat(e.target.value);
                learningRateValue.textContent = value.toFixed(1);
                console.log('Learning rate changed to:', value);
                this.updateSimulationParameters({ beta: value });
            });
        }
        
        // Simulation Efficiency slider
        const simEfficiencySlider = document.getElementById('sim-efficiency-slider');
        const simEfficiencyValue = document.getElementById('sim-efficiency-value');
        if (simEfficiencySlider && simEfficiencyValue) {
            const initialValue = parseFloat(simEfficiencySlider.value);
            simEfficiencyValue.textContent = initialValue.toFixed(2);
            
            simEfficiencySlider.addEventListener('input', (e) => {
                const value = parseFloat(e.target.value);
                simEfficiencyValue.textContent = value.toFixed(2);
                this.updateSimulationParameters({ simEfficiency: value });
            });
        }
        
        // Transfer Learning Rate slider
        const transferRateSlider = document.getElementById('transfer-rate-slider');
        const transferRateValue = document.getElementById('transfer-rate-value');
        if (transferRateSlider && transferRateValue) {
            const initialValue = parseFloat(transferRateSlider.value);
            transferRateValue.textContent = initialValue.toFixed(3);
            
            transferRateSlider.addEventListener('input', (e) => {
                const value = parseFloat(e.target.value);
                transferRateValue.textContent = value.toFixed(3);
                this.updateSimulationParameters({ transferCoeff: value });
            });
        }
        
        // Difficulty Sigma slider
        const difficultySigmaSlider = document.getElementById('difficulty-sigma-slider');
        const difficultySigmaValue = document.getElementById('difficulty-sigma-value');
        if (difficultySigmaSlider && difficultySigmaValue) {
            const initialValue = parseFloat(difficultySigmaSlider.value);
            difficultySigmaValue.textContent = initialValue.toFixed(1);
            
            difficultySigmaSlider.addEventListener('input', (e) => {
                const value = parseFloat(e.target.value);
                difficultySigmaValue.textContent = value.toFixed(1);
                this.updateSimulationParameters({ difficultySigma: value });
            });
        }
    }
    
    setupModal() {
        console.log('Setting up modal...');
        
        // Add a slight delay to ensure DOM is fully loaded
        setTimeout(() => {
            const modal = document.getElementById('assumptions-modal');
            const openBtn = document.getElementById('assumptions-btn');
            const closeBtn = document.getElementById('close-modal-btn');
            const closeFooterBtn = document.getElementById('close-modal-footer-btn');
            
            console.log('Modal elements found:', {
                modal: !!modal,
                openBtn: !!openBtn,
                closeBtn: !!closeBtn,
                closeFooterBtn: !!closeFooterBtn
            });
            
            if (openBtn) {
                console.log('Assumptions button found, adding click listener');
                openBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Assumptions button clicked!');
                    
                    // Create a simple custom modal that we can control
                    const customModal = document.createElement('div');
                    customModal.innerHTML = `
                        <div style="
                            position: fixed;
                            top: 0;
                            left: 0;
                            width: 100vw;
                            height: 100vh;
                            background: rgba(0,0,0,0.8);
                            z-index: 99999;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            font-family: Arial, sans-serif;
                        ">
                            <div style="
                                background: white;
                                padding: 30px;
                                border-radius: 10px;
                                max-width: 800px;
                                max-height: 80vh;
                                overflow-y: auto;
                                box-shadow: 0 10px 30px rgba(0,0,0,0.5);
                                position: relative;
                            ">
                                <button onclick="this.closest('div').parentElement.remove()" style="
                                    position: absolute;
                                    top: 10px;
                                    right: 15px;
                                    background: none;
                                    border: none;
                                    font-size: 24px;
                                    cursor: pointer;
                                    color: #666;
                                ">&times;</button>
                                <h2 style="color: #333; margin-top: 0; margin-bottom: 20px;">Simulation Key Assumptions</h2>
                                
                                <h3 style="color: #4A90E2; margin-top: 25px; margin-bottom: 10px;">Training Structure</h3>
                                <ul style="margin: 0; padding-left: 20px; line-height: 1.6; color: #555;">
                                    <li><strong>1,000 total tasks</strong> across 10-15 unit operations</li>
                                                                         <li><strong>Real-world training:</strong> 25 tasks per 30-day campaign</li>
                                    <li><strong>Simulation training:</strong> 25 different tasks per day</li>
                                    <li><strong>Transfer learning:</strong> Improvements spread to untrained tasks</li>
                                </ul>
                                
                                <h3 style="color: #4A90E2; margin-top: 25px; margin-bottom: 10px;">Learning Dynamics</h3>
                                <ul style="margin: 0; padding-left: 20px; line-height: 1.6; color: #555;">
                                    <li><strong>Power law learning:</strong> Improvement ∝ hours<sup>-α</sup></li>
                                    <li><strong>Initial failure rates:</strong> Log-normal distribution (~10% median)</li>
                                                                         <li><strong>Autonomous target:</strong> ≤0.5% failure rate (1 in 200 tasks)</li>
                                     <li><strong>Learning floor:</strong> Cannot improve below 0.0001%</li>
                                </ul>
                                
                                <h3 style="color: #4A90E2; margin-top: 25px; margin-bottom: 10px;">Training Efficiency</h3>
                                <ul style="margin: 0; padding-left: 20px; line-height: 1.6; color: #555;">
                                    <li><strong>Real-world:</strong> 24 training hours per task per day</li>
                                    <li><strong>Simulation:</strong> 10% efficiency vs real-world (adjustable)</li>
                                                                         <li><strong>Campaign cycles:</strong> New real-world tasks every 30 days</li>
                                    <li><strong>Transfer rate:</strong> 1-10% of direct improvements spread</li>
                                </ul>
                                
                                                                 <h3 style="color: #4A90E2; margin-top: 25px; margin-bottom: 10px;">Timeline & Scope</h3>
                                 <ul style="margin: 0; padding-left: 20px; line-height: 1.6; color: #555;">
                                     <li><strong>Total duration:</strong> 900 days (~30 real-world campaigns)</li>
                                     <li><strong>Success metric:</strong> All 1,000 tasks autonomous (≤0.5% failure)</li>
                                     <li><strong>Teleoperation backup:</strong> For tasks not yet autonomous</li>
                                 </ul>
                                 
                                 <h3 style="color: #4A90E2; margin-top: 25px; margin-bottom: 10px;">Key Formulas</h3>
                                 <div style="margin: 0; padding-left: 20px; line-height: 1.8; color: #555;">
                                     <p><strong>Power Law Learning:</strong><br/>
                                     <em>NewFailureRate = OldFailureRate × (1 + TotalHours)<sup>-β</sup></em><br/>
                                     Where β = learning rate parameter (0.5-2.0)</p>
                                     
                                     <p><strong>Training Hours per Day:</strong><br/>
                                     • Real-world tasks: 24 hours/day<br/>
                                     • Simulation tasks: 24 hours × efficiency (10%)</p>
                                     
                                     <p><strong>Transfer Learning:</strong><br/>
                                     <em>TransferImprovement = TotalDirectImprovement × TransferRate</em><br/>
                                     Applied to all non-training tasks</p>
                                     
                                     <p><strong>Campaign Cycling:</strong><br/>
                                     Every 30 days: Select new 25 tasks for real-world training<br/>
                                     Every day: Select new 25 tasks for simulation training</p>
                                 </div>
                                
                                <div style="text-align: center; margin-top: 25px;">
                                    <button onclick="this.closest('div').parentElement.remove()" style="
                                        background: #4A90E2;
                                        color: white;
                                        border: none;
                                        padding: 10px 20px;
                                        border-radius: 5px;
                                        cursor: pointer;
                                        font-size: 16px;
                                    ">Close</button>
                                </div>
                            </div>
                        </div>
                    `;
                    
                    document.body.appendChild(customModal);
                    
                    // Close on background click
                    customModal.addEventListener('click', function(e) {
                        if (e.target === customModal.firstElementChild) {
                            customModal.remove();
                        }
                    });
                });
                
            } else {
                console.error('Assumptions button not found!');
                console.log('All buttons found:', {
                    nextBtn: !!document.getElementById('next-epoch-btn'),
                    runBtn: !!document.getElementById('run-to-end-btn'),
                    resetBtn: !!document.getElementById('reset-btn'),
                    assumptionsBtn: !!document.getElementById('assumptions-btn')
                });
            }
            
                        // Setup close functionality
            if (closeBtn && modal) {
                closeBtn.addEventListener('click', () => {
                    modal.style.display = 'none';
                    modal.classList.remove('show');
                });
            }
            
            if (closeFooterBtn && modal) {
                closeFooterBtn.addEventListener('click', () => {
                    modal.style.display = 'none';
                    modal.classList.remove('show');
                });
            }
            
            // Close when clicking outside
            if (modal) {
                modal.addEventListener('click', (e) => {
                    if (e.target === modal) {
                        modal.style.display = 'none';
                        modal.classList.remove('show');
                    }
                });
            }
            
            // Add a manual test to the global scope for debugging
            window.testModal = function() {
                console.log('Manual modal test');
                const modal = document.getElementById('assumptions-modal');
                if (modal) {
                    modal.style.display = 'flex';
                    modal.classList.add('show');
                    console.log('Modal should be visible now');
                    console.log('Modal classes:', modal.className);
                    console.log('Modal computed style:', getComputedStyle(modal).display);
                } else {
                    console.error('Modal not found in manual test');
                }
            };
            
        }, 500); // 500ms delay to ensure everything is loaded
    }
    
    initializeTasks() {
        this.tasks = [];
        for (let i = 0; i < SIMULATION_CONFIG.N_TASKS; i++) {
            this.tasks.push(new Task(i));
        }
    }
    
    initializeChart() {
        const ctx = document.getElementById('simulationChart').getContext('2d');
        
        this.chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: FAILURE_BUCKETS.map(b => b.label),
                datasets: [{
                    label: 'Number of Tasks',
                    data: this.calculateHistogramData(),
                    backgroundColor: FAILURE_BUCKETS.map(b => b.color),
                    borderColor: FAILURE_BUCKETS.map(b => b.color),
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Task Failure Rate Distribution Over Time',
                        font: {
                            size: 16,
                            weight: 'bold'
                        }
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
                        },
                        ticks: {
                            maxRotation: 45,
                            minRotation: 45,
                            font: {
                                size: 10
                            },
                            callback: function(value, index, values) {
                                // Show every 3rd label to avoid overcrowding
                                return index % 3 === 0 ? this.getLabelForValue(value) : '';
                            }
                        }
                    }
                },
                animation: {
                    duration: 300
                }
            }
        });
    }
    
    createDynamicLegend() {
        const legendContainer = document.getElementById('dynamic-legend');
        if (!legendContainer) return;
        
        legendContainer.innerHTML = '';
        
        // Show every 5th bucket in the legend to avoid overcrowding
        const step = 5;
        for (let i = 0; i < FAILURE_BUCKETS.length; i += step) {
            const bucket = FAILURE_BUCKETS[i];
            
            const legendItem = document.createElement('div');
            legendItem.className = 'legend-item';
            
            const colorBox = document.createElement('div');
            colorBox.className = 'legend-color';
            colorBox.style.background = bucket.color;
            
            const textSpan = document.createElement('span');
            textSpan.className = 'legend-text';
            textSpan.textContent = bucket.label;
            
            legendItem.appendChild(colorBox);
            legendItem.appendChild(textSpan);
            legendContainer.appendChild(legendItem);
        }
        
        // Add GMP specification marker for the lowest bucket
        const gmpItem = document.createElement('div');
        gmpItem.className = 'legend-item';
        gmpItem.style.fontWeight = 'bold';
        
        const gmpColor = document.createElement('div');
        gmpColor.className = 'legend-color';
        gmpColor.style.background = FAILURE_BUCKETS[FAILURE_BUCKETS.length - 1].color;
        gmpColor.style.border = '2px solid #000';
        
        const gmpText = document.createElement('span');
        gmpText.className = 'legend-text';
        gmpText.textContent = 'GMP Spec';
        
        gmpItem.appendChild(gmpColor);
        gmpItem.appendChild(gmpText);
        legendContainer.appendChild(gmpItem);
    }
    
    calculateHistogramData() {
        const buckets = new Array(FAILURE_BUCKETS.length).fill(0);
        
        this.tasks.forEach(task => {
            for (let i = FAILURE_BUCKETS.length - 1; i >= 0; i--) {
                if (task.failureRate <= FAILURE_BUCKETS[i].threshold) {
                    buckets[i]++;
                    break;
                }
            }
        });
        
        return buckets;
    }
    
    updateTaskFailureRate(task, hours, isSimulation = false) {
        const coeff = isSimulation ? SIMULATION_CONFIG.SIM_EFFICIENCY : 1.0;
        const delta = coeff * Math.pow(hours, -SIMULATION_CONFIG.BETA);
        
        const improvement = delta * (task.failureRate - SIMULATION_CONFIG.FLOOR_FAILURE);
        task.failureRate = Math.max(SIMULATION_CONFIG.FLOOR_FAILURE, task.failureRate - improvement);
        task.totalTrainingHours += hours;
        
        return improvement;
    }
    
    applyTransferLearning(totalImprovement) {
        const transferAmount = SIMULATION_CONFIG.TRANSFER_COEFF * totalImprovement;
        this.tasks.forEach(task => {
            if (!task.isTraining) {
                const improvement = transferAmount * (task.failureRate - SIMULATION_CONFIG.FLOOR_FAILURE);
                task.failureRate = Math.max(SIMULATION_CONFIG.FLOOR_FAILURE, task.failureRate - improvement);
            }
        });
    }
    
    runEpoch() {
        if (this.currentEpoch >= SIMULATION_CONFIG.EPOCHS) {
            return false; // Simulation complete
        }
        
        // Update campaign if needed
        this.campaignManager.updateCampaign(this.currentEpoch);
        
        // Select simulation tasks (random each epoch)
        const simTasks = this.campaignManager.selectRandomTasks(
            SIMULATION_CONFIG.SIM_BATCH_SIZE, 
            this.campaignManager.realTasks
        );
        
        let totalImprovement = 0;
        
        // Reset training flags
        this.tasks.forEach(task => task.isTraining = false);
        
        // Train real-world tasks
        this.campaignManager.realTasks.forEach(taskId => {
            const improvement = this.updateTaskFailureRate(
                this.tasks[taskId], 
                SIMULATION_CONFIG.REAL_HOURS_PER_DAY, 
                false
            );
            totalImprovement += improvement;
            this.tasks[taskId].isTraining = true;
        });
        
        // Train simulation tasks
        simTasks.forEach(taskId => {
            const improvement = this.updateTaskFailureRate(
                this.tasks[taskId], 
                SIMULATION_CONFIG.SIM_HOURS_PER_TASK_PER_EPOCH, 
                true
            );
            totalImprovement += improvement;
            this.tasks[taskId].isTraining = true;
        });
        
        // Apply transfer learning to all other tasks
        this.applyTransferLearning(totalImprovement);
        
        this.currentEpoch++;
        return true;
    }
    
    calculateMeanFailureRate() {
        const sum = this.tasks.reduce((acc, task) => acc + task.failureRate, 0);
        return sum / this.tasks.length;
    }
    
    calculateTasksAtAutonomous() {
        return this.tasks.filter(task => task.failureRate <= SIMULATION_CONFIG.AUTONOMOUS_THRESHOLD).length;
    }
    
    updateDisplay() {
        // Update status display
        const meanFailure = this.calculateMeanFailureRate();
        const tasksAtAutonomous = this.calculateTasksAtAutonomous();
        const percentAutonomous = (tasksAtAutonomous / SIMULATION_CONFIG.N_TASKS * 100).toFixed(1);
        const progressPercent = (this.currentEpoch / SIMULATION_CONFIG.EPOCHS * 100).toFixed(1);
        
        document.getElementById('epoch-counter').textContent = `Day ${this.currentEpoch}`;
        document.getElementById('mean-failure').textContent = `${(meanFailure * 100).toFixed(3)}%`;
        document.getElementById('spec-compliance').textContent = `${tasksAtAutonomous} (${percentAutonomous}%)`;
        document.getElementById('progress-percent').textContent = `${progressPercent}%`;
        
        // Update progress bar
        document.getElementById('progress-bar').style.width = `${progressPercent}%`;
        
        // Update chart
        if (this.chart) {
            this.chart.data.datasets[0].data = this.calculateHistogramData();
            this.chart.update('none'); // No animation for smooth updates
        }
        
        // Update button states
        const isComplete = this.currentEpoch >= SIMULATION_CONFIG.EPOCHS;
        document.getElementById('next-epoch-btn').disabled = isComplete || this.isRunning;
        document.getElementById('run-to-end-btn').disabled = isComplete || this.isRunning;
    }
    
    nextEpoch() {
        if (this.runEpoch()) {
            this.updateDisplay();
        }
    }
    
    async runToEnd() {
        this.isRunning = true;
        this.updateDisplay();
        
        const batchSize = 10; // Process epochs in batches for responsiveness
        
        while (this.currentEpoch < SIMULATION_CONFIG.EPOCHS) {
            // Run a batch of epochs
            for (let i = 0; i < batchSize && this.currentEpoch < SIMULATION_CONFIG.EPOCHS; i++) {
                this.runEpoch();
            }
            
            this.updateDisplay();
            
            // Allow UI to update
            await new Promise(resolve => setTimeout(resolve, 10));
        }
        
        this.isRunning = false;
        this.updateDisplay();
    }
    
    reset() {
        this.currentEpoch = 0;
        this.campaignManager = new CampaignManager();
        this.isRunning = false;
        this.initializeTasks();
        this.updateDisplay();
    }
}

// Global simulation instance
let simulation;

// Initialize simulation when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing simulation...');
    
    // Wait for Chart.js to be available
    if (typeof Chart !== 'undefined') {
        console.log('Chart.js found, initializing...');
        initializeSimulation();
    } else {
        console.log('Chart.js not found, retrying...');
        // Retry after a short delay if Chart.js isn't loaded yet
        setTimeout(() => {
            if (typeof Chart !== 'undefined') {
                console.log('Chart.js found on retry, initializing...');
                initializeSimulation();
            } else {
                console.error('Chart.js still not available after retry');
            }
        }, 500);
    }
});

function initializeSimulation() {
    console.log('Initializing simulation...');
    
    // Check if required elements exist
    const canvas = document.getElementById('simulationChart');
    const nextBtn = document.getElementById('next-epoch-btn');
    const runBtn = document.getElementById('run-to-end-btn');
    const resetBtn = document.getElementById('reset-btn');
    
    console.log('Canvas found:', !!canvas);
    console.log('Next button found:', !!nextBtn);
    console.log('Run button found:', !!runBtn);
    console.log('Reset button found:', !!resetBtn);
    
    if (!canvas) {
        console.error('Canvas element not found!');
        return;
    }
    
    simulation = new RobotTaskSimulation();
    console.log('Simulation created successfully');
    
    // Add event listeners
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            console.log('Next epoch clicked');
            simulation.nextEpoch();
        });
    }
    
    if (runBtn) {
        runBtn.addEventListener('click', () => {
            console.log('Run to end clicked');
            simulation.runToEnd();
        });
    }
    
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            console.log('Reset clicked');
            simulation.reset();
        });
    }
    
    console.log('Event listeners added successfully');
}

// Export for potential external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { RobotTaskSimulation, SIMULATION_CONFIG, FAILURE_BUCKETS };
} 