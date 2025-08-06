// Reusable error alert component that displays a message with a title, description, and button.
// It conditionally renders based on visibility.

import { AlertCircle } from 'lucide-react';

const DefaultError = ({
  title,
  message,
  buttonText = 'Okay',
  onButtonClick,
  isVisible = true,
}) => {
  if (!isVisible) {
    return null; 
  }

  const errorAlertStyles = 'bg-red-50 border-red-400 text-red-800';
  const errorIconComponent = <AlertCircle className="w-6 h-6 mr-3" />;
  const errorButtonStyles = 'bg-white border-red-400 text-red-700 hover:bg-red-100';

  return (
    <div
      className={`
        flex flex-col p-8 rounded-lg border-2 
        ${errorAlertStyles}
        font-inter
        max-w-xl w-full
        shadow-lg
      `}
      role="alert"
    >

      <div className="flex items-center mb-4"> 
        {errorIconComponent}
        <span className="font-bold text-lg">{title}</span>
      </div>

      <p className="text-base leading-relaxed mb-6">
        {message}
      </p>

      {onButtonClick && (
        <button
          onClick={onButtonClick}
          className={`
            self-start px-6 py-2 rounded-md border
            ${errorButtonStyles}
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

export default DefaultError;