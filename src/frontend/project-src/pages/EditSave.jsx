import EditSaveStepper from "../components/editsave/EditSaveStepper";
import EditSaveButtons from "../components/editsave/EditSaveButtons";
// import { Download } from 'lucide-react';
import { SketchPicker } from 'react-color';
import { useLocation } from "react-router-dom";
import generateChartUrl from "../utils/generateChartURL";
import { useState, useEffect } from "react";
import FontPicker from 'font-picker-react';
import DownloadOptions from '../components/editchart/DownloadOptions';
import { Download, Edit3, RotateCcw, RotateCw, RefreshCw } from 'lucide-react';

function EditSave() {
    const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
    const chartImageUrl = 'https://dummyimage.com/600x600'; 
    const location = useLocation();
    const { chartConfig: initialConfig } = location.state || {};
    const [showBackgroundPicker, setShowBackgroundPicker] = useState(false);
    const [showTextPicker, setShowTextPicker] = useState(false);
    console.log(initialConfig);

    const [chartConfig, setChartConfig] = useState(initialConfig);
    //const [chartImageUrl, setChartImageUrl] = useState("");
    const [selectedColor, setSelectedColor] = useState(initialConfig?.chartStyle?.backgroundColor || "#4F46E5");
    const [textColor, setTextColor] = useState(initialConfig?.chartStyle?.textColor || "#000000");

    const [activeFontFamily, setActiveFontFamily] = useState("Open Sans");
    const [fontSize, setFontSize] = useState(14); 

    const [fontStyle, setFontStyle] = useState({
        bold: false,
        italic: false,
        underline: false
    });

    const [history, setHistory] = useState([initialConfig]);
    const [historyIndex, setHistoryIndex] = useState(0);

    // Generate the initial chart image URL
    useEffect(() => {
        if (chartConfig) {
        const newUrl = generateChartUrl(chartConfig);
        setChartImageUrl(Url);
        }
    }, [chartConfig]);

    
    // Handle color change from the color picker
    const handleColorChange = (color) => {
    setSelectedColor(color.hex);
    const updated = {
        ...chartConfig,
        chartStyle: {
        ...chartConfig.chartStyle,
        backgroundColor: color.hex
        }
    };
    updateChartConfig(updated);
    };

    // Handle text color change
    const handleTextColorChange = (color) => {
    setTextColor(color.hex);
    const updated = {
        ...chartConfig,
        chartStyle: {
        ...chartConfig.chartStyle,
        textColor: color.hex
        },
        chartOptions: {
        ...chartConfig.chartOptions,
        plugins: {
            legend: {
            labels: {
                color: color.hex
            }
            }
        },
        scales: {
            x: {
            ticks: { color: color.hex }
            },
            y: {
            ticks: { color: color.hex }
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
            chartOptions: {
            ...chartConfig.chartOptions,
            plugins: {
                ...chartConfig.chartOptions?.plugins,
                legend: {
                labels: {
                    ...chartConfig.chartOptions?.plugins?.legend?.labels,
                    font: {
                    family: activeFontFamily,
                    size: newSize
                    }
                }
                }
            },
            scales: {
                x: {
                ticks: {
                    ...chartConfig.chartOptions?.scales?.x?.ticks,
                    font: {
                    family: activeFontFamily,
                    size: newSize
                    }
                }
                },
                y: {
                ticks: {
                    ...chartConfig.chartOptions?.scales?.y?.ticks,
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
    };

    // Handle undo and redo actions
    const handleUndo = () => {
    if (historyIndex > 0) {
        const prevIndex = historyIndex - 1;
        setChartConfig(history[prevIndex]);
        setHistoryIndex(prevIndex);
        setSelectedColor(history[prevIndex].chartStyle?.backgroundColor || "#4F46E5");
        setTextColor(history[prevIndex].chartStyle?.textColor || "#000000");
    }
    };

    const handleRedo = () => {
    if (historyIndex < history.length - 1) {
        const nextIndex = historyIndex + 1;
        setChartConfig(history[nextIndex]);
        setHistoryIndex(nextIndex);
        setSelectedColor(history[nextIndex].chartStyle?.backgroundColor || "#4F46E5");
        setTextColor(history[nextIndex].chartStyle?.textColor || "#000000");
    }
    };

    const handleReset = () => {
    setChartConfig(initialConfig);
    setSelectedColor(initialConfig.chartStyle?.backgroundColor || "#4F46E5");
    setTextColor(initialConfig.chartStyle?.textColor || "#000000");
    setHistory([initialConfig]);
    setHistoryIndex(0);
    };

    // Handle font change
    const handleFontChange = (nextFont) => {
    setActiveFontFamily(nextFont.family);

    const updated = {
        ...chartConfig,
        chartOptions: {
        ...chartConfig.chartOptions,
        plugins: {
            ...chartConfig.chartOptions?.plugins,
            legend: {
            labels: {
                ...chartConfig.chartOptions?.plugins?.legend?.labels,
                font: {
                family: nextFont.family
                }
            }
            }
        },
        scales: {
            x: {
            ticks: {
                ...chartConfig.chartOptions?.scales?.x?.ticks,
                font: {
                family: nextFont.family
                }
            }
            },
            y: {
            ticks: {
                ...chartConfig.chartOptions?.scales?.y?.ticks,
                font: {
                family: nextFont.family
                }
            }
            }
        }
        }
    };

    updateChartConfig(updated);
    };
    
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 sm:p-8 font-inter">
            <EditSaveStepper />
            <div className="bg-blue-50 rounded-2xl shadow-lg px-4 sm:px-6 md:px-8 py-6 w-full">
                <div className="flex flex-col md:flex-row gap-8 w-full">
                    {/* Display the chart image */}
                    <div className="flex-1 bg-white rounded-xl p-4 sm:p-6 shadow-lg">
                        <div>
                            <h2 className="font-semibold flex items-center justify-center gap-4 mb-2">
                            <Edit3 size={30} />
                            Edit Chart


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

                            
                            {chartImageUrl ? (
                            <img
                                src={chartImageUrl}
                                alt="Live Chart Preview"
                                className="w-full max-w-md mx-auto rounded-md shadow-md"
                            />
                            ) : (
                            <p className="text-center text-gray-500">No chart available</p>
                            )}
                        </div>
                    </div>



                    <div className="space-y-6">
                        <div
                            className="p-2 mt-2 border rounded-md bg-white shadow text-center"
                            style={{
                                fontFamily: activeFontFamily,
                                fontWeight: fontStyle.bold ? "bold" : "normal",
                                fontStyle: fontStyle.italic ? "italic" : "normal",
                                textDecoration: fontStyle.underline ? "underline" : "none",
                                fontSize: `${fontSize}px`,
                                color: textColor
                            }}
                            >
                            Live Preview: This is your chart text
                        </div>

                        <div className="w-full max-w-sm bg-white rounded-2xl shadow-md p-4 flex items-center gap-4 border border-gray-200">
                            <p className="text-md font-bold text-gray-800">Font Family</p>
                            <div>
                                <FontPicker
                                apiKey="AIzaSyAQpYbiU5EWYssK3K2rrBgcLFkz1CetCq8"
                                activeFontFamily={activeFontFamily}
                                onChange={handleFontChange}
                                />
                            </div>
                            </div>

                        <div className="w-full max-w-sm bg-white rounded-2xl shadow-md p-4 flex items-center gap-4 border border-gray-200">
                        <label htmlFor="fontSizeDropdown" className="text-md font-bold text-black-800">
                            Font Size
                        </label>
                        <select
                            id="fontSizeDropdown"
                            value={fontSize}
                            onChange={handleFontSizeChange}
                            className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                        >
                            {[6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 28, 32].map((size) => (
                            <option key={size} value={size}>
                                {size}px
                            </option>
                            ))}
                        </select>
                        </div>

                        {/* Section with two buttons that will cause the colour picker to pop up */}
                        <div className="flex justify-center gap-4 mb-4">
                        {/* for the background colour */}
                        <button
                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-00 transition"
                            onClick={() => setShowBackgroundPicker((prev) => !prev)}
                        >
                            {showBackgroundPicker ? "Hide Background Color" : "Edit Background Color"}
                        </button>

                        {/* for the text colour */}
                        <button
                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                            onClick={() => setShowTextPicker((prev) => !prev)}
                        >
                            {showTextPicker ? "Hide Text Color" : "Edit Text Color"}
                        </button>
                        </div>


                        {showBackgroundPicker && (
                        <div className="flex flex-col items-center gap-4 mb-6">
                            <SketchPicker color={selectedColor} onChangeComplete={handleColorChange} />
                        </div>
                        )}


                        {showTextPicker && (
                        <div className="flex flex-col items-center gap-4 mb-6">
                            <SketchPicker color={textColor} onChangeComplete={handleTextColorChange} />
                        </div>
                        )}




                        {isDownloadModalOpen && (
                            <DownloadOptions
                            onClose={() => setIsDownloadModalOpen(false)}
                            chartImageUrl={chartImageUrl}
                            />
                        )}

                        <div className="w-full">
                        <button
                            className="w-full bg-blue-600 hover:bg-gray-300 text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition duration-200 ease-in-out flex items-center justify-center gap-2"
                            onClick={() => setIsDownloadModalOpen(true)}
                        >
                            <Download size={18} />
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
