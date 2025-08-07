// GridLegendSettings: Toggles visibility of grid lines and legend for the chart
// If the chart is a pie/doughnut chart, grid line toggle is hiddenimport { Columns3Cog } from 'lucide-react';
import React from 'react';
import { Columns3Cog } from 'lucide-react';

const GridLegendSettings = ({ 
  gridLines,          
  legend,                 
  onGridLinesToggle,      
  onLegendToggle,         
  isPieChart = false     
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-md p-4 border border-gray-200 space-y-4">
      
      {/* Section header with icon and title */}
      <div className="flex items-center gap-2 mb-4">
        <Columns3Cog size={18} className="text-black" strokeWidth={2.5} />
        <p className="text-lg font-semibold text-gray-800">
          {isPieChart ? "Customize Legend" : "Customize Grid Lines & Legend"}
        </p>
      </div>

      {/* Toggle buttons */}
      <div className="flex gap-4">
        {/* Grid line toggle (hidden for pie charts) */}
        {!isPieChart && (
          <button 
            onClick={onGridLinesToggle} 
            className="w-1/2 primary-button text-center cursor-pointer justify-center"
          >
            {gridLines ? "Disable Grid Lines" : "Enable Grid Lines"}
          </button>
        )}

        {/* Legend toggle (always shown) */}
        <button 
          onClick={onLegendToggle} 
          className={`${isPieChart ? "w-full" : "w-1/2"} primary-button text-center cursor-pointer justify-center`}
        >
          {legend ? "Disable Legend" : "Enable Legend"}
        </button>
      </div>
    </div>
  );
};

export default GridLegendSettings;