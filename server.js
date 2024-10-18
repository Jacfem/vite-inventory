import express from "express";
import ViteExpress from "vite-express";
import cors from "cors";

const app = express();

// Middleware
app.use(cors());

app.get("/api/message", (req, res) => {
  res.json({ message: "hello world" });
});

ViteExpress.listen(app, 3000, () => console.log("server is listening"));
