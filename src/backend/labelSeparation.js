const prompts = require('./prompts/deepseekPrompts');
const { queryDeepSeekV3 } = require('./deepSeek/APIdeepseek.js');

async function separateLabels(data) {
    const query = prompts.labelsSeparatorPrompt(data);
    let rawResponse;
    try {
        rawResponse = await queryDeepSeekV3(query);
    } catch (error) {
        throw error;
    }

    let response;
    try {
        response = JSON.parse(rawResponse);
    } catch (jsonError) {
        const error = new Error('Unexpected API response');
        error.code = '';
        error.status = 500;
        throw error; 
    }

    return response;
}


module.exports = { separateLabels };

