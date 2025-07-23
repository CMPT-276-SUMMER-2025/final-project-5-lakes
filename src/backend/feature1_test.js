const { queryDeepSeekV3 } = require('./deepseek');
const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse'); // For PDF parsing
const XLSX = require('xlsx'); // For Excel parsing
const Papa = require('papaparse'); // For CSV parsing
const mammoth = require('mammoth'); // For Docx parsing
const prompts = require('./prompts/deepseekPrompts');

//Feature 1
async function parseFileAndSendToDeepSeek(file, query){
    //Set the file to read/test
    const ext = path.extname(file).toLowerCase();

    let data = [];

    // Parse based on file type
    try{
        if (ext === '.csv') {
            // Parse CSV
            const csvContent = fs.readFileSync(file, 'utf8');
            const parsedCsv = Papa.parse(csvContent, { header: true });
            data = parsedCsv.data;

        } else if (ext === '.xlsx') {
            // Parse Excel
            const workbook = XLSX.readFile(file);
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            data = XLSX.utils.sheet_to_json(sheet);

        } else if (ext === '.pdf') {
            // Parse PDF
            const pdfContent = fs.readFileSync(file);
            const pdfText = await pdfParse(pdfContent);
            data = pdfText.text.split('\n');

        } else if (ext == '.docx') {
            //parse DOCX
            const docxBuffer = fs.readFileSync(file);
            const result = await mammoth.extractRawText({ buffer: docxBuffer });
            data = result.value.split('\n');

        } else if (ext === '.txt') {
            // Parse plain text
            const txtContent = fs.readFileSync(file, 'utf8');
            data = txtContent.split('\n');

        } else {
            throw new Error(`Unsupported file type: ${ext}`);
            process.exit(1);
        }

        console.log(await sendToDeepSeek(query, data));

    } catch (error) {
        console.error("Error processing file:", error);
    }
}

// Function to send data to DeepSeek API
async function sendToDeepSeek(query, data) {
    if (!data || data.length === 0) {
        console.warn("No data extracted from file.");
        return;
    }
    const prompt1 = prompts.feature1(query, data);
    const result1 = await queryDeepSeekV3(prompt1)
    const prompt2 = prompts.feature2(query, result1)
    const result2 = await queryDeepSeekV3(prompt2);
    return ("");
}

parseFileAndSendToDeepSeek("test/files/docx/complex_sample.docx", "");

module.exports = {parseFileAndSendToDeepSeek};