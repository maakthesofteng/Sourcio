const OpenAI = require("openai");

const token = process.env["GITHUB_TOKEN"];
const endpoint = "https://models.github.ai/inference";
const modelName = "openai/gpt-4o-mini";

const client = new OpenAI({ baseURL: endpoint, apiKey: token });

exports.chatbotHandler = async (req, res) => {
  const userMessage = req.body.message;

  try {
    const response = await client.chat.completions.create({
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: userMessage },
      ],
      temperature: 1.0,
      top_p: 1.0,
      max_tokens: 1000,
      model: modelName,
    });

    const generated = response.choices[0]?.message?.content || "Sorry, I didn't understand.";
    res.json({ reply: generated });

  } catch (error) {
    console.error("GitHub Models API error:", error.message);
    res.status(500).json({ error: "Chatbot error." });
  }
};