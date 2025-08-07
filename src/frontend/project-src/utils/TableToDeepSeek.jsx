// This function converts a table structure into a format suitable for DeepSeek
// It expects the input to be an object with 'columns' and 'rows' properties

function convertTableToDeepSeekFormat(table) {
  const { columns, rows } = table;

  return rows.map((row) => {
    const obj = {};
    columns.forEach((col, i) => {
      obj[col] = row.cells[i] ?? "";
    });
    return obj;
  });
}

export default convertTableToDeepSeekFormat;