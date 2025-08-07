// This is the page for step 3 of the chart making process
// Allows users to choose a chart type based on the data extracted in previous steps.
// Displays chart previews generated with placeholder data, along with a summary of extracted information.
// On selection, navigates to the "edit-save" page with the chosen chart.
// Includes a back button to return to the "edit-data" step using stored session data.

import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import ChartSelectionCard from "../components/visualselect/ChartSelectionCard";
import ProgressStepper from "../components/layout/ProgressStepper";
import SummaryBox from "../components/visualselect/SummaryBox";
import BackButton from "../components/visualselect/BackButton";

function VisualSelect() {
  const navigate = useNavigate();
  const location = useLocation();
  const { summary, chartsWithURLs } = location.state || {};

  const [chartOptions, setChartOptions] = useState([]);

  // Fetch session data and navigate back to edit-data page
  const getSessionDataAndNavigateBack = async () => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/get-session-data`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include"
    })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) {
          const error = new Error(`HTTP error! status: ${response.status}`);
          throw error;
        }
        return data;
      })
      .then((data) => {
        navigate('/edit-data', { state: data, replace: true });
      })
      .catch((error) => {
        alert(error.message, "Please try again.");
      });
  };

  const handleChartSelect = (chart) => {
    navigate("/edit-save", { state: { selectedChart: chart } });
  };

  const goPreviousPage = async () => {
    await getSessionDataAndNavigateBack();
  };

  useEffect(() => {
    setChartOptions(chartsWithURLs);
  }, [chartsWithURLs]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-start p-6 sm:p-10 font-inter">
      {/* Progress stepper showing user is on the "Choose Visual" step */}
      <ProgressStepper currentStep="Choose Visual" />

      {/* Chart selection area */}
      <div className="w-full max-w-6xl bg-blue-50 shadow-md rounded-xl p-6 sm:p-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {chartOptions.map((chart) => (
            <ChartSelectionCard
              key={chart.id}
              id={chart.id}
              title={chart.title}
              description={`${chart.description} (This chart is generated using dummy data)`}
              chartImageUrl={chart.imageUrl}
              buttonText="Select"
              onSelect={() => handleChartSelect(chart)}
            />
          ))}
        </div>

        {/* Summary of extracted data */}
        <SummaryBox summary={summary} />
      </div>

      {/* Navigation button to go back to edit-data step */}
      <BackButton onClick={goPreviousPage} />
    </div>
  );
}

export default VisualSelect;