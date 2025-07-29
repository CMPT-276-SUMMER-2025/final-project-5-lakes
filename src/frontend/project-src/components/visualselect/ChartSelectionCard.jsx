// src/components/visualselect/ChartSelectionCard.jsx
import { useNavigate } from "react-router-dom";

const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/visual-selected`;

const ChartSelectionCard = ({ id, chartImageUrl, title, description, buttonText = "Select Option" }) => {
  const navigate = useNavigate();

  const handleSelectOption = () => {
    fetch(apiUrl, {
      method: "POST",
      body: JSON.stringify({
        id: id
      }),
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      navigate("/edit-chart", { state: data });
    })
    .catch(error => {
      console.error("Error selecting option:", error);
    });
  }


  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
    
      <div
        className="h-48 bg-gray-100 bg-cover bg-center"
        style={{ backgroundImage: `url(${chartImageUrl || 'https://via.placeholder.com/400x250?text=Chart+Visual'})` }}
      />

      
      <div className="p-5 flex flex-col flex-grow justify-between">
        <div>
          <h3 className="text-xl text-gray-800 mb-2">{title}</h3>
          <p className="text-gray-600 text-sm line-clamp-3">{description}</p>
        </div>


        <div className="mt-4 text-right">
          <button onClick={handleSelectOption} className="px-4 py-2 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700 transition">
            {buttonText}
          </button>
        </div>


      </div>
    </div>
  );
};

export default ChartSelectionCard;