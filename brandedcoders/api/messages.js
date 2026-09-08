import { connectDB, applyCors } from './db.js';
import { requireAuth } from './middleware/auth.js';
import Message from './models/Message.js';

export default async function handler(req, res) {
  if (applyCors(req, res)) return;
  await connectDB();

  if (req.method === 'POST') {
    const { name, email, message } = req.body || {};
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email and message are required' });
    }
    const saved = await Message.create(req.body);
    return res.status(201).json({ ok: true, id: saved._id });
  }

  if (req.method === 'GET') {
    const user = requireAuth(req, res);
    if (!user) return;
    const messages = await Message.find().sort({ createdAt: -1 });
    return res.status(200).json(messages);
  }

  res.status(405).json({ error: 'Method not allowed' });
}
