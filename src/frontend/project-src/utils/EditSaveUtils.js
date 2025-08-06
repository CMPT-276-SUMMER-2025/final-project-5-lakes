// Constants
const TITLE_FONT_SIZE_RATIO = 1.5;
const QUICK_CHART_URL = "https://quickchart.io/chart?height=500&backgroundColor=white&v=4&c=";

// Utility functions
export const getTitleFontSize = (baseFontSize) => {
    return Math.round(baseFontSize * TITLE_FONT_SIZE_RATIO);
};

export const getBaseFontSize = (titleFontSize) => {
    return Math.round(titleFontSize / TITLE_FONT_SIZE_RATIO);
};

export const hexToRgb = (hex) => {
    hex = hex.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `rgb(${r}, ${g}, ${b})`;
};

export const rgbToHex = (rgb) => {
    if (!rgb || typeof rgb !== 'string') return '#36A2EB';
    if (rgb.startsWith('#')) return rgb;
    
    const rgbMatch = rgb.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (!rgbMatch) return '#36A2EB';
    
    const r = parseInt(rgbMatch[1], 10);
    const g = parseInt(rgbMatch[2], 10);
    const b = parseInt(rgbMatch[3], 10);
    
    const toHex = (n) => {
        const hex = n.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    };
    
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

// Button handler functions
export const handleColorChange = (color, selectedColor, chartConfig, datasetSelected, segmentSelected, setSelectedColor, updateChartConfig) => {
    if (color.hex !== selectedColor) {
        setSelectedColor(color.hex);
        
        const rgbColor = hexToRgb(color.hex);
        
        const updated = {
            ...chartConfig,
            chartStyle: {
                ...chartConfig.chartStyle,
                backgroundColor: color.hex
            }
        };
        
        if (updated.options) {
            if (updated.options.elements) {
                updated.options.elements.backgroundColor = rgbColor;
            }
        }
        
        const isPieChart = chartConfig?.type === 'pie' || chartConfig?.type === 'doughnut';
        
        if (isPieChart) {
            if (updated.data && updated.data.datasets && updated.data.datasets[0]) {
                const dataset = updated.data.datasets[0];
                if (Array.isArray(dataset.backgroundColor)) {
                    dataset.backgroundColor[segmentSelected] = rgbColor;
                } else {
                    const dataLength = dataset.data ? dataset.data.length : 1;
                    dataset.backgroundColor = new Array(dataLength).fill(dataset.backgroundColor || rgbColor);
                    dataset.backgroundColor[segmentSelected] = rgbColor;
                }
            }
        } else {
            if (updated.data && updated.data.datasets && updated.data.datasets[datasetSelected]) {
                updated.data.datasets[datasetSelected].backgroundColor = rgbColor;
                updated.data.datasets[datasetSelected].borderColor = rgbColor;
            }
        }
        
        updateChartConfig(updated);
    }
};

export const handleTitleChange = (tempTitle, chartTitle, chartConfig, activeFontFamily, fontSize, setChartTitle, updateChartConfig) => {
    if (tempTitle !== chartTitle) {
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
                            size: getTitleFontSize(fontSize)
                        }
                    }
                }
            }
        };
        
        updateChartConfig(updated);
    }
};

export const handleAxisTitleChange = (axis, title, chartConfig, setTempXAxisTitle, setTempYAxisTitle, updateChartConfig) => {
    const currentXAxisTitle = chartConfig.options?.scales?.x?.title?.text || "X-axis";
    const currentYAxisTitle = chartConfig.options?.scales?.y?.title?.text || "";

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
};

export const handleTextColorChange = (color, textColor, chartConfig, setTextColor, updateChartConfig) => {
    if (color.hex !== textColor) {
        setTextColor(color.hex);
        
        const updated = {
            ...chartConfig,
            chartStyle: {
                ...chartConfig.chartStyle,
                textColor: color.hex
            },
            options: {
                ...chartConfig.options,
                plugins: {
                    ...chartConfig.options?.plugins,
                    title: {
                        ...chartConfig.options?.plugins?.title,
                        color: color.hex
                    },
                    legend: {
                        ...chartConfig.options?.plugins?.legend,
                        labels: {
                            ...chartConfig.options?.plugins?.legend?.labels,
                            color: color.hex
                        }
                    }
                },
                scales: {
                    ...chartConfig.options?.scales,
                    x: {
                        ...chartConfig.options?.scales?.x,
                        ticks: { 
                            ...chartConfig.options?.scales?.x?.ticks,
                            color: color.hex
                        },
                        title: {
                            ...chartConfig.options?.scales?.x?.title,
                            color: color.hex
                        }
                    },
                    y: {
                        ...chartConfig.options?.scales?.y,
                        ticks: { 
                            ...chartConfig.options?.scales?.y?.ticks,
                            color: color.hex
                        },
                        title: {
                            ...chartConfig.options?.scales?.y?.title,
                            color: color.hex
                        }
                    }
                }
            }
        };
        
        updateChartConfig(updated);
    }
};

export const handleFontSizeChange = (e, fontSize, chartConfig, activeFontFamily, setFontSize, updateChartConfig) => {
    const newSize = parseInt(e.target.value, 10);
    if (newSize !== fontSize) {
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
                            size: getTitleFontSize(newSize)
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

export const handleUndo = (historyIndex, history, selectionHistory, setDatasetSelected, setSegmentSelected, setChartConfig, setHistoryIndex, setSelectedColor, setTextColor, setChartTitle, setTempTitle, setActiveFontFamily, setFontSize, setChartImageUrl) => {
    if (historyIndex > 0) {
        const prevIndex = historyIndex - 1;
        const prevSelection = selectionHistory[prevIndex];
        const prevConfig = history[prevIndex];
        
        setDatasetSelected(prevSelection.dataset);
        setSegmentSelected(prevSelection.segment);
        setChartConfig(prevConfig);
        setHistoryIndex(prevIndex);
        setSelectedColor(prevConfig.chartStyle?.backgroundColor || "#36A2EB");
        setTextColor(prevConfig.chartStyle?.textColor || "#000000");
        
        const prevTitle = prevConfig.options?.plugins?.title?.text || "Chart Title";
        setChartTitle(prevTitle);
        setTempTitle(prevTitle);
        
        const prevFontFamily = prevConfig.options?.plugins?.title?.font?.family || "Noto Sans";
        const prevTitleFontSize = prevConfig.options?.plugins?.title?.font?.size || 21;
        const prevFontSize = getBaseFontSize(prevTitleFontSize);
        setActiveFontFamily(prevFontFamily);
        setFontSize(prevFontSize);
        
        setChartImageUrl(`${QUICK_CHART_URL}${encodeURIComponent(JSON.stringify(prevConfig))}`);
    }
};

export const handleRedo = (historyIndex, history, selectionHistory, setDatasetSelected, setSegmentSelected, setChartConfig, setHistoryIndex, setSelectedColor, setTextColor, setChartTitle, setTempTitle, setActiveFontFamily, setFontSize, setChartImageUrl) => {
    if (historyIndex < history.length - 1) {
        const nextIndex = historyIndex + 1;
        const nextSelection = selectionHistory[nextIndex];
        const nextConfig = history[nextIndex];
        
        setDatasetSelected(nextSelection.dataset);
        setSegmentSelected(nextSelection.segment);
        setChartConfig(nextConfig);
        setHistoryIndex(nextIndex);
        setSelectedColor(nextConfig.chartStyle?.backgroundColor || "#36A2EB");
        setTextColor(nextConfig.chartStyle?.textColor || "#000000");
        
        const nextTitle = nextConfig.options?.plugins?.title?.text || "Chart Title";
        setChartTitle(nextTitle);
        setTempTitle(nextTitle);
        
        const nextFontFamily = nextConfig.options?.plugins?.title?.font?.family || "Noto Sans";
        const nextTitleFontSize = nextConfig.options?.plugins?.title?.font?.size || 21;
        const nextFontSize = getBaseFontSize(nextTitleFontSize);
        setActiveFontFamily(nextFontFamily);
        setFontSize(nextFontSize);
        
        setChartImageUrl(`${QUICK_CHART_URL}${encodeURIComponent(JSON.stringify(nextConfig))}`);
    }
};

export const handleReset = (initialConfig, setChartConfig, setSelectedColor, setTextColor, setChartTitle, setTempTitle, setActiveFontFamily, setFontSize, setDatasetSelected, setSegmentSelected, setHistory, setHistoryIndex, setSelectionHistory, setChartImageUrl) => {
    setChartConfig(initialConfig);
    setSelectedColor(initialConfig.chartStyle?.backgroundColor || "#4F46E5");
    setTextColor(initialConfig.chartStyle?.textColor || "#000000");
    
    const initialTitle = initialConfig.options?.plugins?.title?.text || "Chart Title";
    setChartTitle(initialTitle);
    setTempTitle(initialTitle);
    
    const initialFontFamily = initialConfig.options?.plugins?.title?.font?.family || "Noto Sans";
    const initialTitleFontSize = initialConfig.options?.plugins?.title?.font?.size || 21;
    const initialFontSize = getBaseFontSize(initialTitleFontSize);
    setActiveFontFamily(initialFontFamily);
    setFontSize(initialFontSize);
    
    setDatasetSelected(0);
    setSegmentSelected(0);
    setHistory([initialConfig]);
    setHistoryIndex(0);
    setSelectionHistory([{ dataset: 0, segment: 0 }]);
    setChartImageUrl(`${QUICK_CHART_URL}${encodeURIComponent(JSON.stringify(initialConfig))}`);
};

export const handleFontChange = (e, chartConfig, activeFontFamily, fontSize, setActiveFontFamily, updateChartConfig) => {
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
                        size: getTitleFontSize(fontSize)
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

export const handleGridLines = (gridLines, chartConfig, setGridLines, updateChartConfig) => {
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
};

export const handleLegend = (legend, chartConfig, setLegend, updateChartConfig) => {
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
}; 