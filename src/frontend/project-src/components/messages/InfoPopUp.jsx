// Reusable informational alert component.
// Displays an info icon, a title, a message, and an optional confirmation button.

import { Info } from 'lucide-react';

const InfoPopUp = ({
  title,
  message,
  buttonText = 'Got it!',
  onButtonClick,
  isVisible = true,
}) => {
  if (!isVisible) {
    return null; 
  }

  // Styling
  const infoAlertStyles = 'bg-blue-50 border-blue-400 text-blue-800';
  const infoIconComponent = <Info className="w-6 h-6 mr-3" />;
  const infoButtonStyles = 'bg-white border-blue-400 text-blue-700 hover:bg-blue-100';

  return (
    <div
      className={`
        flex flex-col p-8 rounded-lg border-2 
        ${infoAlertStyles}
        font-inter
        max-w-md w-full
        shadow-lg
      `}
      role="alert"
    >
      {/* Icon and title */}
      <div className="flex items-center mb-4"> 
        {infoIconComponent}
        <span className="font-bold text-lg">{title}</span>
      </div>

      {/* Message body */}
      <p className="text-base leading-relaxed mb-6">
        {message}
      </p>

      {/* Optional action button */}
      {onButtonClick && (
        <button
          onClick={onButtonClick}
          className={`
            self-start px-6 py-2 rounded-md border
            ${infoButtonStyles}
            font-semibold
            transition-colors duration-200
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-current
          `}
        >
          {buttonText}
        </button>
      )}
    </div>
  );
};

export default InfoPopUp;