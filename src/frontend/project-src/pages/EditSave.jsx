import EditSaveStepper from "../components/editsave/EditSaveStepper";
import EditSaveButtons from "../components/editsave/EditSaveButtons";
import { SketchPicker } from 'react-color';
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
// import FontPicker from 'font-picker-react'; // Replaced with custom Noto fonts dropdown
import DownloadOptions from '../components/editsave/DownloadOptions';
import { Loader2, Text, Paintbrush, Download, Edit3, RotateCcw, RotateCw, RefreshCw, Check, MousePointerClick, TextCursorInput, Columns3Cog } from 'lucide-react';

const quickChartURL = "https://quickchart.io/chart?height=500&backgroundColor=white&v=4&c=";

// Google Noto fonts supported by QuickChart
const notoFonts = [
    { name: "Noto Sans", value: "Noto Sans" },
    { name: "Noto Serif", value: "Noto Serif" },
    { name: "Noto Sans Display", value: "Noto Sans Display" },
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

// Utility function to convert RGB string back to hex
const rgbToHex = (rgb) => {
    if (!rgb || typeof rgb !== 'string') return '#36A2EB';
    
    // If it's already a hex color, return it
    if (rgb.startsWith('#')) return rgb;
    
    // Extract RGB values from rgb(r, g, b) or rgba(r, g, b, a) format
    const rgbMatch = rgb.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (!rgbMatch) return '#36A2EB';
    
    const r = parseInt(rgbMatch[1], 10);
    const g = parseInt(rgbMatch[2], 10);
    const b = parseInt(rgbMatch[3], 10);
    
    // Convert to hex
    const toHex = (n) => {
        const hex = n.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    };
    
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
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

    // Generate the initial chart image URL
    // useEffect(() => {
    //     if (chartConfig) {
    //     const Url = `${quickChartURL}${encodeURIComponent(JSON.stringify(chartConfig))}`;
    //     setChartImageUrl(Url);
    //     }
    // }, [chartConfig]);

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
                        size: fontSize
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
    const handleColorChange = (color) => {
        if (color.hex != selectedColor) {
            setSelectedColor(color.hex);        
    
            // Convert hex to RGB for QuickChart API
            const rgbColor = hexToRgb(color.hex);
            
            // Create a copy of chartConfig with RGB colors
            const updated = {
                ...chartConfig,
                chartStyle: {
                    ...chartConfig.chartStyle,
                    backgroundColor: color.hex // Keep hex for internal state
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
                    updated.data.datasets[datasetSelected].borderColor = rgbColor;
                }
            }
            console.log("Updated chart config:", updated);
            updateChartConfig(updated);

        }
    };

    // Handle chart title change
    const handleTitleChange = () => {
        if (tempTitle != chartTitle) {
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
        }
    };

    const handleAxisTitleChange = (axis, title) => {
        const currentXAxisTitle = chartConfig.options?.scales?.x?.title?.text || "X-axis";
        const currentYAxisTitle = chartConfig.options?.scales?.y?.title?.text || "";

        // Only proceed if the new title is different from the current one
        if ((axis === "x" && title !== currentXAxisTitle) || 
            (axis === "y" && title !== currentYAxisTitle)) {

            if (axis === "x") {
                setTempXAxisTitle(title);
            } else {
                setTempYAxisTitle(title);
            }

            const updated = {
                ...chartConfig,
                options: {
                    ...chartConfig.options,
                    scales: {
                        ...chartConfig.options?.scales,
                        x: {
                            ...chartConfig.options?.scales?.x,
                            title: {
                                ...chartConfig.options?.scales?.x?.title,
                                text: axis === "x" ? title : currentXAxisTitle
                            }
                        },
                        y: {
                            ...chartConfig.options?.scales?.y,
                            title: {
                                ...chartConfig.options?.scales?.y?.title,
                                text: axis === "y" ? title : currentYAxisTitle
                            }
                        }
                    }
                }
            };

            updateChartConfig(updated);
        }
    }

    // Handle text color change
    const handleTextColorChange = (color) => {
        if (color.hex != textColor) {   
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

        }
    };

    const handleFontSizeChange = (e) => {
        const newSize = parseInt(e.target.value, 10);
        if (newSize != fontSize) {
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
                            },
                            title: {
                                ...chartConfig.options?.scales?.x?.title,
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
                            },
                            title: {
                                ...chartConfig.options?.scales?.y?.title,
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
        }
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
    const handleUndo = () => {
        if (historyIndex > 0) {
            const prevIndex = historyIndex - 1;
            const prevSelection = selectionHistory[prevIndex];
            // Restore the previous dataset/segment selection
            setDatasetSelected(prevSelection.dataset);
            setSegmentSelected(prevSelection.segment);
            setChartConfig(history[prevIndex]);
            setHistoryIndex(prevIndex);
            setSelectedColor(history[prevIndex].chartStyle?.backgroundColor || "#36A2EB");
            setTextColor(history[prevIndex].chartStyle?.textColor || "#000000");
            const prevTitle = history[prevIndex].options?.plugins?.title?.text || "Chart Title";
            setChartTitle(prevTitle);
            setTempTitle(prevTitle);
            const prevFontFamily = history[prevIndex].options?.plugins?.title?.font?.family || "Noto Sans";
            const prevFontSize = history[prevIndex].options?.plugins?.title?.font?.size || 14;
            setActiveFontFamily(prevFontFamily);
            setFontSize(prevFontSize);
            

        }
    };

    const handleRedo = () => {
        if (historyIndex < history.length - 1) {
            const nextIndex = historyIndex + 1;
            const nextSelection = selectionHistory[nextIndex];
            // Restore the next dataset/segment selection
            setDatasetSelected(nextSelection.dataset);
            setSegmentSelected(nextSelection.segment);
            setChartConfig(history[nextIndex]);
            setHistoryIndex(nextIndex);
            setSelectedColor(history[nextIndex].chartStyle?.backgroundColor || "#36A2EB");
            setTextColor(history[nextIndex].chartStyle?.textColor || "#000000");
            const nextTitle = history[nextIndex].options?.plugins?.title?.text || "Chart Title";
            setChartTitle(nextTitle);
            setTempTitle(nextTitle);
            const nextFontFamily = history[nextIndex].options?.plugins?.title?.font?.family || "Noto Sans";
            const nextFontSize = history[nextIndex].options?.plugins?.title?.font?.size || 14;
            setActiveFontFamily(nextFontFamily);
            setFontSize(nextFontSize);
            

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
        setSelectionHistory([{ dataset: 0, segment: 0 }]); // Reset selection history
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
                        },
                        title: {
                            ...chartConfig.options?.scales?.x?.title,
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
                        },
                        title: {
                            ...chartConfig.options?.scales?.y?.title,
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

    const handleGridLines = () => {
        setGridLines((prev) => {
            const newGridState = !prev;
        
            const updated = {
              ...chartConfig,
              options: {
                ...chartConfig.options,
                scales: {
                  ...chartConfig.options?.scales,
                  x: {
                    ...chartConfig.options?.scales?.x,
                    grid: {
                      ...chartConfig.options?.scales?.x?.grid,
                      display: newGridState
                    }
                  },
                  y: {
                    ...chartConfig.options?.scales?.y,
                    grid: {
                      ...chartConfig.options?.scales?.y?.grid,
                      display: newGridState
                    }
                  }
                }
              }
            };
        
            updateChartConfig(updated);
            return newGridState;
          });
    }

    const handleLegend = () => {
        setLegend((prev) => {
            const newLegendState = !prev;
        
            const updated = {
              ...chartConfig,
              options: {
                ...chartConfig.options,
                plugins: {
                  ...chartConfig.options?.plugins,
                  legend: {
                    ...chartConfig.options?.plugins?.legend,
                    display: newLegendState,
                    labels: {
                      ...chartConfig.options?.plugins?.legend?.labels
                    }
                  }
                }
              }
            };
        
            updateChartConfig(updated);
            return newLegendState;
        });
    }

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
                                        onClick={handleTitleChange}
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
                                        onClick={() => handleAxisTitleChange("x", tempXAxisTitle)}
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
                                        onClick={() => handleAxisTitleChange("y", tempYAxisTitle)}
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
                                            handleColorChange({ hex: tempBackgroundColor });
                                            } else {
                                            setTextColor(tempTextColor);
                                            handleTextColorChange({ hex: tempTextColor });
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
                                    onClick={handleGridLines} 
                                    className="w-1/2 primary-button text-center cursor-pointer justify-center"
                                    >
                                    {gridLines ? "Disable Grid Lines" : "Enable Grid Lines"}
                                    </button>

                                    <button 
                                    onClick={handleLegend} 
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
