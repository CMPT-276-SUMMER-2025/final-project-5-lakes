const { queryDeepSeekV3 } = require('./deepseek');
const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse'); // For PDF parsing
const XLSX = require('xlsx'); // For Excel parsing
const Papa = require('papaparse'); // For CSV parsing
const mammoth = require('mammoth'); // For Docx parsing
const prompts = require('./prompts/deepseekPrompts');

//Set the file to read/test
const file = path.join(__dirname, "txt-test.txt");
const ext = path.extname(file).toLowerCase();

let isPDF = false;
let data = [];

// Parse based on file type
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
    isPDF = true;
    (async () => {
        const pdfText = await pdfParse(pdfContent);
        data = pdfText.text.split('\n');
        sendToDeepSeek("Just give me the QuickChart API configuration of this data, dont give my anything else at all, give it to me in the JSON format so I can convert it into json. remove ```json ``` from your response", data);
    })();
} else if (ext == '.docx') {
    //parse DOCX
    isAsyncParse = true;
    (async () => {
        try {
            const docxBuffer = fs.readFileSync(file);
            const result = await mammoth.extractRawText({ buffer: docxBuffer });
            data = result.value.split('\n'); // Turn it into line-by-line data
            sendToDeepSeek("Just give me the QuickChart API configuration of this data, don't give me anything else at all. Output only valid JSON, no ```json``` tags.", data);
        } catch (err) {
            console.error("Error reading .docx file:", err);
        }
    })();
} else if (ext === '.txt') {
    // Parse plain text
    const txtContent = fs.readFileSync(file, 'utf8');
    data = txtContent.split('\n');
} else {
    console.error("Unsupported file type.");
    process.exit(1);
}

// Function to send data to DeepSeek API
async function sendToDeepSeek(query, data) {
    if (!data || data.length === 0) {
        console.warn("No data extracted from file.");
        return;
    }
    const prompt = prompts.feature1(query, data);
    const result = await queryDeepSeekV3(prompt);
    console.log(result);
}
// sendToDeepSeek("convert it into format that the QuickChart API accepts for the chart and tell me what kind of chart can be used to chart this data set", data);

if (!isPDF) {
    // sendToDeepSeek("Just give me the QuickChart API configuration of this data, dont give my anything else at all, give it to me in the JSON format so I can convert it into json. remove ```json ``` from your response", data);
    sendToDeepSeek("Extract the info from this txt file and Just give me the QuickChart API configuration of this data, dont give my anything else at all, give it to me in the JSON format so I can convert it into json. remove ```json ``` from your response", data);
}