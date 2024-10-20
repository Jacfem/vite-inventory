import express from "express";
import cors from "cors";
import pg from "pg";
const { Pool } = pg;
import dotenv from "dotenv";
dotenv.config();

const app = express();
// adjust this:
// const port = process.env.DB_PORT || 3000;
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
});

app.get("/api/products", async (req, res) => {
  await pool.query("SELECT * FROM products;", (err, result) => {
    if (err) {
      throw err;
    }

    res.status(200).json(result.rows);
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
