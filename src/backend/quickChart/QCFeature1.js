// Feature 1: Generate Chart
// Get data from frontend after user confirms.
// Seperate the data by "type", "lable", "dataset", etc.
// Run through if statements to the right type
// import the fixed parameters and create graph with data
// Return .JSON ready to generate image in the following: https://quickchart.io/chart?c=<encoded JSON config>
const {quickChartURL} = require('./QCParameters.js');  

//DUMMY CHART
const dummyChart = [
    {
        id: 1,
        title: "Bar Chart",
        description: "Displays values as bars.",
        config: {
            type: 'bar',
            data: {
                labels: ['Jan', 'Feb', 'Mar'],
                datasets: [{
                    label: 'Sales',
                    data: [10, 20, 30],
                    backgroundColor: 'rgba(54, 162, 235, 0.6)',
                }]
            }
        }
    },
    {
        id: 2,
        title: "Line Chart",
        description: "Shows trends over time.",
        config: {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar'],
                datasets: [{
                    label: 'Sales',
                    data: [10, 20, 30],
                    borderColor: 'rgba(75, 192, 192, 1)',
                    fill: false,
                }]
            }
        }
    },
    {
        id: 3,
        title: "Pie Chart",
        description: "Represents data as parts of a whole.",
        config: {
            type: 'pie',
            data: {
                labels: ['Product A', 'Product B', 'Product C'],
                datasets: [{
                    data: [300, 50, 100],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.6)',
                        'rgba(255, 206, 86, 0.6)',
                        'rgba(75, 192, 192, 0.6)',
                    ]
                }]
            }
        }
    }
];

//only bar for now
function generateDummyChart() {
    const encodedConfig = encodeURIComponent(JSON.stringify(dummyChart[0].config));
    return quickChartURL + encodedConfig;
}

function getYValues(label, dataset) {
    return dataset.map(item => item[label]);
}
    
function generateChart(type, xlabels, yValues, dataset) {
    /*let chartConfig = {
        type: type,
        data: {
            labels: xlabels,
            datasets: [
                {
                    data: yValues
                }
            ]
        }
    };*/

    
    const encodedConfig = encodeURIComponent(JSON.stringify(chartConfig));
    return quickChartURL + encodedConfig;
}

function multipleDatasetsChartGenerator(type, xlabels, datasets) {
    
}

module.exports = {generateDummyChart};
