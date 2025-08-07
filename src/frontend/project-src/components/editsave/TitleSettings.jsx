// TitleSettings: Allows the user to input and update the chart's title
import React from 'react';
import { Text } from 'lucide-react';

const TitleSettings = ({ 
  tempTitle,         
  onTitleChange,   
  onUpdateTitle     
}) => {
  return (
    // Card-style settings container
    <div className="bg-white rounded-2xl shadow-md p-4 border border-gray-200 space-y-4">
      
      {/* Section heading with icon */}
      <div className="flex items-center gap-2 mb-2">
        <Text size={18} className="text-black" strokeWidth={2.5} />
        <p className="text-lg font-semibold text-gray-800">Chart Title</p>
      </div>

      {/* Input field and update button (responsive layout) */}
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          value={tempTitle}
          onChange={onTitleChange}
          placeholder="Enter chart title"
          className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        />
        <button
          onClick={onUpdateTitle}
          className="primary-button"
        >
          Update
        </button>
      </div>
    </div>
  );
};

export default TitleSettings;