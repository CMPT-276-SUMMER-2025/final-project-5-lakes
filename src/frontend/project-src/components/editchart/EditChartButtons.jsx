import { Link } from 'react-router-dom';
import { ChevronLeft, CirclePlus } from 'lucide-react';

function EditSaveButtons() {
    return (
        <div className="flex justify-between mt-10 flex-wrap gap-4">
            {/* Buttons */}
            <Link
                to="/confirm-data"
                className="white-base-button flex items-center justify-center px-6 py-3 rounded-md text-blue-600 font-medium transition-colors hover:bg-gray-100"
            >
                <ChevronLeft size={25} className="mr-2" />
                Go to the last step
            </Link>
            
            <Link
                to="/"
                className="white-base-button flex items-center justify-center px-6 py-3 rounded-md text-blue-600 font-medium transition-colors hover:bg-gray-100"
            >
                <CirclePlus size={25} className="mr-3" />
                Create another chart
            </Link>
        </div>
    );
}

export default EditSaveButtons;