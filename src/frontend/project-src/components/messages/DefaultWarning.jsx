// Reusable warning alert component that displays a message with optional confirm and cancel buttons.
// This can be used when user confirmation or acknowledgment is needed.

import { AlertTriangle } from 'lucide-react';

const DefaultWarning = ({
  title,
  message,
  buttonText = 'Okay',
  onButtonClick,
  onCancel,
  cancelText = 'Cancel',
  isVisible = true,
}) => {
  if (!isVisible) return null; 

  // Styling classes
  const containerStyle = 'bg-yellow-50 border-yellow-400 text-yellow-800';
  const icon = <AlertTriangle className="w-6 h-6 mr-3" />;
  const buttonStyle = 'bg-white border-yellow-400 text-yellow-700 hover:bg-yellow-100';

  return (
    <div
      className={`
        flex flex-col p-8 rounded-lg border-2 
        ${containerStyle}
        font-inter
        max-w-xl w-full
        shadow-lg
      `}
      role="alert"
    >
      {/* Warning icon and title */}
      <div className="flex items-center mb-4">
        {icon}
        <span className="font-bold text-lg">{title}</span>
      </div>

      {/* Warning message */}
      <p className="text-base leading-relaxed mb-6">{message}</p>

      {/* Button actions (cancel + confirm) */}
      <div className="flex gap-4">
        {onCancel && (
          <button
            onClick={onCancel}
            className={`
              px-6 py-2 rounded-md border
              ${buttonStyle}
              font-semibold
              transition-colors duration-200
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-current
            `}
          >
            {cancelText}
          </button>
        )}

        {onButtonClick && (
          <button
            onClick={onButtonClick}
            className={`
              px-6 py-2 rounded-md border
              ${buttonStyle}
              font-semibold
              transition-colors duration-200
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-current
            `}
          >
            {buttonText}
          </button>
        )}
      </div>
    </div>
  );
};

export default DefaultWarning;