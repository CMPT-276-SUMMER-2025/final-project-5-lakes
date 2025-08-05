import { Columns3Cog } from 'lucide-react';

const GridLegendSettings = ({ 
    gridLines, 
    legend, 
    onGridLinesToggle, 
    onLegendToggle 
}) => {
    return (
        <div className="bg-white rounded-2xl shadow-md p-4 border border-gray-200 space-y-4">
            <div className="flex items-center gap-2 mb-4">
                <Columns3Cog size={18} className="text-black" strokeWidth={2.5} />
                <p className="text-lg font-semibold text-gray-800">Customize Grid Lines & Legend</p>
            </div>

            <div className="flex gap-4">
                <button 
                    onClick={onGridLinesToggle} 
                    className="w-1/2 primary-button text-center cursor-pointer justify-center"
                >
                    {gridLines ? "Disable Grid Lines" : "Enable Grid Lines"}
                </button>

                <button 
                    onClick={onLegendToggle} 
                    className="w-1/2 primary-button text-center cursor-pointer justify-center"
                >
                    {legend ? "Disable Legend" : "Enable Legend"}
                </button>
            </div>
        </div>
    );
};

export default GridLegendSettings; 