// src/components/Chatbot.jsx
import { useState } from "react";

const Chatbot = ({ onClose }) => {
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hi! How can I assist you today?" }
  ]);
  const [userInput, setUserInput] = useState("");

  const sendMessage = async () => {
    if (!userInput.trim()) return;

    const userMsg = { from: "user", text: userInput };
    setMessages([...messages, userMsg]);
    setUserInput("");

    try {
      const res = await fetch("http://localhost:5000/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userInput })
      });

      const data = await res.json();
      const botMsg = { from: "bot", text: data.reply };
      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "Oops! Something went wrong." }
      ]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div className="fixed bottom-20 right-5 w-80 h-[400px] bg-white shadow-lg rounded-xl border border-gray-300 flex flex-col z-50">
      <div className="bg-blue-500 text-white p-3 rounded-t-xl flex justify-between items-center">
        <h2 className="text-lg font-semibold">Sourcio AI ChatBot</h2>
        <button
          onClick={() => {
            console.log("Close button clicked");
            onClose(); // make sure this exists
          }}
          className="text-xl font-bold"
        >
          ✕
        </button>
      </div>

      <div className="flex-1 p-3 overflow-y-auto space-y-2">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-2 rounded-lg max-w-[75%] ${
              msg.from === "user"
                ? "bg-blue-100 self-end ml-auto text-right"
                : "bg-gray-100 self-start text-left"
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      <div className="p-3 border-t flex items-center gap-2">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 border border-gray-300 rounded px-3 py-1 text-sm"
          placeholder="Type a message..."
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white px-4 py-1 rounded text-sm"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
