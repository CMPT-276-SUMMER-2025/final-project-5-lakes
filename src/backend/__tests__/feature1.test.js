require('dotenv').config();
console.log(process.env.OPENROUTER_API_KEY);

//import the two functions for unit testing
const { parseFileAndSendToDeepSeek } = require('../feature1.js');
const deepseek = require('../deepseek.js');

// Mock DeepSeek call function so the test doesn't actually call.
jest.mock('../deepseek.js', () => ({
  queryDeepSeekV3: jest.fn(() => Promise.resolve('mocked deepseek response'))
}));

describe('parseFileAndSendToDeepSeek', () => {
  test('parses CSV and sends to DeepSeek', async () => {
    // Example test file path (adjust if needed)
    const file = '__tests__/files/csv/simple_sample.csv';

    //example query to pass the function
    const query = 'test query';

    // Example query parameter passed to the function
    const result = await parseFileAndSendToDeepSeek(file, query);

    // Call the real function (parseFileAndSendToDeepSeek)
    // Internally, queryDeepSeekV3 will be mocked, so no real API call
    expect(deepseek.queryDeepSeekV3).toHaveBeenCalled();

    // Check that the function returned the mocked response value
    expect(result).toBe('mocked deepseek response');
  });

  test('parses XLSX and sends to DeepSeek', async () => {
    const file = '__tests__/files/xlsx/simple_sample.xlsx';
    const query = 'test query';
    const result = await parseFileAndSendToDeepSeek(file, query);
    expect(deepseek.queryDeepSeekV3).toHaveBeenCalled();
    expect(result).toBe('mocked deepseek response');
  });

  test('parses PDF and sends to DeepSeek', async () => {
    const file = '__tests__/files/pdf/simple_sample.pdf';
    const query = 'test query';
    const result = await parseFileAndSendToDeepSeek(file, query);
    expect(deepseek.queryDeepSeekV3).toHaveBeenCalled();
    expect(result).toBe('mocked deepseek response');
  });

  test('parses DOCX and sends to DeepSeek', async () => {
    const file = '__tests__/files/docx/simple_sample.docx';
    const query = 'test query';
    const result = await parseFileAndSendToDeepSeek(file, query);
    expect(deepseek.queryDeepSeekV3).toHaveBeenCalled();
    expect(result).toBe('mocked deepseek response');
  });

  test('parses TXT and sends to DeepSeek', async () => {
    const file = '__tests__/files/txt/simple_sample.txt';
    const query = 'test query';
    const result = await parseFileAndSendToDeepSeek(file, query);
    expect(deepseek.queryDeepSeekV3).toHaveBeenCalled();
    expect(result).toBe('mocked deepseek response');
  });
});