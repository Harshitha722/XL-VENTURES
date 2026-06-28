const path = require("path");

require("dotenv").config({
    path: path.resolve(__dirname, "..", "..", ".env")
});

const { GoogleGenAI } = require("@google/genai");

const MODEL_NAME = "gemini-2.5-flash";

let client = null;

function getClient() {
    if (!process.env.GEMINI_API_KEY) {
        return null;
    }

    if (!client) {
        client = new GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY
        });
    }

    return client;
}

async function askGemini(prompt) {
    const gemini = getClient();

    if (!gemini) {
        throw new Error("GEMINI_API_KEY is not configured.");
    }

    const response = await gemini.models.generateContent({
        model: MODEL_NAME,
        contents: prompt
    });

    return response.text || "";
}

module.exports = {
    askGemini,
    MODEL_NAME
};
