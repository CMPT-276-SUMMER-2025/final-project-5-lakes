const request = require('supertest');
const app = require('../app.js');
const path = require('path');
const fs = require('fs');

const tempDir = path.resolve(__dirname, 'tempIntegration');
const tempCsvPath = path.join(tempDir, 'temp_sample.csv');

beforeAll(() => {
    fs.mkdirSync(tempDir);
    fs.writeFileSync(tempCsvPath, "");
});

afterAll(() => {
    if (fs.existsSync(tempCsvPath)) {
        fs.unlinkSync(tempCsvPath);
    }
    if (fs.existsSync(tempDir)) {
        fs.rmdirSync(tempDir, { recursive: true });
    }
});

jest.mock('../deepSeek/DeepSeekFeature1.js', () => ({
  convertToChartConfig: jest.fn(() => {
    return Promise.resolve([
      { "Name": "Alice", "Score": "85" },
      { "Name": "Bob", "Score": "90" },
      { "Name": "Charlie", "Score": "78" }
    ]);
  })
}));

describe('Integration test of file upload flow', () => {
    test('uploads file and hits backend endpoint', async () => {
        const res = await request(app)
            .post('/file-submit')
            .attach('files', tempCsvPath);        
        expect(res.body.parsedData).toEqual([{"Name": "Alice", "Score": "85"}, {"Name": "Bob", "Score": "90"}, {"Name": "Charlie", "Score": "78"}]);
    });
});