import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { owner, maxParticipants, expiry, groupLink } = req.body;
      const result = await sql`
        INSERT INTO sessions (owner, max_participants, expiry, group_link, downloaded)
        VALUES (${owner}, ${maxParticipants}, ${expiry}, ${groupLink}, false)
        RETURNING id;
      `;
      res.status(200).json({ sessionID: result.rows[0].id });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
