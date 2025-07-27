function parseQuickChartToTableRows(parsedDataArray) {
  if (!Array.isArray(parsedDataArray) || parsedDataArray.length === 0) {
    return { tableRows: [], columns: [] };
  }

  const labelToRow = {};
  const columnSet = new Set(["Label"]);

  parsedDataArray.forEach((chartObj) => {
    const labels = chartObj.data?.labels || [];
    const datasets = chartObj.data?.datasets || [];

    labels.forEach((label, i) => {
      if (!labelToRow[label]) labelToRow[label] = { Label: label };

      datasets.forEach((dataset) => {
        const key = dataset.label || `Series ${i + 1}`;
        labelToRow[label][key] = dataset.data[i] ?? "";
        columnSet.add(key);
      });
    });
  });

  const tableRows = Object.values(labelToRow);
  const columns = Array.from(columnSet).map((key) => ({
    key,
    name: key,
    editable: true,
  }));

  return { tableRows, columns };
}

export default parseQuickChartToTableRows;