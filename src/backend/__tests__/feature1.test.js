require('dotenv').config();

//import the two functions for unit testing
const { parseFileAndSendToDeepSeek } = require('../feature1.js');
const deepseek = require('../deepseek.js');

// Mock DeepSeek call function so the test doesn't actually call.
jest.mock('../deepseek.js', () => ({
  queryDeepSeekV3: jest.fn(() => Promise.resolve('mocked deepseek response'))
}));

describe('parseFileAndSendToDeepSeek', () => {
  
  //example query to pass the function
  const query = 'test query';

  // Clear history before each test
  beforeEach(() => {
    deepseek.queryDeepSeekV3.mockClear();
  })

  test('parses CSV and sends to DeepSeek', async () => {
    // Example test file path (adjust if needed)
    const file = '__tests__/files/csv/simple_sample.csv';

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
    const result = await parseFileAndSendToDeepSeek(file, query);
    expect(deepseek.queryDeepSeekV3).toHaveBeenCalled();
    expect(result).toBe('mocked deepseek response');
  });

  test('parses PDF and sends to DeepSeek', async () => {
    const file = '__tests__/files/pdf/simple_sample.pdf';
    const result = await parseFileAndSendToDeepSeek(file, query);
    expect(deepseek.queryDeepSeekV3).toHaveBeenCalled();
    expect(result).toBe('mocked deepseek response');
  });

  test('parses DOCX and sends to DeepSeek', async () => {
    const file = '__tests__/files/docx/simple_sample.docx';
    const result = await parseFileAndSendToDeepSeek(file, query);
    expect(deepseek.queryDeepSeekV3).toHaveBeenCalled();
    expect(result).toBe('mocked deepseek response');
  });

  test('parses TXT and sends to DeepSeek', async () => {
    const file = '__tests__/files/txt/simple_sample.txt';
    const result = await parseFileAndSendToDeepSeek(file, query);
    expect(deepseek.queryDeepSeekV3).toHaveBeenCalled();
    expect(result).toBe('mocked deepseek response');
  });
});