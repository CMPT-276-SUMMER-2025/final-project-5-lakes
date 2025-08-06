function EditableTable({
  tableRef,
  confirmedData,
  selectedCell,
  setSelectedCell,
  editHistory,
  setEditHistory,
  colEditHistory,
  setColEditHistory,
  hoveredAction,
  updateConfirmedData,
  setUndoStack,
  setRedoStack,
}) {
  return (
    <div ref={tableRef} className="overflow-auto border max-w-full max-h-[400px]">
      <table className="w-full min-w-max border border-gray-300">
        <thead>
          <tr>
            {confirmedData.columns.map((col, colIdx) => (
              <th key={colIdx} className="border px-3 py-2 bg-gray-100">
                <input
                  value={col}
                  onClick={() =>
                    setSelectedCell({ row: -1, col: colIdx })
                  }
                  onFocus={() => {
                    setSelectedCell({ row: -1, col: colIdx });
                    setColEditHistory({
                      index: colIdx,
                      prevValue: confirmedData.columns[colIdx],
                      snapshot: structuredClone(confirmedData),
                    });
                  }}
                  onChange={(e) => {
                    const updated = structuredClone(confirmedData);
                    updated.columns[colIdx] = e.target.value;
                    updateConfirmedData(updated);
                  }}
                  onBlur={() => {
                    if (
                      colEditHistory &&
                      colEditHistory.index === colIdx &&
                      colEditHistory.prevValue !== confirmedData.columns[colIdx]
                    ) {
                      setUndoStack((prev) => [...prev, colEditHistory.snapshot]);
                      setRedoStack([]);
                    }
                    setColEditHistory(null);
                  }}
                  className={`w-full font-semibold outline-none px-1 py-0.5 rounded 
                    ${
                      selectedCell?.row === -1 && selectedCell?.col === colIdx
                        ? "bg-blue-200 ring-2 ring-blue-500"
                        : ""
                    }`}
                />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {confirmedData.rows.map((row, rowIdx) => (
            <tr key={rowIdx}>
              {row.cells.map((cell, colIdx) => (
                <td
                  key={colIdx}
                  className={`border px-3 py-2 ${
                    (() => {
                      if (!selectedCell) return "";
                      const isRow = rowIdx === selectedCell.row;
                      const isCol = colIdx === selectedCell.col;

                      if (hoveredAction === "removeRow") {
                        return isRow ? "bg-red-100" : "";
                      }
                      if (hoveredAction === "removeCol") {
                        return isCol ? "bg-red-100" : "";
                      }
                      return "";
                    })()
                  }`}
                >
                  <input
                    value={cell}
                    onClick={() => setSelectedCell({ row: rowIdx, col: colIdx })}
                    onFocus={() => {
                      setEditHistory({
                        row: rowIdx,
                        col: colIdx,
                        prevValue: confirmedData.rows[rowIdx].cells[colIdx],
                        snapshot: structuredClone(confirmedData)
                      });
                      setSelectedCell({ row: rowIdx, col: colIdx });
                    }}
                    onChange={(e) => {
                      const updated = structuredClone(confirmedData);
                      updated.rows[rowIdx].cells[colIdx] = e.target.value;
                      updateConfirmedData(updated);
                    }}
                    onBlur={() => {
                      if (
                        editHistory &&
                        editHistory.row === rowIdx &&
                        editHistory.col === colIdx
                      ) {
                        const currentValue = confirmedData.rows[rowIdx].cells[colIdx];
                        if (editHistory.prevValue !== currentValue) {
                          setUndoStack((prev) => [...prev, editHistory.snapshot]);
                          setRedoStack([]);
                        }
                        setEditHistory(null);
                      }
                    }}
                    className={`w-full outline-none ${
                      selectedCell?.row === rowIdx && selectedCell?.col === colIdx
                        ? "bg-blue-200 ring-2 ring-blue-500 rounded"
                        : ""
                    }`}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default EditableTable;