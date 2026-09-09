import { connectDB, applyCors } from './db.js';
import { requireAuth } from './middleware/auth.js';
import Service from './models/Service.js';

export default async function handler(req, res) {
  if (applyCors(req, res)) return;
  await connectDB();

  if (req.method === 'GET') {
    const services = await Service.find({ published: true }).sort({ order: 1, createdAt: 1 });
    return res.status(200).json(services);
  }

  if (req.method === 'POST') {
    const user = requireAuth(req, res);
    if (!user) return;
    try {
      const service = await Service.create(req.body);
      return res.status(201).json(service);
    } catch (err) {
      return res.status(400).json({ error: 'Could not create service', detail: err.message });
    }
  }

  res.status(405).json({ error: 'Method not allowed' });
}
