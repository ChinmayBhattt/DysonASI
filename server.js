import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import axios from "axios";
import dotenv from "dotenv";
import stringSimilarity from "string-similarity";

dotenv.config();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

const GENAI_API_KEY = process.env.GEMINI_API_KEY;

// Predefined responses
const predefinedResponses = {
    "who are you": "I am DysonASI, your personalized Artificial Super Intelligence. How can I help you today?",
    "what's your name": "My name is DysonASI, and I'm here to assist you with anything you need!",
    "who created you": "I was created by the team of DysonASI to assist you with various tasks in your daily life.",
    "are you human": "Nope! I am a highly advanced AI, but I can chat like a human if you want.",
    "can you think like a human": "I can process information and generate responses like a human, but I don't have emotions or personal experiences.",
    "tell me a joke": "Sure! Why don’t rockets ever get good grades? Because they always go over everyone’s head! 🚀😆",
    "what is dysonasi": "DysonASI stands for Dyson Artificial Super Intelligence, designed to assist, guide, and simplify your tasks.",
    "are you smarter than google assistant": "I’m built differently! Google Assistant is great at real-world tasks, but I focus on intelligent conversation, research, and problem-solving.",
    "who made you": "Chinmay Bhatt, Prashant Jain",  // ✅ Added this
    

};

// Function to find the best-matching predefined response
const findBestMatch = (userMessage) => {
    const questions = Object.keys(predefinedResponses);
    const matches = stringSimilarity.findBestMatch(userMessage.toLowerCase(), questions);
    const bestMatch = matches.bestMatch;

    console.log(`User Input: ${userMessage}`);
    console.log(`Best Match: ${bestMatch.target}, Similarity: ${bestMatch.rating}`);
    

    if (bestMatch.rating > 0.5) { // ✅ Threshold 0.5 kiya
        return predefinedResponses[bestMatch.target];
    }
    
    return null;
};

// Chat endpoint
app.post("/chat", async (req, res) => {
    const userMessage = req.body.message.trim().toLowerCase(); // Convert to lowercase for better matching

    // Check predefined responses with fuzzy matching
    const bestResponse = findBestMatch(userMessage);
    if (bestResponse) {
        console.log(`Predefined Response Sent: ${bestResponse}`);
        return res.json({ response: bestResponse });
    }

    // If no predefined response is found, call Gemini API
    try {
        console.log("No predefined match found, calling Gemini API...");
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

        console.log(`Gemini API Response: ${aiResponse}`);
        res.json({ response: aiResponse.trim() });
    } catch (error) {
        console.error("AI API Error:", error);
        res.status(500).json({ error: "Error processing your request" });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`DysonASI server running on port ${PORT}`);
});
