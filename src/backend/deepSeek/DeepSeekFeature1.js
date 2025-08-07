const { queryDeepSeekV3 } = require('./APIdeepseek.js');
const prompts = require('./prompts/deepseekPrompts.js');

// Generates the feature 1 prompt using input query and data, sends it to DeepSeek, and returns the parsed chart config.
async function convertToChartConfig(query, data) {
    const prompt = prompts.feature1(query, data);
    try {
        const rawResult = await queryDeepSeekV3(prompt);
        
        if(rawResult === 'Error: No data was extracted.'){
            const error = new Error('No data was extracted from the file.');
            error.code = 'NO_DATA_EXTRACTED';
            error.status = 400;
            throw error;
        }

        let result;
        try {
            result = JSON.parse(rawResult);
        } catch (jsonError) {
            const error = new Error('Unexpected API response.');
            error.code = '';
            error.status = 500;
            throw error;
        }

        return result;
    } catch (error) {
        throw error;
    }
}

module.exports = {convertToChartConfig};