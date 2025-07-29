import { ChevronRight, Upload, Check, SquareMousePointer, Pencil, ArrowRightFromLine } from 'lucide-react';
import { Link } from 'react-router-dom';

function HomeStepper() {
    return (
        <div className="items-center justify-center space-y-4">
            <Link className="primary-button mb-4 mr-5" to="/">
                <Upload size={20} className="mr-2" />
                Upload Data
                <ChevronRight size={25} className="ml-2" />
            </Link>
            <button className="secondary-button mb-4 mr-5" to="/data-confirm">
                <Check size={20} className="mr-2" />
                Confirm Data
                <ChevronRight size={25} className="ml-2" />
            </button>
            <button className="secondary-button mb-4 mr-5" to="/visual-select">
                <SquareMousePointer size={20} className="mr-2" />
                Choose Visual
                <ChevronRight size={25} className="ml-2" />
            </button>
            <button className="secondary-button mb-4 mr-5" to="/edit-save">
                <Pencil size={20} className="mr-2" />
                Edit & Save
                <ChevronRight size={25} className="ml-2" />
            </button>
        </div>
    );
}

export default HomeStepper;
