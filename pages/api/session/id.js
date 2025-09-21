import { db } from '@vercel/postgres';

export default async function handler(req, res) {
  const client = await db.connect();
  const { id } = req.query;

  try {
    const result = await client.query(
      `SELECT * FROM sessions WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Session not found' });
    }

    return res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to fetch session' });
  } finally {
    client.release();
  }
}
