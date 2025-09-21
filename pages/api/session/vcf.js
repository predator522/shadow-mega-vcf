import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const participants = await sql`SELECT * FROM participants WHERE session_id = ${id};`;
      if (participants.rows.length === 0) {
        return res.status(404).json({ error: 'No participants found' });
      }

      let vCardAll = '';
      participants.rows.forEach(p => {
        vCardAll += `BEGIN:VCARD
VERSION:3.0
FN:${p.name}
TEL;TYPE=CELL:${p.number}
NOTE: Saved from session ${id}
END:VCARD
`;
      });

      res.setHeader('Content-Type', 'text/vcard');
      res.setHeader('Content-Disposition', `attachment; filename="session-${id}.vcf"`);
      res.status(200).send(vCardAll);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
