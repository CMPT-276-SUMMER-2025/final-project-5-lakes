const { queryDeepSeekV3 } = require('./APIdeepseek.js');
const prompts = require('../prompts/deepseekPrompts.js');


async function getSummary(data){
    const prompt = prompts.feature3("", data);
    try {
        const result = await queryDeepSeekV3(prompt);
        return result;
    } catch (error) {
        console.error('Error getting summary:', error);
        throw error;
    }
}

module.exports = {getSummary};






