const request = require('supertest');
const app = require('../server.js');
const path = require('path');
const fs = require('fs');

// INTEGRATION TEST 
// Mock feature 1
jest.mock('../feature1.js', () => ({
    parseFileAndSendToDeepSeek: jest.fn(() => {
        return Promise.resolve({analysis: [{type: 'bar', data: {labels: ['A'], datasets: [{label: 'Value', data: [10]}] } }] });
    })
}));

describe('Integration test of file upload flow', () => {
    test('uploads file and hits backend endpoint', async () => {
        const filePath = path.resolve(__dirname, 'files/csv/simple_sample.csv');

        if (!fs.existsSync(filePath)) {
            throw new Error(`Test file not found: ${filePath}`);
        }

        const res = await request(app)
            .post('/file-submit')
            .attach('files', filePath);

        expect(res.status).toBe(200);
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

afterAll(() => {
    const uploadDir = path.join(__dirname, '../uploads')
    fs.readdir(uploadDir, (err, files) => {
        if (err) return;
        for (const file of files) {
            fs.unlink(path.join(uploadDir, file), () => {});
        }
    });
});