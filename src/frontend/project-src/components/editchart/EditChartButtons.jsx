import { ChevronLeft, CirclePlus } from 'lucide-react';
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";


const goBackHomepage = async () => {  // this is a function to go back to the homepage
    // setIsLoading(true);
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
      // setIsLoading(false);
    }
};

const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/edit-selected`;

function EditSaveButtons() {
    const location = useLocation();
    const { chartConfig } = location.state || {};
    console.log(chartConfig);

    const editConfig = {
        chartConfig: chartConfig,
        chartType: chartConfig.chartType,
        chartLabel: chartConfig.chartLabel,
        chartData: chartConfig.chartData,
        chartOptions: chartConfig.chartOptions,
        chartStyle: chartConfig.chartStyle,
        chartTheme: chartConfig.chartTheme,
    };

    const handleGoToLastStep = async () => {
        fetch(apiUrl, {
            method: "POST",
            body: JSON.stringify(editConfig),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(response => response.json())
        .then(data => {
            console.log(data);
            navigate("/export", { state: data });
        })
        .catch(error => {
            console.error("Error editing chart:", error);   
        });
    }


    return (
        <div className="flex justify-between mt-10 flex-wrap gap-4">
            {/* Buttons */}
            <button
                onClick={handleGoToLastStep}
                className="white-base-button flex items-center justify-center px-6 py-3 rounded-md text-blue-600 font-medium transition-colors hover:bg-gray-100"
            >
                <ChevronLeft size={25} className="mr-2" />
                Go to the last step
            </button>
            
            <button
                onClick={goBackHomepage}
                className="white-base-button flex items-center justify-center px-6 py-3 rounded-md text-blue-600 font-medium transition-colors hover:bg-gray-100"
            >
                <CirclePlus size={25} className="mr-3" />
                Create another chart
            </button>
        </div>
    );
}

export default EditSaveButtons;