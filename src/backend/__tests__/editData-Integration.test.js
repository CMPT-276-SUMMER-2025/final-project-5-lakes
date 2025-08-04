const request = require('supertest');
const app = require('../app.js');

jest.mock('../deepSeek/DeepSeekFeature2.js', () => ({
    getSummary: jest.fn(() => {
        return Promise.resolve(JSON.parse(
        [
            "Apple is priced higher than Banana",
            "All price values are numeric and valid"
        ]
        ));
    })
}));
jest.mock('../deepSeek/DeepSeekFeature3.js', () => ({
    getGraphRecommendation: jest.fn(() => {
        return Promise.resolve([
        {"types":["Vertical Bar","Pie"],
        "explanations":["Vertical Bar is effective for comparing values.","Pie is useful to show the proportions."]}
        ]);
    })
}));

describe('Integration test of post data editting', () => {
    test('Record editted data', async () => {

        //Get response from app
        const res = await request(app).post('/edit-data');
        
        expect(res.body).toEqual
        ({
            summary: summary,
            graphRecommendation: graphRecommendation,
            chartsWithURLs: chartsWithURLs,
        });
    });
});