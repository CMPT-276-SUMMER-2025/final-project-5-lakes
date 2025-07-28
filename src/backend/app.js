const express = require('express');
const multer = require('multer');
const cors = require('cors');
const { convertToChartConfig } = require('./deepSeek/DeepSeekFeature1.js');
const { getGraphRecommendation } = require('./DeepSeekFeature2.js');
const { getSummary } = require('./deepSeek/DeepSeekFeature3.js');
const { parseFile } = require('./file-parser.js');

const app = express();

// Add JSON middleware to parse request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const upload = multer({dest: 'uploads/'});

let sessionData = {
    uploadedFile: null,
    parsedData: null,
    chartConfig: null,
    summary: null,
    graphRecommendation: null,
    styleConfig: null,
    visualSelected: null,
    selectedOption: null,
};

const allowedOrigins = process.env.NODE_ENV === 'production'
  ? ['https://easychart-omega.vercel.app']
  : ['http://localhost:5173'];     

app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));


app.get('/get-session-data', async (req, res) => {
    res.json(sessionData);
});

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
            const result = await convertToChartConfig("", textData);
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
        sessionData.uploadedFile = file;
        sessionData.parsedData = result.parsedData;
        sessionData.chartConfig = null;
        sessionData.summary = null;
        sessionData.graphRecommendation = null;
        sessionData.styleConfig = null;
        return res.json(result);
    } catch (error) {
        return res.status(500).send('Failed to process file.');
    }
});

// Information edit confirm
app.post('/edit-confirm', async (req, res) => {
    const data = req.body;
    // Validate that data exists and has chartConfig property
    if (!data) {
        return res.status(400).json({ error: 'No data provided in request body' });
    }
    
    try {
        // const prompt = prompts.feature1("",JSON.stringify(data.edittedData));
        const summary = await getSummary(JSON.stringify(data.parsedData));
        const graphRecommendation = await getGraphRecommendation(JSON.stringify(data.parsedData));
        // const chartConfig = await getChartsConfig(JSON.stringify(data.edittedData));
        sessionData.summary = JSON.parse(summary);
        sessionData.graphRecommendation = JSON.parse(graphRecommendation);

        res.json({ 
            summary: JSON.parse(summary),
            graphRecommendation: JSON.parse(graphRecommendation),
            // chartConfig: chartConfig,
        });
    } catch (error) {
        res.status(500).send('Failed to process data.');
    }
});

app.post('/visual-selected', async (req, res) => {
    const data = req.body;
    console.log(data);
    sessionData.visualSelected = data.id;
    sessionData.selectedOption = sessionData.chartConfig[data.id];
    res.json({ chartConfig: sessionData.selectedOption });
});

app.post('/edit-selected', async (req, res) => {
    const data = req.body;
    console.log(data);
    sessionData.chartConfig = data.chartConfig;
    res.json({ chartConfig: sessionData.chartConfig });
});


app.delete('/reset-session', async (req, res) => {
    sessionData = {
        uploadedFile: null,
        parsedData: null,
        chartConfig: null,
        summary: null,
        graphRecommendation: null,
        styleConfig: null,
    };
    console.log('Session reset successfully');
    res.status(200).send('Session reset successfully');
});

module.exports = app;