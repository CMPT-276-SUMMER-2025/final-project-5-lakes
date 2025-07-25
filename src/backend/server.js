const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const Papa = require('papaparse'); // For CSV parsing
const XLSX = require('xlsx'); // For Excel parsing
const pdfParse = require('pdf-parse'); // For PDF parsing
const mammoth = require('mammoth'); // For DOCX parsing
const { queryDeepSeekV3 } = require('./deepseek');
const { prompts, summaryQuery } = require('./prompts/deepseekPrompts');
const cors = require('cors');


const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(cors({
    origin: 'http://localhost:5173',
}));

// Function to send data to DeepSeek API
async function sendToDeepSeek(query, data) {
    if (!data || data.length === 0) {
        console.warn("No data extracted from file.");
        return null;
    }
    const prompt = prompts.feature1(query, data);
    const result = await queryDeepSeekV3(prompt);
    console.log("Raw API response data:", result);
    return result; // ← This was missing!
}


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

    let filePath = null;
    try {
        let data = [];
        const file = files[0]; // Process first file for 
        filePath = file.path; // Store for cleanup
        // Parse based on file type
        if (file.mimetype === 'text/csv') {
            // Parse CSV
            const csvContent = fs.readFileSync(filePath, 'utf8');
            const parsedCsv = Papa.parse(csvContent, { header: true });
            data = parsedCsv.data;
        } else if (file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
            // Parse Excel
            const workbook = XLSX.readFile(file.path);
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            data = XLSX.utils.sheet_to_json(sheet);
        } else if (file.mimetype === 'application/pdf') {
            // Parse PDF
            const pdfContent = fs.readFileSync(file.path);
            const pdfText = await pdfParse(pdfContent);
            data = pdfText.text.split('\n');
        } else if (file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            // Parse DOCX
            const docxBuffer = fs.readFileSync(file.path);
            const docxText = await mammoth.extractRawText({ buffer: docxBuffer });
            data = docxText.value.split('\n');
        } else if (file.mimetype === 'text/plain') {
            // Parse plain text
            const txtContent = fs.readFileSync(file.path, 'utf8');
            data = txtContent.split('\n');
        } else {
            return res.status(400).send('Unsupported file type.');
        }

        // Send parsed data to DeepSeek API for further analysis
        const analysisResponse = await sendToDeepSeek(prompts.feature1("", data), data);
        res.json({
            analysis: JSON.parse(analysisResponse),
        });  // Send back processed data or insights
    } catch (error) {
        console.error('Error processing file:', error); //Log for backend view
        res.status(500).send('Error processing the file.');
    } finally {
        // Clean up uploaded file
        if (filePath && fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    }
});


// Start the server
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
