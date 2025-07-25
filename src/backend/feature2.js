const { queryDeepSeekV3 } = require('./deepseek.js');
const prompts = require('./prompts/deepseekPrompts.js');


async function getGraphRecommendation(data){
    const prompt = prompts.feature2("", data);
    const result = await queryDeepSeekV3(prompt);
    return result;
}

module.exports = {getGraphRecommendation};






