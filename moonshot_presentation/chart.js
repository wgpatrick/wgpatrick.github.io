document.addEventListener('DOMContentLoaded', () => {
    const ctx = document.getElementById('supplyChart');
    if (!ctx) return;
    
    // Register ChartDataLabels plugin if available
    if (typeof ChartDataLabels !== 'undefined') {
        Chart.register(ChartDataLabels);
    }
    
    new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['2025 Supply', 'Projected 2035 Supply\n(7% growth)'],
        datasets: [{
            data: [7500, 14754],
            backgroundColor: ['#42affa', '#0078d4'],
            borderColor: ['#42affa', '#0078d4'],
            borderWidth: 1
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            datalabels: {
                anchor: 'center',
                align: 'center',
                color: function(context) {
                    return context.dataIndex === 0 ? 'black' : 'white';
                },
                font: {
                    weight: 'bold',
                    size: 16
                },
                formatter: function(value, context) {
                    return value.toLocaleString() + ' kL';
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    color: 'white'
                },
                grid: {
                    color: '#444'
                }
            },
            x: {
                ticks: {
                    color: 'white',
                    font: {
                        size: 16
                    }
                },
                grid: {
                    display: false
                }
            }
        }
    }
    });
});