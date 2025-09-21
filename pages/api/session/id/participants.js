import { db } from '@vercel/postgres';

export default async function handler(req, res) {
  const client = await db.connect();
  const { id } = req.query;

  try {
    const result = await client.query(
      `SELECT * FROM participants WHERE session_id = $1`,
      [id]
    );

    return res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to fetch participants' });
  } finally {
    client.release();
  }
}
