import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import EditDataStepper from "../components/editdata/EditDataStepper";
import LoadingPopUp from "../components/editdata/LoadingPopUp";
import convertDeepSeekToTable from "../utils/DeepSeekToTable";
import convertTableToDeepSeekFormat from "../utils/TableToDeepSeek";
import { ChevronLeft, ChevronRight, RotateCw, Plus, Trash } from "lucide-react";

const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/edit-data`;

function EditData() {

  const location = useLocation();
  const navigate = useNavigate();
  const { parsedData, file, summary, graphRecommendation, chartsWithURLs } = location.state || {};

  // const fileName = file?.originalname || "Unknown file";
  // const fileSize = file?.size || 0;

  console.log("file:", file);
  console.log("parsedData:", parsedData);

  const [isLoading, setIsLoading] = useState(false);
  const [confirmedData, setConfirmedData] = useState(null);
  const [originalData, setOriginalData] = useState(null);

  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);

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

  // Handle form submission
  const handleNext = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formattedData = convertTableToDeepSeekFormat(confirmedData);

      if (summary && graphRecommendation && chartsWithURLs) {
        navigate("/visual-select", { state: { summary: summary, graphRecommendation: graphRecommendation, parsedData: parsedData, file: file, chartsWithURLs:  chartsWithURLs } });
        setIsLoading(false);
        return;
      }

      // Take in data from backend
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          edittedData: formattedData,
          parsedData: parsedData,
          file: file
        }),
        credentials: "include",
      });

      if (!res.ok) throw new Error("Chart generation failed");
      const data = await res.json();
      navigate("/visual-select", { state: data });
    } catch (err) {
      console.error(err);
      alert("Chart generation failed. Please try again.");
    } finally {
      setIsLoading(false);
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

  // Undo/Redo functionality
  const updateConfirmedData = (newData) => {
    setUndoStack((prev) => [...prev, structuredClone(confirmedData)]);
    setRedoStack([]); // clear redo on new action
    updateConfirmedData(updated);
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
      <EditDataStepper />
      <form onSubmit={handleNext}>
        <div className="bg-blue-50 rounded-2xl shadow-lg px-4 sm:px-6 md:px-8 py-6 w-full">
          <div className="flex flex-col md:flex-row items-center gap-1 w-full max-w-7xl mx-auto">
            <div className="flex-1 bg-white rounded-xl p-4 sm:p-6 shadow-lg">
              <h2 className="font-semibold text-center">Confirm Data</h2>
              <p className="text-md text-gray-600 text-center mb-4">
                Modify values, add/remove rows or columns as needed.
              </p>

              {confirmedData && (
                <>
                  <div className="flex flex-wrap justify-between gap-y-4 w-full max-w-xl mx-auto mb-4">
                    <button type="button" onClick={addRow} className="btn-icon">
                      <Plus />
                      <span>Add Row</span>
                    </button>

                    <button type="button" onClick={addColumn} className="btn-icon">
                      <Plus />
                      <span>Add Column</span>
                    </button>

                    <button type="button" onClick={removeRow} className="btn-icon">
                      <Trash />
                      <span>Remove Row</span>
                    </button>

                    <button type="button" onClick={removeColumn} className="btn-icon">
                      <Trash />
                      <span>Remove Column</span>
                    </button>
                  </div>

                  <div className="overflow-auto border">
                    <table className="min-w-full border border-gray-300">
                      <thead>
                        <tr>
                          <th className="border px-3 py-2 bg-gray-100 text-left">
                            Row
                          </th>
                          {confirmedData.columns.map((col, i) => (
                            <th key={i} className="border px-3 py-2 bg-gray-100">
                              <input
                                value={col}
                                onChange={(e) => {
                                  const updated = structuredClone(confirmedData);
                                  updated.columns[i] = e.target.value;
                                  updateConfirmedData(updated);
                                }}
                                className="w-full"
                              />
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {confirmedData.rows.map((row, rowIdx) => (
                          <tr key={rowIdx}>
                            <td className="border px-3 py-2 bg-gray-50">
                              <input
                                value={row.header}
                                onChange={(e) => {
                                  const updated = structuredClone(confirmedData);
                                  updated.rows[rowIdx].header = e.target.value;
                                  updateConfirmedData(updated);
                                }}
                                className="w-full"
                              />
                            </td>
                            {row.cells.map((cell, colIdx) => (
                              <td key={colIdx} className="border px-3 py-2">
                                <input
                                  value={cell}
                                  onChange={(e) => {
                                    const updated = structuredClone(confirmedData);
                                    updated.rows[rowIdx].cells[colIdx] = e.target.value;
                                    updateConfirmedData(updated);
                                  }}
                                  className="w-full"
                                />
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {/* <div className="flex justify-center mt-4">
                      <ViewUpload
                        fileName={fileName}
                        fileSize={fileSize}
                        fileContent={parsedData?.base64 || file?.url || "about:blank"}
                      />
                  </div> */}
                  <button
                    type="button"
                    onClick={undo}
                    className="bottom-button flex items-center justify-center px-6 py-3 rounded-md text-blue-600 font-medium transition-colors hover:bg-gray-100 disabled:opacity-50"
                    disabled={undoStack.length === 0}
                  >
                    Undo
                  </button>

                  <button
                    type="button"
                    onClick={redo}
                    className="bottom-button flex items-center justify-center px-6 py-3 rounded-md text-blue-600 font-medium transition-colors hover:bg-gray-100 disabled:opacity-50"
                    disabled={redoStack.length === 0}
                  >
                    Redo
                  </button>
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
            className="bottom-button flex items-center justify-center px-6 py-3 rounded-md text-blue-600 font-medium transition-colors hover:bg-gray-100"
          >
            <ChevronLeft size={25} className="mr-2" />
            Go to the last step
          </button>

          <button
            type="button"
            className="bottom-button flex items-center justify-center px-6 py-3 rounded-md text-blue-600 font-medium transition-colors hover:bg-gray-100"
            onClick={() => setConfirmedData(structuredClone(originalData))}
          >
            <RotateCw size={20} className="mr-2" />
            Restore original data
          </button>

          <button
            type="submit"
            className="bottom-button flex items-center justify-center px-6 py-3 rounded-md text-blue-600 font-medium transition-colors hover:bg-gray-100"
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