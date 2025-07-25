import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import DataConfirmStepper from "../components/dataconfirm/DataConfirmStepper";
import EditableTanStackTable from "../components/dataconfirm/EditableTanStackTable";
import ViewUpload from "../components/dataconfirm/ViewUpload";
import AdditionalInfo from "../components/dataconfirm/AdditionalInfo";
import DataConfirmButtons from "../components/dataconfirm/DataConfirmButtons";
import LoadingPopUp from "../components/dataconfirm/LoadingPopUp";

import parseQuickChartToTableRows from "../utils/QuickToTable";
import convertTableRowsToQuickChartConfig from "../utils/TableToQuick";

function DataConfirm() {
  const [isLoading, setIsLoading] = useState(false);
  const [confirmedData, setConfirmedData] = useState([]);
  const [chartType, setChartType] = useState("bar");
  const [chartLabel, setChartLabel] = useState("Value");
  const [originalData, setOriginalData] = useState([]);

  const location = useLocation();
  const navigate = useNavigate();

  const parsedData = location.state;

  const chartConfig = convertTableRowsToQuickChartConfig(confirmedData, chartLabel, chartType);

  // fetch("/api/chart", {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify(chartConfig),
  // });

  useEffect(() => {
    const { tableRows, chartLabel, chartType } = parseQuickChartToTableRows(parsedData);

    if (tableRows.length === 0) {
      navigate("/");
    } else {
      setConfirmedData(tableRows);
      setOriginalData(tableRows); 
      setChartLabel(chartLabel);
      setChartType(chartType);
    }
  }, [parsedData, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 sm:p-8 font-inter relative">
      <LoadingPopUp show={isLoading} />

      <DataConfirmStepper />

      <div className="bg-blue-50 rounded-2xl shadow-lg px-4 sm:px-6 md:px-8 py-6 w-full">
        <div className="flex flex-col md:flex-row gap-8 w-full">
          {/* Left - Data Table */}
          <div className="flex-1 bg-white rounded-xl p-4 sm:p-6 shadow-lg">
            <div>
              <h2 className="font-semibold text-center">Edit Data</h2>
              <p className="text-md text-gray-600 text-center mb-10">
                Review and edit your uploaded data below. You can modify any field as needed.
              </p>

              {confirmedData.length > 0 && (
                <EditableTanStackTable
                  data={confirmedData}
                  onDataChange={setConfirmedData}
                />
              )}
            </div>
          </div>

          {/* Right - Main Content */}
          <div className="flex-1 bg-white rounded-xl p-4 sm:p-6 shadow-lg">
            <div className="flex flex-col gap-8">
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-center">Review Your Upload</h2>
                <p className="text-md text-gray-600 text-center mb-10">
                  Review your uploaded files and make any necessary adjustments before proceeding to the next step.
                </p>
                <ViewUpload />
                <AdditionalInfo />
              </div>
            </div>
          </div>
        </div>
      </div>

      <DataConfirmButtons
        setIsLoading={setIsLoading}
        confirmedData={confirmedData}
        setConfirmedData={setConfirmedData}
        originalData={originalData}
        chartType={chartType}
        chartLabel={chartLabel}
      />
    </div>
  );
}

export default DataConfirm;