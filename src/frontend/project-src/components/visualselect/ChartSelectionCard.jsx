// ChartSelectionCard displays a preview of a chart option with a title, description, and selection button.
// When selected, it sends the chart ID to the backend and navigates the user to the editing page with the returned configuration.

import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/visual-selected`;

const ChartSelectionCard = ({ id, chartImageUrl, title, description, buttonText = "Select Option" }) => {
  const navigate = useNavigate(); 
  const location = useLocation(); 

  const handleSelectOption = () => {
    fetch(apiUrl, {
      method: "POST",
      body: JSON.stringify({ id: id }), 
      headers: { "Content-Type": "application/json" }
    })
    .then(async (response) => {
      const data = await response.json();
      if (!response.ok) {
        const error = new Error(data.error || 'Something went wrong');
        error.code = data.code || '';
        error.status = response.status || 500;
        throw error;
      }
      return data; 
    })
    .then(data => {
      navigate("/edit-save", { state: data });
    })
    .catch(error => {
      alert(`${error.message}\nPlease try again.`);
    });
  }

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      
      {/* Chart preview image */}
      <img 
        className="h-48 bg-cover bg-center w-full" 
        src={chartImageUrl} 
        alt={title} 
      />

      {/* Content container */}
      <div className="p-5 flex flex-col flex-grow justify-between">
        
        {/* Chart title and description */}
        <div>
          <h3 className="text-xl text-gray-800 mb-2">{title}</h3>
          <p className="text-gray-600 text-sm line-clamp-3">{description}</p>
        </div>

        {/* Select button */}
        <div className="mt-4 text-right">
          <button 
            onClick={handleSelectOption} 
            className="cursor-pointer px-4 py-2 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            {buttonText}
          </button>
        </div>

      </div>
    </div>
  );
};

export default ChartSelectionCard;