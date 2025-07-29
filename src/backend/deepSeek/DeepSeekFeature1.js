const { queryDeepSeekV3 } = require('./APIdeepseek.js');
const prompts = require('../prompts/deepseekPrompts.js');

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