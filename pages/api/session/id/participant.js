import { db } from '@vercel/postgres';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const client = await db.connect();
  const { id } = req.query;
  const { name, number } = req.body;

  try {
    const result = await client.query(
      `INSERT INTO participants (session_id, name, number)
       VALUES ($1, $2, $3)
       RETURNING id`,
      [id, name, number]
    );

    return res.status(200).json({ participantId: result.rows[0].id });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to add participant' });
  } finally {
    client.release();
  }
}
