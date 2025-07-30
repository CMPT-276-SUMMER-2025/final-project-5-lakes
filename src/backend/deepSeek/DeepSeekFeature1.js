const { queryDeepSeekV3 } = require('./APIdeepseek.js');
const prompts = require('../prompts/deepseekPrompts.js');

async function convertToChartConfig(query, data) {
    const prompt = prompts.feature1(query, data);
    try {
<<<<<<< HEAD
        const result = await queryDeepSeekV3(prompt);

        //throw a specific error for frontend to see if no data was found
<<<<<<< Updated upstream
        if(result == 'Error: No data was extracted.'){
=======
        if(result === 'Error: No data was extracted.'){
>>>>>>> Stashed changes
=======
        const result = JSON.parse(await queryDeepSeekV3(prompt));
        console.log(`CHECK: ${result}`)

        //throw a specific error for frontend to see if no data was found
        if(result === 'Error: No data was extracted.' || result === ''){
>>>>>>> a0817cbc0c29f511c190c8cc2aa85f29401aa7b6
            const error = new Error('No data was extracted from the file.');
            error.code = 'NO_DATA_EXTRACTED';
            console.error(error.code);
            throw error;
        }

        return JSON.parse(result);
    } catch (error) {
        console.error('Error converting to chart config:', error);
        throw error;
    }
}

module.exports = {convertToChartConfig};