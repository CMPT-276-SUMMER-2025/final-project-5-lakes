function convertTableRowsToQuickChartConfig(rows, labelName = "Value", type = "bar") {
  return {
    type,
    data: {
      labels: rows.map((row) => row.label),
      datasets: [
        {
          label: labelName,
          data: rows.map((row) => Number(row.value)),
        },
      ],
    },
  };
}

export default convertTableRowsToQuickChartConfig;