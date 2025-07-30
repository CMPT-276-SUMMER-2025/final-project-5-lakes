//DUMMY CHART
const dummyChart = [
    {
        id: 1,
        title: "Vertical Bar",
        description: "Displays vertical bars for categorical data.",
        config: {
            type: "bar",
            data: {
                labels: ["Jan", "Feb", "Mar"],
                datasets: [
                    {
                        label: "Sales",
                        data: [10, 20, 30],
                        backgroundColor: "rgba(54, 162, 235, 0.6)",
                    },
                ],
            },
        },
    },
    {
        id: 2,
        title: "Horizontal Bar",
        description: "Displays horizontal bars for comparing values.",
        config: {
            type: "bar",
            data: {
                labels: ["Jan", "Feb", "Mar"],
                datasets: [
                    {
                        label: "Revenue",
                        data: [15, 25, 35],
                        backgroundColor: "rgba(255, 159, 64, 0.6)",
                    },
                ],
            },
            options: {
                indexAxis: "y",
            },
        },
    },
    {
        id: 3,
        title: "Grouped Vertical Bar",
        description: "Compares multiple datasets with grouped vertical bars.",
        config: {
            type: "bar",
            data: {
                labels: ["Q1", "Q2", "Q3"],
                datasets: [
                    {
                        label: "Product A",
                        data: [30, 40, 50],
                        backgroundColor: "rgba(75, 192, 192, 0.6)",
                    },
                    {
                        label: "Product B",
                        data: [20, 30, 40],
                        backgroundColor: "rgba(153, 102, 255, 0.6)",
                    },
                ],
            },
        },
    },
    {
        id: 4,
        title: "Grouped Horizontal Bar",
        description: "Compares multiple datasets with grouped horizontal bars.",
        config: {
            type: "bar",
            data: {
                labels: ["Q1", "Q2", "Q3"],
                datasets: [
                    {
                        label: "Service A",
                        data: [50, 60, 70],
                        backgroundColor: "rgba(255, 206, 86, 0.6)",
                    },
                    {
                        label: "Service B",
                        data: [40, 50, 60],
                        backgroundColor: "rgba(54, 162, 235, 0.6)",
                    },
                ],
            },
            options: {
                indexAxis: "y",
            },
        },
    },
    {
        id: 5,
        title: "Stacked Bar",
        description: "Displays stacked bars to show part-to-whole relationships.",
        config: {
            type: "bar",
            data: {
                labels: ["Jan", "Feb", "Mar"],
                datasets: [
                    {
                        label: "North",
                        data: [30, 40, 50],
                        backgroundColor: "rgba(255, 99, 132, 0.6)",
                    },
                    {
                        label: "South",
                        data: [20, 30, 40],
                        backgroundColor: "rgba(255, 206, 86, 0.6)",
                    },
                ],
            },
            options: {
                scales: {
                x: { stacked: true },
                y: { stacked: true },
                },
            },
        },
    },
    {
        id: 6,
        title: "Stacked Bar With Groups",
        description: "Displays grouped and stacked bars for complex comparisons.",
        config: {
            type: "bar",
            data: {
                labels: ["Q1", "Q2"],
                datasets: [
                {
                    label: "Product A - Online",
                    stack: "Stack 0",
                    data: [20, 30],
                    backgroundColor: "rgba(54, 162, 235, 0.6)",
                },
                {
                    label: "Product A - In-store",
                    stack: "Stack 0",
                    data: [10, 20],
                    backgroundColor: "rgba(255, 99, 132, 0.6)",
                },
                {
                    label: "Product B - Online",
                    stack: "Stack 1",
                    data: [15, 25],
                    backgroundColor: "rgba(153, 102, 255, 0.6)",
                },
                {
                    label: "Product B - In-store",
                    stack: "Stack 1",
                    data: [5, 15],
                    backgroundColor: "rgba(255, 206, 86, 0.6)",
                },
            ],
            },
            options: {
                scales: {
                x: { stacked: true },
                y: { stacked: true },
                },
            },
        },
    },
    {
        id: 7,
        title: "Floating Bars",
        description: "Shows a range of values for each category using floating bars.",
        config: {
            type: "bar",
            data: {
                labels: ["Jan", "Feb", "Mar"],
                datasets: [
                    {
                        label: "Temperature Range",
                        data: [
                        { x: "Jan", y: [2, 8] },
                        { x: "Feb", y: [4, 10] },
                        { x: "Mar", y: [3, 9] },
                        ],
                        backgroundColor: "rgba(255, 159, 64, 0.6)",
                    },
                ],
            },
            parsing: false,
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                    },
                },
            },
        },
    },
    {
        id: 8,
        title: "Line",
        description: "Displays data as a continuous line to show trends.",
        config: {
            type: "line",
            data: {
                labels: ["Jan", "Feb", "Mar"],
                datasets: [
                    {
                        label: "Sales",
                        data: [10, 20, 30],
                        borderColor: "rgba(75, 192, 192, 1)",
                        fill: false,
                    },
                ],
            },
        },
    },
    {
        id: 9,
        title: "Stepped Line",
        description: "Line chart with steps instead of curves.",
        config: {
            type: "line",
            data: {
                labels: ["Jan", "Feb", "Mar"],
                datasets: [
                    {
                        label: "Revenue",
                        data: [15, 25, 35],
                        borderColor: "rgba(255, 99, 132, 1)",
                        fill: false,
                        stepped: true,
                    },
                ],
            },
        },
    },
    {
        id: 10,
        title: "Multi Axis Line",
        description: "Line chart using multiple Y axes.",
        config: {
            type: "line",
            data: {
                labels: ["Jan", "Feb", "Mar"],
                datasets: [
                    {
                        label: "Temperature",
                        data: [30, 25, 27],
                        borderColor: "rgba(255, 99, 132, 1)",
                        yAxisID: "y",
                    },
                    {
                        label: "Rainfall",
                        data: [5, 8, 6],
                        borderColor: "rgba(54, 162, 235, 1)",
                        yAxisID: "y1",
                    },
                ],
            },
            options: {
                scales: {
                    y: {
                        type: "linear",
                        position: "left",
                    },
                    y1: {
                        type: "linear",
                        position: "right",
                    },
                },
            },
        },
    },
    {
        id: 11,
        title: "Line (Multiple Series)",
        description: "Line chart with multiple data series.",
        config: {
            type: "line",
            data: {
                labels: ["Jan", "Feb", "Mar"],
                datasets: [
                    {
                        label: "Product A",
                        data: [10, 20, 30],
                        borderColor: "rgba(75, 192, 192, 1)",
                        fill: false,
                    },
                    {
                        label: "Product B",
                        data: [15, 25, 35],
                        borderColor: "rgba(153, 102, 255, 1)",
                        fill: false,
                    },
                ],
            },
        },
    },
    {
        id: 12,
        title: "Stacked Bar/Line",
        description: "Combines stacked bar and line chart.",
        config: {
            type: "bar",
            data: {
                labels: ["Jan", "Feb", "Mar"],
                datasets: [
                    {
                        type: "bar",
                        label: "Revenue",
                        data: [30, 40, 50],
                        backgroundColor: "rgba(255, 206, 86, 0.6)",
                        stack: "stack1",
                    },
                    {
                        type: "bar",
                        label: "Cost",
                        data: [10, 20, 30],
                        backgroundColor: "rgba(255, 99, 132, 0.6)",
                        stack: "stack1",
                    },
                    {
                        type: "line",
                        label: "Profit",
                        data: [20, 20, 20],
                        borderColor: "rgba(54, 162, 235, 1)",
                        fill: false,
                    },
                ],
            },
        },
    },
    {
        id: 13,
        title: "Scatter",
        description: "Displays data as points in a Cartesian coordinate system.",
        config: {
            type: "scatter",
            data: {
                datasets: [
                    {
                        label: "Observations",
                        data: [
                        { x: 1, y: 2 },
                        { x: 2, y: 4 },
                        { x: 3, y: 6 },
                        ],
                        backgroundColor: "rgba(255, 99, 132, 0.6)",
                    },
                ],
            },
        },
    },
    {
        id: 14,
        title: "Scatter - Multi Axis",
        description: "Scatter chart with multiple axes.",
        config: {
            type: "scatter",
            data: {
                datasets: [
                    {
                        label: "Series 1",
                        data: [
                        { x: 1, y: 2 },
                        { x: 2, y: 4 },
                        { x: 3, y: 1 },
                        ],
                        backgroundColor: "rgba(75, 192, 192, 0.6)",
                        yAxisID: "y1",
                    },
                    {
                        label: "Series 2",
                        data: [
                        { x: 1, y: 6 },
                        { x: 2, y: 3 },
                        { x: 3, y: 7 },
                        ],
                        backgroundColor: "rgba(153, 102, 255, 0.6)",
                        yAxisID: "y2",
                    },
                ],
            },
            options: {
                scales: {
                    y1: { type: "linear", position: "left" },
                    y2: { type: "linear", position: "right" },
                },
            },
        },
    },
    {
        id: 15,
        title: "Bubble",
        description: "Scatter chart with variable bubble sizes.",
        config: {
            type: "bubble",
            data: {
                datasets: [
                    {
                        label: "Bubbles",
                        data: [
                        { x: 1, y: 2, r: 5 },
                        { x: 2, y: 3, r: 10 },
                        { x: 3, y: 1, r: 7 },
                        ],
                        backgroundColor: "rgba(255, 159, 64, 0.6)",
                    },
                ],
            },
        },
    },
    {
        id: 16,
        title: "Pie",
        description: "Basic pie chart representing proportions.",
        config: {
            type: "pie",
            data: {
                labels: ["Red", "Blue", "Yellow"],
                datasets: [
                    {
                        data: [10, 20, 30],
                        backgroundColor: [
                        "rgba(255, 99, 132, 0.6)",
                        "rgba(54, 162, 235, 0.6)",
                        "rgba(255, 206, 86, 0.6)",
                        ],
                    },
                ],
            },
        },
    },
    {
        id: 17,
        title: "Labelled Pie",
        description: "Pie chart with labels on each segment.",
        config: {
            type: "pie",
            data: {
                labels: ["Marketing", "Sales", "Dev"],
                datasets: [
                    {
                        data: [15, 25, 60],
                        backgroundColor: [
                        "#FF6384",
                        "#36A2EB",
                        "#FFCE56",
                        ],
                    },
                ],
            },
            options: {
                plugins: {
                    datalabels: {
                        formatter: (value, ctx) => ctx.chart.data.labels[ctx.dataIndex],
                    },
                },
            },
        },
    },
    {
        id: 18,
        title: "Doughnut",
        description: "Basic doughnut chart.",
        config: {
            type: "doughnut",
            data: {
                labels: ["A", "B", "C"],
                datasets: [
                    {
                        data: [40, 30, 30],
                        backgroundColor: ["#4BC0C0", "#FF6384", "#FFCE56"],
                    },
                ],
            },
        },
    },
    {
        id: 19,
        title: "Labelled Doughnut",
        description: "Doughnut chart with labels.",
        config: {
            type: "doughnut",
            data: {
                labels: ["East", "West", "North"],
                datasets: [
                    {
                        data: [20, 50, 30],
                        backgroundColor: ["#FF9F40", "#9966FF", "#C9CBCF"],
                    },
                ],
            },
            options: {
                plugins: {
                    datalabels: {
                        formatter: (value, ctx) => ctx.chart.data.labels[ctx.dataIndex],
                    },
                },
            },
        },
    },
    {
        id: 20,
        title: "Polar Area",
        description: "Polar area chart for comparison.",
        config: {
            type: "polarArea",
            data: {
                labels: ["Alpha", "Beta", "Gamma"],
                datasets: [
                    {
                        data: [11, 16, 7],
                        backgroundColor: ["#FF6384", "#4BC0C0", "#FFCE56"],
                    },
                ],
            },
        },
    },
    {
        id: 21,
        title: "Polar Area Centered Point Labels",
        description: "Polar area with labels centered inside segments.",
        config: {
            type: "polarArea",
            data: {
                labels: ["Red", "Green", "Blue"],
                datasets: [
                    {
                        data: [10, 20, 30],
                        backgroundColor: ["#F7464A", "#46BFBD", "#FDB45C"],
                    },
                ],
            },
            options: {
                plugins: {
                    datalabels: {
                        color: "#fff",
                        font: { weight: "bold" },
                        formatter: (value, ctx) => ctx.chart.data.labels[ctx.dataIndex],
                    },
                },
            },
        },
    },
    {
        id: 22,
        title: "Multi Series Pie",
        description: "Emulates multiple pie charts by overlaying multiple datasets.",
        config: {
            type: "pie",
            data: {
                labels: ["Q1", "Q2", "Q3"],
                datasets: [
                    {
                        label: "2024",
                        data: [30, 50, 20],
                        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
                    },
                    {
                        label: "2025",
                        data: [40, 30, 30],
                        backgroundColor: ["#4BC0C0", "#9966FF", "#FF9F40"],
                    },
                ],
            },
        },
    },
    {
        id: 23,
        title: "Combo Bar/Line",
        description: "Mixed chart combining bar and line datasets.",
        config: {
            type: "bar",
            data: {
                labels: ["Jan", "Feb", "Mar"],
                datasets: [
                    {
                        type: "bar",
                        label: "Sales",
                        data: [30, 40, 50],
                        backgroundColor: "rgba(75, 192, 192, 0.6)",
                    },
                    {
                        type: "line",
                        label: "Growth",
                        data: [5, 10, 15],
                        borderColor: "rgba(255, 99, 132, 1)",
                        fill: false,
                    },
                ],
            },
        },
    },
];

module.exports = dummyChart;