import { connectToDB } from "../../lib/db";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();

  const db = await connectToDB();
  const [categories] = await db.execute("SELECT * FROM category");
  res.status(200).json(categories);
}
