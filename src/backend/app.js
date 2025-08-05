const express = require('express');
const multer = require('multer');
const cors = require('cors');
const { convertToChartConfig } = require('./deepSeek/DeepSeekFeature1.js');
const { getGraphRecommendation } = require('./deepSeek/DeepSeekFeature2.js');
const { getSummary } = require('./deepSeek/DeepSeekFeature3.js');
const { parseFile } = require('./file-parser.js');
const { separateLabels } = require('./labelSeparation.js');
const { generateDummyChart } = require('./quickChart/QCFeature1.js');
const { multipleDatasetsChartGenerator } = require('./quickChart/QCFeature1.js');

const app = express();

// Add JSON middleware to parse request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const upload = multer({dest: 'uploads/'});

let sessionData = {
    uploadedFile: null,
    parsedData: null,
    edittedData: null,
    chartConfig: null,
    labels: null,
    summary: null,
    graphRecommendation: null,
    styleConfig: null,
    chartOptions: null,
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

app.post('/file-submit', upload.array('files'), async (req, res) => {
    console.log('Incoming /file-submit request from:', req.headers.origin);
    const files = req.files;
    const text = req.body.text;
    // Handle text input if no files are uploaded
    if (!files || files.length === 0) {
        if (!text || text.trim() === '') {
            return res.status(400).json({ error: 'No file or text provided.', code: '' });
        }
        
        try {
            const textData = text.split('\n').filter(line => line.trim() !== '');
            const result = await convertToChartConfig("", textData);
            sessionData.parsedData = result;
            return res.json({ parsedData: result, text: text });
        } catch (error) {
            if (error.code === 'NO_DATA_EXTRACTED') {
                return res.status(error.status).json({ error: 'No meaningful data could be extracted from the file.', code: error.code });
            } else {
                return res.status(error.status || 500).json({ error: error.message, code: error.code || ''});
            }
        }
    }

    // Handle file
    try {
        const file = files[0]; // Process first file uploaded
        let result = { parsedData: await parseFile(file), file: file };
        sessionData.uploadedFile = file;
        sessionData.parsedData = result.parsedData;
        return res.json(result);
    } catch (error) {
        if (error.code === 'NO_DATA_EXTRACTED') {
            return res.status(error.status).json({ error: 'No meaningful data could be extracted from the file.', code: error.code });
        } else {
            return res.status(error.status || 500).json({ error: error.message, code: error.code || ''});
        }
    }
});

app.post('/edit-data', async (req, res) => {
    const data = req.body;
    
    try {
        if(!sessionData.labels || 
            JSON.stringify(sessionData.edittedData) !== JSON.stringify(data.edittedData)
        ){
            let label;
            try {
                label = await separateLabels(JSON.stringify(data.edittedData));
                sessionData.labels = label;
            } catch (error) {
                if(error.code === 'INVALID_EDITED_TABLE'){
                    return res.status(error.status).json({ error: error.message, code: error.code });
                } else {
                    return res.status(error.status || 500).json({ error: error.message, code: error.code || ''});
                }
            }
        }

        if(!sessionData.summary ||
            JSON.stringify(sessionData.edittedData) !== JSON.stringify(data.edittedData)
        ){
            let summary;
            try {
                summary = await getSummary(JSON.stringify(data.edittedData));
                sessionData.summary = summary
            } catch (error) {
                return res.status(error.status || 500).json({ error: error.message, code: error.code || '' });
            }
        }

        if(!sessionData.graphRecommendation || !sessionData.chartOptions ||
            JSON.stringify(sessionData.edittedData) !== JSON.stringify(data.edittedData)
        ){
            let graphRecommendation;
            const chartsWithURLs = [];
            try{
                graphRecommendation = await getGraphRecommendation(JSON.stringify(data.edittedData));
            
                for (let i = 0; i < graphRecommendation.types.length; i++) {
                    const chartType = graphRecommendation.types[i];
                    const reasoning = graphRecommendation.explanations?.[i] || "No explanation provided.";
                    chartsWithURLs.push(generateDummyChart(chartType, reasoning));
                }

                sessionData.graphRecommendation = graphRecommendation;
                sessionData.chartOptions = chartsWithURLs;
            } catch (error) {
                return res.status(error.status || 500).json({ error: error.message, code: error.code || ''});
            }
        }
        
        sessionData.edittedData = data.edittedData;

        res.json({ 
            summary: sessionData.summary,
            graphRecommendation: sessionData.graphRecommendation,
            chartsWithURLs: sessionData.chartOptions
        });
    } catch (error) {
        return res.status(error.status || 500).json({ error: error.message, code: error.code || ''});
    }
});

app.post('/visual-selected', async (req, res) => {
    const data = req.body;
    sessionData.visualSelected = data.id;

    try{
        let chartType = null;
        for (let i = 0; i < sessionData.chartOptions.length; i++) {
            if (sessionData.chartOptions[i].id === sessionData.visualSelected) {
                chartType = sessionData.chartOptions[i].type;
            }
        }
        const chartConfig = multipleDatasetsChartGenerator(chartType, sessionData.labels, sessionData.edittedData, data.id);
        sessionData.chartConfig = chartConfig;
        res.json({chartConfig: chartConfig, labels: sessionData.labels});
    } catch (error) {
        return res.status(error.status || 500).json({ error: error.message, code: error.code || ''});
    }
});

app.post('/edit-selected', async (req, res) => {
    const data = req.body;
    sessionData.chartConfig = data.chartConfig;
    res.json({ 
        summary: sessionData.summary,
        graphRecommendation: sessionData.graphRecommendation,
        chartsWithURLs: sessionData.chartOptions 
    });
});


app.delete('/reset-session', async (req, res) => {
    sessionData = {
        uploadedFile: null,
        parsedData: null,
        edittedData: null,
        chartConfig: null,
        labels: null,
        summary: null,
        graphRecommendation: null,
        styleConfig: null,
        chartOptions: null,
        visualSelected: null,
        selectedOption: null,
    };
    console.log('Session reset successfully');
    res.status(200).send('Session reset successfully');
});

module.exports = app;