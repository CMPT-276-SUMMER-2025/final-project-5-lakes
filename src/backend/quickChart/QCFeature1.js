// Feature 1: Generate Chart
// Get data from frontend after user confirms.
// Seperate the data by "type", "lable", "dataset", etc.
// Run through if statements to the right type
// import the fixed parameters and create graph with data
const {quickChartURL} = require('./QCParameters.js');  
const dummyChart = require('./dummyData/dummyChartConfig.js');

function generateDummyChart(type, description) {
    const chart = dummyChart.find(c => c.title === type);

    if (!chart) {
        console.warn(`No dummy chart found for type: ${type}`);
        return null;
    }

    const encoded = encodeURIComponent(JSON.stringify(dummyChart[chart.id-1].config));

    return {
        id: chart.id,
        type: chart.config.type,
        title: chart.title,
        description: description === "No explanation provided." 
        ? chart.description 
        : description,
        imageUrl: `${quickChartURL}${encoded}`
    };
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

    const colors = [
        'rgb(54, 162, 235)',   // Blue
        'rgb(255, 99, 132)',   // Red
        'rgb(75, 192, 192)',   // Teal
        'rgb(255, 205, 86)',   // Yellow
        'rgb(153, 102, 255)',  // Purple
        'rgb(255, 159, 64)'    // Orange
    ];
    
    let chartConfig = {
        type: type,
        data: {
            labels: xLabels,
            datasets: labels.y.map((label, index) => ({
                label: label,
                data: getYValues(label, datasets),
                backgroundColor: colors[index % colors.length],
            }))
        },
        options: {
            plugins: {
                title: {
                    display: true,
                    text: "Chart Title",
                    font: {
                        family: "Noto Sans",
                        size: 24
                    }
                }
            }
        }
    };

    console.log(chartConfig.data.datasets);
    return chartConfig;
}

module.exports = {
    generateChart,
    generateDummyChart,
    getYValues,
    multipleDatasetsChartGenerator
};
