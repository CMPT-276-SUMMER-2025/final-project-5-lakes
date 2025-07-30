const path = require('path');

//import the parseFile function for unit testing
const { convertToChartConfig } = require('../deepSeek/DeepSeekFeature1.js');
const deepseek = require('../deepSeek/APIdeepseek.js');

// UNIT TEST
// Mock DeepSeek call function so the test doesn't actually call.
jest.mock('../deepSeek/APIdeepseek.js', () => ({
  queryDeepSeekV3: jest.fn(() => {
    return Promise.resolve(JSON.stringify([
      { "Name": "Alice", "Score": "85" },
      { "Name": "Bob", "Score": "90" },
      { "Name": "Charlie", "Score": "78" }
    ]));
  })
}));

describe('convertToChartConfig', () => {
  test('parses CSV', async () => {
    // Example test mock file
    const mockFile = {
      mimetype: 'text/csv',
      path: path.resolve(__dirname, 'files/csv/simple_sample.csv')
    };

    // Call the real function (convertToChartConfig)
    const result = await convertToChartConfig(mockFile);

    // Internally, queryDeepSeekV3 will be mocked, so no real API call
    expect(deepseek.queryDeepSeekV3).toHaveBeenCalled();

    // Check that the function returned the mocked response value (raw JSON string)
    expect(result).toEqual([
      { "Name": "Alice", "Score": "85" },
      { "Name": "Bob", "Score": "90" },
      { "Name": "Charlie", "Score": "78" }
    ]);
  });  

  test('parses XLSX and sends to DeepSeek', async () => {
    const mockFile = {
      mimetype: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      path: path.resolve(__dirname,'files/xlsx/simple_sample.xlsx')
    };    
    const result = await convertToChartConfig(mockFile);
    expect(deepseek.queryDeepSeekV3).toHaveBeenCalled();
    expect(result).toEqual([
      { "Name": "Alice", "Score": "85" },
      { "Name": "Bob", "Score": "90" },
      { "Name": "Charlie", "Score": "78" }
    ]);
  });

  test('parses PDF and sends to DeepSeek', async () => {
    const mockFile = {
      mimetype: 'application/pdf',
      path: path.resolve(__dirname, 'files/pdf/simple_sample.pdf')
    };    
    const result = await convertToChartConfig(mockFile);
    expect(deepseek.queryDeepSeekV3).toHaveBeenCalled();
    expect(result).toEqual([
      { "Name": "Alice", "Score": "85" },
      { "Name": "Bob", "Score": "90" },
      { "Name": "Charlie", "Score": "78" }
    ]);
  });

  test('parses DOCX and sends to DeepSeek', async () => {
    const mockFile = {
      mimetype: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      path: path.resolve(__dirname, 'files/docx/simple_sample.docx')
    };    
    const result = await convertToChartConfig(mockFile);
    expect(deepseek.queryDeepSeekV3).toHaveBeenCalled();
    expect(result).toEqual([
      { "Name": "Alice", "Score": "85" },
      { "Name": "Bob", "Score": "90" },
      { "Name": "Charlie", "Score": "78" }
    ]);
  });

  test('parses TXT and sends to DeepSeek', async () => {
    const mockFile = {
      mimetype: 'text/plain',
      path: path.resolve(__dirname, 'files/txt/simple_sample.txt')
    };    
    const result = await convertToChartConfig(mockFile);
    expect(deepseek.queryDeepSeekV3).toHaveBeenCalled();
    expect(result).toEqual([
      { "Name": "Alice", "Score": "85" },
      { "Name": "Bob", "Score": "90" },
      { "Name": "Charlie", "Score": "78" }
    ]);
  });
});