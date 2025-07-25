const request = require('supertest');
const app = require('../server.js');
const path = require('path');


// INTEGRATION TEST 
// Mock feature 1
jest.mock('..feature1.js', () => ({
    parseFileAndSendToDeepSeek: jest.fn((req,res) => {
        return res.status(200).json({ message: 'Mocked feature 1 called'});
    })
}));

describe('Integration test of file upload flow', () => {
    test('uploads file and hits backend endpoint', async () => {
        const filePath = path.join(__dirname, 'files/csv/simple_sample.csv');

        const res = await request(app)
            .post('/file-submit')
            .attach('files', filePath);

        expect(res.status).toBe(200);
        expect(res.body).toEqual({ message: 'Mocked feature handler called' });
    });
});