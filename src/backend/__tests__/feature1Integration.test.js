const request = require('supertest');
const app = require('../app.js');
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

        console.log('File exists:', fs.existsSync(filePath), 'Path:', filePath);

        const res = await request(app)
            .post('/file-submit')
            .attach('files', filePath);
        
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