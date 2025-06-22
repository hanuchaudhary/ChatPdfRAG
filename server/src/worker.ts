import { Worker } from "bullmq";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { QdrantVectorStore } from "@langchain/qdrant";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { geminiApiKey, qdrantClient, qdrantUrl } from "./config";

const worker = new Worker(
  "upload-queue",
  async (job) => {
    // Check if the required environment variables are set
    if (!qdrantUrl || !geminiApiKey) {
      throw new Error(
        "Qdrant URL and Gemini API key must be provided in environment variables."
      );
    }

    console.log(`Processing job ${job.id}`);
    const jobData = job.data;
    console.log(`Job data: ${JSON.stringify(jobData)}`);

    // Load the PDF
    const loader = new PDFLoader(jobData.filePath);
    const docs = await loader.load();
    console.log(`Loaded ${docs.length} documents from PDF`);

    // Embed the documents
    const embeddings = new GoogleGenerativeAIEmbeddings({
      apiKey: geminiApiKey,
    });

    // Store the documents in Qdrant
    const vectorStore = await QdrantVectorStore.fromExistingCollection(
      embeddings,
      {
        collectionName: "pdf-collection",
        client: qdrantClient,
        url: qdrantUrl,
      }
    );
    await vectorStore.addDocuments(docs);
    console.log(`Stored ${docs.length} documents in Qdrant`);
  },
  {
    connection: {
      url : process.env.REDIS_URL
    },
    concurrency: 20,
  }
);

worker.on("completed", (job) => {
  console.log(`Job ${job.id} completed!`);
});

worker.on("progress", (job, progress) => {
  console.log(`Job ${job.id} is ${progress}% complete`);
});

worker.on("failed", (job, err) => {
  console.log(`Job ${job?.id} failed with error: ${err.message}`);
});

