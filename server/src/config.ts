import { QdrantClient } from "@qdrant/js-client-rest";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();

export const geminiApiKey = process.env.GEMINI_API_KEY || "your-gemini-api-key";
export const geminiClient = new GoogleGenAI({
  apiKey: geminiApiKey,
});

export const qdrantUrl = process.env.QDRANT_URL;
export const qdrantClient = new QdrantClient({
    url: qdrantUrl,
    apiKey: process.env.QDRANT_API_KEY,
});