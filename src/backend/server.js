const express = require('express');
const multer = require('multer');
const { parseFileAndSendToDeepSeek } = require('./feature1.js');
const cors = require('cors');

const { queryDeepSeekV3 } = require('./deepseek.js');
const prompts = require('./prompts/deepseekPrompts');


const app = express();
const upload = multer({dest: 'uploads/'});

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
            const result = await queryDeepSeekV3(prompts.feature1("", textData));
            
            return res.json({
                analysis: JSON.parse(result),
            });
        } catch (error) {
            console.error('Error processing text:', error);
            return res.status(500).send('Error processing the text.');
        }
    }

    // Handel file
    try {
        const file = files[0]; // Process first file uploaded
        const result = await parseFileAndSendToDeepSeek (file, '');
        res.json(result);
    } catch (error) {
        res.status(500).send('Failed to process file.');
    }
});

// Start the server
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});

module.exports = app;