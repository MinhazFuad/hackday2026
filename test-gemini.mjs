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

async function test() {
    try {
        console.log("Testing Gemini API...");
        const response = await ai.models.generateContent({
            model: "gemini-1.5-flash",
            contents: "Hello",
        });

        console.log("Response object keys:", Object.keys(response));
        console.log("Is text a function?", typeof response.text === 'function');
        console.log("Text value:", typeof response.text === 'function' ? response.text() : response.text);

    } catch (error) {
        console.error("Test Script Error:", error);
    } finally {
        console.log("Test finished");
    }
}

test();
