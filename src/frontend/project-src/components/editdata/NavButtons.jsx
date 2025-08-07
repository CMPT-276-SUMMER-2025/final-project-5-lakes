// Renders three navigation buttons for going back, restoring data, and proceeding to the next step


import { ChevronLeft, ChevronRight, RotateCw } from "lucide-react";

function NavButtons({ onBack, onRestore, onNext }) {
  return (
    // Container with spacing and wrap support for responsiveness
    <div className="flex justify-between mt-10 flex-wrap gap-4">

      {/* Back button — go back to previous step */}
      <button
        type="button"
        onClick={onBack}
        className="primary-button flex items-center justify-center px-6 py-3 rounded-md text-blue-600 font-medium transition-colors hover:bg-gray-100"
      >
        <ChevronLeft size={25} className="mr-2" />
        Use different data
      </button>

      {/* Restore button — resets table to original parsed data */}
      <button
        type="button"
        onClick={onRestore}
        className="primary-button flex items-center justify-center px-6 py-3 rounded-md text-blue-600 font-medium transition-colors hover:bg-gray-100"
      >
        <RotateCw size={20} className="mr-2" />
        Restore original data
      </button>

      {/* Next button — submits the current table and moves to the next step */}
      <button
        type="submit"
        onClick={onNext}
        className="primary-button flex items-center justify-center px-6 py-3 rounded-md text-blue-600 font-medium transition-colors hover:bg-gray-100"
      >
        Go to the next step
        <ChevronRight size={25} className="ml-2" />
      </button>
    </div>
  );
}

export default NavButtons;