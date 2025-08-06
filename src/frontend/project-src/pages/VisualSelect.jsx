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

  // Function to get session data and navigate back to edit-data
  const getSessionDataAndNavigateBack = async () => {
      fetch(`${import.meta.env.VITE_API_BASE_URL}/get-session-data`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include"
      })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok){
          const error = new Error(`HTTP error! status: ${response.status}`);
          throw error;
        }
        return data;
      })
      .then((data) => {
        navigate('/edit-data', {state: data, replace: true});
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
      <ProgressStepper currentStep="Choose Visual" />
      <div className="w-full max-w-6xl bg-blue-50 shadow-md rounded-xl p-6 sm:p-8">
        {/* Chart Selection Grid */}
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
        <SummaryBox summary={summary} />
      </div>
      <BackButton onClick={goPreviousPage} />
    </div>
  );
}

export default VisualSelect;