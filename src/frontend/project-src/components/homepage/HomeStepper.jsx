import { ChevronRight, Upload, Check, SquareMousePointer, Pencil } from 'lucide-react';

function HomeStepper() {
    return (
        <div className="items-center justify-center space-y-4">
            <button className="relative primary-button w-60 mb-4 mr-5" href="/">
                <Upload size={20} className="absolute-left-3 mr-2" />
                Upload Data
                <ChevronRight size={25} className="absolute-right-3 ml-2" />
            </button>
            <button className="relative secondary-button w-60 mb-4 mr-5" href="/data-confirm">
                <Check size={20} className="absolute-left-3 mr-2" />
                Confirm Data
                <ChevronRight size={25} className="absolute-right-3 ml-2" />
            </button>
            <button className="relative secondary-button w-60 mb-4 mr-5">
                <SquareMousePointer size={20} className="absolute-left-3 mr-2" />
                Choose Visual
                <ChevronRight size={25} className="absolute-right-3 ml-2" />
            </button>
            <button className="relative secondary-button w-60 mb-4 mr-5">
                <Pencil size={20} className="absolute-left-3 mr-2" />
                Edit & Save
                <ChevronRight size={25} className="absolute-right-3 ml-2" />
            </button>
        </div>
    );
}

export default HomeStepper;
