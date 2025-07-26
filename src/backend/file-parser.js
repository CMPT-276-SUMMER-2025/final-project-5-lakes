const fs = require('fs');
const pdfParse = require('pdf-parse'); // For PDF parsing
const XLSX = require('xlsx'); // For Excel parsing
const Papa = require('papaparse'); // For CSV parsing
const mammoth = require('mammoth'); // For Docx parsing

async function parseFile(file){
    let filePath = null;
    try{
        let data = [];
        filePath = file.path;

        switch (file.mimetype) {
            //parse csv
            case 'text/csv': {
                const csvContent = fs.readFileSync(filePath, 'utf8');
                const parsedCsv = Papa.parse(csvContent, { header: true });
                data = parsedCsv.data;
                break;
            }
            
            //parse excel
            case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': {
                const workbook = XLSX.readFile(file.path);
                const sheet = workbook.Sheets[workbook.SheetNames[0]];
                data = XLSX.utils.sheet_to_json(sheet);
                break;
            }

            //parse pdf
            case 'application/pdf': {
                const pdfContent = fs.readFileSync(file.path);
                const pdfText = await pdfParse(pdfContent);
                data = pdfText.text.split('\n');
                break;
            }

            //parse docx
            case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': {
                const docxBuffer = fs.readFileSync(file.path);
                const docxText = await mammoth.extractRawText({ buffer: docxBuffer });
                data = docxText.value.split('\n');
                break;
            }

            //parse plain text
            case 'text/plain': {
                const txtContent = fs.readFileSync(file.path, 'utf8');
                data = txtContent.split('\n');
                break;
            }

            //if non-matched
            default:
                throw new Error('Unsupported file type.');
        }

        return data;
    } catch (error) {
        console.error('Error processing file:', error);
        throw error;
    } finally {
        if (filePath && fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    }
}

module.exports = {parseFile};