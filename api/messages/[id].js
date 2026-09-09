import { connectDB, applyCors } from '../db.js';
import { requireAuth } from '../middleware/auth.js';
import Message from '../models/Message.js';

export default async function handler(req, res) {
  if (applyCors(req, res)) return;
  await connectDB();
  const user = requireAuth(req, res);
  if (!user) return;
  const { id } = req.query;

  if (req.method === 'PUT') {
    const updated = await Message.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Message not found' });
    return res.status(200).json(updated);
  }

  if (req.method === 'DELETE') {
    const deleted = await Message.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: 'Message not found' });
    return res.status(200).json({ ok: true });
  }

  res.status(405).json({ error: 'Method not allowed' });
}
