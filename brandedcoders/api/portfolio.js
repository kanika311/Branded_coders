import { connectDB, applyCors } from './db.js';
import { requireAuth } from './middleware/auth.js';
import Portfolio from './models/Portfolio.js';

export default async function handler(req, res) {
  if (applyCors(req, res)) return;
  await connectDB();

  if (req.method === 'GET') {
    const items = await Portfolio.find({ published: true }).sort({ order: 1, createdAt: -1 });
    return res.status(200).json(items);
  }

  if (req.method === 'POST') {
    const user = requireAuth(req, res);
    if (!user) return;
    try {
      const item = await Portfolio.create(req.body);
      return res.status(201).json(item);
    } catch (err) {
      return res.status(400).json({ error: 'Could not create project', detail: err.message });
    }
  }

  res.status(405).json({ error: 'Method not allowed' });
}
