import { useState } from "react";

export function Stepper({ totalSteps = 4 }) {
  const [currentStep, setCurrentStep] = useState(1);

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
  };

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const progressWidth = ((currentStep - 1) / (totalSteps - 1)) * 100;

  return (
    <div className="flex flex-col items-center font-sans">
      <div className="w-[350px] mb-8 relative">
        {/* Line Background */}
        <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-300 -z-10 transform -translate-y-1/2"></div>

        {/* Line Fill */}
        <div
          className="absolute top-1/2 left-0 h-1 bg-blue-500 -z-10 transform -translate-y-1/2 transition-all duration-300 ease-in-out"
          style={{ width: `${progressWidth}%` }}
        ></div>

        {/* Circles */}
        <div className="flex justify-between relative z-10">
          {Array.from({ length: totalSteps }, (_, idx) => idx + 1).map((num) => (
            <div
              key={num}
              className={`w-8 h-8 rounded-full flex items-center justify-center border-4 transition-colors duration-300 ${
                num <= currentStep
                  ? "border-blue-500 text-black"
                  : "border-gray-300 text-gray-400"
              } bg-white`}
            >
              {num}
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="space-x-4">
        <button
          className={`px-6 py-2 rounded-md text-white text-sm font-medium transition ${
            currentStep === 1
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
          onClick={handlePrev}
          disabled={currentStep === 1}
        >
          Prev
        </button>
        <button
          className={`px-6 py-2 rounded-md text-white text-sm font-medium transition ${
            currentStep === totalSteps
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
          onClick={handleNext}
          disabled={currentStep === totalSteps}
        >
          Next
        </button>
      </div>
    </div>
  );
}