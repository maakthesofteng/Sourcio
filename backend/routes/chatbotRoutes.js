const express = require("express");
const router = express.Router();
const { chatbotHandler } = require("../controllers/chatbotController");

// POST endpoint for chatbot
router.post("/chatbot", chatbotHandler);

module.exports = router;
