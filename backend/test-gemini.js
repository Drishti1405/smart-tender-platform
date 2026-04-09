import { GoogleGenAI } from "@google/genai";
import fs from "fs";

// To load .env
import url from 'url';
const apiKey = process.env.VITE_GEMINI_API_KEY;

const ai = new GoogleGenAI({ apiKey });

async function run() {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "hello",
    });
    console.log("Success with 2.5-flash:", response.text);
  } catch (e) {
    console.error("Error with 2.5-flash:", e.message);
  }
}
run();
