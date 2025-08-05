import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ChartSelectionCard from '../components/visualselect/ChartSelectionCard';
import { ChevronLeft, ClipboardList } from 'lucide-react';
import ProgressStepper from '../components/layout/ProgressStepper';

// not connected with backend yet
// may need to change the inputs
// currently accepts an: ID, the title, the description, and the image URL

const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/visual-select`;

function VisualSelect() {
  const [chartOptions, setChartOptions] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  console.log(location.state);
  const { summary, graphRecommendation, chartsWithURLs } = location.state || {}; 

  const [isLoading, setIsLoading] = useState(false);

  // Function to get session data and navigate back to edit-data
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
      
      // Navigate back to edit-data with the retrieved data
      navigate('/edit-data', {
        state: {
          parsedData: sessionData.edittedData,
          file: sessionData.uploadedFile,
          // You can add other properties if needed
          summary: sessionData.summary,
          graphRecommendation: sessionData.graphRecommendation,
          chartsWithURLs: sessionData.chartsWithURLs
        }
      });
      
    } catch (error) {
      console.error('Error retrieving session data:', error);
      // Handle error - maybe show a notification or fallback
      alert('Failed to retrieve session data. Please try again.');
    }
  };
  const handleChartSelect = (chart) => {
    setSelectedChart(chart);

    // console.log("Selected chart:", chart);
  };

  useEffect(() => {
      setChartOptions(chartsWithURLs);
      console.log(chartOptions);
  }, []);

  const goPreviousPage = async () => {
    // Use session data retrieval instead of relying on current state
    await getSessionDataAndNavigateBack();
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-start p-6 sm:p-10 font-inter">
      {isLoading && <LoadingPopUp show={true} />}
      <div>
        <ProgressStepper currentStep="Choose Visual" />
      </div>
      
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
              onSelect={() => navigate("/edit-save", { state: { selectedChart: chart } })}
            />
          ))}
        </div>

        <div className="w-full max-w-6xl mt-10 text-left bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center mb-4">
            <ClipboardList className="text-blue-600 mr-3 mb-2" size={25} />
            <h3 className="text-xl font-semibold text-gray-800 leading-none">Data Summary</h3>
        </div>

           {summary && summary[0] ? (
             <ul className="text-gray-600 text-lg space-y-2 mt-2">
               {summary.map((item, index) => (
                 <li key={index} className="flex items-start">
                   <span className="text-blue-600 mr-3 mt-1">•</span>
                   <span>{item}</span>
                 </li>
               ))}
             </ul>
           ) : (
                         <p className="text-gray-600 text-lg">
              {(summary && summary[0]) || 'No summary available'}
            </p>
           )}
         </div>

        {/* <div className="w-full max-w-6xl mt-6 mb-6 text-left">
          <p className="text-gray-600 text-lg line-clamp-3">
            {graphRecommendation[0] || 'No recommendation available'}
          </p>
        </div> */}
      </div>
      <div className="w-full max-w-6xl mt-6 mb-6 text-center">
          <button onClick={goPreviousPage}
            className="primary-button flex items-center justify-center px-6 py-3 rounded-md text-blue-600 font-medium transition-colors hover:bg-gray-100">
            <ChevronLeft size={18} className="mr-1" />
            Go to the last step
          </button>
        </div>
    </div>
  );
}

export default VisualSelect;
