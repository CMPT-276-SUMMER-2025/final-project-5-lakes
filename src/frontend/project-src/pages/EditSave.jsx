import EditSaveStepper from "../components/editsave/EditSaveStepper";
import EditSaveButtons from "../components/editsave/EditSaveButtons";
import { SketchPicker } from 'react-color';
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
// import FontPicker from 'font-picker-react'; // Replaced with custom Noto fonts dropdown
import DownloadOptions from '../components/editsave/DownloadOptions';
import { Loader2, Text, Paintbrush, Download, Edit3, RotateCcw, RotateCw, RefreshCw, Check, MousePointerClick, TextCursorInput, Columns3Cog } from 'lucide-react';
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

const quickChartURL = "https://quickchart.io/chart?height=500&backgroundColor=white&v=4&c=";

// Google Noto fonts supported by QuickChart
const notoFonts = [
    { name: "Noto Sans", value: "Noto Sans" },
    { name: "Noto Serif", value: "Noto Serif" },
    { name: "Noto Sans Display", value: "Noto Sans Display" },
    { name: "Noto Color Emoji", value: "Noto Color Emoji" }
];

function EditSave() {
    const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
    // const chartImageUrl = 'https://dummyimage.com/600x600'; 
    const location = useLocation();
    const { chartConfig: initialConfig, labels: labels } = location.state || {};
    const [showBackgroundPicker, setShowBackgroundPicker] = useState(false);
    const [showTextPicker, setShowTextPicker] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    console.log(initialConfig);


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

    const [activePicker, setActivePicker] = useState(null); // 'background' | 'text' | null for color pickers

    useEffect(() => {
        if (chartConfig?.type === "pie" || chartConfig?.type === "doughnut") {
          setGridLines(false);
        }
    }, [chartConfig?.type]);
      

    useEffect(() => {
        console.log("Creating chartConfig");
        if (chartConfig && chartConfig.options) {
            // Ensure basic chart structure exists
            if (!chartConfig.options.plugins) {
                chartConfig.options.plugins = {};
            }
            if (!chartConfig.options.plugins.title) {
                console.log("Setting title");
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
        console.log("dataset modified to", datasetSelected);
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
            <EditSaveStepper />
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

                            {/* this is the "text" section card*/}
                            <div className="bg-white rounded-2xl shadow-md p-4 border border-gray-200 space-y-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <Edit3 size={18} className="text-black" strokeWidth={2.5} />
                                    <p className="text-lg font-semibold text-gray-800">Edit Text</p>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <div className="flex-1">
                                        <select
                                            id="fontFamilyDropdown"
                                            value={activeFontFamily}
                                            onChange={handleFontChangeLocal}
                                            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                                            style={{ fontFamily: activeFontFamily }}
                                        >
                                            {notoFonts.map((font) => (
                                                <option key={font.value} value={font.value} style={{ fontFamily: font.value }}>
                                                    {font.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="flex-1">  
                                        <select
                                            id="fontSizeDropdown"
                                            value={fontSize}
                                            onChange={handleFontSizeChangeLocal}
                                            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                                        >
                                            {[6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 28, 32].map((size) => (
                                            <option key={size} value={size}>
                                                {size}
                                            </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Chart Title section */}
                            <div className="bg-white rounded-2xl shadow-md p-4 border border-gray-200 space-y-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <Text size={18} className="text-black" strokeWidth={2.5} />
                                    <p className="text-lg font-semibold text-gray-800">Chart Title</p>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-2">
                                    <input
                                        type="text"
                                        value={tempTitle}
                                        onChange={(e) => setTempTitle(e.target.value)}
                                        placeholder="Enter chart title"
                                        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                                    />
                                    <button
                                        onClick={handleTitleChangeLocal}
                                        className="primary-button"
                                    >
                                        Update
                                    </button>
                                </div>
                            </div>
                            
                            {/* X/Y Axis title label*/}
                            <div className="bg-white rounded-2xl shadow-md p-4 border border-gray-200 space-y-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <TextCursorInput size={18} className="text-black" strokeWidth={2.5} />
                                    <p className="text-lg font-semibold text-gray-800">Edit X Axis Title</p>
                                </div>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={tempXAxisTitle}
                                        onChange={(e) => setTempXAxisTitle(e.target.value)}
                                        placeholder="Enter X-axis title"
                                        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                                    />
                                    <button
                                        onClick={() => handleAxisTitleChangeLocal("x", tempXAxisTitle)}
                                        className="primary-button"
                                    >
                                        Update
                                    </button>
                                </div>
                                <div className="flex items-center gap-2 mb-2">
                                    <TextCursorInput size={18} className="text-black" strokeWidth={2.5} />
                                    <p className="text-lg font-semibold text-gray-800">Edit Y Axis Title</p>
                                </div>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={tempYAxisTitle}
                                        onChange={(e) => setTempYAxisTitle(e.target.value)}
                                        placeholder="Enter Y-axis title"
                                        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                                    />
                                    <button
                                        onClick={() => handleAxisTitleChangeLocal("y", tempYAxisTitle)}
                                        className="primary-button"
                                    >
                                        Update
                                    </button>
                                </div>
                            </div>    
                        </div>
                          
                        {/* Color editing section */}
                        <div className="space-y-6">

                            {/* Dataset/Segment Selection section */}
                            {(() => {
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
                                                        onClick={() => setSegmentSelected(index)}
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
                                                        onClick={() => setDatasetSelected(index)}
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
                            })()}

                            {/* This is the colour card */}
                            <div className="bg-white rounded-2xl shadow-md p-4 border border-gray-200 space-y-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <Paintbrush size={18} className="text-black" strokeWidth={2.5} />
                                    <p className="text-lg font-semibold text-gray-800">Edit Colour</p>
                                </div>

                                <p className="text-lg font-semibold text-gray-800 mb-2">
                                    {(() => {
                                    const isPieChart = chartConfig?.type === 'pie' || chartConfig?.type === 'doughnut';
                                    const shouldShowLabel = isPieChart
                                        ? chartConfig?.data?.datasets?.[0]?.data?.length > 1
                                        : chartConfig?.data?.datasets?.length > 1;

                                    if (!shouldShowLabel) return null;

                                    const label = isPieChart
                                        ? (chartConfig.data.labels?.[segmentSelected] || `Segment ${segmentSelected + 1}`)
                                        : (chartConfig.data.datasets[datasetSelected]?.label || `Dataset ${datasetSelected + 1}`);

                                    return (
                                        <span className="text-sm font-normal text-blue-600 ml-2">
                                        ({label})
                                        </span>
                                    );
                                    })()}
                                </p>

                                {/* Show color option buttons only if no picker is active */}
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <button
                                        className={`edit-color-option ${activePicker === 'background' ? 'edit-color-option-active' : ''}`}
                                        onClick={() => {
                                        setActivePicker(prev => prev === 'background' ? null : 'background');
                                        }}
                                    >
                                        Chart Colour
                                    </button>

                                    <button
                                        className={`edit-color-option ${activePicker === 'text' ? 'edit-color-option-active' : ''}`}
                                        onClick={() => {
                                        setActivePicker(prev => prev === 'text' ? null : 'text');
                                        }}
                                    >
                                        Text Colour
                                    </button>
                                </div>

                                {/* Show the appropriate picker and Confirm/Cancel buttons */}
                                {activePicker && (
                                    <div className="flex flex-col items-center gap-4">
                                    <SketchPicker
                                        color={activePicker === "background" ? tempBackgroundColor : tempTextColor}
                                        onChangeComplete={(color) => {
                                        if (activePicker === "background") {
                                            setTempBackgroundColor(color.hex);
                                        } else {
                                            setTempTextColor(color.hex);
                                        }
                                        }}
                                        disableAlpha={true}
                                    />

                                    {/* Confirm + Cancel buttons side by side */}
                                    <div className="flex w-full gap-4 pt-2">
                                        <button
                                        className="w-1/2 edit-color-button-1"
                                        onClick={() => {
                                            if (activePicker === "background") {
                                            setSelectedColor(tempBackgroundColor);
                                            handleColorChangeLocal({ hex: tempBackgroundColor });
                                            } else {
                                            setTextColor(tempTextColor);
                                            handleTextColorChangeLocal({ hex: tempTextColor });
                                            }
                                            setActivePicker(null);
                                        }}
                                        >
                                        <Check size={18} />
                                        Confirm
                                        </button>

                                        <button
                                        className="w-1/2 edit-color-button-2"
                                        onClick={() => {
                                            setActivePicker(null);
                                        }}
                                        >
                                        Cancel
                                        </button>
                                    </div>
                                    </div>
                                )}
                            </div>

                            {/* Grid Lines & Legend section */}
                            <div className="bg-white rounded-2xl shadow-md p-4 border border-gray-200 space-y-4">
                                <div className="flex items-center gap-2 mb-4">
                                    <Columns3Cog size={18} className="text-black" strokeWidth={2.5} />
                                    <p className="text-lg font-semibold text-gray-800">Customize Grid Lines & Legend</p>
                                </div>

                                <div className="flex gap-4">
                                    <button 
                                    onClick={handleGridLinesLocal} 
                                    className="w-1/2 primary-button text-center cursor-pointer justify-center"
                                    >
                                    {gridLines ? "Disable Grid Lines" : "Enable Grid Lines"}
                                    </button>

                                    <button 
                                    onClick={handleLegendLocal} 
                                    className="w-1/2 primary-button text-center cursor-pointer justify-center"
                                    >
                                    {legend ? "Disable Legend" : "Enable Legend"}
                                    </button>
                                </div>
                            </div>

                            {/* {isDownloadModalOpen && (
                                <DownloadOptions
                                onClose={() => setIsDownloadModalOpen(false)}
                                chartImageUrl={chartImageUrl}
                                />
                            )}

                            {/* downloading button, downloading thing is a component */}
                            {/* <div className="w-full">
                                <button
                                    className="w-full primary-button flex items-center justify-center gap-2"
                                    onClick={() => setIsDownloadModalOpen(true)}
                                >
                                    <Download size={18} strokeWidth={4}/>
                                    Download
                                </button>
                            </div>  */}
                        </div> 
                    </div>
                </div>
            </div>
            <EditSaveButtons chartImageUrl={chartImageUrl} />
        </div>
    );
}

export default EditSave;
