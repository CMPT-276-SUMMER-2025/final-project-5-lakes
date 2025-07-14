const { queryDeepSeekV3 } = require('./deepseek');
const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

const file = path.join(__dirname, 'excel-test.xlsx');
const ext = path.extname(file).toLowerCase();

let data = [];
// Parse based on file type
if (ext === '.csv') {
    // Parse CSV
    const csvContent = fs.readFileSync(file.path, 'utf8');
    const parsedCsv = Papa.parse(csvContent, { header: true });
    data = parsedCsv.data;
} else if (ext === '.xlsx') {
    // Parse Excel
    const workbook = XLSX.readFile(file);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    data = XLSX.utils.sheet_to_json(sheet);
} else if (ext === '.pdf') {
    // Parse PDF
    const pdfContent = fs.readFileSync(file.path);
    const pdfText = pdfParse(pdfContent);
    (async () => {
        const pdfText = await pdfParse(pdfContent);
        data = pdfText.text.split('\n');
        await sendToDeepSeek("Convert this into QuickChart API format and recommend a chart type", data);
    })();
} else if (ext === '.txt') {
    // Parse plain text
    const txtContent = fs.readFileSync(file.path, 'utf8');
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
sendToDeepSeek("convert it into format that the QuickChart API accepts for the chart and tell me what kind of chart can be used to chart this data set", data);
