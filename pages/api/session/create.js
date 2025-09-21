import { db } from '@vercel/postgres';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const client = await db.connect();
  const { owner, maxParticipants, expiry, groupLink } = req.body;

  try {
    const result = await client.query(
      `INSERT INTO sessions (owner, max_participants, expiry, group_link)
       VALUES ($1, $2, $3, $4)
       RETURNING id`,
      [owner, maxParticipants, expiry, groupLink]
    );

    return res.status(200).json({ id: result.rows[0].id });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to create session' });
  } finally {
    client.release();
  }
}
