import EditSaveStepper from "../components/editsave/EditSaveStepper";
import EditSaveButtons from "../components/editsave/EditSaveButtons";
// import { Download } from 'lucide-react';
import { SketchPicker } from 'react-color';
import { useLocation } from "react-router-dom";
import generateChartUrl from "../utils/generateChartURL";
import { useState, useEffect } from "react";
// import FontPicker from 'font-picker-react'; // Replaced with custom Noto fonts dropdown
import DownloadOptions from '../components/editchart/DownloadOptions';
import { Loader2, Text, Paintbrush, Download, Edit3, RotateCcw, RotateCw, RefreshCw } from 'lucide-react';

const quickChartURL = "https://quickchart.io/chart?height=500&backgroundColor=white&v=4&c=";

// Google Noto fonts supported by QuickChart
const notoFonts = [
    { name: "Noto Sans", value: "Noto Sans" },
    { name: "Noto Serif", value: "Noto Serif" },
    { name: "Noto Sans Mono", value: "Noto Sans Mono" },
    { name: "Noto Sans Display", value: "Noto Sans Display" },
    { name: "Noto Serif Display", value: "Noto Serif Display" },
    { name: "Noto Sans JP", value: "Noto Sans JP" },
    { name: "Noto Sans KR", value: "Noto Sans KR" },
    { name: "Noto Sans SC", value: "Noto Sans SC" },
    { name: "Noto Sans TC", value: "Noto Sans TC" },
    { name: "Noto Color Emoji", value: "Noto Color Emoji" }
];



// Utility function to convert hex to RGB
const hexToRgb = (hex) => {
    // Remove the hash if it exists
    hex = hex.replace('#', '');
    
    // Parse the hex values
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    return `rgb(${r}, ${g}, ${b})`;
};

// Utility function to convert hex to RGBA with opacity
const hexToRgba = (hex, alpha = 1) => {
    hex = hex.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

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

    const [selectedColor, setSelectedColor] = useState(initialConfig?.chartStyle?.backgroundColor || "#4F46E5");
    const [textColor, setTextColor] = useState(initialConfig?.chartStyle?.textColor || "#000000");

    const [tempBackgroundColor, setTempBackgroundColor] = useState(selectedColor);
    const [tempTextColor, setTempTextColor] = useState(textColor);
    
    const [activeFontFamily, setActiveFontFamily] = useState("Noto Sans");
    const [fontSize, setFontSize] = useState(14); 

    const [fontStyle, setFontStyle] = useState({
        bold: false,
        italic: false,
        underline: false
    });

    const [history, setHistory] = useState([initialConfig]);
    const [historyIndex, setHistoryIndex] = useState(0);
    
    const [chartTitle, setChartTitle] = useState("Chart Title");
    const [tempTitle, setTempTitle] = useState("Chart Title");

    const [datasetSelected, setDatasetSelected] = useState(0);
    const [segmentSelected, setSegmentSelected] = useState(0);

    // Generate the initial chart image URL
    // useEffect(() => {
    //     if (chartConfig) {
    //     const Url = `${quickChartURL}${encodeURIComponent(JSON.stringify(chartConfig))}`;
    //     setChartImageUrl(Url);
    //     }
    // }, [chartConfig]);

    let styleConfig = {
       backgroundColor: null,
       canvasBackgroundColor: null,
       titleColor: null,
    }

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
                        size: fontSize
                    }
                };
            }
            if (!chartConfig.options.plugins.legend) {
                chartConfig.options.plugins.legend = {
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
                        }
                    },
                    x: {
                        ticks: {
                            font: {
                                family: "Noto Sans",
                                size: fontSize
                            }
                        }
                    }
                };
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
    const handleColorChange = (color) => {
        setSelectedColor(color.hex);        
        console.log("Confirmed background hex:", color.hex);
        
        // Convert hex to RGB for QuickChart API
        const rgbColor = hexToRgb(color.hex);
        console.log("Converted to RGB:", rgbColor);
        
        // Create a copy of chartConfig with RGB colors
        const updated = {
            ...chartConfig,
            chartStyle: {
                ...chartConfig.chartStyle,
                backgroundColor: rgbColor // Keep hex for internal state
            }
        };
        
        // Apply RGB colors to chart configuration for API
        if (updated.options) {
            if (updated.options.elements) {
                updated.options.elements.backgroundColor = rgbColor;
            }
        }
        
        // Check if it's a pie chart
        const isPieChart = chartConfig?.type === 'pie' || chartConfig?.type === 'doughnut';
        
        if (isPieChart) {
            // For pie charts, update the specific segment color
            console.log("Selected segment index:", segmentSelected);
            if (updated.data && updated.data.datasets && updated.data.datasets[0]) {
                const dataset = updated.data.datasets[0];
                if (Array.isArray(dataset.backgroundColor)) {
                    // Update specific segment
                    dataset.backgroundColor[segmentSelected] = rgbColor;
                } else {
                    // Convert single color to array and update specific segment
                    const dataLength = dataset.data ? dataset.data.length : 1;
                    dataset.backgroundColor = new Array(dataLength).fill(dataset.backgroundColor || rgbColor);
                    dataset.backgroundColor[segmentSelected] = rgbColor;
                }
            }
        } else {
            // For other charts, update the selected dataset
            console.log("Selected dataset index:", datasetSelected);
            if (updated.data && updated.data.datasets && updated.data.datasets[datasetSelected]) {
                updated.data.datasets[datasetSelected].backgroundColor = rgbColor;
            }
        }
        
        console.log("Updated chart config:", updated);
        updateChartConfig(updated);
    };

    // Handle chart title change
    const handleTitleChange = () => {
        setChartTitle(tempTitle);
        
        const updated = {
            ...chartConfig,
            options: {
                ...chartConfig.options,
                plugins: {
                    ...chartConfig.options?.plugins,
                    title: {
                        ...chartConfig.options?.plugins?.title,
                        display: true,
                        text: tempTitle,
                        font: {
                            ...chartConfig.options?.plugins?.title?.font,
                            family: activeFontFamily,
                            size: fontSize
                        }
                    }
                }
            }
        };
        
        updateChartConfig(updated);
    };

    // Handle text color change
    const handleTextColorChange = (color) => {
        setTextColor(color.hex);
        console.log("Confirmed text hex:", color.hex);
        
        // Create a copy of chartConfig with hex text colors (like background color)
        const updated = {
            ...chartConfig,
            chartStyle: {
                ...chartConfig.chartStyle,
                textColor: color.hex // Keep hex for internal state
            },
            options: {
                ...chartConfig.options,
                plugins: {
                    ...chartConfig.options?.plugins,
                    title: {
                        ...chartConfig.options?.plugins?.title,
                        color: color.hex // Update chart title color
                    },
                    legend: {
                        ...chartConfig.options?.plugins?.legend,
                        labels: {
                            ...chartConfig.options?.plugins?.legend?.labels,
                            color: color.hex // Use hex for API (like background)
                        }
                    }
                },
                scales: {
                    ...chartConfig.options?.scales,
                    x: {
                        ...chartConfig.options?.scales?.x,
                        ticks: { 
                            ...chartConfig.options?.scales?.x?.ticks,
                            color: color.hex // Use hex for API (like background)
                        },
                        title: {
                            ...chartConfig.options?.scales?.x?.title,
                            color: color.hex // Update x-axis title color
                        }
                    },
                    y: {
                        ...chartConfig.options?.scales?.y,
                        ticks: { 
                            ...chartConfig.options?.scales?.y?.ticks,
                            color: color.hex // Use hex for API (like background)
                        },
                        title: {
                            ...chartConfig.options?.scales?.y?.title,
                            color: color.hex // Update y-axis title color
                        }
                    }
                }
            }
        };
        
        updateChartConfig(updated);
    };

    const handleFontSizeChange = (e) => {
        const newSize = parseInt(e.target.value, 10);
        setFontSize(newSize);

        const updated = {
            ...chartConfig,
            options: {
                ...chartConfig.options,
                plugins: {
                    ...chartConfig.options?.plugins,
                    title: {
                        ...chartConfig.options?.plugins?.title,
                        font: {
                            ...chartConfig.options?.plugins?.title?.font,
                            family: activeFontFamily,
                            size: newSize
                        }
                    },
                    legend: {
                        ...chartConfig.options?.plugins?.legend,
                        labels: {
                            ...chartConfig.options?.plugins?.legend?.labels,
                            font: {
                                family: activeFontFamily,
                                size: newSize
                            }
                        }
                    }
                },
                scales: {
                    ...chartConfig.options?.scales,
                    x: {
                        ...chartConfig.options?.scales?.x,
                        ticks: {
                            ...chartConfig.options?.scales?.x?.ticks,
                            font: {
                                family: activeFontFamily,
                                size: newSize
                            }
                        }
                    },
                    y: {
                        ...chartConfig.options?.scales?.y,
                        ticks: {
                            ...chartConfig.options?.scales?.y?.ticks,
                            font: {
                                family: activeFontFamily,
                                size: newSize
                            }
                        }
                    }
                }
            }
        };

        updateChartConfig(updated);
    };

    // helper function to update chart config and maintain history
    const updateChartConfig = (newConfig) => {
        const updatedHistory = history.slice(0, historyIndex + 1);
        updatedHistory.push(newConfig);
        setHistory(updatedHistory);
        setHistoryIndex(updatedHistory.length - 1);
        setChartConfig(newConfig);
        setChartImageUrl(`${quickChartURL}${encodeURIComponent(JSON.stringify(newConfig))}`);
    };

    // Handle undo and redo actions
    const handleUndo = () => {
    if (historyIndex > 0) {
        const prevIndex = historyIndex - 1;
        setChartConfig(history[prevIndex]);
        setHistoryIndex(prevIndex);
        setSelectedColor(history[prevIndex].chartStyle?.backgroundColor || "#4F46E5");
        setTextColor(history[prevIndex].chartStyle?.textColor || "#000000");
        const prevTitle = history[prevIndex].options?.plugins?.title?.text || "Chart Title";
        setChartTitle(prevTitle);
        setTempTitle(prevTitle);
        const prevFontFamily = history[prevIndex].options?.plugins?.title?.font?.family || "Noto Sans";
        const prevFontSize = history[prevIndex].options?.plugins?.title?.font?.size || 14;
        setActiveFontFamily(prevFontFamily);
        setFontSize(prevFontSize);
        
        // Reset selections to stay within bounds of the restored config
        setDatasetSelected(0);
        setSegmentSelected(0);
    }
    };

    const handleRedo = () => {
    if (historyIndex < history.length - 1) {
        const nextIndex = historyIndex + 1;
        setChartConfig(history[nextIndex]);
        setHistoryIndex(nextIndex);
        setSelectedColor(history[nextIndex].chartStyle?.backgroundColor || "#4F46E5");
        setTextColor(history[nextIndex].chartStyle?.textColor || "#000000");
        const nextTitle = history[nextIndex].options?.plugins?.title?.text || "Chart Title";
        setChartTitle(nextTitle);
        setTempTitle(nextTitle);
        const nextFontFamily = history[nextIndex].options?.plugins?.title?.font?.family || "Noto Sans";
        const nextFontSize = history[nextIndex].options?.plugins?.title?.font?.size || 14;
        setActiveFontFamily(nextFontFamily);
        setFontSize(nextFontSize);
        
        // Reset selections to stay within bounds of the restored config
        setDatasetSelected(0);
        setSegmentSelected(0);
    }
    };

    const handleReset = () => {
    setChartConfig(initialConfig);
    setSelectedColor(initialConfig.chartStyle?.backgroundColor || "#4F46E5");
    setTextColor(initialConfig.chartStyle?.textColor || "#000000");
    const initialTitle = initialConfig.options?.plugins?.title?.text || "Chart Title";
    setChartTitle(initialTitle);
    setTempTitle(initialTitle);
    const initialFontFamily = initialConfig.options?.plugins?.title?.font?.family || "Noto Sans";
    const initialFontSize = initialConfig.options?.plugins?.title?.font?.size || 14;
    setActiveFontFamily(initialFontFamily);
    setFontSize(initialFontSize);
    setDatasetSelected(0); // Reset to first dataset
    setSegmentSelected(0); // Reset to first segment
    setHistory([initialConfig]);
    setHistoryIndex(0);
    };

    // Handle font change
    const handleFontChange = (e) => {
        const newFontFamily = e.target.value;
        setActiveFontFamily(newFontFamily);

        const updated = {
            ...chartConfig,
            options: {
                ...chartConfig.options,
                plugins: {
                    ...chartConfig.options?.plugins,
                    title: {
                        ...chartConfig.options?.plugins?.title,
                        font: {
                            ...chartConfig.options?.plugins?.title?.font,
                            family: newFontFamily,
                            size: fontSize
                        }
                    },
                    legend: {
                        ...chartConfig.options?.plugins?.legend,
                        labels: {
                            ...chartConfig.options?.plugins?.legend?.labels,
                            font: {
                                family: newFontFamily,
                                size: fontSize
                            }
                        }
                    }
                },
                scales: {
                    ...chartConfig.options?.scales,
                    x: {
                        ...chartConfig.options?.scales?.x,
                        ticks: {
                            ...chartConfig.options?.scales?.x?.ticks,
                            font: {
                                family: newFontFamily,
                                size: fontSize
                            }
                        }
                    },
                    y: {
                        ...chartConfig.options?.scales?.y,
                        ticks: {
                            ...chartConfig.options?.scales?.y?.ticks,
                            font: {
                                family: newFontFamily,
                                size: fontSize
                            }
                        }
                    }
                }
            }
        };
        
        updateChartConfig(updated);
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
                <div className="flex flex-col md:flex-row gap-8 w-full">
                    {/* Display the chart image */}
                    <div className="flex-1 bg-white rounded-xl p-4 sm:p-6 shadow-lg relative">
                        <div>
                            <h2 className="font-semibold flex items-center justify-center gap-4 mb-2">
                            {/* <Edit3 size={30} />
                            Edit Chart */}

                            <div className="flex ml-6 space-x-3">
                                <button
                                onClick={handleUndo}
                                disabled={historyIndex === 0}
                                className="flex items-center gap-1 px-3 py-1 rounded-md border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Undo"
                                >
                                <RotateCcw size={18} />
                                </button>

                                <button
                                onClick={handleRedo}
                                disabled={historyIndex === history.length - 1}
                                className="flex items-center gap-1 px-3 py-1 rounded-md border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Redo"
                                >
                                <RotateCw size={18} />
                                </button>

                                <button
                                onClick={handleReset}
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
                                    className="w-full max-w-md mx-auto rounded-md shadow-md"
                                />
                                ) : (
                                <p className="text-center text-gray-500">No chart available</p>
                                )}
                            </>
                        </div>
                    </div>



                    <div className="space-y-6">

                        {/* Chart Title section */}
                        <div className="bg-white rounded-2xl shadow-md p-4 border border-gray-200 space-y-4">
                            <div className="flex items-center gap-2 mb-2">
                                <Text size={18} className="text-black" strokeWidth={2.5} />
                                <p className="text-lg font-semibold text-gray-800">Chart Title</p>
                            </div>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={tempTitle}
                                    onChange={(e) => setTempTitle(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleTitleChange()}
                                    placeholder="Enter chart title"
                                    className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                                />
                                <button
                                    onClick={handleTitleChange}
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
                                >
                                    Update
                                </button>
                            </div>
                        </div>

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
                                        onChange={handleFontChange}
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
                                        onChange={handleFontSizeChange}
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

                        {/* Dataset/Segment Selection section */}
                        {(() => {
                            const isPieChart = chartConfig?.type === 'pie' || chartConfig?.type === 'doughnut';
                            const shouldShowSelection = isPieChart 
                                ? chartConfig?.data?.datasets?.[0]?.data?.length > 1
                                : chartConfig?.data?.datasets?.length > 1;

                            if (!shouldShowSelection) return null;

                            return (
                                <div className="bg-white rounded-2xl shadow-md p-4 border border-gray-200 space-y-4">
                                    <p className="text-lg font-semibold text-gray-800 mb-2">
                                        {isPieChart ? 'Select Segment' : 'Select Dataset'}
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {isPieChart ? (
                                            // Pie chart segments
                                            chartConfig.data.datasets[0].data.map((value, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => setSegmentSelected(index)}
                                                    className={`px-4 py-2 rounded-lg border transition-all duration-200 ${
                                                        segmentSelected === index
                                                            ? 'bg-blue-600 text-white border-blue-600'
                                                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
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
                                <Paintbrush size={18} className="text-black" strokeWidth={2.5}/>
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
                            <div className="flex flex-col sm:flex-row gap-4">

                                {/* This is the button where they choose the background colour*/}
                                <button
                                className={`flex-1 ${showBackgroundPicker ? 'bg-cyan-500 hover:bg-cyan-600' : 'bg-blue-600 hover:bg-blue-700'} text-white px-4 py-2 rounded-md transition cursor-pointer`}
                                onClick={() => {
                                    if (showBackgroundPicker) {
                                    setSelectedColor(tempBackgroundColor); // final color to state
                                    handleColorChange({ hex: tempBackgroundColor }); // call your function
                                    setShowBackgroundPicker(false); // hide picker
                                    } else {
                                    setShowBackgroundPicker(true); // open picker
                                    setShowTextPicker(false);
                                    }
                                }}
                                >
                                {showBackgroundPicker ? "Confirm Chart Colour" : "Chart Colour"}
                                </button>

                                {/* This is the button where they choose the text colour*/}
                                <button
                                className={`flex-1 ${showTextPicker ? 'bg-cyan-500 hover:bg-cyan-600' : 'bg-blue-600 hover:bg-blue-700'} text-white px-4 py-2 rounded-md transition cursor-pointer`}
                                onClick={() => {
                                    if (showTextPicker) {
                                    setTextColor(tempTextColor);
                                    handleTextColorChange({ hex: tempTextColor });
                                    setShowTextPicker(false);
                                    } else {
                                    setShowTextPicker(true);
                                    setShowBackgroundPicker(false);
                                    }
                                }}
                                >
                                {showTextPicker ? "Confirm Text Colour" : "Text Colour"}
                                </button>
                            </div>
                        </div>

                        {/* Background picker */}
                        {showBackgroundPicker && (
                        <div className="flex flex-col items-center gap-4 mb-6">
                            <SketchPicker
                            color={tempBackgroundColor}
                            onChangeComplete={(color) => setTempBackgroundColor(color.hex)}
                            disableAlpha={true}
                            />
                        </div>
                        )}

                        {/* Text picker */}
                        {showTextPicker && (
                        <div className="flex flex-col items-center gap-4 mb-6">
                            <SketchPicker
                            color={tempTextColor}
                            onChangeComplete={(color) => setTempTextColor(color.hex)}
                            disableAlpha={true}
                            />
                        </div>
                        )}

                        {isDownloadModalOpen && (
                            <DownloadOptions
                            onClose={() => setIsDownloadModalOpen(false)}
                            chartImageUrl={chartImageUrl}
                            />
                        )}

                        {/* downloading button, downloading thing is a component */}
                        <div className="w-full">
                        <button
                            className="w-full bg-blue-600 hover:bg-gray-300 text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition duration-200 ease-in-out flex items-center justify-center gap-2 cursor-pointer"
                            onClick={() => setIsDownloadModalOpen(true)}
                        >
                            <Download size={18} strokeWidth={4}/>
                            Download
                        </button>
                        </div>
                    </div>
                </div>
            </div>
            <EditSaveButtons />
        </div>
    );
}

export default EditSave;
