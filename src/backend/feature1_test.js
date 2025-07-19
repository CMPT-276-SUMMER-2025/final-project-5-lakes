const { queryDeepSeekV3 } = require('./deepseek.js');
const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');
const pdfParse = require('pdf-parse'); // For PDF parsing
const Papa = require('papaparse'); // For CSV parsing

// const file = path.join(__dirname, 'excel-test.xlsx');
// const file = path.join(__dirname, "pdf_test.pdf");
// const file = path.join(__dirname, 'csv-test.csv');
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
    const prompt = `${query}\n\nHere is the data:\n${JSON.stringify(data, null, 2)}`;
    const result = await queryDeepSeekV3(prompt);
}
// sendToDeepSeek("convert it into format that the QuickChart API accepts for the chart and tell me what kind of chart can be used to chart this data set", data);

if (!isPDF) {
    // sendToDeepSeek("Just give me the QuickChart API configuration of this data, dont give my anything else at all, give it to me in the JSON format so I can convert it into json. remove ```json ``` from your response", data);
    sendToDeepSeek("Extract the info from this txt file and Just give me the QuickChart API configuration of this data, dont give my anything else at all, give it to me in the JSON format so I can convert it into json. remove ```json ``` from your response", data);
}