const { quickChartURL } = require('./QCURL.js');  

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

module.exports = { generateDummyChart };