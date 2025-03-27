// Debugging
console.log("Financial model script loaded");
window.addEventListener('DOMContentLoaded', (event) => {
    console.log("DOM fully loaded and parsed");
    console.log("Checking for financial-grid:", document.getElementById('financial-grid'));
    console.log("Checking for cashChart:", document.getElementById('cashChart'));
});

// Configuration
const monthsInYear = 12;
const year = 2025;
const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const annualTotalId = 'FY25';

// Line item definitions (will be rows)
const lineItems = [
    { id: 'productRevenue', name: 'Product Revenue', category: 'revenue', editable: true },
    { id: 'partnerRevenue', name: 'Partner Revenue', category: 'revenue', editable: true },
    { id: 'totalRevenue', name: 'Total Revenue', category: 'revenue', editable: false, isCalculated: true },
    
    { id: 'directLabor', name: 'Direct Labor', category: 'costOfSales', editable: true },
    { id: 'directMaterial', name: 'Direct Material', category: 'costOfSales', editable: true },
    { id: 'allocatedOverhead', name: 'Allocated Overhead', category: 'costOfSales', editable: true },
    { id: 'totalCostOfSales', name: 'Total Cost of Sales', category: 'costOfSales', editable: false, isCalculated: true },
    
    { id: 'grossProfit', name: 'Gross Profit', category: 'profit', editable: false, isCalculated: true },
    { id: 'grossMarginPercent', name: 'Gross Margin %', category: 'profit', editable: false, isCalculated: true, isPercentage: true },
    
    { id: 'salesMarketing', name: 'Sales & Marketing', category: 'opex', editable: true },
    { id: 'gAndA', name: 'G & A', category: 'opex', editable: true },
    { id: 'rAndD', name: 'R & D', category: 'opex', editable: true },
    { id: 'totalOpEx', name: 'Total OpEx', category: 'opex', editable: false, isCalculated: true },
    
    { id: 'operatingIncome', name: 'Operating Income', category: 'income', editable: false, isCalculated: true },
    
    { id: 'otherIncomeExpense', name: 'Other (Income)/Expense', category: 'income', editable: true },
    { id: 'netIncome', name: 'Net Income', category: 'income', editable: false, isCalculated: true },
    
    { id: 'beginningCash', name: 'Beginning Cash', category: 'cash', editable: false, isCalculated: true },
    { id: 'endingCash', name: 'Ending Cash', category: 'cash', editable: false, isCalculated: true },
    { id: 'cashBurn', name: 'Monthly Burn', category: 'cash', editable: false, isCalculated: true }
];

// Sensitivity analysis defaults
let sensitivityFactors = {
    productRevenue: 1.0,  // 100%
    partnerRevenue: 1.0   // 100%
};

// Model data structure
let modelData = {
    initialCash: 5000, // Synthetic initial cash
    lineItemsById: {},      // Quick lookup
    monthlyValues: {},      // Will store values by month
    baseValues: {},         // Original values before sensitivity adjustments
    annualTotals: {}        // Annual totals
};

// Chart.js instance
let cashChart = null;
// ag-Grid instance
let gridApi = null;

// Debug function
function debug(message, obj = null) {
    console.log(`DEBUG: ${message}`);
    if (obj) {
        console.log(obj);
    }
}

// Initialize the model data
function initializeModelData() {
    debug("Initializing model data");
    
    // Initial monthly data for all 12 months
    const initialMonthlyData = {
        Jan: {
            productRevenue: 350,
            partnerRevenue: 150,
            directLabor: 250,
            directMaterial: 150,
            allocatedOverhead: 100,
            salesMarketing: 200,
            gAndA: 180,
            rAndD: 250,
            otherIncomeExpense: -20
        },
        Feb: {
            productRevenue: 380,
            partnerRevenue: 160,
            directLabor: 260,
            directMaterial: 160,
            allocatedOverhead: 105,
            salesMarketing: 205,
            gAndA: 185,
            rAndD: 255,
            otherIncomeExpense: -22
        },
        Mar: {
            productRevenue: 420,
            partnerRevenue: 170,
            directLabor: 270,
            directMaterial: 170,
            allocatedOverhead: 110,
            salesMarketing: 210,
            gAndA: 190,
            rAndD: 260,
            otherIncomeExpense: -25
        },
        Apr: {
            productRevenue: 450,
            partnerRevenue: 180,
            directLabor: 280,
            directMaterial: 180,
            allocatedOverhead: 115,
            salesMarketing: 215,
            gAndA: 195,
            rAndD: 265,
            otherIncomeExpense: -27
        },
        May: {
            productRevenue: 480,
            partnerRevenue: 190,
            directLabor: 290,
            directMaterial: 190,
            allocatedOverhead: 120,
            salesMarketing: 220,
            gAndA: 200,
            rAndD: 270,
            otherIncomeExpense: -30
        },
        Jun: {
            productRevenue: 510,
            partnerRevenue: 200,
            directLabor: 300,
            directMaterial: 200,
            allocatedOverhead: 125,
            salesMarketing: 225,
            gAndA: 205,
            rAndD: 275,
            otherIncomeExpense: -32
        },
        Jul: {
            productRevenue: 540,
            partnerRevenue: 210,
            directLabor: 310,
            directMaterial: 210,
            allocatedOverhead: 130,
            salesMarketing: 230,
            gAndA: 210,
            rAndD: 280,
            otherIncomeExpense: -35
        },
        Aug: {
            productRevenue: 570,
            partnerRevenue: 220,
            directLabor: 320,
            directMaterial: 220,
            allocatedOverhead: 135,
            salesMarketing: 235,
            gAndA: 215,
            rAndD: 285,
            otherIncomeExpense: -37
        },
        Sep: {
            productRevenue: 600,
            partnerRevenue: 230,
            directLabor: 330,
            directMaterial: 230,
            allocatedOverhead: 140,
            salesMarketing: 240,
            gAndA: 220,
            rAndD: 290,
            otherIncomeExpense: -40
        },
        Oct: {
            productRevenue: 630,
            partnerRevenue: 240,
            directLabor: 340,
            directMaterial: 240,
            allocatedOverhead: 145,
            salesMarketing: 245,
            gAndA: 225,
            rAndD: 295,
            otherIncomeExpense: -42
        },
        Nov: {
            productRevenue: 660,
            partnerRevenue: 250,
            directLabor: 350,
            directMaterial: 250,
            allocatedOverhead: 150,
            salesMarketing: 250,
            gAndA: 230,
            rAndD: 300,
            otherIncomeExpense: -45
        },
        Dec: {
            productRevenue: 690,
            partnerRevenue: 260,
            directLabor: 360,
            directMaterial: 260,
            allocatedOverhead: 155,
            salesMarketing: 255,
            gAndA: 235,
            rAndD: 305,
            otherIncomeExpense: -47
        }
    };
    
    // Initialize line items and monthly values
    modelData.lineItemsById = {};
    modelData.monthlyValues = {};
    modelData.baseValues = {};
    modelData.annualTotals = {};
    
    // Set up months
    monthNames.forEach(month => {
        modelData.monthlyValues[month] = {};
        modelData.baseValues[month] = {};
    });
    
    // Set up line items by ID for quick lookups
    lineItems.forEach(item => {
        modelData.lineItemsById[item.id] = { ...item };
        
        if (!item.isCalculated) {
            // Fill in values for each month
            for (let i = 0; i < monthsInYear; i++) {
                const month = monthNames[i];
                
                if (initialMonthlyData[month][item.id] !== undefined) {
                    const value = initialMonthlyData[month][item.id];
                    modelData.monthlyValues[month][item.id] = value;
                    modelData.baseValues[month][item.id] = value; // Store base values
                } else {
                    modelData.monthlyValues[month][item.id] = 0;
                    modelData.baseValues[month][item.id] = 0;
                }
            }
        }
    });
    
    debug("Model data initialized with synthetic data");
}

// Apply sensitivity factors to revenue items
function applySensitivityFactors() {
    // Only apply to revenue items that are editable by the user
    const revenueItems = ['productRevenue', 'partnerRevenue'];
    
    // Apply sensitivity factors to each revenue item
    revenueItems.forEach(itemId => {
        const factor = sensitivityFactors[itemId];
        
        // Apply to each month
        monthNames.forEach((month, index) => {
            // Apply to all months (Q1-Q4)
            const baseValue = modelData.baseValues[month][itemId] || 0;
            modelData.monthlyValues[month][itemId] = Math.round(baseValue * factor);
        });
    });
    
    debug("Applied sensitivity factors to all quarters:", sensitivityFactors);
}

// Recalculate all derived values
function recalculateModel() {
    debug("Recalculating model");
    
    // Apply sensitivity adjustments first
    applySensitivityFactors();
    
    let previousEndingCash = modelData.initialCash;
    
    // Reset annual totals
    modelData.annualTotals = {};
    lineItems.forEach(item => {
        modelData.annualTotals[item.id] = 0;
    });
    
    // Calculate values for each month
    monthNames.forEach((month, monthIndex) => {
        const monthData = modelData.monthlyValues[month];
        
        // Revenue calculations
        monthData.totalRevenue = 
            (monthData.productRevenue || 0) + 
            (monthData.partnerRevenue || 0);
        
        // Cost of sales calculations
        monthData.totalCostOfSales = 
            (monthData.directLabor || 0) + 
            (monthData.directMaterial || 0) + 
            (monthData.allocatedOverhead || 0);
        
        // Profit calculations
        monthData.grossProfit = monthData.totalRevenue - monthData.totalCostOfSales;
        monthData.grossMarginPercent = monthData.totalRevenue === 0 ? 0 : 
            (monthData.grossProfit / monthData.totalRevenue) * 100;
        
        // Operating expense calculations
        monthData.totalOpEx = 
            (monthData.salesMarketing || 0) + 
            (monthData.gAndA || 0) + 
            (monthData.rAndD || 0);
        
        // Income calculations
        monthData.operatingIncome = monthData.grossProfit - monthData.totalOpEx;
        
        // Net income with other income/expense
        monthData.netIncome = monthData.operatingIncome - (monthData.otherIncomeExpense || 0);
        
        // Cash calculations
        monthData.beginningCash = previousEndingCash;
        monthData.endingCash = monthData.beginningCash + monthData.netIncome;
        
        // Cash burn
        monthData.cashBurn = monthData.endingCash - monthData.beginningCash;
        
        // Update for next month
        previousEndingCash = monthData.endingCash;
        
        // Add to annual totals
        for (const [itemId, value] of Object.entries(monthData)) {
            if (typeof value === 'number') {
                modelData.annualTotals[itemId] = (modelData.annualTotals[itemId] || 0) + value;
            }
        }
    });
    
    // Adjust annual total for beginning cash (should be first month only)
    if (monthNames.length > 0) {
        const firstMonth = monthNames[0];
        modelData.annualTotals.beginningCash = modelData.monthlyValues[firstMonth].beginningCash;
    }
    
    // Adjust annual total for ending cash (should be last month only)
    if (monthNames.length > 0) {
        const lastMonth = monthNames[monthNames.length - 1];
        modelData.annualTotals.endingCash = modelData.monthlyValues[lastMonth].endingCash;
    }
    
    // Calculate annual gross margin percentage
    if (modelData.annualTotals.totalRevenue > 0) {
        modelData.annualTotals.grossMarginPercent = 
            (modelData.annualTotals.grossProfit / modelData.annualTotals.totalRevenue) * 100;
    } else {
        modelData.annualTotals.grossMarginPercent = 0;
    }
    
    // If grid exists, update it
    if (gridApi) {
        debug("Updating grid with recalculated data");
        const rowData = getGridData();
        gridApi.setRowData(rowData);
    }
}

// Transform model data into a format for ag-Grid (line items as rows, months as columns)
function getGridData() {
    const rowData = [];
    
    // Add each line item as a row
    lineItems.forEach(item => {
        const row = {
            lineItemId: item.id,
            lineItem: item.name,
            category: item.category,
            editable: item.editable,
            isPercentage: !!item.isPercentage
        };
        
        // Add each month's value to the row
        monthNames.forEach(month => {
            const monthData = modelData.monthlyValues[month];
            row[month] = monthData[item.id] !== undefined ? monthData[item.id] : 0;
        });
        
        // Add annual total
        row[annualTotalId] = modelData.annualTotals[item.id] || 0;
        
        rowData.push(row);
    });
    
    return rowData;
}

// Value formatter for financial values
function currencyFormatter(params) {
    if (params.value === undefined) return '';
    
    // Check if the cell should be formatted as a percentage
    if (params.data.isPercentage) {
        return (params.value / 100).toLocaleString('en-US', {
            style: 'percent',
            minimumFractionDigits: 1,
            maximumFractionDigits: 1
        });
    }
    
    // Regular currency formatting
    return params.value.toLocaleString('en-US', {
        style: 'decimal',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    });
}

// Cell class rules for styling
function getCellClassRules() {
    return {
        'calculated-cell': function(params) {
            if (params.colDef.field === 'lineItem') return false;
            return !params.data.editable;
        },
        'editable-cell': function(params) {
            if (params.colDef.field === 'lineItem') return false;
            return params.data.editable;
        },
        'percentage-cell': function(params) {
            return params.data.isPercentage;
        },
        'negative-value': function(params) {
            if (params.colDef.field === 'lineItem') return false;
            return params.value < 0;
        },
        'positive-value': function(params) {
            if (params.colDef.field === 'lineItem') return false;
            const isImportantMetric = ['profit', 'income', 'cash'].includes(params.data.category);
            return params.value > 0 && isImportantMetric;
        },
        'annual-total-cell': function(params) {
            return params.colDef.field === annualTotalId;
        }
    };
}

// Custom cell editor for numeric values
class NumericCellEditor {
    // Gets called once before the renderer is used
    init(params) {
        // Create the cell
        this.input = document.createElement('input');
        this.input.type = 'number';
        this.input.step = '100';
        this.input.className = 'ag-input-field-input ag-text-field-input';
        this.input.value = params.value;
        
        // Focus the input
        this.input.focus();
        this.input.select();
    }
    
    // Gets called once when grid ready to insert the element
    getGui() {
        return this.input;
    }
    
    // Returns the new value after editing
    getValue() {
        return this.input.value === '' ? 0 : Number(this.input.value);
    }
    
    // Gets called once when the editing is finished
    destroy() {
        // No cleanup needed
    }
    
    // Gets called when focus should be placed on the editor
    focusIn() {
        this.input.focus();
        this.input.select();
    }
}

// Initialize the ag-Grid spreadsheet
function initializeGrid() {
    debug("Initializing ag-Grid");
    const gridOptions = {
        columnDefs: getColumnDefs(),
        rowData: getGridData(),
        defaultColDef: {
            sortable: true,
            resizable: true,
            minWidth: 100,
            cellClassRules: getCellClassRules()
        },
        getRowClass: function(params) {
            return params.data.category + '-row';
        },
        onCellValueChanged: function(params) {
            if (params.colDef.field !== 'lineItem' && params.data.editable) {
                debug(`Cell value changed: ${params.data.lineItemId}, ${params.colDef.field}, ${params.newValue}`);
                
                // Update the model
                const lineItemId = params.data.lineItemId;
                const month = params.colDef.field;
                
                if (monthNames.includes(month)) {
                    // Ensure the value is a number
                    const value = typeof params.newValue === 'number' ? params.newValue : 
                                 (parseFloat(params.newValue) || 0);
                                 
                    // Update both base values and current values
                    modelData.baseValues[month][lineItemId] = value;
                    modelData.monthlyValues[month][lineItemId] = value;
                    
                    // Apply sensitivity factor if needed
                    if (['productRevenue', 'partnerRevenue'].includes(lineItemId)) {
                        modelData.monthlyValues[month][lineItemId] = Math.round(value * sensitivityFactors[lineItemId]);
                    }
                    
                    // Recalculate and update the grid
                    recalculateModel();
                    renderCashChart();
                }
            }
        },
        onGridReady: function(params) {
            gridApi = params.api;
            params.api.sizeColumnsToFit();
        }
    };
    
    // Create the grid
    const gridDiv = document.getElementById('financial-grid');
    if (!gridDiv) {
        debug("ERROR: Grid container not found!");
        return;
    }
    
    new agGrid.Grid(gridDiv, gridOptions);
}

// Get column definitions for ag-Grid
function getColumnDefs() {
    const columns = [
        { 
            field: 'lineItem', 
            headerName: 'Line Items', 
            width: 200, 
            pinned: 'left',
            editable: false,
            cellClass: 'header-cell'
        }
    ];
    
    // Add month columns
    monthNames.forEach(month => {
        columns.push({
            field: month,
            headerName: month,
            width: 110,
            editable: function(params) {
                return params.data.editable;
            },
            valueFormatter: currencyFormatter,
            cellEditor: NumericCellEditor,
            cellEditorParams: {
                useFormatter: false
            }
        });
    });
    
    // Add annual total column
    columns.push({
        field: annualTotalId,
        headerName: 'FY 2025',
        width: 130,
        editable: false,
        valueFormatter: currencyFormatter,
        cellClass: 'annual-total-cell'
    });
    
    return columns;
}

// Render the cash chart
function renderCashChart() {
    debug("Rendering cash chart");
    const ctx = document.getElementById('cashChart').getContext('2d');
    
    if (!ctx) {
        debug("ERROR: Cash chart canvas context not found!");
        return;
    }
    
    // If chart already exists, destroy it properly
    if (cashChart) {
        debug("Destroying existing chart");
        cashChart.destroy();
    }
    
    // Prepare data for chart
    const labels = monthNames;
    const cashData = monthNames.map(month => 
        modelData.monthlyValues[month].endingCash || 0
    );
    
    // Add gross margin data
    const marginData = monthNames.map(month => 
        modelData.monthlyValues[month].grossMarginPercent || 0
    );
    
    // Calculate min and max for margin to determine appropriate y-axis range
    const marginMin = Math.min(...marginData);
    const marginMax = Math.max(...marginData);
    // Add some padding to the min/max range for better visualization
    const marginRange = {
        min: marginMin < 0 ? Math.floor(marginMin * 1.1) : 0, // If negative, add 10% padding, otherwise start at 0
        max: Math.ceil(marginMax * 1.1)  // Add 10% padding to max
    };
    
    debug("Creating new chart with data", { labels, cashData, marginData, marginRange });
    
    // Create new chart
    try {
        cashChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Cash on Hand',
                        data: cashData,
                        borderColor: 'rgb(75, 192, 192)',
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        tension: 0.1,
                        fill: true,
                        yAxisID: 'y'
                    },
                    {
                        label: 'Gross Margin %',
                        data: marginData,
                        borderColor: 'rgb(255, 99, 132)',
                        backgroundColor: 'rgba(255, 99, 132, 0.0)',
                        borderWidth: 2,
                        borderDash: [5, 5],
                        pointRadius: 4,
                        tension: 0.1,
                        fill: false,
                        yAxisID: 'y1'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    mode: 'index',
                    intersect: false
                },
                scales: {
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        title: {
                            display: true,
                            text: 'Cash ($)'
                        }
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        title: {
                            display: true,
                            text: 'Margin (%)'
                        },
                        min: marginRange.min,
                        max: marginRange.max,
                        // Grid lines for the secondary y-axis
                        grid: {
                            drawOnChartArea: false
                        }
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                if (context.dataset.label === 'Cash on Hand') {
                                    return `Cash: $${Math.round(context.raw).toLocaleString()}`;
                                } else if (context.dataset.label === 'Gross Margin %') {
                                    return `Margin: ${context.raw.toFixed(1)}%`;
                                }
                                return context.dataset.label;
                            }
                        }
                    },
                    legend: {
                        position: 'top',
                        labels: {
                            padding: 20
                        }
                    }
                }
            }
        });
        debug("Chart created successfully");
    } catch (error) {
        debug("ERROR creating chart:", error);
    }
}

// Update sensitivity display value
function updateSensitivityDisplay(sliderId, valueId) {
    const slider = document.getElementById(sliderId);
    const display = document.getElementById(valueId);
    if (slider && display) {
        display.textContent = slider.value + '%';
    }
}

// Handle sensitivity slider changes
function handleSensitivityChange(sliderId, valueId, revenueType) {
    const slider = document.getElementById(sliderId);
    if (!slider) return;
    
    slider.addEventListener('input', function() {
        // Update display value
        updateSensitivityDisplay(sliderId, valueId);
        
        // Update sensitivity factor (convert percentage to decimal)
        sensitivityFactors[revenueType] = parseFloat(slider.value) / 100;
        
        // Recalculate model with new sensitivity
        recalculateModel();
        renderCashChart();
    });
}

// Window resize handling
window.addEventListener('resize', function() {
    debug("Window resize detected");
    if (gridApi) {
        gridApi.sizeColumnsToFit();
    }
});

// Event handlers
document.addEventListener('DOMContentLoaded', function() {
    debug("DOM loaded, starting application initialization");
    
    // Check for grid container
    const gridContainer = document.getElementById('financial-grid');
    if (!gridContainer) {
        debug("ERROR: Grid container not found in DOM");
    } else {
        debug("Grid container found in DOM");
    }
    
    // Check for chart container
    const chartContainer = document.getElementById('cashChart');
    if (!chartContainer) {
        debug("ERROR: Chart container not found in DOM");
    } else {
        debug("Chart container found in DOM");
    }
    
    // Set up initial cash input handler
    document.getElementById('initial-cash').addEventListener('change', function(e) {
        debug("Initial cash changed to", e.target.value);
        modelData.initialCash = parseInt(e.target.value) || 0;
        recalculateModel();
        renderCashChart();
    });
    
    // Set up recalculate button handler
    document.getElementById('recalculate-btn').addEventListener('click', function() {
        debug("Recalculate button clicked");
        recalculateModel();
        renderCashChart();
    });
    
    // Set up sensitivity sliders
    handleSensitivityChange('product-revenue-slider', 'product-revenue-value', 'productRevenue');
    handleSensitivityChange('partner-revenue-slider', 'partner-revenue-value', 'partnerRevenue');
    
    // Initialize the model
    debug("Starting model initialization");
    initializeModelData();
    recalculateModel();
    initializeGrid();
    renderCashChart();
    
    debug("Application initialization complete");
}); 