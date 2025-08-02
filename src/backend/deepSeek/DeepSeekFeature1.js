const { queryDeepSeekV3 } = require('./APIdeepseek.js');
const prompts = require('../prompts/deepseekPrompts.js');

async function convertToChartConfig(query, data) {
    const prompt = prompts.feature1(query, data);
    try {
        const rawResult = await queryDeepSeekV3(prompt);
        
        // Check if result exists and is not empty
        if (!rawResult || rawResult.trim() === '') {
            const error = new Error('Empty response from DeepSeek API');
            error.code = 'NO_DATA_EXTRACTED';
            console.error(error.code);
            throw error;
        }

        // Try to parse as JSON
        let result;
        try {
            result = JSON.parse(rawResult);
        } catch (jsonError) {
            console.error('Failed to parse JSON response:', rawResult);
            console.error('JSON parse error:', jsonError.message);
            const error = new Error('Invalid JSON response from API');
            error.code = 'INVALID_JSON_RESPONSE';
            throw error;
        }

        console.log(`CHECK: ${JSON.stringify(result)}`);

        //throw a specific error for frontend to see if no data was found
        if(result === 'Error: No data was extracted.' || result === ''){
            const error = new Error('No data was extracted from the file.');
            error.code = 'NO_DATA_EXTRACTED';
            console.error(error.code);
            throw error;
        }

        return result;
    } catch (error) {
        console.error('Error converting to chart config:', error);
        throw error;
    }
}

module.exports = {convertToChartConfig};