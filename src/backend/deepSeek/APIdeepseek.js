require('dotenv').config();

//API key linking to the DeekSeek Model
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

async function queryDeepSeekV3(prompt) {
  try{
    //get response from OpenRouter, after reponse run API key
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      //base DeepSeek configuration
      body: JSON.stringify({
        model: "deepseek/deepseek-chat-v3-0324:free",
        messages: [{ role: "user", content: prompt }],
        // limits how long the response can be (WE CAN CHANGE THIS)
        max_tokens: 1000,
        // controls randomness (NO RANDOMNESS SO RESPONSES ARE STRAIGHT FORWARD)
        temperature: 0.0,
      }),
    });

    //get/check API returns
    if (!response.ok) {
      console.error("API request failed with status:", response.status, response.statusText);
      return null;
    }

    const data = await response.json();
    if(data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content){
      console.log("Raw API response data: ", data.choices[0].message.content);
      return data.choices[0].message.content;
    }
    else{
      console.error("Unexpected/empty response structure: ", data);
      return null; // Return null instead of fallback string
    }

  } catch (err) {
    console.error("Error calling API: ", err);
    return null; // Return null instead of undefined
  }
};

module.exports = {queryDeepSeekV3};
