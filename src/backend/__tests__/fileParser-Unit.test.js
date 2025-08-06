jest.resetModules();

jest.mock('../deepSeek/APIdeepseek.js', () => ({
  queryDeepSeekV3: jest.fn(() => 
    Promise.resolve(JSON.stringify([
      { "Name": "Alice", "Score": "85" },
      { "Name": "Bob", "Score": "90" },
      { "Name": "Charlie", "Score": "78" }
    ]))
  )
}));

const path = require('path');
const fs = require('fs');

const { parseFile } = require('../deepSeek/DeepSeekFileParser.js');
const deepseek = require('../deepSeek/APIdeepseek.js');

const tempUnitDir = path.resolve(__dirname, 'tempUnit');
const tempCSVPath = path.join(tempUnitDir, 'temp_sample.csv');
const tempDOCXPath = path.join(tempUnitDir, 'temp_sample.docx');
const tempPDFPath = path.join(tempUnitDir, 'temp_sample.pdf');
const tempTXTPath = path.join(tempUnitDir, 'temp_sample.txt');
const tempXLSXPath = path.join(tempUnitDir, 'temp_sample.xlsx');

beforeAll(async() => {
    fs.mkdirSync(tempUnitDir);

    fs.writeFileSync(tempCSVPath, ``);

    const { Document, Packer } = require('docx');
    const docDOCX = new Document({sections: []});
    const bufferDOCX = await Packer.toBuffer(docDOCX);
    fs.writeFileSync(tempDOCXPath, bufferDOCX);

    const PDFDocument = require('pdfkit');
    const docPDF = new PDFDocument();
    const writeStream = fs.createWriteStream(tempPDFPath);
    docPDF.pipe(writeStream);
    docPDF.end();
    await new Promise((resolve) => writeStream.on('finish', resolve));

    fs.writeFileSync(tempTXTPath, ``);

    const XLSX = require('xlsx');
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet([[]]);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
    fs.writeFileSync(tempXLSXPath, buffer);
});

afterAll(async () => {
    if (fs.existsSync(tempUnitDir)) {
        await fs.promises.rm(tempUnitDir, { recursive: true, force: true });
    }
});

describe('Unit test for File-Parser', () => {
  test('parses CSV', async () => {
    const mockFile = {
      mimetype: 'text/csv',
      path: path.resolve(tempCSVPath)
    };
    const result = await parseFile(mockFile);
    expect(deepseek.queryDeepSeekV3).toHaveBeenCalled();
    expect(result).toEqual([
      { "Name": "Alice", "Score": "85" },
      { "Name": "Bob", "Score": "90" },
      { "Name": "Charlie", "Score": "78" }
    ]);
  });  

  test('parses XLSX and sends to DeepSeek', async () => {
    const mockFile = {
      mimetype: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      path: path.resolve(tempXLSXPath)
    };    
    const result = await parseFile(mockFile);
    expect(deepseek.queryDeepSeekV3).toHaveBeenCalled();
    expect(result).toEqual([
      { "Name": "Alice", "Score": "85" },
      { "Name": "Bob", "Score": "90" },
      { "Name": "Charlie", "Score": "78" }
    ]);
  });

  test('parses PDF and sends to DeepSeek', async () => {
    const mockFile = {
      mimetype: 'application/pdf',
      path: path.resolve(tempPDFPath)
    };    
    const result = await parseFile(mockFile);
    expect(deepseek.queryDeepSeekV3).toHaveBeenCalled();
    expect(result).toEqual([
      { "Name": "Alice", "Score": "85" },
      { "Name": "Bob", "Score": "90" },
      { "Name": "Charlie", "Score": "78" }
    ]);
  });

  test('parses DOCX and sends to DeepSeek', async () => {
    const mockFile = {
      mimetype: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      path: path.resolve(tempDOCXPath)
    };    
    const result = await parseFile(mockFile);
    expect(deepseek.queryDeepSeekV3).toHaveBeenCalled();
    expect(result).toEqual([
      { "Name": "Alice", "Score": "85" },
      { "Name": "Bob", "Score": "90" },
      { "Name": "Charlie", "Score": "78" }
    ]);
  });

  test('parses TXT and sends to DeepSeek', async () => {
    const mockFile = {
      mimetype: 'text/plain',
      path: path.resolve(tempTXTPath)
    };    
    const result = await parseFile(mockFile);
    expect(deepseek.queryDeepSeekV3).toHaveBeenCalled();
    expect(result).toEqual([
      { "Name": "Alice", "Score": "85" },
      { "Name": "Bob", "Score": "90" },
      { "Name": "Charlie", "Score": "78" }
    ]);
  });
});