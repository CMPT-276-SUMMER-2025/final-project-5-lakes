import { ChevronRight, Upload, Check, SquareMousePointer, Pencil, ArrowRightFromLine } from 'lucide-react';
import { Link } from 'react-router-dom';

function EditChartStepper() {
    return (
        <div className="items-center justify-center space-y-4 mb-8">
            <Link to="/" className="primary-button mb-4 mr-5">
                <Upload size={20} className="mr-2" />
                Upload Data
                <ChevronRight size={25} className="ml-2" />
            </Link>
            <Link to="/data-confirm" className="primary-button mb-4 mr-5">
                <Check size={20} className="mr-2" />
                Confirm Data
                <ChevronRight size={25} className="ml-2" />
            </Link>
            <Link to="/choose-visual" className="primary-button mb-4 mr-5">
                <SquareMousePointer size={20} className="mr-2" />
                Choose Visual
                <ChevronRight size={25} className="ml-2" />
            </Link>
            <Link to="/edit-save" className="primary-button mb-4 mr-5">
                <Pencil size={20} className="mr-2" />
                Edit & Save
                <ChevronRight size={25} className="ml-2" />
            </Link>
            <button className="primary-button mb-4 mr-5">
                <ArrowRightFromLine size={20} className="mr-2" />
                Export Chart
            </button>
        </div>
    );
}

export default EditChartStepper;
