// Extracts numeric Y-axis values from a dataset based on a given label.
function getYValues(label, dataset) {
    return dataset.map(item => parseFloat(item[label]));
}

// Combines multiple label values for each data entry into a single X-axis string.
function getXValues(labels, dataset) {
    return dataset.map(item => {
        const combinedValues = labels.map(label => item[label]);
        return combinedValues.join(' -- ');
    });
}
// Formats dataset entries into {x, y} objects for scatter plot generation.
function getScatterValues(labels, dataset) {
    return dataset.map(item => {
        const xValue = Array.isArray(labels.x) 
            ? labels.x.map(label => item[label]).join(' -- ')
            : item[labels.x];
        
        const yValue = Array.isArray(labels.y) 
            ? item[labels.y[0]] 
            : item[labels.y];
        
        return {
            x: xValue,
            y: yValue
        };
    });
}

module.exports = {
    getYValues,
    getXValues,
    getScatterValues
};