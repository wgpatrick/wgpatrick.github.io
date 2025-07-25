document.addEventListener('DOMContentLoaded', () => {
    const marketGrowthCharts = document.querySelectorAll('#marketGrowthChart');
    
    // Set default font family for Chart.js
    Chart.defaults.font.family = '"Palatino Linotype", "Book Antiqua", Palatino, serif';
    
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
                borderColor: 'rgb(0, 1, 1)',
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
                        color: 'black',
                        text: 'Market Size (Billion USD)',
                        font: {
                            family: '"Palatino Linotype", "Book Antiqua", Palatino, serif',
                            size: 30
                        }
                    },
                    ticks: {
                        color: 'black',
                        font: {
                            family: '"Palatino Linotype", "Book Antiqua", Palatino, serif',
                            size: 30
                        }
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.2)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        color: 'black',
                        text: 'Year',
                        font: {
                            family: '"Palatino Linotype", "Book Antiqua", Palatino, serif',
                            size: 30
                        }
                    },
                    ticks: {
                        color: 'black',
                        font: {
                            family: '"Palatino Linotype", "Book Antiqua", Palatino, serif',
                            size: 30
                        }
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.2)'
                    }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: 'black',
                        font: {
                            family: '"Palatino Linotype", "Book Antiqua", Palatino, serif',
                            size: 30
                        }
                    }
                },
                tooltip: {
                    titleFont: {
                        family: '"Palatino Linotype", "Book Antiqua", Palatino, serif',
                        size: 30
                    },
                    bodyFont: {
                        family: '"Palatino Linotype", "Book Antiqua", Palatino, serif',
                        size: 30
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