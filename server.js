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

app.post("/api/products", async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Name field is required" });
  }

  try {
    const result = await pool.query("INSERT INTO products (name) VALUES ($1)", [
      name,
    ]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

app.put("/api/products/:id", async (req, res) => {
  const { name } = req.body;
  const productId = req.params.id;

  if (!name) {
    return res.status(400).json({ error: "Name field is required" });
  }

  try {
    const result = await pool.query(
      "UPDATE products SET name = $1 WHERE id = $2;",
      [name, productId]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json({ message: "Product updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
