const { queryDeepSeekV3 } = require('./APIdeepseek.js');
const prompts = require('../prompts/deepseekPrompts.js');

async function getSummary(data){
    const prompt = prompts.feature3("", data);
    try {
        const result = JSON.parse(await queryDeepSeekV3(prompt));
        if(result.errorTrigger === "TableInvalid"){
            const error = new Error(result.issue);
            console.log(result.issue);
            error.code = 'INVALID_EDITED_TABLE';
            throw error;
        }
        return result;
    } catch (error) {
        console.error('Error getting summary:', error);
        throw error;
    }
}

module.exports = {getSummary};