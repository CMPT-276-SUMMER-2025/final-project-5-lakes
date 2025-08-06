const { queryDeepSeekV3 } = require('./APIdeepseek.js');
const prompts = require('./prompts/deepseekPrompts.js');

// Generates the feature 2 prompt using input query and data, sends it to DeepSeek, and returns the parsed chart config.
async function getGraphRecommendation(data){
    const prompt = prompts.feature2("", data);
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

module.exports = {getGraphRecommendation};






