const { queryDeepSeekV3 } = require('./deepseek.js');
const prompts = require('./prompts/deepseekPrompts.js');


async function getGraphRecommendation(data){
    const prompt = prompts.feature2("if one of the reccomendations you gave is in the dataset, return the reccomendation with the following text: *Chart* Chart type is the reccomended chart that suits your needs for your data visualization", data);
    const result = await queryDeepSeekV3(prompt);
    return result;
}

module.exports = {getGraphRecommendation};






