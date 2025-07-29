import { useEffect, useState } from "react";

function EditableSpreadsheet({
  initialData = [],
  setConfirmedData,
  originalData,
  setOriginalData,
}) {
  const [tableData, setTableData] = useState([]);
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    setTableData(initialData);
    setColumns(Object.keys(initialData[0] || {}));
    if (setOriginalData && originalData.length === 0) {
      setOriginalData(initialData);
    }
  }, [initialData, originalData, setOriginalData]);

  useEffect(() => {
    setConfirmedData(tableData);
  }, [tableData, setConfirmedData]);

  const handleCellChange = (rowIdx, colKey, value) => {
    const updated = [...tableData];
    updated[rowIdx][colKey] = value;
    setTableData(updated);
  };

  const handleHeaderChange = (index, newKey) => {
    const oldKey = columns[index];
    const newColumns = [...columns];
    newColumns[index] = newKey;

    const newData = tableData.map((row) => {
      const updatedRow = { ...row };
      updatedRow[newKey] = updatedRow[oldKey];
      delete updatedRow[oldKey];
      return updatedRow;
    });

    setColumns(newColumns);
    setTableData(newData);
  };

  const handleReset = () => {
    setTableData([...originalData]);
    setColumns(Object.keys(originalData[0] || {}));
  };

  return (
    <div className="overflow-auto max-w-full">
      <table className="min-w-full border border-gray-300">
        <thead>
          <tr>
            {columns.map((col, colIdx) => (
              <th key={colIdx} className="border p-2 bg-gray-100">
                <input
                  value={col}
                  onChange={(e) => handleHeaderChange(colIdx, e.target.value)}
                  className="w-full border rounded p-1"
                />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tableData.map((row, rowIdx) => (
            <tr key={rowIdx}>
              {columns.map((colKey, colIdx) => (
                <td key={colIdx} className="border p-2">
                  <input
                    value={row[colKey] || ""}
                    onChange={(e) => handleCellChange(rowIdx, colKey, e.target.value)}
                    className="w-full p-1 border rounded"
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex gap-4 mt-4">
        <button
          onClick={handleReset}
          type="button"
          className="bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-2 rounded"
        >
          Reset to Original
        </button>
      </div>
    </div>
  );
}

export default EditableSpreadsheet;