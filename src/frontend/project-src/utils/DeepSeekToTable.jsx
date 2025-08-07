// This function converts parsed DeepSeek data into a table format
// It expects the input to be an array of objects, where each object represents a row of data

function convertDeepSeekToTable(parsedData) {
  if (!Array.isArray(parsedData) || parsedData.length === 0) {
    return {
      table: {
        rowHeaderTitle: '',
        columns: [],
        rows: [],
      },
    };
  }

  const columns = Object.keys(parsedData[0]);
  const rows = parsedData.map((rowObj, idx) => ({
    header: `Row ${idx + 1}`,
    cells: columns.map((col) => rowObj[col] ?? ""),
  }));

  return {
    table: {
      rowHeaderTitle: "Row",
      columns,
      rows,
    },
  };
}

export default convertDeepSeekToTable;