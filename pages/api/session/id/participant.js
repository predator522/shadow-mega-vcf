import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'POST') {
    try {
      const { name, number } = req.body;
      await sql`
        INSERT INTO participants (session_id, name, number)
        VALUES (${id}, ${name}, ${number});
      `;
      res.status(200).json({ success: true });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
