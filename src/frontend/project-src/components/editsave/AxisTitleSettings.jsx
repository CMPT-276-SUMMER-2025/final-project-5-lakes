// Allows user to edit and update the X and Y axis titles
import React from 'react';
import { TextCursorInput } from 'lucide-react';

const AxisTitleSettings = ({ 
    tempXAxisTitle,       
    tempYAxisTitle,         
    onXAxisTitleChange,    
    onYAxisTitleChange,    
    onUpdateXAxisTitle,     
    onUpdateYAxisTitle      
}) => {
    return (
        <div className="bg-white rounded-2xl shadow-md p-4 border border-gray-200 space-y-4">

            {/* Section: Edit X Axis Title */}
            <div className="flex items-center gap-2 mb-2">
                <TextCursorInput size={18} className="text-black" strokeWidth={2.5} />
                <p className="text-lg font-semibold text-gray-800">Edit X Axis Title</p>
            </div>

            {/* X-axis title input and update button */}
            <div className="flex gap-2">
                <input
                    type="text"
                    value={tempXAxisTitle}
                    onChange={onXAxisTitleChange}
                    placeholder="Enter X-axis title"
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                />
                <button
                    onClick={onUpdateXAxisTitle}
                    className="primary-button"
                >
                    Update
                </button>
            </div>

            {/* Section: Edit Y Axis Title */}
            <div className="flex items-center gap-2 mb-2">
                <TextCursorInput size={18} className="text-black" strokeWidth={2.5} />
                <p className="text-lg font-semibold text-gray-800">Edit Y Axis Title</p>
            </div>

            {/* Y-axis title input and update button */}
            <div className="flex gap-2">
                <input
                    type="text"
                    value={tempYAxisTitle}
                    onChange={onYAxisTitleChange}
                    placeholder="Enter Y-axis title"
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                />
                <button
                    onClick={onUpdateYAxisTitle}
                    className="primary-button"
                >
                    Update
                </button>
            </div>
        </div>
    );
};

export default AxisTitleSettings;