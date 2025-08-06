jest.resetModules();

jest.mock('../deepSeek/APIdeepseek.js', () => ({
  queryDeepSeekV3: jest.fn(() => 
    Promise.resolve('"Test answer from DeepSeek"')
  )
}));

const { separateLabels } = require('../deepSeek/DeepSeekLabelSeparation.js');

describe('Unit test Seperate-Labels', () => {
    test('Test seperating labels', async () => {    
        const result = await separateLabels("EMPTY DATA");
        expect(result).toEqual("Test answer from DeepSeek");
    });
});