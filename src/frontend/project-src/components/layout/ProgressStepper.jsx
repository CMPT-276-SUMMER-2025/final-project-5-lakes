// Stepper component to visually track user progress through a multi-step process
// Styling reference from https://tailwindcss.com/plus/ui-blocks/application-ui/navigation/progress-bars

import { Upload, Check, SquareMousePointer, Pencil } from 'lucide-react';

// Step definitions for the progress bar
const steps = [
  { id: 1, label: 'Upload Data', icon: <Upload size={18} /> },
  { id: 2, label: 'Edit Data', icon: <Check size={18} /> },
  { id: 3, label: 'Choose Visual', icon: <SquareMousePointer size={18} /> },
  { id: 4, label: 'Edit & Save', icon: <Pencil size={18} /> },
];

// ProgressStepper: Visual step tracker for user flow
function ProgressStepper({ currentStep }) {
  
  // Determine status for a given step based on currentStep prop
  const getStepStatus = (stepLabel) => {
    const currentIndex = steps.findIndex((step) => step.label === currentStep);
    const stepIndex = steps.findIndex((step) => step.label === stepLabel);
    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'current';
    return 'upcoming';
  };

  return (
    <div className="flex justify-center items-center space-x-6 p-6 bg-white-50 rounded-md mb-6">
      {steps.map((step, index) => {
        const status = getStepStatus(step.label);
        const isLast = index === steps.length - 1;

        return (
          <div key={step.id} className="flex items-center space-x-2">
            {/* Step indicator circle */}
            <div
              className={`w-10 h-10 flex items-center justify-center rounded-full font-bold mr-5
                ${
                  status === 'completed'
                    ? 'bg-blue-600 text-white'
                    : status === 'current'
                    ? 'border-2 border-blue-600 text-blue-600'
                    : 'border-2 border-gray-300 text-gray-400'
                }
              `}
            >
              {status === 'completed' ? '✓' : step.id.toString().padStart(2, '0')}
            </div>

            {/* Step label with icon */}
            <div
              className={`flex items-center space-x-1 ${
                status === 'completed'
                  ? 'text-gray-900'
                  : status === 'current'
                  ? 'text-blue-600'
                  : 'text-gray-400'
              }`}
            >
              {step.icon}
              <span className="font-medium">{step.label}</span>
            </div>

            {/* Connector line between steps (except last one) */}
            {!isLast && <div className="w-10 h-px bg-gray-300 ml-4 mr-4"></div>}
          </div>
        );
      })}
    </div>
  );
}

export default ProgressStepper;