function getYValues(label, dataset) {
    return dataset.map(item => parseFloat(item[label]));
}

function getXValues(labels, dataset) {
    return dataset.map(item => {
        const combinedValues = labels.map(label => item[label]);
        return combinedValues.join(' -- ');
    });
}

function getScatterValues(labels, dataset) {
    // For scatter plots, we need to create an array of objects with x and y properties
    // labels.x should contain the x-axis label(s) and labels.y should contain the y-axis label(s)
    
    return dataset.map(item => {
        // Get x value(s) - if multiple x labels, combine them
        const xValue = Array.isArray(labels.x) 
            ? labels.x.map(label => item[label]).join(' -- ')
            : item[labels.x];
        
        // Get y value(s) - if multiple y labels, use the first one for scatter
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