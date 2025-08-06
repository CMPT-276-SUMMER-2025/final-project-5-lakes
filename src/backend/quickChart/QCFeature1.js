const { getXValues } = require('./QCAdditionalFunctions.js');
const { getYValues } = require('./QCAdditionalFunctions.js');
const { getScatterValues } = require('./QCAdditionalFunctions.js');
const dummyChart = require('./dummyData/dummyChartConfig.js');

// Generates a Chart.js configuration object for various chart types using multiple Y-axis datasets.
function multipleDatasetsChartGenerator(type, labels, datasets, id) {
    const chart = dummyChart.find(c => c.id === id);

    const xLabels = getXValues(labels.x, datasets);
    const colors = [
        'rgb(54, 162, 235)', 
        'rgb(255, 99, 132)',  
        'rgb(75, 192, 192)',  
        'rgb(255, 205, 86)',   
        'rgb(153, 102, 255)',  
        'rgb(255, 159, 64)'
    ];
    
    let chartConfig = {
        type: type,
        data: {
            labels: xLabels,
            datasets: labels.y.map((label, index) => ({
                label: label,
                data: getYValues(label, datasets),
                backgroundColor: colors[index % colors.length],
                borderColor: colors[index % colors.length],
            }))
        },
        options: {
            plugins: {
                title: {
                    display: true,
                    text: "Chart Title",
                    color: "#000",
                    font: {
                        family: "Noto Sans",
                        size: 22
                    }
                },
                legend: {
                    display: true,
                    labels: {
                        color: "#000",
                        font: {
                            family: "Noto Sans",
                            size: 14
                        }
                    }
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: "X-axis",
                        color: "#000",
                        font: {
                            family: "Noto Sans",
                            size: 18
                        }
                    },
                    ticks: {
                        color: "#000",
                        font: {
                            family: "Noto Sans",
                            size: 14
                        }
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: "Y-axis",
                        color: "#000",
                        font: {
                            family: "Noto Sans",
                            size: 18
                        }
                    },
                    ticks: {
                        color: "#000",
                        font: {
                            family: "Noto Sans",
                            size: 14
                        }
                    }
                }
            }
        }
    };

    if (chart?.config) {
        // Merge top-level fields like options, parsing
        if (chart.config.options) {
            chartConfig.options = {
                ...chartConfig.options,
                ...chart.config.options,
                plugins: {
                    ...chartConfig.options.plugins,
                    ...chart.config.options.plugins,
                    title: {
                        ...chartConfig.options.plugins?.title,
                        ...chart.config.options.plugins?.title,
                        display: true,
                        text: chart?.title || "Chart Title",
                        font: {
                            family: "Noto Sans",
                            size: 24
                        }
                    }
                },
            };
        }
    }


    if (type == "scatter") {
        chartConfig.data.datasets[0].data = getScatterValues(labels, datasets);
    }
    else if (type === "pie" || type === "doughnut") {
        // For pie/doughnut charts, map background colors to the number of data points
        const dataLength = chartConfig.data.datasets[0].data.length;
        chartConfig.data.datasets[0].backgroundColor = colors.slice(0, dataLength);
        chartConfig.data.datasets[0].borderColor = "rgb(255, 255, 255)";
        
        // Disable grid lines and axes for pie/doughnut charts
        chartConfig.options.scales = {
            x: {
                display: false
            },
            y: {
                display: false
            }
        };
        
        // Disable grid lines
        chartConfig.options.elements = {
            ...chartConfig.options.elements,
            point: {
                radius: 0
            }
        };

        chartConfig.options.plugins.datalabels = {
            display: true,
            backgroundColor: "#ccc",
            color: "#000",
            font: {
                family: "Noto Sans",
                size: 18
            }
        };
    }
    else if (type === "line") {
        for (let i = 0; i < chartConfig.data.datasets.length; i++){
            chartConfig.data.datasets[i].fill = false;
        }

        if (id === 8){
            chartConfig.data.datasets.stepped = true;
        }
    }

    return chartConfig;
}

module.exports = { multipleDatasetsChartGenerator };
