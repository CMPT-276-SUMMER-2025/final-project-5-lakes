jest.resetModules();

jest.mock('../deepSeek/DeepSeekLabelSeparation.js', () => ({
    separateLabels: jest.fn(() => {
        Promise.resolve([{ x: ['Fruit'], y: ['Price'] }]);
    })
}));
jest.mock('../deepSeek/DeepSeekFeature2.js', () => ({
    getGraphRecommendation: jest.fn(() => 
        Promise.resolve({
            types: ["Vertical Bar", "Horizontal Bar"],
            explanations: ['Mocked Recommendation 1','Mocked Recommendation 2']
        })
    )
}));
jest.mock('../deepSeek/DeepSeekFeature3.js', () => ({
    getSummary: jest.fn(() => 
        Promise.resolve(['Mocked Summary 1', 'Mocked Summary 2'])
    )
}));

const request = require('supertest');
const { app, sessionData } = require('../app.js');

const { separateLabels } = require('../deepSeek/DeepSeekLabelSeparation.js');
const { getGraphRecommendation } = require('../deepSeek/DeepSeekFeature2.js');
const { getSummary } = require('../deepSeek/DeepSeekFeature3.js');

beforeAll(() => {
    sessionData.labels = null;
    sessionData.summary = null;
    sessionData.graphRecommendation = null;
    sessionData.chartOptions = null;
    sessionData.edittedData = null;
});

describe('Integration test of post data editting', () => {
    test('Should process and return summary, graph recommendation, and chartsWithURLs', async () => {
        const mockEdittedData = [
            { A: 1, B: 2, Value: 3 },
            { A: 4, B: 5, Value: 6 }
        ];
        
        const res = await request(app)
            .post('/edit-data')
            .send({ edittedData: mockEdittedData });

        expect(separateLabels).toHaveBeenCalledWith(JSON.stringify(mockEdittedData));
        expect(getGraphRecommendation).toHaveBeenCalledWith(JSON.stringify(mockEdittedData));
        expect(getSummary).toHaveBeenCalledWith(JSON.stringify(mockEdittedData));

        expect(res.body).toHaveProperty('summary');
        expect(res.body).toHaveProperty('graphRecommendation');
        expect(res.body).toHaveProperty('chartsWithURLs');
        expect(res.body.graphRecommendation).toEqual({
            types: ['Vertical Bar', 'Horizontal Bar'],
            explanations: ['Mocked Recommendation 1', 'Mocked Recommendation 2']
        });
        expect(Array.isArray(res.body.chartsWithURLs)).toBe(true);
        expect(res.body.chartsWithURLs.length).toBe(2);

        for (let i = 0; i < res.body.chartsWithURLs.length; i++) {
            const chart = res.body.chartsWithURLs[i];
            expect(chart).toHaveProperty('id', i + 1);
            expect(chart).toHaveProperty('title');
            expect(chart).toHaveProperty('type');
            expect(chart).toHaveProperty('description');
            expect(chart).toHaveProperty('imageUrl');
        }

        expect(sessionData.edittedData).toEqual(mockEdittedData);
        expect(sessionData.summary).toEqual(["Mocked Summary 1", "Mocked Summary 2"]);
        expect(sessionData.graphRecommendation.types).toEqual(['Vertical Bar', 'Horizontal Bar']);
        expect(sessionData.chartOptions.length).toBe(2);
    });
});