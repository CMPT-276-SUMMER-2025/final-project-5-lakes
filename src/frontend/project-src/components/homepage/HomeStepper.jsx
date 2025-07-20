import { ChevronRight, Upload, Check, SquareMousePointer, Pencil } from 'lucide-react';

function HomeStepper() {
    return (
        <div className="items-center justify-center space-y-4 mb-8">
            <button className="primary-button mb-4 mr-5" href="/" target="_blank" rel="noopener noreferrer">
                <Upload size={20} className="mr-2" />
                Upload Data
                <ChevronRight size={25} className="ml-2" />
            </button>
            <button className="secondary-button mb-4 mr-5" href="/data-confirm">
                <Check size={20} className="mr-2" />
                Confirm Data
                <ChevronRight size={25} className="ml-2" />
            </button>
            <button className="secondary-button mb-4 mr-5">
                <SquareMousePointer size={20} className="mr-2" />
                Choose Visual
                <ChevronRight size={25} className="ml-2" />
            </button>
            <button className="secondary-button mb-4 mr-5">
                <Pencil size={20} className="mr-2" />
                Edit & Save
                <ChevronRight size={25} className="ml-2" />
            </button>
        </div>
    );
}

export default HomeStepper;
