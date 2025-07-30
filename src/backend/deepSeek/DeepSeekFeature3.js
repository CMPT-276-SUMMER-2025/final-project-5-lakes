const { queryDeepSeekV3 } = require('./APIdeepseek.js');
const prompts = require('../prompts/deepseekPrompts.js');

async function getSummary(data){
    const prompt = prompts.feature3("", data);
    try {
        const result = JSON.parse(await queryDeepSeekV3(prompt));
        console.log('3');
        if(result.errorTrigger === "TableInvalid"){
            const error = new Error(result.issue);
            error.code = 'INVALID_EDITTED_TABLE';
            console.error(error.code);
            throw error;
        }
        console.log('4');
        return result;
    } catch (error) {
        console.log('5');
        console.error('Error getting summary:', error);
        throw error;
    }
}

module.exports = {getSummary};






