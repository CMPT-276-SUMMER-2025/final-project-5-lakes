// This is page 2, where users can edit the extracted table data before generating charts.
// It features an interactive table with editable cells, undo/redo functionality, and options to add/remove rows/columns.

import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useRef } from "react";
import LoadingPopUp from "../components/editdata/LoadingPopUp";
import convertDeepSeekToTable from "../utils/DeepSeekToTable";
import convertTableToDeepSeekFormat from "../utils/TableToDeepSeek";
import NavButtons from "../components/editdata/NavButtons";
import DefaultError from '../components/messages/DefaultError';
import useDefaultError from '../hooks/DefaultErrorHook';
import InfoPopUp from '../components/messages/InfoPopUp';
import ProgressStepper from "../components/layout/ProgressStepper";
import TableButtons from "../components/editdata/TableButtons";
import UndoRedoButtons from "../components/editdata/UndoRedoButtons";
import EditableTable from "../components/editdata/EditableTable";

const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/edit-data`;

function EditData() {

  const location = useLocation();
  const navigate = useNavigate();

  const { parsedData, edittedData } = location.state || {};
  const { isAlertVisible, alertConfig, showAlert, hideAlert } = useDefaultError();

  const [isLoading, setIsLoading] = useState(false);
  const [confirmedData, setConfirmedData] = useState(null);
  const [originalData, setOriginalData] = useState(null);

  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);

  const [selectedCell, setSelectedCell] = useState(null); 

  const [editHistory, setEditHistory] = useState([null]);
  const [colEditHistory, setColEditHistory] = useState([null]);

  const [showInfoPopUp, setShowInfoPopUp] = useState(true);
  const [hoveredAction, setHoveredAction] = useState(null);

  const tableRef = useRef(null);

  // Initialize confirmedData and originalData from parsedData
  useEffect(() => {
    const {table: originalTable}  = convertDeepSeekToTable(parsedData);
    const {table: currentTable}  = convertDeepSeekToTable(edittedData);

    setConfirmedData(structuredClone(currentTable));
    setUndoStack([structuredClone(currentTable)]);
    setOriginalData(structuredClone(originalTable));
  }, [parsedData, edittedData, navigate]);

  // Deselect cell when clicking outside the table
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (tableRef.current && !tableRef.current.contains(event.target)) {
        setSelectedCell(null); 
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

    fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          edittedData: formattedData
        }),
        credentials: "include",
      })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) {
          const error = new Error(data.error || "Something went wrong");
          error.code = data.code || "";
          error.status = response.status || 500;
          throw error;
        }
        return data;
      })
      .then((data) => {
        navigate("/visual-select", { state: data, replace: true });
      })
      .catch((error) => {
      if (error.code === "INVALID_EDITED_TABLE") {
        showAlert(
          "error",
          "Editing Failed",
          `We could not generate the chart: ${error.message}`,
          "Okay"
        );
      } else {
        showAlert(
          "error",
          "Generation Failed",
          `We could not generate the chart: ${error.message} Please try again later.`,
          "Okay"
        );
      }
    })
    .finally(() => {
      setIsLoading(false);
    });
  };

  // Insert row functions
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

  // Insert column functions
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

  // Remove row/column functions
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

  // Undo/Redo functionalities
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

  const handleInfoPopUpClick = () => {
    setShowInfoPopUp(false);
  };

  const redo = () => {
    if (redoStack.length === 0) return;
    const next = redoStack[redoStack.length - 1];
    setRedoStack((prevStack) => prevStack.slice(0, -1));
    setUndoStack((prevStack) => [...prevStack, structuredClone(confirmedData)]);
    setConfirmedData(next);
  };

  // Main render
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 sm:p-8 font-inter relative">
      {/* Info pop-up */}
      {showInfoPopUp && (
        <div className="absolute center right-20 z-50">
          <InfoPopUp
            title="Additional Information"
            message={
              <>
                Here is all the data extracted from your upload. Please review and remove any information you don't want included in the graphs.<br /><br />
                <span className="text-sm">
                  (Note: If your titles have a number suffix (e.g., #1, #2), each number represents a unique dataset.)
                </span>
              </>
            }
            onButtonClick={handleInfoPopUpClick}
          />
        </div>
      )}
      {/* Loading pop-up setup */}
      <LoadingPopUp show={isLoading} />

      {/* Alert pop-up setup */}
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

      {/* Progress stepper */}
      <ProgressStepper currentStep="Edit Data" />
      {/* Editable table form */}
      <form onSubmit={handleNext}>
        <div className="bg-blue-50 rounded-2xl shadow-lg px-4 sm:px-6 md:px-8 py-6 w-full max-w-7xl">
          <div className="flex flex-col md:flex-row items-center gap-1 w-full">
            <div className="w-full bg-white rounded-xl p-4 sm:p-6 shadow-lg">
              {/* Editable table header */}
              <h2 className="font-semibold text-center">Edit Data</h2>
              <p className="text-md text-gray-600 text-center mb-4">
                Click on a cell to modify its value, add/remove rows or columns as needed.
              </p>
              {confirmedData && (
                <>
                  {/* Undo/Redo buttons */}
                  <UndoRedoButtons
                    undo={undo}
                    redo={redo}
                    undoDisabled={undoStack.length === 0}
                    redoDisabled={redoStack.length === 0}
                  />
                  {/* Editable table and action buttons */}
                  <EditableTable
                    tableRef={tableRef}
                    confirmedData={confirmedData}
                    selectedCell={selectedCell}
                    setSelectedCell={setSelectedCell}
                    editHistory={editHistory}
                    setEditHistory={setEditHistory}
                    colEditHistory={colEditHistory}
                    setColEditHistory={setColEditHistory}
                    hoveredAction={hoveredAction}
                    updateConfirmedData={updateConfirmedData}
                    setUndoStack={setUndoStack}
                    setRedoStack={setRedoStack}
                  />
                  <TableButtons
                    selectedCell={selectedCell}
                    insertRowAbove={insertRowAbove}
                    insertRowBelow={insertRowBelow}
                    insertColumnLeft={insertColumnLeft}
                    insertColumnRight={insertColumnRight}
                    removeSelectedRow={removeSelectedRow}
                    removeSelectedColumn={removeSelectedColumn}
                    setHoveredAction={setHoveredAction}
                  />
                </>
              )}
            </div>
          </div>
        </div>

        {/* Navigation buttons */}
        <NavButtons
          onBack={() => navigate("/")}
          onRestore={() => setConfirmedData(structuredClone(originalData))}
          onNext={handleNext}
        />
      </form>
    </div>
  );
}

export default EditData;