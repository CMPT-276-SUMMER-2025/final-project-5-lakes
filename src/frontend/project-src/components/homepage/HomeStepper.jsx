import { ChevronRight, Upload, Check, SquareMousePointer, Pencil, ArrowRightFromLine } from 'lucide-react';

function HomeStepper() {
    return (
        <div className="items-center justify-center space-y-4">
            <button className="stepper-button-1 mb-4 mr-5">
                <Upload size={20} className="mr-2" />
                Upload Data
                <ChevronRight size={25} className="ml-2" />
            </button>
            <button className="stepper-button-2 mb-4 mr-5">
                <Check size={20} className="mr-2" />
                Edit Data
                <ChevronRight size={25} className="ml-2" />
            </button>
            <button className="stepper-button-2 mb-4 mr-5">
                <SquareMousePointer size={20} className="mr-2" />
                Choose Visual
                <ChevronRight size={25} className="ml-2" />
            </button>
            <button className="stepper-button-2 mb-4 mr-5">
                <Pencil size={20} className="mr-2" />
                Edit & Save
                <ChevronRight size={25} className="ml-2" />
            </button>
        </div>
    );
}

export default HomeStepper;
