const { queryDeepSeekV3 } = require('./APIdeepseek.js');
const prompts = require('./prompts/deepseekPrompts.js');

async function getSummary(data){
    const prompt = prompts.feature3("", data);
    try {
        const rawResult = await queryDeepSeekV3(prompt);
        
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

module.exports = {getSummary};