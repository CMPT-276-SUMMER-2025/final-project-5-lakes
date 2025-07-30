// src/components/EditSaveButtons.jsx
import { ChevronLeft, CirclePlus } from 'lucide-react';
import { useNavigate } from "react-router-dom";

const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/edit-selected`;

function EditSaveButtons() {
  const navigate = useNavigate();

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

  const goBackToLastStep = () => {
    navigate("/visual-select"); // back to visual selection
  };

  return (
    <div className="flex justify-between mt-10 flex-wrap gap-4">
      <button
        onClick={goBackToLastStep}
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