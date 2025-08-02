const express = require('express');
const multer = require('multer');
const cors = require('cors');
const { convertToChartConfig } = require('./deepSeek/DeepSeekFeature1.js');
const { getGraphRecommendation } = require('./deepSeek/DeepSeekFeature2.js');
const { getSummary } = require('./deepSeek/DeepSeekFeature3.js');
const { parseFile } = require('./file-parser.js');
const { separateLabels } = require('./labelSeparation.js');
const { generateDummyChart } = require('./quickChart/QCFeature1.js');
const { generateChart, multipleDatasetsChartGenerator } = require('./quickChart/QCFeature1.js');

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
    summary: null,
    graphRecommendation: null,
    styleConfig: null,
    chartOptions: null,
    visualSelected: null,
    selectedOption: null,
    labels: null,
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
        let result = { parsedData: await parseFile(file), file: file };
        sessionData.uploadedFile = file;
        sessionData.parsedData = result.parsedData;
        return res.json(result);
    } catch (error) {
        return res.status(500).send('Failed to process file.');
    }
});

// Information edit confirm
app.post('/data-confirm', async (req, res) => {
    const data = req.body;
    console.log(`DATA FROM DATACONFIRM ${JSON.stringify(data.edittedData)}`);
    // Validate that data exists and has chartConfig property
    // console.log(data);
    if (!data) {
        return res.status(400).json({ error: 'No data provided in request body' });
    }
    
    try {
        sessionData.edittedData = data.edittedData;

        // const prompt = prompts.feature1("",JSON.stringify(data.edittedData));
        const summary = await getSummary(JSON.stringify(data.edittedData));
        const graphRecommendation = await getGraphRecommendation(JSON.stringify(data.edittedData));

        console.log(`LOOK THIS: ${JSON.stringify(graphRecommendation)}`);

        const chartsWithURLs = [];
        
        for (let i = 0; i < graphRecommendation.types.length; i++) {
            const chartType = graphRecommendation.types[i];
            const reasoning = graphRecommendation.explanations?.[i] || "No explanation provided.";
            chartsWithURLs.push(generateDummyChart(chartType, reasoning));
        }

        sessionData.summary = summary;
        sessionData.graphRecommendation = graphRecommendation;
        sessionData.chartOptions = chartsWithURLs;

        console.log(sessionData.chartOptions);

        /*const labels = await separateLabels(JSON.stringify(data.parsedData));
        console.log(labels);
        // const chartConfig = await getChartsConfig(JSON.stringify(data.edittedData));
        sessionData.summary = JSON.parse(summary);
        sessionData.graphRecommendation = JSON.parse(graphRecommendation);*/

        res.json({ 
            summary: JSON.parse(summary),
            graphRecommendation: graphRecommendation,
            chartsWithURLs: chartsWithURLs,
            // labels: labels,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send('Failed to process data.');
    }
});

app.post('/visual-selected', async (req, res) => {
    const data = req.body;
    sessionData.visualSelected = data.id;
    console.log(data.id);
    //sessionData.selectedOption = sessionData.chartConfig[data.id];

    try{
        // Check if theres data
        if (!sessionData.edittedData){
            return res.status(400).json({ error: 'No parsed data avaiable.' });
        }

        const labels = await separateLabels(JSON.stringify(sessionData.edittedData));
        console.log(labels);

        // Attach chartImageURL using QuickChart
        /*const chartsWithURLs = chartConfigs.map(chart => ({
            //id: chart.id,
            //title: chart.title,
            //description: chart.description,
            id: 1,
            title: "Bar Chart",
            description: "Displays values as bars.",
            imageURL: generateDummyChart()
        }));*/
        let chartType = null;
        for (let i = 0; i < sessionData.chartOptions.length; i++) {
            if (sessionData.chartOptions[i].id === sessionData.visualSelected) {
                chartType = sessionData.chartOptions[i].type;
            }
        }

        const chartConfig = multipleDatasetsChartGenerator(chartType, labels, sessionData.edittedData, data.id);
        console.log(chartConfig);
        sessionData.chartConfig = chartConfig;
        res.json({chartConfig: chartConfig, labels: labels});
    } catch (error) {
        console.error('Error generating chart URLs:', error);
        res.status(500).json({ error: 'Failed to generate visualization options' });
    }
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
        edittedData: null,
        chartConfig: null,
        summary: null,
        graphRecommendation: null,
        styleConfig: null,
        chartOptions: null,
        visualSelected: null,
        selectedOption: null,
        labels: null
    };
    console.log('Session reset successfully');
    res.status(200).send('Session reset successfully');
});

module.exports = app;