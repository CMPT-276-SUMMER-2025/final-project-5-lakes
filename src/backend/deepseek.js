import dotenv from 'dotenv';
import fetch from 'node-fetch';

// Load environment variables from .env file
dotenv.config({ path: "../../.env" });

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

export async function queryDeepSeekV3(prompt) {
  try{
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-chat-v3-0324:free",
        messages: [{ role: "user", content: prompt }],
        // limits how long the response can be (WE CAN CHANGE THIS)
        max_tokens: 1000,
        // controls randomness (WE CAN CHANGE THIS)
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    if(data.choices && data.choices[0]){
      console.log("Raw API response data: ", data.choices[0].message.content);
      // console.log(JSON.parse(data.choices[0].message.content));
    }
    else{
      console.error("Unexpected/empty response: ", data);
      return data.choices?.[0]?.message?.content || "No response from model.";
    }

    return data.choices[0].message.content;
  } catch (err) {
    console.error("Error calling API: ", err);
  }
};

module.exports = {queryDeepSeekV3};
