const prompts = require('./prompts/deepseekPrompts');
const { queryDeepSeekV3 } = require('./deepSeek/APIdeepseek.js');

async function separateLabels(data) {
    const query = prompts.labelsSeparatorPrompt(data);
    const response = await queryDeepSeekV3(query);
    return JSON.parse(response);
}

//module.exports = { separateLabels };