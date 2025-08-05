const { queryDeepSeekV3 } = require('./APIdeepseek.js');
const prompts = require('../prompts/deepseekPrompts.js');

async function getGraphRecommendation(data){
    const prompt = prompts.feature2("", data);
    try {
        const rawResult = await queryDeepSeekV3(prompt);
        
        let result;
        try {
            result = JSON.parse(rawResult);
            
            if (!result.types || !Array.isArray(result.types)) {
                const error = new Error ('Unexpected API response.');
                error.code = '';
                error.status = 500;
                throw error;
            }
        } catch (error) {
            throw error;
        }
        return result;
    } catch (error) {
        throw error;
    }
}

module.exports = {getGraphRecommendation};






