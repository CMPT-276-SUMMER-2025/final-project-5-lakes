// src/components/EditSaveButtons.jsx
import { ChevronLeft, CirclePlus } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/edit-selected`;

function EditSaveButtons() {
  const navigate = useNavigate();

  const getSessionDataAndNavigateBack = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/get-session-data`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies for session management
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const sessionData = await response.json();
      console.log('Retrieved session data:', sessionData);
      
      // Navigate back to data-confirm with the retrieved data
      navigate('/visual-select', {
        state: {
          // You can add other properties if needed
          summary: JSON.parse(sessionData.summary),
          graphRecommendation: sessionData.graphRecommendation,
          chartsWithURLs: sessionData.chartOptions,
          chartConfig: sessionData.chartConfig
        }
      });
      
    } catch (error) {
      console.error('Error retrieving session data:', error);
      // Handle error - maybe show a notification or fallback
      alert('Failed to retrieve session data. Please try again.');
    }
  };

  const goPreviousPage = async () => {
      // Use session data retrieval instead of relying on current state
      await getSessionDataAndNavigateBack();
  }

  const goBackHomepage = async () => {
    try {
      await fetch(apiUrl, {
        method: "DELETE",
        headers: {
          'Content-Type': 'application/json',
        },
        body: "{}",
        credentials: 'include'
      });
      navigate("/"); // back to homepage
    } catch (err) {
      console.error("Error resetting chart state:", err);
      alert("Something went wrong while resetting.");
    }
  };

  return (
    <div className="flex justify-between mt-10 flex-wrap gap-4">
      <button
        onClick={goPreviousPage}
        className="white-base-button flex items-center justify-center px-6 py-3 rounded-md text-blue-600 font-medium transition-colors hover:bg-gray-100"
      >
        <ChevronLeft size={25} className="mr-2" />
        Go to last step
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