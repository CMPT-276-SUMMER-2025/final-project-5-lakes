require('dotenv').config();

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

// Sends a prompt to the DeepSeek Chat model via OpenRouter API and returns the response content.
async function queryDeepSeekV3(prompt) {
  try{
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        models: [
          "tngtech/deepseek-r1t2-chimera:free",
          "tngtech/deepseek-r1t-chimera:free"
        ],
        messages: [{ role: "user", content: prompt }],
        max_tokens: 3000,
        temperature: 0.0,
      }),
    });

    if (!response.ok) {
      const error = new Error (`${response.statusText}`);
      error.code = '';
      error.status = response.status;
      throw error;
    }

    const data = await response.json();
    if(data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content){
      return data.choices[0].message.content;
    }
    else{
      const error = new Error ("Unexpected API response.");
      error.code = '';
      error.status = 500;
      throw error;
    }

  } catch (error) {
    throw error;
  }
};

module.exports = {queryDeepSeekV3};
