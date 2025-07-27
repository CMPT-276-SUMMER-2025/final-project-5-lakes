import { useNavigate, Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, RotateCw } from "lucide-react";
import convertTableRowsToQuickChartConfig from "../../utils/TableToQuick";

const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/reset-session`;

function DataConfirmButtons({
  setIsLoading,
  confirmedData,
  setConfirmedData,
  originalData,
  chartType,
  chartLabel,
}) {
  const navigate = useNavigate();

  const goBackHomepage = async () => {
    setIsLoading(true);

    try {
      await fetch(apiUrl, {
        method: "DELETE",
        headers: {
          'Content-Type': 'application/json',
        },
        body: "{}",
        credentials: 'include'
      });
      // 👇 pretend this came from the backend
      navigate("/");
    } catch (err) {
      console.error("Error generating mock chart:", err);
      alert("Something went wrong generating the chart.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-between mt-10 flex-wrap gap-4">
      <button
        type="button"
        onClick={goBackHomepage}
        className="white-base-button flex items-center justify-center px-6 py-3 rounded-md text-blue-600 font-medium transition-colors hover:bg-gray-100"
      >
        <ChevronLeft size={25} className="mr-2" />
        Go to the last step
      </button>

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