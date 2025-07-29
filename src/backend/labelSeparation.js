const prompts = require('./prompts/deepseekPrompts');
const { queryDeepSeekV3 } = require('./deepSeek/APIdeepseek.js');

async function separateLabels(data) {
    const query = prompts.labelsSeparatorPrompt(data);
    const response = await queryDeepSeekV3(query);
    return JSON.parse(response);
}

<<<<<<< HEAD
module.exports = { separateLabels };
=======
//module.exports = { separateLabels };
>>>>>>> f348347aa8f485c27d8badddd71bc030cd19e945
