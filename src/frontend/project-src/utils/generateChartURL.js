const generateChartUrl = (config) => {
  const fullConfig = {
    type: config.chartType,
    data: {
      labels: config.chartData.map(row => row.Label),
      datasets: [
        {
          label: config.chartLabel,
          data: config.chartData.map(row => row.Value),
          backgroundColor: config.chartStyle?.backgroundColor || "#4F46E5", // default blue
        }
      ]
    },
    options: config.chartOptions || {}
  };

  const baseUrl = "https://quickchart.io/chart";
  const encodedConfig = encodeURIComponent(JSON.stringify(fullConfig));
  return `${baseUrl}?c=${encodedConfig}`;
};

export default generateChartUrl;