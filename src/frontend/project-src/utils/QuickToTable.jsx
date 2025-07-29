
function parseQuickChartToTableRows(parsedData) {
  if (
    !parsedData ||
    !parsedData.data ||
    !parsedData.data.labels ||
    !parsedData.data.datasets
  ) {
    return { tableRows: [], chartLabel: "Value", chartType: "bar" };
  }

  const labels = parsedData.data.labels;
  const values = parsedData.data.datasets[0]?.data || [];
  const datasetLabel = parsedData.data.datasets[0]?.label || "Value";
  const type = parsedData.type || "bar";

  const tableRows = labels.map((label, i) => ({
    id: i,
    label,
    value: values[i] ?? "",
  }));

  return {
    tableRows,
    chartLabel: datasetLabel,
    chartType: type,
  };
}

export default parseQuickChartToTableRows;