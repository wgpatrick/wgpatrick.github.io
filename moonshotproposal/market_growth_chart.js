document.addEventListener('DOMContentLoaded', () => {
    const marketGrowthCharts = document.querySelectorAll('#marketGrowthChart');
    
    marketGrowthCharts.forEach((marketGrowthCtx, index) => {
        if (!marketGrowthCtx) return;
    const years = [];
    const marketSize = [];
    const startYear = 2025;
    const endYear = 2034;
    const startValue = 25.35; // Billions USD
    const cagr = 0.1545; // 15.45%

    for (let i = 0; i <= endYear - startYear; i++) {
        const year = startYear + i;
        years.push(year);
        const value = startValue * Math.pow(1 + cagr, i);
        marketSize.push(value.toFixed(2));
    }

    new Chart(marketGrowthCtx, {
        type: 'line',
        data: {
            labels: years,
            datasets: [{
                label: 'Global Biologics CDMO Market Size (in Billion USD)',
                data: marketSize,
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Market Size (Billion USD)'
                    },
                    ticks: {
                        color: '#fff'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.2)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Year'
                    },
                    ticks: {
                        color: '#fff'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.2)'
                    }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: '#fff'
                    }
                },
								datalabels: {
									display: false
								}
            }
        }
    });
    });
});