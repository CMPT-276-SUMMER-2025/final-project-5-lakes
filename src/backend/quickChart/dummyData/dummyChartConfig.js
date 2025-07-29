//DUMMY CHART
const dummyChart = [
    {
        id: 1,
        title: "Bar Chart",
        description: "Displays values as bars.",
        config: {
            type: 'bar',
            data: {
                labels: ['Jan', 'Feb', 'Mar'],
                datasets: [{
                    label: 'Sales',
                    data: [10, 20, 30],
                    backgroundColor: 'rgba(54, 162, 235, 0.6)',
                }]
            }
        }
    },
    {
        id: 2,
        title: "Line Chart",
        description: "Shows trends over time.",
        config: {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar'],
                datasets: [{
                    label: 'Sales',
                    data: [10, 20, 30],
                    borderColor: 'rgba(75, 192, 192, 1)',
                    fill: false,
                }]
            }
        }
    },
    {
        id: 3,
        title: "Pie Chart",
        description: "Represents data as parts of a whole.",
        config: {
            type: 'pie',
            data: {
                labels: ['Product A', 'Product B', 'Product C'],
                datasets: [{
                    data: [300, 50, 100],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.6)',
                        'rgba(255, 206, 86, 0.6)',
                        'rgba(75, 192, 192, 0.6)',
                    ]
                }]
            }
        }
    }
];

module.exports = dummyChart;