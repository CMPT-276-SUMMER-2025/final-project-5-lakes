import { ChevronRight, Upload, Check, SquareMousePointer, Pencil } from 'lucide-react';
import { Link } from 'react-router-dom';

function VisualSelectStepper() {
    return (
        <div className="items-center justify-center space-y-4">
            <Link className="relative primary-button w-60 mb-4 mr-5" to="/">
                <Upload size={20} className="absolute-left-3 mr-2" />
                Upload Data
                <ChevronRight size={25} className="absolute-right-3 ml-2" />
            </Link>
            <Link className="relative primary-button w-60 mb-4 mr-5" to="/data-confirm">
                <Check size={20} className="absolute-left-3 mr-2" />
                Confirm Data
                <ChevronRight size={25} className="absolute-right-3 ml-2" />
            </Link>
            <Link className="relative primary-button w-60 mb-4 mr-5" to="/visual-select">
                <SquareMousePointer size={20} className="absolute-left-3 mr-2" />
                Choose Visual
                <ChevronRight size={25} className="absolute-right-3 ml-2" />
            </Link>
            <button className="relative secondary-button w-60 mb-4 mr-5" to="/edit-save">
                <Pencil size={20} className="absolute-left-3 mr-2" />
                Edit & Save
                <ChevronRight size={25} className="absolute-right-3 ml-2" />
            </button>
        </div>
    );
}

export default VisualSelectStepper;
