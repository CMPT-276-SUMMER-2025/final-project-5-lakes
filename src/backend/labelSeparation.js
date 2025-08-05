const prompts = require('./prompts/deepseekPrompts');
const { queryDeepSeekV3 } = require('./deepSeek/APIdeepseek.js');

async function separateLabels(data) {
    const prompt = prompts.labelsSeparatorPrompt('', data);

    try{
        const rawResult = await queryDeepSeekV3(prompt);

        let result;
        try{
            result = JSON.parse(rawResult);
        } catch (jsonError) {
            const error = new Error('Unexpected API response');
            error.code = '';
            error.status = 500;
            throw error;
        }

        if(result.errorTrigger || result.errorTrigger === "TableInvalid"){
            const error = new Error(result.issue);
            error.code = 'INVALID_EDITED_TABLE';
            error.status = 400;
            throw error;
        }
        return (result);
    } catch (error) {
        throw error;
    }
}

module.exports = { separateLabels };

