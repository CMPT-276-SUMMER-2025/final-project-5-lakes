import EditSaveButtons from "../components/editsave/EditSaveButtons";
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import ProgressStepper from "../components/layout/ProgressStepper";
import { Loader2, RotateCcw, RotateCw, RefreshCw } from 'lucide-react';
import {
    getTitleFontSize,
    getBaseFontSize,
    hexToRgb,
    rgbToHex,
    handleColorChange,
    handleTitleChange,
    handleAxisTitleChange,
    handleTextColorChange,
    handleFontSizeChange,
    handleUndo,
    handleRedo,
    handleReset,
    handleFontChange,
    handleGridLines,
    handleLegend
} from '../utils/EditSaveUtils';
import FontSettings from '../components/editsave/FontSettings';
import TitleSettings from '../components/editsave/TitleSettings';
import AxisTitleSettings from '../components/editsave/AxisTitleSettings';
import DatasetSelection from '../components/editsave/DatasetSelection';
import ColorSettings from '../components/editsave/ColorSettings';
import GridLegendSettings from '../components/editsave/GridLegendSettings';

const quickChartURL = "https://quickchart.io/chart?height=500&backgroundColor=white&v=4&c=";

function EditSave() {
    const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
    // const chartImageUrl = 'https://dummyimage.com/600x600'; 
    const location = useLocation();
    const { chartConfig: initialConfig, labels: labels } = location.state || {};
    const [showBackgroundPicker, setShowBackgroundPicker] = useState(false);
    const [showTextPicker, setShowTextPicker] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [chartConfig, setChartConfig] = useState(initialConfig);
    const [chartImageUrl, setChartImageUrl] = useState(`${quickChartURL}${encodeURIComponent(JSON.stringify(initialConfig))}`);

    const [selectedColor, setSelectedColor] = useState(initialConfig?.chartStyle?.backgroundColor || "#36A2EB");
    const [textColor, setTextColor] = useState(initialConfig?.chartStyle?.textColor || "#000000");

    const [tempBackgroundColor, setTempBackgroundColor] = useState(selectedColor);
    const [tempTextColor, setTempTextColor] = useState(textColor);
    
    const [activeFontFamily, setActiveFontFamily] = useState("Noto Sans");
    const [fontSize, setFontSize] = useState(14); 

    const [history, setHistory] = useState([initialConfig]);
    const [historyIndex, setHistoryIndex] = useState(0);
    
    const [chartTitle, setChartTitle] = useState("Chart Title");
    const [tempTitle, setTempTitle] = useState("Chart Title");

    const [datasetSelected, setDatasetSelected] = useState(0);
    const [segmentSelected, setSegmentSelected] = useState(0);
    
    // Track selection history for undo/redo
    const [selectionHistory, setSelectionHistory] = useState([{ dataset: 0, segment: 0 }]);

    const [tempXAxisTitle, setTempXAxisTitle] = useState("X-axis");
    const [tempYAxisTitle, setTempYAxisTitle] = useState("Y-axis");

    const [gridLines, setGridLines] = useState(true);
    const [legend, setLegend] = useState(true);

    const isPieChart = chartConfig?.type === 'pie' || chartConfig?.type === 'doughnut';

    const [activePicker, setActivePicker] = useState(null); // 'background' | 'text' | null for color pickers

    useEffect(() => {
        if (chartConfig?.type === "pie" || chartConfig?.type === "doughnut") {
          setGridLines(false);
        }
    }, [chartConfig?.type]);
      

    useEffect(() => {
        if (chartConfig && chartConfig.options) {
            // Ensure basic chart structure exists
            if (!chartConfig.options.plugins) {
                chartConfig.options.plugins = {};
            }
            if (!chartConfig.options.plugins.title) {
                chartConfig.options.plugins.title = {
                    display: true,
                    text: chartTitle || "Chart Title",
                    font: {
                        family: "Noto Sans",
                        size: getTitleFontSize(fontSize) // Use helper function
                    }
                };
            }
            if (!chartConfig.options.plugins.legend) {
                chartConfig.options.plugins.legend = {
                    display: legend,
                    labels: {
                        font: {
                            family: "Noto Sans",
                            size: fontSize
                        }
                    }
                };
            }
            if (!chartConfig.options.scales) {
                chartConfig.options.scales = {
                    y: {
                        ticks: {
                            font: {
                                family: "Noto Sans",
                                size: fontSize
                            }
                        },
                        title: {
                            text: tempYAxisTitle,
                            font: {
                                family: "Noto Sans",
                                size: fontSize
                            }
                        },
                        grid: {
                            display: gridLines
                        }
                    },
                    x: {
                        ticks: {
                            font: {
                                family: "Noto Sans",
                                size: fontSize
                            }
                        },
                        title: {
                            text: tempXAxisTitle,
                            font: {
                                family: "Noto Sans",
                                size: fontSize
                            }
                        },
                        grid: {
                            display: gridLines
                        }
                    }
                };
            }
            if (chartConfig.type === "pie" || chartConfig.type === "doughnut") {
                chartConfig.data.datasets[0].backgroundColor[segmentSelected] = hexToRgb(selectedColor);
            } else {
                chartConfig.data.datasets[datasetSelected].backgroundColor = hexToRgb(selectedColor);
                chartConfig.data.datasets[datasetSelected].borderColor = hexToRgb(selectedColor);
            }
        }
    }, [chartConfig]); // Only depend on chartConfig for initial setup

    // Ensure dataset/segment selection stays within bounds
    useEffect(() => {
        const isPieChart = chartConfig?.type === 'pie' || chartConfig?.type === 'doughnut';
        
        if (isPieChart) {
            // For pie charts, check segment bounds
            if (chartConfig?.data?.datasets?.[0]?.data && segmentSelected >= chartConfig.data.datasets[0].data.length) {
                setSegmentSelected(0);
            }
        } else {
            // For other charts, check dataset bounds
            if (chartConfig?.data?.datasets && datasetSelected >= chartConfig.data.datasets.length) {
                setDatasetSelected(0);
            }
        }
    }, [chartConfig, datasetSelected, segmentSelected]);

    // Handle color change from the color picker
    const handleColorChangeLocal = (color) => {
        handleColorChange(color, selectedColor, chartConfig, datasetSelected, segmentSelected, setSelectedColor, updateChartConfig);
    };

    // Handle chart title change
    const handleTitleChangeLocal = () => {
        handleTitleChange(tempTitle, chartTitle, chartConfig, activeFontFamily, fontSize, setChartTitle, updateChartConfig);
    };

    const handleAxisTitleChangeLocal = (axis, title) => {
        handleAxisTitleChange(axis, title, chartConfig, setTempXAxisTitle, setTempYAxisTitle, updateChartConfig);
    };

    // Handle text color change
    const handleTextColorChangeLocal = (color) => {
        handleTextColorChange(color, textColor, chartConfig, setTextColor, updateChartConfig);
    };

    const handleFontSizeChangeLocal = (e) => {
        handleFontSizeChange(e, fontSize, chartConfig, activeFontFamily, setFontSize, updateChartConfig);
    };

    // helper function to update chart config and maintain history
    const updateChartConfig = (newConfig) => {
        const updatedHistory = history.slice(0, historyIndex + 1);
        updatedHistory.push(newConfig);
        setHistory(updatedHistory);
        setHistoryIndex(updatedHistory.length - 1);
        setChartConfig(newConfig);
        setChartImageUrl(`${quickChartURL}${encodeURIComponent(JSON.stringify(newConfig))}`);
        
        // Save current selection to history
        const updatedSelectionHistory = selectionHistory.slice(0, historyIndex + 1);
        updatedSelectionHistory.push({ dataset: datasetSelected, segment: segmentSelected });
        setSelectionHistory(updatedSelectionHistory);
    };

    // Handle undo and redo actions
    const handleUndoLocal = () => {
        handleUndo(historyIndex, history, selectionHistory, setDatasetSelected, setSegmentSelected, setChartConfig, setHistoryIndex, setSelectedColor, setTextColor, setChartTitle, setTempTitle, setActiveFontFamily, setFontSize, setChartImageUrl);
    };

    const handleRedoLocal = () => {
        handleRedo(historyIndex, history, selectionHistory, setDatasetSelected, setSegmentSelected, setChartConfig, setHistoryIndex, setSelectedColor, setTextColor, setChartTitle, setTempTitle, setActiveFontFamily, setFontSize, setChartImageUrl);
    };

    const handleResetLocal = () => {
        handleReset(initialConfig, setChartConfig, setSelectedColor, setTextColor, setChartTitle, setTempTitle, setActiveFontFamily, setFontSize, setDatasetSelected, setSegmentSelected, setHistory, setHistoryIndex, setSelectionHistory, setChartImageUrl);
    };

    // Handle font change
    const handleFontChangeLocal = (e) => {
        handleFontChange(e, chartConfig, activeFontFamily, fontSize, setActiveFontFamily, updateChartConfig);
    };

    const handleGridLinesLocal = () => {
        handleGridLines(gridLines, chartConfig, setGridLines, updateChartConfig);
    };

    const handleLegendLocal = () => {
        handleLegend(legend, chartConfig, setLegend, updateChartConfig);
    };

    useEffect(() => {
    if (chartConfig) {
        setIsLoading(true);
        setChartImageUrl(`${quickChartURL}${encodeURIComponent(JSON.stringify(chartConfig))}`);
    }
}, [chartConfig]);
    
{/* BELOW IS WHERE ALL OF THE BUTTONS ARE LOCATED */}

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 sm:p-8 font-inter">
            <ProgressStepper currentStep="Edit & Save" />
            <div className="bg-blue-50 rounded-2xl shadow-lg px-4 sm:px-6 md:px-8 py-6 w-full">
                <div className="flex flex-col md:flex-row gap-6 w-full">
                    {/* Display the chart image */}
                    <div className="w-full md:w-[55%] bg-white rounded-xl p-4 sm:p-6 shadow-lg relative">
                        <div>
                            <h2 className="font-semibold flex items-center justify-center gap-4 mb-2">
                            {/* <Edit3 size={30} />
                            Edit Chart */}

                            <div className="flex ml-6 space-x-3">
                                <button
                                onClick={handleUndoLocal}
                                disabled={historyIndex === 0}
                                className="flex items-center gap-1 px-3 py-1 rounded-md border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Undo"
                                >
                                <RotateCcw size={18} />
                                </button>

                                <button
                                onClick={handleRedoLocal}
                                disabled={historyIndex === history.length - 1}
                                className="flex items-center gap-1 px-3 py-1 rounded-md border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Redo"
                                >
                                <RotateCw size={18} />
                                </button>

                                <button
                                onClick={handleResetLocal}
                                className="flex items-center gap-1 px-3 py-1 rounded-md border border-gray-300 hover:bg-gray-100"
                                title="Reset"
                                >
                                <RefreshCw size={18} />
                                </button>
                            </div>
                            </h2>

                            {/* !!!! this is where the image is shown */}
                            <>
                                {isLoading && (
                                    <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center rounded-md z-10" style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)' }}>
                                        <Loader2 size={48} className="animate-spin text-blue-500" />
                                    </div>
                                )}
                                {chartImageUrl ? (
                                <img
                                    src={`${quickChartURL}${encodeURIComponent(JSON.stringify(chartConfig))}`}
                                    alt="Live Chart Preview"
                                    onLoad={() => setIsLoading(false)} 
                                    className="w-full max-w-lg mx-auto rounded-md shadow-md"
                                />
                                ) : (
                                <p className="text-center text-gray-500">No chart available</p>
                                )}
                            </>
                        </div>
                    </div>

                    {/* Controls section, RIGHT SIDE OF PAGE */}
                    <div className="w-full md:w-[45%] grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Text editing section */}
                        <div className="space-y-6">
                            <FontSettings
                                activeFontFamily={activeFontFamily}
                                fontSize={fontSize}
                                onFontChange={handleFontChangeLocal}
                                onFontSizeChange={handleFontSizeChangeLocal}
                            />

                            <TitleSettings
                                tempTitle={tempTitle}
                                onTitleChange={(e) => setTempTitle(e.target.value)}
                                onUpdateTitle={handleTitleChangeLocal}
                            />
                            
                            {/* Only show axis title settings for non-pie charts */}
                            {!isPieChart && (
                                <AxisTitleSettings
                                    tempXAxisTitle={tempXAxisTitle}
                                    tempYAxisTitle={tempYAxisTitle}
                                    onXAxisTitleChange={(e) => setTempXAxisTitle(e.target.value)}
                                    onYAxisTitleChange={(e) => setTempYAxisTitle(e.target.value)}
                                    onUpdateXAxisTitle={() => handleAxisTitleChangeLocal("x", tempXAxisTitle)}
                                    onUpdateYAxisTitle={() => handleAxisTitleChangeLocal("y", tempYAxisTitle)}
                                />
                            )}
                        </div>
                          
                        {/* Color editing section */}
                        <div className="space-y-6">
                            <DatasetSelection
                                chartConfig={chartConfig}
                                datasetSelected={datasetSelected}
                                segmentSelected={segmentSelected}
                                onDatasetSelect={setDatasetSelected}
                                onSegmentSelect={setSegmentSelected}
                            />

                            <ColorSettings
                                chartConfig={chartConfig}
                                datasetSelected={datasetSelected}
                                segmentSelected={segmentSelected}
                                activePicker={activePicker}
                                tempBackgroundColor={tempBackgroundColor}
                                tempTextColor={tempTextColor}
                                onSetActivePicker={setActivePicker}
                                onTempBackgroundColorChange={setTempBackgroundColor}
                                onTempTextColorChange={setTempTextColor}
                                onConfirmBackgroundColor={() => {
                                    setSelectedColor(tempBackgroundColor);
                                    handleColorChangeLocal({ hex: tempBackgroundColor });
                                    setActivePicker(null);
                                }}
                                onConfirmTextColor={() => {
                                    setTextColor(tempTextColor);
                                    handleTextColorChangeLocal({ hex: tempTextColor });
                                    setActivePicker(null);
                                }}
                                onCancelColorPicker={() => setActivePicker(null)}
                            />

                            <GridLegendSettings
                                gridLines={gridLines}
                                legend={legend}
                                onGridLinesToggle={handleGridLinesLocal}
                                onLegendToggle={handleLegendLocal}
                                isPieChart={isPieChart}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <EditSaveButtons chartImageUrl={chartImageUrl} />
        </div>
    );
}

export default EditSave;
