const prompts = require('./prompts/deepseekPrompts.js');
const { queryDeepSeekV3 } = require('./APIdeepseek.js');

// Sends data to DeepSeek to separate chart labels from values and returns the structured result.
async function separateLabels(data) {
    const prompt = prompts.labelsSeparatorPrompt('', data);

    try{
        const rawResult = await queryDeepSeekV3(prompt);

        let result;
        try{
            result = JSON.parse(rawResult);
        } catch (jsonError) {
            const error = new Error('Unexpected API response.');
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

