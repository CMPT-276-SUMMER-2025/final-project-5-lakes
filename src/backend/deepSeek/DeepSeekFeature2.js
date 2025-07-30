const { queryDeepSeekV3 } = require('./APIdeepseek.js');
const prompts = require('../prompts/deepseekPrompts.js');

async function getGraphRecommendation(data){
    const prompt = prompts.feature2("", data);
    try {
        const result = await queryDeepSeekV3(prompt);
        
        // Check if result exists and is not empty
        if (!result || result.trim() === '') {
            console.error('Empty response from DeepSeek API');
            return {
                types: ['bar'],
                explanations: ['Default chart type due to API error']
            };
        }
        
        // Try to parse as JSON
        try {
            const parsedResult = JSON.parse(result);
            
            // Validate that the parsed result has expected structure
            if (!parsedResult.types || !Array.isArray(parsedResult.types)) {
                console.error('Invalid response structure from DeepSeek API:', parsedResult);
                return {
                    types: ['bar'],
                    explanations: ['Default chart type due to invalid API response structure']
                };
            }
            
            return parsedResult;
        } catch (jsonError) {
            console.error('Failed to parse JSON response:', result);
            console.error('JSON parse error:', jsonError.message);
            
            // Return default structure if JSON parsing fails
            return {
                types: ['bar'],
                explanations: ['Default chart type due to invalid JSON response from API']
            };
        }
        
    } catch (error) {
        console.error('Error getting graph recommendation:', error);
        
        // Return default structure instead of throwing
        return {
            types: ['bar'],
            explanations: ['Default chart type due to API error']
        };
    }
}

module.exports = {getGraphRecommendation};






