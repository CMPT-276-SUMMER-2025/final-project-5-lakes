import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ChartSelectionCard from '../components/visualselect/ChartSelectionCard';
import { ChevronLeft } from 'lucide-react';
import VisualSelectStepper from '../components/visualselect/VisualSelectStepper';

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

  useEffect(() => {
    // fetch(apiUrl, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({ id: 1 })
    //   })
    //   .then(response => response.json())
    //   .then(data => {
    //     console.log('chartOptions from API:', data);
    //     setChartOptions(data);
    //   })
    //   .catch(error => {
    //     console.error('could not get chart options', error);
    //     setChartOptions([
    //       { id: 1, title: "Sample Bar Chart", description: "Will add the AI summary description here." },
    //       { id: 2, title: "Sample Line Chart", description: "Will add the AI summary description here." },
    //       { id: 3, title: "Sample Pie Chart", description: "Will add the AI summary description here." }
    //     ]);
    //   });
      setChartOptions(chartsWithURLs);
      console.log(chartOptions);
  }, []);

  const goPreviousPage = async () => {
    navigate("/data-confirm", { state: { 
      summary: summary,
      graphRecommendation: graphRecommendation,
      parsedData: parsedData,
      file: file
    } });
  }

  console.log(summary);
  console.log(graphRecommendation);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-start p-6 sm:p-10 font-inter">
      
      <div>
        <VisualSelectStepper />
      </div>


      
      <div className="w-full max-w-6xl bg-blue-50 shadow-md rounded-xl p-6 sm:p-8">
        
        
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {chartOptions.map((chart, index) => (
            <ChartSelectionCard
              key={chart.id}
              id={chart.id}
              title={chart.title}
              description={chart.description}
              chartImageUrl={chart.imageUrl}
              buttonText="Select"
            />
          ))}
        </div>

        <div className="w-full max-w-6xl mt-6 mb-6 text-left">
           <h3 className="text-lg font-semibold">Summary</h3>
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
               {summary[0] || 'No summary available'}
             </p>
           )}
         </div>

        {/* <div className="w-full max-w-6xl mt-6 mb-6 text-left">
          <p className="text-gray-600 text-lg line-clamp-3">
            {graphRecommendation[0] || 'No recommendation available'}
          </p>
        </div> */}
        <div className="w-full max-w-6xl mt-6 mb-6 text-left">
          <button onClick={goPreviousPage}
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
