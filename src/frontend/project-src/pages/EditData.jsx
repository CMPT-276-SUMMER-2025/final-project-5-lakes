import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import EditDataStepper from "../components/editdata/EditDataStepper";
import LoadingPopUp from "../components/editdata/LoadingPopUp";
import convertDeepSeekToTable from "../utils/DeepSeekToTable";
import convertTableToDeepSeekFormat from "../utils/TableToDeepSeek";
import { ChevronLeft, ChevronRight, RotateCw, Plus, Trash, Undo, Redo } from "lucide-react";
import DefaultError from '../components/messages/DefaultError';
import useDefaultError from '../hooks/DefaultErrorHook';
import { useRef } from "react";

const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/edit-data`;

function EditData() {

  const location = useLocation();
  const navigate = useNavigate();
  const { parsedData, file, summary, graphRecommendation, chartsWithURLs } = location.state || {};
  const { isAlertVisible, alertConfig, showAlert, hideAlert } = useDefaultError();

  // const fileName = file?.originalname || "Unknown file";
  // const fileSize = file?.size || 0;

  console.log("file:", file);
  console.log("parsedData:", parsedData);

  const [isLoading, setIsLoading] = useState(false);
  const [confirmedData, setConfirmedData] = useState(null);
  const [originalData, setOriginalData] = useState(null);

  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);

  const [selectedCell, setSelectedCell] = useState(null); 

  const [editHistory, setEditHistory] = useState([null]);
  const [colEditHistory, setColEditHistory] = useState([null]);

  const [hoveredAction, setHoveredAction] = useState(null);

  const tableRef = useRef(null);

  // Initialize confirmedData and originalData from parsedData
  useEffect(() => {
    if (!parsedData || !file) {
      navigate("/");
      return;
    }

    const { table } = convertDeepSeekToTable(parsedData);
    setConfirmedData(structuredClone(table));
    setOriginalData(structuredClone(table));
  }, [parsedData, file, navigate]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (tableRef.current && !tableRef.current.contains(event.target)) {
        setSelectedCell(null); // clear selection
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


  // Handle form submission
  const handleNext = async (e) => {
  e.preventDefault();
  setIsLoading(true);

  const formattedData = convertTableToDeepSeekFormat(confirmedData);

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        edittedData: formattedData,
        parsedData: parsedData,
        file: file,
      }),
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      const error = new Error(data.error || "Something went wrong");
      error.code = data.code || "";
      throw error;
    }

    setIsLoading(false);
    navigate("/visual-select", { state: data });

  } catch (error) {
    setIsLoading(false);

    if (error.code === "INVALID_EDITED_TABLE") {
      showAlert(
        "error",
        "Editing Failed",
        `We could not generate the chart: ${error.message}.`,
        "Okay"
      );
    } else {
      showAlert(
        "error",
        "Generation Failed",
        `We could not generate the chart: ${error.message}.. Please try again later.`,
        "Okay"
      );
    }
  }
};
  
  // Functions to add/remove rows and columns
  const addRow = () => {
    const updated = structuredClone(confirmedData);
    updated.rows.push({
      header: `Row ${updated.rows.length + 1}`,
      cells: new Array(updated.columns.length).fill(""),
    });
    updateConfirmedData(updated);
  };

  const removeRow = () => {
    if (confirmedData.rows.length === 0) return;
    const updated = structuredClone(confirmedData);
    updated.rows.pop();
    updateConfirmedData(updated);
  };

  const addColumn = () => {
    const updated = structuredClone(confirmedData);
    updated.columns.push(`Column ${updated.columns.length + 1}`);
    updated.rows.forEach((row) => row.cells.push(""));
    updateConfirmedData(updated);
  };

  const removeColumn = () => {
    if (confirmedData.columns.length === 0) return;
    const updated = structuredClone(confirmedData);
    updated.columns.pop();
    updated.rows.forEach((row) => row.cells.pop());
    updateConfirmedData(updated);
  };

  const insertRowAbove = (index) => {
    const updated = structuredClone(confirmedData);
    updated.rows.splice(index, 0, {
      cells: new Array(updated.columns.length).fill(""),
    });

    updateConfirmedData(updated);

    setTimeout(() => {
      setSelectedCell({
        row: index + 1 < updated.rows.length ? index + 1 : updated.rows.length - 1,
        col: selectedCell.col < updated.columns.length ? selectedCell.col : updated.columns.length - 1,
      });
    }, 0);
  };

  const insertRowBelow = (index) => {
    const updated = structuredClone(confirmedData);
    updated.rows.splice(index + 1, 0, {
      cells: new Array(updated.columns.length).fill(""),
    });

    updateConfirmedData(updated);

    setTimeout(() => {
      setSelectedCell({
        row: index < updated.rows.length ? index : updated.rows.length - 1,
        col: selectedCell.col < updated.columns.length ? selectedCell.col : updated.columns.length - 1,
      });
    }, 0);
  };

  const insertColumnLeft = (index) => {
    const updated = structuredClone(confirmedData);
    updated.columns.splice(index, 0, `Column ${updated.columns.length + 1}`);
    updated.rows.forEach((row) => row.cells.splice(index, 0, ""));

    updateConfirmedData(updated);

    setTimeout(() => {
      setSelectedCell({
        row: selectedCell.row < updated.rows.length ? selectedCell.row : updated.rows.length - 1,
        col: index + 1 < updated.columns.length ? index + 1 : updated.columns.length - 1,
      });
    }, 0);
  };

  const insertColumnRight = (index) => {
    const updated = structuredClone(confirmedData);
    updated.columns.splice(index + 1, 0, `Column ${updated.columns.length + 1}`);
    updated.rows.forEach((row) => row.cells.splice(index + 1, 0, ""));

    updateConfirmedData(updated);

    setTimeout(() => {
      setSelectedCell({
        row: selectedCell.row < updated.rows.length ? selectedCell.row : updated.rows.length - 1,
        col: index < updated.columns.length ? index : updated.columns.length - 1,
      });
    }, 0);
  };

  const removeSelectedRow = (index) => {
    if (confirmedData.rows.length <= 1) return;

    const updated = structuredClone(confirmedData);
    updated.rows.splice(index, 1);

    updateConfirmedData(updated);

    setTimeout(() => {
      const newRow = index > 0 ? index - 1 : 0;
      setSelectedCell({
        row: newRow < updated.rows.length ? newRow : updated.rows.length - 1,
        col: selectedCell.col < updated.columns.length ? selectedCell.col : updated.columns.length - 1,
      });
    }, 0);
  };

  const removeSelectedColumn = (index) => {
    if (confirmedData.columns.length <= 1) return;

    const updated = structuredClone(confirmedData);
    updated.columns.splice(index, 1);
    updated.rows.forEach((row) => row.cells.splice(index, 1));

    updateConfirmedData(updated);

    setTimeout(() => {
      const newCol = index > 0 ? index - 1 : 0;
      setSelectedCell({
        row: selectedCell.row < updated.rows.length ? selectedCell.row : updated.rows.length - 1,
        col: newCol < updated.columns.length ? newCol : updated.columns.length - 1,
      });
    }, 0);
  };

  // Undo/Redo functionality
  const updateConfirmedData = (newData) => {
    setConfirmedData(newData);
  };

  const undo = () => {
    if (undoStack.length === 0) return;
    const prev = undoStack[undoStack.length - 1];
    setUndoStack((prevStack) => prevStack.slice(0, -1));
    setRedoStack((prevStack) => [...prevStack, structuredClone(confirmedData)]);
    setConfirmedData(prev);
  };

  const redo = () => {
    if (redoStack.length === 0) return;
    const next = redoStack[redoStack.length - 1];
    setRedoStack((prevStack) => prevStack.slice(0, -1));
    setUndoStack((prevStack) => [...prevStack, structuredClone(confirmedData)]);
    setConfirmedData(next);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 sm:p-8 font-inter relative">
      <LoadingPopUp show={isLoading} />

      {isAlertVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <DefaultError
            title={alertConfig.title}
            message={alertConfig.message}
            buttonText={alertConfig.buttonText}
            onButtonClick={hideAlert}
            isVisible={isAlertVisible}
          />
        </div>
      )}

      <EditDataStepper />
      <form onSubmit={handleNext}>
        <div className="bg-blue-50 rounded-2xl shadow-lg px-4 sm:px-6 md:px-8 py-6 w-full max-w-7xl">
          <div className="flex flex-col md:flex-row items-center gap-1 w-full">
            <div className="w-full bg-white rounded-xl p-4 sm:p-6 shadow-lg">
              <h2 className="font-semibold text-center">Edit Data</h2>
              <p className="text-md text-gray-600 text-center mb-4">
                Click on a cell to modify its value, add/remove rows or columns as needed.
              </p>

              {confirmedData && (
                <>
                  <div className="flex justify-center gap-2 mb-4">
                    <button
                      type="button"
                      onClick={undo}
                      className="p-1.5 rounded-md bg-white border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={undoStack.length === 0}
                    >
                      <Undo size={18} />
                    </button>
                    <button
                      type="button"
                      onClick={redo}
                      className="p-1.5 rounded-md bg-white border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={redoStack.length === 0}
                    >
                      <Redo size={18} />
                    </button>
                  </div>

                  <div ref={tableRef} className="overflow-auto border max-w-full max-h-[400px]">
                    <table className="w-full min-w-max border border-gray-300">
                      <thead>
                        <tr>
                          {confirmedData.columns.map((col, colIdx) => (
                            <th key={colIdx} className="border px-3 py-2 bg-gray-100">
                              <input
                                value={col}
                                onFocus={() => {
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
                                className="w-full font-semibold"
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

                                    if (hoveredAction === "rowAbove" || hoveredAction === "rowBelow") {
                                      return isRow ? "bg-blue-100" : "";
                                    }
                                    if (hoveredAction === "removeRow") {
                                      return isRow ? "bg-red-100" : "";
                                    }
                                    if (hoveredAction === "colLeft" || hoveredAction === "colRight") {
                                      return isCol ? "bg-blue-100" : "";
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
                                      snapshot: structuredClone(confirmedData) // save full table before editing
                                    });
                                    setSelectedCell({ row: rowIdx, col: colIdx });
                                  }}
                                  onChange={(e) => {
                                    const updated = structuredClone(confirmedData);
                                    updated.rows[rowIdx].cells[colIdx] = e.target.value;
                                    updateConfirmedData(updated); // Don't push to undo yet
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
                  <div className="flex flex-wrap justify-center gap-4 mt-4 mb-4 mr-4 ml-4">
                    <button
                      type="button"
                      onMouseEnter={() => setHoveredAction("rowAbove")}
                      onMouseLeave={() => setHoveredAction(null)}
                      onMouseDown={() => {
                        if (selectedCell) insertRowAbove(selectedCell.row);
                      }}
                      disabled={!selectedCell}
                      className={`btn-icon`}
                    >
                      <Plus size={10} className="mr-1" />
                      Row Above
                    </button>

                    <button
                      type="button"
                      onMouseEnter={() => setHoveredAction("rowBelow")}
                      onMouseLeave={() => setHoveredAction(null)}
                      onMouseDown={() => {
                        if (selectedCell) insertRowBelow(selectedCell.row);
                      }}
                      disabled={!selectedCell}
                      className={`btn-icon`}
                    >
                      <Plus size={10} className="mr-1" />
                      Row Below
                    </button>

                    <button
                      type="button"
                      onMouseEnter={() => setHoveredAction("colLeft")}
                      onMouseLeave={() => setHoveredAction(null)}
                      onMouseDown={() => {
                        if (selectedCell) insertColumnLeft(selectedCell.col);
                      }}
                      disabled={!selectedCell}
                      className={`btn-icon`}
                    >
                      <Plus size={10} className="mr-1" />
                      Col Left
                    </button>

                    <button
                      type="button"
                      onMouseEnter={() => setHoveredAction("colRight")}
                      onMouseLeave={() => setHoveredAction(null)}
                      onMouseDown={() => {
                        if (selectedCell) insertColumnRight(selectedCell.col);
                      }}
                      disabled={!selectedCell}
                      className={`btn-icon`}
                    >
                      <Plus size={10} className="mr-1" />
                      Col Right
                    </button>

                    <button
                      type="button"
                      onMouseEnter={() => setHoveredAction("removeRow")}
                      onMouseLeave={() => setHoveredAction(null)}
                      onMouseDown={() => {
                        if (selectedCell) removeSelectedRow(selectedCell.row);
                      }}
                      disabled={!selectedCell}
                      className={`btn-icon`}
                    >
                      <Trash size={10} className="mr-1" />
                      Row
                    </button>

                    <button
                      type="button"
                      onMouseEnter={() => setHoveredAction("removeCol")}
                      onMouseLeave={() => setHoveredAction(null)}
                      onMouseDown={() => {
                        if (selectedCell) removeSelectedColumn(selectedCell.col);
                      }}
                      disabled={!selectedCell}
                      className={`btn-icon`}
                    >
                      <Trash size={10} className="mr-1" />
                      Col
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-between mt-10 flex-wrap gap-4">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="primary-button flex items-center justify-center px-6 py-3 rounded-md text-blue-600 font-medium transition-colors hover:bg-gray-100"
          >
            <ChevronLeft size={25} className="mr-2" />
            Go to the last step
          </button>

          <button
            type="button"
            className="primary-button flex items-center justify-center px-6 py-3 rounded-md text-blue-600 font-medium transition-colors hover:bg-gray-100"
            onClick={() => setConfirmedData(structuredClone(originalData))}
          >
            <RotateCw size={20} className="mr-2" />
            Restore original data
          </button>

          <button
            type="submit"
            className="primary-button flex items-center justify-center px-6 py-3 rounded-md text-blue-600 font-medium transition-colors hover:bg-gray-100"
          >
            Go to the next step
            <ChevronRight size={25} className="ml-2" />
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditData;