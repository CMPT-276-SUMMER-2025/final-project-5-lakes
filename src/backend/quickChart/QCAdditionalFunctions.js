function getYValues(label, dataset) {
    return dataset.map(item => item[label]);
}

function getXValues(labels, dataset) {
    return dataset.map(item => {
        const combinedValues = labels.map(label => item[label]);
        return combinedValues.join(' -- ');
    });
}

module.exports = {
    getYValues,
    getXValues
};