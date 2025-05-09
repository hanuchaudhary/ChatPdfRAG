import expess, { Request, Response } from "express";
import multer from "multer";
import cors from "cors";
const PORT = process.env.PORT || 8000;
const app = expess();
app.use(cors());
app.use(expess.json());

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

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/upload", upload.single("file"), (req: Request, res: Response) => {
  try {
    if (!req.file) {
      res.status(400).send("No file uploaded.");
      return;
    }
    console.log("File uploaded:", req.file);
    res.status(200).send("File uploaded successfully.");
  } catch (error) {
    res.status(500).send("Error uploading file.");
  }
});

app.listen(PORT, () => {
  console.log(`App is Listening on Port ${PORT}`);
});
