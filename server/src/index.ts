import expess, { Request, Response } from "express";
import { Queue } from "bullmq";
import multer from "multer";
import cors from "cors";
import { geminiApiKey, geminiClient, qdrantClient, qdrantUrl } from "./config";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { QdrantVectorStore } from "@langchain/qdrant";
const PORT = process.env.PORT || 8000;
const app = expess();
app.use(cors());
app.use(expess.json());

const queue = new Queue("upload-queue", {
  connection: {
    host: "localhost",
    port: 6379,
  },
});

const embeddings = new GoogleGenerativeAIEmbeddings({
  apiKey: geminiApiKey,
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });

app.post(
  "/upload",
  upload.single("file"),
  async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        res.status(400).send("No file uploaded.");
        return;
      }

      await queue.add("file-upload", {
        filePath: req.file.path,
        fileName: req.file.filename,
        fileSize: req.file.size,
        fileDestination: req.file.destination,
      });

      res.status(200).send("File uploaded successfully.");
    } catch (error) {
      res.status(500).send("Error uploading file.");
    }
  }
);

app.post("/chat", async (req: Request, res: Response) => {
  try {
    const { query } = req.body as { query: string };

    if (!query) {
      res.status(400).send("Question is required.");
      return;
    }

    const vectorStore = await QdrantVectorStore.fromExistingCollection(
      embeddings,
      {
        collectionName: "pdf-collection",
        client: qdrantClient,
        url: qdrantUrl,
      }
    );

    const retriever = vectorStore.asRetriever({
      k: 2,
    });
    const docs = await retriever.invoke(query);
    const SYSTEM_PROMPT = `You are a helpful assistant. Answer the question based on the provided context of the PDF document. And  give the answer in a conversational tone and in plain text format not in markdown format.
    Context: ${JSON.stringify(docs)}
    `;

    const response = await geminiClient.models.generateContent({
      model: "gemini-2.0-flash",
      config: {
        systemInstruction: SYSTEM_PROMPT,
      },
      contents: [
        {
          text: query,
        },
      ],
    });
    res.status(200).json({
      response: response.text,
      docs,
    });
  } catch (error) {
    res.status(500).send("Error processing request.");
  }
});

app.listen(PORT, () => {
  console.log(`App is Listening on Port ${PORT}`);
});
