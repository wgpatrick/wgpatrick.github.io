document.addEventListener('DOMContentLoaded', () => {

    const laborSlider = document.getElementById('labor_reduction_pct');
    const capitalSlider = document.getElementById('capital_reduction_pct');
    const locationToggle = document.getElementById('lower_cost_location');

    const laborValue = document.getElementById('labor_value');
    const capitalValue = document.getElementById('capital_value');

    const ctx = document.getElementById('cogsChart');
    if (!ctx) return;

    const baselineData = {
        raw_mat: 10.8,      // 18%
        labor: 9.0,         // 15%
        qa_qc: 4.2,         // 7%
        utilities: 1.8,     // 3%
        fac_dep: 15.4,      // Facility/clean-room depreciation (25.7%)
        equip_dep: 12.0,    // Process-equipment depreciation (20.0%)
        fac_mro: 6.8,       // Facility MRO + tax + insurance (11.3%)
    };

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
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: { stacked: true, ticks: { color: '#fff' } },
                y: { 
                    stacked: true, 
                    title: { display: true, text: 'Cost per gram mAb (US$)', color: '#fff' },
                    ticks: { color: '#fff' }
                }
            },
            plugins: {
                legend: { 
                    position: 'bottom',
                    labels: { color: '#fff', font: { size: 10 } }
                },
                datalabels: {
                    color: '#fff',
                    formatter: (value) => value > 0 ? `$${value.toFixed(1)}` : ''
                }
            }
        }
    });

    function updateModel() {
        const labor_reduction_pct = parseInt(laborSlider.value);
        const capital_reduction_pct = parseInt(capitalSlider.value);
        const lower_cost_location = locationToggle.checked;
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

        // Update chart data in the correct order: Facility Dep, Equipment Dep, Facility MRO, Raw Materials, Labor, QA/QC, Utilities
        chart.data.datasets[0].data[1] = fac_dep_new;    // Facility Depreciation
        chart.data.datasets[1].data[1] = equip_dep_new;  // Equipment Depreciation
        chart.data.datasets[2].data[1] = fac_mro_new;    // Facility MRO
        chart.data.datasets[3].data[1] = raw_mat_new;    // Raw Materials
        chart.data.datasets[4].data[1] = labor_new;      // Labor
        chart.data.datasets[5].data[1] = qa_qc_new;      // QA/QC
        chart.data.datasets[6].data[1] = utilities_new;  // Utilities

        // Calculate total costs and reduction percentage
        const totalBaseline = baselineData.fac_dep + baselineData.equip_dep + baselineData.fac_mro + 
                             baselineData.raw_mat + baselineData.labor + baselineData.qa_qc + baselineData.utilities;
        const totalScenario = fac_dep_new + equip_dep_new + fac_mro_new + raw_mat_new + labor_new + qa_qc_new + utilities_new;
        const reductionPercent = ((totalBaseline - totalScenario) / totalBaseline * 100).toFixed(1);

        // Update cost reduction display
        const costReductionDisplay = document.getElementById('costReductionDisplay');
        if (costReductionDisplay) {
            const displayText = reductionPercent > 0 ? `-${reductionPercent}%` : '0.0%';
            costReductionDisplay.textContent = displayText;
        }

        chart.update();
    }

    [laborSlider, capitalSlider, locationToggle].forEach(el => {
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