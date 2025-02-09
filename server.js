import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

const GENAI_API_KEY = process.env.GEMINI_API_KEY;

app.post("/chat", async (req, res) => {
    const userMessage = req.body.message;

    if (!userMessage) {
        return res.status(400).json({ error: "Message is required" });
    }

    try {
        const response = await axios.post(
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent",
            {
                contents: [{ role: "user", parts: [{ text: userMessage }] }],
            },
            {
                headers: { "Content-Type": "application/json" },
                params: { key: GENAI_API_KEY },
            }
        );

        const aiResponse = response.data.candidates[0]?.content?.parts[0]?.text || "I'm not sure how to respond.";

        res.json({ response: aiResponse.trim() });
    } catch (error) {
        console.error("AI API Error:", error);
        res.status(500).json({ error: "Error processing your request" });
    }
});

app.listen(PORT, () => {
    console.log(`DysonASI server running on port ${PORT}`);
});
