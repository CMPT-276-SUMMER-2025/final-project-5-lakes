const request = require('supertest');
const app = require('../app.js');
const path = require('path');
const fs = require('fs');

const tempDir = path.resolve(__dirname, 'tempIntegration');
const tempCsvPath = path.join(tempDir, 'temp_sample.csv');

// Create dummy dir and file
beforeAll(() => {
    //create temp dir
    fs.mkdirSync(tempDir);
    fs.writeFileSync(tempCsvPath, "");
});

// Delete dummy dir and file
afterAll(() => {
    if (fs.existsSync(tempCsvPath)) {
        fs.unlinkSync(tempCsvPath);
    }
    if (fs.existsSync(tempDir)) {
        fs.rmdirSync(tempDir, { recursive: true });
    }
});

// INTEGRATION TEST FOR APP.JS
// Mock feature 1
jest.mock('../deepSeek/APIdeepseek.js', () => ({
  queryDeepSeekV3: jest.fn(() => {
    return Promise.resolve(JSON.stringify([
      { "Name": "Alice", "Score": "85" },
      { "Name": "Bob", "Score": "90" },
      { "Name": "Charlie", "Score": "78" }
    ]));
  })
}));

describe('Integration test of file upload flow', () => {
    test('uploads file and hits backend endpoint', async () => {

        //Get response from app
        const res = await request(app)
            .post('/file-submit')
            .attach('files', tempCsvPath);
        
        expect(res.body.parsedData).toEqual(JSON.parse('[{"Name": "Alice", "Score": "85"}, {"Name": "Bob", "Score": "90"}, {"Name": "Charlie", "Score": "78"}]'));
    });
});