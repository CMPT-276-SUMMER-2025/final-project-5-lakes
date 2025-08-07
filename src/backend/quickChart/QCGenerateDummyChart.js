const { quickChartURL } = require('./QCURL.js');  
const dummyChart = require('./dummyData/dummyChartConfig.js');

// Returns a dummy chart object with metadata and image URL based on the chart type and optional description.
function generateDummyChart(type, description) {
    const chart = dummyChart.find(c => c.title === type);

    if (!chart) {
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

module.exports = { generateDummyChart };