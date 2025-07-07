// Task Visualization JavaScript

document.addEventListener('DOMContentLoaded', () => {
    // Initialize the basic tasks slide
    initializeTasksSlide();
    
    // Initialize the combined task analysis slide
    initializeCombinedTaskSlide();
});

function initializeTasksSlide() {
    const operations = [
        { name: 'Media Prep', image: 'Media Prep MagneticMixer.png', tasks: 35 },
        { name: 'Seed Train', image: 'SU-n-1-seed_train_reactor.png', tasks: 58 },
        { name: 'N-1 Bioreactor', image: 'SU-n-1-seed_train_reactor.png', tasks: 85 },
        { name: 'Production Bioreactor', image: 'SU-Bioreactor.png', tasks: 95 },
        { name: 'Harvest/Clarify', image: 'SU-Depth-Filter.png', tasks: 42 },
        { name: 'Protein A Capture', image: 'SU-chrom.png', tasks: 73 },
        { name: 'Viral Inactivation', image: 'SU-ViralFilter.png', tasks: 38 },
        { name: 'CEX Column', image: 'SU-Chrome.png', tasks: 67 },
        { name: 'AEX Column', image: 'SU-chrom.png', tasks: 71 },
        { name: 'UF/DF', image: 'SU-TFF-Skid.png', tasks: 54 },
        { name: 'Formulation Tank', image: 'SU-mixing-for-downstream-apps.png', tasks: 46 },
        { name: 'Sterile Filter', image: 'SU-ViralFilter.png', tasks: 29 }
    ];

    const container = document.getElementById('tasks-container');
    if (!container) return;
    
    let delayCounter = 0;

    operations.forEach((operation, index) => {
        const row = document.createElement('div');
        row.className = 'unit-operation-row';

        const operationInfo = document.createElement('div');
        operationInfo.className = 'operation-info';

        const thumbnail = document.createElement('img');
        thumbnail.src = `assets/images/moonshotpresentation/equipment/${operation.image}`;
        thumbnail.alt = operation.name;
        thumbnail.className = 'operation-thumbnail';

        const name = document.createElement('span');
        name.className = 'operation-name';
        name.textContent = operation.name;

        operationInfo.appendChild(thumbnail);
        operationInfo.appendChild(name);

        const taskSquares = document.createElement('div');
        taskSquares.className = 'task-squares';

        for (let i = 0; i < operation.tasks; i++) {
            const square = document.createElement('div');
            square.className = 'task-square';
            square.style.setProperty('--delay', `${delayCounter * 0.01}s`);
            taskSquares.appendChild(square);
            delayCounter++;
        }

        row.appendChild(operationInfo);
        row.appendChild(taskSquares);
        container.appendChild(row);
    });
}

// Combined task analysis slide functionality
function initializeCombinedTaskSlide() {
    const combinedContainer = document.getElementById('combined-task-container');
    const showDifficultyBtn = document.getElementById('show-difficulty-btn');
    const showTypesBtn = document.getElementById('show-task-types-btn');
    const difficultyLegend = document.getElementById('difficulty-legend');
    const typesLegend = document.getElementById('task-types-legend');
    
    if (!combinedContainer) return;
    
    // Copy tasks from the basic tasks slide
    copyTasksFromBasicSlide(combinedContainer);
    
    // Store task type assignments globally for this slide
    let taskTypeAssignments = [];
    
    // Initialize task type assignments
    function initializeTaskTypeAssignments() {
        const taskTypes = [
            { name: 'Connecting fluid lines', shape: 'circle', color: '#4A90E2' },
            { name: 'Moving single-use bags', shape: 'triangle', color: '#7B68EE' },
            { name: 'Pressing buttons', shape: 'diamond', color: '#32CD32' },
            { name: 'Loading bags into equipment', shape: 'pentagon', color: '#FF6347' },
            { name: 'Moving skids', shape: 'hexagon', color: '#FFD700' },
            { name: 'Loading columns', shape: 'star', color: '#FF69B4' },
            { name: 'Sterile additions', shape: 'octagon', color: '#9370DB' },
            { name: 'Unique tasks', shape: 'cross', color: '#DC143C' }
        ];
        
        const allSquares = combinedContainer.querySelectorAll('.task-square');
        taskTypeAssignments = [];
        allSquares.forEach((square, index) => {
            const randomTaskType = taskTypes[Math.floor(Math.random() * taskTypes.length)];
            taskTypeAssignments[index] = randomTaskType;
        });
    }
    
    // Initialize assignments
    initializeTaskTypeAssignments();
    
    // Button event listeners
    if (showDifficultyBtn) {
        showDifficultyBtn.addEventListener('click', function() {
            resetTasksToBlue(combinedContainer);
            showTaskDifficulty(combinedContainer);
            if (difficultyLegend) difficultyLegend.style.display = 'block';
            if (typesLegend) typesLegend.style.display = 'none';
        });
    }
    
    if (showTypesBtn) {
        showTypesBtn.addEventListener('click', function() {
            resetTasksToBlue(combinedContainer);
            showTaskTypes(combinedContainer, taskTypeAssignments);
            if (difficultyLegend) difficultyLegend.style.display = 'none';
            if (typesLegend) typesLegend.style.display = 'block';
        });
    }
}

function copyTasksFromBasicSlide(targetContainer) {
    const basicTasksContainer = document.getElementById('tasks-container');
    if (basicTasksContainer && targetContainer) {
        targetContainer.innerHTML = basicTasksContainer.innerHTML;
        resetTasksToBlue(targetContainer);
    }
}

function resetTasksToBlue(container) {
    const allElements = container.querySelectorAll('.task-square, .task-shape');
    allElements.forEach(element => {
        element.className = 'task-square';
        element.style.background = '#4A90E2';
        element.style.borderBottomColor = '';
        element.style.borderTopColor = '';
        element.style.animationDelay = '0s';
        element.style.opacity = '1';
        element.style.transform = 'scale(1)';
    });
}

function initializeDifficultySlide() {
    const showDifficultyBtn = document.getElementById('show-difficulty-btn');
    const difficultyContainer = document.getElementById('difficulty-container');
    
    if (!showDifficultyBtn || !difficultyContainer) return;
    
    // Copy the structure from the previous slide
    function copyTasksFromPreviousSlide() {
        const previousTasksContainer = document.getElementById('tasks-container');
        if (previousTasksContainer) {
            difficultyContainer.innerHTML = previousTasksContainer.innerHTML;
            
            // Reset all squares to blue initially
            const allSquares = difficultyContainer.querySelectorAll('.task-square');
            allSquares.forEach(square => {
                square.style.background = '#4A90E2';
                square.style.animationDelay = '0s';
                square.style.opacity = '1';
                square.style.transform = 'scale(1)';
            });
        }
    }
    
    // Generate log-normal distribution for failure rates
    function generateLogNormalFailureRates(count) {
        const failureRates = [];
        
        for (let i = 0; i < count; i++) {
            // Generate log-normal distributed random number
            const u1 = Math.random();
            const u2 = Math.random();
            const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
            
            // Create log-normal distribution in log space
            // Target: log10(failure rate) from -4 to -0.5
            // Mean around -0.6 (10^-0.6 ≈ 25%), sigma = 0.8
            const logFailureRate = -2.5 + 0.8 * z0;
            
            // Convert back to failure rate and clamp
            const failureRate = Math.pow(10, logFailureRate);
            const clampedValue = Math.max(0.0001, Math.min(0.316, failureRate));
            failureRates.push(clampedValue);
        }
        
        return failureRates;
    }
    
    // Convert failure rate to color (blue to red gradient)
    function failureRateToColor(failureRate) {
        // Map failure rate to 0-1 scale using log transformation
        // 10^-4 = 0.0001 -> 0 (blue)
        // 10^-0.5 = 0.316 -> 1 (red)
        const logMin = Math.log10(0.0001); // -4
        const logMax = Math.log10(0.316);  // -0.5
        const logRate = Math.log10(failureRate);
        
        const normalizedValue = Math.max(0, Math.min(1, (logRate - logMin) / (logMax - logMin)));
        
        // Interpolate between blue (#4A90E2) and red (#FF0000)
        const blue = { r: 74, g: 144, b: 226 };
        const red = { r: 255, g: 0, b: 0 };
        
        const r = Math.round(blue.r + (red.r - blue.r) * normalizedValue);
        const g = Math.round(blue.g + (red.g - blue.g) * normalizedValue);
        const b = Math.round(blue.b + (red.b - blue.b) * normalizedValue);
        
        return `rgb(${r}, ${g}, ${b})`;
    }
    
    function showTaskDifficulty() {
        const operations = difficultyContainer.querySelectorAll('.unit-operation-row');
        
        operations.forEach((operation, opIndex) => {
            const squares = operation.querySelectorAll('.task-square');
            const failureRates = generateLogNormalFailureRates(squares.length);
            
            squares.forEach((square, index) => {
                setTimeout(() => {
                    const failureRate = failureRates[index];
                    const color = failureRateToColor(failureRate);
                    
                    square.style.background = color;
                    square.style.transform = 'scale(1.1)';
                    
                    // Store failure rate for potential tooltip/interaction
                    square.setAttribute('data-failure-rate', failureRate.toExponential(2));
                    
                    setTimeout(() => {
                        square.style.transform = 'scale(1)';
                    }, 150);
                    
                }, index * 8); // Fast animation
            });
        });
        
        showDifficultyBtn.textContent = 'Reset Colors';
        showDifficultyBtn.onclick = resetColors;
    }
    
    function resetColors() {
        const allSquares = difficultyContainer.querySelectorAll('.task-square');
        allSquares.forEach((square, index) => {
            setTimeout(() => {
                square.style.background = '#4A90E2';
                square.style.transform = 'scale(1.1)';
                
                setTimeout(() => {
                    square.style.transform = 'scale(1)';
                }, 150);
            }, index * 3);
        });
        
        showDifficultyBtn.textContent = 'Show Failure Rates';
        showDifficultyBtn.onclick = showTaskDifficulty;
    }
    
    // Initialize
    copyTasksFromPreviousSlide();
    showDifficultyBtn.onclick = showTaskDifficulty;
}

function initializeTaskTypesSlide() {
    const operations = [
        { name: 'Media Prep', image: 'Media Prep MagneticMixer.png', tasks: 35 },
        { name: 'Seed Train', image: 'SU-n-1-seed_train_reactor.png', tasks: 58 },
        { name: 'N-1 Bioreactor', image: 'SU-n-1-seed_train_reactor.png', tasks: 85 },
        { name: 'Production Bioreactor', image: 'SU-Bioreactor.png', tasks: 95 },
        { name: 'Harvest/Clarify', image: 'SU-Depth-Filter.png', tasks: 42 },
        { name: 'Protein A Capture', image: 'SU-chrom.png', tasks: 73 },
        { name: 'Viral Inactivation', image: 'SU-ViralFilter.png', tasks: 38 },
        { name: 'CEX Column', image: 'SU-Chrome.png', tasks: 67 },
        { name: 'AEX Column', image: 'SU-chrom.png', tasks: 71 },
        { name: 'UF/DF', image: 'SU-TFF-Skid.png', tasks: 54 },
        { name: 'Formulation Tank', image: 'SU-mixing-for-downstream-apps.png', tasks: 46 },
        { name: 'Sterile Filter', image: 'SU-ViralFilter.png', tasks: 29 }
    ];

    const taskTypes = [
        { name: 'Connecting fluid lines', shape: 'circle', color: '#4A90E2' },
        { name: 'Moving single-use bags', shape: 'triangle', color: '#7B68EE' },
        { name: 'Pressing buttons', shape: 'diamond', color: '#32CD32' },
        { name: 'Loading bags into equipment', shape: 'pentagon', color: '#FF6347' },
        { name: 'Moving skids', shape: 'hexagon', color: '#FFD700' },
        { name: 'Loading columns', shape: 'star', color: '#FF69B4' },
        { name: 'Sterile additions', shape: 'octagon', color: '#9370DB' },
        { name: 'Unique tasks', shape: 'cross', color: '#DC143C' }
    ];

    const container = document.getElementById('task-types-container');
    const showTypesBtn = document.getElementById('show-task-types-btn');
    if (!container || !showTypesBtn) return;
    
    let delayCounter = 0;
    let taskTypeAssignments = []; // Store the assignments for transformation

    // Copy tasks from the basic tasks slide first (start as squares)
    function copyTasksFromBasicSlide() {
        const basicTasksContainer = document.getElementById('tasks-container');
        if (basicTasksContainer) {
            container.innerHTML = basicTasksContainer.innerHTML;
            
            // Reset all squares to blue initially and prepare for transformation
            const allSquares = container.querySelectorAll('.task-square');
            allSquares.forEach((square, index) => {
                square.style.background = '#4A90E2';
                square.style.animationDelay = '0s';
                square.style.opacity = '1';
                square.style.transform = 'scale(1)';
                
                // Assign a random task type to each square
                const randomTaskType = taskTypes[Math.floor(Math.random() * taskTypes.length)];
                taskTypeAssignments[index] = randomTaskType;
            });
        }
    }

    function transformToTaskTypes() {
        const allSquares = container.querySelectorAll('.task-square');
        
        allSquares.forEach((square, index) => {
            setTimeout(() => {
                const taskType = taskTypeAssignments[index];
                if (!taskType) return;
                
                // Add the shape class
                square.className = `task-shape ${taskType.shape}`;
                
                // Set the color based on task type
                if (taskType.shape === 'triangle' || taskType.shape === 'pentagon' || taskType.shape === 'star') {
                    // For shapes that use border-color
                    square.style.borderBottomColor = taskType.color;
                    square.style.borderTopColor = taskType.color;
                } else {
                    // For shapes that use background-color
                    square.style.background = taskType.color;
                }
                
                // Add transformation animation
                square.style.transform = 'scale(1.2)';
                setTimeout(() => {
                    square.style.transform = 'scale(1)';
                }, 200);
                
            }, index * 5); // Fast sequential transformation
        });
        
        showTypesBtn.textContent = 'Reset to Squares';
        showTypesBtn.onclick = resetToSquares;
    }
    
    function resetToSquares() {
        const allShapes = container.querySelectorAll('.task-shape');
        
        allShapes.forEach((shape, index) => {
            setTimeout(() => {
                // Reset to square class and blue color
                shape.className = 'task-square';
                shape.style.background = '#4A90E2';
                shape.style.borderBottomColor = '';
                shape.style.borderTopColor = '';
                
                // Add transformation animation
                shape.style.transform = 'scale(1.2)';
                setTimeout(() => {
                    shape.style.transform = 'scale(1)';
                }, 200);
                
            }, index * 3); // Fast sequential reset
        });
        
        showTypesBtn.textContent = 'Show Task Types';
        showTypesBtn.onclick = transformToTaskTypes;
    }
    
    // Initialize
    copyTasksFromBasicSlide();
    showTypesBtn.onclick = transformToTaskTypes;
}

// Standalone functions for combined slide
function showTaskDifficulty(container) {
    const operations = container.querySelectorAll('.unit-operation-row');
    
    operations.forEach((operation, opIndex) => {
        const squares = operation.querySelectorAll('.task-square');
        const failureRates = generateLogNormalFailureRates(squares.length);
        
        squares.forEach((square, index) => {
            setTimeout(() => {
                const failureRate = failureRates[index];
                const color = failureRateToColor(failureRate);
                
                square.style.background = color;
                square.style.transform = 'scale(1.1)';
                
                // Store failure rate for potential tooltip/interaction
                square.setAttribute('data-failure-rate', failureRate.toExponential(2));
                
                setTimeout(() => {
                    square.style.transform = 'scale(1)';
                }, 150);
                
            }, index * 8); // Fast animation
        });
    });
}

function showTaskTypes(container, taskTypeAssignments) {
    const allSquares = container.querySelectorAll('.task-square');
    
    allSquares.forEach((square, index) => {
        setTimeout(() => {
            const taskType = taskTypeAssignments[index];
            if (!taskType) return;
            
            // Add the shape class
            square.className = `task-shape ${taskType.shape}`;
            
            // Set the color based on task type
            if (taskType.shape === 'triangle' || taskType.shape === 'pentagon' || taskType.shape === 'star') {
                // For shapes that use border-color
                square.style.borderBottomColor = taskType.color;
                square.style.borderTopColor = taskType.color;
            } else {
                // For shapes that use background-color
                square.style.background = taskType.color;
            }
            
            // Add transformation animation
            square.style.transform = 'scale(1.2)';
            setTimeout(() => {
                square.style.transform = 'scale(1)';
            }, 200);
            
        }, index * 5); // Fast sequential transformation
    });
}

// Utility functions for difficulty calculation
function generateLogNormalFailureRates(count) {
    const failureRates = [];
    
    for (let i = 0; i < count; i++) {
        // Generate log-normal distributed random number
        const u1 = Math.random();
        const u2 = Math.random();
        const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
        
        // Create log-normal distribution in log space
        // Target: log10(failure rate) from -4 to -0.5
        // Mean around -0.6 (10^-0.6 ≈ 25%), sigma = 0.8
        const logFailureRate = -2.5 + 0.8 * z0;
        
        // Convert back to failure rate and clamp
        const failureRate = Math.pow(10, logFailureRate);
        const clampedValue = Math.max(0.0001, Math.min(0.316, failureRate));
        failureRates.push(clampedValue);
    }
    
    return failureRates;
}

// Convert failure rate to color (blue to red gradient)
function failureRateToColor(failureRate) {
    // Map failure rate to 0-1 scale using log transformation
    // 10^-4 = 0.0001 -> 0 (blue)
    // 10^-0.5 = 0.316 -> 1 (red)
    const logMin = Math.log10(0.0001); // -4
    const logMax = Math.log10(0.316);  // -0.5
    const logRate = Math.log10(failureRate);
    
    const normalizedValue = Math.max(0, Math.min(1, (logRate - logMin) / (logMax - logMin)));
    
    // Interpolate between blue (#4A90E2) and red (#FF0000)
    const blue = { r: 74, g: 144, b: 226 };
    const red = { r: 255, g: 0, b: 0 };
    
    const r = Math.round(blue.r + (red.r - blue.r) * normalizedValue);
    const g = Math.round(blue.g + (red.g - blue.g) * normalizedValue);
    const b = Math.round(blue.b + (red.b - blue.b) * normalizedValue);
    
    return `rgb(${r}, ${g}, ${b})`;
} 