import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, phone, message } = req.body;

    // Validate required fields
    if (!name || !email || !phone || !message) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    // Insert into database
    // Make sure you have created the ContactSubmissions table in your Vercel Postgres dashboard
    await sql`
      INSERT INTO ContactSubmissions (name, email, phone, message)
      VALUES (${name}, ${email}, ${phone}, ${message});
    `;

    return res.status(200).json({ success: true, message: 'Message sent successfully!' });
  } catch (error) {
    console.error('Error saving contact form submission:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
}
