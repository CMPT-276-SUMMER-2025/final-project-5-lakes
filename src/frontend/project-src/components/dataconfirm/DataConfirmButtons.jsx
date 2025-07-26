import { useNavigate, Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, RotateCw } from "lucide-react";
import convertTableRowsToQuickChartConfig from "../../utils/TableToQuick";

function DataConfirmButtons({
  setIsLoading,
  confirmedData,
  setConfirmedData,
  originalData,
  chartType,
  chartLabel,
}) {
  const navigate = useNavigate();

    // const handleNext = async () => {
    //   setIsLoading(true);

    //   try {
    //     const config = convertTableRowsToQuickChartConfig(
    //       confirmedData,
    //       chartLabel,
    //       chartType
    //     );

    //     const chartUrl = `https://quickchart.io/chart?c=${encodeURIComponent(
    //       JSON.stringify(config)
    //     )}`;

    //     // 👇 pretend this came from the backend
    //     navigate("/visual-select", { state: { chartUrl } });
    //   } catch (err) {
    //     console.error("Error generating mock chart:", err);
    //     alert("Something went wrong generating the chart.");
    //   } finally {
    //     setIsLoading(false);
    //   }
    // };

  return (
    <div className="flex justify-between mt-10 flex-wrap gap-4">
      <Link
        to="/"
        className="white-base-button flex items-center justify-center px-6 py-3 rounded-md text-blue-600 font-medium transition-colors hover:bg-gray-100"
      >
        <ChevronLeft size={25} className="mr-2" />
        Go to the last step
      </Link>

      <button
        className="white-base-button flex items-center justify-center px-6 py-3 rounded-md text-blue-600 font-medium transition-colors hover:bg-gray-100"
        onClick={() => {
          setConfirmedData(originalData);
        }}
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
  );
}

export default DataConfirmButtons;