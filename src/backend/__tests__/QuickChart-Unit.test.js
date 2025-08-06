jest.resetModules();

jest.mock('../quickChart/QCAdditionalFunctions.js', () => ({
  getXValues: jest.fn(),
  getYValues: jest.fn(),
  getScatterValues: jest.fn()
}));

jest.mock('../quickChart/dummyData/dummyChartConfig.js', () => ([
  {
    id: 1,
    title: "Dummy Bar Chart",
    config: {
      options: {
        plugins: {
          title: {
            color: 'red'
          }
        }
      }
    }
  }
]));

const { multipleDatasetsChartGenerator } = require('../quickChart/QCFeature1.js');
const { getXValues, getYValues, getScatterValues } = require('../quickChart/QCAdditionalFunctions.js');

describe('Test QuickChart Feature 1', () => {
    const labels = {
        x: ['Jan', 'Feb', 'Mar'],
        y: ['Sales', 'Profit']
    };

    const datasets = [
        { Sales: 100, Profit: 30 },
        { Sales: 120, Profit: 50 },
        { Sales: 90, Profit: 40 }
    ];

     test('Generates bar chart config correctly', () => {
        getXValues.mockReturnValue(labels.x);
        getYValues.mockImplementation((label) => datasets.map(d => d[label]));

        const config = multipleDatasetsChartGenerator('bar', labels, datasets, 1);

        expect(getXValues).toHaveBeenCalledWith(labels.x, datasets);
        expect(getYValues).toHaveBeenCalledTimes(labels.y.length);
        expect(config.type).toBe('bar');
        expect(config.data.labels).toEqual(labels.x);
        expect(config.data.datasets.length).toBe(labels.y.length);

        expect(config.data.datasets[0].label).toBe('Sales');
        expect(config.data.datasets[0].data).toEqual(datasets.map(d => d['Sales']));

        expect(config.options.plugins.title.text).toBe('Dummy Bar Chart');
        expect(config.options.plugins.title.font.size).toBe(24);
    });

    test('Generates scatter chart config correctly', () => {
        getXValues.mockReturnValue(labels.x);
        getYValues.mockImplementation(() => []);
        getScatterValues.mockReturnValue([{ x: 1, y: 2 }, { x: 3, y: 4 }]);

        const config = multipleDatasetsChartGenerator('scatter', labels, datasets, 1);

        expect(config.type).toBe('scatter');
        expect(getScatterValues).toHaveBeenCalledWith(labels, datasets);

        expect(config.data.datasets[0].data).toEqual([{ x: 1, y: 2 }, { x: 3, y: 4 }]);
    });

    test('Generates pie chart config correctly', () => {
        getXValues.mockReturnValue(labels.x);
        getYValues.mockReturnValue([10, 20, 30]);

        const config = multipleDatasetsChartGenerator('pie', labels, datasets, 1);

        expect(config.type).toBe('pie');

        expect(config.data.datasets[0].backgroundColor.length).toBe(3);

        expect(config.data.datasets[0].borderColor).toBe('rgb(255, 255, 255)');

        expect(config.options.scales.x.display).toBe(false);
        expect(config.options.scales.y.display).toBe(false);

        expect(config.options.elements.point.radius).toBe(0);

        expect(config.options.plugins.datalabels.display).toBe(true);
    });
});
