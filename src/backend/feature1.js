const { queryDeepSeekV3 } = require('./deepseek.js');
const fs = require('fs');
const pdfParse = require('pdf-parse'); // For PDF parsing
const XLSX = require('xlsx'); // For Excel parsing
const Papa = require('papaparse'); // For CSV parsing
const mammoth = require('mammoth'); // For Docx parsing
const prompts = require('./prompts/deepseekPrompts');

async function convertToChartConfig(query, data) {
    const prompt = prompts.feature1(query, data);
    try {
        const result = await queryDeepSeekV3(prompt);
        return JSON.parse(result);
    } catch (error) {
        console.error('Error converting to chart config:', error);
        throw error;
    }
}

module.exports = {convertToChartConfig};