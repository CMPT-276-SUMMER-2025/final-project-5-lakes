const request = require('supertest');
const { app, sessionData } = require('../app.js');

describe('Integration test of post visual selection', () => {
    sessionData.chartOptions = [
        { id: 1, type: 'bar' }
    ];
    sessionData.labels = {
        x: ['Jan', 'Feb', 'Mar'],
        y: ['Revenue']
    };
    sessionData.edittedData = [
        { Jan: 100, Feb: 200, Mar: 300, Revenue: 600 }
    ];
    

    test('Should return chartConfig and labels based on selected visual ID', async () => {
        const res = await request(app)
            .post('/visual-selected')
            .send({ id: 1 });

        const config = res.body.chartConfig;

        expect(config).toHaveProperty('type', 'bar');
        expect(config).toHaveProperty('data');
        expect(config.data).toHaveProperty('labels');
        expect(config.data).toHaveProperty('datasets');
        expect(config).toHaveProperty('options');
        expect(config.options).toHaveProperty('plugins');
        expect(config.options).toHaveProperty('scales');
    });
});
