const request = require('supertest');
const app = require('../app.js');
const path = require('path');
const fs = require('fs');

const tempDir = path.resolve(__dirname, 'temp');
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

// INTEGRATION TEST 
// Mock feature 1
jest.mock('../file-parser.js', () => ({
    parseFile: jest.fn(() => Promise.resolve('123'))
}));

describe('Integration test of file upload flow', () => {
    test('uploads file and hits backend endpoint', async () => {

        //Get response from app
        const res = await request(app)
            .post('/file-submit')
            .attach('files', tempCsvPath);
        
        expect(res.body.parsedData).toEqual('123');
    });
});