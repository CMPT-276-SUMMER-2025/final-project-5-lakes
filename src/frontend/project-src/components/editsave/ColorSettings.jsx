// Manages UI for editing background and text colors on a chart
import React from 'react';
import { Paintbrush, Check } from 'lucide-react';
import { SketchPicker } from 'react-color';

const ColorSettings = ({ 
    chartConfig,                 
    datasetSelected,
    segmentSelected,
    activePicker,
    tempBackgroundColor,
    tempTextColor,
    onSetActivePicker,
    onTempBackgroundColorChange,
    onTempTextColorChange,
    onConfirmBackgroundColor,
    onConfirmTextColor,
    onCancelColorPicker
}) => {
    // Determine if the chart is pie/doughnut (affects label logic)
    const isPieChart = chartConfig?.type === 'pie' || chartConfig?.type === 'doughnut';

    // Only show a label when there's more than one dataset/segment
    const shouldShowLabel = isPieChart
        ? chartConfig?.data?.datasets?.[0]?.data?.length > 1
        : chartConfig?.data?.datasets?.length > 1;

    // Get label for currently selected item (for display beside title)
    const getSelectedLabel = () => {
        if (!shouldShowLabel) return null;

        const label = isPieChart
            ? (chartConfig.data.labels?.[segmentSelected] || `Segment ${segmentSelected + 1}`)
            : (chartConfig.data.datasets[datasetSelected]?.label || `Dataset ${datasetSelected + 1}`);

        return (
            <span className="text-sm font-normal text-blue-600 ml-2">
                ({label})
            </span>
        );
    };

    return (
        // Card-style container
        <div className="bg-white rounded-2xl shadow-md p-4 border border-gray-200 space-y-4">

            {/* Header with icon and chart label info */}
            <div className="flex items-center gap-2 mb-2">
                <Paintbrush size={18} className="text-black" strokeWidth={2.5} />
                <p className="text-lg font-semibold text-gray-800">
                    Edit Colour
                    {getSelectedLabel()}
                </p>
            </div>

            {/* Color selection buttons (toggle active picker) */}
            <div className="flex flex-col sm:flex-row gap-4">
                <button
                    className={`edit-color-option ${activePicker === 'background' ? 'edit-color-option-active' : ''}`}
                    onClick={() => onSetActivePicker(activePicker === 'background' ? null : 'background')}
                >
                    Chart Colour
                </button>

                <button
                    className={`edit-color-option ${activePicker === 'text' ? 'edit-color-option-active' : ''}`}
                    onClick={() => onSetActivePicker(activePicker === 'text' ? null : 'text')}
                >
                    Text Colour
                </button>
            </div>

            {/* Color picker and action buttons (only shown when a picker is active) */}
            {activePicker && (
                <div className="flex flex-col items-center gap-4">
                    <SketchPicker
                        color={activePicker === "background" ? tempBackgroundColor : tempTextColor}
                        onChangeComplete={(color) => {
                            if (activePicker === "background") {
                                onTempBackgroundColorChange(color.hex);
                            } else {
                                onTempTextColorChange(color.hex);
                            }
                        }}
                        disableAlpha={true} // Don't allow opacity changes
                    />

                    {/* Confirm and Cancel buttons */}
                    <div className="flex w-full gap-4 pt-2">
                        <button
                            className="w-1/2 edit-color-button-1"
                            onClick={() => {
                                if (activePicker === "background") {
                                    onConfirmBackgroundColor();
                                } else {
                                    onConfirmTextColor();
                                }
                            }}
                        >
                            <Check size={18} />
                            Confirm
                        </button>

                        <button
                            className="w-1/2 edit-color-button-2"
                            onClick={onCancelColorPicker}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ColorSettings;