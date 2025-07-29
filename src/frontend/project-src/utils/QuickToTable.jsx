function parseQuickChartToTableRows(parsedDataArray) {
  if (!Array.isArray(parsedDataArray) || parsedDataArray.length === 0) {
    return { tableRows: [], chartLabel: "Value", chartType: "bar" };
  }

  return {
    tableRows: parsedDataArray,
    chartLabel: Object.keys(parsedDataArray[0])[1] || "Value", // guess 2nd key as data label
    chartType: "bar"
  };
}

export default parseQuickChartToTableRows;