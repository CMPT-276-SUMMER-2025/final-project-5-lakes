import { ChevronLeft } from "lucide-react";

function BackButton({ onClick }) {
  return (
    <div className="w-full max-w-6xl mt-6 mb-6 text-center">
      <button
        onClick={onClick}
        className="primary-button flex items-center justify-center px-6 py-3 rounded-md text-blue-600 font-medium transition-colors hover:bg-gray-100"
      >
        <ChevronLeft size={18} className="mr-1" />
        Go to the last step
      </button>
    </div>
  );
}

export default BackButton;