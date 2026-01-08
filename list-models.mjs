import { GoogleGenAI } from "@google/genai";
import fs from 'fs';
import path from 'path';

// Load env simply
const envPath = path.resolve('.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const match = envContent.match(/GOOGLE_API_KEY=(.*)/);
const apiKey = match ? match[1] : null;

if (!apiKey) {
    console.error("No GOOGLE_API_KEY found in .env.local");
    process.exit(1);
}

const ai = new GoogleGenAI({ apiKey });

async function listModels() {
    try {
        console.log("Listing models...");
        // The SDK might not have a direct listModels on the 'ai' instance easily accessible in all versions, 
        // but let's try the common pattern or just try a standard generation with a 'safe' model like 'gemini-pro' as a fallback test.
        // Actually, for @google/genai, it might be different than google-generative-ai.
        // Let's rely on the error message suggestion: "Call ListModels".

        // Only some SDK versions support listing models easily. 
        // Let's try to hit the REST API directly to be sure if the SDK is obscure.
        const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.models) {
            console.log("Available Models:");
            data.models.forEach(m => console.log(`- ${m.name}`));
        } else {
            console.log("Could not list models via REST:", data);
        }

    } catch (error) {
        console.error("Error:", error);
    }
}

listModels();
