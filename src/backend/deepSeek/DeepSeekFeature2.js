const { queryDeepSeekV3 } = require('./APIdeepseek.js');
const prompts = require('../prompts/deepseekPrompts.js');


async function getGraphRecommendation(data){
    const prompt = prompts.feature2("", data);
    try {
        const result = await queryDeepSeekV3(prompt);
        return result;
    } catch (error) {
        console.error('Error getting graph recommendation:', error);
        throw error;
    }
}

module.exports = {getGraphRecommendation};






