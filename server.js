const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise"); // ✅ Use promise-based MySQL2

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Create MySQL Connection Pool (No need to call `connect()`)
const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "*Chaitanya11", // Ensure this is correct
  database: "erp",
});

// ✅ API to fetch all projects
app.get("/projects", async (req, res) => {
  try {
    const [results] = await db.query("SELECT project_id FROM project");
    res.json(results);
  } catch (err) {
    console.error("Error fetching projects:", err);
    res.status(500).send("Error fetching projects.");
  }
});

// ✅ API to fetch customer details by project ID
app.get("/customer/:project_id", async (req, res) => {
  try {
    const { project_id } = req.params;
    const query = `
      SELECT c.cname AS customer_name, c.customer_address AS address
      FROM customer c
      JOIN project p ON c.customer_id = p.customer_id
      WHERE p.project_id = ?;
    `;
    const [results] = await db.query(query, [project_id]);

    if (results.length === 0) {
      return res.status(404).json({ error: "Customer not found." });
    }
    res.json(results[0]);
  } catch (err) {
    console.error("Error fetching customer:", err);
    res.status(500).json({ error: "Database error." });
  }
});

// ✅ API to fetch categories
app.get("/categories", async (req, res) => {
  try {
    const [results] = await db.query("SELECT * FROM category");
    res.json(results);
  } catch (err) {
    console.error("Error fetching categories:", err);
    res.status(500).send("Error fetching categories.");
  }
});

// ✅ API to fetch items by category ID
app.get("/items/:category_id", async (req, res) => {
  try {
    const { category_id } = req.params;
    const [results] = await db.query("SELECT * FROM rates WHERE category_id = ?", [category_id]);
    res.json(results);
  } catch (err) {
    console.error(`Error fetching items for category ${category_id}:`, err);
    res.status(500).send("Error fetching items.");
  }
});

// ✅ API to save a quote
app.post("/save-quote", async (req, res) => {
  try {
    const { project_id, customer_name, additional_cost, total_cost, ...categoryCosts } = req.body;

    const categories = Object.keys(categoryCosts);
    const categoryValues = categories.map(cat => categoryCosts[cat] || 0);

    const query = `
      INSERT INTO quotesdata (project_id, customer_name, ${categories.join(", ")}, additional_cost, total_cost)
      VALUES (?, ?, ${categoryValues.map(() => "?").join(", ")}, ?, ?)
    `;

    await db.query(query, [project_id, customer_name, ...categoryValues, additional_cost, total_cost]);

    res.json({ message: "Quote saved successfully!" });
  } catch (error) {
    console.error("Error saving quote:", error);
    res.status(500).json({ error: "Database error." });
  }
});

// ✅ Fetch filtered quotes
app.get("/quotes", async (req, res) => {
  try {
    const { searchBy, value } = req.query;
    let query = "SELECT * FROM quotesdata";
    let params = [];

    if (searchBy && value) {
      if (searchBy === "customer_name") {
        query += " WHERE customer_name LIKE ?";
        params.push(`%${value}%`);
      } else if (searchBy === "quote_id") {
        query += " WHERE quote_id = ?";
        params.push(value);
      } else if (searchBy === "month") {
        query += " WHERE MONTH(date) = ?";
        params.push(value);
      }
    }

    const [results] = await db.query(query, params);
    res.json(results);
  } catch (error) {
    console.error("Error fetching quotes:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ View PDF
app.get("/view-pdf/:quoteId", async (req, res) => {
  try {
    const quoteId = req.params.quoteId;
    const [result] = await db.query("SELECT pdf FROM quotesdata WHERE quote_id = ?", [quoteId]);

    if (result.length > 0 && result[0].pdf) {
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", 'inline; filename="quote.pdf"'); // View in browser
      res.send(result[0].pdf);
    } else {
      res.status(404).send("PDF not found");
    }
  } catch (error) {
    console.error("Error fetching PDF:", error);
    res.status(500).send("Server Error");
  }
});

// ✅ Download PDF
app.get("/download-pdf/:quoteId", async (req, res) => {
  try {
    const quoteId = req.params.quoteId;
    const [result] = await db.query("SELECT pdf FROM quotesdata WHERE quote_id = ?", [quoteId]);

    if (result.length > 0 && result[0].pdf) {
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", 'attachment; filename="quote.pdf"'); // Force download
      res.send(result[0].pdf);
    } else {
      res.status(404).send("PDF not found");
    }
  } catch (error) {
    console.error("Error fetching PDF:", error);
    res.status(500).send("Server Error");
  }
});

// ✅ Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
