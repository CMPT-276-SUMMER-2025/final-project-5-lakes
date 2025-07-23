import {Link} from 'react-router-dom';
import {ChevronLeft, ChevronRight, RotateCw} from 'lucide-react';

function DataConfirmButtons() {
    return (
        <div className="flex justify-between mt-10 flex-wrap gap-4">
            {/* Buttons */}
            <Link
                to="/"
                className="white-base-button flex items-center justify-center px-6 py-3 rounded-md text-blue-600 font-medium transition-colors hover:bg-gray-100"
            >
                <ChevronLeft size={25} className="mr-2" />
                Go to the last step
            </Link>

            <button className="white-base-button flex items-center justify-center px-6 py-3 rounded-md text-blue-600 font-medium transition-colors hover:bg-gray-100">
                <RotateCw size={20} className="mr-2" />
                Restore original data
            </button>
            
            <Link
                to="/visual-select"
                className="white-base-button flex items-center justify-center px-6 py-3 rounded-md text-blue-600 font-medium transition-colors hover:bg-gray-100"
            >
                Go to the next step
                <ChevronRight size={25} className="ml-2" />
            </Link>
        </div>
    );
}

export default DataConfirmButtons;