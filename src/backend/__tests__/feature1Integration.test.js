const request = require('supertest');
const app = require('../app.js');
const path = require('path');
const fs = require('fs');

const tempDir = path.resolve(__dirname, 'temp');
const tempCsvPath = path.join(tempDir, 'temp_sample.csv');

beforeAll(() => {
    //create temp dir
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

// INTEGRATION TEST 
// Mock feature 1
jest.mock('../feature1.js', () => ({
    parseFileAndSendToDeepSeek: jest.fn(() => {
        return Promise.resolve({analysis: [{type: 'bar', data: {labels: ['A'], datasets: [{label: 'Value', data: [10]}] } }] });
    })
}));

describe('Integration test of file upload flow', () => {
    test('uploads file and hits backend endpoint', async () => {

        const res = await request(app)
            .post('/file-submit')
            .attach('files', tempCsvPath);
        
        expect(res.body).toEqual({ 
            analysis: [
                {
                    type: 'bar',
                    data: {
                        labels: ['A'],
                        datasets: [
                            { 
                                label: 'Value', 
                                data: [10] 
                            }
                        ]
                    }
                }
            ]
        });
    });
});