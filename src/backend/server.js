const express = require('express');
const multer = require('multer');
const { parseFileAndSendToDeepSeek } = require('./feature1.js');
const cors = require('cors');

const app = express();

// Add JSON middleware to parse request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const upload = multer({ dest: 'uploads/' });

app.use(cors({
    origin: 'http://localhost:5173',
}));
// File upload endpoint
app.post('/file-submit', upload.array('files'), async (req, res) => {
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
            const analysisResponse = await sendToDeepSeek(prompts.feature1("", textData), textData);
            // const summaryInsights = await sendToDeepSeek("Give me only summaries of trend or key insights in bullet point form as an array of strings of this data (dont give me anything else at all remove the ``` json ... ``` from your response):" + JSON.stringify(textData));
            
            return res.json({
                analysis: JSON.parse(analysisResponse),
            });
        } catch (error) {
            console.error('Error processing text:', error);
            return res.status(500).send('Error processing the text.');
        }
    }

    try {
        const file = files[0]; // Process first file
        let result = await parseFileAndSendToDeepSeek(file, '');
        result.file = file;
        res.json(result);
    } catch (error) {
        res.status(500).send('Failed to process file.');
    }
});

app.post('/edit-confirm', async (req, res) => {
    const data = req.body;
    console.log('Received data:', data);
    
    // Validate that data exists and has chartConfig property
    if (!data) {
        return res.status(400).json({ error: 'No data provided in request body' });
    }
    
    if (!data.chartConfig) {
        return res.status(400).json({ error: 'chartConfig property is missing from request data' });
    }
    
    res.json({ chartsConfig: data.chartConfig });
});

// Start the server
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
