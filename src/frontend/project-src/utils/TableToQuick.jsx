function convertTableRowsToQuickChartConfig(rows, labelKey = null, valueKey = null, type = "bar") {
  if (!Array.isArray(rows) || rows.length === 0) {
    return {
      type,
      data: { labels: [], datasets: [] }
    };
  }

  const firstRow = rows[0];
  const allKeys = Object.keys(firstRow);

  // Auto-select label key (first column)
  if (!labelKey) labelKey = allKeys[0];

  // Auto-select value key (first numeric-looking column that's not the label)
  if (!valueKey) {
    valueKey = allKeys.find(k =>
      k !== labelKey && rows.some(row => !isNaN(parseFloat(row[k])))
    ) || allKeys[1]; // fallback to second key
  }

  return {
    type,
    data: {
      labels: rows.map(row => row[labelKey] ?? ""),
      datasets: [
        {
          label: valueKey,
          data: rows.map(row => Number(row[valueKey]) || 0),
        },
      ],
    }
  };
}

export default convertTableRowsToQuickChartConfig;