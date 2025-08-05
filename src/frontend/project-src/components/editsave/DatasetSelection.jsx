import { MousePointerClick } from 'lucide-react';

const DatasetSelection = ({ 
    chartConfig, 
    datasetSelected, 
    segmentSelected, 
    onDatasetSelect, 
    onSegmentSelect 
}) => {
    const isPieChart = chartConfig?.type === 'pie' || chartConfig?.type === 'doughnut';
    const shouldShowSelection = isPieChart 
        ? chartConfig?.data?.datasets?.[0]?.data?.length > 1
        : chartConfig?.data?.datasets?.length > 1;

    if (!shouldShowSelection) return null;

    return (
        <div className="bg-white rounded-2xl shadow-md p-4 border border-gray-200 space-y-4">
            <div className="flex items-center gap-2 mb-2">
                <MousePointerClick size={18} className="text-black" strokeWidth={2.5} />
                <p className="text-lg font-semibold text-gray-800">
                    {isPieChart ? 'Select Segment' : 'Select Dataset'}
                </p>
            </div>
            <div className="flex flex-wrap gap-2">
                {isPieChart ? (
                    // Pie chart segments
                    chartConfig.data.datasets[0].data.map((value, index) => (
                        <button
                            key={index}
                            onClick={() => onSegmentSelect(index)}
                            className={`px-4 py-2 rounded-lg border transition-all duration-200 ${
                                segmentSelected === index
                                    ? 'segment-button-blue'
                                    : 'segment-button-white'
                            }`}
                        >
                            {chartConfig.data.labels?.[index] || `Segment ${index + 1}`}
                        </button>
                    ))
                ) : (
                    // Regular chart datasets
                    chartConfig.data.datasets.map((dataset, index) => (
                        <button
                            key={index}
                            onClick={() => onDatasetSelect(index)}
                            className={`px-4 py-2 rounded-lg border transition-all duration-200 ${
                                datasetSelected === index
                                    ? 'bg-blue-600 text-white border-blue-600'
                                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                            }`}
                        >
                            {dataset.label || `Dataset ${index + 1}`}
                        </button>
                    ))
                )}
            </div>
            <p className="text-sm text-gray-600">
                Selected: {isPieChart 
                    ? (chartConfig.data.labels?.[segmentSelected] || `Segment ${segmentSelected + 1}`)
                    : (chartConfig.data.datasets[datasetSelected]?.label || `Dataset ${datasetSelected + 1}`)
                }
            </p>
        </div>
    );
};

export default DatasetSelection; 