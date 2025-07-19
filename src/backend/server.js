const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const Papa = require('papaparse'); // For CSV parsing
const XLSX = require('xlsx'); // For Excel parsing
const pdfParse = require('pdf-parse'); // For PDF parsing
const { queryDeepSeekV3 } = require('./deepseek');


const app = express();
const upload = multer({ dest: 'uploads/' });

// Function to send data to DeepSeek API
async function sendToDeepSeek(query, data) {
    const prompt = `${query}\n\nHere is the data:\n${JSON.stringify(data, null, 2)}`;
    const result = await queryDeepSeekV3(prompt);
    return result;
}

// File upload endpoint
app.post('/upload', upload.single('file'), async (req, res) => {
    const file = req.file;
    const query = req.body.query;
    const summaryQuery = "Extract the info from this txt file and Just give me the QuickChart API configuration of this data, dont give my anything else at all, give it to me in the JSON format so I can convert it into json. remove ```json ``` from your response";

    if (!file) {
        return res.status(400).send('No file uploaded.');
    }

    try {
        let data = [];
        // Parse based on file type
        if (file.mimetype === 'text/csv') {
            // Parse CSV
            const csvContent = fs.readFileSync(file.path, 'utf8');
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
        } else if (file.mimetype === 'text/plain') {
            // Parse plain text
            const txtContent = fs.readFileSync(file.path, 'utf8');
            data = txtContent.split('\n');
        } else {
            return res.status(400).send('Unsupported file type.');
        }

        // Send parsed data to DeepSeek API for further analysis
        const analysisResponse = await sendToDeepSeek(query, data);
        const summaryInsights = await sendToDeepSeek(summaryQuery, data);
        res.json({
            analysis: analysisResponse,
            summary: summaryInsights,
        });  // Send back processed data or insights
    } catch (error) {
        res.status(500).send('Error processing the file.');
    } finally {
        // Clean up uploaded file
        fs.unlinkSync(file.path);
    }
});

// Start the server
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
