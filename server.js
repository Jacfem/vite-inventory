import express from "express";
import cors from "cors";
import camelcaseKeys from "camelcase-keys";
import pg from "pg";
const { Pool } = pg;
import dotenv from "dotenv";
dotenv.config();
import request from "request";

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

    const convertedResult = camelcaseKeys(result.rows, { deep: true });
    return res.status(200).json(convertedResult);
  });
});

app.get("/api/proxy/upc/:id", async (req, res) => {
  const upc = req.params.id;

  request.post(
    {
      uri: `https://api.upcitemdb.com/prod/trial/lookup`,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ upc: upc }),
    },

    (error, response, body) => {
      if (error) {
        return res.status(500).json({ error: "Failed to post item" });
      }

      const convertedResult = camelcaseKeys(body, { deep: true });

      if (response.statusCode === 201) {
        return res.status(201).json(convertedResult);
      } else {
        return res.status(response.statusCode).json(convertedResult);
      }
    }
  );
});

app.post("/api/products", async (req, res) => {
  const { name, size, image, upc, expirationDate } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Name field is required" });
  }

  try {
    const result = await pool.query(
      "INSERT INTO products (name, size, image, upc, expiration_date) VALUES ($1, $2, $3, $4, $5)",
      [name, size, image, upc, expirationDate]
    );
    res.status(201).json({ body: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

app.put("/api/products/:id", async (req, res) => {
  const { name, size, image, upc, expirationDate } = req.body;
  const productId = req.params.id;

  if (!name) {
    return res.status(400).json({ error: "Name field is required" });
  }

  try {
    const result = await pool.query(
      "UPDATE products SET name = $1, size = $2, image = $3, upc = $4, expiration_date = $5 WHERE id = $6",
      [name, size, image, upc, expirationDate, productId]
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

app.delete("/api/products/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query("DELETE FROM products WHERE id = $1", [id]);
    if (result.rowCount === 0) {
      return res.status(404).send("Product not found");
    }
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).send("Server error");
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
