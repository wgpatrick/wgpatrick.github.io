document.addEventListener('DOMContentLoaded', () => {
    const ctx = document.getElementById('supplyChart');
    if (!ctx) return;
    
    // Set default font family for Chart.js
    Chart.defaults.font.family = '"Palatino Linotype", "Book Antiqua", Palatino, serif';
    
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
                    family: '"Palatino Linotype", "Book Antiqua", Palatino, serif',
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
                title: {
                    font: {
                        family: '"Palatino Linotype", "Book Antiqua", Palatino, serif'
                    }
                },
                ticks: {
                    color: 'black',
                    font: {
                        family: '"Palatino Linotype", "Book Antiqua", Palatino, serif'
                    }
                },
                grid: {
                    color: '#444'
                }
            },
            x: {
                title: {
                    font: {
                        family: '"Palatino Linotype", "Book Antiqua", Palatino, serif'
                    }
                },
                ticks: {
                    color: 'black',
                    font: {
                        family: '"Palatino Linotype", "Book Antiqua", Palatino, serif',
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