import { GoogleGenAI } from "@google/genai";
import { QdrantClient } from "@qdrant/js-client-rest";
import dotenv from "dotenv";
dotenv.config();

export const geminiApiKey = process.env.GEMINI_API_KEY || "your-gemini-api-key";
export const geminiClient = new GoogleGenAI({
  apiKey: geminiApiKey,
});

export const qdrantUrl = process.env.QDRANT_URL || "http://localhost:6333";
export const qdrantClient = new QdrantClient({ url: process.env.QDRANT_URL });