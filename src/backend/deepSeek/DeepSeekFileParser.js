const fs = require('fs');
const pdfParse = require('pdf-parse'); // For PDF parsing
const XLSX = require('xlsx'); // For Excel parsing
const Papa = require('papaparse'); // For CSV parsing
const mammoth = require('mammoth'); // For Docx parsing
const { convertToChartConfig } = require('./DeepSeekFeature1');

// Parses file (CSV, XLSX, PDF, DOCX, TXT), extracts data, and runs DeepSeek feature 1
async function parseFile(file){
    let filePath = null;
    try{
        let data = [];
        filePath = file.path;

        switch (file.mimetype) {
            //parse csv
            case 'text/csv': {
                const csvContent = fs.readFileSync(filePath, 'utf8');
                try {
                    const parsedCsv = Papa.parse(csvContent, { header: true });
                    data = JSON.stringify(parsedCsv.data);
                } catch (err) {
                    const error = new Error('CSV is corrupted or unreadable.');
                    error.code = '';
                    error.status = 410;
                    throw error;
                }
                break;
            }
            
            //parse excel
            case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': {
                try {
                    const workbook = XLSX.readFile(file.path);
                    const sheet = workbook.Sheets[workbook.SheetNames[0]];
                    const sheetData = XLSX.utils.sheet_to_json(sheet);
                    data = JSON.stringify(sheetData);
                } catch (err) {
                    const error = new Error('XLSX is corrupted or unreadable.');
                    error.code = '';
                    error.status = 410;
                    throw error;
                }
                break;
            }

            //parse pdf
            case 'application/pdf': {
                const pdfContent = fs.readFileSync(file.path);
                try{
                    const pdfText = await pdfParse(pdfContent);
                    data = pdfText.text.split('\n');
                } catch (err) {
                    const error = new Error('PDF is corrupted or unreadable.');
                    error.code = 'empty';
                    error.status = 410;
                    throw error;
                }
                break;
            }

            //parse docx
            case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': {
                const docxBuffer = fs.readFileSync(file.path);
                try {
                    const docxText = await mammoth.extractRawText({ buffer: docxBuffer });
                    data = docxText.value.split('\n');
                } catch (err) {
                    const error = new Error('DOCX is corrupted or unreadable.');
                    error.code = '';
                    error.status = 410;
                    throw error;
                }
                break;
            }

            //parse plain text
            case 'text/plain': {
                const txtContent = fs.readFileSync(file.path, 'utf8');
                data = txtContent.split('\n');
                break;
            }

            default:
                const error = new Error('Unsupported file type.');
                error.code = '';
                error.status = 410;
                throw error;
        }
        const result = await convertToChartConfig('', data);
        return result;
    } catch (error) {
        throw error;
    } finally {
        if (filePath && fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    }
}

module.exports = {parseFile};