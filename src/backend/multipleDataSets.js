const prompts = require('./prompts/deepseekPrompts');
const { queryDeepSeekV3 } = require('./deepseek');


async function separateMultipleDataSets(data) {
    const query = prompts.multipleDataSetsPrompt(data);
    const response = await queryDeepSeekV3(query);
    return JSON.parse(response);
}

module.exports = { separateMultipleDataSets };