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
        id: 8,
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
        id: 9,
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
        id: 10,
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
        id: 11,
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
        id: 12,
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
    }
];

module.exports = dummyChart;