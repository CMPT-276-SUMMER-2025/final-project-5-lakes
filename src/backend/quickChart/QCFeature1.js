// Feature 1: Generate Chart
// Get data from frontend after user confirms.
// Seperate the data by "type", "lable", "dataset", etc.
// Run through if statements to the right type
// import the fixed parameters and create graph with data
// Return .JSON ready to generate image in the following: https://quickchart.io/chart?c=<encoded JSON config>
const {quickChartURL} = require('./QCParameters.js');  
const dummyChart = require('./dummyData/dummyChartConfig.js');

function generateDummyChartURL(int) {
    const encoded = encodeURIComponent(JSON.stringify(dummyChart[int-1].config));
    return `https://quickchart.io/chart?c=${encoded}`;
}

function getYValues(label, dataset) {
    return dataset.map(item => item[label]);
}
    
function generateChart(dataset, labels, type) {
    const yValues = getYValues(labels.y[0], dataset);
    const xLabels = labels.x;
    const datasetTitle = "Dataset";
    let chartConfig = {
        type: type,
        data: {
            labels: xLabels,
            datasets: [
                {
                    data: yValues,
                    label: datasetTitle
                }
            ]
        }
    };
    // const encoded = encodeURIComponent(JSON.stringify(chartConfig));
    return chartConfig;
    
}

function multipleDatasetsChartGenerator(type, xlabels, datasets) {
    
}

module.exports = {
    generateChart,
    generateDummyChartURL,
    getYValues,
    multipleDatasetsChartGenerator
};
