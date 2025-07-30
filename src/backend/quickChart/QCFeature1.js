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

function getXValues(labels, dataset) {
    return dataset.map(item => {
        const combinedValues = labels.map(label => item[label]);
        return combinedValues.join(' -- ');
    });
}
    
function generateChart(dataset, labels, type) {
    const yValues = getYValues(labels.y[0], dataset);
    const xLabels = getXValues(labels.x, dataset);
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

function getMultipleDataSets(labels, datasets) {
    return labels.y.map((label, index) => ({
        label: `Dataset ${index + 1}`,
        data: getYValues(labels.y[label], datasets)
    }));
}

function multipleDatasetsChartGenerator(type, labels, datasets) {
    // Use the first dataset to generate X labels (assuming all datasets share same X structure)
    const xLabels = getXValues(labels.x, datasets);
    
    let chartConfig = {
        type: type,
        data: {
            labels: xLabels,
            datasets: labels.y.map((label, index) => ({
                label: `Dataset ${index + 1}`,
                data: getYValues(label, datasets)
            }))
        }
    };

    console.log(chartConfig.data.datasets);
    return chartConfig;
}

module.exports = {
    generateChart,
    generateDummyChartURL,
    getYValues,
    multipleDatasetsChartGenerator
};
