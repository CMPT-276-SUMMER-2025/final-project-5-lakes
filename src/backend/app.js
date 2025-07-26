const express = require('express');
const multer = require('multer');
const cors = require('cors');
const { convertToChartConfig } = require('./feature1.js');
const { getGraphRecommendation } = require('./feature2.js');
const { getSummary } = require('./feature3.js');
const { parseFile } = require('./file-parser.js');

const { queryDeepSeekV3 } = require('./deepseek.js');
const prompts = require('./prompts/deepseekPrompts.js');


const app = express();

// Add JSON middleware to parse request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const upload = multer({dest: 'uploads/'});

const allowedOrigins = process.env.NODE_ENV === 'production'
  ? ['https://easychart-omega.vercel.app']
  : ['http://localhost:5173'];     

app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));

// File upload endpoint
app.post('/file-submit', upload.array('files'), async (req, res) => {
    console.log('Incoming /file-submit request from:', req.headers.origin);
    const files = req.files;
    const text = req.body.text;

    // Handle text input if no files are uploaded
    if (!files || files.length === 0) {
        if (!text || text.trim() === '') {
            return res.status(400).send('No file or text provided.');
        }
        
        try {
            // Process text input
            const textData = text.split('\n').filter(line => line.trim() !== '');
            const result = await queryDeepSeekV3(prompts.feature1("", textData));
            
            return res.json(result);
        } catch (error) {
            console.error('Error processing text:', error);
            return res.status(500).send('Error processing the text.');
        }
    }

    // Handle file
    try {
        const file = files[0]; // Process first file uploaded
        let result = { parsedData: JSON.parse(await parseFile(file)), file: file };
        console.log(result.parsedData);
        return res.json(result);
    } catch (error) {
        return res.status(500).send('Failed to process file.');
    }
});

// Information edit confirm
app.post('/edit-confirm', async (req, res) => {
    const data = req.body;
    console.log('Received data:', JSON.stringify(data.chartConfig));
    // Validate that data exists and has chartConfig property
    if (!data) {
        return res.status(400).json({ error: 'No data provided in request body' });
    }
    
    if (!data.chartConfig) {
        return res.status(400).json({ error: 'chartConfig property is missing from request data' });
    }
    try {
        console.log(data.analysis);
        const summary = await getSummary(JSON.stringify(data.analysis));
        const graphRecommendation = await getGraphRecommendation(JSON.stringify(data.analysis));

        res.json({ 
            chartsConfig: data.chartConfig,
            summary: JSON.parse(summary),
            graphRecommendation: JSON.parse(graphRecommendation),
            analysis: data.analysis
        });
    } catch (error) {
        res.status(500).send('Failed to process data.');
    }
});

module.exports = app;