const { queryDeepSeekV3 } = require('./deepseek.js');
const prompts = require('./prompts/deepseekPrompts.js');


async function getSummary(data){
    const prompt = prompts.feature3("", data);
    const result = await queryDeepSeekV3(prompt);
    return result;
}

module.exports = {getSummary};






