// Feature 1: Generate Chart
// Get data from frontend after user confirms.
// Seperate the data by "type", "lable", "dataset", etc.
// Run through if statements to the right type
// import the fixed parameters and create graph with data
// Return .JSON ready to generate image in the following: https://quickchart.io/chart?c=<encoded JSON config>

const quickChartURL = "https://quickchart.io/chart?c=";

function getYValues(label, dataset) {
    return dataset.map(item => item[label]);
}
    
function generateChart(type, xlabels, yValues, dataset) {
    let chartConfig = {
        type: type,
        data: {
            labels: xlabels,
            datasets: [
                {
                    data: yValues
                }
            ]
        }
    };

    const encodedConfig = encodeURIComponent(JSON.stringify(chartConfig));
    return quickChartURL + encodedConfig;
}

function multipleDatasetsChartGenerator(type, xlabels, datasets) {
    
}
