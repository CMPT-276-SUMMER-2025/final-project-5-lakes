import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DataConfirmStepper from "../components/dataconfirm/DataConfirmStepper";
import ViewUpload from "../components/dataconfirm/ViewUpload";
import AdditionalInfo from "../components/dataconfirm/AdditionalInfo";
import LoadingPopUp from "../components/dataconfirm/LoadingPopUp";
import { ChevronLeft, ChevronRight, RotateCw, Plus, Trash } from "lucide-react";

const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/data-confirm`;

function DataConfirm() {
  const location = useLocation();
  const navigate = useNavigate();
  const { parsedData, file } = location.state || {};

  const fileName = file?.originalname || "Unknown file";
  const fileSize = file?.size || 0;

  const [isLoading, setIsLoading] = useState(false);
  const [confirmedData, setConfirmedData] = useState(null);
  const [originalData, setOriginalData] = useState(null);

  useEffect(() => {
    if (!parsedData || !file) {
      navigate("/");
      return;
    }

    const { table } = convertDeepSeekToTable(parsedData);
    setConfirmedData(structuredClone(table));
    setOriginalData(structuredClone(table));
  }, [parsedData, file, navigate]);

  const handleNext = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formattedData = convertTableToDeepSeekFormat(confirmedData);

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

  const addRow = () => {
    const updated = structuredClone(confirmedData);
    updated.rows.push({
      header: `Row ${updated.rows.length + 1}`,
      cells: new Array(updated.columns.length).fill(""),
    });
    setConfirmedData(updated);
  };

  const removeRow = () => {
    if (confirmedData.rows.length === 0) return;
    const updated = structuredClone(confirmedData);
    updated.rows.pop();
    setConfirmedData(updated);
  };

  const addColumn = () => {
    const updated = structuredClone(confirmedData);
    updated.columns.push(`Column ${updated.columns.length + 1}`);
    updated.rows.forEach((row) => row.cells.push(""));
    setConfirmedData(updated);
  };

  const removeColumn = () => {
    if (confirmedData.columns.length === 0) return;
    const updated = structuredClone(confirmedData);
    updated.columns.pop();
    updated.rows.forEach((row) => row.cells.pop());
    setConfirmedData(updated);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 sm:p-8 font-inter relative">
      <LoadingPopUp show={isLoading} />
      <DataConfirmStepper />
      <form onSubmit={handleNext}>
        <div className="bg-blue-50 rounded-2xl shadow-lg px-4 sm:px-6 md:px-8 py-6 w-full">
          <div className="flex flex-col md:flex-row gap-8 w-full">
            {/* Left - Table */}
            <div className="flex-1 bg-white rounded-xl p-4 sm:p-6 shadow-lg">
              <h2 className="font-semibold text-center">Edit Data</h2>
              <p className="text-md text-gray-600 text-center mb-4">
                Modify values, add/remove rows or columns as needed.
              </p>

              {confirmedData && (
                <>
                  <div className="flex flex-wrap gap-2 justify-center mb-4">
                    <button type="button" onClick={addRow} className="btn-icon">
                      <Plus size={16} /> Add Row
                    </button>
                    <button type="button" onClick={removeRow} className="btn-icon">
                      <Trash size={16} /> Remove Row
                    </button>
                    <button type="button" onClick={addColumn} className="btn-icon">
                      <Plus size={16} /> Add Column
                    </button>
                    <button type="button" onClick={removeColumn} className="btn-icon">
                      <Trash size={16} /> Remove Column
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
                                  setConfirmedData(updated);
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
                                  setConfirmedData(updated);
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
                                    setConfirmedData(updated);
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
                </>
              )}
            </div>

            {/* Right - Upload Preview */}
            <div className="flex-1 bg-white rounded-xl p-4 sm:p-6 shadow-lg">
              <h2 className="text-lg font-semibold text-center">Review Your Upload</h2>
              <p className="text-md text-gray-600 text-center mb-10">
                Confirm your uploaded file and data before proceeding.
              </p>
              <ViewUpload
                fileName={fileName}
                fileSize={fileSize}
                fileContent={parsedData?.base64 || file?.url || "about:blank"}
              />
              <AdditionalInfo />
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-between mt-10 flex-wrap gap-4">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="white-base-button flex items-center justify-center px-6 py-3 rounded-md text-blue-600 font-medium transition-colors hover:bg-gray-100"
          >
            <ChevronLeft size={25} className="mr-2" />
            Go to the last step
          </button>

          <button
            type="button"
            className="white-base-button flex items-center justify-center px-6 py-3 rounded-md text-blue-600 font-medium transition-colors hover:bg-gray-100"
            onClick={() => setConfirmedData(structuredClone(originalData))}
          >
            <RotateCw size={20} className="mr-2" />
            Restore original data
          </button>

          <button
            type="submit"
            className="white-base-button flex items-center justify-center px-6 py-3 rounded-md text-blue-600 font-medium transition-colors hover:bg-gray-100"
          >
            Go to the next step
            <ChevronRight size={25} className="ml-2" />
          </button>
        </div>
      </form>
    </div>
  );
}

export default DataConfirm;

// ----------------------------
// DeepSeek Converters
// ----------------------------

function convertDeepSeekToTable(parsedData) {
  if (!Array.isArray(parsedData) || parsedData.length === 0) {
    return {
      table: {
        rowHeaderTitle: "Row",
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