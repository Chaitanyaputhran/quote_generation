import { connectToDB } from "../../../lib/db";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { category_id } = req.query; // ✅ Corrected extraction

  if (!category_id) {
    return res.status(400).json({ error: "Category ID is required." });
  }

  try {
    const connection = await connectToDB();
    const [results] = await connection.query(
      "SELECT * FROM rates WHERE category_id = ?", 
      [category_id]
    );
    await connection.end(); // Close DB connection

    if (results.length === 0) {
      return res.status(404).json({ error: "No items found for this category." });
    }

    res.status(200).json(results);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
