jest.resetModules();

jest.mock('../deepSeek/APIdeepseek.js', () => ({
  queryDeepSeekV3: jest.fn(() => 
    Promise.resolve('"Test answer from DeepSeek"')
  )
}));

const { convertToChartConfig } = require('../deepSeek/DeepSeekFeature1.js');
const { getGraphRecommendation } = require('../deepSeek/DeepSeekFeature2.js');
const { getSummary } = require('../deepSeek/DeepSeekFeature3.js');

describe('Unit test for all DeepSeek Featureus', () => {
    test('Test DeepSeek Feature 1', async () => {    
        const result = await convertToChartConfig("NO QUERY", "EMPTY DATA");
        expect(result).toEqual("Test answer from DeepSeek");
    });
    test('Test DeepSeek Feature 2', async () => {    
        const result =  await getGraphRecommendation("NO QUERY", "EMPTY DATA");
        expect(result).toEqual("Test answer from DeepSeek");
    });
    test('Test DeepSeek Feature 3', async () => { 
        const result = await getSummary("NO QUERY", "EMPTY DATA");
        expect(result).toEqual("Test answer from DeepSeek");
    });
});