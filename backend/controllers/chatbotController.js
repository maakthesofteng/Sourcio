// const { ChatOpenAI } = require("langchain/chat_models/openai");
// const { HumanMessage } = require("langchain/schema");
// require("dotenv").config();

// exports.chatbotHandler = async (req, res) => {
//   try {
//     const { message } = req.body;

//     if (!message) {
//       return res.status(400).json({ error: "Message is required." });
//     }

//     const chat = new ChatOpenAI({
//       openAIApiKey: process.env.OPENAI_API_KEY,
//       temperature: 0.7,
//     });

//     const result = await chat.invoke([
//       new HumanMessage(message),
//     ]);

//     res.status(200).json({ reply: result.content });
//   } catch (error) {
//     console.error("Chatbot error:", error.message);
//     res.status(500).json({ error: "Internal chatbot error." });
//   }
// };



// const fetch = require("node-fetch");

exports.chatbotHandler = async (req, res) => {
  const userMessage = req.body.message;
  const HF_API_KEY = process.env.HF_API_KEY;

  const response = await fetch("https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${HF_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      inputs: {
        text: userMessage
      }
    })
  });

  try {
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Hugging Face returned error: ${errorText}`);
    }

    const data = await response.json();
    const generated = data?.generated_text || "Sorry, I didn't understand.";

    res.json({ reply: generated });
  } catch (error) {
    console.error("Hugging Face API error:", error.message);
    res.status(500).json({ error: "Chatbot error." });
  }
};




// This is my FYP named as Sourcio which is a B2B E-Commerce marketplace. Pakistan's first ever B2B platform which is built in view of solve the problem of sourcing in Pakistan specially for E-Commerce buisness owners.