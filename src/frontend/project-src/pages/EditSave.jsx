import EditSaveStepper from "../components/editsave/EditSaveStepper";
import EditSaveButtons from "../components/editsave/EditSaveButtons";
// import { Download } from 'lucide-react';
import { SketchPicker } from 'react-color';
import { useLocation } from "react-router-dom";
import generateChartUrl from "../utils/generateChartURL";
import { useState, useEffect } from "react";
import FontPicker from 'font-picker-react';

function EditSave() {
    const location = useLocation();
    const { chartConfig: initialConfig } = location.state || {};
    console.log(initialConfig);

    const [chartConfig, setChartConfig] = useState(initialConfig);
    const [chartImageUrl, setChartImageUrl] = useState("");
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
                            <h2 className="font-semibold text-center">Edit Chart</h2>
                            <p className="text-md text-gray-600 text-center mb-6">
                            Review and edit your generated chart below.
                            </p>

                            
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
                    {/* Configuration and customization options */} 
                    <div className="space-y-6">
                        {/* Font Family Picker */}
                        <div className="flex flex-col items-center gap-4">
                            <p className="text-md font-medium">Font Family</p>
                            <FontPicker
                                apiKey="AIzaSyAQpYbiU5EWYssK3K2rrBgcLFkz1CetCq8"
                                activeFontFamily={activeFontFamily}
                                onChange={handleFontChange}
                            />
                        </div>

                        {/* Font Size Slider */}
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

                        {/* Font Size Slider */}
                        <div className="flex flex-col items-center gap-4 w-full">
                            <label htmlFor="fontSizeSlider" className="text-sm text-gray-700">Font Size: {fontSize}px</label>
                            <input
                                id="fontSizeSlider"
                                type="range"
                                min="10"
                                max="32"
                                value={fontSize}
                                onChange={handleFontSizeChange}
                                className="w-full"
                            />
                        </div>
                        
                        {/* Background Color Picker */}
                        <div className="flex flex-col items-center gap-4">
                            <p className="text-md font-medium">Background Color</p>
                            <SketchPicker color={selectedColor} onChangeComplete={handleColorChange} />
                        </div>

                        {/* Text Color Picker */}
                        <div className="flex flex-col items-center gap-4">
                            <p className="text-md font-medium">Text Color</p>
                            <SketchPicker color={textColor} onChangeComplete={handleTextColorChange} />
                        </div>

                        

                        {/* Action Buttons */}
                        <div className="flex justify-center gap-4 mt-4 flex-wrap">
                            <button onClick={handleUndo} disabled={historyIndex === 0} className="gray-base-button">Undo</button>
                            <button onClick={handleRedo} disabled={historyIndex === history.length - 1} className="gray-base-button">Redo</button>
                            <button onClick={handleReset} className="gray-base-button">Reset</button>
                            <button
                            onClick={() => {
                                const link = document.createElement("a");
                                link.href = chartImageUrl;
                                link.download = "chart.png";
                                link.click();
                            }}
                            className="blue-base-button"
                            >
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
