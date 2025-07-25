require('dotenv').config();
const path = require('path');

//import the two functions for unit testing
const { parseFileAndSendToDeepSeek } = require('../feature1.js');
const deepseek = require('../deepseek.js');

// Mock DeepSeek call function so the test doesn't actually call.
jest.mock('../deepseek.js', () => ({
  queryDeepSeekV3: jest.fn(() => Promise.resolve('mocked deepseek response'))
}));

describe('parseFileAndSendToDeepSeek', () => {
  test('parses CSV and sends to DeepSeek', async () => {
    // Example test mock file
    const mockFile = {
      minetype: 'text/csv',
      path: path.resolve(__dirname, 'sample.csv')
    };

    //example query to pass the function
    const query = 'test query';

    // Example query parameter passed to the function
    const result = await parseFileAndSendToDeepSeek(mockFile, query);

    // Call the real function (parseFileAndSendToDeepSeek)
    // Internally, queryDeepSeekV3 will be mocked, so no real API call
    expect(deepseek.queryDeepSeekV3).toHaveBeenCalled();

    // Check that the function returned the mocked response value
    expect(result).toBe('mocked deepseek response');
  });

  test('parses XLSX and sends to DeepSeek', async () => {
    const mockFile = {
      minetype: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      path: path.resolve(__dirname, 'sample.xlsx')
    };    
    const query = 'test query';
    const result = await parseFileAndSendToDeepSeek(mockFile, query);
    expect(deepseek.queryDeepSeekV3).toHaveBeenCalled();
    expect(result).toBe('mocked deepseek response');
  });

  test('parses PDF and sends to DeepSeek', async () => {
    const mockFile = {
      minetype: 'application/pdf',
      path: path.resolve(__dirname, 'sample.pdf')
    };    
    const query = 'test query';
    const result = await parseFileAndSendToDeepSeek(mockFile, query);
    expect(deepseek.queryDeepSeekV3).toHaveBeenCalled();
    expect(result).toBe('mocked deepseek response');
  });

  test('parses DOCX and sends to DeepSeek', async () => {
    const mockFile = {
      minetype: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      path: path.resolve(__dirname, 'sample.docx')
    };    
    const query = 'test query';
    const result = await parseFileAndSendToDeepSeek(mockFile, query);
    expect(deepseek.queryDeepSeekV3).toHaveBeenCalled();
    expect(result).toBe('mocked deepseek response');
  });

  test('parses TXT and sends to DeepSeek', async () => {
    const mockFile = {
      minetype: 'text/plain',
      path: path.resolve(__dirname, 'sample.txt')
    };    
    const query = 'test query';
    const result = await parseFileAndSendToDeepSeek(mockFile, query);
    expect(deepseek.queryDeepSeekV3).toHaveBeenCalled();
    expect(result).toBe('mocked deepseek response');
  });
});