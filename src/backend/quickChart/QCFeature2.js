// Feature 2: Customize Chart
// Get returned back the previous data: https://quickchart.io/chart?c=<encoded JSON config>
// Make an object storing all possible changes
// Compare the new object with user changes with the fixed parameters as an object
// Any differences will be applied to the new graph and displayed

const quickChartURL = "https://quickchart.io/chart?c=";

function editChart(chartConfig, changes) {
    
    for (const key in changes) {
        chartConfig.data.datasets[0][key] = changes[key];
    }

    return chartConfig;
}