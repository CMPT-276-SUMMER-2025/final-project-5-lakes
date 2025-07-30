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