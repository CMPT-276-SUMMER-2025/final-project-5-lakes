import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ChartSelectionCard from '../components/visualselect/ChartSelectionCard';
import { ChevronLeft } from 'lucide-react';
import VisualSelectStepper from '../components/visualselect/VisualSelectStepper';

// not connected with backend yet
// may need to change the inputs
// currently accepts an: ID, the title, the description, and the image URL

function VisualSelect() {
  const [chartOptions, setChartOptions] = useState([]);
  const navigate = useNavigate();
  const { chartsConfig } = location.state || {}; 

  useEffect(() => {
    fetch('/api/visualization-options')
      .then(response => response.json())
      .then(data => setChartOptions(data))
      .catch(error => {
        console.error('could not get chart options', error);
        setChartOptions([
          { id: 1, title: "Sample Bar Chart", description: "Will add the AI summary description here." },
          { id: 2, title: "Sample Line Chart", description: "Will add the AI summary description here." },
          { id: 3, title: "Sample Pie Chart", description: "Will add the AI summary description here." }
        ]);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-start p-6 sm:p-10 font-inter">
      
      <div>
        <VisualSelectStepper />
      </div>


      
      <div className="w-full max-w-6xl bg-blue-50 shadow-md rounded-xl p-6 sm:p-8">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {chartOptions.map((chart) => (
            <ChartSelectionCard
              key={chart.id}
              title={chart.title}
              description={chart.description}
              chartImageUrl={chart.imageUrl}
              buttonText="Select"
            />
          ))}
        </div>



      <div className="w-full max-w-6xl mt-6 mb-6 text-left">
        <button onClick={() => navigate("/data-confirm")}
          className="white-base-button flex items-center justify-center px-6 py-3 rounded-md text-blue-600 font-medium transition-colors hover:bg-gray-100">
          <ChevronLeft size={18} className="mr-1" />
          Back
        </button>
      </div>

      </div>
    </div>
  );
}

export default VisualSelect;
