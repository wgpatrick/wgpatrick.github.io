document.addEventListener('DOMContentLoaded', () => {

    const laborSlider = document.getElementById('labor_reduction_pct');
    const capitalSlider = document.getElementById('capital_reduction_pct');
    const locationToggle = document.getElementById('lower_cost_location');
    const contaminationToggle = document.getElementById('eliminate_contamination');

    const laborValue = document.getElementById('labor_value');
    const capitalValue = document.getElementById('capital_value');

    const ctx = document.getElementById('cogsChart');
    if (!ctx) return;

    // Set default font family for Chart.js
    Chart.defaults.font.family = '"Palatino Linotype", "Book Antiqua", Palatino, serif';

    const baselineCosts = {
        raw_mat: 10.8,
        labor: 9.0,
        qa_qc: 4.2,
        utilities: 1.8,
        fac_dep: 15.4,
        equip_dep: 12.0,
        fac_mro: 6.8,
    };
    
    // 2.5% lost batch rate increases cost by 1/(1-0.025) = ~2.56%
    const lostBatchCost = (Object.values(baselineCosts).reduce((a, b) => a + b, 0)) * (1 / (1 - 0.025) - 1);

    const baselineData = { ...baselineCosts, lost_batch: lostBatchCost };

    const chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Baseline', 'Scenario'],
            datasets: [
                { label: 'Facility Depreciation', data: [baselineData.fac_dep, 0], backgroundColor: '#F58518' },
                { label: 'Equipment Depreciation', data: [baselineData.equip_dep, 0], backgroundColor: '#FFA94D' },
                { label: 'Facility MRO', data: [baselineData.fac_mro, 0], backgroundColor: '#FDCFB6' },
                { label: 'Raw Materials', data: [baselineData.raw_mat, 0], backgroundColor: '#72B7B2' },
                { label: 'Labor', data: [baselineData.labor, 0], backgroundColor: '#4C78A8' },
                { label: 'QA/QC', data: [baselineData.qa_qc, 0], backgroundColor: '#9A6FB0' },
                { label: 'Utilities', data: [baselineData.utilities, 0], backgroundColor: '#E45756' },
                { label: 'Lost Batches', data: [baselineData.lost_batch, 0], backgroundColor: '#d94696' },
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: { 
                    stacked: true, 
                    ticks: { 
                        color: 'black',
                        font: {
                            family: '"Palatino Linotype", "Book Antiqua", Palatino, serif',
                            size: 30
                        }
                    }
                },
                y: { 
                    stacked: true, 
                    title: { 
                        display: true, 
                        text: 'Cost per gram mAb (US$)', 
                        color: 'black',
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
                    }
                }
            },
            plugins: {
                legend: { 
                    position: 'right',
                    labels: { 
                        color: 'black', 
                        font: { 
                            family: '"Palatino Linotype", "Book Antiqua", Palatino, serif',
                            size: 24 
                        }
                    }
                },
                tooltip: {
                    titleFont: {
                        family: '"Palatino Linotype", "Book Antiqua", Palatino, serif',
                        size: 24
                    },
                    bodyFont: {
                        family: '"Palatino Linotype", "Book Antiqua", Palatino, serif',
                        size: 24
                    }
                },
                datalabels: {
                    color: 'black',
                    font: {
                        family: '"Palatino Linotype", "Book Antiqua", Palatino, serif',
                        size: 24
                    },
                    formatter: (value) => value > 0 ? `$${value.toFixed(1)}` : ''
                }
            }
        }
    });

    function updateModel() {
        const labor_reduction_pct = parseInt(laborSlider.value);
        const capital_reduction_pct = parseInt(capitalSlider.value);
        const lower_cost_location = locationToggle.checked;
        const eliminate_contamination = contaminationToggle.checked;
        const utilization_pct = 70; // Hardcoded assumption

        laborValue.textContent = labor_reduction_pct;
        capitalValue.textContent = capital_reduction_pct;
        
        const baseline_util = 0.70;
        const u_factor_fixed = baseline_util / (utilization_pct / 100);
        const u_factor_var = (utilization_pct / 100) / baseline_util;

        // Calculate new values based on updated model
        const raw_mat_new = baselineData.raw_mat * u_factor_var;
        let labor_new = baselineData.labor * u_factor_fixed * (1 - labor_reduction_pct / 100);
        const qa_qc_new = baselineData.qa_qc * u_factor_fixed;
        let utilities_new = baselineData.utilities * u_factor_var * (lower_cost_location ? 0.90 : 1);

        // Facility cost reduction slider applies only to facility depreciation
        let fac_dep_new = baselineData.fac_dep * u_factor_fixed * (1 - capital_reduction_pct / 100);
        let equip_dep_new = baselineData.equip_dep * u_factor_fixed;

        // MRO falls only half as steeply with capital reduction
        let fac_mro_new = baselineData.fac_mro * u_factor_fixed * (1 - 0.5 * capital_reduction_pct / 100);

        // If lower-cost location, apply a uniform 20% haircut to labour & facility costs
        if (lower_cost_location) {
            labor_new *= 0.80;
            fac_dep_new *= 0.80;
            fac_mro_new *= 0.80;
        }

        const scenarioCosts = {
            fac_dep: fac_dep_new,
            equip_dep: equip_dep_new,
            fac_mro: fac_mro_new,
            raw_mat: raw_mat_new,
            labor: labor_new,
            qa_qc: qa_qc_new,
            utilities: utilities_new
        };
        
        let lost_batch_new = 0;
        if (!eliminate_contamination) {
            lost_batch_new = (Object.values(scenarioCosts).reduce((a, b) => a + b, 0)) * (1 / (1 - 0.025) - 1);
        }

        // Update chart data in the correct order: Facility Dep, Equipment Dep, Facility MRO, Raw Materials, Labor, QA/QC, Utilities
        chart.data.datasets[0].data[1] = fac_dep_new;    // Facility Depreciation
        chart.data.datasets[1].data[1] = equip_dep_new;  // Equipment Depreciation
        chart.data.datasets[2].data[1] = fac_mro_new;    // Facility MRO
        chart.data.datasets[3].data[1] = raw_mat_new;    // Raw Materials
        chart.data.datasets[4].data[1] = labor_new;      // Labor
        chart.data.datasets[5].data[1] = qa_qc_new;      // QA/QC
        chart.data.datasets[6].data[1] = utilities_new;  // Utilities
        chart.data.datasets[7].data[1] = lost_batch_new; // Lost Batches

        // Calculate total costs and reduction percentage
        const totalBaseline = Object.values(baselineData).reduce((a, b) => a + b, 0);
        const totalScenario = fac_dep_new + equip_dep_new + fac_mro_new + raw_mat_new + labor_new + qa_qc_new + utilities_new + lost_batch_new;
        const reductionPercent = ((totalBaseline - totalScenario) / totalBaseline * 100).toFixed(1);

        // Update cost reduction display
        const costReductionDisplay = document.getElementById('costReductionDisplay');
        if (costReductionDisplay) {
            const displayText = reductionPercent > 0 ? `-${reductionPercent}%` : '0.0%';
            costReductionDisplay.textContent = displayText;
        }

        chart.update();
    }

    [laborSlider, capitalSlider, locationToggle, contaminationToggle].forEach(el => {
        el.addEventListener('input', updateModel);
    });

    updateModel();

    // Modal functionality
    const modal = document.getElementById('assumptions-modal');
    const trigger = document.getElementById('assumptions-trigger');
    const closeButton = document.querySelector('.assumptions-close-button');

    if (trigger && modal && closeButton) {
        trigger.addEventListener('click', () => {
            modal.style.display = 'block';
        });

        closeButton.addEventListener('click', () => {
            modal.style.display = 'none';
        });

        // Close modal when clicking outside of it
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }
}); 